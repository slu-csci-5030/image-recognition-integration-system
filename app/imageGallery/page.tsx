"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

interface StoredImage {
    id: string;
    data: string; // base64 image data
    timestamp: string;
}

function ImageGalleryContent() {
    const searchParams = useSearchParams();
    const imageId = searchParams.get("imageId");

    const [images, setImages] = useState<{ src: string; alt: string }[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [storedImages, setStoredImages] = useState<StoredImage[]>([]);

    useEffect(() => {
        if (imageId) {
            retrieveSpecificImageFromIndexedDB(imageId);
        }
        loadStoredImages();
    }, [imageId]);

    const loadStoredImages = () => {
        return new Promise<void>((resolve, reject) => {
            const request = indexedDB.open("ImageStorageDB", 1);

            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction("images", "readonly");
                const store = transaction.objectStore("images");

                const getAllRequest = store.getAll();
                getAllRequest.onsuccess = (event) => {
                    const images = (event.target as IDBRequest).result || [];

                    const sortedImages = images.sort((a: StoredImage, b: StoredImage) =>
                        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                    );

                    setStoredImages(sortedImages.map((image: StoredImage) => ({
                        id: image.id,
                        data: image.data,
                        timestamp: image.timestamp || "Unknown date"
                    })));
                    resolve();
                };

                getAllRequest.onerror = () => {
                    reject(new Error("Error retrieving images from IndexedDB"));
                };
            };

            request.onerror = () => {
                reject(new Error("IndexedDB access failed"));
            };
        });
    };

    const retrieveSpecificImageFromIndexedDB = (id: string) => {
        return new Promise<void>((resolve, reject) => {
            const request = indexedDB.open("ImageStorageDB", 1);

            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction("images", "readonly");
                const store = transaction.objectStore("images");
                const getRequest = store.get(id);

                getRequest.onsuccess = async () => {
                    if (getRequest.result) {
                        const base64Image = getRequest.result.data;
                        await sendPhotoToAPI(base64Image);
                        resolve();
                    } else {
                        console.warn("No image found in IndexedDB with ID:", id);
                        setImages([]);
                        reject("No image found");
                    }
                };

                getRequest.onerror = () => {
                    reject("Error retrieving image from IndexedDB.");
                };
            };

            request.onerror = () => {
                reject("IndexedDB access failed.");
            };
        });
    };

    const loadImageById = (id: string) => {
        retrieveSpecificImageFromIndexedDB(id);
    };

    const sendPhotoToAPI = async (base64Image: string) => {
        setIsUploading(true);
        setImages([]);

        try {
            const { data } = await axios.post(
                "http://192.168.123.110:5000/search",
                { image: base64Image },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    withCredentials: false,
                });

            if (data?.similar_images && Array.isArray(data.similar_images)) {
                const formattedImages = data.similar_images.map((url: string, index: number) => ({
                    src: url,
                    alt: `Similar Image ${index + 1}`,
                }));
                setImages(formattedImages);
            } else {
                console.error("Unexpected API response format:", data);
                setImages([]);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            setImages([]);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-black">Image Gallery</h1>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {storedImages.length > 0 ? (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-black mb-4">Your Captured Images</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {storedImages.map((image) => (
                                    <div
                                        key={image.id}
                                        className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => loadImageById(image.id)}
                                    >
                                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                                            <img
                                                src={image.data}
                                                alt="Captured image"
                                                className="object-cover w-full h-40"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">No images found.</div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function ImageGallery() {
    return (
        <Suspense fallback={<div className="text-black text-center">Loading...</div>}>
            <ImageGalleryContent />
        </Suspense>
    );
}
