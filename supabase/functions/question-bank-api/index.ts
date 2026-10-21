import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-api-key, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
};

const sourceOptions = [
  'LeetCode',
  '洛谷',
  '小图灵 OJ',
  'Codeforces',
  '牛客',
  'AtCoder',
  'USACO',
  'COCI 克罗地亚',
  'ICPC',
  'CCPC',
  '蓝桥杯',
  'GESP',
  'NOIP',
  'CSP-J',
  'CSP-S',
];

const difficultyOptions = [
  '入门',
  '普及-',
  '普及',
  '普及+/提高-',
  '提高',
  '提高+/省选-',
  '省选/NOI-',
  'NOI/NOI+/CTS',
  ...Array.from({ length: 25 }, (_, index) => `*${800 + index * 100}`),
];

const levelOptions = [
  ...Array.from({ length: 8 }, (_, index) => `GESP ${index + 1}级`),
  'CSP-J',
  'CSP-S',
  'NOIP',
  '省选',
  'NOI',
];

const tagGroups = [
  {
    label: '字符串',
    tags: ['字符串', '字符串 string', '字典树 Trie', 'AC 自动机', 'KMP 算法', '后缀自动机 SAM'],
  },
  {
    label: '动态规划',
    tags: [
      '动态规划 DP',
      '背包 DP',
      '数位 DP',
      '区间 DP',
      '树形 DP',
      '线性 DP',
      '状压 DP',
      '斜率优化 DP',
      '四边形不等式优化 DP',
      '矩阵加速',
    ],
  },
  {
    label: '搜索',
    tags: ['搜索', '广度优先搜索 BFS', '深度优先搜索 DFS', '模拟退火', 'A* 算法'],
  },
  {
    label: '图论',
    tags: [
      '图论',
      '图论建模',
      '拓扑排序',
      '最短路 shortest paths',
      '最小生成树 MST',
      '负权图',
      '2-SAT',
      '强连通分量',
      'Tarjan',
      '二分图',
      'Kruskal 重构树',
      '树论',
      '点分治',
      '树上启发式合并',
      '树的遍历',
      '最近公共祖先 LCA',
      '树链剖分',
      '基环树',
    ],
  },
  {
    label: '网络流',
    tags: ['网络流', '最小割', '费用流'],
  },
  {
    label: '计算几何',
    tags: ['计算几何', '凸包', '平面几何', '旋转卡壳', '极角排序'],
  },
  {
    label: '数据结构',
    tags: [
      '线段树',
      '并查集 dsu',
      '堆',
      '树状数组',
      '树套树',
      '李超线段树',
      'cdq 分治',
      '栈',
      '队列',
      '单调队列',
      '分块',
      '前缀和',
      'ST 表',
      '差分',
      '莫队',
      '扫描线',
      '离散化',
      '启发式合并',
      '离线处理',
    ],
  },
  {
    label: '博弈论',
    tags: ['博弈论', 'SG 函数'],
  },
  {
    label: '数学',
    tags: ['数学 math', '线性代数', '高斯消元', '线性基', '概率论', '期望'],
  },
  {
    label: '数论',
    tags: ['数论', '逆元', 'Lucas 定理', '欧拉函数', '整除分块', '线性筛法', '莫比乌斯反演'],
  },
  {
    label: '组合数学',
    tags: ['组合数学', '排列组合', '二项式定理', '康托展开', '鸽笼原理', '容斥原理', '生成函数'],
  },
  {
    label: '基础算法',
    tags: [
      '模拟',
      '贪心 greedy',
      '反悔贪心',
      '暴力 brute force',
      '递推',
      '倍增',
      '二分',
      '三分',
      '递归',
      '枚举',
      '分治',
      '排序 sortings',
      '位运算',
      '高精度',
      '构造',
      '双指针 two-pointer',
      '随机化',
    ],
  },
];

type QuestionRow = {
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

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

function apiKeyFromRequest(request: Request) {
  const headerValue = request.headers.get('x-api-key');
  if (headerValue) return headerValue;
  const authorization = request.headers.get('authorization');
  if (authorization?.toLowerCase().startsWith('bearer ')) return authorization.slice(7).trim();
  return '';
}

function requireApiKey(request: Request): Response | null {
  const expected = Deno.env.get('QUESTION_BANK_API_KEY');
  if (!expected) return json({ error: 'Server API key is not configured.' }, 500);
  const provided = apiKeyFromRequest(request);
  if (!provided || provided !== expected) return json({ error: 'Unauthorized.' }, 401);
  return null;
}

function splitPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'question-bank-api') segments.shift();
  return segments;
}

function stringArray(value: unknown, field: string): string[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new Error(`${field} must be an array of strings.`);
  return value.map((item) => {
    if (typeof item !== 'string') throw new Error(`${field} must contain only strings.`);
    return item.trim();
  }).filter(Boolean);
}

