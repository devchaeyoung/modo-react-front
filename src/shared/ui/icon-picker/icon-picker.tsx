import { cn } from 'shared/lib/styles/cn'
import { Icon } from 'shared/constants/icons'

export interface IconPickerProps {
  icons: readonly Icon[]
  selected: string
  onChange: (icon: string) => void
  color?: string
}

/**
 * 재사용 가능한 IconPicker 컴포넌트
 * @example
 * <IconPicker
 *   icons={ICONS}
 *   selected={selectedIcon}
 *   onChange={setSelectedIcon}
 *   color={selectedColor}
 * />
 */
export const IconPicker = ({ icons, selected, onChange, color }: IconPickerProps) => (
  <div className="grid grid-cols-4 gap-3">
    {icons.map((icon) => (
      <button
        key={icon.value}
        type="button"
        onClick={() => onChange(icon.value)}
        className={cn(
          'flex h-12 cursor-pointer items-center justify-center rounded-lg transition-all',
          selected === icon.value
            ? 'bg-gray-200 ring-2 ring-black dark:bg-zinc-700 dark:ring-white'
            : 'bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700'
        )}
        title={icon.name}
        aria-label={icon.name}
      >
        <i className={cn(icon.value, 'text-xl')} style={{ color }} />
      </button>
    ))}
  </div>
)
