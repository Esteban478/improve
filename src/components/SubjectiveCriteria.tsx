import CharacterCounterInput from './CharacterCounterInput';
import { CritiqueData } from './CritiqueForm';

interface SubjectiveCriteriaProps {
  formData: CritiqueData;
  onChange: (name: keyof CritiqueData, value: string) => void;
}

const SubjectiveCriteria: React.FC<SubjectiveCriteriaProps> = ({ formData, onChange }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Subjective Criteria</h3>
      <CharacterCounterInput
        maxLength={500}
        label="Emotional Response"
        placeholder="How does listening to this track make you feel?"
        value={formData.emotionalResponse}
        onChange={(value: string) => onChange('emotionalResponse', value)}
      />
      <CharacterCounterInput
        maxLength={500}
        label="Imagery"
        placeholder="What images or scenes come to mind when listening?"
        value={formData.imagery}
        onChange={(value: string) => onChange('imagery', value)}
      />
      <CharacterCounterInput
        maxLength={500}
        label="Standout Elements"
        placeholder="What elements of the track stand out to you the most?"
        value={formData.standoutElements}
        onChange={(value: string) => onChange('standoutElements', value)}
      />
      <CharacterCounterInput
        maxLength={500}
        label="Genre Fit"
        placeholder="How well does this track fit within its intended genre?"
        value={formData.genreFit}
        onChange={(value: string) => onChange('genreFit', value)}
      />
    </div>
  );
};

export default SubjectiveCriteria;