import Image from "next/image";
import CameraButton from "@/components/cameraButton";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen relative">
      <div className="flex flex-col items-center">
        <main className="w-80 h-80 border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-black-100">
          <Image
            className="w-full h-full object-cover"
            src="/sample.jpeg"
            alt="Space for Image Display"
            width={300}
            height={300}
          />
        </main>

        <div className="mt-4 flex space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md">
            Select Image
          </button>
          <CameraButton />
        </div>
      </div>
      <nav className="absolute bottom-0 w-full bg-white border-t flex justify-around py-2 shadow-md">
        <button className="flex flex-col items-center text-gray-700">
          <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
          <span className="text-xs">Home</span>
        </button>
        <button className="flex flex-col items-center text-gray-700">
          <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
          <span className="text-xs">Search</span>
        </button>
        <button className="flex flex-col items-center text-gray-700">
          <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
          <span className="text-xs">Profile</span>
        </button>
      </nav>
    </div>
  );
}
