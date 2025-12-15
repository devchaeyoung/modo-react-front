export const ICONS = [
  { value: 'ri-user-line', name: '사용자' },
  { value: 'ri-team-line', name: '팀' },
  { value: 'ri-briefcase-line', name: '업무' },
  { value: 'ri-heart-line', name: '하트' },
  { value: 'ri-star-line', name: '별' },
  { value: 'ri-flag-line', name: '깃발' },
  { value: 'ri-trophy-line', name: '트로피' },
  { value: 'ri-rocket-line', name: '로켓' },
] as const

export type Icon = (typeof ICONS)[number]

