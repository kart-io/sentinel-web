/**
 * 样式常量统一管理
 * 用于管理整个应用中重复使用的样式
 */

import type { CSSProperties } from 'react';

/**
 * 渐变色按钮样式
 */
export const BUTTON_GRADIENT: CSSProperties = {
  background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
  border: 'none',
};

/**
 * 紫色渐变背景
 */
export const GRADIENT_PURPLE_BG: CSSProperties = {
  background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
};

/**
 * 品牌主色
 */
export const BRAND_COLORS = {
  primary: '#8b5cf6',
  secondary: '#d946ef',
  gradient: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
} as const;

/**
 * Tailwind CSS 类名常量
 */
export const BUTTON_CLASSES = {
  gradient: 'bg-gradient-to-r from-violet-500 to-fuchsia-500 border-none',
  primary: 'bg-violet-500 hover:bg-violet-600',
  secondary: 'bg-fuchsia-500 hover:bg-fuchsia-600',
} as const;

/**
 * 卡片样式
 */
export const CARD_STYLES = {
  shadow: '0 2px 8px rgba(0,0,0,0.1)',
  borderRadius: 12,
} as const;

/**
 * 间距常量
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/**
 * 动画过渡
 */
export const TRANSITIONS = {
  default: 'all 0.3s ease',
  fast: 'all 0.2s ease',
  slow: 'all 0.5s ease',
} as const;
