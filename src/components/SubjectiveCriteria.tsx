import CharacterCounterInput from './CharacterCounterInput';

interface SubjectiveCriteriaProps {
  formData: { [key: string]: string | number | null };
  onChange: (name: string, value: string) => void;
}

const SubjectiveCriteria: React.FC<SubjectiveCriteriaProps> = ({ formData, onChange }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Subjective Criteria</h3>
      <CharacterCounterInput
        maxLength={500}
        label="Emotional Response"
        placeholder="How does listening to this track make you feel?"
        value={formData['emotionalResponse'] as string || ''}
        onChange={(value) => onChange('emotionalResponse', value)}
      />
      <CharacterCounterInput
        maxLength={500}
        label="Imagery"
        placeholder="What images or scenes come to mind when listening?"
        value={formData['imagery'] as string || ''}
        onChange={(value) => onChange('imagery', value)}
      />
      <CharacterCounterInput
        maxLength={500}
        label="Standout Elements"
        placeholder="What elements of the track stand out to you the most?"
        value={formData['standoutElements'] as string || ''}
        onChange={(value) => onChange('standoutElements', value)}
      />
      <CharacterCounterInput
        maxLength={500}
        label="Genre Fit"
        placeholder="How well does this track fit within its intended genre?"
        value={formData['genreFit'] as string || ''}
        onChange={(value) => onChange('genreFit', value)}
      />
    </div>
  );
};

export default SubjectiveCriteria;