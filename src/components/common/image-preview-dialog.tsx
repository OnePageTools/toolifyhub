
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import Image from "next/image";
import { X } from "lucide-react";

interface ImagePreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  imageUrl: string;
  imageAlt: string;
}

export function ImagePreviewDialog({
  isOpen,
  onOpenChange,
  imageUrl,
  imageAlt,
}: ImagePreviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-2">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="sr-only">{imageAlt}</DialogTitle>
           <DialogClose asChild>
              <button className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/75">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            </DialogClose>
        </DialogHeader>
        <div className="flex-grow w-full h-full flex items-center justify-center overflow-auto">
            <Image
              src={imageUrl}
              alt={imageAlt}
              width={1200}
              height={1200}
              className="max-w-full max-h-full object-contain"
            />
        </div>
      </DialogContent>
    </Dialog>
  );
}
