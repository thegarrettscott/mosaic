<p align="center">
  <img src="icon.png" alt="description" width="75">
</p>

# Mosaic

An AI-powered inbox customization platform built with Next.js, React, and TypeScript.

For guidance on building app builders with AI, see the [Mosaic guide on Building an App Builder](https://docs.mosaic.dev/guides/app-builder).

## Features

- AI-powered app building
- Real-time chat interface
- Template-based app creation
- Git integration
- Development server management
- User authentication

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Redis instance
- Mosaic API key
- Stack Auth credentials
- Morph API key

## Installation

1. Clone the repository
```bash
git clone https://github.com/mosaic-dev/mosaic
```

2. Install dependencies
```bash
npm install
```

3. Get a Mosaic API key

Head to [our API keys page](https://admin.mosaic.dev/dashboard/api-tokens) to get yours. We're totally free to use right now!

4. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# AI Services
ANTHROPIC_API_KEY=your_anthropic_api_key

# Mosaic API
MORPH_API_KEY=your_morph_api_key

# Redis
REDIS_URL=redis://localhost:6379

# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=your_stack_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_stack_publishable_client_key
STACK_SECRET_SERVER_KEY=your_stack_secret_server_key
PREVIEW_DOMAIN=your_preview_domain
```

5. Set up the database

```bash
npm run db:push
```

6. Start the development server

```bash
npm run dev
```

## Deployment

1. Build the application

```bash
npm run build
```

2. Deploy to your preferred platform

Go to the [Mosaic dashboard](https://admin.mosaic.dev/dashboard/domains) and verify a new domain. Then follow the [DNS Instructions](https://docs.mosaic.dev/web/deploy-to-custom-domain) to point your domain to Mosaic.
