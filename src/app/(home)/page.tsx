'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { Icon } from '@iconify-icon/react';
import Button from '@/components/Button';

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
    <AnimatePresence>
      <motion.div
        key='home-content'
        initial={{ height: 0, padding: 0 }}
        animate={{
          height: 'auto',
          padding: '16px 24px',
          transition: {
            type: 'tween',
            ease: 'linear',
            duration: 0.3,
            delay: 0.3,
          },
        }}
        exit={{
          height: 0,
          padding: 0,
          transition: {
            height: { duration: 0.3 },
            padding: { duration: 0.3 },
            borderRadius: { duration: 0.3 },
          },
        }}
        className='bg-bg-1 flex w-full flex-col items-center overflow-hidden rounded-b-3xl'
      >
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
        <p className='text-text-2 mt-2 text-sm'>Hi 👋，我是一个软件开发工程师</p>
        <p className='text-text-2 text-sm'>我想，永远不要停止学习</p>
        <div className='mt-10 flex justify-center gap-2'>
          {linkList.map((item) => (
            <Button
              key={item.label}
              onClick={() => window.open(item.href, '_blank')}
              className='h-9 w-9'
            >
              {item.icon}
            </Button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
