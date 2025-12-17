# BackgroundCanvas 组件

这是一个使用 [bckgrndfy](https://github.com/vltr/bckgrndfy) 库创建的低多边形背景组件。

## 使用方法

```tsx
import BackgroundCanvas from '@/components/BackgroundCanvas';
import { getPalette } from '@/lib/colorPalettes';

export default function MyComponent() {
  return (
    <>
      <BackgroundCanvas
        width={1920}
        height={1080}
        cellSize={55}
        algorithm='delaunay'
        variance={0.75}
        palette={getPalette('blues')}
        shareColor={true}
      />
      {/* 你的其他内容 */}
    </>
  );
}
```

## 配置选项

### `width` (可选)

- 类型: `number`
- 默认值: `800`
- 说明: 生成的 canvas 宽度

### `height` (可选)

- 类型: `number`
- 默认值: `600`
- 说明: 生成的 canvas 高度

### `cellSize` (可选)

- 类型: `number`
- 默认值: `55`
- 说明: 三角形块的预期大小，实际大小会根据 variance 参数随机化
- 仅适用于 `delaunay` 算法

### `algorithm` (可选)

- 类型: `'delaunay' | 'voronoi'`
- 默认值: `'delaunay'`
- 说明: 使用的算法类型
  - `delaunay`: 生成三角形网格
  - `voronoi`: 生成 Voronoi 图案

### `variance` (可选)

- 类型: `number`
- 默认值: `0.75`
- 说明: 定义块大小的随机化程度（0-1 之间）
- 仅适用于 `delaunay` 算法

### `lineWidth` (可选)

- 类型: `number`
- 默认值: `1`
- 说明: 三角形的线条宽度

### `distributed` (可选)

- 类型: `boolean`
- 默认值: `true`
- 说明: 是否分布式生成
- 仅适用于 `voronoi` 算法

### `maxSteps` (可选)

- 类型: `number`
- 默认值: `15`
- 说明: Lloyd 松弛算法的最大步数
- 仅适用于 `voronoi` 算法

### `palette` (可选)

- 类型: `string[][]`
- 默认值: `undefined` (使用库的默认配色)
- 说明: 自定义调色板，二维数组，每个子数组包含一组颜色（十六进制格式）
- 示例: `[['#ff6b6b', '#feca57'], ['#c44569', '#f8b500']]`

### `shareColor` (可选)

- 类型: `boolean`
- 默认值: `true`
- 说明: x 轴和 y 轴是否共享相同的调色板
- `true`: 生成更和谐的效果（推荐）
- `false`: 可能产生更丰富但也更杂乱的效果

## 推荐配置

### 配置 1: 蓝色系精细三角形（当前使用）

```tsx
<BackgroundCanvas
  width={1920}
  height={1080}
  cellSize={55}
  algorithm='delaunay'
  variance={0.75}
  palette={getPalette('blues')}
  shareColor={true}
/>
```

### 配置 2: 樱花色大块三角形

```tsx
<BackgroundCanvas
  width={1920}
  height={1080}
  cellSize={100}
  algorithm='delaunay'
  variance={0.9}
  palette={getPalette('sakura')}
  shareColor={true}
/>
```

### 配置 3: 极光色 Voronoi 图案

```tsx
<BackgroundCanvas
  width={1920}
  height={1080}
  cellSize={100}
  algorithm='delaunay'
  distributed={true}
  maxSteps={15}
  palette={getPalette('aurora')}
  shareColor={true}
/>
```

### 配置 4: 抹茶色简约风格

```tsx
<BackgroundCanvas
  width={1920}
  height={1080}
  cellSize={80}
  algorithm='delaunay'
  variance={0.6}
  palette={getPalette('matcha')}
  shareColor={true}
/>
```

## 性能优化建议

1. **调整分辨率**: 如果性能有问题，可以降低 `width` 和 `height`
2. **增大 cellSize**: 更大的 cellSize 会生成更少的多边形，提高性能
3. **减少 maxSteps**: 对于 voronoi 算法，减少松弛步数可以提高生成速度

### 使用预设配色

```tsx
import { getPalette } from '@/lib/colorPalettes';

<BackgroundCanvas
  width={1920}
  height={1080}
  cellSize={55}
  algorithm='delaunay'
  variance={0.75}
  palette={getPalette('blues')}
  shareColor={true}
/>;
```

### 自定义配色

```tsx
<BackgroundCanvas
  width={1920}
  height={1080}
  cellSize={55}
  algorithm='delaunay'
  variance={0.75}
  palette={[
    ['#ff6b6b', '#feca57', '#48dbfb'],
    ['#c44569', '#f8b500', '#0abde3'],
  ]}
  shareColor={true}
/>
```

### Voronoi 算法（无松弛）

```tsx
<BackgroundCanvas
  width={1920}
  height={1080}
  algorithm='voronoi'
  distributed={true}
  maxSteps={0}
  palette={getPalette('aurora')}
/>
```

### Voronoi 算法（带松弛）

```tsx
<BackgroundCanvas
  width={1920}
  height={1080}
  algorithm='voronoi'
  distributed={true}
  maxSteps={15}
  palette={getPalette('sakura')}
/>
```

## 可用的预设配色方案

项目提供了 16 种配色方案（位于 `src/lib/colorPalettes.ts`）：

- `blues` - 蓝色系（清新冷静）
- `greens` - 绿色系（自然清新）
- `purples` - 紫色系（优雅神秘）
- `oranges` - 橙色系（温暖活力）
- `pinks` - 粉色系（柔和浪漫）
- `grays` - 灰色系（简约现代）
- `rainbow` - 彩虹色（多彩活泼）
- `sunset` - 日落色（温暖渐变）
- `ocean` - 海洋色（深邃宁静）
- `forest` - 森林色（自然生机）
- `lavender` - 薰衣草色（淡雅清新）
- `aurora` - 极光色（梦幻绚丽）
- `nordic` - 北欧色（简洁优雅）
- `sakura` - 樱花色（柔美浪漫）
- `matcha` - 抹茶色（清新淡雅）
- `amber` - 琥珀色（温暖复古）

## 注意事项

- 这个组件使用 `'use client'` 指令，因为它需要在客户端运行
- 背景会自动设置为固定定位，覆盖整个视口
- z-index 设置为 -1，确保内容显示在背景之上
- 组件会在卸载时自动清理资源
