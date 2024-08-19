'use client'
import { useRouter } from 'next/navigation';
import React, { FC } from 'react'
import { Button } from '../ui/shadcn/button';
import { ArrowLeft, ChevronLeft } from 'react-feather';

export const BackButton: FC = () => {
    const router = useRouter()
    
    return (
      <div
        onClick={router.back}
        className="z-50 flex items-center justify-center w-10 h-12 bg-[#F5F5F5] rounded-lg cursor-pointer"
      >
        <ChevronLeft size={36} />
      </div>
    );
}