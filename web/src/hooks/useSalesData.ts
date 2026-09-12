import { useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { SaleRecord } from '../types'

interface SaleQueryRow {
  id: number
  sale_date: string
  quantity: number
  amount: number
  item_id: number
  items: {
    id: number
    name: string
    category: string | null
    dealership_id: number
    dealerships: {
      id: number
      name: string
      district: string
    } | null
  } | null
}

interface UseSalesDataResult {
  data: SaleRecord[]
  loading: boolean
  error: string | null
}

export function useSalesData(): UseSalesDataResult {
  const [data, setData] = useState<SaleRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      if (!isSupabaseConfigured || !supabase) {
        setError('Supabase 연결 정보가 없습니다. web/.env.local에 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY를 설정하세요.')
        setLoading(false)
        return
      }

      const { data: rows, error: fetchError } = await supabase
        .from('sales')
        .select(
          'id, sale_date, quantity, amount, item_id, items(id, name, category, dealership_id, dealerships(id, name, district))',
        )
        .order('sale_date', { ascending: true })
        .returns<SaleQueryRow[]>()

      if (cancelled) return

      if (fetchError) {
        setError(fetchError.message)
        setLoading(false)
        return
      }

      const mapped: SaleRecord[] = (rows ?? [])
        .filter((row) => row.items && row.items.dealerships)
        .map((row) => ({
          id: row.id,
          saleDate: row.sale_date,
          quantity: row.quantity,
          amount: Number(row.amount),
          itemId: row.item_id,
          itemName: row.items!.name,
          category: row.items!.category ?? '미분류',
          dealershipId: row.items!.dealership_id,
          dealershipName: row.items!.dealerships!.name,
          district: row.items!.dealerships!.district,
        }))

      setData(mapped)
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}
