"use client";

import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Share2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function QrCodeGeneratorForm() {
  const [value, setValue] = useState('https://ToolifyHub.com');
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [isShareSupported, setIsShareSupported] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // This check runs only on the client, after the component has mounted.
    if (navigator.share) {
      setIsShareSupported(true);
    }
  }, []);

  const downloadQRCode = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        const pngUrl = canvas
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream');
        let downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'qrcode.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    }
  };
  
  const shareQRCode = async () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas && navigator.share) {
         canvas.toBlob(async (blob) => {
            if(blob) {
                try {
                    await navigator.share({
                        files: [new File([blob], 'qrcode.png', { type: 'image/png' })],
                        title: 'QR Code',
                        text: 'Check out this QR Code I made!'
                    })
                } catch(err) {
                    console.error('Share failed:', err)
                }
            }
         })
      } else {
        alert('Web Share API is not supported in your browser.');
      }
    }
  }


  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="qr-text">Text or URL</Label>
          <Input
            id="qr-text"
            type="text"
            placeholder="Enter text or URL"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className='grid w-full items-center gap-1.5'>
                <Label htmlFor='qr-size'>Size</Label>
                <Select onValueChange={(v) => setSize(Number(v))} defaultValue={size.toString()}>
                    <SelectTrigger>
                        <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="128">128x128</SelectItem>
                        <SelectItem value="256">256x256</SelectItem>
                        <SelectItem value="512">512x512</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className='grid w-full items-center gap-1.5'>
                <Label htmlFor='qr-level'>Error Correction</Label>
                 <Select onValueChange={(v: 'L' | 'M' | 'Q' | 'H') => setLevel(v)} defaultValue={level}>
                    <SelectTrigger>
                        <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="L">Low</SelectItem>
                        <SelectItem value="M">Medium</SelectItem>
                        <SelectItem value="Q">Quartile</SelectItem>
                        <SelectItem value="H">High</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={downloadQRCode} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Download PNG
          </Button>
          {isShareSupported &&
            <Button onClick={shareQRCode} variant="outline" className="w-full">
                <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          }
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Card className="p-6 inline-block bg-white shadow-lg rounded-xl">
          <div ref={qrRef}>
            <QRCode
              value={value}
              size={size}
              bgColor={'#ffffff'}
              fgColor={'#000000'}
              level={level}
              includeMargin={true}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
