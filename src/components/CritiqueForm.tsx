'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import ObjectiveCriteria from './ObjectiveCriteria';
import SubjectiveCriteria from './SubjectiveCriteria';
import OverallImpression from './OverallImpression';

interface CritiqueFormProps {
  trackId: string;
}

export interface CritiqueData {
  mixingQuality: number | null;
  tonalBalance: number | null;
  masteringLoudness: number | null;
  soundDesign: number | null;
  arrangement: number | null;
  technicalSummary: string;
  emotionalResponse: string;
  imagery: string;
  standoutElements: string;
  genreFit: string;
  overallImpression: string;
}

const CritiqueForm: React.FC<CritiqueFormProps> = ({ trackId }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CritiqueData>({
    mixingQuality: null,
    tonalBalance: null,
    masteringLoudness: null,
    soundDesign: null,
    arrangement: null,
    technicalSummary: '',
    emotionalResponse: '',
    imagery: '',
    standoutElements: '',
    genreFit: '',
    overallImpression: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const totalSteps = 3;

  useEffect(() => {
    const savedData = localStorage.getItem(`critique-draft-${trackId}`);
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, [trackId]);

  const handleChange = (name: keyof CritiqueData, value: string | number | null) => {
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      localStorage.setItem(`critique-draft-${trackId}`, JSON.stringify(newData));
      return newData;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/critiques', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, trackId }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit critique');
      }

      localStorage.removeItem(`critique-draft-${trackId}`);
      router.push(`/tracks/${trackId}`);
    } catch (error) {
      console.error('Error submitting critique:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return <ObjectiveCriteria formData={formData} onChange={handleChange} />;
      case 2:
        return <SubjectiveCriteria formData={formData} onChange={handleChange} />;
      case 3:
        return <OverallImpression formData={formData} onChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Progress value={(step / totalSteps) * 100} className="mb-4" />
      <h2 className="text-2xl font-bold mb-4">Step {step} of {totalSteps}</h2>
      {renderStep()}
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <Button onClick={() => setStep(step - 1)} disabled={isSubmitting}>Previous</Button>
        )}
        {step < totalSteps ? (
          <Button onClick={() => setStep(step + 1)} disabled={isSubmitting}>Next</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Critique'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CritiqueForm;