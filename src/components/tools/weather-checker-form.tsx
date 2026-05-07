"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, Thermometer, CloudFog, CloudLightning } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type GeocodingResult = {
    name: string;
    latitude: number;
    longitude: number;
    country: string;
};

type ForecastData = {
    current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        apparent_temperature: number;
        weather_code: number;
        wind_speed_10m: number;
    };
    daily: {
        time: string[];
        weather_code: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
    };
};

type CombinedWeatherData = {
    name: string;
    country: string;
    current: {
        temp: number;
        feelsLike: number;
        humidity: number;
        windSpeed: number;
        description: string;
    };
    forecast: {
        date: string;
        avgTemp: number;
        description: string;
    }[];
};

const weatherCodeToDescription = (code: number): string => {
    const descriptions: Record<number, string> = {
        0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Depositing rime fog',
        51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
        56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
        61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
        66: 'Light freezing rain', 67: 'Heavy freezing rain',
        71: 'Slight snow fall', 73: 'Moderate snow fall', 75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
        85: 'Slight snow showers', 86: 'Heavy snow showers',
        95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail',
    };
    return descriptions[code] || 'Unknown';
};


const getWeatherProperties = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('sunny') || desc.includes('clear')) {
        return { 
            Icon: () => <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}><Sun className="w-20 h-20 md:w-24 md:h-24 text-yellow-400 drop-shadow-lg" /></motion.div>, 
            gradient: "from-blue-500/10 to-purple-500/10" 
        };
    }
    if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower')) {
        return { 
            Icon: () => <motion.div animate={{ x: [0, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}><CloudRain className="w-20 h-20 md:w-24 md:h-24 text-blue-300 drop-shadow-lg" /></motion.div>, 
            gradient: "from-blue-600/10 to-slate-900/10"
        };
    }
     if (desc.includes('snow') || desc.includes('sleet') || desc.includes('blizzard') || desc.includes('ice')) {
        return { 
            Icon: () => <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}><CloudSnow className="w-20 h-20 md:w-24 md:h-24 text-white drop-shadow-lg" /></motion.div>, 
            gradient: "from-sky-500/10 to-slate-900/10" 
        };
    }
    if (desc.includes('thunder')) {
        return { 
            Icon: () => <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}><CloudLightning className="w-20 h-20 md:w-24 md:h-24 text-yellow-300 drop-shadow-lg" /></motion.div>, 
            gradient: "from-purple-500/10 to-slate-900/10" 
        };
    }
    if (desc.includes('fog') || desc.includes('mist')) {
         return { 
            Icon: () => <motion.div animate={{ opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 3 }}><CloudFog className="w-20 h-20 md:w-24 md:h-24 text-gray-400 drop-shadow-lg" /></motion.div>, 
            gradient: "from-slate-500/10 to-slate-900/10" 
        };
    }
    // Default to cloudy
    return { 
        Icon: () => <motion.div animate={{ x: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 5 }}><Cloud className="w-20 h-20 md:w-24 md:h-24 text-gray-300 drop-shadow-lg" /></motion.div>, 
        gradient: "from-blue-500/10 to-slate-900/10" 
    };
};

const ForecastIcon = ({ description }: { description: string }) => {
    const desc = description.toLowerCase();
    if (desc.includes('sunny') || desc.includes('clear')) return <Sun className="w-8 h-8 text-yellow-400" />;
    if (desc.includes('rain') || desc.includes('drizzle')) return <CloudRain className="w-8 h-8 text-blue-400" />;
    if (desc.includes('snow') || desc.includes('sleet')) return <CloudSnow className="w-8 h-8 text-white" />;
    if (desc.includes('thunder')) return <CloudLightning className="w-8 h-8 text-yellow-300" />;
    return <Cloud className="w-8 h-8 text-gray-300" />;
}


