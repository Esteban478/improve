import { COLOR_LABELS, MIN_PASSWORD_LENGTH, STRENGTH_LABELS } from "@/lib/constants";

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= MIN_PASSWORD_LENGTH) strength += 1;
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[$@#&!]+/)) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength(password);

  const getColor = () => {
    switch (strength) {
      case 0:
      case 1:
        return COLOR_LABELS[1];
      case 2:
        return COLOR_LABELS[2];
      case 3:
        return COLOR_LABELS[3];
      case 4:
        return COLOR_LABELS[4];
      case 5:
        return COLOR_LABELS[5];
      default:
        return COLOR_LABELS[0];
    }
  };

  const getLabel = () => {
    switch (strength) {
      case 0:
      case 1:
        return STRENGTH_LABELS[0];
      case 2:
        return STRENGTH_LABELS[1];
      case 3:
        return STRENGTH_LABELS[2];
      case 4:
        return STRENGTH_LABELS[3];
      case 5:
        return STRENGTH_LABELS[4];
      default:
        return '';
    }
  };

  if (password.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <div className="h-1 transition-all duration-500 ease-in-out" style={{ width: `${strength * 20}%` }}>
        <div className={`h-full ${getColor()}`}></div>
      </div>
      <p className={`mt-1 text-xs ${getColor().replace('bg-', 'text-')}`}>{getLabel()}</p>
    </div>
  );
};

export default PasswordStrengthMeter;