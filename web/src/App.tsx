import { useMemo, useState } from 'react'
import { BarRankingChart } from './components/BarRankingChart'
import { FilterBar } from './components/FilterBar'
import { SalesTable } from './components/SalesTable'
import { StatTile } from './components/StatTile'
import { TrendChart } from './components/TrendChart'
import { useSalesData } from './hooks/useSalesData'
import {
  breakdownByCategory,
  filterRecords,
  formatCompactNumber,
  formatKRW,
  previousPeriodRange,
  rankByDealership,
  sumAmount,
  sumQuantity,
  trendByDate,
} from './lib/aggregate'
import type { Filters } from './types'

const FALLBACK_MIN_DATE = '2026-01-01'
const FALLBACK_MAX_DATE = '2026-09-12'

function App() {
  const { data, loading, error } = useSalesData()

  const bounds = useMemo(() => {
    if (data.length === 0) return { min: FALLBACK_MIN_DATE, max: FALLBACK_MAX_DATE }
    let min = data[0].saleDate
    let max = data[0].saleDate
    for (const r of data) {
      if (r.saleDate < min) min = r.saleDate
      if (r.saleDate > max) max = r.saleDate
    }
    return { min, max }
  }, [data])

  const districts = useMemo(
    () => Array.from(new Set(data.map((r) => r.district))).sort(),
    [data],
  )
  const categories = useMemo(
    () => Array.from(new Set(data.map((r) => r.category))).sort(),
    [data],
  )

  const [filters, setFilters] = useState<Filters | null>(null)
  const effectiveFilters: Filters = filters ?? {
    from: bounds.min,
    to: bounds.max,
    district: 'all',
    category: 'all',
  }

  const filteredRecords = useMemo(
    () => filterRecords(data, effectiveFilters),
    [data, effectiveFilters],
  )

  const totalRevenue = sumAmount(filteredRecords)
  const totalQuantity = sumQuantity(filteredRecords)
  const dealershipCount = new Set(filteredRecords.map((r) => r.dealershipId)).size
  const itemCount = new Set(filteredRecords.map((r) => r.itemId)).size

  const revenueDelta = useMemo(() => {
    const prev = previousPeriodRange(effectiveFilters.from, effectiveFilters.to)
    if (prev.from < bounds.min) return null
    const prevRecords = filterRecords(data, { ...effectiveFilters, from: prev.from, to: prev.to })
    const prevRevenue = sumAmount(prevRecords)
    if (prevRevenue === 0) return null
    return ((totalRevenue - prevRevenue) / prevRevenue) * 100
  }, [data, effectiveFilters, bounds.min, totalRevenue])

  const trend = useMemo(() => trendByDate(filteredRecords), [filteredRecords])
  const dealershipRanking = useMemo(() => rankByDealership(filteredRecords), [filteredRecords])
  const categoryBreakdown = useMemo(() => breakdownByCategory(filteredRecords), [filteredRecords])

  return (
    <div className="min-h-screen bg-[#f9f9f7] px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header>
          <h1 className="text-2xl font-semibold text-[#0b0b0b]">대리점 매출 대시보드</h1>
          <p className="mt-1 text-sm text-[#52514e]">서울 시내 대리점 매출 현황</p>
        </header>

        {error && (
          <div className="rounded-xl border border-[#d03b3b] bg-[#fcfcfb] p-4 text-sm text-[#d03b3b]">
            데이터를 불러오지 못했습니다: {error}
          </div>
        )}

        {!error && loading && (
          <div className="rounded-xl border border-[rgba(11,11,11,0.10)] bg-[#fcfcfb] p-8 text-center text-sm text-[#898781]">
            데이터를 불러오는 중입니다...
          </div>
        )}

        {!error && !loading && (
          <>
            <FilterBar
              filters={effectiveFilters}
              onChange={setFilters}
              minDate={bounds.min}
              maxDate={bounds.max}
              districts={districts}
              categories={categories}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile label="총 매출액" value={formatKRW(totalRevenue)} delta={revenueDelta} />
              <StatTile label="총 판매 수량" value={`${formatCompactNumber(totalQuantity)}개`} />
              <StatTile label="활성 대리점" value={`${dealershipCount}곳`} />
              <StatTile label="활성 품목" value={`${itemCount}개`} />
            </div>

            <TrendChart points={trend} />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <BarRankingChart title="대리점별 매출 랭킹" data={dealershipRanking} />
              <BarRankingChart title="카테고리별 매출" data={categoryBreakdown} color="#eb6834" />
            </div>

            <SalesTable records={filteredRecords} />
          </>
        )}
      </div>
    </div>
  )
}

export default App
