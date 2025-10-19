import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { getQueueEntries, therapists } from '../lib/mockData';
import { TimerChip } from '../components/TimerChip';
import { TherapistCard } from '../components/TherapistCard';
import { User, GripVertical, UserPlus, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { QueueEntry } from '../types';

export function Queue() {
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>(getQueueEntries());
  const [draggedItem, setDraggedItem] = useState<QueueEntry | null>(null);

  const handleDragStart = (entry: QueueEntry) => {
    setDraggedItem(entry);
  };

  const handleDragOver = (e: React.DragEvent, targetEntry: QueueEntry) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetEntry.id) return;

    const newQueue = [...queueEntries];
    const draggedIndex = newQueue.findIndex(e => e.id === draggedItem.id);
    const targetIndex = newQueue.findIndex(e => e.id === targetEntry.id);

    newQueue.splice(draggedIndex, 1);
    newQueue.splice(targetIndex, 0, draggedItem);

    // Update positions
    const updatedQueue = newQueue.map((entry, index) => ({
      ...entry,
      position: index + 1,
      client: { ...entry.client, priority: index + 1 }
    }));

    setQueueEntries(updatedQueue);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    toast.success('Queue order updated');
  };

  const handleAssign = (entryId: string, therapistId: string) => {
    const therapist = therapists.find(t => t.id === therapistId);
    const entry = queueEntries.find(e => e.id === entryId);
    
    if (therapist && entry) {
      toast.success(`${entry.client.name || 'Guest'} assigned to ${therapist.name}`);
      setQueueEntries(prev => prev.filter(e => e.id !== entryId));
    }
  };

  const handleAutoAssign = (entryId: string) => {
    const entry = queueEntries.find(e => e.id === entryId);
    if (!entry) return;

    // Auto-assign logic: available therapist with matching gender preference
    const availableTherapists = therapists.filter(t => {
      const isAvailable = t.status === 'available';
      const matchesGender = !entry.client.preferredGender || 
                           entry.client.preferredGender === 'any' || 
                           t.gender === entry.client.preferredGender;
      return isAvailable && matchesGender;
    });

    if (availableTherapists.length === 0) {
      toast.error('No available therapists matching preferences');
      return;
    }

    // Sort by: commission % desc, then by last served time (earliest first for tie)
    const sorted = availableTherapists.sort((a, b) => {
      if (b.commissionRate !== a.commissionRate) {
        return b.commissionRate - a.commissionRate;
      }
      const aTime = a.lastServedTime?.getTime() || 0;
      const bTime = b.lastServedTime?.getTime() || 0;
      return aTime - bTime; // Earlier time first
    });

    const assigned = sorted[0];
    toast.success(`Auto-assigned to ${assigned.name} (${assigned.commissionRate}% commission)`);
    setQueueEntries(prev => prev.filter(e => e.id !== entryId));
  };

  const availableTherapists = therapists.filter(t => t.status === 'available');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Queue Management</h1>
          <p className="text-muted-foreground">
            {queueEntries.length} client{queueEntries.length !== 1 ? 's' : ''} waiting • {availableTherapists.length} therapist{availableTherapists.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <Clock className="w-4 h-4 mr-2" />
          Live Queue
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Waiting List</CardTitle>
                <span className="text-sm text-muted-foreground">
                  Drag to reorder priority
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {queueEntries.length > 0 ? (
                <div className="space-y-3">
                  {queueEntries.map((entry, index) => {
                    const matchingTherapists = therapists.filter(t => {
                      const isAvailable = t.status === 'available';
                      const matchesGender = !entry.client.preferredGender || 
                                           entry.client.preferredGender === 'any' || 
                                           t.gender === entry.client.preferredGender;
                      return isAvailable && matchesGender;
                    });

                    return (
                      <div
                        key={entry.id}
                        draggable
                        onDragStart={() => handleDragStart(entry)}
                        onDragOver={(e) => handleDragOver(e, entry)}
                        onDragEnd={handleDragEnd}
                        className={`p-4 rounded-lg border-2 bg-card transition-minatoh cursor-move hover:shadow-md animate-stagger ${
                          draggedItem?.id === entry.id ? 'opacity-50 border-primary' : 'border-border'
                        } ${entry.isLate ? 'border-l-4 border-l-destructive' : ''}`}
                        style={{ '--stagger-delay': index } as React.CSSProperties}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-5 h-5 text-muted-foreground" />
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary">
                              {entry.position}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                <User className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{entry.client.name || 'Walk-in Guest'}</span>
                                  {entry.isLate && (
                                    <Badge variant="destructive" className="text-xs">
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      Late
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    {entry.client.type}
                                  </Badge>
                                </div>
                                {entry.client.phone && (
                                  <div className="text-xs text-muted-foreground">{entry.client.phone}</div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm mb-3">
                              <span className="text-muted-foreground">{entry.client.service.name}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-muted-foreground">{entry.client.service.duration}m</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-muted-foreground capitalize">Prefers: {entry.client.preferredGender}</span>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <TimerChip 
                                startTime={entry.client.waitingSince} 
                                variant="elapsed"
                                size="sm"
                              />
                              <Badge variant="secondary" className="text-xs">
                                {matchingTherapists.length} available
                              </Badge>
                            </div>

                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleAutoAssign(entry.id)}
                                disabled={matchingTherapists.length === 0}
                                className="flex-1"
                              >
                                <UserPlus className="w-4 h-4 mr-1" />
                                Auto-Assign
                              </Button>
                              {matchingTherapists.slice(0, 2).map(therapist => (
                                <Button
                                  key={therapist.id}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAssign(entry.id, therapist.id)}
                                  className="transition-minatoh"
                                >
                                  {therapist.name.split(' ')[0]}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <User className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>No clients in queue</p>
                  <p className="text-sm mt-1">Walk-in clients will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Queue Management Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>
                <strong className="text-foreground">Reordering:</strong> Drag and drop clients to manually adjust priority. Auto-promote applies when clients are late &gt;15 minutes.
              </div>
              <div>
                <strong className="text-foreground">Auto-Assignment:</strong> Matches by gender preference, then sorts by commission % (highest first). Tie-breaker: therapist who was last served earliest.
              </div>
              <div>
                <strong className="text-foreground">Buffer Time:</strong> 15m buffer between services. Escort time: 12m for client handoff.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Available Therapists</CardTitle>
                <Badge variant="secondary">{availableTherapists.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {availableTherapists.length > 0 ? (
                <div className="space-y-3">
                  {availableTherapists.map((therapist, index) => (
                    <div 
                      key={therapist.id}
                      className="animate-stagger"
                      style={{ '--stagger-delay': index } as React.CSSProperties}
                    >
                      <TherapistCard therapist={therapist} variant="compact" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">All therapists are currently busy</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
