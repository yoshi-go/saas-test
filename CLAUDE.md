# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Quality Assurance:**
- `npm run check` - Run Svelte type checking and sync
- `npm run check:watch` - Run type checking in watch mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format_check` - Check code formatting
- `npm run test` - Run tests in watch mode
- `npm run test_run` - Run tests once
- `./checks.sh` - Run all quality checks (format, lint, type check, tests)

**Always run `npm run check`, `npm run lint`, and `npm run test_run` after making code changes.**

## Architecture Overview

This is a **SvelteKit SaaS starter** with Supabase backend, Stripe billing, and comprehensive authentication.

### Tech Stack
- **SvelteKit** with TypeScript for frontend framework
- **Supabase** for authentication, database (PostgreSQL), and storage
- **Stripe** for subscription billing and payments
- **Tailwind CSS + DaisyUI** for styling
- **Resend** for email delivery with Handlebars templates
- **Vitest** for testing

### Route Structure
The app uses SvelteKit's group-based routing:
- **`(marketing)/`** - Public pages: landing, pricing, blog, auth flows
- **`(admin)/account/`** - Protected dashboard: billing, settings, user management

### Key Files
- `/src/hooks.server.ts` - Authentication middleware and session management
- `/src/config.ts` - Site configuration and environment variables
- `/src/DatabaseDefinitions.ts` - Generated Supabase database types
- `/src/routes/(admin)/account/subscription_helpers.server.ts` - Stripe billing logic
- `/src/routes/(marketing)/pricing/pricing_plans.ts` - Subscription plan configuration
- `/src/lib/mailer.ts` - Email system with template support

### Authentication System
- Uses Supabase Auth with Row Level Security (RLS) on all database tables
- Server-side session validation in `hooks.server.ts`
- MFA support with authenticator assurance levels
- OAuth providers configured in `/src/routes/(marketing)/login/login_config.ts`

### Billing Integration
- Stripe Checkout for subscriptions
- Lazy customer creation (creates Stripe customer on-demand)
- Subscription state management with grace periods
- Self-service billing portal

### Database Schema
Key tables:
- `profiles` - User profile data
- `stripe_customers` - Links users to Stripe customer IDs
- `contact_requests` - Contact form submissions

All tables use RLS policies for security.

### Email System
- Template-based emails using Handlebars (`.hbs` files in `/src/lib/emails/`)
- Respects user unsubscribe preferences
- Only sends to verified email addresses
- Graceful fallback when email service unavailable

### Build & Performance
- Pre-rendered marketing pages for SEO and performance
- Build-time search index generation using Fuse.js
- Tailwind CSS with unused style removal
- SSR for dynamic admin pages, static generation for marketing

### Environment Variables
Required for full functionality:
- `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`
- `PRIVATE_SUPABASE_SERVICE_ROLE`
- `PRIVATE_STRIPE_API_KEY`
- `RESEND_API_KEY` (for emails)

See `.env.example` for complete list.