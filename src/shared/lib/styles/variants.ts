import { cn } from './cn'

type VariantConfig<T extends Record<string, Record<string, string>>> = {
  base: string
  variants: T
  defaultVariants?: Partial<{ [K in keyof T]: keyof T[K] }>
}

/**
 * 고차 함수: Variant 생성 함수 (CVA 스타일)
 * @example
 * const buttonVariants = createVariants({
 *   base: 'rounded px-4 py-2',
 *   variants: {
 *     variant: {
 *       primary: 'bg-black text-white',
 *       secondary: 'bg-gray-200 text-black'
 *     }
 *   }
 * })
 */
export const createVariants = <T extends Record<string, Record<string, string>>>(
  config: VariantConfig<T>
) => {
  return (props?: Partial<{ [K in keyof T]: keyof T[K] }>) => {
    const mergedProps = { ...config.defaultVariants, ...props }
    const variantClasses = Object.entries(mergedProps)
      .map(([key, value]) => config.variants[key]?.[value as string] || '')
      .filter(Boolean)
    return cn(config.base, ...variantClasses)
  }
}
