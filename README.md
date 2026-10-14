# 算法题库

一个使用 Astro 构建、由 Supabase 实时存储、发布到 GitHub Pages 的个人题库。

## 本地运行

```bash
npm install
npm run dev
```

## 数据库

数据库迁移位于 `supabase/migrations`。在 Supabase SQL Editor 中执行迁移后：

- 公共访客只能读取公开题目。
- `question_admins` 表中的用户可以新增、修改和删除题目。
- 页面通过 Supabase Realtime 接收题目变更。

管理员首次通过 `/admin/` 登录后，将 `supabase/bootstrap-admin.sql` 中的
`ADMIN_EMAIL` 替换为管理员邮箱并在 SQL Editor 中执行。

选项列表在 `src/lib/options.ts` 中维护。

## 图形化录入

打开 `/admin/`，使用管理员邮箱接收登录链接。登录后可在同一页面新建、修改和删除题目。

## 发布

仓库包含 `.github/workflows/deploy.yml`。首次发布前，在 GitHub 仓库的
`Settings > Pages > Build and deployment > Source` 中选择 `GitHub Actions`。
