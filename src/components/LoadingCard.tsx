export function LoadingCard() {
  return (
    <div className="glass-effect p-4 md:p-6 rounded-lg flex flex-col sm:flex-row gap-4 md:gap-6 animate-pulse">
      <div className="flex-shrink-0 w-full sm:w-[120px]">
        <div className="relative w-full pt-[150%] sm:pt-[0] sm:h-[180px] bg-white/10 rounded-lg" />
      </div>

      <div className="flex-grow space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="h-6 bg-white/10 rounded w-3/4" />
          <div className="h-6 bg-white/10 rounded w-16" />
        </div>

        <div className="h-4 bg-white/10 rounded w-full" />
        <div className="h-4 bg-white/10 rounded w-5/6" />

        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 bg-white/10 rounded-full w-16" />
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-8 bg-white/10 rounded-full w-20" />
            ))}
          </div>
          <div className="h-8 w-8 bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
