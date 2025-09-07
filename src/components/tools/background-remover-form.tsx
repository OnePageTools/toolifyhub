"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Upload, Download, Trash2 } from 'lucide-react';
import {
  removeBackground,
  type RemoveBackgroundOutput,
} from '@/ai/flows/remove-background-flow';
import Image from 'next/image';

export function BackgroundRemoverForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<RemoveBackgroundOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
            variant: "destructive",
            title: "File too large",
            description: "Please upload an image smaller than 4MB.",
        });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select an image file first.",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const photoDataUri = await fileToDataUri(selectedFile);
      const response = await removeBackground({ photoDataUri });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description:
          "Failed to remove background. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="image-upload">Upload Image</Label>
        <div className="flex items-center gap-2">
          <Input id="image-upload" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} ref={fileInputRef} />
          {preview && (
             <Button variant="ghost" size="icon" onClick={handleClear}>
                <Trash2 />
                <span className='sr-only'>Clear</span>
             </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[256px]">
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-2 text-center">Original Image</h3>
            {preview ? (
                <Image src={preview} alt="Original image preview" width={256} height={256} className="max-h-64 w-auto object-contain rounded-md" />
            ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Upload className="w-10 h-10 mb-2" />
                    <span>Your image will appear here</span>
                </div>
            )}
        </div>
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4">
             <h3 className="text-sm font-semibold mb-2 text-center">Result</h3>
            {isLoading && <Loader2 className="w-10 h-10 animate-spin" />}
            {!isLoading && result?.imageDataUri ? (
                <Image src={result.imageDataUri} alt="Background removed" width={256} height={256} className="max-h-64 w-auto object-contain rounded-md" />
            ) : !isLoading && (
                 <div className="flex flex-col items-center justify-center text-muted-foreground text-center">
                    <Wand2 className="w-10 h-10 mb-2" />
                    <span>The result will be shown here</span>
                </div>
            )}
        </div>
      </div>
      
      <div className="flex gap-2">
         <Button onClick={handleSubmit} disabled={isLoading || !selectedFile}>
            {isLoading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
                </>
            ) : (
                <>
                <Wand2 className="mr-2 h-4 w-4" />
                Remove Background
                </>
            )}
            </Button>
            {result && (
                <a href={result.imageDataUri} download="background-removed.png">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                </a>
            )}
      </div>
    </div>
  );
}
