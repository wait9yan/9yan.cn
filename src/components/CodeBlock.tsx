'use client';

import { useState } from 'react';
import { Icon } from '@iconify-icon/react';

type CodeBlockProps = {
  children: React.ReactNode;
  code: string;
};

export function CodeBlock({ children, code }: CodeBlockProps) {
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
      <button
        type='button'
        onClick={handleCopy}
        className='code-block-copy-btn'
        aria-label='Copy code'
      >
        {copied ? <Icon icon='lucide:check' /> : <Icon icon='lucide:copy' />}
      </button>
      {children}
    </div>
  );
}
