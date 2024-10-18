'use client'

import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from './ui/button';
import { submitRating } from '@/actions/rating-actions';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface RatingPopoverProps {
  critiqueId: string;
  existingRating: number | null;
}

const RatingPopover: React.FC<RatingPopoverProps> = ({ critiqueId, existingRating }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoveredRating(0);
      setFeedback(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append('critiqueId', critiqueId);
      formData.append('rating', rating.toString());

      await submitRating(formData);
      setFeedback({ type: 'success', message: 'Rating submitted successfully!' });
      router.refresh();
      setTimeout(() => setIsOpen(false), 2000); // Close popover after 2 seconds
    } catch (error) {
      console.error('Error submitting rating:', error);
      setFeedback({ type: 'error', message: 'Failed to submit rating. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (count: number, filled: number) => {
    return [...Array(count)].map((_, i) => (
      <Star
        key={i}
        size={24}
        className={i < filled ? "text-yellow-400 fill-current" : "text-gray-300"}
      />
    ));
  };

  if (existingRating !== null) {
    return (
      <div className="flex items-center">
        {renderStars(5, existingRating)}
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">Rate Critique</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Rate this critique</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X size={16} />
          </Button>
        </div>
        <div className="text-sm items-center mb-4">
          <p>Was this feedback helpful to you?</p>
        </div>
        <div className="flex items-center justify-center space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                size={24}
                className={(hoveredRating || rating) >= value ? "text-yellow-400 fill-current" : "text-gray-300"}
              />
            </button>
          ))}
        </div>
        {feedback && (
          <div className={`text-sm mb-4 ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {feedback.message}
          </div>
        )}
        <Button 
          onClick={handleSubmit} 
          disabled={rating === 0 || isSubmitting} 
          className="w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Rating'}
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default RatingPopover;