# 算法题库

一个使用 Astro 构建、由 Pages CMS 图形化管理、发布到 GitHub Pages 的个人题库。

## 本地运行

```bash
npm install
npm run dev
```

## 图形化录入

1. 将仓库发布到 GitHub。
2. 打开 [Pages CMS](https://app.pagescms.org) 并使用 GitHub 登录。
3. 选择这个仓库。
4. 点击“题目”并选择“新建”，填写表单后保存。
5. GitHub Actions 会自动重新构建并发布网站。

字段和标签选项在 `.pages.yml` 中维护。

## 发布

仓库包含 `.github/workflows/deploy.yml`。首次发布前，在 GitHub 仓库的
`Settings > Pages > Build and deployment > Source` 中选择 `GitHub Actions`。
