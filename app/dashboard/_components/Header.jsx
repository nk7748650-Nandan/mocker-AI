'use client'
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation';

function Header() {
  const path = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className='backdrop-blur-sm frosted-button sticky top-0 z-50 flex p-4 items-center justify-between text-white shadow-lg'>
      <Image src="/logo.svg" width={250} height={200} alt="logo" className='filter brightness-0 invert' />
      <ul className='hidden md:flex gap-6'>
        <li className={`hover:text-blue-500 hover:font-bold transition-all cursor-pointer text-lg
           ${path === '/' || path === '/dashboard' ? 'text-blue-400 font-bold text-xl' : 'text-gray-300'}
           `}
        >Dashboard</li>
        <li className={`hover:text-blue-300 hover:font-bold transition-all cursor-pointer text-lg
          ${path === '/questions' ? 'text-blue-400 font-bold text-xl' : 'text-gray-300'}
          `}>Questions</li>
        <li className={`hover:text-blue-300 hover:font-bold transition-all cursor-pointer text-lg
          ${path === '/upgrade' ? 'text-blue-400 font-bold text-xl' : 'text-gray-300'}
          `}>Upgrade</li>
        <li className={`hover:text-blue-300 hover:font-bold transition-all cursor-pointer text-lg
          ${path === '/how-it-works' ? 'text-blue-400 font-bold text-xl' : 'text-gray-300'}
          `}>How it works</li>
      </ul>
      <div className='frosted-button rounded-full p-3 flex items-center justify-center w-13 h-10'>
        {mounted && <UserButton afterSignOutUrl="/sign-in" />}
      </div>
    </div>
  )
}

export default Header
