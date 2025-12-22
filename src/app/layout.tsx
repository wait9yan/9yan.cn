import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import Layout from '@/layout';

export const metadata: Metadata = {
  title: {
    template: '%s | 九言',
    default: '九言开发手记',
  },
  description: '我想，永远不要停止学习',
  authors: [{ name: '九言', url: 'https://9yan.cn' }],
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang='zh-CN'
      data-theme='gray'
    >
      <body className='bg-background text-foreground transition-colors duration-300'>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
