# Forking Guide

This guide will help you fork and customize this codebase for your own AI app builder.

For additional context on building app builders with AI, see the [Mosaic guide on Building an App Builder](https://docs.mosaic.dev/guides/app-builder).

## Overview

This project is an AI app builder that allows users to create applications through natural language conversations. It's built with:

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, PostgreSQL (via Drizzle ORM), Redis
- **AI**: Anthropic Claude, Mosaic MCP tools
- **Auth**: Stack Auth
- **Deployment**: Mosaic platform

## Key Components

### 1. Chat Interface (`src/components/chat.tsx`)
The main chat component that handles user interactions and displays AI responses.

### 2. AI Service (`src/lib/internal/ai-service.ts`)
Core AI logic that processes user messages and manages tool invocations.

### 3. Stream Manager (`src/lib/internal/stream-manager.ts`)
Handles streaming responses and manages chat state.

### 4. App Management (`src/actions/`)
Actions for creating, managing, and deploying applications.

## Customization Points

### Branding
- Update `src/app/page.tsx` to change the main landing page
- Modify `src/components/topbar.tsx` for header customization
- Update logos in `public/logos/` directory

### Templates
- Modify `src/lib/templates.ts` to add/remove app templates
- Update template metadata and repository URLs

### AI Behavior
- Customize `src/lib/system.ts` to change the AI's system prompt
- Modify `src/lib/templates.ts` for different AI instructions

### Styling
- Update `tailwind.config.ts` for theme customization
- Modify `src/app/globals.css` for global styles

## Environment Variables

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `ANTHROPIC_API_KEY` - Anthropic API key for Claude
- `MORPH_API_KEY` - Mosaic platform key
- `REDIS_URL` - Redis connection string
- `NEXT_PUBLIC_STACK_PROJECT_ID` - Stack Auth project ID
- `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` - Stack Auth publishable key
- `STACK_SECRET_SERVER_KEY` - Stack Auth secret key
- `PREVIEW_DOMAIN` - Domain for app previews

## Database Schema

The main tables are defined in `src/db/schema.ts`:

- `users` - User accounts and authentication
- `apps` - User applications and metadata
- `chats` - Chat conversations and history

## Deployment

1. Set up your environment variables
2. Run database migrations: `npm run db:push`
3. Build the application: `npm run build`
4. Deploy to your preferred platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
