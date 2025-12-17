import React, { useEffect, useRef, useCallback } from 'react';
import Delaunator from 'delaunator';

/**
 * 解析各种格式的颜色字符串 (Hex, RGB, RGBA) 为 {r,g,b} 对象
 */
const parseColorToRgb = (color: string): { r: number; g: number; b: number } | null => {
  if (!color) return null;

  // 1. 处理 Hex (#ffffff or #fff)
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3)
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    const num = parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  // 2. 处理 RGB/RGBA (浏览器 getComputedStyle 通常返回这个格式)
  // 例如: "rgb(59, 130, 246)" 或 "rgba(59, 130, 246, 1)"
  const match = color.match(/\d+/g);
  if (match && match.length >= 3) {
    return {
      r: parseInt(match[0], 10),
      g: parseInt(match[1], 10),
      b: parseInt(match[2], 10),
    };
  }

  return null;
};

const parseToRgbStandard = (colorStr: string): { r: number; g: number; b: number } | null => {
  if (typeof window === 'undefined') return null;

  // 创建一个临时的隐藏元素
  const tempSpan = document.createElement('span');
  tempSpan.style.color = colorStr;
  tempSpan.style.display = 'none';
  document.body.appendChild(tempSpan);

  // 关键：再次获取计算后的样式，浏览器会自动将其转为 rgb/rgba
  const computedColor = window.getComputedStyle(tempSpan).color;
  document.body.removeChild(tempSpan);

  // 此时得到的 computedColor 一定是 "rgb(r, g, b)" 或 "rgba(r, g, b, a)"
  const match = computedColor.match(/\d+(\.\d+)?/g);
  if (match && match.length >= 3) {
    return {
      r: Math.round(parseFloat(match[0])),
      g: Math.round(parseFloat(match[1])),
      b: Math.round(parseFloat(match[2])),
    };
  }
  return null;
};

/**
 * 颜色变亮/混合白色
 */
const lightenColor = (colorStr: string, amount: number): string => {
  const rgb = parseToRgbStandard(colorStr);
  if (!rgb) return colorStr;

  const amt = Math.max(0, Math.min(1, amount));
  const { r, g, b } = rgb;

  const newR = Math.round(r + (255 - r) * amt);
  const newG = Math.round(g + (255 - g) * amt);
  const newB = Math.round(b + (255 - b) * amt);

  return `rgb(${newR}, ${newG}, ${newB})`;
};

// --- Types ---

interface ColorCalculationOptions {
  triangleCenter: { x: number; y: number };
  triangleIndex: string;
  triangle: number[][];
  color: string;
  canvasWidth: number;
  canvasHeight: number;
  ctx: CanvasRenderingContext2D;
}

export enum PresetDistribution {
  quasirandom = 'quasirandom',
  pseudorandom = 'pseudorandom',
  vertical = 'vertical',
  horizontal = 'horizontal',
  square = 'square',
}

export enum PresetFillColor {
  gradient = 'gradient',
  gradient_reverse = 'gradient_reverse',
  random = 'random',
}

export enum PresetLineColor {
  gradient = 'gradient',
  gradient_reverse = 'gradient_reverse',
}

interface IProps {
  className?: string; // e.g., "bg-blue-500 w-full h-96"
  width?: string;
  height?: string;
  color?: string; // 现在是可选的，作为覆盖值
  lineColor?: ((options: ColorCalculationOptions) => string) | PresetLineColor | string;
  fillColor?: ((options: ColorCalculationOptions) => string) | PresetFillColor;
  borderColor?: string;
  maxPoints?: number;
  maxSpeed?: number;
  minSpeed?: number;
  lineWidth?: number;
  animate?: boolean;
  debug?: boolean;
  children?: React.ReactNode;
  distribute?: PresetDistribution;
}

interface Particle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
}

// --- Helper Functions ---
const getCanvasSize = (container: HTMLDivElement) => ({
  width: container.clientWidth,
  height: container.clientHeight,
});

