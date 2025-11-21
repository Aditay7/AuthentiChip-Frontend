import { cn } from '../../utils/cn'

export default function StatusBadge({ status }) {
  if (!status) return null
  const normalized = status.toUpperCase()

  const intent =
    normalized === 'GENUINE' || normalized === 'PASS'
      ? 'pass'
      : normalized === 'FAKE' || normalized === 'FAIL'
      ? 'fail'
      : 'review'

  return (
    <span
      className={cn(
        'status-chip',
        intent === 'pass' && 'bg-chip-pass/10 text-chip-pass border border-chip-pass/40',
        intent === 'fail' && 'bg-chip-fail/10 text-chip-fail border border-chip-fail/40',
        intent === 'review' && 'bg-chip-review/10 text-chip-review border border-chip-review/40'
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {normalized}
    </span>
  )
}


