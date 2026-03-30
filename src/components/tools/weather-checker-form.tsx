"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, Thermometer, CloudFog, CloudLightning } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

type WeatherData = {
  current_condition: {
    FeelsLikeC: string;
    humidity: string;
    temp_C: string;
    weatherDesc: { value: string }[];
    weatherCode: string;
    windspeedKmph: string;
  }[];
  nearest_area: {
    areaName: { value: string }[];
    country: { value: string }[];
  }[];
  weather: {
    date: string;
    maxtempC: string;
    mintempC: string;
    avgtempC: string;
    hourly: {
        weatherCode: string;
        weatherDesc: { value: string }[];
    }[];
  }[];
};

const getWeatherProperties = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('sunny') || desc.includes('clear')) {
        return { 
            Icon: () => <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}><Sun className="w-24 h-24 text-yellow-400 drop-shadow-lg" /></motion.div>, 
            gradient: "from-yellow-300 via-orange-400 to-pink-500" 
        };
    }
    if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower')) {
        return { 
            Icon: () => <motion.div animate={{ x: [0, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}><CloudRain className="w-24 h-24 text-blue-300 drop-shadow-lg" /></motion.div>, 
            gradient: "from-slate-400 via-gray-500 to-blue-600"
        };
    }
     if (desc.includes('snow') || desc.includes('sleet') || desc.includes('blizzard') || desc.includes('ice')) {
        return { 
            Icon: () => <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}><CloudSnow className="w-24 h-24 text-white drop-shadow-lg" /></motion.div>, 
            gradient: "from-sky-300 via-slate-300 to-white" 
        };
    }
    if (desc.includes('thunder')) {
        return { 
            Icon: () => <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}><CloudLightning className="w-24 h-24 text-yellow-300 drop-shadow-lg" /></motion.div>, 
            gradient: "from-slate-800 via-purple-900 to-slate-700" 
        };
    }
    if (desc.includes('fog') || desc.includes('mist')) {
         return { 
            Icon: () => <motion.div animate={{ opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 3 }}><CloudFog className="w-24 h-24 text-gray-400 drop-shadow-lg" /></motion.div>, 
            gradient: "from-slate-400 via-gray-500 to-slate-600" 
        };
    }
    // Default to cloudy
    return { 
        Icon: () => <motion.div animate={{ x: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 5 }}><Cloud className="w-24 h-24 text-gray-300 drop-shadow-lg" /></motion.div>, 
        gradient: "from-sky-400 via-gray-400 to-slate-500" 
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
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const fetchWeather = async (cityQuery: string) => {
        setIsLoading(true);
        setWeather(null);
        try {
            const response = await fetch(`https://wttr.in/${encodeURIComponent(cityQuery)}?format=j1`);
            if (!response.ok) throw new Error('City not found or API error.');
            const data = await response.json();
            setWeather(data);
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Fetch weather for a default city on initial load
        fetchWeather('New York');
    }, []);

    const handleSearch = () => {
        if (!city.trim()) {
            toast({ variant: "destructive", title: "City name cannot be empty." });
            return;
        }
        fetchWeather(city);
    };

    const { Icon, gradient } = useMemo(() => {
        if (weather?.current_condition[0]?.weatherDesc[0]?.value) {
            return getWeatherProperties(weather.current_condition[0].weatherDesc[0].value);
        }
        return getWeatherProperties('cloudy');
    }, [weather]);

    return (
        <div className="relative min-h-screen w-full p-4 md:p-8 flex flex-col items-center overflow-hidden">
            <motion.div 
                key={gradient}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className={`absolute inset-0 bg-gradient-to-br ${gradient} -z-10`}
            />

            {/* Search Bar */}
            <div className="w-full max-w-md mb-8">
                <div className="flex gap-2 backdrop-blur-sm bg-white/20 dark:bg-black/20 p-2 rounded-full shadow-lg">
                    <Input
                        id="city-input"
                        placeholder="Search for a city..."
                        className="bg-transparent border-0 focus-visible:ring-0 text-white placeholder:text-gray-200"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={isLoading} variant="ghost" size="icon" className="rounded-full bg-white/30 hover:bg-white/50 dark:bg-black/40 dark:hover:bg-black/60 text-white">
                        {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
                    </Button>
                </div>
            </div>
            
            <AnimatePresence>
            {weather ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full max-w-4xl space-y-8"
                >
                    {/* Main Weather Card */}
                    <Card className="bg-white/20 dark:bg-black/20 backdrop-blur-lg border-white/30 text-white shadow-2xl">
                        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl md:text-4xl font-bold">{weather.nearest_area[0].areaName[0].value}, {weather.nearest_area[0].country[0].value}</h1>
                                <p className="capitalize text-lg">{weather.current_condition[0].weatherDesc[0].value}</p>
                                <p className="text-7xl md:text-8xl font-bold my-4 drop-shadow-xl">{weather.current_condition[0].temp_C}°C</p>
                            </div>
                            <div className="flex flex-col items-center gap-6">
                                <Icon />
                                <div className="grid grid-cols-3 gap-x-6 text-center text-sm">
                                    <div className="flex flex-col items-center gap-1">
                                        <Thermometer />
                                        <span>Feels like</span>
                                        <span className="font-bold">{weather.current_condition[0].FeelsLikeC}°</span>
                                    </div>
                                     <div className="flex flex-col items-center gap-1">
                                        <Droplets />
                                        <span>Humidity</span>
                                        <span className="font-bold">{weather.current_condition[0].humidity}%</span>
                                    </div>
                                     <div className="flex flex-col items-center gap-1">
                                        <Wind />
                                        <span>Wind</span>
                                        <span className="font-bold">{weather.current_condition[0].windspeedKmph} km/h</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* 3-Day Forecast */}
                    <Card className="bg-white/20 dark:bg-black/20 backdrop-blur-lg border-white/30 text-white shadow-xl">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-semibold mb-4">3-Day Forecast</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                {weather.weather.map((day, index) => (
                                    <div key={day.date} className="bg-white/10 p-4 rounded-lg flex items-center justify-between">
                                        <div>
                                            <p className="font-bold">{index === 0 ? 'Today' : format(new Date(day.date), 'EEE')}</p>
                                            <p className="text-2xl font-bold">{day.avgtempC}°C</p>
                                        </div>
                                        <ForecastIcon description={day.hourly[4].weatherDesc[0].value} />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
             ) : (
                <div className="flex justify-center items-center h-96">
                    {isLoading && <Loader2 className="w-16 h-16 animate-spin text-white" />}
                </div>
             )}
            </AnimatePresence>
        </div>
    );
}
