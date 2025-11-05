import { CardSkeleton, StatSkeleton } from '@/components/Skeletons'

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container-page py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 glass rounded-2xl p-6 h-fit sticky top-24" />
          <main className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}


