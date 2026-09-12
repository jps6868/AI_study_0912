import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { RankedEntry } from '../lib/aggregate'
import { formatKRW } from '../lib/aggregate'

interface BarRankingChartProps {
  title: string
  data: RankedEntry[]
  limit?: number
}

export function BarRankingChart({ title, data, limit }: BarRankingChartProps) {
  const shown = limit ? data.slice(0, limit) : data
  const height = Math.max(160, shown.length * 36 + 40)

  return (
    <div className="rounded-xl border border-[rgba(11,11,11,0.10)] bg-[#fcfcfb] p-5">
      <h3 className="text-sm font-medium text-[#52514e]">{title}</h3>
      <div className="mt-4" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={shown}
            layout="vertical"
            margin={{ top: 4, right: 72, bottom: 4, left: 4 }}
            barCategoryGap={8}
          >
            <CartesianGrid horizontal={false} stroke="#e1e0d9" />
            <XAxis
              type="number"
              domain={[0, (max: number) => max * 1.2]}
              tickFormatter={(v: number) => formatKRW(v)}
              tick={{ fill: '#898781', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#0b0b0b', fontSize: 13 }}
              axisLine={false}
              tickLine={false}
              width={96}
            />
            <Tooltip
              formatter={(value) => [formatKRW(Number(value)), '매출']}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid rgba(11,11,11,0.10)',
                fontSize: 13,
              }}
            />
            <Bar dataKey="amount" fill="#2a78d6" radius={[0, 4, 4, 0]} maxBarSize={24}>
              <LabelList
                dataKey="amount"
                position="right"
                formatter={(v) => formatKRW(Number(v))}
                style={{ fill: '#52514e', fontSize: 12 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
