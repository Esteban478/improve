"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CritiqueFormProps {
  trackId: string;
}

const CritiqueForm: React.FC<CritiqueFormProps> = ({ trackId }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('Critique content cannot be empty');
      return;
    }

    try {
      const response = await fetch('/api/critiques', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackId, content }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit critique');
      }

      // Redirect to the track page after successful submission
      router.push(`/tracks/${trackId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h3 className="text-xl font-semibold mb-2">Submit a Critique</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        rows={4}
        placeholder="Write your critique here..."
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Submit Critique
      </button>
    </form>
  );
};

export default CritiqueForm;