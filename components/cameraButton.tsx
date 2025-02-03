"use client"

import { Camera, CameraResultType } from "@capacitor/camera"

const CameraButton = () => {
    const takePhoto = async () => {
        try {
            const photo = await Camera.getPhoto({
                quality: 100,
                resultType: CameraResultType.Uri,
                allowEditing: false,
            })

            alert(`Photo taken: ${photo.webPath}`)
        } catch (error) {
            console.error("Camera error:", error);
            
        }
    };
            


    return <button className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md" onClick={takePhoto}>
    Use Camera
    </button>
}

export default CameraButton