import CharacterCounterInput from './CharacterCounterInput';
import { CritiqueData } from './CritiqueForm';

interface OverallImpressionProps {
  formData: CritiqueData;
  onChange: (name: keyof CritiqueData, value: string) => void;
}

const OverallImpression: React.FC<OverallImpressionProps> = ({ formData, onChange }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Overall Impression</h3>
      <CharacterCounterInput
        maxLength={1000}
        label="Overall Impression"
        placeholder="What's your overall impression of the track? Consider all aspects you've evaluated so far."
        value={formData.overallImpression}
        onChange={(value) => onChange('overallImpression', value)}
      />
    </div>
  );
};

export default OverallImpression;