import { useState, useEffect } from 'react';
import { TEXT_COLOR_LABELS, METER_COLOR_LABELS, STRENGTH_LABELS } from "@/lib/constants";
import { calculatePasswordStrength } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (password.length === 0) {
      setStrength(0);
      setLabel('');
      return;
    }

    const calculatedStrength = calculatePasswordStrength(password);
    setStrength(calculatedStrength);
    setLabel(STRENGTH_LABELS[calculatedStrength]);
  }, [password]);

  if (password.length === 0) {
    return null;
  }

  // Get the appropriate colors based on strength
  const meterColor = METER_COLOR_LABELS[strength] || METER_COLOR_LABELS[0];
  const textColor = TEXT_COLOR_LABELS[strength] || TEXT_COLOR_LABELS[0];

  return (
    <div className="mt-2">
      <div className="h-1 w-full bg-gray-200 rounded overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-500 ease-in-out", meterColor)}
          style={{ width: `${(strength + 1) * 25}%` }}
        />
      </div>
      <p className={cn("mt-1 text-xs", textColor)}>
        {label}
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;