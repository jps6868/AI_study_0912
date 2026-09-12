import type { Filters } from '../types'

interface FilterBarProps {
  filters: Filters
  onChange: (filters: Filters) => void
  minDate: string
  maxDate: string
  districts: string[]
  categories: string[]
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00`)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function FilterBar({ filters, onChange, minDate, maxDate, districts, categories }: FilterBarProps) {
  const presets: { label: string; from: string; to: string }[] = [
    { label: '전체', from: minDate, to: maxDate },
    { label: '최근 30일', from: addDays(maxDate, -29), to: maxDate },
    { label: '최근 90일', from: addDays(maxDate, -89), to: maxDate },
  ]

  const activePreset = presets.find((p) => p.from === filters.from && p.to === filters.to)?.label

  return (
    <div className="flex flex-wrap items-end gap-4 rounded-xl border border-[rgba(11,11,11,0.10)] bg-[#fcfcfb] p-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-[#898781]">기간 프리셋</span>
        <div className="flex gap-1">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => onChange({ ...filters, from: p.from, to: p.to })}
              className={`rounded-md px-3 py-1.5 text-sm ${
                activePreset === p.label
                  ? 'bg-[#2a78d6] text-white'
                  : 'bg-transparent text-[#52514e] hover:bg-[#f0efec]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-[#898781]">시작일</span>
        <input
          type="date"
          value={filters.from}
          min={minDate}
          max={filters.to}
          onChange={(e) => onChange({ ...filters, from: e.target.value })}
          className="rounded-md border border-[#c3c2b7] px-2 py-1.5 text-sm text-[#0b0b0b]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-[#898781]">종료일</span>
        <input
          type="date"
          value={filters.to}
          min={filters.from}
          max={maxDate}
          onChange={(e) => onChange({ ...filters, to: e.target.value })}
          className="rounded-md border border-[#c3c2b7] px-2 py-1.5 text-sm text-[#0b0b0b]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-[#898781]">대리점(구)</span>
        <select
          value={filters.district}
          onChange={(e) => onChange({ ...filters, district: e.target.value })}
          className="rounded-md border border-[#c3c2b7] px-2 py-1.5 text-sm text-[#0b0b0b]"
        >
          <option value="all">전체</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-[#898781]">카테고리</span>
        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          className="rounded-md border border-[#c3c2b7] px-2 py-1.5 text-sm text-[#0b0b0b]"
        >
          <option value="all">전체</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
