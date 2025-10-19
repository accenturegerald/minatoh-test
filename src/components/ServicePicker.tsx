import { useState } from 'react';
import { Service, ServiceType } from '../types';
import { services } from '../lib/mockData';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Clock, DollarSign } from 'lucide-react';

interface ServicePickerProps {
  selectedService?: Service;
  onSelect: (service: Service) => void;
  variant?: 'compact' | 'detailed' | 'grid';
}

export function ServicePicker({ selectedService, onSelect, variant = 'detailed' }: ServicePickerProps) {
  const [filterType, setFilterType] = useState<ServiceType | 'all'>('all');

  const filteredServices = filterType === 'all' 
    ? services 
    : services.filter(s => s.type === filterType);

  const serviceTypes: { value: ServiceType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Services' },
    { value: 'massage', label: 'Massage' },
    { value: 'facial', label: 'Facial' },
    { value: 'body-treatment', label: 'Body Treatment' },
    { value: 'therapy', label: 'Therapy' },
  ];

  if (variant === 'compact') {
    return (
      <div className="space-y-2">
        <select
          className="w-full px-3 py-2 bg-input-background border border-border rounded-lg transition-minatoh focus:outline-none focus:ring-2 focus:ring-primary"
          value={selectedService?.id || ''}
          onChange={(e) => {
            const service = services.find(s => s.id === e.target.value);
            if (service) onSelect(service);
          }}
        >
          <option value="">Select a service</option>
          {services.map(service => (
            <option key={service.id} value={service.id}>
              {service.name} - ${service.price} ({service.duration}min)
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {serviceTypes.map(type => (
            <Button
              key={type.value}
              variant={filterType === type.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType(type.value)}
              className="transition-minatoh"
            >
              {type.label}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredServices.map(service => (
            <button
              key={service.id}
              onClick={() => onSelect(service)}
              className={`p-4 rounded-lg border-2 text-left transition-minatoh hover:shadow-md ${
                selectedService?.id === service.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{service.name}</h4>
                <Badge variant="secondary" className="ml-2">
                  {service.type}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {service.duration}m
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {service.price}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {serviceTypes.map(type => (
          <Button
            key={type.value}
            variant={filterType === type.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType(type.value)}
            className="transition-minatoh"
          >
            {type.label}
          </Button>
        ))}
      </div>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {filteredServices.map(service => (
            <button
              key={service.id}
              onClick={() => onSelect(service)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-minatoh hover:shadow-md ${
                selectedService?.id === service.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{service.name}</h4>
                <Badge variant="secondary">{service.type}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {service.duration} min
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  ${service.price}
                </span>
                <span className="ml-auto">Commission: {service.commission}%</span>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
