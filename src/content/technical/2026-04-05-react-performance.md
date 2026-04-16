---
title: "React 性能优化最佳实践"
date: "2026-04-05"
category: "technical"
tags: ["React", "JavaScript", "Performance"]
heroImage: "/assets/hero1.jpg"
heroLink: "https://www.pixiv.net/en/artworks/142350190"
excerpt: "在大型 React 应用中，性能优化至关重要。本文分享了一系列实用的优化技巧和最佳实践。"
---

# React 性能优化

## 1. 减少不必要渲染

- 使用 `React.memo` 包裹纯展示组件
- 合理拆分组件，避免大组件全量重渲染
- 使用稳定的 `key`，避免列表抖动

## 2. 缓存计算和回调

- 用 `useMemo` 缓存高开销计算
- 用 `useCallback` 稳定函数引用

## 3. 代码分割

- 用路由级懒加载降低首屏体积
- 按页面拆包，提升首屏加载速度