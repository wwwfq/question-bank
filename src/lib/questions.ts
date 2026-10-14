export type Question = {
  id: string;
  title: string;
  sources: string[];
  source_id: string | null;
  original_url: string | null;
  difficulties: string[];
  levels: string[];
  tags: string[];
  statement: string;
  solution: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type QuestionInput = Omit<Question, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
};

export function formatQuestionDate(value: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value));
}

export function primaryValue(values: string[], fallback: string): string {
  return values.join('、') || fallback;
}

