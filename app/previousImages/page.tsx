"use client";

import { ArrowLeft, Search, Trash2 } from "lucide-react"
import React from "react";
import { useEffect, useState } from "react";
import {loadStoredImages, deleteImageFromIndexedDB, clearAllImagesFromIndexedDB} from "@/app/utils/indexedDbHelpers";
import Link from "next/link";
import config from "@/config/Setup.json";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PreviousImages() {
    const [images, setImages] = useState<{ id: string; src: string; alt: string; caption?: string }[]>([]);
    const router = useRouter();


    useEffect(() => {
        const fetchImages = async () => {
          try {
            const storedImages = await loadStoredImages();
    
            // 3. Convert StoredImage[] to ImageItem[]
            const formatted = storedImages.map((img) => ({
              id: img.id,
              src: img.data,
              alt: `Captured on ${img.timestamp}`,
              caption: new Date(img.timestamp).toLocaleString()
            }));
    
            setImages(formatted);
          } catch (err) {
            console.error("Failed to load images", err);
          }
        };
    
        fetchImages();
      }, []);


    return (
        <div className="flex flex-col min-h-screen">
  <header
    className={`sticky top-0 z-10 border-b backdrop-blur bg-opacity-95 ${config.appBackground} ${config.borderColor}`}
  >
    <div className="container flex h-14 items-center">
      <div className="flex items-center gap-2">
        <Link href="/">
          <button className={`hover:opacity-80 ${config.buttonPrimary}`}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </button>
        </Link>
        <h1 className={`text-lg font-semibold ${config.headingColor}`}>Search History</h1>
      </div>
    </div>
  </header>

  <main className="flex-1">
    <div className="container py-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {images.map((item, index) => (
            <div
              key={index}
              className={`overflow-hidden border ${config.cardBackground} ${config.borderColor} rounded-lg`}
            >
              <div className="relative aspect-video">
              <Image src={item.src || "/placeholder.svg"} alt={item.alt} fill className="object-cover" />
              </div>
              <div className="flex flex-col items-start gap-2 p-4">
                <div className="flex w-full justify-between">
                  <div>
                  <h3 className="font-medium line-clamp-1 text-gray-400">{item.caption}</h3>
                  </div>
                  <div className="flex gap-2">
                  <button
                    className="h-8 w-8 hover:opacity-80 text-blue-400"
                    onClick={() => router.push(`/imageGallery?imageId=${item.id}`)}
                    >
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search again</span>
                    </button>
                    <button
                        className="h-8 w-8 hover:opacity-80 text-red-500"
                        onClick={async () => {
                            try {
                            await deleteImageFromIndexedDB(item.id);
                            setImages((prev) => prev.filter((img) => img.id !== item.id));
                            } catch (err) {
                            console.error("Failed to delete image", err);
                            }
                        }}
                        >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  </main>

  <footer className={`border-t py-4 ${config.borderColor}`}>
    <div className="container flex items-center justify-between">
      <p className="text-xs text-gray-400">
      {images.length} items in history
      </p>
      <button
        className={`px-3 py-1 rounded border ${config.borderColor} text-red-400 hover:bg-red-900/20`}
        onClick={async () => {
            try {
            await clearAllImagesFromIndexedDB();
            setImages([]); // Clear UI
            } catch (error) {
            console.error("Failed to clear history:", error);
            }
        }}
        >
        <Trash2 className="mr-2 h-4 w-4" />
        Clear History
    </button>
    </div>
  </footer>
</div>
        
      );
};

