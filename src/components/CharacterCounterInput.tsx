import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

interface CharacterCounterInputProps {
  maxLength: number;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const CharacterCounterInput: React.FC<CharacterCounterInputProps> = ({
  maxLength,
  label,
  placeholder,
  value,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const getColor = () => {
    const ratio = value.length / maxLength;
    if (ratio < 0.7) return 'text-gray-500';
    if (ratio < 0.9) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="mb-4">
      <Label htmlFor={label}>{label}</Label>
      <Textarea
        id={label}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="mt-1"
      />
      <div className={`text-right text-sm ${getColor()}`}>
        {value.length} / {maxLength}
      </div>
    </div>
  );
};

export default CharacterCounterInput;