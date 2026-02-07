/**
 * Skeleton Card - Story card skeleton loader with pulse animation
 */

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse-subtle">
      {/* Image placeholder */}
      <div className="h-48 bg-gray-200" />
      
      {/* Content placeholder */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        
        {/* Description lines */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
        
        {/* Tags */}
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-gray-200 rounded-full w-16" />
          <div className="h-6 bg-gray-200 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
}
