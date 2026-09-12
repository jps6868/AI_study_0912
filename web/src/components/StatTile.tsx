interface StatTileProps {
  label: string
  value: string
  delta?: number | null // signed percent, e.g. 12.4 or -8.1
}

export function StatTile({ label, value, delta }: StatTileProps) {
  const hasDelta = delta !== undefined && delta !== null && Number.isFinite(delta)
  const isUp = hasDelta && delta! > 0
  const isFlat = hasDelta && delta === 0

  return (
    <div className="rounded-xl border border-[rgba(11,11,11,0.10)] bg-[#fcfcfb] p-5">
      <p className="text-sm text-[#52514e]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[#0b0b0b]">{value}</p>
      {hasDelta && (
        <p
          className={`mt-1 text-sm font-medium ${
            isFlat ? 'text-[#898781]' : isUp ? 'text-[#0ca30c]' : 'text-[#d03b3b]'
          }`}
        >
          {isFlat ? '―' : isUp ? '▲' : '▼'} {Math.abs(delta!).toFixed(1)}% 전기간 대비
        </p>
      )}
    </div>
  )
}
