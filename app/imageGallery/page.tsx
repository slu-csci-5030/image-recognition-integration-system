import React, { Suspense } from 'react';
import ImageGalleryContent from './ImageGalleryContent';

export default function ImageGalleryPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10 text-white">Loading gallery…</div>}>
      <ImageGalleryContent />
    </Suspense>
  );
}
