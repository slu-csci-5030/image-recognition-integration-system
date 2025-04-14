'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { AppConfig } from '@/types/config';

interface SimilarImage {
  src: string;
  alt: string;
}

function ImageGalleryContent() {
  const searchParams = useSearchParams();
  const imageId = searchParams.get('imageId');

  const [config, setConfig] = useState<AppConfig | null>(null);
  const [similarImages, setSimilarImages] = useState<SimilarImage[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetch('./setup.json')
      .then((response) => response.json())
      .then((data) => setConfig(data))
      .catch((error) => {
        console.error('Error loading config:', error);
      });
  }, []);

  useEffect(() => {
    if (config && imageId) {
      retrieveImageAndSearch(imageId, config);
    }
  }, [imageId, config]);

  const retrieveImageAndSearch = (id: string, config: AppConfig) => {
    const request = indexedDB.open('ImageStorageDB', 1);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction('images', 'readonly');
      const store = transaction.objectStore('images');
      const getRequest = store.get(id);

      getRequest.onsuccess = async () => {
        if (getRequest.result) {
          const base64Image = getRequest.result.data;
          await sendPhotoToAPI(base64Image, config);
        } else {
          console.warn('No image found in IndexedDB with ID:', id);
          setSimilarImages([]);
        }
      };

      getRequest.onerror = () => {
        console.error('Error retrieving image from IndexedDB.');
      };
    };

    request.onerror = () => {
      console.error('Failed to access IndexedDB.');
    };
  };

  const sendPhotoToAPI = async (base64Image: string, config: AppConfig) => {
    setIsSearching(true);
    setSimilarImages([]);

    try {
      const { data } = await axios.post(
        config.imageApiUrl,
        { image: base64Image },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          withCredentials: false,
        }
      );

      if (data?.similar_images && Array.isArray(data.similar_images)) {
        const formatted = data.similar_images.map((url: string, index: number) => ({
          src: url,
          alt: `Similar Image ${index + 1}`,
        }));
        setSimilarImages(formatted);
      } else {
        console.error('Unexpected API response format:', data);
        setSimilarImages([]);
      }
    } catch (error) {
      console.error('API request failed:', error);
      setSimilarImages([]);
    } finally {
      setIsSearching(false);
    }
  };

  if (!config) return <div className="text-white text-center">Loading config...</div>;

  return (
    <div className={`min-h-screen ${config.appBackground} ${config.textColor}`}>
      <header className={`border-b shadow ${config.borderColor}`}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
          <h1 className={`text-3xl font-bold ${config.headingColor}`}>Image Gallery</h1>
        </div>
      </header>

      <main>
        <div className="mx-auto sm:px-6 lg:px-8 py-6 max-w-7xl">
          {isSearching && (
            <div className={`text-center ${config.textColor}`}>
              Searching for similar images...
            </div>
          )}

          {similarImages.length > 0 && (
            <div>
              <h2 className={`mb-4 text-xl font-semibold ${config.headingColor}`}>
                Similar Images
              </h2>
              <div className="gap-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {similarImages.map((image) => (
                  <img
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    className={`h-40 w-full rounded-md object-cover ${config.cardBackground}`}
                  />
                ))}
              </div>
            </div>
          )}

          {!isSearching && similarImages.length === 0 && (
            <div className="text-gray-500 text-center">No similar images found.</div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ImageGallery() {
  return (
    <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
      <ImageGalleryContent />
    </Suspense>
  );
}
