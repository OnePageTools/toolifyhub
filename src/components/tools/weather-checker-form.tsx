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
            const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityQuery)}&count=1`);
            if (!geoResponse.ok) throw new Error('Could not fetch location data.');
            const geoData = await geoResponse.json();
            if (!geoData.results || geoData.results.length === 0) {
                throw new Error(`Could not find a location for "${cityQuery}". Please be more specific.`);
            }
            const location: GeocodingResult = geoData.results[0];

            const forecastResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`);
            if (!forecastResponse.ok) throw new Error('Could not fetch weather data.');
            const forecastData: ForecastData = await forecastResponse.json();

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
        fetchWeather('London');
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
        <div className="relative w-full flex flex-col items-center">
            <div className="w-full max-w-md mb-10">
                <div className="flex gap-2 p-1.5 bg-card border rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <Input
                        id="city-input"
                        placeholder="Search city (e.g. New York)"
                        className="border-0 shadow-none focus-visible:ring-0 text-foreground text-base h-11"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={isLoading} className="rounded-lg h-11 px-6">
                        {isLoading ? <Loader2 className="animate-spin" /> : <Search className="w-4 h-4" />}
                    </Button>
                </div>
            </div>
            
            <AnimatePresence mode="wait">
            {isLoading && !weather ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            ) : weather ? (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="w-full space-y-6"
                >
                    <Card className="p-0 shadow-xl overflow-hidden border-border bg-card">
                        <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left space-y-2">
                                <div className="space-y-1">
                                    <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">{weather.name}</h2>
                                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">{weather.country}</p>
                                </div>
                                <p className="text-7xl md:text-8xl font-black text-foreground my-4 tabular-nums">{weather.current.temp}°C</p>
                                <div className="pt-2">
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-wider border border-blue-500/20">
                                        {weather.current.description}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <Icon />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Feels Like', value: `${weather.current.feelsLike}°C`, icon: Thermometer, color: 'text-orange-500' },
                            { label: 'Humidity', value: `${weather.current.humidity}%`, icon: Droplets, color: 'text-blue-500' },
                            { label: 'Wind Speed', value: `${weather.current.windSpeed} km/h`, icon: Wind, color: 'text-emerald-500' },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white/[0.05] dark:bg-white/5 border rounded-xl p-5 flex items-center gap-4 transition-all">
                                <div className={cn("p-2.5 rounded-lg bg-card border shadow-sm", stat.color)}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-lg font-bold text-foreground tabular-nums">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <Card className="bg-secondary/20 border-border shadow-none">
                        <CardContent className="p-8">
                            <h2 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 text-center md:text-left">3-Day Forecast</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {weather.forecast.map((day, index) => (
                                    <div key={day.date} className="bg-card p-5 rounded-xl border border-border flex items-center justify-between gap-4 shadow-sm">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{index === 0 ? 'Today' : format(new Date(day.date), 'EEEE')}</p>
                                            <p className="text-xl font-bold text-foreground tabular-nums">{day.avgTemp}°C</p>
                                        </div>
                                        <div className="p-2 bg-secondary/50 rounded-lg">
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
