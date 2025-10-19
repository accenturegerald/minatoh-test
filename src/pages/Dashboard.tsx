import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { therapists, clients, services } from '../lib/mockData';
import { Users, DollarSign, Clock, TrendingUp, User, AlertCircle } from 'lucide-react';
import { TherapistCard } from '../components/TherapistCard';
import { TimerChip } from '../components/TimerChip';
import { Progress } from '../components/ui/progress';

export function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const activeClients = clients.filter(c => c.status === 'in-service' || c.status === 'waiting');
  const waitingClients = clients.filter(c => c.status === 'waiting');
  const inServiceClients = clients.filter(c => c.status === 'in-service');
  const availableTherapists = therapists.filter(t => t.status === 'available');
  
  const todayRevenue = therapists.reduce((sum, t) => sum + (t.todayCommission / (t.commissionRate / 100)), 0);
  const todayCommissions = therapists.reduce((sum, t) => sum + t.todayCommission, 0);
  const todayServes = therapists.reduce((sum, t) => sum + t.todayServes, 0);
  const avgWaitTime = waitingClients.length > 0
    ? Math.floor(waitingClients.reduce((sum, c) => sum + (Date.now() - c.waitingSince.getTime()), 0) / waitingClients.length / 60000)
    : 0;

  const utilizationRate = ((therapists.filter(t => t.status === 'busy').length / therapists.length) * 100).toFixed(0);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-minatoh hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Revenue</CardTitle>
            <DollarSign className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todayRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {todayServes} services completed
            </p>
          </CardContent>
        </Card>

        <Card className="transition-minatoh hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Commissions</CardTitle>
            <TrendingUp className="w-5 h-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">${todayCommissions.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: ${(todayCommissions / Math.max(todayServes, 1)).toFixed(2)} per service
            </p>
          </CardContent>
        </Card>

        <Card className="transition-minatoh hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Clients</CardTitle>
            <Users className="w-5 h-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients.length}</div>
            <div className="flex gap-2 mt-1 text-xs">
              <span className="text-destructive">{inServiceClients.length} in service</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{waitingClients.length} waiting</span>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-minatoh hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Wait Time</CardTitle>
            <Clock className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgWaitTime}m</div>
            <p className="text-xs text-muted-foreground mt-1">
              {availableTherapists.length} therapists available
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Utilization and Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Therapist Utilization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Current Utilization</span>
                <span className="font-medium">{utilizationRate}%</span>
              </div>
              <Progress value={Number(utilizationRate)} className="h-2" />
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-sm">
              <div>
                <div className="text-2xl font-bold text-secondary">{therapists.filter(t => t.status === 'available').length}</div>
                <div className="text-muted-foreground">Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-destructive">{therapists.filter(t => t.status === 'busy').length}</div>
                <div className="text-muted-foreground">Busy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{therapists.filter(t => t.status === 'break').length}</div>
                <div className="text-muted-foreground">Break</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-muted-foreground">{therapists.filter(t => t.status === 'offline').length}</div>
                <div className="text-muted-foreground">Offline</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {waitingClients.filter(c => c.isLate).length > 0 && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <div className="font-medium">Late Arrivals</div>
                  <div className="text-sm text-muted-foreground">
                    {waitingClients.filter(c => c.isLate).length} client(s) are over 15 minutes late
                  </div>
                </div>
              </div>
            )}
            {waitingClients.length > 3 && (
              <div className="flex items-start gap-2 p-3 bg-accent/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <div className="font-medium">Queue Building Up</div>
                  <div className="text-sm text-muted-foreground">
                    {waitingClients.length} clients waiting for service
                  </div>
                </div>
              </div>
            )}
            {waitingClients.length === 0 && !waitingClients.some(c => c.isLate) && (
              <div className="flex items-center gap-2 p-3 bg-secondary/10 rounded-lg">
                <div className="text-sm text-muted-foreground">
                  All systems running smoothly ✓
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Services */}
      {inServiceClients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inServiceClients.map((client, index) => {
                const therapist = therapists.find(t => t.id === client.assignedTherapist);
                return (
                  <div 
                    key={client.id} 
                    className="flex items-center justify-between p-4 bg-muted rounded-lg animate-stagger"
                    style={{ '--stagger-delay': index } as React.CSSProperties}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{client.name || 'Guest'}</div>
                        <div className="text-sm text-muted-foreground">
                          {client.service.name} • {therapist?.name}
                        </div>
                      </div>
                    </div>
                    {therapist?.serviceEndTime && (
                      <TimerChip 
                        startTime={new Date()} 
                        endTime={therapist.serviceEndTime} 
                        variant="remaining"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Therapists */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Available Therapists</CardTitle>
            <Badge variant="secondary">{availableTherapists.length} Ready</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {availableTherapists.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
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
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No therapists available at the moment</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
