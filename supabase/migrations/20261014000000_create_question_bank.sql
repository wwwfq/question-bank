create table public.question_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) > 0),
  sources text[] not null default '{}',
  source_id text,
  original_url text,
  difficulties text[] not null default '{}',
  levels text[] not null default '{}',
  tags text[] not null default '{}',
  statement text not null default '',
  solution text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index questions_created_at_idx on public.questions (created_at desc);
create index questions_sources_idx on public.questions using gin (sources);
create index questions_difficulties_idx on public.questions using gin (difficulties);
create index questions_levels_idx on public.questions using gin (levels);
create index questions_tags_idx on public.questions using gin (tags);

create or replace function public.is_question_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.question_admins
    where user_id = auth.uid()
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger questions_set_updated_at
before update on public.questions
for each row execute function public.set_updated_at();

alter table public.question_admins enable row level security;
alter table public.questions enable row level security;

create policy "Published questions are public"
on public.questions
for select
using (published or public.is_question_admin());

create policy "Question admins can insert"
on public.questions
for insert
to authenticated
with check (public.is_question_admin());

create policy "Question admins can update"
on public.questions
for update
to authenticated
using (public.is_question_admin())
with check (public.is_question_admin());

create policy "Question admins can delete"
on public.questions
for delete
to authenticated
using (public.is_question_admin());

grant select on public.questions to anon, authenticated;
grant insert, update, delete on public.questions to authenticated;
grant execute on function public.is_question_admin() to anon, authenticated;

alter publication supabase_realtime add table public.questions;

insert into public.questions (
  title,
  sources,
  difficulties,
  levels,
  tags,
  statement,
  solution,
  created_at
)
values (
  '1',
  array['LeetCode'],
  array['入门'],
  array[]::text[],
  array['字符串'],
  $statement$# P11963 [GESP202503 六级] 环线

## 题目背景

对应的选择、判断题：<[https://ti.luogu.com.cn/problemset/1178](https://ti.luogu.com.cn/problemset/1178)>

## 题目描述

小 A 喜欢坐地铁。地铁环线有 $n$ 个车站，依次以 $1,2,\cdots,n$ 标号。车站 $i\ (1\leq i<n)$ 的下一个车站是车站 $i+1$。特殊地，车站 $n$ 的下一个车站是车站 $1$。

小 A 会从某个车站出发，乘坐地铁环线到某个车站结束行程，这意味着小 A 至少会经过一个车站。小 A 不会经过一个车站多次。当小 A 乘坐地铁环线经过车站 $i$ 时，小 A 会获得 $a_i$ 点快乐值。请你安排小 A 的行程，选择出发车站与结束车站，使得获得的快乐值总和最大。

## 输入格式

第一行，一个正整数 $n$，表示车站的数量。

第二行，$n$ 个整数 $a_i$，分别表示经过每个车站时获得的快乐值。

## 输出格式

一行，一个整数，表示小 A 能获得的最大快乐值。

## 输入输出样例 #1

### 输入 #1

```
4
-1 2 3 0
```

### 输出 #1

```
5
```

## 输入输出样例 #2

### 输入 #2

```
5
-3 4 -5 1 3
```

### 输出 #2

```
5
```

## 说明/提示

对于 $20$ 的测试点，保证 $1\leq n\leq 200$。

对于 $40$ 的测试点，保证 $1\leq n\leq 2000$。

对于所有测试点，保证 $1\leq n\leq 2\times 10^5$，$-10^9\leq a_i\leq 10^9$。$statement$,
  '$123+245=111$',
  '2026-10-14T00:00:00+08:00'
);
