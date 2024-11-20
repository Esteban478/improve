import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import CharacterCounterInput from './CharacterCounterInput';

interface ObjectiveCriteriaProps {
  formData: { [key: string]: string | number | null };
  onChange: (name: string, value: string | number | null) => void;
}

const ObjectiveCriteria: React.FC<ObjectiveCriteriaProps> = ({ formData, onChange }) => {
  const renderSlider = (name: string, label: string, tooltip: string) => (
    <div className="mb-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Label htmlFor={name}>{label}</Label>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex items-center">
        <span className="mr-2">1</span>
        <Slider
          id={name}
          min={1}
          max={10}
          step={1}
          value={[formData[name] as number || 1]}
          onValueChange={(value) => onChange(name, value[0])}
          className="flex-grow"
        />
        <span className="ml-2">10</span>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
      <button type="button" onClick={() => onChange(name, null)} className="text-sm text-accent-foreground mt-2">
        Not sure
      </button>
    </div>
  );

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Objective Criteria</h3>
      {renderSlider('mixingQuality', 'Mixing Quality', 'How well are the different elements balanced in the mix?')}
      {renderSlider('tonalBalance', 'Tonal Balance', 'How well-balanced are the frequencies across the spectrum?')}
      {renderSlider('masteringLoudness', 'Mastering Loudness', 'How appropriate is the overall volume and dynamic range?')}
      {renderSlider('soundDesign', 'Sound Design', 'How creative and fitting are the sound choices?')}
      {renderSlider('arrangement', 'Arrangement', 'How well-structured is the track?')}
      <CharacterCounterInput
        maxLength={500}
        label="Technical Summary"
        placeholder="Summarize your thoughts on the technical aspects of the track..."
        value={formData['technicalSummary'] as string || ''}
        onChange={(value) => onChange('technicalSummary', value)}
      />
    </div>
  );
};

export default ObjectiveCriteria;