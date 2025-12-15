export const COLORS = [
  { value: '#EF4444', name: '빨강' },
  { value: '#F59E0B', name: '주황' },
  { value: '#10B981', name: '초록' },
  { value: '#3B82F6', name: '파랑' },
  { value: '#8B5CF6', name: '보라' },
  { value: '#EC4899', name: '핑크' },
  { value: '#14B8A6', name: '청록' },
  { value: '#F97316', name: '오렌지' },
] as const

export type Color = (typeof COLORS)[number]

