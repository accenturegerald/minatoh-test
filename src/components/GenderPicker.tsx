import { Gender } from '../types';
import { User, Users } from 'lucide-react';
import { Button } from './ui/button';

interface GenderPickerProps {
  selectedGender?: Gender;
  onSelect: (gender: Gender) => void;
  label?: string;
  variant?: 'default' | 'compact';
}

export function GenderPicker({ 
  selectedGender, 
  onSelect, 
  label = 'Preferred Therapist Gender',
  variant = 'default'
}: GenderPickerProps) {
  const genders: { value: Gender; label: string; icon: typeof User }[] = [
    { value: 'female', label: 'Female', icon: User },
    { value: 'male', label: 'Male', icon: User },
    { value: 'any', label: 'Any', icon: Users },
  ];

  if (variant === 'compact') {
    return (
      <div className="space-y-2">
        {label && <label className="text-sm text-muted-foreground">{label}</label>}
        <div className="flex gap-2">
          {genders.map(({ value, label: genderLabel }) => (
            <Button
              key={value}
              variant={selectedGender === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSelect(value)}
              className="flex-1 transition-minatoh"
            >
              {genderLabel}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {label && <label className="block">{label}</label>}
      <div className="grid grid-cols-3 gap-3">
        {genders.map(({ value, label: genderLabel, icon: Icon }) => (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-minatoh hover:shadow-md ${
              selectedGender === value
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="font-medium">{genderLabel}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
