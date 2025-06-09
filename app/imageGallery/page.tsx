'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import NavigationBar from '@/app/components/navigationBar';
import { AppConfig } from '@/types/config';

interface SimilarImage {
  src: string;
  alt: string;
}

export default function ImageGalleryPage() {
  const params = useSearchParams();
  const imageId = params.get('imageId');

  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [imageData, setImageData] = useState<string | null>(null);
  const [similarImages, setSimilarImages] = useState<SimilarImage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);

  // 1. Load theme/API config
  useEffect(() => {
    fetch('/setup.json')
      .then((r) => r.json())
      .then((cfg: AppConfig) => setConfig(cfg))
      .catch(console.error)
      .finally(() => setLoadingConfig(false));
  }, []);

  // 2. Retrieve the stored image from IndexedDB
  useEffect(() => {
    if (!imageId) return;
    const req = indexedDB.open('ImageStorageDB', 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore('images', { keyPath: 'id' });
    };
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction('images', 'readonly');
      const store = tx.objectStore('images');
      const getReq = store.get(imageId);
      getReq.onsuccess = () => {
        const result = getReq.result;
        if (result?.data) {
          setImageData(result.data as string);
        }
        setLoadingImage(false);
      };
      getReq.onerror = () => {
        console.error('Error retrieving image from IndexedDB.');
        setLoadingImage(false);
      };
    };
    req.onerror = () => {
      console.error('Failed to open IndexedDB.');
      setLoadingImage(false);
    };
  }, [imageId]);

  // 3. When both config & imageData are ready, kick off the search
  useEffect(() => {
    if (loadingConfig || loadingImage || !config || !imageData) return;

    setIsSearching(true);
    axios
      .post(
        config.imageApiUrl,
        { image: imageData },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then((res) => {
        const sims = Array.isArray(res.data.similar_images)
          ? res.data.similar_images.map((url: string, i: number) => ({
              src: url,
              alt: `Similar Image ${i + 1}`,
            }))
          : [];
        setSimilarImages(sims);
      })
      .catch((err) => console.error('API request failed:', err))
      .finally(() => setIsSearching(false));
  }, [config, loadingConfig, imageData, loadingImage]);

  if (loadingConfig) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white">Loading config…</p>
      </div>
    );
  }

  return (
    <div
      className={`
        min-h-screen ${config?.appBackground}
        flex flex-col items-center pt-6 pb-24 px-4
        relative ${config?.textColor}
      `}
    >
      <header className={`w-full border-b shadow ${config?.borderColor}`}>
        <div className="mx-auto max-w-4xl px-4 py-6">
          <h1 className={`text-3xl font-bold ${config?.headingColor}`}>Image Gallery</h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto mt-6">
        <section className="mb-8">
          <h2 className={`mb-2 text-xl font-semibold ${config?.headingColor}`}>
            Queried Image
          </h2>

          {loadingImage ? (
            <p>Loading input image…</p>
          ) : imageData ? (
            <div className="mx-auto w-[300px] h-[200px] overflow-hidden rounded-xl border border-white">
              <img
                src={imageData}
                alt="Queried"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <p>No image found.</p>
          )}
        </section>

        {isSearching && <p>Searching for similar images…</p>}

        {similarImages.length > 0 ? (
          <section>
            <h2 className={`mb-4 text-xl font-semibold ${config?.headingColor}`}>
              Similar Images
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {similarImages.map((img) => (
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  className={`h-40 w-full rounded-md object-cover ${config?.cardBackground}`}
                />
              ))}
            </div>
          </section>
        ) : (
          !isSearching &&
          imageData && (
            <p className="text-center text-gray-500 mt-6">
              No similar images found.
            </p>
          )
        )}
      </main>

      {/* Navigation bar at bottom */}
      <div className="absolute bottom-0 left-0 w-full">
        <NavigationBar />
      </div>
    </div>
  );
}