const DelaunayHero: React.FC<IProps> = ({
  className = '', // 默认空字符串
  width = '100%',
  height = '400px',
  color: propColor, // 别名：propColor (优先级最高)
  lineColor,
  fillColor = PresetFillColor.random,
  borderColor,
  maxPoints = 50,
  maxSpeed = 0.6,
  minSpeed = 0.5,
  lineWidth = 1,
  animate = false,
  debug = false,
  distribute = PresetDistribution.quasirandom,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const colorCachingRef = useRef<{ [key: string]: string }>({});

  // 🔥 新增：用于存储最终用于绘图的颜色 (默认为透明或白色，等待提取)
  const renderColorRef = useRef<string>(propColor || '#ffffff');

  // --- 1. 颜色提取逻辑 ---
  useEffect(() => {
    // 如果用户显式传了 color prop，优先使用 prop
    console.log('propColor', propColor);
    if (propColor) {
      renderColorRef.current = propColor;
      return;
    }

    // 否则，从 DOM 计算 Tailwind 的 bg-class 颜色
    if (containerRef.current) {
      const computedStyle = window.getComputedStyle(containerRef.current);
      const bgColor = computedStyle.backgroundColor;

      // 浏览器通常返回 "rgb(x, x, x)" 或 "rgba(x, x, x, 0)"
      // 只有当它是有效颜色且不是完全透明时才使用
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        renderColorRef.current = bgColor;
      } else {
        // Fallback: 如果没有背景色，给个默认橙色避免出错
        renderColorRef.current = '#fff';
      }
    }
  }, [propColor, className]); // 当 className 改变时重新计算

  // --- 2. 粒子与绘图逻辑 (基本不变，除了使用 renderColorRef.current) ---

  const addParticle = useCallback(
    (x: number, y: number, list: Particle[]) => {
      const l = Math.random() * (maxSpeed - minSpeed) + minSpeed;
      const a = Math.random() * Math.PI * 2;
      list.push({
        x,
        y,
        velocityX: x === 0 ? 0 : l * Math.cos(a),
        velocityY: y === 0 ? 0 : l * Math.sin(a),
      });
    },
    [maxSpeed, minSpeed],
  );

  const getCanvasEdges = (w: number, h: number): Particle[] => [
    { x: 0, y: 0, velocityX: 0, velocityY: 0 },
    { x: 0, y: h, velocityX: 0, velocityY: 0 },
    { x: w, y: 0, velocityX: 0, velocityY: 0 },
    { x: w, y: h, velocityX: 0, velocityY: 0 },
  ];

  const initParticles = useCallback(
    (w: number, h: number) => {
      const p: Particle[] = [];
      const strategies: Record<string, () => void> = {
        [PresetDistribution.vertical]: () => {
          const meanHeight = h / maxPoints;
          for (let i = 0; i < maxPoints; i++) {
            let x = w / 2;
            let y = meanHeight * (i + Math.random());
            x = Math.max(0, Math.min(w, x));
            y = Math.max(0, Math.min(h, y));
            addParticle(x, y, p);
          }
        },
        [PresetDistribution.horizontal]: () => {
          const meanWidth = w / maxPoints;
          for (let i = 0; i < maxPoints; i++) {
            let x = meanWidth * (i + Math.random());
            let y = h / 2;
            x = Math.max(0, Math.min(w, x));
            y = Math.max(0, Math.min(h, y));
            addParticle(x, y, p);
          }
        },
        [PresetDistribution.square]: () => {
          const pointArea = (w * h) / maxPoints;
          const length = Math.sqrt(pointArea);
          for (let i = 0; i <= w + length; i += length) {
            for (let j = 0; j <= h + length; j += length) {
              addParticle(i, j, p);
            }
          }
        },
        [PresetDistribution.quasirandom]: () => {
          const pointArea = (w * h) / maxPoints;
          const length = Math.sqrt(pointArea);
          p.push(...getCanvasEdges(w, h));
          for (let i = 0; i <= w + length; i += length) {
            for (let j = 0; j <= h + length; j += length) {
              addParticle(
                i + ((Math.random() - 0.5) * length) / 10,
                j + (Math.random() - 0.5) * length,
                p,
              );
            }
          }
        },
        default: () => {
          p.push(...getCanvasEdges(w, h));
          for (let i = 0; i < maxPoints; i++) {
            addParticle(Math.random() * w, Math.random() * h, p);
          }
        },
      };
      (strategies[distribute] || strategies.default)();
      particlesRef.current = p;
    },
    [distribute, maxPoints, addParticle],
  );

  const renderFrame = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width: w, height: h } = getCanvasSize(containerRef.current);
    const activeColor = renderColorRef.current; // 🔥 获取当前计算出的颜色

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    // 清空画布 (背景色由 div 的 CSS 控制，不需要 Canvas 绘制背景，除非要特殊处理)
    ctx.clearRect(0, 0, w, h);

    // 更新位置
    particlesRef.current.forEach((p) => {
      p.x += p.velocityX;
      p.y += p.velocityY;
      if (p.x < 0 || p.x > w) {
        p.x = p.x < 0 ? 0 : w;
        p.velocityX *= -1;
      }
      if (p.y < 0 || p.y > h) {
        p.y = p.y < 0 ? 0 : h;
        p.velocityY *= -1;
      }
    });

    const coords = new Float64Array(particlesRef.current.length * 2);
    for (let i = 0; i < particlesRef.current.length; i++) {
      coords[2 * i] = particlesRef.current[i].x;
      coords[2 * i + 1] = particlesRef.current[i].y;
    }

    // ⚠️ Delaunator 实例化
    // 如果你用的是 `import Delaunator from 'delaunator'`, 这里应该是 `new Delaunator(coords)`
    // 根据之前的代码上下文，这里假设库正常导入
    const delaunator = new Delaunator(coords);

    const getFillColor = (opts: ColorCalculationOptions): string => {
      if (typeof fillColor === 'function') return fillColor(opts);

      switch (fillColor) {
        case PresetFillColor.gradient: {
          const alpha = Math.max(0, -0.2 + opts.triangleCenter.y / opts.canvasHeight);
          const result = lightenColor(activeColor, alpha);
          return result.startsWith('rgba(255, 255, 255') ? 'rgba(0,0,0,0)' : result;
        }
        case PresetFillColor.gradient_reverse: {
          const alphaRev = Math.max(0, 0.8 - opts.triangleCenter.y / opts.canvasHeight);
          const result = lightenColor(activeColor, alphaRev);
          return result.startsWith('rgba(255, 255, 255') ? 'rgba(0,0,0,0)' : result;
        }
        case PresetFillColor.random:
        default: {
          if (!colorCachingRef.current[opts.triangleIndex]) {
            colorCachingRef.current[opts.triangleIndex] = lightenColor(
              activeColor,
              0.1 * Math.random(),
            );
          }
          return colorCachingRef.current[opts.triangleIndex];
        }
      }
    };

    for (let i = 0; i < delaunator.triangles.length; i += 3) {
      const p0Index = delaunator.triangles[i];
      const p1Index = delaunator.triangles[i + 1];
      const p2Index = delaunator.triangles[i + 2];

      const p0 = particlesRef.current[p0Index];
      const p1 = particlesRef.current[p1Index];
      const p2 = particlesRef.current[p2Index];

      if (!p0 || !p1 || !p2) continue;

      const cx = (p0.x + p1.x + p2.x) / 3;
      const cy = (p0.y + p1.y + p2.y) / 3;
      const tIndex = `${p0Index}_${p1Index}_${p2Index}`;

      const colorArgs: ColorCalculationOptions = {
        triangleIndex: tIndex,
        triangleCenter: { x: cx, y: cy },
        triangle: [
          [p0.x, p0.y],
          [p1.x, p1.y],
          [p2.x, p2.y],
        ],
        color: activeColor, // 传入当前颜色
        canvasWidth: w,
        canvasHeight: h,
        ctx,
      };

      const finalFill = getFillColor(colorArgs);

      let finalStroke = finalFill;
      if (lineColor) {
        if (typeof lineColor === 'function') finalStroke = lineColor(colorArgs);
        else if (
          lineColor === PresetLineColor.gradient ||
          lineColor === PresetLineColor.gradient_reverse
        )
          finalStroke = finalFill;
        else finalStroke = lineColor as string;
      }

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.closePath();

      ctx.fillStyle = finalFill;
      ctx.fill();

      if (lineWidth > 0) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = finalStroke;
        ctx.stroke();
      }

      if (debug) {
        ctx.strokeText(tIndex, cx, cy);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'black';
      }
    }
  }, [debug, fillColor, lineColor, lineWidth]); // 注意：移除了 color 和 animate 依赖，因为 color 现在通过 ref 读取

  // --- Effects ---
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = getCanvasSize(containerRef.current);
      initParticles(width, height);

      const loop = () => {
        renderFrame();
        if (animate) {
          requestRef.current = requestAnimationFrame(loop);
        }
      };
      loop();
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [initParticles, renderFrame, animate]);

  return (
    <div
      ref={containerRef}
      className={className} // Tailwind 类名应用在这里 (例如 bg-blue-500)
      style={{
        position: 'relative',
        width,
        height,
        border: borderColor ? `1px solid ${borderColor}` : undefined,
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0, // 设为 0，因为父 div 有背景色，需要让 canvas 叠在背景色上面，但内容下面？
          // 修正：通常父 div 有 bg-color，canvas 也是透明的。
          // canvas 绘制的是“略微变亮”的三角形。
          // 如果 canvas 在 div 内容之下，应该是 zIndex: 0 (或 1), 内容 zIndex: 2
        }}
      />
      <div style={{ position: 'relative', zIndex: 10, height: '100%', width: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default DelaunayHero;
