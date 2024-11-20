# Improve - Music Feedback Platform

## Overview

Improve is a dynamic web platform designed to help music producers get meaningful feedback on their tracks. Built with Next.js 14 and modern web technologies, it facilitates constructive critique exchange between producers, fostering a collaborative environment for musical growth and improvement.

## Core Features

- **Track Submission**: Share SoundCloud tracks for feedback
- **Structured Critique System**:
  - Objective criteria (mixing, mastering, sound design)
  - Subjective feedback (emotional response, imagery)
  - Technical evaluation
- **Reward Mechanism**: Earn coins for giving quality feedback
- **Rating System**: Track owners can rate received critiques
- **User Profiles**: Track statistics and activity history
- **Theme System**: Multiple color themes including Dark, Forest, Geek, and Girly

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: Server Components + React Hooks
- **Deployment**: Vercel

## Architecture & Patterns

### Server Components

- Default server component approach for optimal performance
- Strategic use of client components for interactive features
- Proper component tree organization to minimize client-side JavaScript

### Data Flow

- Server Actions for data mutations
- Optimistic updates for better UX
- Proper cache invalidation using `revalidatePath`

### Type Safety

- Comprehensive TypeScript implementation
- Zod for runtime validation
- Custom type definitions for complex data structures

## Project Structure

```
src/
├── actions/         # Server actions for data mutations
├── app/            # Next.js app router pages
├── components/     # Reusable React components
│   ├── ui/        # shadcn/ui components
│   └── ...        # Custom components
├── lib/           # Utility functions and constants
├── types/         # TypeScript type definitions
└── ...
```

## Database Schema

Key entities:

- Users
- Tracks
- Critiques
- CoinTransactions
- ActivityLogs

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

### Environment Variables

```env
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/improve.git

# Install dependencies
npm install

# Setup database
npx prisma migrate dev
npx prisma db seed

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## Development Practices

### Component Architecture

- Separation of server and client components
- Reusable UI components
- Component composition for complex features

### State Management

- Server-side state with Next.js cache
- Client-side state with React hooks
- Form state management with controlled components

### Error Handling

- Custom error types
- Consistent error boundaries
- User-friendly error messages

## Testing

The project implements comprehensive testing using Jest and React Testing Library. Key testing areas include:

### Component Testing

- Multi-step form validation
- User interaction flows
- State management
- Error handling
- Form submission processes

## Currently implemented

- Form step navigation verification
- Required field validation
- Success/error state handling
- Form submission flow

## Future test implementations planned

- Network timeout handling
- Form data persistence
- Loading state management
- Component accessibility

## Deployment

The application is configured for deployment on Vercel with automatic CI/CD pipeline.

## Future Considerations

- Enhanced analytics for critique quality and user engagement
- Real-time notifications for new critiques and ratings
- Advanced search and filtering capabilities
