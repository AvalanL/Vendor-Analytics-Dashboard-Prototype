'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to PTS Training page on initial load
    router.push('/pts-training')
  }, [router])

  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Redirecting to PTS Training...</h1>
        <p className="text-gray-600">Please wait while we redirect you to the PTS Training dashboard.</p>
      </div>
    </div>
  )
}
