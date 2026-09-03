export function LoadingSpinner({ text = 'লোড হচ্ছে...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-cloud-mint border-t-slate-ocean" />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  )
}
