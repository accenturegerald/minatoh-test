import { Therapist, Client, Service, QueueEntry, Gender } from '../types';

export const services: Service[] = [
  { id: 's1', name: 'Swedish Massage', type: 'massage', duration: 60, price: 80, commission: 40 },
  { id: 's2', name: 'Deep Tissue Massage', type: 'massage', duration: 90, price: 120, commission: 45 },
  { id: 's3', name: 'Hot Stone Massage', type: 'massage', duration: 75, price: 100, commission: 42 },
  { id: 's4', name: 'Thai Massage', type: 'massage', duration: 60, price: 85, commission: 40 },
  { id: 's5', name: 'Aromatherapy Massage', type: 'massage', duration: 60, price: 90, commission: 43 },
  { id: 's6', name: 'Facial Treatment', type: 'facial', duration: 45, price: 75, commission: 38 },
  { id: 's7', name: 'Body Scrub', type: 'body-treatment', duration: 30, price: 50, commission: 35 },
  { id: 's8', name: 'Couples Massage', type: 'massage', duration: 90, price: 180, commission: 50 },
];

export const therapists: Therapist[] = [
  {
    id: 't1',
    name: 'Sarah Chen',
    gender: 'female',
    status: 'available',
    commissionRate: 45,
    totalServes: 342,
    todayServes: 6,
    todayCommission: 240,
    rating: 4.9,
    isBestPerformer: true,
    specialties: ['massage', 'therapy'],
    serviceIds: ['s1', 's2', 's3', 's4', 's5'], // All massage types
    lastServedTime: new Date(Date.now() - 45 * 60000),
  },
  {
    id: 't2',
    name: 'Michael Ross',
    gender: 'male',
    status: 'busy',
    commissionRate: 42,
    totalServes: 298,
    todayServes: 5,
    todayCommission: 195,
    rating: 4.7,
    currentClient: 'c1',
    serviceEndTime: new Date(Date.now() + 25 * 60000),
    specialties: ['massage'],
    serviceIds: ['s1', 's2', 's4', 's8'], // Basic massages + couples
    lastServedTime: new Date(Date.now() - 90 * 60000),
  },
  {
    id: 't3',
    name: 'Lily Wang',
    gender: 'female',
    status: 'available',
    commissionRate: 43,
    totalServes: 256,
    todayServes: 4,
    todayCommission: 168,
    rating: 4.8,
    specialties: ['facial', 'body-treatment'],
    serviceIds: ['s6', 's7'], // Facial and body scrub only
    lastServedTime: new Date(Date.now() - 120 * 60000),
  },
  {
    id: 't4',
    name: 'James Park',
    gender: 'male',
    status: 'break',
    commissionRate: 40,
    totalServes: 189,
    todayServes: 3,
    todayCommission: 135,
    rating: 4.6,
    serviceEndTime: new Date(Date.now() + 10 * 60000),
    specialties: ['massage'],
    serviceIds: ['s1', 's4', 's5'], // Swedish, Thai, Aromatherapy
    lastServedTime: new Date(Date.now() - 150 * 60000),
  },
  {
    id: 't5',
    name: 'Emma Thompson',
    gender: 'female',
    status: 'available',
    commissionRate: 44,
    totalServes: 412,
    todayServes: 7,
    todayCommission: 285,
    rating: 4.9,
    isBestPerformer: false,
    specialties: ['massage', 'facial', 'therapy'],
    serviceIds: ['s1', 's3', 's5', 's6', 's7'], // Versatile - massage, facial, body
    lastServedTime: new Date(Date.now() - 30 * 60000),
  },
  {
    id: 't6',
    name: 'David Kim',
    gender: 'male',
    status: 'offline',
    commissionRate: 41,
    totalServes: 145,
    todayServes: 0,
    todayCommission: 0,
    rating: 4.5,
    specialties: ['massage'],
    serviceIds: ['s1', 's2', 's8'], // Basic massage + deep tissue + couples
    lastServedTime: new Date(Date.now() - 1440 * 60000),
  },
];

export const clients: Client[] = [
  {
    id: 'c1',
    name: 'Jennifer Smith',
    phone: '555-0101',
    gender: 'female',
    preferredGender: 'female',
    service: services[0],
    status: 'in-service',
    type: 'walk-in',
    assignedTherapist: 't2',
    waitingSince: new Date(Date.now() - 95 * 60000),
    priority: 1,
  },
  {
    id: 'c2',
    name: 'Robert Johnson',
    phone: '555-0102',
    gender: 'male',
    preferredGender: 'any',
    service: services[1],
    status: 'waiting',
    type: 'booking',
    waitingSince: new Date(Date.now() - 15 * 60000),
    scheduledTime: new Date(Date.now() - 10 * 60000),
    priority: 2,
  },
  {
    id: 'c3',
    name: 'Maria Garcia',
    phone: '555-0103',
    gender: 'female',
    preferredGender: 'female',
    service: services[2],
    status: 'waiting',
    type: 'walk-in',
    waitingSince: new Date(Date.now() - 8 * 60000),
    priority: 3,
  },
  {
    id: 'c4',
    name: 'Walk-in Guest',
    gender: 'male',
    preferredGender: 'any',
    service: services[3],
    status: 'waiting',
    type: 'walk-in',
    waitingSince: new Date(Date.now() - 5 * 60000),
    priority: 4,
  },
  {
    id: 'c5',
    name: 'Lisa Anderson',
    phone: '555-0104',
    gender: 'female',
    preferredGender: 'female',
    service: services[5],
    status: 'waiting',
    type: 'booking',
    waitingSince: new Date(Date.now() - 20 * 60000),
    scheduledTime: new Date(Date.now() + 5 * 60000),
    isLate: true,
    priority: 5,
  },
];

export const getAvailableTherapists = (preferredGender?: Gender, serviceId?: string): Therapist[] => {
  return therapists.filter(t => {
    const isAvailable = t.status === 'available';
    const matchesGender = !preferredGender || preferredGender === 'any' || t.gender === preferredGender;
    const canPerformService = !serviceId || t.serviceIds.includes(serviceId);
    return isAvailable && matchesGender && canPerformService;
  });
};

export const getTherapistsForService = (serviceId: string, preferredGender?: Gender): Therapist[] => {
  return therapists.filter(t => {
    const canPerformService = t.serviceIds.includes(serviceId);
    const matchesGender = !preferredGender || preferredGender === 'any' || t.gender === preferredGender;
    const notOffline = t.status !== 'offline';
    return canPerformService && matchesGender && notOffline;
  });
};

export const getQueueEntries = (): QueueEntry[] => {
  return clients
    .filter(c => c.status === 'waiting')
    .map((c, index) => ({
      id: `q${c.id}`,
      client: c,
      position: index + 1,
      waitTime: Math.floor((Date.now() - c.waitingSince.getTime()) / 60000),
      isLate: c.isLate,
    }))
    .sort((a, b) => a.client.priority - b.client.priority);
};
