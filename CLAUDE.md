# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (or `pnpm run dev`)
- **Build for production**: `npm run build` (or `pnpm run build`)
- **Lint code**: `npm run lint` (or `pnpm run lint`)
- **Preview production build**: `npm run preview` (or `pnpm run preview`)

## Architecture Overview

This is a React-based empanada restaurant management system with two main interfaces:

### Public Frontend
- Customer-facing website built with React 19.1.1 and Vite
- Features: product catalog, cart, checkout, order tracking, user authentication
- Main layout component: `src/components/layouts/PublicLayout.jsx`
- Public pages located in `src/pages/public/`

### Admin Panel
- Complete restaurant management dashboard
- Features: order management, inventory, customer data, reports, settings
- Admin layout component: `src/components/layouts/AdminLayout.jsx`
- Admin pages located in `src/pages/admin/`
- Admin credentials: Configured in backend

### Key Architecture Patterns

**Context-Based State Management:**
- `SessionProvider.jsx` - Authentication and session management (replaces AuthContext)
- `AdminDataProvider.jsx` - Admin data state (products, stores, etc.)
- `PublicDataProvider.jsx` - Public-facing data state
- `CartProvider.jsx` - Shopping cart state with localStorage persistence
- `ThemeProvider.jsx` - Dark/light theme switching
- `OrdersContext.jsx` - Order management state

**Service Layer:**
- `src/config/api*QueryFunctions.js` - API service layer with React Query integration
- Backend integration prepared for Kotlin/Spring Boot with REST endpoints
- All services properly structured for production use

**Route Protection:**
- `AuthProvider.jsx` - Protects routes based on user roles
- `IntranetPortal.jsx` - Gateway component for admin routes
- Two separate route trees: public (`/`) and intranet (`/intranet`)

**UI System:**
- Tailwind CSS with custom empanada-themed colors (`empanada-golden`, `empanada-crust`)
- Radix UI components for accessibility
- Framer Motion for animations
- Custom UI components in `src/components/ui/`

## Critical Architecture Notes

**Provider Hierarchy:**
The app uses a complex provider hierarchy that must be maintained:
```jsx
<SessionProvider>
  // Public routes use PublicDataProvider
  <PublicDataProvider>
    <PublicLayout />
  </PublicDataProvider>

  // Admin routes use nested providers
  <AuthProvider allowedRole={'ADMIN'}>
    <ThemeProvider>
      <AdminDataProvider>
        <OrdersProvider>
          <AdminLayout />
        </OrdersProvider>
      </AdminDataProvider>
    </ThemeProvider>
  </AuthProvider>
</SessionProvider>
```

**State Management:**
- `SessionProvider` manages authentication for both public and admin
- `AdminDataProvider` handles stores, products, and admin-specific data
- Branch/store selection is managed through `sucursalSeleccionada` state
- Admin users can have assigned stores (`sucursal` property) or access all stores

**Key Data Flow Issues:**
- Admin pages depend on `sucursalSeleccionada` from AdminDataProvider
- Property naming: `session.userData.sucursal` (NOT `sucursalAsignada`)
- When `sucursalSeleccionada` is null, show all available stores
- Store filtering logic is in AdminDataProvider based on user permissions

## Data Flow

1. **Authentication**: SessionProvider handles login/logout for all users
2. **Admin Data**: AdminDataProvider loads stores/products on admin login
3. **Store Selection**: Users with assigned stores see filtered data, others see all
4. **Cart**: Persistent cart state with localStorage, promo codes, delivery zones
5. **Orders**: Order creation and tracking system ready for backend integration

## Configuration System

**Centralized Configuration:**
- `src/config/constants.js` - All app constants and configuration
- Environment variables through Vite (.env files)
- API endpoints defined in `src/config/apiEndpoints.js`

**Important Constants:**
- Security settings (login attempts, session timeout)
- Validation patterns for forms
- Error messages and loading states
- Feature flags for development

## Theme System

- Uses CSS custom properties with Tailwind
- Supports dark/light themes via ThemeProvider
- Custom color palette focused on golden empanada colors
- Glassmorphism design elements throughout

## Production Ready Features

- Complete API service layer structure with React Query
- JWT authentication system via SessionProvider
- Order management with MercadoPago integration ready
- Admin dashboard with real-time capabilities
- Responsive design optimized for all devices
- SEO-friendly structure
- Performance optimized with lazy loading

## Development Notes

- Uses ES modules and Vite for fast development
- HTTPS enabled by default (port 3000)
- All API calls use React Query mutations/queries
- localStorage used for persistence of auth, cart, and theme state
- Path aliases configured via `@/` pointing to `src/`

## Critical Bug Fixes Applied

1. **Provider Dependencies**: AdminDataProvider requires SessionProvider
2. **Property Naming**: Fixed `sucursalAsignada` vs `sucursal` inconsistency
3. **Store Selection Logic**: Fixed null initialization causing blank pages
4. **Route Structure**: Intranet routes properly nested under `/intranet/*`

## Important Context Providers

When working with admin pages, ensure:
- SessionProvider provides authentication data
- AdminDataProvider provides stores and products data
- ThemeProvider enables dark/light mode switching
- OrdersProvider manages order states and notifications

Always verify provider hierarchy when debugging blank pages or state issues.