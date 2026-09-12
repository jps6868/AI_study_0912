export interface SaleRecord {
  id: number
  saleDate: string // ISO date, e.g. "2026-03-14"
  quantity: number
  amount: number
  itemId: number
  itemName: string
  category: string
  dealershipId: number
  dealershipName: string
  district: string
}

export interface Filters {
  from: string
  to: string
  district: string // 'all' or a district name
  category: string // 'all' or a category name
}
