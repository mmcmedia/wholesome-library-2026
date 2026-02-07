/**
 * Skeleton Table - Table skeleton loader for admin queue
 */

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 5, columns = 5 }: SkeletonTableProps) {
  return (
    <div className="w-full animate-pulse-subtle">
      {/* Table header */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={`header-${i}`} className="h-4 bg-gray-300 rounded w-2/3" />
          ))}
        </div>
      </div>
      
      {/* Table rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="border border-gray-200 rounded-lg p-3"
          >
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="h-4 bg-gray-200 rounded"
                  style={{
                    width: colIndex === 0 ? '80%' : '60%',
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
