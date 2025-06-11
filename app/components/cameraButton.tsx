'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { AppConfig } from '@/types/config';

export default function CameraButton() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Load theme/API config
  useEffect(() => {
    fetch('/setup.json')
      .then((r) => r.json())
      .then((data: AppConfig) => setConfig(data))
      .catch(console.error)
      .finally(() => setLoadingConfig(false));
  }, []);

  // Save image & navigate to gallery
  const saveImageAndNavigate = (dataUrl: string) => {
    const id = uuidv4();
    const req = indexedDB.open('ImageStorageDB', 1);

    req.onupgradeneeded = () =>
      req.result.createObjectStore('images', { keyPath: 'id' });

    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction('images', 'readwrite');
      tx.objectStore('images').put({ id, data: dataUrl });
      tx.oncomplete = () => router.push(`/gallery?imageId=${id}`);
      tx.onerror = console.error;
    };

    req.onerror = console.error;
  };

  // Camera capture
  const takePhoto = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
      });
      if (photo.dataUrl) saveImageAndNavigate(photo.dataUrl);
    } catch (err) {
      console.error('Camera error:', err);
    }
  };

  // File upload
  const uploadImage = () => fileInputRef.current?.click();

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      typeof reader.result === 'string' && saveImageAndNavigate(reader.result);
    reader.readAsDataURL(file);
  };

  if (loadingConfig || !config) {
    return <div className="h-64 flex items-center justify-center text-white">Loading…</div>;
  }

  return (
    <div
      className={`
        w-full max-w-2xl
        p-12 border-8 border-solid border-white
        rounded-3xl ${config.cardBackground}
      `}
    >
      {/* Only this prompt inside */}
      <p className={`text-center text-3xl font-bold mb-10 ${config.textColor}`}>
        Click below to upload image
      </p>

      <div className="flex justify-center gap-8">
        <button
          onClick={takePhoto}
          className={`
            px-8 py-4 text-xl border-2 ${config.borderColor}
            rounded-lg font-semibold hover:opacity-90 ${config.textColor}
          `}
        >
          Take Photo
        </button>

        <button
          onClick={uploadImage}
          className={`
            px-8 py-4 text-xl border-2 ${config.borderColor}
            rounded-lg font-semibold hover:opacity-90 ${config.textColor}
          `}
        >
          Upload Image
        </button>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={onFileSelected}
        className="hidden"
      />
    </div>
  );
}
