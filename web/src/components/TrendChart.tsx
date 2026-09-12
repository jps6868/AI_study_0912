import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TrendPoint } from '../lib/aggregate'
import { formatKRW } from '../lib/aggregate'

interface TrendChartProps {
  points: TrendPoint[]
}

function formatTick(dateStr: string): string {
  const [, m, d] = dateStr.split('-')
  return `${m}/${d}`
}

export function TrendChart({ points }: TrendChartProps) {
  const tickInterval = Math.max(0, Math.ceil(points.length / 8) - 1)

  return (
    <div className="rounded-xl border border-[rgba(11,11,11,0.10)] bg-[#fcfcfb] p-5">
      <h3 className="text-sm font-medium text-[#52514e]">일별 매출 추이</h3>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#e1e0d9" />
            <XAxis
              dataKey="date"
              tickFormatter={formatTick}
              interval={tickInterval}
              tick={{ fill: '#898781', fontSize: 12 }}
              axisLine={{ stroke: '#c3c2b7' }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v: number) => formatKRW(v)}
              tick={{ fill: '#898781', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={72}
            />
            <Tooltip
              formatter={(value) => [formatKRW(Number(value)), '매출']}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid rgba(11,11,11,0.10)',
                fontSize: 13,
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#2a78d6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: '#fcfcfb' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
