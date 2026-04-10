'use client';

import { useState } from 'react';
import { Icon } from '@iconify-icon/react';

type CodeBlockProps = {
  children: React.ReactNode;
  code: string;
  lang?: string;
};

export function CodeBlock({ children, code, lang }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  return (
    <div className='code-block-wrapper'>
      <div className='bg-bg-3 text-text-2 flex items-center justify-between rounded-t-lg px-4 py-2 text-xs font-medium'>
        <span>{lang || 'plain text'}</span>
        <button
          type='button'
          onClick={handleCopy}
          className='code-block-copy-btn'
          aria-label='Copy code'
        >
          {copied ? <Icon icon='lucide:check' /> : <Icon icon='lucide:copy' />}
        </button>
      </div>
      {children}
    </div>
  );
}
