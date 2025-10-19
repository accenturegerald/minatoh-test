import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { PriorityList } from '../components/PriorityList';
import { TherapistCard } from '../components/TherapistCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { therapists as initialTherapists, services } from '../lib/mockData';
import { Therapist, Gender } from '../types';
import { UserPlus, Users, Settings, Edit, X, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner@2.0.3';

export function Staff() {
  const [view, setView] = useState<'priority' | 'grid' | 'list'>('priority');
  const [localTherapists, setLocalTherapists] = useState(initialTherapists);
  const [showAddEditDialog, setShowAddEditDialog] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(null);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formGender, setFormGender] = useState<Gender>('female');
  const [formCommission, setFormCommission] = useState('40');
  const [formRating, setFormRating] = useState('4.5');
  const [formServiceIds, setFormServiceIds] = useState<string[]>([]);

  const statusGroups = {
    available: localTherapists.filter(t => t.status === 'available'),
    busy: localTherapists.filter(t => t.status === 'busy'),
    break: localTherapists.filter(t => t.status === 'break'),
    offline: localTherapists.filter(t => t.status === 'offline'),
  };

  const handleOpenAddDialog = () => {
    setEditingTherapist(null);
    setFormName('');
    setFormGender('female');
    setFormCommission('40');
    setFormRating('4.5');
    setFormServiceIds([]);
    setShowAddEditDialog(true);
  };

  const handleOpenEditDialog = (therapist: Therapist) => {
    setEditingTherapist(therapist);
    setFormName(therapist.name);
    setFormGender(therapist.gender);
    setFormCommission(therapist.commissionRate.toString());
    setFormRating(therapist.rating.toString());
    setFormServiceIds(therapist.serviceIds);
    setShowAddEditDialog(true);
  };

  const handleSaveTherapist = () => {
    const commission = parseFloat(formCommission);
    const rating = parseFloat(formRating);

    if (!formName.trim()) {
      toast.error('Please enter a name');
      return;
    }

    if (isNaN(commission) || commission < 0 || commission > 100) {
      toast.error('Commission must be between 0 and 100');
      return;
    }

    if (isNaN(rating) || rating < 0 || rating > 5) {
      toast.error('Rating must be between 0 and 5');
      return;
    }

    if (formServiceIds.length === 0) {
      toast.error('Please select at least one service capability');
      return;
    }

    if (editingTherapist) {
      // Update existing therapist
      setLocalTherapists(prev => prev.map(t => 
        t.id === editingTherapist.id
          ? {
              ...t,
              name: formName.trim(),
              gender: formGender,
              commissionRate: commission,
              rating,
              serviceIds: formServiceIds,
              specialties: services
                .filter(s => formServiceIds.includes(s.id))
                .map(s => s.type)
                .filter((v, i, a) => a.indexOf(v) === i),
            }
          : t
      ));
      toast.success(`Updated ${formName}`);
    } else {
      // Add new therapist
      const newTherapist: Therapist = {
        id: `t${Date.now()}`,
        name: formName.trim(),
        gender: formGender,
        status: 'available',
        commissionRate: commission,
        totalServes: 0,
        todayServes: 0,
        todayCommission: 0,
        rating,
        serviceIds: formServiceIds,
        specialties: services
          .filter(s => formServiceIds.includes(s.id))
          .map(s => s.type)
          .filter((v, i, a) => a.indexOf(v) === i),
        lastServedTime: new Date(),
      };
      setLocalTherapists(prev => [...prev, newTherapist]);
      toast.success(`Added ${formName}`);
    }

    setShowAddEditDialog(false);
  };

  const toggleServiceId = (serviceId: string) => {
    setFormServiceIds(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Staff Management</h1>
          <p className="text-muted-foreground">
            {localTherapists.length} therapists • {statusGroups.available.length} available
          </p>
        </div>
        <Button onClick={handleOpenAddDialog}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Therapist
        </Button>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full">
        <TabsList>
          <TabsTrigger value="priority">
            <Settings className="w-4 h-4 mr-2" />
            Priority View
          </TabsTrigger>
          <TabsTrigger value="grid">
            <Users className="w-4 h-4 mr-2" />
            Grid View
          </TabsTrigger>
          <TabsTrigger value="list">
            Status Groups
          </TabsTrigger>
        </TabsList>

        <TabsContent value="priority" className="space-y-4">
          <PriorityList 
            therapists={localTherapists}
            allowCommissionEdit={true}
          />

          <Card>
            <CardHeader>
              <CardTitle>Rationale: Priority View</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This view is designed for managers to optimize assignment decisions. It shows therapists in priority order 
                based on selectable criteria (commission %, total serves, rating, or last-served time). The "Best" badges 
                highlight top performers. Manager-only commission rate editing is enabled here for fair compensation adjustments. 
                The tie-breaker (last-served) ensures equitable work distribution when multiple therapists have the same commission rate.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {localTherapists.map((therapist, index) => (
              <div 
                key={therapist.id}
                className="animate-stagger relative group"
                style={{ '--stagger-delay': index } as React.CSSProperties}
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleOpenEditDialog(therapist)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <TherapistCard 
                  therapist={therapist}
                  variant="detailed"
                />
              </div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rationale: Grid View</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This view provides a comprehensive overview of all therapists with detailed metrics displayed in cards. 
                It's ideal for general staff monitoring, showing real-time status, performance stats, and service timers. 
                The grid layout maximizes screen space while maintaining readability. Each card shows commission earnings, 
                serve counts, and ratings for quick assessment. Hover over any card to edit therapist details.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {statusGroups.available.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Available</CardTitle>
                  <Badge variant="secondary" className="bg-secondary">
                    {statusGroups.available.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {statusGroups.available.map((therapist, index) => (
                    <div 
                      key={therapist.id}
                      className="animate-stagger relative group"
                      style={{ '--stagger-delay': index } as React.CSSProperties}
                    >
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0"
                        onClick={() => handleOpenEditDialog(therapist)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <TherapistCard therapist={therapist} variant="compact" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {statusGroups.busy.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Currently Busy</CardTitle>
                  <Badge variant="destructive">
                    {statusGroups.busy.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {statusGroups.busy.map((therapist, index) => (
                    <div 
                      key={therapist.id}
                      className="animate-stagger relative group"
                      style={{ '--stagger-delay': index } as React.CSSProperties}
                    >
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0"
                        onClick={() => handleOpenEditDialog(therapist)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <TherapistCard therapist={therapist} variant="priority" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {statusGroups.break.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>On Break</CardTitle>
                  <Badge variant="default" className="bg-accent text-accent-foreground">
                    {statusGroups.break.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {statusGroups.break.map((therapist, index) => (
                    <div 
                      key={therapist.id}
                      className="animate-stagger relative group"
                      style={{ '--stagger-delay': index } as React.CSSProperties}
                    >
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0"
                        onClick={() => handleOpenEditDialog(therapist)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <TherapistCard therapist={therapist} variant="priority" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {statusGroups.offline.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Offline</CardTitle>
                  <Badge variant="outline">
                    {statusGroups.offline.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {statusGroups.offline.map((therapist, index) => (
                    <div 
                      key={therapist.id}
                      className="animate-stagger opacity-60 relative group"
                      style={{ '--stagger-delay': index } as React.CSSProperties}
                    >
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0"
                        onClick={() => handleOpenEditDialog(therapist)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <TherapistCard therapist={therapist} variant="compact" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Rationale: Status Groups View</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This view organizes therapists by their current status, making it easy to see at a glance who's working, 
                who's on break, and who's offline. It's particularly useful during shift changes or when planning assignments. 
                The busy section shows service end timers, helping managers anticipate when therapists will become available. 
                This supports the 15-minute buffer and 12-minute escort time requirements.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Therapist Dialog */}
      <Dialog open={showAddEditDialog} onOpenChange={setShowAddEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTherapist ? 'Edit Therapist' : 'Add New Therapist'}
            </DialogTitle>
            <DialogDescription>
              {editingTherapist 
                ? 'Update therapist information and service capabilities'
                : 'Enter therapist information and assign service capabilities'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Enter full name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formGender} onValueChange={(v) => setFormGender(v as Gender)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="commission">Commission Rate (%) *</Label>
                <Input
                  id="commission"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formCommission}
                  onChange={(e) => setFormCommission(e.target.value)}
                  placeholder="40"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="rating">Rating (0-5) *</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formRating}
                  onChange={(e) => setFormRating(e.target.value)}
                  placeholder="4.5"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Service Capabilities *</Label>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Select all services this therapist is qualified to perform
                  </p>
                  <div className="space-y-2">
                    {services.map(service => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={formServiceIds.includes(service.id)}
                          onCheckedChange={() => toggleServiceId(service.id)}
                        />
                        <label
                          htmlFor={`service-${service.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center justify-between flex-1"
                        >
                          <span>{service.name}</span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {service.type}
                            </Badge>
                            <span>{service.duration}min</span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {formServiceIds.length > 0 && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium mb-2">Selected Services:</p>
                <div className="flex flex-wrap gap-2">
                  {formServiceIds.map(serviceId => {
                    const service = services.find(s => s.id === serviceId);
                    return service ? (
                      <Badge key={serviceId} variant="secondary">
                        {service.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTherapist}>
              <Save className="w-4 h-4 mr-2" />
              {editingTherapist ? 'Update' : 'Add'} Therapist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
