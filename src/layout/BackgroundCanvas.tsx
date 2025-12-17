'use client';

import { useEffect, useRef } from 'react';

interface BackgroundCanvasProps {
  width?: number; // 生成画布的宽度
  height?: number; // 生成画布的高度
  palette?: string[][]; // // 画布的调色板，默认情况下我们使用 chroma.js 的 ColorBrewer
  shareColor?: boolean; // x 和 y 是否共享相同的调色
  lineWidth?: number; // 三角形的线宽
  algorithm?: 'delaunay' | 'voronoi'; // 算法类型，delaunay 生成更平滑的三角形，voronoi 生成更规则的图案
  distributed?: boolean; // 仅适用于 voronoi，是否均匀分布三角形
  maxSteps?: number; // 仅适用于 delaunay，最大迭代次数
  cellSize?: number; // 期望的三角形块大小，实际大小将由 variance 参数随机化
  variance?: number; // 定义块大小随机化的程度
}

interface BckgrndyOptions {
  width: number;
  height: number;
  palette?: string[][];
  shareColor?: boolean;
  lineWidth: number;
  algorithm: 'delaunay' | 'voronoi';
  distributed: boolean;
  maxSteps: number;
  cellSize: number;
  variance: number;
}

declare global {
  interface Window {
    bckgrndfy: (options: BckgrndyOptions) => HTMLCanvasElement;
  }
}

export default function BackgroundCanvas({
  width = 800,
  height = 600,
  cellSize = 55,
  algorithm = 'delaunay',
  variance = 0.75,
  lineWidth = 1,
  distributed = true,
  maxSteps = 15,
  palette,
  shareColor = true,
}: BackgroundCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // 动态加载 bckgrndfy 脚本
    const script = document.createElement('script');
    script.src = '/bckgrndfy.min.js';
    script.async = true;

    script.onload = () => {
      if (containerRef.current && window.bckgrndfy) {
        // 清除之前的 canvas（如果存在）
        if (canvasRef.current) {
          canvasRef.current.remove();
        }

        // 构建配置对象
        const options: BckgrndyOptions = {
          width,
          height,
          cellSize,
          algorithm,
          variance,
          lineWidth,
          distributed,
          maxSteps,
        };

        // 如果提供了自定义调色板，则添加到配置中
        if (palette) {
          options.palette = palette;
          options.shareColor = shareColor;
        }

        // 生成新的背景 canvas
        const canvas = window.bckgrndfy(options);

        // 设置 canvas 样式
        canvas.style.position = 'fixed';
        canvas.style.left = '0';
        canvas.style.top = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.objectFit = 'cover';

        containerRef.current.appendChild(canvas);
        canvasRef.current = canvas;
      }
    };

    document.head.appendChild(script);

    return () => {
      // 清理
      if (canvasRef.current) {
        canvasRef.current.remove();
      }
      script.remove();
    };
  }, [
    width,
    height,
    cellSize,
    algorithm,
    variance,
    lineWidth,
    distributed,
    maxSteps,
    palette,
    shareColor,
  ]);

  return <div ref={containerRef} />;
}
