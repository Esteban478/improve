import CharacterCounterInput from './CharacterCounterInput';

interface OverallImpressionProps {
  formData: { [key: string]: string | number | null };
  onChange: (name: string, value: string) => void;
}

const OverallImpression: React.FC<OverallImpressionProps> = ({ formData, onChange }) => {
  return (
    <>
      <h3 className="text-xl font-semibold mb-4">Overall Impression</h3>
      <CharacterCounterInput
        maxLength={1000}
        label="Overall Impression"
        placeholder="What's your overall impression of the track? Consider all aspects you've evaluated so far."
        value={formData['overallImpression'] as string || ''}
        onChange={(value) => onChange('overallImpression', value)}
      />
    </>
  );
};

export default OverallImpression;