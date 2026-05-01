import { Star } from 'lucide-react';
import { cn } from './utils';

interface ProBadgeProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function ProBadge({ className, size = 'sm' }: ProBadgeProps) {
  if (size === 'sm') {
    return (
      <div 
        style={{ backgroundColor: '#10b981' }}
        className={cn(
          "text-white shadow-none rounded-md px-1.5 py-[2px] text-[10px] font-medium inline-flex items-center gap-1 leading-none h-[22px]",
          className
        )}
      >
        <Star className="w-2.5 h-2.5 fill-current" />
        <span>PRO</span>
      </div>
    );
  }

  return (
    <div 
      style={{ backgroundColor: '#10b981' }}
      className={cn(
        "text-white shadow-sm rounded-full px-2 py-0.5 text-[10px] font-bold inline-flex items-center gap-1",
        className
      )}
    >
      <Star className="w-3 h-3 fill-current" />
      <span>PRO</span>
    </div>
  );
}
