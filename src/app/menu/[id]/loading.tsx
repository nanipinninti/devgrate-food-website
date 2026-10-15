export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-8">
      <div className="h-4 w-48 bg-sepia/10 rounded-sm mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery skeleton */}
        <div>
          <div className="h-80 w-full bg-sepia/10 rounded-sm border-2 border-brass/10 animate-pulse" />
          <div className="flex gap-3 mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-16 w-20 bg-sepia/10 rounded-sm border border-brass/10 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
        {/* Info skeleton */}
        <div className="flex flex-col gap-4">
          <div className="h-4 w-20 bg-sepia/10 rounded-sm" />
          <div className="h-8 w-3/4 bg-sepia/10 rounded-sm" />
          <div className="h-4 w-full bg-sepia/10 rounded-sm" />
          <div className="h-4 w-5/6 bg-sepia/10 rounded-sm" />
          <div className="h-4 w-2/3 bg-sepia/10 rounded-sm" />
          <div className="h-12 w-full bg-sepia/10 rounded-sm mt-4" />
          <div className="h-12 w-full bg-sepia/10 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
