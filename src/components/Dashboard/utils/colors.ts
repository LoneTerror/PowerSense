export const colorMap = {
  primary: {
    main: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb',
  },
  secondary: {
    main: '#6366f1',
    light: '#818cf8',
    dark: '#4f46e5',
  },
  success: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669',
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
  },
  danger: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
  },
  background: {
    main: '#0f172a',
    light: '#1e293b',
    lighter: '#334155',
    dark: '#0a1120',
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#94a3b8',
    muted: '#64748b',
  },
} as const;

type ColorType = keyof typeof colorMap;
type ColorVariant = 'main' | 'light' | 'dark';

export const getColorWithAlpha = (color: string, alpha: number): string => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getColor = (type: ColorType, variant: ColorVariant = 'main'): string => {
  const colorSet = colorMap[type];
  if (!colorSet || !(variant in colorSet)) {
    return colorMap.primary.main;
  }
  return colorSet[variant as keyof typeof colorSet];
};