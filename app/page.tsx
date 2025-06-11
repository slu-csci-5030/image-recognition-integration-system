'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/app/components/navigationBar';
import { AppConfig } from '@/types/config';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const router = useRouter();
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [imageData, setImageData] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load config
  useEffect(() => {
    fetch('/setup.json')
      .then(r => r.json())
      .then((cfg: AppConfig) => setConfig(cfg))
      .catch(err => {
        console.error('Failed to load config:', err);
      })
      .finally(() => setLoadingConfig(false));
  }, []);

  const takePhoto = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
      });
      if (photo.dataUrl) {
        setImageData(photo.dataUrl);
      }
    } catch (err) {
      console.error('Camera error:', err);
    }
  };

  const uploadImage = () => fileInputRef.current?.click();

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImageData(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!imageData || typeof window === 'undefined') return;

    setSaving(true);
    const id = uuidv4();
    const req = indexedDB.open('ImageStorageDB', 1);

    req.onupgradeneeded = () => {
      req.result.createObjectStore('images', { keyPath: 'id' });
    };

    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction('images', 'readwrite');
      const store = tx.objectStore('images');
      store.put({ id, data: imageData });

      tx.oncomplete = () => {
        router.push(`/imageGallery?imageId=${id}`);
      };
      tx.onerror = (e) => {
        console.error('Error writing to IndexedDB:', e);
        setSaving(false);
      };
    };

    req.onerror = (e) => {
      console.error('Error opening IndexedDB:', e);
      setSaving(false);
    };
  };

  if (loadingConfig || !config) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white">Loading config…</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${config.appBackground} flex flex-col items-center justify-center px-4 py-8 relative`}
    >
      <div className={`w-full max-w-2xl p-8 border-4 rounded-2xl ${config.cardBackground} border-white`}>
        <p className={`text-center text-3xl font-bold mb-8 ${config.textColor}`}>
          Click below to upload image
        </p>

        <div className="flex justify-center gap-8 mb-8">
          <button
            onClick={takePhoto}
            className={`px-8 py-4 text-xl border-2 rounded-lg font-semibold hover:opacity-90 ${config.borderColor} ${config.textColor}`}
          >
            Take Photo
          </button>
          <button
            onClick={uploadImage}
            className={`px-8 py-4 text-xl border-2 rounded-lg font-semibold hover:opacity-90 ${config.borderColor} ${config.textColor}`}
          >
            Upload Image
          </button>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={onFileSelected}
          className="hidden"
        />

        {imageData ? (
          <div className="mx-auto mb-8 w-[300px] h-[200px] overflow-hidden rounded-xl">
            <img src={imageData} alt="Preview" className="w-full h-full object-cover" />
          </div>
        ) : (
          <p className={`text-center ${config.textColor}`}>No image selected.</p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={saving}
        className={`mt-8 px-10 py-3 text-lg font-semibold border-2 rounded-md ${config.borderColor} ${config.textColor} hover:opacity-90`}
      >
        {saving ? 'Saving…' : 'Submit'}
      </button>

      <div className="absolute bottom-0 left-0 w-full">
        <NavigationBar />
      </div>
    </div>
  );
}
