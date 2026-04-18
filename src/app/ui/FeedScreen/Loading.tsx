export default function FeedScreenLoading() {
  return (
    <div>
      <header className="flex justify-between w-full p-2 fixed top-0 left-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xs">
        <div className="h-7 w-28 animate-pulse rounded bg-slate-200" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
      </header>

      <main className="pt-16 space-y-3">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex justify-between">
            <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex justify-between">
            <div className="h-5 w-20 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-40 h-13 w-13 animate-pulse rounded-full bg-slate-300" />
    </div>
  );
}
