'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface LoadMoreProps {
  currentPage: number;
  currentTake: number;
  totalTracks: number;
}

export default function LoadMore({ currentPage, currentTake, totalTracks }: LoadMoreProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const loadMore = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', (currentPage + 1).toString());
    newSearchParams.set('take', (currentTake + 10).toString());
    router.push(`/tracks?${newSearchParams.toString()}`);
  };

  // Only show the button if we received a full page of results
  if (totalTracks < currentTake) return null;

  return (
    <Button onClick={loadMore} className="mt-6 mx-auto block">
      Load More
    </Button>
  );
}