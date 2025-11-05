import { Skeleton } from '@/components/Skeletons'

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container-page pt-6">
        <div className="h-6 w-40"><Skeleton className="h-6 w-40" /></div>
      </div>
      <section className="py-8">
        <div className="container-page grid lg:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="h-[420px] rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </section>
    </div>
  )
}


