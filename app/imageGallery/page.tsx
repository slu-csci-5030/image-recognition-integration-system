"use client";

import { useEffect, useState } from "react";
import ImageGrid from "../components/imageGrid";
import axios from "axios";

export default function ImageGallery() {
    const [images, setImages] = useState<{ src: string; alt: string }[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const storedImage = localStorage.getItem("capturedImage");
        if (storedImage) {
            sendPhotoToAPI(storedImage);
        }
    }, []);

    const sendPhotoToAPI = async (base64Image: string) => {
        setIsUploading(true);
        try {
            const { data } = await axios.post("/api/upload", { image: base64Image });

            if (data?.similar_images && Array.isArray(data.similar_images)) {
                const formattedImages = data.similar_images.map((url: string, index: number) => ({
                    src: url,
                    alt: `Similar Image ${index + 1}`,
                }));
                setImages(formattedImages);
            } else {
                console.error("Unexpected API response format:", data);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Image Gallery</h1>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {images.length > 0 ? <ImageGrid images={images} /> : <p>No images found.</p>}
                    {isUploading && <p className="text-gray-500">Uploading image...</p>}
                </div>
            </main>
        </div>
    );
}