export function WeatherCheckerForm() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState<CombinedWeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const fetchWeather = async (cityQuery: string) => {
        setIsLoading(true);
        setWeather(null);
        try {
             // Step 1: Geocoding
            const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityQuery)}&count=1`);
            if (!geoResponse.ok) throw new Error('Could not fetch location data.');
            const geoData = await geoResponse.json();
            if (!geoData.results || geoData.results.length === 0) {
                throw new Error(`Could not find a location for "${cityQuery}". Please be more specific.`);
            }
            const location: GeocodingResult = geoData.results[0];

            // Step 2: Weather Forecast
            const forecastResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`);
            if (!forecastResponse.ok) throw new Error('Could not fetch weather data.');
            const forecastData: ForecastData = await forecastResponse.json();

             // Step 3: Combine and set state
            const combinedData: CombinedWeatherData = {
                name: location.name,
                country: location.country,
                current: {
                    temp: Math.round(forecastData.current.temperature_2m),
                    feelsLike: Math.round(forecastData.current.apparent_temperature),
                    humidity: forecastData.current.relative_humidity_2m,
                    windSpeed: Math.round(forecastData.current.wind_speed_10m),
                    description: weatherCodeToDescription(forecastData.current.weather_code),
                },
                forecast: forecastData.daily.time.map((date, index) => ({
                    date,
                    avgTemp: Math.round((forecastData.daily.temperature_2m_max[index] + forecastData.daily.temperature_2m_min[index]) / 2),
                    description: weatherCodeToDescription(forecastData.daily.weather_code[index]),
                })),
            };
            
            setWeather(combinedData);

        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather('Larkana');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = () => {
        if (!city.trim()) {
            toast({ variant: "destructive", title: "City name cannot be empty." });
            return;
        }
        fetchWeather(city.trim());
    };

    const { Icon, gradient } = useMemo(() => {
        if (weather?.current?.description) {
            return getWeatherProperties(weather.current.description);
        }
        return getWeatherProperties('cloudy');
    }, [weather]);

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center">
            <motion.div 
                key={gradient}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className={`absolute inset-0 bg-gradient-to-br ${gradient} -z-10`}
            />

            {/* Search Bar */}
            <div className="w-full max-w-md mb-8">
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                        id="city-input"
                        placeholder="e.g., London, New York..."
                        className="w-full bg-white/5 border-slate-700 placeholder:text-slate-500 text-white focus-visible:ring-blue-500/50 h-12 text-base"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        aria-label="City name"
                    />
                    <Button onClick={handleSearch} disabled={isLoading} size="lg" className="w-full sm:w-auto h-12">
                        {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
                        <span className="sm:hidden ml-2">Search</span>
                    </Button>
                </div>
                 <p className="text-xs text-slate-500 text-center mt-2 px-4 uppercase tracking-widest font-bold">Search live weather globally</p>
            </div>
            
            <AnimatePresence mode="wait">
            {isLoading && !weather ? (
                <div className="flex justify-center items-center h-96">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                </div>
            ) : weather ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full max-w-4xl space-y-6"
                >
                    {/* Main Weather Card */}
                    <Card className="bg-[#1E293B] border-white/10 rounded-[20px] p-0 shadow-2xl overflow-hidden">
                        <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left space-y-2">
                                <div className="space-y-0.5">
                                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{weather.name}</h1>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{weather.country}</p>
                                </div>
                                <p className="text-7xl md:text-8xl font-black text-white my-4 tabular-nums">{weather.current.temp}°C</p>
                                <div className="pt-2">
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold uppercase tracking-wider border border-blue-500/20">
                                        {weather.current.description}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <Icon />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Feels Like', value: `${weather.current.feelsLike}°C`, icon: Thermometer, color: 'text-orange-400' },
                            { label: 'Humidity', value: `${weather.current.humidity}%`, icon: Droplets, color: 'text-blue-400' },
                            { label: 'Wind Speed', value: `${weather.current.windSpeed} km/h`, icon: Wind, color: 'text-emerald-400' },
                        ].map((stat) => (
                            <Card key={stat.label} className="bg-white/5 border-white/5 backdrop-blur-md rounded-2xl p-6 transition-all hover:bg-white/10">
                                <div className="flex items-center gap-4">
                                    <div className={cn("p-2 rounded-lg bg-white/5", stat.color)}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                        <p className="text-xl font-bold text-white tabular-nums">{stat.value}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                    
                    {/* 3-Day Forecast */}
                    <Card className="bg-[#1E293B] border-white/5 rounded-[20px] overflow-hidden">
                        <CardContent className="p-8">
                            <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-6 text-center md:text-left">3-Day Forecast</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {weather.forecast.map((day, index) => (
                                    <div key={day.date} className="bg-white/5 p-5 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">{index === 0 ? 'Today' : format(new Date(day.date), 'EEEE')}</p>
                                            <p className="text-2xl font-black text-white tabular-nums">{day.avgTemp}°C</p>
                                        </div>
                                        <div className="p-2 bg-white/5 rounded-xl">
                                            <ForecastIcon description={day.description} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
             ) : null}
            </AnimatePresence>
        </div>
    );
}
