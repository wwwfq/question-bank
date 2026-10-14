import { Marked } from 'marked';
import markedKatex from 'marked-katex-extension';

const markdown = new Marked(
  markedKatex({
    nonStandard: true,
    throwOnError: false,
  }),
);

export function renderRichText(value: string): string {
  if (!value.trim()) return '';
  return markdown.parse(value, { async: false }) as string;
}
