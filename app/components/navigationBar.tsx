'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Info, Image, Activity } from 'lucide-react';

const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/about', label: 'About', icon: Info },
    { href: '/previousImages', label: 'Previous', icon: Image },
    { href: '/radiator', label: 'Radiator', icon: Activity },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t bg-white py-2 shadow-md">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        const activeClass = isActive ? 'text-blue-600' : 'text-gray-500';
        return (
          <Link key={href} href={href} className={`flex flex-col items-center ${activeClass}`}>  
            {Icon ? (
              <Icon className="h-6 w-6 mb-1" />
            ) : (
              <div className="h-6 w-6 mb-1 bg-gray-300 rounded-full" />
            )}
            <span className="text-xs">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
