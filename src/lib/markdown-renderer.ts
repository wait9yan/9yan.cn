import { marked } from 'marked';
import { codeToHtml, getSingletonHighlighter } from 'shiki';
import type { BundledLanguage } from 'shiki';
import type { Tokens } from 'marked';

export type TocItem = { id: string; text: string; level: number };

export interface MarkdownRenderResult {
  html: string;
  toc: TocItem[];
}

const SHIKI_LIGHT_THEME = 'github-light';
const SHIKI_DARK_THEME = 'github-dark';
const FALLBACK_CODE_LANGUAGE = 'text';

void getSingletonHighlighter({
  themes: [SHIKI_LIGHT_THEME, SHIKI_DARK_THEME],
});

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function normalizeCodeLanguage(lang?: string): string {
  return lang?.trim().toLowerCase() || FALLBACK_CODE_LANGUAGE;
}

async function renderHighlightedCode(
  code: string,
  lang?: string,
): Promise<{ html: string; lang: string }> {
  const requestedLang = normalizeCodeLanguage(lang);

  try {
    const html = await codeToHtml(code, {
      lang: requestedLang as BundledLanguage,
      themes: {
        light: SHIKI_LIGHT_THEME,
        dark: SHIKI_DARK_THEME,
      },
    });

    return {
      html,
      lang: requestedLang,
    };
  } catch {
    const html = await codeToHtml(code, {
      lang: FALLBACK_CODE_LANGUAGE,
      themes: {
        light: SHIKI_LIGHT_THEME,
        dark: SHIKI_DARK_THEME,
      },
    });

    return {
      html,
      lang: requestedLang,
    };
  }
}

function injectCodeBlockDataAttributes(html: string, code: string, lang: string): string {
  const escapedCode = escapeHtmlAttribute(code);
  const escapedLang = escapeHtmlAttribute(lang);

  return html.replace(
    /<pre([^>]*)>/,
    `<pre$1 data-code="${escapedCode}" data-lang="${escapedLang}">`,
  );
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

  const codeBlockMap = new Map<string, string>();
  let codeBlockIndex = 0;

  await Promise.all(
    tokens.map(async (token) => {
      if (token.type !== 'code') return;

      const originalCode = token.text;
      const key = `__SHIKI_CODE_${codeBlockIndex}__`;
      codeBlockIndex += 1;
      const highlighted = await renderHighlightedCode(originalCode, token.lang);

      codeBlockMap.set(
        key,
        injectCodeBlockDataAttributes(highlighted.html, originalCode, highlighted.lang),
      );
      token.text = key;
    }),
  );

  const renderer = new marked.Renderer();

  renderer.heading = (token: Tokens.Heading) => {
    const id = slugify(token.text || '');
    return `<h${token.depth} id="${id}">${token.text}</h${token.depth}>`;
  };

  renderer.code = (token: Tokens.Code) => {
    const codeHtml = codeBlockMap.get(token.text);
    if (codeHtml) {
      return codeHtml;
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
