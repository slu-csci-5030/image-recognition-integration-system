'use client';

import { ArrowLeft, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { loadStoredImages, deleteImageFromIndexedDB, clearAllImagesFromIndexedDB } from '@/app/utils/indexedDbHelpers';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AppConfig } from '@/types/config';

export default function PreviousImages() {
  const [images, setImages] = useState<{ id: string; src: string; alt: string; caption?: string }[]>([]);
  const [config, setConfig] = useState<AppConfig | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('./setup.json')
      .then((res) => res.json())
      .then(setConfig)
      .catch(console.error);
  }, []);

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
    className={`bg-opacity-95 sticky top-0 z-10 border-b backdrop-blur ${config?.appBackground} ${config?.borderColor}`}
  >
    <div className="flex items-center h-14 container">
      <div className="flex items-center gap-2">
        <Link href="/">
          <button className={`hover:opacity-80 ${config?.buttonPrimary}`}>
            <ArrowLeft className="size-5" />
            <span className="sr-only">Back</span>
          </button>
        </Link>
        <h1 className={`text-lg font-semibold ${config?.headingColor}`}>Search History</h1>
      </div>
    </div>
  </header>

  <main className="flex-1">
    <div className="py-4 container">
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {images.map((item, index) => (
            <div
              key={index}
              className={`overflow-hidden border ${config?.cardBackground} ${config?.borderColor} rounded-lg`}
            >
              <div className="relative aspect-video">
              <Image src={item.src || "/placeholder.svg"} alt={item.alt} fill className="object-cover" />
              </div>
              <div className="flex flex-col items-start gap-2 p-4">
                <div className="flex justify-between w-full">
                  <div>
                  <h3 className="font-medium text-gray-400 line-clamp-1">{item.caption}</h3>
                  </div>
                  <div className="flex gap-2">
                  <button
                    className="hover:opacity-80 size-8 text-blue-400"
                    onClick={() => router.push(`/imageGallery?imageId=${item.id}`)}
                    >
                    <Search className="size-4" />
                    <span className="sr-only">Search again</span>
                    </button>
                    <button
                        className="hover:opacity-80 size-8 text-red-500"
                        onClick={async () => {
                            try {
                            await deleteImageFromIndexedDB(item.id);
                            setImages((prev) => prev.filter((img) => img.id !== item.id));
                            } catch (err) {
                            console.error("Failed to delete image", err);
                            }
                        }}
                        >
                        <Trash2 className="size-4" />
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

  <footer className={`border-t py-4 ${config?.borderColor}`}>
    <div className="flex justify-between items-center container">
      <p className="text-gray-400 text-xs">
      {images.length} items in history
      </p>
      <button
        className={`rounded border px-3 py-1 ${config?.borderColor} text-red-400 hover:bg-red-900/20`}
        onClick={async () => {
            try {
            await clearAllImagesFromIndexedDB();
            setImages([]); // Clear UI
            } catch (error) {
            console.error("Failed to clear history:", error);
            }
        }}
        >
        <Trash2 className="mr-2 size-4" />
        Clear History
    </button>
    </div>
  </footer>
</div>
        
      );
};

