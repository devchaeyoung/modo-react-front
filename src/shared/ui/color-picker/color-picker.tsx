import { cn } from 'shared/lib/styles/cn'
import { Color } from 'shared/constants/colors'

export interface ColorPickerProps {
  colors: readonly Color[]
  selected: string
  onChange: (color: string) => void
}

/**
 * 재사용 가능한 ColorPicker 컴포넌트
 * @example
 * <ColorPicker
 *   colors={COLORS}
 *   selected={selectedColor}
 *   onChange={setSelectedColor}
 * />
 */
export const ColorPicker = ({ colors, selected, onChange }: ColorPickerProps) => (
  <div className="grid grid-cols-4 gap-3">
    {colors.map((color) => (
      <button
        key={color.value}
        type="button"
        onClick={() => onChange(color.value)}
        className={cn(
          'h-12 rounded-lg transition-all cursor-pointer',
          selected === color.value
            ? 'ring-2 ring-offset-2 dark:ring-offset-zinc-900'
            : 'hover:scale-105'
        )}
        style={{
          backgroundColor: color.value,
          ...(selected === color.value && { ['--tw-ring-color' as any]: color.value }),
        }}
        title={color.name}
        aria-label={color.name}
      />
    ))}
  </div>
)

