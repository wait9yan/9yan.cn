'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Icon } from '@iconify-icon/react';

const linkList = [
  {
    label: 'Github',
    href: 'https://github.com/wait9yan',
    icon: <Icon icon='lucide:github' />,
  },
  {
    label: '哔哩哔哩',
    href: 'https://space.bilibili.com/396767727',
    icon: <Icon icon='ri:bilibili-line' />,
  },
  {
    label: 'Email',
    href: 'mailto:wait9yan@gmail.com',
    icon: <Icon icon='lucide:mail' />,
  },
];

export default function Home() {
  return (
    <>
      <motion.div
        whileHover={{ scale: 1.04 }}
        className='border-bg-3 ring-bg-3 hover:ring-primary-2 hover:border-primary-2 ring-offset-bg-2 h-32 w-32 overflow-hidden rounded-full border-2 ring-8 ring-offset-2'
      >
        <Image
          src='/images/avatar.png'
          alt='avatar'
          width={128}
          height={128}
        />
      </motion.div>
      <h2 className='text-text-1 mt-10 text-2xl font-bold'>
        九言<span className='text-xl'>@wait9yan</span>
      </h2>
      <p className='text-text-2 mt-2 text-sm'>Hi 👋，我是一个前端开发工程师（2024 ～ 至今）</p>
      <div className='mt-10 flex justify-center gap-2'>
        {linkList.map((item) => (
          <motion.button
            key={item.href}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.open(item.href, '_blank')}
            rel='noopener noreferrer'
            className='bg-primary-3 text-bg-1 flex h-9 w-9 items-center justify-center rounded-full'
          >
            {item.icon}
          </motion.button>
        ))}
      </div>
    </>
  );
}
