"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Download, Trash2, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function ImageCompressorForm() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast({
            variant: "destructive",
            title: "Invalid file type",
            description: "Please upload a JPG, PNG, or WEBP file.",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
            variant: "destructive",
            title: "File too large",
            description: "Please upload an image smaller than 10MB.",
        });
        return;
      }
      setOriginalFile(file);
      setOriginalSize(file.size);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalPreview(reader.result as string);
        setCompressedImage(null);
        setCompressedSize(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files?.[0]);
  };

  const onDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if(e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
        e.dataTransfer.clearData();
    }
  };

  const handleCompress = async () => {
    if (!originalFile || !originalPreview) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please upload an image first.",
      });
      return;
    }

    setIsLoading(true);
    setCompressedImage(null);
    setCompressedSize(0);

    const image = document.createElement('img');
    image.src = originalPreview;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(image, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedUrl = URL.createObjectURL(blob);
            setCompressedImage(compressedUrl);
            setCompressedSize(blob.size);
            toast({
              title: "Success!",
              description: `Image compressed by ${((1 - blob.size / originalSize) * 100).toFixed(0)}%`,
            });
          }
          setIsLoading(false);
        }, originalFile.type, quality);
      }
    };
  };

  const handleClear = () => {
    setOriginalFile(null);
    setOriginalPreview(null);
    setCompressedImage(null);
    setOriginalSize(0);
    setCompressedSize(0);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  const reductionPercentage = originalSize > 0 && compressedSize > 0 
    ? ((1 - compressedSize / originalSize) * 100).toFixed(0)
    : 0;

  return (
    <div className="space-y-6">
       <input id="image-upload" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
       <label
            htmlFor="image-upload"
            className={cn(
                "group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/50 bg-secondary/50 p-8 text-center transition-colors hover:bg-secondary",
                isDragging && "border-primary bg-primary/10",
                originalPreview && "p-0 border-0"
            )}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
             {originalPreview ? (
              <>
                <Image src={originalPreview} alt="Original image preview" width={400} height={400} className="max-h-80 w-auto object-contain rounded-md" />
                <Button variant="destructive" size="icon" onClick={(e) => { e.preventDefault(); handleClear()}} className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md">
                    <Trash2 className="h-4 w-4" />
                    <span className='sr-only'>Clear</span>
                </Button>
              </>
            ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 text-primary/80 transition-transform group-hover:scale-110" />
                    <span className="font-semibold text-primary">Click to upload or drag & drop</span>
                    <p className="text-xs">JPG, PNG, or WEBP (Max 10MB)</p>
                </div>
            )}
        </label>

        {originalFile && (
            <Card>
                <CardContent className="p-6 space-y-4">
                     <div className="grid gap-2">
                        <Label htmlFor="quality">Compression Quality: <span className="font-bold text-primary">{Math.round(quality * 100)}%</span></Label>
                        <Slider
                            id="quality"
                            min={0.1}
                            max={1}
                            step={0.05}
                            value={[quality]}
                            onValueChange={(value) => setQuality(value[0])}
                            disabled={isLoading}
                        />
                    </div>
                    <Button onClick={handleCompress} disabled={isLoading || !originalFile}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Compressing...
                            </>
                        ) : (
                            'Compress Image'
                        )}
                    </Button>
                </CardContent>
            </Card>
        )}
      
      {compressedImage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardContent className="p-4 text-center">
                    <h3 className="font-semibold mb-2">Original</h3>
                    {originalPreview && <Image src={originalPreview} alt="Original" width={300} height={300} className="mx-auto max-h-64 w-auto object-contain rounded-md" />}
                    <p className="mt-2 text-sm font-medium">{formatBytes(originalSize)}</p>
                </CardContent>
            </Card>
             <Card>
                <CardContent className="p-4 text-center">
                    <h3 className="font-semibold mb-2">Compressed</h3>
                    <Image src={compressedImage} alt="Compressed" width={300} height={300} className="mx-auto max-h-64 w-auto object-contain rounded-md" />
                    <p className="mt-2 text-sm font-bold text-primary">{formatBytes(compressedSize)}</p>
                    <p className="text-sm font-semibold text-green-600">You saved {reductionPercentage}%</p>
                     <a href={compressedImage} download={`compressed-${originalFile?.name}`}>
                        <Button className="mt-4 w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                    </a>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
