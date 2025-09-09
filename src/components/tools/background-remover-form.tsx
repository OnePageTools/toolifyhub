
"use client";

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Upload, Download, Trash2, Image as ImageIcon } from 'lucide-react';
import {
  removeBackground,
  type RemoveBackgroundOutput,
} from '@/ai/flows/remove-background-flow';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function BackgroundRemoverForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<RemoveBackgroundOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
            variant: "destructive",
            title: "File too large",
            description: "Please upload an image smaller than 10MB.",
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
    setIsDragging(true); // Keep it true while dragging over
  };
  
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if(e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
        // To allow for re-uploading the same file if cleared
        e.dataTransfer.clearData();
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
      // First, try the AI-powered background removal
      const photoDataUri = await fileToDataUri(selectedFile);
      const response = await removeBackground({ photoDataUri });
      
      if (response.error || !response.imageDataUri) {
         toast({
            title: "AI Remover Busy",
            description: "Switching to standard background removal. This may take a moment.",
        });
        
        // Dynamically import the client-side library
        const removeBackgroundClient = (await import("@imgly/background-removal")).default;

        // Fallback to client-side removal if AI fails
        const clientResultBlob = await removeBackgroundClient(selectedFile);
        const clientResultUrl = URL.createObjectURL(clientResultBlob);
        setResult({ imageDataUri: clientResultUrl });

      } else {
        setResult(response);
      }

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An unexpected error occurred",
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
        <Input id="image-upload" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
        <label
            htmlFor="image-upload"
            className={cn(
                "group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/50 bg-secondary/50 p-8 text-center transition-colors hover:bg-secondary",
                isDragging && "border-primary bg-primary/10",
                preview && "p-0 border-0"
            )}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            {preview ? (
              <>
                <Image src={preview} alt="Original image preview" width={400} height={400} className="max-h-80 w-auto object-contain rounded-md" />
                <Button variant="destructive" size="icon" onClick={(e) => { e.preventDefault(); handleClear()}} className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md">
                    <Trash2 className="h-4 w-4" />
                    <span className='sr-only'>Clear</span>
                </Button>
              </>
            ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 text-primary/80 transition-transform group-hover:scale-110" />
                    <span className="font-semibold text-primary">Click to upload or drag & drop</span>
                    <p className="text-xs">PNG, JPG, or WEBP (Max 10MB)</p>
                </div>
            )}
        </label>
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
            {result && result.imageDataUri && (
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
