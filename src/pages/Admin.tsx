import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Settings, Bell, Users, DollarSign, Clock, Zap, Save, List, Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { services as initialServices } from '../lib/mockData';
import { Service, ServiceType } from '../types';
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

export function Admin() {
  const [settings, setSettings] = useState({
    bufferTime: 15,
    escortTime: 12,
    lateThreshold: 15,
    autoPromote: true,
    enableNotifications: true,
    requireClientPhone: false,
    allowWalkIn: true,
    maxQueueSize: 20,
    defaultCommissionRate: 40,
    enablePOSIntegration: false,
  });

  const [services, setServices] = useState<Service[]>(initialServices);
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  // Service form state
  const [serviceName, setServiceName] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('massage');
  const [serviceDuration, setServiceDuration] = useState('60');
  const [servicePrice, setServicePrice] = useState('80');
  const [serviceCommission, setServiceCommission] = useState('40');

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    setSettings({
      bufferTime: 15,
      escortTime: 12,
      lateThreshold: 15,
      autoPromote: true,
      enableNotifications: true,
      requireClientPhone: false,
      allowWalkIn: true,
      maxQueueSize: 20,
      defaultCommissionRate: 40,
      enablePOSIntegration: false,
    });
    toast.success('Settings reset to defaults');
  };

  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceName('');
    setServiceType('massage');
    setServiceDuration('60');
    setServicePrice('80');
    setServiceCommission('40');
    setShowServiceDialog(true);
  };

  const handleOpenEditService = (service: Service) => {
    setEditingService(service);
    setServiceName(service.name);
    setServiceType(service.type);
    setServiceDuration(service.duration.toString());
    setServicePrice(service.price.toString());
    setServiceCommission(service.commission.toString());
    setShowServiceDialog(true);
  };

  const handleSaveService = () => {
    const duration = parseInt(serviceDuration);
    const price = parseFloat(servicePrice);
    const commission = parseFloat(serviceCommission);

    if (!serviceName.trim()) {
      toast.error('Please enter a service name');
      return;
    }

    if (isNaN(duration) || duration <= 0) {
      toast.error('Duration must be a positive number');
      return;
    }

    if (isNaN(price) || price <= 0) {
      toast.error('Price must be a positive number');
      return;
    }

    if (isNaN(commission) || commission < 0 || commission > 100) {
      toast.error('Commission must be between 0 and 100');
      return;
    }

    if (editingService) {
      setServices(prev => prev.map(s =>
        s.id === editingService.id
          ? {
              ...s,
              name: serviceName.trim(),
              type: serviceType,
              duration,
              price,
              commission,
            }
          : s
      ));
      toast.success(`Updated ${serviceName}`);
    } else {
      const newService: Service = {
        id: `s${Date.now()}`,
        name: serviceName.trim(),
        type: serviceType,
        duration,
        price,
        commission,
      };
      setServices(prev => [...prev, newService]);
      toast.success(`Added ${serviceName}`);
    }

    setShowServiceDialog(false);
  };

  const handleDeleteService = () => {
    if (!deletingService) return;
    
    setServices(prev => prev.filter(s => s.id !== deletingService.id));
    toast.success(`Deleted ${deletingService.name}`);
    setShowDeleteDialog(false);
    setDeletingService(null);
  };

  const handleOpenDeleteDialog = (service: Service) => {
    setDeletingService(service);
    setShowDeleteDialog(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Admin Settings</h1>
          <p className="text-muted-foreground">Configure system preferences and business rules</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetSettings}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full max-w-3xl grid-cols-5">
          <TabsTrigger value="general">
            <Settings className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="services">
            <List className="w-4 h-4 mr-2" />
            Services
          </TabsTrigger>
          <TabsTrigger value="queue">
            <Clock className="w-4 h-4 mr-2" />
            Queue
          </TabsTrigger>
          <TabsTrigger value="staff">
            <Users className="w-4 h-4 mr-2" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Zap className="w-4 h-4 mr-2" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic system configuration and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts for important events and updates
                  </p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enableNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Allow Walk-in Clients</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable walk-in registration without appointment
                  </p>
                </div>
                <Switch
                  checked={settings.allowWalkIn}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, allowWalkIn: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Require Client Phone Number</Label>
                  <p className="text-sm text-muted-foreground">
                    Make phone number mandatory for all registrations
                  </p>
                </div>
                <Switch
                  checked={settings.requireClientPhone}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, requireClientPhone: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxQueue">Maximum Queue Size</Label>
                <Input
                  id="maxQueue"
                  type="number"
                  value={settings.maxQueueSize}
                  onChange={(e) =>
                    setSettings({ ...settings, maxQueueSize: Number(e.target.value) })
                  }
                  min="1"
                  max="100"
                />
                <p className="text-sm text-muted-foreground">
                  Maximum number of clients that can wait in queue
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rationale: General Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This view provides essential system toggles that affect core functionality. The notification system ensures 
                managers stay informed of critical events. Walk-in allowance can be disabled during high-demand periods. 
                Phone number requirements balance data collection with user friction. Queue limits prevent overwhelming staff.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Service Management</CardTitle>
                  <CardDescription>Configure available services and pricing</CardDescription>
                </div>
                <Button onClick={handleOpenAddService}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {services.map(service => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{service.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {service.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{service.duration} min</span>
                        <span>${service.price}</span>
                        <span>{service.commission}% commission</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditService(service)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDeleteDialog(service)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rationale: Service Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This centralized service configuration allows managers to quickly add, edit, or remove services as business 
                needs change. Each service has a defined type, duration, price, and commission structure. These services are 
                used throughout the app for booking, walk-ins, and staff capability assignment. Changes here affect which 
                services staff can be assigned to and what options clients can select.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Queue Management Rules</CardTitle>
              <CardDescription>Configure timing and priority rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bufferTime">Buffer Time Between Services (minutes)</Label>
                <Input
                  id="bufferTime"
                  type="number"
                  value={settings.bufferTime}
                  onChange={(e) =>
                    setSettings({ ...settings, bufferTime: Number(e.target.value) })
                  }
                  min="0"
                  max="60"
                />
                <p className="text-sm text-muted-foreground">
                  Time allocated for room cleaning and therapist preparation
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="escortTime">Escort Time (minutes)</Label>
                <Input
                  id="escortTime"
                  type="number"
                  value={settings.escortTime}
                  onChange={(e) =>
                    setSettings({ ...settings, escortTime: Number(e.target.value) })
                  }
                  min="0"
                  max="30"
                />
                <p className="text-sm text-muted-foreground">
                  Time required to escort client from waiting area to treatment room
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lateThreshold">Late Arrival Threshold (minutes)</Label>
                <Input
                  id="lateThreshold"
                  type="number"
                  value={settings.lateThreshold}
                  onChange={(e) =>
                    setSettings({ ...settings, lateThreshold: Number(e.target.value) })
                  }
                  min="0"
                  max="60"
                />
                <p className="text-sm text-muted-foreground">
                  How many minutes past scheduled time before marking client as late
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-promote Late Clients</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically increase priority for clients marked as late
                  </p>
                </div>
                <Switch
                  checked={settings.autoPromote}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoPromote: checked })
                  }
                />
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Current Configuration Summary</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Buffer:</span>
                    <span className="ml-2 font-medium">{settings.bufferTime}m</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Escort:</span>
                    <span className="ml-2 font-medium">{settings.escortTime}m</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Late Threshold:</span>
                    <span className="ml-2 font-medium">{settings.lateThreshold}m</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Auto-promote:</span>
                    <Badge variant={settings.autoPromote ? 'secondary' : 'outline'} className="ml-2">
                      {settings.autoPromote ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rationale: Queue Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                These settings directly implement the business requirements: 15-minute buffer for room preparation, 
                12-minute escort time for client handoff, and 15-minute late threshold. Auto-promote ensures late 
                clients don't wait indefinitely while maintaining fair queue order. The summary panel shows current 
                values at a glance for quick verification.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff & Commission Settings</CardTitle>
              <CardDescription>Default rates and therapist preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="defaultCommission">Default Commission Rate (%)</Label>
                <Input
                  id="defaultCommission"
                  type="number"
                  value={settings.defaultCommissionRate}
                  onChange={(e) =>
                    setSettings({ ...settings, defaultCommissionRate: Number(e.target.value) })
                  }
                  min="0"
                  max="100"
                />
                <p className="text-sm text-muted-foreground">
                  Commission rate applied to new therapists
                </p>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <DollarSign className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Commission Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Individual therapist commission rates can be adjusted in the Staff page Priority View. 
                      This ensures fair and transparent compensation based on experience, performance, and specialty skills.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Users className="w-5 h-5 text-secondary mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Assignment Priority Algorithm</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      When auto-assigning clients, the system follows these rules:
                    </p>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Filter by gender preference match</li>
                      <li>Sort by commission rate (lowest first for best business value)</li>
                      <li>Tie-breaker: therapist last served earliest gets priority</li>
                      <li>Account for buffer time and escort time in availability</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rationale: Staff Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The default commission rate streamlines onboarding while allowing individual adjustments for experienced staff. 
                The algorithm explanation promotes transparency and helps managers understand why specific assignments are made. 
                This builds trust in the system and ensures fair work distribution among therapists.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>External Integrations</CardTitle>
              <CardDescription>Connect with third-party services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">POS Integration</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect to point-of-sale system for payment processing
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.enablePOSIntegration}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enablePOSIntegration: checked })
                  }
                />
              </div>

              {settings.enablePOSIntegration && (
                <div className="pl-4 space-y-4 border-l-2 border-primary">
                  <div className="space-y-2">
                    <Label htmlFor="posEndpoint">POS API Endpoint</Label>
                    <Input
                      id="posEndpoint"
                      type="url"
                      placeholder="https://api.pos-system.com/v1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="posKey">API Key</Label>
                    <Input
                      id="posKey"
                      type="password"
                      placeholder="Enter API key"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    Test Connection
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Bell className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Send appointment reminders via text message
                    </p>
                    <Badge variant="outline" className="mt-1">Coming Soon</Badge>
                  </div>
                </div>
                <Switch disabled />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">Webhooks</h4>
                    <p className="text-sm text-muted-foreground">
                      Trigger actions on external systems
                    </p>
                    <Badge variant="outline" className="mt-1">Coming Soon</Badge>
                  </div>
                </div>
                <Switch disabled />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rationale: Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The POS integration setting enables seamless payment processing and revenue tracking. When enabled, 
                it reveals configuration fields for API credentials. Future integrations (SMS, webhooks) are shown as 
                "Coming Soon" to communicate the product roadmap while maintaining clean UI. This extension point 
                supports the requirement for POS connectivity.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Service Add/Edit Dialog */}
      <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
            <DialogDescription>
              {editingService 
                ? 'Update service details and pricing'
                : 'Create a new service offering'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="serviceName">Service Name *</Label>
              <Input
                id="serviceName"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g., Swedish Massage"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type *</Label>
              <Select value={serviceType} onValueChange={(v) => setServiceType(v as ServiceType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="massage">Massage</SelectItem>
                  <SelectItem value="facial">Facial</SelectItem>
                  <SelectItem value="body-treatment">Body Treatment</SelectItem>
                  <SelectItem value="therapy">Therapy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceDuration">Duration (min) *</Label>
                <Input
                  id="serviceDuration"
                  type="number"
                  min="1"
                  value={serviceDuration}
                  onChange={(e) => setServiceDuration(e.target.value)}
                  placeholder="60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="servicePrice">Price ($) *</Label>
                <Input
                  id="servicePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                  placeholder="80"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceCommission">Commission (%) *</Label>
                <Input
                  id="serviceCommission"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={serviceCommission}
                  onChange={(e) => setServiceCommission(e.target.value)}
                  placeholder="40"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowServiceDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveService}>
              <Save className="w-4 h-4 mr-2" />
              {editingService ? 'Update' : 'Add'} Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deletingService?.name}</strong>? 
              This action cannot be undone. Staff members assigned to this service will need to be updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingService(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteService} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
