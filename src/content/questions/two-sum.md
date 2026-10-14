---
title: 两数之和
source: LeetCode
sourceId: "1"
url: https://leetcode.cn/problems/two-sum/
difficulty: 简单
categories:
  - 数组
tags:
  - 哈希表
  - 查找
rating: 5
status: 已掌握
createdAt: 2026-10-14
summary: 哈希表空间换时间的经典入门题，适合建立单次遍历的解题习惯。
---

## 选择理由

这道题能够清楚展示如何利用额外空间，把朴素的二重循环优化为一次遍历。

## 核心思路

遍历数组时，用哈希表保存已经出现过的数字及其下标。对于当前数字 `num`，只需要检查 `target - num` 是否已经出现。

## 易错点

- 应该先查询再写入，避免一个元素被重复使用。
- 哈希表保存的是数字到下标的映射。
- 题目要求返回下标，而不是数字本身。

## 参考代码

```typescript
function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();

  for (let index = 0; index < nums.length; index += 1) {
    const required = target - nums[index];
    const matchedIndex = seen.get(required);

    if (matchedIndex !== undefined) {
      return [matchedIndex, index];
    }

    seen.set(nums[index], index);
  }

  return [];
}
```

## 复杂度

- 时间复杂度：`O(n)`
- 空间复杂度：`O(n)`

