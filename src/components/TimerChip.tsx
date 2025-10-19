import { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';
import { Badge } from './ui/badge';

interface TimerChipProps {
  startTime: Date;
  endTime?: Date;
  variant?: 'elapsed' | 'remaining' | 'scheduled';
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function TimerChip({ 
  startTime, 
  endTime, 
  variant = 'elapsed',
  showIcon = true,
  size = 'md'
}: TimerChipProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const calculateTime = () => {
    if (variant === 'remaining' && endTime) {
      const diff = endTime.getTime() - currentTime;
      return Math.max(0, Math.floor(diff / 60000));
    } else if (variant === 'scheduled' && endTime) {
      const diff = endTime.getTime() - currentTime;
      return Math.floor(diff / 60000);
    } else {
      const diff = currentTime - startTime.getTime();
      return Math.floor(diff / 60000);
    }
  };

  const minutes = calculateTime();
  const isLate = variant === 'scheduled' && minutes > 15;
  const isUrgent = variant === 'remaining' && minutes <= 5 && minutes > 0;
  const isOvertime = variant === 'remaining' && minutes === 0;

  const formatTime = (mins: number) => {
    const absMinutes = Math.abs(mins);
    const hours = Math.floor(absMinutes / 60);
    const remainingMins = absMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMins}m`;
    }
    return `${absMinutes}m`;
  };

  const getBadgeVariant = () => {
    if (isOvertime || isLate) return 'destructive';
    if (isUrgent) return 'default';
    return 'secondary';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <Badge 
      variant={getBadgeVariant()} 
      className={`flex items-center gap-1 transition-minatoh ${sizeClasses[size]}`}
    >
      {showIcon && (
        isLate || isOvertime ? (
          <Zap className="w-3 h-3" />
        ) : (
          <Clock className="w-3 h-3" />
        )
      )}
      <span>
        {variant === 'scheduled' && minutes < 0 && '-'}
        {formatTime(minutes)}
        {variant === 'remaining' && ' left'}
        {isLate && ' late'}
      </span>
    </Badge>
  );
}
