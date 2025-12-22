'use client';

import { useState } from 'react';
import { DialogModal } from '@/components/DialogModel';
import Image from 'next/image';

type MarkdownImageProps = {
  src: string;
  alt?: string;
  title?: string;
};

export function MarkdownImage({ src, alt = '', title = '' }: MarkdownImageProps) {
  const [display, setDisplay] = useState(false);

  return (
    <>
      <Image
        src={src}
        alt={alt}
        title={title}
        width={1000}
        height={1000}
        loading='lazy'
        onClick={() => setDisplay(true)}
        className='cursor-pointer transition-opacity hover:opacity-80'
      />
      <DialogModal
        open={display}
        onClose={() => setDisplay(false)}
        className='max-w-none bg-transparent p-0'
      >
        <Image
          src={src}
          alt={alt}
          className='max-h-[90vh] max-w-full rounded-2xl object-contain'
          width={1000}
          height={1000}
        />
      </DialogModal>
    </>
  );
}
