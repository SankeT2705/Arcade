import { cn } from '../../lib/utils';
import {
  BrushIcon,
  PaintBucketIcon,
  SquareIcon,
  CircleIcon,
  TrashIcon,
} from '../../components/Icons';

const COLORS = [
  { name: 'Black', value: '#0F172A' },
  { name: 'Slate', value: '#64748B' },
  { name: 'Crimson', value: '#DC2626' },
  { name: 'Royal Blue', value: '#2563EB' },
  { name: 'Emerald', value: '#16A34A' },
  { name: 'Orange', value: '#EA580C' },
  { name: 'Purple', value: '#9333EA' },
  { name: 'Amber', value: '#D97706' },
  { name: 'Rose', value: '#E11D48' },
  { name: 'Brown', value: '#78350F' },
];

const BRUSH_WIDTHS = [
  { name: 'Fine', value: 2 },
  { name: 'Medium', value: 5 },
  { name: 'Thick', value: 10 },
  { name: 'Marker', value: 18 },
];

export default function ColorPalette({
  selectedColor,
  onColorChange,
  selectedWidth,
  onWidthChange,
  activeTool,
  onToolChange,
  onClear,
  className = '',
}) {
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-3 p-1', className)}>
      {/* Colors Swatches */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {COLORS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onColorChange(c.value)}
            className={cn(
              'w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-150 border-2 shrink-0 relative',
              selectedColor === c.value
                ? 'border-primary-600 scale-110 shadow-xs ring-2 ring-primary-100'
                : 'border-white hover:scale-105 shadow-xs',
            )}
            style={{ backgroundColor: c.value }}
            title={c.name}
          />
        ))}
      </div>

      {/* Tools & Brush Settings */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Tool Selectors */}
        <div className="flex items-center gap-1 bg-surface-100 p-1 rounded-xl border border-surface-200">
          <button
            type="button"
            onClick={() => onToolChange && onToolChange('brush')}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
              activeTool === 'brush'
                ? 'bg-white text-primary-700 shadow-xs border border-surface-200'
                : 'text-surface-500 hover:text-surface-800 hover:bg-surface-200/60',
            )}
            title="Brush"
          >
            <BrushIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onToolChange && onToolChange('fill')}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
              activeTool === 'fill'
                ? 'bg-white text-primary-700 shadow-xs border border-surface-200'
                : 'text-surface-500 hover:text-surface-800 hover:bg-surface-200/60',
            )}
            title="Bucket Fill"
          >
            <PaintBucketIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onToolChange && onToolChange('rectangle')}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
              activeTool === 'rectangle'
                ? 'bg-white text-primary-700 shadow-xs border border-surface-200'
                : 'text-surface-500 hover:text-surface-800 hover:bg-surface-200/60',
            )}
            title="Rectangle"
          >
            <SquareIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onToolChange && onToolChange('circle')}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
              activeTool === 'circle'
                ? 'bg-white text-primary-700 shadow-xs border border-surface-200'
                : 'text-surface-500 hover:text-surface-800 hover:bg-surface-200/60',
            )}
            title="Circle"
          >
            <CircleIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Brush Sizes */}
        <div className="flex items-center gap-1 bg-surface-100 p-1 rounded-xl border border-surface-200">
          {BRUSH_WIDTHS.map((b) => (
            <button
              key={b.value}
              type="button"
              onClick={() => onWidthChange(b.value)}
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                selectedWidth === b.value
                  ? 'bg-white border border-surface-200 text-surface-900 shadow-xs'
                  : 'hover:bg-surface-200/60 text-surface-400',
              )}
              title={b.name}
            >
              <div
                className="rounded-full bg-surface-800 transition-transform"
                style={{ width: b.value + 2, height: b.value + 2 }}
              />
            </button>
          ))}
        </div>

        {/* Clear Button */}
        <button
          type="button"
          onClick={onClear}
          className="px-3 py-2 text-xs font-semibold text-danger-700 bg-danger-50 border border-danger-200 rounded-xl hover:bg-danger-100 active:scale-95 transition-all flex items-center gap-1.5 shadow-xs"
        >
          <TrashIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>
    </div>
  );
}
