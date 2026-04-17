---
title: "测试富文本支持"
date: "2026-04-16"
category: "technical"
tags: ["Test", "Markdown"]
heroImage: "/public/images/kayuya.jpg"
heroLink: "https://www.pixiv.net/artworks/142573289"
excerpt: "测试代码、数学公式、图片等富文本特性"
---

# 富文本支持测试

这是一篇用于验证博客 Markdown 富文本支持特性的文章。

## 1. 代码块高亮测试

下面是一段 Python 代码：

```python
def calculate_energy(mass: float) -> float:
    """计算质能方程"""
    c = 299792458 # 光速，单位 m/s
    energy = mass * (c ** 2)
    return energy

print(f"1kg 物质的能量为: {calculate_energy(1)} 焦耳")
```

## 2. 数学公式测试 (KaTeX)

这里是一个行内公式：爱因斯坦的质能方程是 $E=mc^2$，非常经典。

这里是一个块级公式（微积分定义）：

$$
\frac{\partial f}{\partial x} = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$

再来一个复杂一点的矩阵：

$$
\begin{bmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{bmatrix}
$$

## 3. 图片支持测试

下面是一张通过绝对路径 `/images/...` 引入的图片（该图片存放在根目录的 `public/images/` 文件夹下）：

![测试图片](/images/hero1.jpg)
