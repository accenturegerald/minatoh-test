import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ServicePicker } from '../components/ServicePicker';
import { GenderPicker } from '../components/GenderPicker';
import { TherapistCard } from '../components/TherapistCard';
import { Service, Gender, Therapist } from '../types';
import { therapists, services } from '../lib/mockData';
import { Calendar as CalendarIcon, Clock, CheckCircle, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function Booking() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedService, setSelectedService] = useState<Service | undefined>();
  const [selectedGender, setSelectedGender] = useState<Gender>('any');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | undefined>();
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  // Mock bookings for demo
  const mockBookings = [
    { id: '1', time: '10:00', clientName: 'Sarah Johnson', service: 'Swedish Massage', therapist: 'Sarah Chen' },
    { id: '2', time: '11:30', clientName: 'Michael Brown', service: 'Deep Tissue', therapist: 'Michael Ross' },
    { id: '3', time: '14:00', clientName: 'Emma Wilson', service: 'Facial Treatment', therapist: 'Lily Wang' },
    { id: '4', time: '16:00', clientName: 'David Lee', service: 'Thai Massage', therapist: 'Emma Thompson' },
  ];

  const handleCreateBooking = () => {
    if (!selectedDate || !selectedTime || !selectedService || !clientName || !clientPhone) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Booking created successfully!');
    // Reset form
    setSelectedTime('');
    setSelectedService(undefined);
    setClientName('');
    setClientPhone('');
    setSelectedTherapist(undefined);
  };

  const getAvailableSlots = () => {
    const bookedTimes = mockBookings.map(b => b.time);
    return timeSlots.filter(slot => !bookedTimes.includes(slot));
  };

  const availableSlots = getAvailableSlots();
  const availableTherapists = therapists.filter(t => t.status === 'available');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Booking Management</h1>
        <p className="text-muted-foreground">Schedule and manage appointments</p>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as any)}>
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>New Booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label>Select Date *</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-lg border mt-2"
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Client Name *</Label>
                      <Input
                        placeholder="Enter client name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Phone Number *</Label>
                      <Input
                        type="tel"
                        placeholder="555-0000"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Service *</Label>
                      <div className="mt-1">
                        <ServicePicker
                          selectedService={selectedService}
                          onSelect={setSelectedService}
                          variant="compact"
                        />
                      </div>
                    </div>

                    <GenderPicker
                      selectedGender={selectedGender}
                      onSelect={setSelectedGender}
                      variant="compact"
                      label="Therapist Preference"
                    />
                  </div>
                </div>

                {selectedDate && (
                  <div>
                    <Label className="mb-3 block">Available Time Slots</Label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={selectedTime === slot ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedTime(slot)}
                          className="transition-minatoh"
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                    {availableSlots.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No available slots for this date
                      </p>
                    )}
                  </div>
                )}

                {selectedService && selectedGender && (
                  <div>
                    <Label className="mb-3 block">
                      Assign Therapist (Optional)
                    </Label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {availableTherapists
                        .filter(t => selectedGender === 'any' || t.gender === selectedGender)
                        .map((therapist) => (
                          <button
                            key={therapist.id}
                            onClick={() => setSelectedTherapist(
                              selectedTherapist?.id === therapist.id ? undefined : therapist
                            )}
                            className={selectedTherapist?.id === therapist.id ? 'ring-2 ring-primary rounded-lg' : ''}
                          >
                            <TherapistCard therapist={therapist} variant="compact" />
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleCreateBooking}
                  className="w-full"
                  size="lg"
                  disabled={!selectedDate || !selectedTime || !selectedService || !clientName || !clientPhone}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Create Booking
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Today's Schedule</CardTitle>
                    <Badge variant="secondary">{mockBookings.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockBookings.map((booking, index) => (
                      <div
                        key={booking.id}
                        className="p-3 bg-muted rounded-lg animate-stagger"
                        style={{ '--stagger-delay': index } as React.CSSProperties}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="font-medium">{booking.time}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">Confirmed</Badge>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">{booking.clientName}</div>
                          <div className="text-muted-foreground">{booking.service}</div>
                          <div className="text-muted-foreground text-xs mt-1">
                            with {booking.therapist}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Bookings</span>
                      <span className="font-medium">{mockBookings.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Available Slots</span>
                      <span className="font-medium">{availableSlots.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Occupancy Rate</span>
                      <span className="font-medium">
                        {((mockBookings.length / timeSlots.length) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rationale: Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This variant prioritizes visual scheduling with a calendar picker for date selection and grid-based time slot selection. 
                It's ideal for clients who book in advance and need to see availability at a glance. The sidebar shows today's schedule 
                for quick reference. Optional therapist assignment allows flexibility while maintaining the auto-assignment fallback.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Bookings</CardTitle>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Booking
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockBookings.map((booking, index) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-minatoh animate-stagger"
                      style={{ '--stagger-delay': index } as React.CSSProperties}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <CalendarIcon className="w-8 h-8 text-primary mb-1" />
                          <div className="text-xs text-muted-foreground">Today</div>
                        </div>
                        <div>
                          <div className="font-medium">{booking.clientName}</div>
                          <div className="text-sm text-muted-foreground">
                            {booking.service} • {booking.time}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Therapist: {booking.therapist}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Cancel</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rationale: List View</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This variant displays all bookings in a chronological list format, making it easier to scan through multiple appointments 
                  and perform bulk operations. It's more efficient for managers who need to review, edit, or cancel multiple bookings 
                  quickly. The compact layout shows all essential information without navigation.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