function nullableText(value: unknown, field: string): string | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') throw new Error(`${field} must be a string.`);
  return value.trim() || null;
}

function requiredText(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${field} is required.`);
  return value.trim();
}

function booleanValue(value: unknown): boolean | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'boolean') throw new Error('published must be a boolean.');
  return value;
}

function createdAtValue(value: unknown): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) throw new Error('created_at must be a valid date.');
  return parsed.toISOString();
}

function createValues(body: Record<string, unknown>) {
  return {
    title: requiredText(body.title, 'title'),
    sources: stringArray(body.sources, 'sources'),
    source_id: nullableText(body.source_id, 'source_id'),
    original_url: nullableText(body.original_url, 'original_url'),
    difficulties: stringArray(body.difficulties, 'difficulties'),
    levels: stringArray(body.levels, 'levels'),
    tags: stringArray(body.tags, 'tags'),
    statement: typeof body.statement === 'string' ? body.statement : '',
    solution: typeof body.solution === 'string' ? body.solution : '',
    published: booleanValue(body.published) ?? true,
    ...(createdAtValue(body.created_at) ? { created_at: createdAtValue(body.created_at) } : {}),
  };
}

function patchValues(body: Record<string, unknown>) {
  const values: Record<string, unknown> = {};
  if ('title' in body) values.title = requiredText(body.title, 'title');
  if ('sources' in body) values.sources = stringArray(body.sources, 'sources');
  if ('source_id' in body) values.source_id = nullableText(body.source_id, 'source_id');
  if ('original_url' in body) values.original_url = nullableText(body.original_url, 'original_url');
  if ('difficulties' in body) values.difficulties = stringArray(body.difficulties, 'difficulties');
  if ('levels' in body) values.levels = stringArray(body.levels, 'levels');
  if ('tags' in body) values.tags = stringArray(body.tags, 'tags');
  if ('statement' in body) {
    if (typeof body.statement !== 'string') throw new Error('statement must be a string.');
    values.statement = body.statement;
  }
  if ('solution' in body) {
    if (typeof body.solution !== 'string') throw new Error('solution must be a string.');
    values.solution = body.solution;
  }
  if ('published' in body) values.published = booleanValue(body.published);
  if ('created_at' in body) values.created_at = createdAtValue(body.created_at);
  return values;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: 'Supabase environment variables are not configured.' }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const url = new URL(request.url);
  const segments = splitPath(url.pathname);
  const resource = segments[0] ?? '';
  const id = segments[1] ?? '';

  try {
    if (request.method === 'GET' && resource === 'health') {
      return json({ service: 'question-bank-api', ok: true });
    }

    if (request.method === 'GET' && resource === 'options') {
      return json({ sources: sourceOptions, difficulties: difficultyOptions, levels: levelOptions, tagGroups });
    }

    if (request.method === 'GET' && resource === 'questions') {
      let query = supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (id) {
        const { data, error } = await query.eq('id', id).maybeSingle<QuestionRow>();
        if (error) return json({ error: error.message }, 400);
        if (!data) return json({ error: 'Question not found.' }, 404);
        return json({ data });
      }

      if (url.searchParams.get('published') === 'true') query = query.eq('published', true);
      if (url.searchParams.get('published') === 'false') query = query.eq('published', false);
      const limit = Number(url.searchParams.get('limit'));
      if (Number.isInteger(limit) && limit > 0 && limit <= 1000) query = query.limit(limit);

      const { data, error } = await query.returns<QuestionRow[]>();
      if (error) return json({ error: error.message }, 400);
      return json({ data });
    }

    if (request.method === 'POST' && resource === 'questions') {
      const body = await request.json() as Record<string, unknown>;
      const { data, error } = await supabase
        .from('questions')
        .insert(createValues(body))
        .select()
        .single<QuestionRow>();
      if (error) return json({ error: error.message }, 400);
      return json({ data }, 201);
    }

    if (request.method === 'PATCH' && resource === 'questions' && id) {
      const body = await request.json() as Record<string, unknown>;
      const values = patchValues(body);
      if (Object.keys(values).length === 0) return json({ error: 'No fields to update.' }, 400);
      const { data, error } = await supabase
        .from('questions')
        .update(values)
        .eq('id', id)
        .select()
        .maybeSingle<QuestionRow>();
      if (error) return json({ error: error.message }, 400);
      if (!data) return json({ error: 'Question not found.' }, 404);
      return json({ data });
    }

    if (request.method === 'DELETE' && resource === 'questions' && id) {
      const { error } = await supabase.from('questions').delete().eq('id', id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: 'Not found.' }, 404);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Invalid request.' }, 400);
  }
});
