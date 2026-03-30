
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, ClipboardCheck, Globe, MapPin, Building, Clock, RefreshCw, LocateFixed } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

// Updated type to match freeipapi.com response
type IpData = {
    ipAddress: string;
    cityName: string;
    regionName: string;
    countryName: string;
    countryCode: string;
    timeZone: string;
    latitude: number;
    longitude: number;
    continent: string;
};

// Helper function to convert a country code to a flag emoji
const countryCodeToEmoji = (countryCode: string) => {
    if (!countryCode || countryCode.length !== 2) return '🌍';
    const codePoints = [...countryCode.toUpperCase()].map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};

export function IpLookupForm() {
    const [ipData, setIpData] = useState<IpData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCopied, setIsCopied] = useState(false);
    const { toast } = useToast();

    const fetchIp = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://freeipapi.com/api/json`);
            if (!response.ok) {
                throw new Error('Failed to fetch IP information.');
            }
            const data = await response.json();
            if (data.error) {
                throw new Error(data.reason || 'The API returned an error.');
            }
            setIpData(data);
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchIp();
    }, [fetchIp]);

    const handleCopy = () => {
        if (!ipData?.ipAddress) return;
        navigator.clipboard.writeText(ipData.ipAddress).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
            toast({ title: 'IP Address copied to clipboard!' });
        }).catch(err => {
            toast({ variant: 'destructive', title: 'Failed to copy' });
        });
    };

    const InfoCard = ({ icon: Icon, title, value }: { icon: React.FC<any>, title: string, value: string | undefined }) => (
        <Card className="bg-white/20 border-white/30 backdrop-blur-lg text-white p-4 text-center transform hover:scale-105 transition-transform duration-300">
            <Icon className="w-10 h-10 mx-auto mb-3 text-pink-200" />
            <p className="text-sm opacity-80">{title}</p>
            <p className="font-bold text-lg truncate">{value || 'N/A'}</p>
        </Card>
    );

    return (
        <div className="relative min-h-screen w-full p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden">
            <motion.div 
                key="ip-lookup-bg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 -z-10"
            />
            
            <div className="w-full max-w-4xl space-y-8">
                <div className="text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg flex items-center justify-center gap-3">
                       <LocateFixed className="w-10 h-10"/> IP Address Lookup
                    </h1>
                    <p className="mt-2 text-lg opacity-90">Find detailed geolocation information about your public IP address.</p>
                </div>

                <AnimatePresence>
                {isLoading ? (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center py-10">
                        <Loader2 className="w-16 h-16 text-white animate-spin" />
                    </motion.div>
                ) : ipData ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <Card className="bg-white/20 backdrop-blur-lg border-white/30 text-white shadow-2xl">
                            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex-1 text-center md:text-left">
                                    <p className="text-sm opacity-80">Your Public IP Address</p>
                                    <p className="font-mono text-3xl md:text-4xl font-bold break-all">{ipData.ipAddress}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" onClick={handleCopy} className="bg-white/30 border-white/40 text-white hover:bg-white/50">
                                      {isCopied ? <ClipboardCheck className="mr-2"/> : <Copy className="mr-2"/>}
                                      Copy IP
                                  </Button>
                                   <Button variant="outline" onClick={() => fetchIp()} className="bg-white/30 border-white/40 text-white hover:bg-white/50">
                                      <RefreshCw className="mr-2"/>
                                      Refresh
                                  </Button>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                            <InfoCard icon={Globe} title="Country" value={`${countryCodeToEmoji(ipData.countryCode)} ${ipData.countryName}`} />
                            <InfoCard icon={MapPin} title="Region" value={ipData.regionName} />
                            <InfoCard icon={Building} title="City" value={ipData.cityName} />
                            <InfoCard icon={Clock} title="Timezone" value={ipData.timeZone} />
                            <InfoCard icon={LocateFixed} title="Coordinates" value={`${ipData.latitude.toFixed(4)}, ${ipData.longitude.toFixed(4)}`} />
                            <InfoCard icon={Globe} title="Continent" value={ipData.continent} />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white">
                        <p className="text-lg">Could not load IP information. Please try refreshing the page.</p>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    );
}

