import { marked } from 'marked';
import type { Tokens } from 'marked';

export type TocItem = { id: string; text: string; level: number };

export interface MarkdownRenderResult {
  html: string;
  toc: TocItem[];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export async function renderMarkdown(markdown: string): Promise<MarkdownRenderResult> {
  const tokens = marked.lexer(markdown);

  let removedFirstH1 = false;
  const indicesToRemove: number[] = [];
  tokens.forEach((token, index) => {
    if (token.type === 'heading' && token.depth === 1 && !removedFirstH1) {
      removedFirstH1 = true;
      indicesToRemove.push(index);
    }
  });

  for (let i = indicesToRemove.length - 1; i >= 0; i--) {
    tokens.splice(indicesToRemove[i], 1);
  }

  const toc: TocItem[] = [];
  function extractHeadings(tokenList: typeof tokens) {
    for (const token of tokenList) {
      if (token.type === 'heading' && token.depth >= 2 && token.depth <= 3) {
        const text = token.text;
        const id = slugify(text);
        toc.push({ id, text, level: token.depth });
      }
      if ('tokens' in token && token.tokens) {
        extractHeadings(token.tokens as typeof tokens);
      }
    }
  }
  extractHeadings(tokens);

  const codeBlockMap = new Map<string, { html: string; original: string }>();

  for (const token of tokens) {
    if (token.type === 'code') {
      const codeToken = token as Tokens.Code;
      const originalCode = codeToken.text;
      const key = `__SHIKI_CODE_${codeBlockMap.size}__`;

      codeBlockMap.set(key, { html: '', original: originalCode });
      codeToken.text = key;
    }
  }

  const renderer = new marked.Renderer();

  renderer.heading = (token: Tokens.Heading) => {
    const id = slugify(token.text || '');
    return `<h${token.depth} id="${id}">${token.text}</h${token.depth}>`;
  };

  renderer.code = (token: Tokens.Code) => {
    const codeData = codeBlockMap.get(token.text);
    if (codeData) {
      const escapedCode = codeData.original
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      if (codeData.html) {
        return `<pre data-code="${escapedCode}">${codeData.html}</pre>`;
      }
      return `<pre data-code="${escapedCode}"><code>${codeData.original}</code></pre>`;
    }
    return `<code>${token.text}</code>`;
  };

  renderer.listitem = (token: Tokens.ListItem) => {
    const inner = token.tokens ? (marked.parser(token.tokens) as string) : token.text;

    if (token.task) {
      const checkbox = token.checked
        ? '<input type="checkbox" checked disabled />'
        : '<input type="checkbox" disabled />';
      return `<li class="task-list-item">${checkbox} ${inner}</li>\n`;
    }

    return `<li>${inner}</li>\n`;
  };

  marked.use({
    renderer,
  });
  const html = (marked.parser(tokens) as string) || '';

  return { html, toc };
}
