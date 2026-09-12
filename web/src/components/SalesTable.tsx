import { useMemo, useState } from 'react'
import type { SaleRecord } from '../types'
import { formatCompactNumber, formatKRW } from '../lib/aggregate'

interface SalesTableProps {
  records: SaleRecord[]
}

type SortKey = 'saleDate' | 'dealershipName' | 'itemName' | 'category' | 'quantity' | 'amount'

const PAGE_SIZE = 15

export function SalesTable({ records }: SalesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('saleDate')
  const [sortDesc, setSortDesc] = useState(true)
  const [page, setPage] = useState(0)

  const sorted = useMemo(() => {
    const copy = [...records]
    copy.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv))
      return sortDesc ? -cmp : cmp
    })
    return copy
  }, [records, sortKey, sortDesc])

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount - 1)
  const pageRows = sorted.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE)

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDesc((d) => !d)
    } else {
      setSortKey(key)
      setSortDesc(true)
    }
    setPage(0)
  }

  const columns: { key: SortKey; label: string; align?: 'right' }[] = [
    { key: 'saleDate', label: '날짜' },
    { key: 'dealershipName', label: '대리점' },
    { key: 'itemName', label: '품목' },
    { key: 'category', label: '카테고리' },
    { key: 'quantity', label: '수량', align: 'right' },
    { key: 'amount', label: '매출액', align: 'right' },
  ]

  return (
    <div className="rounded-xl border border-[rgba(11,11,11,0.10)] bg-[#fcfcfb] p-5">
      <h3 className="text-sm font-medium text-[#52514e]">매출 상세</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#e1e0d9]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className={`cursor-pointer select-none py-2 text-xs font-medium text-[#898781] ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.label}
                  {sortKey === col.key ? (sortDesc ? ' ▼' : ' ▲') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r) => (
              <tr key={r.id} className="border-b border-[#e1e0d9] last:border-0">
                <td className="py-2 text-[#52514e] tabular-nums">{r.saleDate}</td>
                <td className="py-2 text-[#0b0b0b]">{r.dealershipName}</td>
                <td className="py-2 text-[#0b0b0b]">{r.itemName}</td>
                <td className="py-2 text-[#52514e]">{r.category}</td>
                <td className="py-2 text-right text-[#0b0b0b] tabular-nums">
                  {formatCompactNumber(r.quantity)}
                </td>
                <td className="py-2 text-right text-[#0b0b0b] tabular-nums">{formatKRW(r.amount)}</td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="py-6 text-center text-[#898781]">
                  조건에 맞는 매출 데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-[#52514e]">
          <span>
            {currentPage + 1} / {pageCount} 페이지 (총 {sorted.length.toLocaleString('ko-KR')}건)
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded-md border border-[#c3c2b7] px-3 py-1 disabled:opacity-40"
            >
              이전
            </button>
            <button
              type="button"
              disabled={currentPage >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              className="rounded-md border border-[#c3c2b7] px-3 py-1 disabled:opacity-40"
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
