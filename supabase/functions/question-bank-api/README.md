# question-bank-api

给其他 AI / 自动化脚本使用的题库读写接口。接口在 Supabase Edge Function 中运行，使用服务端角色访问数据库，但外部只能通过自定义 `QUESTION_BANK_API_KEY` 调用，不会暴露 `service_role`。

## 基础地址

```text
https://gpjjmmdqyxvhdxkwmayh.supabase.co/functions/v1/question-bank-api
```

所有请求都需要带 API Key，二选一：

```http
x-api-key: <QUESTION_BANK_API_KEY>
```

或

```http
Authorization: Bearer <QUESTION_BANK_API_KEY>
```

响应统一为 JSON，并允许跨域访问。

## 接口

### GET /health

检查服务是否在线。

```json
{ "service": "question-bank-api", "ok": true }
```

### GET /options

读取可用的题目来源、难度、适用级别和知识点标签分组。新增或修改题目时，相关字段应优先从这里的选项中选择。

```json
{
  "sources": ["LeetCode", "洛谷", "USACO"],
  "difficulties": ["入门", "普及-", "*800"],
  "levels": ["GESP 1级", "CSP-J", "CSP-S"],
  "tagGroups": [
    { "label": "图论", "tags": ["图论", "拓扑排序"] }
  ]
}
```

### GET /questions

读取题目列表，按收录日期倒序。

可选查询参数：

- `published=true|false`：只返回已发布或未发布的题目。
- `limit=1..1000`：限制返回数量，默认返回全部。

```json
{
  "data": [
    {
      "id": "995ac6b0-feb9-40d1-93a5-f2984a4c04dd",
      "title": "二分查找",
      "sources": ["洛谷"],
      "source_id": "P2249",
      "original_url": "https://www.luogu.com.cn/problem/P2249",
      "difficulties": ["普及-"],
      "levels": ["CSP-J"],
      "tags": ["二分"],
      "statement": "## 题目描述\n...",
      "solution": "## 核心思路\n...",
      "published": true,
      "created_at": "2026-10-15T00:00:00.000Z",
      "updated_at": "2026-10-15T00:00:00.000Z"
    }
  ]
}
```

### GET /questions/:id

读取单道题。不存在时返回 `404`。

### POST /questions

新建题目。必填字段只有 `title`，其余字段可省略。

```json
{
  "title": "二分查找",
  "sources": ["洛谷"],
  "source_id": "P2249",
  "original_url": "https://www.luogu.com.cn/problem/P2249",
  "difficulties": ["普及-"],
  "levels": ["CSP-J"],
  "tags": ["二分"],
  "statement": "## 题目描述\n...",
  "solution": "## 核心思路\n...",
  "published": true,
  "created_at": "2026-10-15"
}
```

`created_at` 可省略，数据库会自动设为当前时间；如果填写，需为可解析的日期，会转换成 ISO 时间。

### PATCH /questions/:id

部分更新，只提交需要修改的字段。至少提交一个字段。不存在时返回 `404`。

```json
{ "tags": ["二分", "前缀和"], "published": false }
```

### DELETE /questions/:id

删除题目。

## 字段说明

- `title`：标题，必填字符串。
- `sources`：来源数组，例如 `["洛谷"]`。
- `source_id`：原题编号，例如 `"P2249"`，可为 `null`。
- `original_url`：原题链接，可为 `null`。
- `difficulties`：难度数组。
- `levels`：适用级别数组，可为空数组。
- `tags`：知识点标签数组，可为空数组。
- `statement`：题意，Markdown 文本。
- `solution`：解题思路，Markdown 文本。
- `published`：是否发布，布尔值。
- `created_at`：收录日期，ISO 时间。

`sources`、`difficulties`、`levels`、`tags` 都要求传字符串数组。`statement` 和 `solution` 中使用 LaTeX 公式时直接写 `$...$`，与网页端渲染规则一致。

## 部署和密钥

```powershell
$env:npm_config_cache = "$PWD\.npm-cache"
npx --yes supabase@latest login
npx --yes supabase@latest link --project-ref gpjjmmdqyxvhdxkwmayh
npx --yes supabase@latest secrets set QUESTION_BANK_API_KEY=<自定义密钥>
npx --yes supabase@latest functions deploy question-bank-api --project-ref gpjjmmdqyxvhdxkwmayh --no-verify-jwt
```

`QUESTION_BANK_API_KEY` 只用于这个接口，与 Supabase 的 `service_role` 不同，可单独轮换。
