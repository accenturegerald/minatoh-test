import { useState } from 'react';
import { Therapist } from '../types';
import { TherapistCard } from './TherapistCard';
import { Star, ArrowUpDown, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

interface PriorityListProps {
  therapists: Therapist[];
  onAssign?: (therapistId: string) => void;
  allowCommissionEdit?: boolean;
}

type SortMode = 'commission' | 'serves' | 'rating' | 'lastServed';

export function PriorityList({ therapists, onAssign, allowCommissionEdit = false }: PriorityListProps) {
  const [sortMode, setSortMode] = useState<SortMode>('commission');
  const [localTherapists, setLocalTherapists] = useState(therapists);

  const sortTherapists = (mode: SortMode, therapistList: Therapist[]) => {
    const sorted = [...therapistList];
    
    switch (mode) {
      case 'commission':
        // Lower commission is better for business - prioritize ascending order
        return sorted.sort((a, b) => a.commissionRate - b.commissionRate);
      case 'serves':
        // Lower serves means more availability - prioritize ascending order
        return sorted.sort((a, b) => a.todayServes - b.todayServes);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lastServed':
        return sorted.sort((a, b) => {
          const aTime = a.lastServedTime?.getTime() || 0;
          const bTime = b.lastServedTime?.getTime() || 0;
          // Earlier time (longer since served) comes first
          return aTime - bTime;
        });
      default:
        return sorted;
    }
  };

  const handleSortChange = (mode: SortMode) => {
    setSortMode(mode);
    setLocalTherapists(sortTherapists(mode, localTherapists));
  };

  const handleCommissionEdit = (therapistId: string, newRate: number) => {
    setLocalTherapists(prev => {
      const updated = prev.map(t => 
        t.id === therapistId ? { ...t, commissionRate: newRate } : t
      );
      return sortTherapists(sortMode, updated);
    });
    toast.success(`Commission rate updated to ${newRate}%`);
  };

  const availableTherapists = localTherapists.filter(t => t.status === 'available');
  const busyTherapists = localTherapists.filter(t => t.status === 'busy');
  const otherTherapists = localTherapists.filter(t => t.status !== 'available' && t.status !== 'busy');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <h3>Therapist Priority</h3>
          <Badge variant="secondary">
            {availableTherapists.length} Available
          </Badge>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={sortMode === 'commission' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSortChange('commission')}
            className="transition-minatoh"
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Commission %
          </Button>
          <Button
            variant={sortMode === 'serves' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSortChange('serves')}
            className="transition-minatoh"
          >
            <ArrowUpDown className="w-4 h-4 mr-1" />
            Serves
          </Button>
          <Button
            variant={sortMode === 'rating' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSortChange('rating')}
            className="transition-minatoh"
          >
            <Star className="w-4 h-4 mr-1" />
            Rating
          </Button>
          <Button
            variant={sortMode === 'lastServed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSortChange('lastServed')}
            className="transition-minatoh"
          >
            <ArrowUpDown className="w-4 h-4 mr-1" />
            Last Served
          </Button>
        </div>
      </div>

      {availableTherapists.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm text-muted-foreground">Available Now</h4>
          <div className="grid gap-3">
            {availableTherapists.map((therapist, index) => (
              <div 
                key={therapist.id} 
                className="animate-stagger"
                style={{ '--stagger-delay': index } as React.CSSProperties}
              >
                <TherapistCard
                  therapist={therapist}
                  variant="priority"
                  onAssign={onAssign ? () => onAssign(therapist.id) : undefined}
                  showCommissionEdit={allowCommissionEdit}
                  onEditCommission={(rate) => handleCommissionEdit(therapist.id, rate)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {busyTherapists.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm text-muted-foreground">Currently Busy</h4>
          <div className="grid gap-3">
            {busyTherapists.map((therapist, index) => (
              <div 
                key={therapist.id}
                className="animate-stagger opacity-75"
                style={{ '--stagger-delay': index } as React.CSSProperties}
              >
                <TherapistCard
                  therapist={therapist}
                  variant="priority"
                  showCommissionEdit={allowCommissionEdit}
                  onEditCommission={(rate) => handleCommissionEdit(therapist.id, rate)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {otherTherapists.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm text-muted-foreground">Unavailable</h4>
          <div className="grid gap-3">
            {otherTherapists.map((therapist, index) => (
              <div 
                key={therapist.id}
                className="animate-stagger opacity-50"
                style={{ '--stagger-delay': index } as React.CSSProperties}
              >
                <TherapistCard
                  therapist={therapist}
                  variant="priority"
                  showCommissionEdit={allowCommissionEdit}
                  onEditCommission={(rate) => handleCommissionEdit(therapist.id, rate)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
