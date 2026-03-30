"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, ClipboardCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type IpData = {
    ip: string;
    city: string;
    region: string;
    country_name: string;
    org: string;
};

export function IpLookupForm() {
    const [ipData, setIpData] = useState<IpData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCopied, setIsCopied] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchIp = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`https://ipapi.co/json/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch IP information.');
                }
                const data = await response.json();
                setIpData(data);
            } catch (error: any) {
                toast({ variant: "destructive", title: "Error", description: error.message });
            } finally {
                setIsLoading(false);
            }
        };

        fetchIp();
    }, [toast]);

    const handleCopy = () => {
        if (!ipData?.ip) return;
        navigator.clipboard.writeText(ipData.ip).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
            toast({ title: 'IP Address copied to clipboard!' });
        }).catch(err => {
            toast({ variant: 'destructive', title: 'Failed to copy' });
        });
    };
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!ipData) {
        return <p className="text-center text-destructive">Could not load IP information. Please try refreshing the page.</p>;
    }

    return (
        <div className="space-y-4">
             <Card className="bg-secondary/50">
                <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1 text-center md:text-left">
                        <p className="text-sm text-muted-foreground">Your Public IP Address</p>
                        <p className="font-mono text-2xl font-bold text-primary">{ipData.ip}</p>
                    </div>
                    <Button variant="outline" onClick={handleCopy}>
                        {isCopied ? <ClipboardCheck className="mr-2"/> : <Copy className="mr-2"/>}
                        Copy IP
                    </Button>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
                <InfoCard title="Country" value={ipData.country_name} />
                <InfoCard title="Region" value={ipData.region} />
                <InfoCard title="City" value={ipData.city} />
                <InfoCard title="ISP" value={ipData.org} />
            </div>
        </div>
    );
}

const InfoCard = ({ title, value }: { title: string, value: string }) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-base text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-xl font-semibold">{value}</p>
        </CardContent>
    </Card>
);
