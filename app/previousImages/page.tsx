'use client';

import { ArrowLeft, Trash2, PlusCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  loadStoredImages,
  deleteImageFromIndexedDB,
} from '@/app/utils/indexedDbHelpers';
import { AppConfig } from '@/types/config';
import {
  createAnnotation,
  getAnnotationsByTarget,
  updateAnnotation,
  deleteAnnotation,
} from '@/app/services/rerumClient';

export default function PreviousImages() {
  const [images, setImages] = useState<
    { id: string; src: string; alt: string; caption: string }[]
  >([]);
  const [annotations, setAnnotations] = useState<Record<string, any>>({});
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [newTitles, setNewTitles] = useState<Record<string, string>>({});
  const [newTags, setNewTags] = useState<Record<string, string>>({});
  const [newCategories, setNewCategories] = useState<Record<string, string>>({});
  const [newImageQuality, setNewImageQuality] = useState<Record<string, string>>({});
  const [newAnnotatedBy, setNewAnnotatedBy] = useState<Record<string, string>>({});
  const [config, setConfig] = useState<AppConfig | null>(null);
  const router = useRouter();

  const categoryOptions = ['Medical', 'Environmental', 'Educational', 'Biological', 'Technical', 'Other'];

  useEffect(() => {
    fetch('./setup.json')
      .then((res) => res.json())
      .then(setConfig)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchImagesAndAnnotations = async () => {
      try {
        const storedImages = await loadStoredImages();

        const formatted = storedImages.map((img) => {
          const timestamp = img.timestamp ? new Date(img.timestamp) : new Date();
          return {
            id: img.id,
            src: img.data,
            alt: `Captured on ${timestamp.toLocaleString()}`,
            caption: timestamp.toLocaleString(),
          };
        });

        setImages(formatted);

        const anns: Record<string, any> = {};
        for (const img of storedImages) {
          const results = await getAnnotationsByTarget(img.id);
          if (results.length > 0) {
            const ann = results[0];
            anns[img.id] = ann;

            setNewTitles((prev) => ({ ...prev, [img.id]: ann.body?.title || '' }));
            setNewTags((prev) => ({ ...prev, [img.id]: (ann.body?.tags || []).join(', ') }));
            setNewCategories((prev) => ({ ...prev, [img.id]: ann.body?.category || '' }));
            setNewImageQuality((prev) => ({ ...prev, [img.id]: ann.body?.imageQuality || '' }));
            setNewAnnotatedBy((prev) => ({ ...prev, [img.id]: ann.body?.annotatedBy || '' }));
          }
        }
        setAnnotations(anns);
      } catch (err) {
        console.error('Failed to load images or annotations', err);
      }
    };

    fetchImagesAndAnnotations();
  }, []);

  const handleSaveAnnotation = async (imageId: string) => {
    const title = newTitles[imageId] || '';
    const tags = (newTags[imageId] || '')
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const category = newCategories[imageId] || '';
    const imageQuality = newImageQuality[imageId] || '';
    const annotatedBy = newAnnotatedBy[imageId] || '';

    const existingAnnotation = annotations[imageId];

    const annotationPayload = {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      type: 'Annotation',
      target: imageId,
      body: { title, tags, category, imageQuality, annotatedBy },
    };

    try {
      let savedAnnotation;
      if (existingAnnotation && existingAnnotation['@id']) {
        savedAnnotation = await updateAnnotation({
          ...existingAnnotation,
          body: annotationPayload.body,
        });
      } else {
        savedAnnotation = await createAnnotation(annotationPayload);
      }

      setAnnotations((prev) => ({ ...prev, [imageId]: savedAnnotation }));
      setEditingImageId(null);
      alert('Annotation saved successfully!');
    } catch (err) {
      console.error('Annotation save failed', err);
      alert('Failed to save annotation.');
    }
  };

  const handleDeleteAnnotation = async (imageId: string, showAlert: boolean = true) => {
    const ann = annotations[imageId];
    if (ann && ann['@id']) {
      try {
        await deleteAnnotation(ann['@id']);
      } catch (err) {
        console.error('Failed to delete annotation from server', err);
        if (showAlert) alert('Failed to delete annotation from server.');
        return;
      }
    }

    setAnnotations((prev) => {
      const copy = { ...prev };
      delete copy[imageId];
      return copy;
    });
    setNewTitles((prev) => ({ ...prev, [imageId]: '' }));
    setNewTags((prev) => ({ ...prev, [imageId]: '' }));
    setNewCategories((prev) => ({ ...prev, [imageId]: '' }));
    setNewImageQuality((prev) => ({ ...prev, [imageId]: '' }));
    setNewAnnotatedBy((prev) => ({ ...prev, [imageId]: '' }));
    setEditingImageId(null);

    if (showAlert) alert('Annotation deleted successfully.');
  };

  const updateField = (
    label: 'Title' | 'Tags' | 'Category' | 'Image Quality' | 'Annotated By',
    imageId: string,
    value: string
  ) => {
    const stateMap = {
      Title: [newTitles, setNewTitles] as const,
      Tags: [newTags, setNewTags] as const,
      Category: [newCategories, setNewCategories] as const,
      'Image Quality': [newImageQuality, setNewImageQuality] as const,
      'Annotated By': [newAnnotatedBy, setNewAnnotatedBy] as const,
    };

    const [, setter] = stateMap[label];
    setter((prev) => ({ ...prev, [imageId]: value }));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className={`sticky top-0 z-10 border-b bg-opacity-95 backdrop-blur ${config?.appBackground} ${config?.borderColor}`}>
        <div className="container flex items-center" style={{ paddingTop: 'env(safe-area-inset-top)', height: 'calc(56px + env(safe-area-inset-top))' }}>
          <div className="flex items-center gap-2">
            <Link href="/">
              <button className={`hover:opacity-80 transition ${config?.buttonPrimary}`}>
                <ArrowLeft className="size-5" />
              </button>
            </Link>
            <h1 className={`text-lg font-semibold ${config?.headingColor}`}>Search History</h1>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {images.map((item) => (
              <div key={item.id} className={`overflow-hidden border rounded-lg relative transition-transform hover:scale-[1.01] hover:shadow-md ${config?.cardBackground} ${config?.borderColor}`}>
                <div className="relative aspect-video">
                  <Image src={item.src || '/placeholder.svg'} alt={item.alt} fill className="object-cover" />
                </div>

                <div className="flex flex-col items-start gap-2 p-4 relative">
                  <div className="flex w-full justify-between">
                    <h3 className="line-clamp-1 font-medium text-gray-400">{item.caption || 'No timestamp available'}</h3>
                    <button className="size-8 text-red-500 hover:opacity-80 transition" onClick={async () => {
                      try {
                        await deleteImageFromIndexedDB(item.id);
                        setImages((prev) => prev.filter((img) => img.id !== item.id));
                        await handleDeleteAnnotation(item.id, false);
                        alert('Image deleted successfully.');
                      } catch (err) {
                        console.error('Error deleting image or annotation', err);
                        alert('Error deleting image.');
                      }
                    }}>
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <button
                    className="flex items-center gap-1 text-sm text-indigo-500 hover:underline mt-2"
                    onClick={() => setEditingImageId(editingImageId === item.id ? null : item.id)}
                  >
                    <PlusCircle className="size-4" />
                    {annotations[item.id] ? 'Edit Annotation' : 'Add Annotation'}
                  </button>

                  {editingImageId === item.id && (
                    <div className="mt-2 w-full bg-gray-800 p-3 rounded-md text-sm space-y-2">
                      {['Title', 'Tags', 'Annotated By'].map((label) => (
                        <div key={label}>
                          <label className="block mb-1 font-semibold text-gray-300">{label}</label>
                          <input
                            type="text"
                            placeholder={label === 'Tags' ? 'Comma-separated' : ''}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            value={
                              label === 'Title' ? newTitles[item.id] || '' :
                              label === 'Tags' ? newTags[item.id] || '' :
                              newAnnotatedBy[item.id] || ''
                            }
                            onChange={(e) => updateField(label as any, item.id, e.target.value)}
                          />
                        </div>
                      ))}

                      <div>
                        <label className="block mb-1 font-semibold text-gray-300">Category</label>
                        <select
                          className="w-full p-2 rounded bg-gray-700 text-white"
                          value={newCategories[item.id] || ''}
                          onChange={(e) => updateField('Category', item.id, e.target.value)}
                        >
                          <option value="">Select Category</option>
                          {categoryOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block mb-1 font-semibold text-gray-300">Image Quality</label>
                        <select
                          className="w-full p-2 rounded bg-gray-700 text-white"
                          value={newImageQuality[item.id] || ''}
                          onChange={(e) => updateField('Image Quality', item.id, e.target.value)}
                        >
                          <option value="">Select Quality</option>
                          <option value="Excellent">Excellent</option>
                          <option value="Good">Good</option>
                          <option value="Fair">Fair</option>
                          <option value="Poor">Poor</option>
                        </select>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition" onClick={() => handleSaveAnnotation(item.id)}>Save</button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition" onClick={() => handleDeleteAnnotation(item.id)}>Delete</button>
                      </div>
                    </div>
                  )}

                  {annotations[item.id] && editingImageId !== item.id && (
                    <div className="text-gray-300 mt-2 text-xs max-h-28 overflow-y-scroll pr-2 space-y-1">
                      <p><span className="font-bold text-gray-400">Title:</span> {annotations[item.id].body?.title}</p>
                      <p><span className="font-bold text-gray-400">Tags:</span> {(annotations[item.id].body?.tags || []).join(', ')}</p>
                      <p><span className="font-bold text-gray-400">Category:</span> {annotations[item.id].body?.category || '—'}</p>
                      <p><span className="font-bold text-gray-400">Image Quality:</span> {annotations[item.id].body?.imageQuality || '—'}</p>
                      <p><span className="font-bold text-gray-400">Annotated By:</span> {annotations[item.id].body?.annotatedBy || '—'}</p>
                      <p><span className="font-bold text-gray-400">Annotated on:</span> {
                        annotations[item.id].created
                          ? new Date(annotations[item.id].created).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                          : 'Unknown'
                      }</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
