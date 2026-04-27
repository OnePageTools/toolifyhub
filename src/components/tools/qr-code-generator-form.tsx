
"use client";

import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Share2, Palette } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function QrCodeGeneratorForm() {
  const [value, setValue] = useState('https://ToolifyHub.com');
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState('#000000');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [isShareSupported, setIsShareSupported] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div className="space-y-6">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="qr-text">Text or URL</Label>
          <Input
            id="qr-text"
            type="text"
            placeholder="Enter text or URL"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full text-base"
            aria-label='Text or URL for QR Code'
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className='grid w-full items-center gap-1.5'>
                <Label htmlFor='qr-size'>Size</Label>
                <Select onValueChange={(v) => setSize(Number(v))} defaultValue={size.toString()}>
                    <SelectTrigger id='qr-size' aria-label='Select QR Code size'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="200">Small (200px)</SelectItem>
                        <SelectItem value="300">Medium (300px)</SelectItem>
                        <SelectItem value="400">Large (400px)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className='grid w-full items-center gap-1.5'>
                <Label htmlFor='qr-level'>Error Correction</Label>
                 <Select onValueChange={(v: 'L' | 'M' | 'Q' | 'H') => setLevel(v)} defaultValue={level}>
                    <SelectTrigger id='qr-level' aria-label='Select error correction level'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="L">Low</SelectItem>
                        <SelectItem value="M">Medium</SelectItem>
                        <SelectItem value="Q">Quartile</SelectItem>
                        <SelectItem value="H">High</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className='grid w-full items-center gap-1.5'>
              <Label htmlFor='qr-color' className="flex items-center gap-2">
                <Palette className="h-4 w-4" /> Color
              </Label>
              <Input
                  id="qr-color"
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-full h-10 p-1 cursor-pointer"
                  aria-label='QR Code Color'
              />
            </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={downloadQRCode} className="w-full h-12">
            <Download className="mr-2 h-4 w-4" /> Download PNG
          </Button>
          {isShareSupported &&
            <Button onClick={shareQRCode} variant="outline" className="w-full h-12">
                <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          }
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Card className="p-4 inline-block bg-white shadow-lg rounded-xl">
          <div ref={qrRef}>
            <QRCode
              value={value}
              size={size}
              bgColor={'#ffffff'}
              fgColor={fgColor}
              level={level}
              includeMargin={true}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
