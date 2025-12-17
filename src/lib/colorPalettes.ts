/**
 * 预设配色方案
 * 每个配色方案是一个二维数组，包含多组颜色
 * 使用 ColorBrewer 的配色方案作为参考
 */

export const colorPalettes = {
  // 蓝色系 - 清新冷静
  blues: [
    ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6'],
    ['#4292c6', '#2171b5', '#08519c', '#08306b'],
  ],

  // 绿色系 - 自然清新
  greens: [
    ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476'],
    ['#41ab5d', '#238b45', '#006d2c', '#00441b'],
  ],

  // 紫色系 - 优雅神秘
  purples: [
    ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8'],
    ['#807dba', '#6a51a3', '#54278f', '#3f007d'],
  ],

  // 橙色系 - 温暖活力
  oranges: [
    ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c'],
    ['#f16913', '#d94801', '#a63603', '#7f2704'],
  ],

  // 粉色系 - 柔和浪漫
  pinks: [
    ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1'],
    ['#dd3497', '#ae017e', '#7a0177', '#49006a'],
  ],

  // 灰色系 - 简约现代
  grays: [
    ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696'],
    // ['#737373', '#525252', '#252525', '#000000'],
  ],

  // 彩虹色 - 多彩活泼
  rainbow: [
    ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#ee5a6f'],
    ['#c44569', '#f8b500', '#0abde3', '#10ac84', '#5f27cd'],
  ],

  // 日落色 - 温暖渐变
  sunset: [
    ['#ff9ff3', '#feca57', '#ff6348', '#ff4757', '#ee5a6f'],
    ['#f368e0', '#ff9f43', '#ff6348', '#ee5a6f', '#c44569'],
  ],

  // 海洋色 - 深邃宁静
  ocean: [
    ['#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94'],
    ['#3dc1d3', '#00d2d3', '#54a0ff', '#2e86de', '#1e3799'],
  ],

  // 森林色 - 自然生机
  forest: [
    ['#c7ecee', '#dff9fb', '#badc58', '#6ab04c', '#22a6b3'],
    ['#4cd137', '#44bd32', '#2c3e50', '#34495e', '#7f8fa6'],
  ],

  // 薰衣草色 - 淡雅清新
  lavender: [
    ['#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd'],
    ['#dfe4ea', '#ced6e0', '#a4b0be', '#747d8c', '#57606f'],
  ],

  // 极光色 - 梦幻绚丽
  aurora: [
    ['#a29bfe', '#6c5ce7', '#fd79a8', '#fdcb6e', '#00b894'],
    ['#0984e3', '#74b9ff', '#a29bfe', '#fd79a8', '#e17055'],
  ],

  // 北欧色 - 简洁优雅
  nordic: [
    ['#ecf0f1', '#bdc3c7', '#95a5a6', '#7f8c8d', '#34495e'],
    ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6', '#bdc3c7'],
  ],

  // 樱花色 - 柔美浪漫
  sakura: [
    ['#ffe5ec', '#ffc2d1', '#ffb3c6', '#ff8fab', '#fb6f92'],
    ['#f9a8d4', '#f472b6', '#ec4899', '#db2777', '#be185d'],
  ],

  // 抹茶色 - 清新淡雅
  matcha: [
    ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80'],
    ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'],
  ],

  // 琥珀色 - 温暖复古
  amber: [
    ['#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24'],
    ['#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f'],
  ],
};

// 导出类型
export type PaletteName = keyof typeof colorPalettes;

// 获取配色方案的辅助函数
export function getPalette(name: PaletteName): string[][] {
  return colorPalettes[name];
}

// 获取所有配色方案名称
export function getPaletteNames(): PaletteName[] {
  return Object.keys(colorPalettes) as PaletteName[];
}
