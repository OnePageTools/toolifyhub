
"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Camera, Download, Trash2, Monitor, Tablet, Smartphone } from 'lucide-react';
import {
  captureWebsiteScreenshot,
  type CaptureWebsiteScreenshotOutput,
} from '@/ai/flows/website-screenshot-flow';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import html2canvas from 'html2canvas';


type Device = 'desktop' | 'tablet' | 'mobile';

const resolutions: Record<Device, { width: number, height: number, label: string, icon: React.FC<any> }> = {
    desktop: { width: 1920, height: 1080, label: "Desktop (1920x1080)", icon: Monitor },
    tablet: { width: 768, height: 1024, label: "Tablet (768x1024)", icon: Tablet },
    mobile: { width: 375, height: 812, label: "Mobile (375x812)", icon: Smartphone },
};


export function WebsiteScreenshotForm() {
  const [url, setUrl] = useState('');
  const [device, setDevice] = useState<Device>('desktop');
  const [result, setResult] = useState<CaptureWebsiteScreenshotOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!url.trim()) {
      toast({
        variant: "destructive",
        title: "URL is empty",
        description: "Please enter a website URL to capture.",
      });
      return;
    }
    
    let validUrl = url;
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
        validUrl = 'https://' + validUrl;
    }

    try {
        new URL(validUrl);
    } catch (_) {
         toast({
            variant: "destructive",
            title: "Invalid URL",
            description: "Please enter a valid URL (e.g., https://example.com).",
         });
         return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { width, height } = resolutions[device];
      // First, try the AI-powered screenshot
      const response = await captureWebsiteScreenshot({ url: validUrl, width, height });
      
      if (response.error || !response.imageDataUri) {
         toast({
            title: "AI Capture Failed",
            description: `${response.error || 'Trying client-side fallback.'}`,
            variant: "destructive"
        });
        // Fallback to client-side html2canvas if AI fails
        await captureWithHtml2Canvas(validUrl, width, height);
      } else {
        setResult(response);
      }

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An unexpected error occurred",
        description:
          "Failed to capture screenshot. Trying client-side fallback.",
      });
       await captureWithHtml2Canvas(validUrl, resolutions[device].width, resolutions[device].height);
    } finally {
      // setIsLoading(false) is handled within each capture method
    }
  };

  const captureWithHtml2Canvas = async (captureUrl: string, width: number, height: number) => {
    try {
        // We can't directly screenshot an external URL due to CORS.
        // We can try to proxy it, but for this tool, we'll inform the user.
        toast({
            variant: "destructive",
            title: "Client-side capture not supported for external URLs",
            description: "AI capture failed, and client-side capture cannot access external websites due to security policies."
        });
        setResult({ error: "Client-side fallback is not available for external URLs." });
    } catch (err) {
        console.error("html2canvas error:", err);
        setResult({ error: "The client-side screenshot attempt also failed."});
    } finally {
        setIsLoading(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setResult(null);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="url-input">Website URL</Label>
          <Input
            id="url-input"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
           <Label htmlFor="device-select">Device / Resolution</Label>
           <Select value={device} onValueChange={(v: Device) => setDevice(v)} disabled={isLoading}>
                <SelectTrigger id="device-select">
                    <SelectValue placeholder="Select device..." />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(resolutions).map(([key, value]) => {
                         const Icon = value.icon;
                         return (
                            <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    <span>{value.label}</span>
                                </div>
                            </SelectItem>
                        )
                    })}
                </SelectContent>
           </Select>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
         <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Capturing...
                </>
            ) : (
                <>
                <Camera className="mr-2 h-4 w-4" />
                Capture Screenshot
                </>
            )}
            </Button>
            {result?.imageDataUri && (
              <>
                <a href={result.imageDataUri} download="screenshot.png">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                </a>
                 <Button variant="ghost" onClick={handleClear}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear
                </Button>
              </>
            )}
      </div>

       <div className="mt-6 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 min-h-[400px]">
            {isLoading && <Loader2 className="w-10 h-10 animate-spin text-primary" />}
            {!isLoading && result?.imageDataUri ? (
                <Image src={result.imageDataUri} alt="Website screenshot" width={1200} height={675} className="max-w-full h-auto object-contain rounded-md" />
            ) : !isLoading && (
                 <div className="flex flex-col items-center justify-center text-muted-foreground text-center">
                    <Monitor className="w-16 h-16 mb-4" />
                    <p>Your captured screenshot will appear here.</p>
                 </div>
            )}
        </div>
    </div>
  );
}
