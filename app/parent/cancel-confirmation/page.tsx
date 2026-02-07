import { Suspense } from 'react'
import CancellationContent from './CancellationContent'

export default function CancellationConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-teal/5 to-white" />}>
      <CancellationContent />
    </Suspense>
  )
}
