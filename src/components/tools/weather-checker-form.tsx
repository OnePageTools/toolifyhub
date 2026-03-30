"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type WeatherData = {
  name: string;
  country: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
};

const WeatherIcon = ({ iconCode }: { iconCode: string }) => {
    if (iconCode.includes('01')) return <Sun className="w-16 h-16 text-yellow-500" />;
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) return <Cloud className="w-16 h-16 text-gray-500" />;
    if (iconCode.includes('09') || iconCode.includes('10')) return <CloudRain className="w-16 h-16 text-blue-500" />;
    if (iconCode.includes('13')) return <CloudSnow className="w-16 h-16 text-blue-300" />;
    return <Cloud className="w-16 h-16 text-gray-400" />;
};


export function WeatherCheckerForm() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSearch = async () => {
        if (!city.trim()) {
            toast({ variant: "destructive", title: "City name cannot be empty." });
            return;
        }
        setIsLoading(true);
        setWeather(null);
        try {
            const apiKey = 'bd5e378503939ddaee76f12ad7a97608';
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'City not found.');
            }

            const data = await response.json();

            setWeather({
                name: data.name,
                country: data.sys.country,
                temp: data.main.temp,
                feels_like: data.main.feels_like,
                humidity: data.main.humidity,
                wind_speed: data.wind.speed,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
            });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="city-input">City Name</Label>
                    <Input
                        id="city-input"
                        placeholder="e.g., London"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <Button onClick={handleSearch} disabled={isLoading} className="self-end">
                    {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
                </Button>
            </div>

            {weather && (
                <Card className="animate-in fade-in-50">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">{weather.name}, {weather.country}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col md:flex-row items-center justify-around text-center gap-6">
                            <div className="flex items-center gap-4">
                                <WeatherIcon iconCode={weather.icon} />
                                <div>
                                    <p className="text-6xl font-bold">{Math.round(weather.temp)}°C</p>
                                    <p className="text-muted-foreground capitalize">{weather.description}</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <p>Feels like: {Math.round(weather.feels_like)}°C</p>
                                <div className="flex items-center gap-2"><Droplets className="text-blue-400"/> Humidity: {weather.humidity}%</div>
                                <div className="flex items-center gap-2"><Wind className="text-gray-400"/> Wind: {weather.wind_speed.toFixed(1)} m/s</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
