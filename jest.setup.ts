import '@testing-library/jest-dom'

// Mock next/navigation
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
}

const mockSearchParams = {
  get: jest.fn(),
}

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => mockSearchParams,
}))

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { 
      user: { 
        email: 'test@example.com',
        name: 'Test User' 
      } 
    },
    status: 'authenticated'
  })
}))

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

// Make mocks available globally
export { mockRouter, mockSearchParams }