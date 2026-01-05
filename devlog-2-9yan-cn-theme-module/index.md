---
title: 开发日志2：构建一个支持“双维度”切换的主题模块
date: 2026-01-03
categories:
  - 技术
  - 开发日志
  - 9yan.cn
---

# 开发日志2：构建一个支持“双维度”切换的主题模块

我简单实现了一个支持外观切换（亮色/暗色/自动）和色调切换的主题模块，在此分享实现时的思考与技术细节。

![主题系统](assets/palette-switcher-20251228105221-djbwemg.png "主题系统")

## 前期思考

### 提供主题切换功能？

在考虑是否提供主题切换功能时，我参考了 Apple Developer 中的 [《深色模式》的最佳实践](https://developer.apple.com/cn/design/human-interface-guidelines/dark-mode)：

> **避免提供 App 特定的外观设置。** App 特定的外观模式选项会额外增加用户的工作量，因为他们必须调整多项设置才能得到想要的外观。更糟糕的是，用户可能会觉得你的 App 是有问题的，因为 App 没有使用他们选择的系统范围外观。

从制作产品的角度出发，确实不应该因特定的外观模式而增加用户的工作量。但我又希望浏览博客的用户能体验到不同的视觉风格，因此我采用了折中方案：

1. 根据用户浏览器/系统的外观设置 `prefers-color-scheme`，自动提供亮色或深色模式。

2. 每次进入页面时，系统会从主题中随机选择一套主色调，让每次访问都有新鲜感。

并且在此基础上，隐藏主题切换按钮。用户需在页面底部连续点击版本号 `v0.1.0` 7 次（致敬 Android 开发者模式）才会唤起主题配置面板。这既满足了极客朋友探索的需求，又不会干扰普通用户的阅读体验。

### 主题配色如何设计？

为了确保在不同色调下都能保持良好的视觉体验，不可能简单地定义死颜色，而是选择**语义化抽象**的方式来设计配色：

我不直接使用 `red`​ 或 `#FF0000`​，而是定义了 `bg`​（背景色）、`primary`​（主色）、`text`​（文字色）和 `accent`（强调色）。

![主题配色表](assets/9yan-color-table-20260105111950-ru4gcl5.png "主题配色表")

## 技术实现

### 架构设计

主题系统采用双维度分离设计：

- **外观：**  `light`​ | `dark`​ | `auto`，控制明暗模式。
- 色调 **：**  `gray`​ | `blue`​ | `purple`​ | `red`​ | `brown`​ | `green`​ | `random`，控制色相。

两个维度正交组合，6 套配色 × 2 种外观，理论上拥有 12 种主题变体，且逻辑互不干扰。

### 状态管理

使用 React Context 管理主题状态，核心在于区分  **“用户意图”**  和  **“实际生效值”** ：

```ts
interface AppearanceContextType {
  appearance: Appearance;        // 用户选择：light | dark | auto
  setAppearance: (appearance: Appearance) => void;
  actualAppearance: 'light' | 'dark';  // 实际生效的外观
}

interface PaletteContextType {
  palette: Palette;              // 用户选择：可能是 random
  setPalette: (palette: Palette) => void;
  actualPalette: Exclude<Palette, 'random'>;  // 实际生效的配色
}
```

这样设计的好处是 UI 设置面板可以正确回显用户的选择，如 `auto`​ 或 `random`​。而底层组件只需要消费 `actual` 值，无需关心复杂的判断逻辑。

### CSS 变量驱动

主题通过 `data-theme`​ 属性 + `.dark`​ 类名组合切换，CSS 变量定义在 `globals.css`：

```css
/* 定义蓝色主题的基础变量 */
[data-theme='blue'] {
  --bg-1: #ffffff;
  --primary-2: #3b82f6; /* 亮色下的蓝 */
  /* ... */
}

/* 蓝色主题叠加暗色模式 */
[data-theme='blue'].dark {
  --bg-1: #0f172a;      /* 深色背景 */
  --primary-2: #60a5fa; /* 暗色下的蓝（降低饱和度/提高亮度以适配黑底） */
  /* ... */
}
```

Tailwind (v4) 通过 `@theme` 映射这些变量：

```css
@theme {
  --color-bg-1: var(--bg-1);
  --color-primary-2: var(--primary-2);
  /* ... */
}
```

然后在组件中直接使用 `bg-bg-1`​、`text-primary-2` 等类名。这种方式的性能极佳，因为切换主题只需修改 html 标签上的属性，浏览器会自动重新计算样式，无需 React 重新渲染组件树。

## 结语

开发这个主题模块，让我对**过度设计**与**必要功能**有了新的理解：通过**外观**和**色调**的拆分，我用最少的代码逻辑支撑起了看似复杂的 12 种主题变体。

Random 和 Auto 模式是为了让用户**少思考**，而隐藏切换按钮是为了让用户**少操作**。最好的交互往往是无感的。而那个点击 7 次的彩蛋，是我留给同样热爱探索的开发者们的一个暗号。

### 存在的问题

1. 我注意到在当前系统的深色模式中，首次加载会有亮色闪烁，猜测是 React/Next.js 的 hydration 和执行需要时间。如果把主题逻辑完全放在 `useEffect`​ 里，页面会先以默认 CSS（通常是白色）渲染，JS 执行后才添加 `.dark` 类。
2. 主题系统不仅是为了好看，更关乎可读性。应该如何校验不同 Palette 下的对比度，以及极端情况下的图片处理、代码高亮处理。

如果你也在构建类似的主题系统，希望这些浅显的思考能给你带来启发。

‍
