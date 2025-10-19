import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ServicePicker } from '../components/ServicePicker';
import { GenderPicker } from '../components/GenderPicker';
import { Service, Gender, Therapist } from '../types';
import { getTherapistsForService } from '../lib/mockData';
import { UserPlus, CheckCircle, TrendingDown, Star, Users, ArrowRight, Clock, CircleOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

const ESCORT_BUFFER_MINUTES = 12;
const LATE_THRESHOLD_MINUTES = 15;

export function WalkIn() {
  const [selectedService, setSelectedService] = useState<Service | undefined>();
  const [selectedGender, setSelectedGender] = useState<Gender>('any');
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | undefined>();
  const [clientName, setClientName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingTherapist, setPendingTherapist] = useState<Therapist | undefined>();

  const allTherapists = selectedService 
    ? getTherapistsForService(selectedService.id, selectedGender)
    : [];
  
  // Sort therapists by priority: available first, then lowest commission, fewest serves, last served
  const prioritizedTherapists = [...allTherapists].sort((a, b) => {
    // Available therapists come first
    if (a.status === 'available' && b.status !== 'available') return -1;
    if (a.status !== 'available' && b.status === 'available') return 1;
    
    // Among same status, sort by commission
    if (a.commissionRate !== b.commissionRate) {
      return a.commissionRate - b.commissionRate; // Lower commission = higher priority
    }
    
    // Then by serves
    if (a.todayServes !== b.todayServes) {
      return a.todayServes - b.todayServes; // Fewer serves = higher priority
    }
    
    // Finally by last served time
    const aTime = a.lastServedTime?.getTime() || 0;
    const bTime = b.lastServedTime?.getTime() || 0;
    return aTime - bTime;
  });

  const availableCount = prioritizedTherapists.filter(t => t.status === 'available').length;
  const busyCount = prioritizedTherapists.filter(t => t.status === 'busy').length;

  const formatAvailableTime = (endTime: Date) => {
    const hours = endTime.getHours();
    const minutes = endTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const getMinutesUntilFree = (endTime: Date) => {
    const minutes = Math.ceil((endTime.getTime() - Date.now()) / 60000);
    return Math.max(0, minutes);
  };

  const calculateEstimatedStartTime = (therapist: Therapist): { time: Date; delay: number } => {
    const now = new Date();
    
    if (therapist.status === 'available') {
      return { time: now, delay: 0 };
    }
    
    if (therapist.serviceEndTime) {
      // Add escort buffer time
      const startTime = new Date(therapist.serviceEndTime.getTime() + ESCORT_BUFFER_MINUTES * 60000);
      const delay = Math.ceil((startTime.getTime() - now.getTime()) / 60000);
      return { time: startTime, delay };
    }
    
    return { time: now, delay: 0 };
  };

  const handleTherapistClick = (therapist: Therapist) => {
    if (!selectedService) {
      toast.error('Please select a service first');
      return;
    }

    setPendingTherapist(therapist);
    setShowConfirmation(true);
  };

  const handleConfirmAssignment = () => {
    if (!pendingTherapist || !selectedService) return;

    setSelectedTherapist(pendingTherapist);
    setShowConfirmation(false);
    setShowSuccess(true);
    
    const { delay } = calculateEstimatedStartTime(pendingTherapist);
    if (delay > 0) {
      toast.success(`Assigned ${clientName || 'Guest'} to ${pendingTherapist.name} (starts in ${delay}m)`);
    } else {
      toast.success(`Assigned ${clientName || 'Guest'} to ${pendingTherapist.name}`);
    }

    setTimeout(() => {
      handleReset();
    }, 2500);
  };

  const handleReset = () => {
    setShowSuccess(false);
    setShowConfirmation(false);
    setSelectedService(undefined);
    setSelectedGender('any');
    setSelectedTherapist(undefined);
    setPendingTherapist(undefined);
    setClientName('');
  };

  if (showSuccess && selectedService && selectedTherapist) {
    return (
      <div className="p-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-secondary" />
            </div>
            <h2 className="mb-2">Client Assigned!</h2>
            <p className="text-muted-foreground mb-6">
              {clientName || 'Guest'} → {selectedTherapist.name}
            </p>
            <div className="bg-muted p-4 rounded-lg mb-6 text-left max-w-md mx-auto space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service:</span>
                <span>{selectedService.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span>{selectedService.duration} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Therapist:</span>
                <span>{selectedTherapist.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Commission:</span>
                <span className="text-secondary">{selectedTherapist.commissionRate}%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Resetting...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Walk-in Assignment</h1>
        <p className="text-muted-foreground">Quick service selection and therapist assignment</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Service & Preferences */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label>Service *</Label>
                <div className="mt-2">
                  <ServicePicker 
                    selectedService={selectedService}
                    onSelect={setSelectedService}
                    variant="detailed"
                  />
                </div>
              </div>

              <div>
                <Label>Therapist Preference</Label>
                <div className="mt-2">
                  <GenderPicker 
                    selectedGender={selectedGender}
                    onSelect={setSelectedGender}
                    variant="compact"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="clientName">Client Name (Optional)</Label>
                <Input
                  id="clientName"
                  placeholder="Guest"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Priority Info */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm">Auto-Prioritization</h4>
                  <p className="text-xs text-muted-foreground">
                    Staff ranked by: <span className="font-medium text-foreground">Lowest commission</span> → 
                    Fewest serves → Longest wait. Busy staff include {ESCORT_BUFFER_MINUTES}m escort buffer.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Available Therapists */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3>Qualified Staff</h3>
                  {selectedService && (
                    <div className="flex gap-1">
                      <Badge variant="secondary">
                        {availableCount} Available
                      </Badge>
                      {busyCount > 0 && (
                        <Badge variant="outline">
                          {busyCount} Busy
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                {selectedService && (
                  <Badge variant="outline" className="text-xs">
                    {selectedService.duration}min
                  </Badge>
                )}
              </div>

              {!selectedService ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select a service to see qualified staff</p>
                </div>
              ) : prioritizedTherapists.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CircleOff className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No staff can perform this service</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => setSelectedGender('any')}
                  >
                    Show All Genders
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {prioritizedTherapists.map((therapist, index) => {
                    const isAvailable = therapist.status === 'available';
                    const isBusy = therapist.status === 'busy';
                    const isOnBreak = therapist.status === 'break';
                    const isRecommended = index === 0 && isAvailable;
                    const lowestCommission = prioritizedTherapists.find(t => t.status === 'available')?.commissionRate;
                    const isBestCommission = isAvailable && therapist.commissionRate === lowestCommission;

                    return (
                      <button
                        key={therapist.id}
                        onClick={() => handleTherapistClick(therapist)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-minatoh relative overflow-hidden ${
                          isRecommended
                            ? 'border-primary bg-primary/5 hover:bg-primary/10 shadow-sm'
                            : isAvailable
                            ? 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
                            : 'border-border bg-card hover:border-accent/50 hover:shadow-sm'
                        }`}
                      >
                        {isRecommended && (
                          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl-lg flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            Recommended
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className={
                              isRecommended 
                                ? 'bg-primary text-primary-foreground' 
                                : isAvailable 
                                ? 'bg-muted' 
                                : 'bg-accent/20'
                            }>
                              {therapist.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">
                                {therapist.name}
                              </span>
                              {isBestCommission && (
                                <Badge variant="secondary" className="text-xs">
                                  Best Rate
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                              <div className="flex items-center gap-1">
                                <TrendingDown className="w-3 h-3" />
                                <span className={isBestCommission ? 'text-secondary font-medium' : ''}>
                                  {therapist.commissionRate}%
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {therapist.todayServes} today
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current text-accent" />
                                {therapist.rating}
                              </div>
                            </div>

                            {/* Availability Status */}
                            {isBusy && therapist.serviceEndTime && (
                              <div className="flex items-center gap-1 mt-1 text-xs">
                                <Clock className="w-3 h-3 text-accent" />
                                <span className="text-accent font-medium">
                                  Free at {formatAvailableTime(new Date(therapist.serviceEndTime.getTime() + ESCORT_BUFFER_MINUTES * 60000))}
                                </span>
                                <span className="text-muted-foreground">
                                  (+{ESCORT_BUFFER_MINUTES}m buffer)
                                </span>
                              </div>
                            )}
                            {isOnBreak && therapist.serviceEndTime && (
                              <div className="flex items-center gap-1 mt-1 text-xs">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  Break ends {formatAvailableTime(therapist.serviceEndTime)}
                                </span>
                              </div>
                            )}
                          </div>

                          <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Assignment</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>Please confirm the following assignment:</p>
                
                {pendingTherapist && selectedService && (
                  <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Client:</span>
                      <span className="font-medium text-foreground">{clientName || 'Guest'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service:</span>
                      <span className="font-medium text-foreground">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium text-foreground">{selectedService.duration} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Therapist:</span>
                      <span className="font-medium text-foreground">{pendingTherapist.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Commission:</span>
                      <span className="font-medium text-secondary">{pendingTherapist.commissionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium text-foreground capitalize">{pendingTherapist.status}</span>
                    </div>
                    
                    {(() => {
                      const { time, delay } = calculateEstimatedStartTime(pendingTherapist);
                      if (delay > 0) {
                        return (
                          <>
                            <div className="flex justify-between items-center pt-2 border-t">
                              <span className="text-muted-foreground">Estimated Start:</span>
                              <span className="font-medium text-accent">{formatAvailableTime(time)}</span>
                            </div>
                            <div className="flex items-start gap-2 p-2 bg-accent/10 rounded text-xs text-accent-foreground">
                              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span>
                                This therapist is currently {pendingTherapist.status}. 
                                Service will start in approximately {delay} minutes (includes {ESCORT_BUFFER_MINUTES}m escort buffer).
                              </span>
                            </div>
                          </>
                        );
                      }
                      return (
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-muted-foreground">Start Time:</span>
                          <span className="font-medium text-secondary">Immediately</span>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingTherapist(undefined)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAssignment}>Confirm Assignment</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
