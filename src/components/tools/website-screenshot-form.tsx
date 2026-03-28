
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Camera, Download, Trash2, Monitor, Tablet, Smartphone } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


type Device = 'desktop' | 'tablet' | 'mobile';

const resolutions: Record<Device, { width: number, height: number, label: string, icon: React.FC<any> }> = {
    desktop: { width: 1920, height: 1080, label: "Desktop (1920x1080)", icon: Monitor },
    tablet: { width: 768, height: 1024, label: "Tablet (768x1024)", icon: Tablet },
    mobile: { width: 375, height: 812, label: "Mobile (375x812)", icon: Smartphone },
};


export function WebsiteScreenshotForm() {
  const [url, setUrl] = useState('');
  const [device, setDevice] = useState<Device>('desktop');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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
    setImageUrl(null);

    // Use a public screenshot API
    const { width, height } = resolutions[device];
    const apiUrl = `https://api.screenshotone.com/take?access_key=YOUR_ACCESS_KEY&url=${encodeURIComponent(validUrl)}&viewport_width=${width}&viewport_height=${height}&full_page=true`;
    
    // In a real app, you'd replace YOUR_ACCESS_KEY with a key from a service like ScreenshotOne, ApiFlash, etc.
    // For this example, we will use a placeholder service that may not work without a valid key.
    // As a fallback, we'll use a placeholder image.
    
    try {
        // This fetch will likely fail without a real API key.
        // const response = await fetch(apiUrl);
        // if (!response.ok) {
        //     throw new Error('Screenshot API failed.');
        // }
        // const imageBlob = await response.blob();
        // setImageUrl(URL.createObjectURL(imageBlob));

        // Placeholder logic since we don't have a live API key
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        const placeholderImageUrl = `https://picsum.photos/seed/${encodeURIComponent(validUrl)}/${width}/${height}`;
        setImageUrl(placeholderImageUrl);
        toast({
            title: "Screenshot Captured (Placeholder)",
            description: "Using a placeholder image as API key is not configured.",
        });

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An unexpected error occurred",
        description:
          "Failed to capture screenshot. The service may be down.",
      });
    } finally {
       setIsLoading(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setImageUrl(null);
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
            {imageUrl && (
              <>
                <a href={imageUrl} download="screenshot.png">
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
            {!isLoading && imageUrl ? (
                <Image src={imageUrl} alt="Website screenshot" width={1200} height={675} className="max-w-full h-auto object-contain rounded-md" />
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
