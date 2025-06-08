"use client";

import { Camera, CameraResultType } from "@capacitor/camera";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { AppConfig } from "@/types/config";
import { createAnnotation } from "@/app/services/rerumClient";

const CameraButton = () => {
    const router = useRouter();
    const [isCapturing, setIsCapturing] = useState(false);
    const [config, setConfig] = useState<AppConfig | null>(null);

    useEffect(() => {
        fetch(`./setup.json`)
            .then((response) => response.json())
            .then((data) => {
                setConfig(data);
            })
            .catch((error) => {
                console.error("Error loading config:", error);
            });
    }, []);

    const takePhoto = async () => {
        try {
            setIsCapturing(true);
            const photo = await Camera.getPhoto({
                quality: 100,
                resultType: CameraResultType.Uri,
                allowEditing: false,
            });

            if (!photo.webPath) {
                throw new Error("Photo capture failed");
            }

            console.log("Photo captured:", photo.webPath);
            const base64Image = await convertToBase64(photo.webPath);

            const rerumObject = {
                type: "Image",
                format: "image/jpeg",
                value: base64Image,
                creator: "https://example.org/obsa"
            };

            const rerumResponse = await createAnnotation(rerumObject);
            const rerumId = rerumResponse["@id"];

            const imageId = uuidv4();
            console.log("Generated image ID:", imageId);

            await storeImageInIndexedDB(imageId, base64Image, rerumId);

            router.push(`/imageGallery?imageId=${imageId}`);
        } catch (error) {
            console.error("Camera error:", error);
        } finally {
            setIsCapturing(false);
        }
    };

    const convertToBase64 = (imageUri: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            fetch(imageUri)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => {
                        if (typeof reader.result === "string") {
                            resolve(reader.result);
                        } else {
                            reject("Failed to convert image to Base64");
                        }
                    };
                })
                .catch(error => reject(error));
        });
    };

    const storeImageInIndexedDB = (imageId: string, base64Image: string, rerumId: string) => {
        return new Promise<void>((resolve, reject) => {
            const request = indexedDB.open("ImageStorageDB", 1);

            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains("images")) {
                    const store = db.createObjectStore("images", { keyPath: "id" });
                    store.createIndex("rerumId", "rerumId", { unique: false });
                }
            };

            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction("images", "readwrite");
                const store = transaction.objectStore("images");

                store.put({
                    id: imageId,
                    data: base64Image,
                    rerumId,
                    timestamp: new Date().toISOString(),
                });

                transaction.oncomplete = () => resolve();
                transaction.onerror = (event) => reject(event);
            };

            request.onerror = (event) => reject(event);
        });
    };

    return (
        <button 
            className={`px-4 py-2 ${config?.cameraButtonColor} rounded-lg text-white shadow-md`}
            onClick={takePhoto}
            disabled={isCapturing}
        >
            {isCapturing ? "Capturing..." : "Use Camera"}
        </button>
    );
};

export default CameraButton;

