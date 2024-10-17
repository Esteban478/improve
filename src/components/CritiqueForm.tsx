'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import ObjectiveCriteria from './ObjectiveCriteria'
import SubjectiveCriteria from './SubjectiveCriteria'
import OverallImpression from './OverallImpression'
import { submitCritique, updateCritique } from '@/actions/critique-actions'
import { ExtendedCritique } from '@/types/index'
import { STORAGE_KEY } from '@/lib/constants'

interface CritiqueFormProps {
  trackId: string
  existingCritique?: ExtendedCritique
}

interface FormDataState {
  [key: string]: string | number | null;
}



export default function CritiqueForm({ trackId, existingCritique }: CritiqueFormProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormDataState>(() => {
    if (existingCritique) {
      // Pre-fill form with existing critique data
      return {
        mixingQuality: existingCritique.mixingQuality,
        tonalBalance: existingCritique.tonalBalance,
        masteringLoudness: existingCritique.masteringLoudness,
        soundDesign: existingCritique.soundDesign,
        arrangement: existingCritique.arrangement,
        technicalSummary: existingCritique.technicalSummary || '',
        emotionalResponse: existingCritique.emotionalResponse,
        imagery: existingCritique.imagery,
        standoutElements: existingCritique.standoutElements,
        genreFit: existingCritique.genreFit,
        overallImpression: existingCritique.overallImpression,
      }
    }
    // Initialize from localStorage if available, otherwise empty object
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : {};
    }
    return {};
  })
  const router = useRouter()
  const { data: session } = useSession()

  const totalSteps = 3

  useEffect(() => {
    // Save form data to localStorage whenever it changes
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleChange = useCallback((name: string, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step !== totalSteps) {
      handleNextStep()
      return
    }

    setIsSubmitting(true)
    try {
      if (!session?.user?.email) {
        throw new Error('User not authenticated')
      }

      const submitData = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          submitData.append(key, value.toString())
        }
      })
      submitData.append('trackId', trackId)
      submitData.append('userEmail', session.user.email)

      // console.log('Submitting data:', Object.fromEntries(submitData))

      if (existingCritique) {
        submitData.append('critiqueId', existingCritique.id)
        await updateCritique(submitData)
      } else {
        await submitCritique(submitData)
      }

      // Clear localStorage after successful submission
      localStorage.removeItem(STORAGE_KEY);

      // Use router.refresh() to trigger a re-fetch of the data
      router.refresh();

      // Navigate to the dashboard
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Error submitting critique:', error)
      if (error instanceof Error) {
        alert(`Failed to submit critique. Error: ${error.message}`)
      } else {
        alert('Failed to submit critique. An unknown error occurred.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch(step) {
      case 1:
        return <ObjectiveCriteria formData={formData} onChange={handleChange} />
      case 2:
        return <SubjectiveCriteria formData={formData} onChange={handleChange} />
      case 3:
        return <OverallImpression formData={formData} onChange={handleChange} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Progress value={(step / totalSteps) * 100} className="mb-4" />
      <h2 className="text-2xl font-bold mb-4">Step {step} of {totalSteps}</h2>
      <form onSubmit={handleSubmit}>
        {renderStep()}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button type="button" onClick={handlePrevStep} disabled={isSubmitting}>Previous</Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {step === totalSteps
              ? (isSubmitting ? 'Submitting...' : (existingCritique ? 'Update Critique' : 'Submit Critique'))
              : 'Next'
            }
          </Button>
        </div>
      </form>
    </div>
  )
}