interface CircularProgressProps {
  current: number
  total: number
  label: string
  size?: number
}

export function CircularProgress({
  current,
  total,
  label,
  size = 120,
}: CircularProgressProps) {
  const percentage = (current / total) * 100
  const radius = size / 2 - 6
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2 ">
      <svg width={size} height={size} className="rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(51, 65, 85)"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#grad)"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%">
            <stop offset="0%" stopColor="#2355c1" />
            <stop offset="100%" stopColor="#042469" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center">
        <div className="text-4xl font-semibold font-aeo">{current}</div>
        <div className="uppercase tracking-wide text-md font-extralight font-aeo">{label}</div>
      </div>
    </div>
  )
}