import type { Filters, SaleRecord } from '../types'

export function filterRecords(records: SaleRecord[], filters: Filters): SaleRecord[] {
  return records.filter((r) => {
    if (r.saleDate < filters.from || r.saleDate > filters.to) return false
    if (filters.district !== 'all' && r.district !== filters.district) return false
    if (filters.category !== 'all' && r.category !== filters.category) return false
    return true
  })
}

export function sumAmount(records: SaleRecord[]): number {
  return records.reduce((acc, r) => acc + r.amount, 0)
}

export function sumQuantity(records: SaleRecord[]): number {
  return records.reduce((acc, r) => acc + r.quantity, 0)
}

/** Immediately preceding period of the same length as [from, to], for delta comparisons. */
export function previousPeriodRange(from: string, to: string): { from: string; to: string } {
  const fromDate = new Date(`${from}T00:00:00`)
  const toDate = new Date(`${to}T00:00:00`)
  const spanMs = toDate.getTime() - fromDate.getTime()

  const prevTo = new Date(fromDate.getTime() - 24 * 60 * 60 * 1000)
  const prevFrom = new Date(prevTo.getTime() - spanMs)

  return { from: toISODate(prevFrom), to: toISODate(prevTo) }
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export interface TrendPoint {
  date: string
  amount: number
}

export function trendByDate(records: SaleRecord[]): TrendPoint[] {
  const byDate = new Map<string, number>()
  for (const r of records) {
    byDate.set(r.saleDate, (byDate.get(r.saleDate) ?? 0) + r.amount)
  }
  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({ date, amount }))
}

export interface RankedEntry {
  name: string
  amount: number
}

export function rankByDealership(records: SaleRecord[]): RankedEntry[] {
  const byDealership = new Map<string, number>()
  for (const r of records) {
    byDealership.set(r.dealershipName, (byDealership.get(r.dealershipName) ?? 0) + r.amount)
  }
  return Array.from(byDealership.entries())
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
}

export function breakdownByCategory(records: SaleRecord[]): RankedEntry[] {
  const byCategory = new Map<string, number>()
  for (const r of records) {
    byCategory.set(r.category, (byCategory.get(r.category) ?? 0) + r.amount)
  }
  return Array.from(byCategory.entries())
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
}

export function formatKRW(value: number): string {
  if (Math.abs(value) >= 100_000_000) return `${(value / 100_000_000).toFixed(1)}억원`
  if (Math.abs(value) >= 10_000) return `${(value / 10_000).toFixed(0)}만원`
  return `${value.toLocaleString('ko-KR')}원`
}

export function formatCompactNumber(value: number): string {
  return value.toLocaleString('ko-KR')
}
