export type RawQuestionData = {
  title: string;
  source: string | string[];
  sourceId?: string;
  url?: string;
  difficulty: string | string[];
  categories?: string[];
  tags?: string[];
  rating?: number;
  createdAt: string;
  summary?: string;
};

export type QuestionData = {
  title: string;
  source: string;
  sourceValues: string[];
  sourceId?: string;
  url?: string;
  difficulty: string;
  difficultyValues: string[];
  categories: string[];
  tags: string[];
  rating: number | null;
  createdAt: string;
  summary: string;
};

export type Question = QuestionData & {
  slug: string;
};

type MarkdownModule = {
  frontmatter: RawQuestionData;
};

function toList(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value.filter(Boolean);
  return value ? [value] : [];
}

export function normalizeQuestionData(frontmatter: RawQuestionData): QuestionData {
  const sourceValues = toList(frontmatter.source);
  const difficultyValues = toList(frontmatter.difficulty);

  return {
    ...frontmatter,
    source: sourceValues.join('、') || '其他',
    sourceValues,
    difficulty: difficultyValues.join('、') || '未分类',
    difficultyValues,
    categories: frontmatter.categories ?? [],
    tags: frontmatter.tags ?? [],
    rating: frontmatter.rating ?? null,
    summary: frontmatter.summary ?? '',
  };
}

const modules = import.meta.glob<MarkdownModule>('/src/content/questions/*.md', {
  eager: true,
});

export const questions: Question[] = Object.entries(modules)
  .map(([path, module]) => ({
    ...normalizeQuestionData(module.frontmatter),
    slug: path.split('/').pop()?.replace(/\.md$/, '') ?? '',
  }))
  .sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

export const sources = [...new Set(questions.flatMap((question) => question.sourceValues))].sort();
export const difficulties = [
  ...new Set(questions.flatMap((question) => question.difficultyValues)),
].sort();
export const allTags = [...new Set(questions.flatMap((question) => question.tags))].sort();

