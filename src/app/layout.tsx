import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import Layout from '@/layout';

export const metadata: Metadata = {
  title: {
    template: '%s | 久言',
    default: '久言',
  },
  description: '久言不旧，言犹在耳',
  authors: [{ name: '九言', url: 'https://9yan.cn' }],
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='zh-CN'>
      <body className='bg-background text-foreground transition-colors duration-300'>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
