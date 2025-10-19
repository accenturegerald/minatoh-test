import { Therapist } from '../types';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Star, TrendingUp, Edit, User } from 'lucide-react';
import { TimerChip } from './TimerChip';
import { useState } from 'react';
import { Input } from './ui/input';

interface TherapistCardProps {
  therapist: Therapist;
  onAssign?: () => void;
  onEditCommission?: (rate: number) => void;
  showCommissionEdit?: boolean;
  variant?: 'compact' | 'detailed' | 'priority';
}

export function TherapistCard({ 
  therapist, 
  onAssign, 
  onEditCommission,
  showCommissionEdit = false,
  variant = 'detailed'
}: TherapistCardProps) {
  const [isEditingCommission, setIsEditingCommission] = useState(false);
  const [commissionRate, setCommissionRate] = useState(therapist.commissionRate);

  const getStatusColor = (status: Therapist['status']) => {
    switch (status) {
      case 'available': return 'bg-secondary';
      case 'busy': return 'bg-destructive';
      case 'break': return 'bg-accent';
      case 'offline': return 'bg-muted';
    }
  };

  const getStatusLabel = (status: Therapist['status']) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'In Service';
      case 'break': return 'On Break';
      case 'offline': return 'Offline';
    }
  };

  const handleSaveCommission = () => {
    if (onEditCommission && commissionRate >= 0 && commissionRate <= 100) {
      onEditCommission(commissionRate);
      setIsEditingCommission(false);
    }
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={onAssign}
        disabled={therapist.status !== 'available'}
        className={`w-full p-3 rounded-lg border-2 text-left transition-minatoh ${
          therapist.status === 'available'
            ? 'border-border bg-card hover:border-primary hover:shadow-md'
            : 'border-border bg-muted opacity-60 cursor-not-allowed'
        }`}
      >
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {therapist.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{therapist.name}</span>
              {therapist.isBestPerformer && <Star className="w-4 h-4 fill-accent text-accent" />}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className={`${getStatusColor(therapist.status)} text-xs`}>
                {getStatusLabel(therapist.status)}
              </Badge>
              <span>{therapist.commissionRate}%</span>
            </div>
          </div>
        </div>
      </button>
    );
  }

  if (variant === 'priority') {
    return (
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {therapist.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{therapist.name}</h4>
                {therapist.isBestPerformer && (
                  <Badge variant="default" className="bg-accent text-accent-foreground">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Best
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Badge variant="outline" className={getStatusColor(therapist.status)}>
                  {getStatusLabel(therapist.status)}
                </Badge>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  {therapist.rating}
                </span>
              </div>
            </div>
          </div>
          {therapist.serviceEndTime && therapist.status === 'busy' && (
            <TimerChip 
              startTime={new Date()} 
              endTime={therapist.serviceEndTime} 
              variant="remaining"
              size="sm"
            />
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <div className="text-muted-foreground">Commission</div>
            {isEditingCommission && showCommissionEdit ? (
              <div className="flex items-center gap-1 mt-1">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="h-7 w-16 text-sm"
                />
                <Button size="sm" variant="ghost" className="h-7 px-2" onClick={handleSaveCommission}>
                  ✓
                </Button>
              </div>
            ) : (
              <div className="font-medium flex items-center gap-1">
                {therapist.commissionRate}%
                {showCommissionEdit && (
                  <button 
                    onClick={() => setIsEditingCommission(true)}
                    className="text-muted-foreground hover:text-foreground transition-minatoh"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
          <div>
            <div className="text-muted-foreground">Today</div>
            <div className="font-medium">{therapist.todayServes} serves</div>
          </div>
          <div>
            <div className="text-muted-foreground">Earned</div>
            <div className="font-medium text-secondary">${therapist.todayCommission}</div>
          </div>
        </div>

        {onAssign && therapist.status === 'available' && (
          <Button 
            onClick={onAssign} 
            className="w-full mt-3 transition-minatoh"
            size="sm"
          >
            Assign Client
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg border bg-card transition-minatoh hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-14 h-14">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {therapist.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h3>{therapist.name}</h3>
              {therapist.isBestPerformer && (
                <Badge variant="default" className="bg-accent text-accent-foreground">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Best Performer
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <User className="w-4 h-4" />
              <span>{therapist.gender === 'male' ? 'Male' : 'Female'}</span>
              <span className="flex items-center gap-1 ml-2">
                <Star className="w-4 h-4 fill-current text-accent" />
                {therapist.rating}
              </span>
            </div>
          </div>
        </div>
        <Badge className={getStatusColor(therapist.status)}>
          {getStatusLabel(therapist.status)}
        </Badge>
      </div>

      {therapist.status === 'busy' && therapist.serviceEndTime && (
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Service ends in:</span>
            <TimerChip 
              startTime={new Date()} 
              endTime={therapist.serviceEndTime} 
              variant="remaining"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground">Commission</div>
          <div className="font-medium text-primary">{therapist.commissionRate}%</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground">Today Serves</div>
          <div className="font-medium">{therapist.todayServes}</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground">Total Serves</div>
          <div className="font-medium">{therapist.totalServes}</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground">Today Earned</div>
          <div className="font-medium text-secondary">${therapist.todayCommission}</div>
        </div>
      </div>

      {onAssign && therapist.status === 'available' && (
        <Button onClick={onAssign} className="w-full transition-minatoh">
          Assign to Client
        </Button>
      )}
    </div>
  );
}
