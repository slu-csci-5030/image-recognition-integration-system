import Link from "next/link";

const BottomNav = () => {
    return (
      <nav className="absolute bottom-0 w-full bg-white border-t flex justify-around py-2 shadow-md">
  
        <Link href="/" className="flex flex-col items-center text-gray-700">
          <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
          <span className="text-xs">Home</span>
        </Link>

        <Link href="/profile" className="flex flex-col items-center text-gray-700">
          <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
          <span className="text-xs">Profile</span>
        </Link>

        <Link href="/about" className="flex flex-col items-center text-gray-700">
          <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
          <span className="text-xs">About</span>
        </Link>

        <Link href="/previousImages" className="flex flex-col items-center text-gray-700">
          <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
          <span className="text-xs">Previous Images</span>
        </Link>
      </nav>
    );
};

export default BottomNav;
