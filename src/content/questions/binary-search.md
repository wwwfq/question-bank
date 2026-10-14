---
title: 二分查找
source: LeetCode
sourceId: "704"
url: https://leetcode.cn/problems/binary-search/
difficulty: 简单
categories:
  - 数组
tags:
  - 二分查找
  - 边界
rating: 4
status: 重点
createdAt: 2026-10-13
summary: 练习闭区间写法和循环不变量，重点是统一左右边界的定义。
---

## 选择理由

二分查找本身并不复杂，但边界定义不统一很容易导致死循环或漏掉答案。

## 核心思路

将搜索范围定义为闭区间 `[left, right]`。只要 `left <= right`，区间中仍然存在需要检查的元素。

## 易错点

- 闭区间写法的循环条件是 `left <= right`。
- 当中间值过小时，应更新为 `left = middle + 1`。
- 计算中点时使用 `left + Math.floor((right - left) / 2)`。

## 参考代码

```typescript
function search(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const middle = left + Math.floor((right - left) / 2);

    if (nums[middle] === target) return middle;
    if (nums[middle] < target) left = middle + 1;
    else right = middle - 1;
  }

  return -1;
}
```

## 复杂度

- 时间复杂度：`O(log n)`
- 空间复杂度：`O(1)`

