import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className = '',
  height = 'h-4',
  width = 'w-full',
  rounded = 'md'
}) => {
  const roundedClass = {
    sm: 'rounded-sm',
    md: 'rounded-md', 
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  return (
    <div 
      className={`animate-pulse bg-gradient-to-r from-accent-2 to-accent-3 ${height} ${width} ${roundedClass[rounded]} ${className}`}
    />
  );
};

interface StatCardSkeletonProps {
  count?: number;
}

export const StatCardSkeleton: React.FC<StatCardSkeletonProps> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="p-6 rounded-xl border-2 border-accent-2 bg-accent-1 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <LoadingSkeleton height="h-4" width="w-24" className="mb-2" />
              <LoadingSkeleton height="h-8" width="w-16" className="mb-2" />
              <LoadingSkeleton height="h-3" width="w-32" />
            </div>
            <LoadingSkeleton height="h-12" width="w-12" rounded="full" />
          </div>
          <div className="flex items-center mt-3 pt-3 border-t border-accent-2">
            <LoadingSkeleton height="h-4" width="w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-accent-2 p-6 shadow-lg">
      <div className="flex items-center mb-6">
        <LoadingSkeleton height="h-6" width="w-6" rounded="md" className="mr-3" />
        <LoadingSkeleton height="h-6" width="w-32" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex justify-between items-center py-3">
            <LoadingSkeleton height="h-4" width="w-24" />
            <div className="flex items-center gap-3">
              <LoadingSkeleton height="h-2" width="w-24" rounded="full" />
              <LoadingSkeleton height="h-4" width="w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-xl border border-accent-2 p-6 shadow-lg">
      <div className="flex items-center mb-6">
        <LoadingSkeleton height="h-6" width="w-6" rounded="md" className="mr-3" />
        <LoadingSkeleton height="h-6" width="w-32" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-accent-1 rounded-lg">
            <div className="flex items-center gap-3">
              <LoadingSkeleton height="h-8" width="w-8" rounded="full" />
              <div>
                <LoadingSkeleton height="h-4" width="w-24" className="mb-1" />
                <LoadingSkeleton height="h-3" width="w-16" />
              </div>
            </div>
            <div className="text-right">
              <LoadingSkeleton height="h-5" width="w-12" className="mb-1" />
              <LoadingSkeleton height="h-3" width="w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface DashboardSkeletonProps {
  showStats?: boolean;
  showCharts?: boolean;
  showTables?: boolean;
}

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({ 
  showStats = true, 
  showCharts = true, 
  showTables = true 
}) => {
  return (
    <div className="space-y-8 py-6">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-accent-6 to-accent-8 rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <LoadingSkeleton height="h-8" width="w-64" className="mb-2 bg-white/20" />
            <LoadingSkeleton height="h-5" width="w-96" className="bg-white/10" />
          </div>
          <LoadingSkeleton height="h-12" width="w-12" rounded="lg" className="bg-white/20" />
        </div>
      </div>

      {/* Stats Skeleton */}
      {showStats && <StatCardSkeleton />}

      {/* Charts and Tables */}
      {(showCharts || showTables) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {showCharts && <ChartSkeleton />}
          {showTables && <TableSkeleton />}
        </div>
      )}
    </div>
  );
};

export default LoadingSkeleton;




