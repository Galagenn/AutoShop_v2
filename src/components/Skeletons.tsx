export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-white/5 ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6">
      <Skeleton className="h-40 rounded-xl" />
      <div className="mt-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

export function StatSkeleton() {
  return <div className="glass rounded-xl p-5"><Skeleton className="h-6 w-1/3" /><Skeleton className="h-8 w-1/2 mt-3" /></div>
}


