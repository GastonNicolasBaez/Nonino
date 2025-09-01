# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `pnpm run dev` (or `npm run dev`)
- **Build for production**: `pnpm run build` (or `npm run build`)
- **Lint code**: `pnpm run lint` (or `npm run lint`)
- **Preview production build**: `pnpm run preview` (or `npm run preview`)

## Architecture Overview

This is a React-based empanada restaurant management system with two main interfaces:

### Public Frontend
- Customer-facing website built with React 19.1.1 and Vite
- Features: product catalog, cart, checkout, order tracking, user authentication
- Main layout component: `src/components/layouts/Layout.jsx`
- Public pages located in `src/pages/public/`

### Admin Panel
- Complete restaurant management dashboard
- Features: order management, inventory, customer data, reports, settings
- Admin layout component: `src/components/layouts/AdminLayout.jsx`
- Admin pages located in `src/pages/admin/`
- Admin credentials: Configured in backend

### Key Architecture Patterns

**Context-Based State Management:**
- `AuthContext.jsx` - User authentication and session management
- `CartContext.jsx` - Shopping cart state with localStorage persistence
- `ThemeContext.jsx` - Dark/light theme switching

**Service Layer:**
- `src/services/api.js` - API service layer ready for backend integration
- Backend integration prepared for Kotlin/Spring Boot with REST endpoints
- All services properly structured for production use

**Route Protection:**
- `ProtectedRoute.jsx` - Protects user-only routes
- `AdminRoute.jsx` - Protects admin-only routes
- Two separate route trees: public (`/`) and admin (`/admin`)

**UI System:**
- Tailwind CSS with custom empanada-themed colors (`empanada-golden`, `empanada-crust`)
- Radix UI components for accessibility
- Framer Motion for animations
- Custom UI components in `src/components/ui/`

## Data Flow

1. **Backend Integration**: Ready for backend services with proper API structure
2. **Authentication**: JWT-based authentication system ready for backend
3. **Cart**: Persistent cart state with localStorage, promo codes, delivery zones
4. **Orders**: Order creation and tracking system ready for backend integration

## Theme System

- Uses CSS custom properties with Tailwind
- Supports dark/light themes via ThemeContext
- Custom color palette focused on golden empanada colors
- Glassmorphism design elements throughout

## Production Ready Features

- Complete API service layer structure
- JWT authentication system
- Order management with MercadoPago integration ready
- Admin dashboard with real-time capabilities
- Responsive design optimized for all devices
- SEO-friendly structure
- Performance optimized with lazy loading

## Development Notes

- Uses ES modules and Vite for fast development
- Strict mode enabled in React
- All API calls prepared for backend integration
- localStorage used for persistence of auth, cart, and theme state
- Code cleaned and optimized for production deployment