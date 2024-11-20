import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CritiqueForm from '../../components/CritiqueForm'
import { submitCritique } from '../../actions/critique-actions'
import '@testing-library/jest-dom'

jest.mock('../../../src/components/ui/progress', () => ({
  Progress: ({ value }: { value: number }) => (
    <div data-testid="mock-progress" data-value={value}>Progress: {value}%</div>
  )
}))

jest.mock('../../../src/components/ui/button', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode }) => (
    <button data-testid="mock-button" {...props}>{children}</button>
  )
}))

jest.mock('../../../src/components/ui/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input data-testid="mock-input" {...props} />
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn()
  })
}))

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { email: 'test@example.com' } },
    status: 'authenticated'
  })
}))

jest.mock('@/actions/critique-actions', () => ({
  submitCritique: jest.fn()
}))

describe('CritiqueForm', () => {
  const mockTrackId = 'test-track-id'
  const mockTrackSlug = 'test-track-slug'

  beforeEach(() => {
    jest.clearAllMocks()
    // Replace window.alert with mock
    window.alert = jest.fn()
  })

  it('renders all form steps correctly', async () => {
    render(<CritiqueForm trackId={mockTrackId} trackSlug={mockTrackSlug} />)
    
    // Check first step
    expect(screen.getByRole('heading', { name: /objective criteria/i })).toBeInTheDocument()
    
    // Navigate to second step
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByRole('heading', { name: /subjective criteria/i })).toBeInTheDocument()
    
    // Navigate to final step
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByRole('heading', { name: /feedback title/i })).toBeInTheDocument()
  })

  it('validates required fields before submission', async () => {
    const user = userEvent.setup();
    (submitCritique as jest.Mock).mockRejectedValueOnce(new Error('Validation Error'));
    
    render(<CritiqueForm trackId={mockTrackId} trackSlug={mockTrackSlug} />);

    // Fill first step
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Fill second step
    await user.type(
      screen.getByPlaceholderText('How does listening to this track make you feel?'), 
      'Test emotional'
    );
    await user.type(
      screen.getByPlaceholderText('What images or scenes come to mind when listening?'),
      'Test imagery'
    );
    await user.type(
      screen.getByPlaceholderText('What elements of the track stand out to you the most?'),
      'Test elements'
    );
    await user.type(
      screen.getByPlaceholderText('How well does this track fit within its intended genre?'),
      'Test genre'
    );
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Try to submit without required fields
    await user.click(screen.getByRole('button', { name: /submit critique/i }));

    // Verify error handling
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Validation Error'));
    });
  });

  it('handles server errors appropriately', async () => {
    const errorMessage = 'Failed to submit critique'
    ;(submitCritique as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

    render(<CritiqueForm trackId={mockTrackId} trackSlug={mockTrackSlug} />)
    
    // Navigate to final step
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    
    // Fill required field
    await userEvent.type(screen.getByLabelText(/overall impression/i), 'Test critique')
    
    // Submit form
    await userEvent.click(screen.getByRole('button', { name: /submit critique/i }))
    
    // Alert should show error
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining(errorMessage))
  })

  
})