export type QuestionData = {
  title: string;
  source: string;
  sourceId?: string;
  url?: string;
  difficulty: '简单' | '中等' | '困难';
  categories: string[];
  tags: string[];
  rating: number;
  status: '待复习' | '已掌握' | '重点';
  createdAt: string;
  summary: string;
};

export type Question = QuestionData & {
  slug: string;
};

type MarkdownModule = {
  frontmatter: QuestionData;
};

const modules = import.meta.glob<MarkdownModule>('/src/content/questions/*.md', {
  eager: true,
});

export const questions: Question[] = Object.entries(modules)
  .map(([path, module]) => ({
    ...module.frontmatter,
    slug: path.split('/').pop()?.replace(/\.md$/, '') ?? '',
  }))
  .sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

export const sources = [...new Set(questions.map((question) => question.source))].sort();
export const difficulties = ['简单', '中等', '困难'] as const;
export const allTags = [...new Set(questions.flatMap((question) => question.tags))].sort();

