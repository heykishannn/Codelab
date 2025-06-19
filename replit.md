# APK Builder IDE

## Overview

This is a full-stack web application that serves as an integrated development environment (IDE) for building Android APK applications. The application allows users to create, edit, and export mobile applications using web technologies (HTML, CSS, JavaScript). It features a modern React-based frontend with an Express.js backend, utilizing TypeScript throughout for type safety.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite for fast development and optimized production builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks with local component state
- **Client-side Storage**: IndexedDB for project persistence
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture  
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Production**: esbuild for fast bundling

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured but not yet implemented)
- **Provider**: Neon Database serverless PostgreSQL
- **Current Storage**: In-memory storage implementation as fallback

## Key Components

### IDE Features
- **Code Editor**: Multi-tab code editor with syntax highlighting support
- **File Explorer**: Hierarchical file system with drag-and-drop functionality
- **Live Preview**: Real-time preview with multiple device viewport options (mobile, tablet, desktop)
- **Console Panel**: Debug output and error logging
- **Project Templates**: Pre-built templates for quick project initialization
- **Export System**: Export projects as ZIP files or Android APK packages

### UI Component System
- **Design System**: Dark theme with neon accent colors (cyan, purple, red)
- **Component Library**: Comprehensive set of reusable UI components
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: Built-in accessibility features through Radix UI

### Storage Layer
- **Interface**: Abstract storage interface (IStorage) for CRUD operations
- **Implementation**: Currently using in-memory storage (MemStorage)
- **Future**: Database integration ready via Drizzle schema

## Data Flow

1. **User Authentication**: Schema defined for users with username/password
2. **Project Management**: Projects stored with file hierarchies and metadata
3. **Code Editing**: Real-time code updates with dirty state tracking
4. **Live Preview**: Dynamic content compilation and iframe rendering
5. **Export Process**: Multi-step export workflow with progress tracking

## External Dependencies

### Core Runtime
- React ecosystem with TypeScript support
- Express.js for server-side API handling
- Vite for development and build tooling

### UI and Styling
- Radix UI for accessible component primitives
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography

### Database and Storage
- Drizzle ORM with PostgreSQL dialect
- Neon Database for serverless PostgreSQL
- IndexedDB for client-side project storage

### Development Tools
- ESBuild for production bundling
- PostCSS with Autoprefixer for CSS processing
- TypeScript for type safety across the stack

## Deployment Strategy

### Development Environment
- Replit-optimized configuration with hot module replacement
- Multi-port setup (client on 5000, development server)
- Integrated PostgreSQL 16 module for database functionality

### Production Deployment
- Autoscale deployment target for dynamic scaling
- Static asset serving with Express.js fallback
- Environment variable configuration for database connections

### Build Process
1. Frontend: Vite builds React application to `dist/public`
2. Backend: ESBuild bundles server code to `dist/index.js`
3. Assets: Static files served from built output directory

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 18, 2025: Initial setup
- June 18, 2025: Completed comprehensive APK Builder IDE with all requested features:
  * Multi-language code editor with syntax highlighting
  * Live preview with Android-style device frames
  * Drag-and-drop UI component builder
  * File system with IndexedDB storage
  * ZIP and APK export functionality
  * Project templates and developer tools
  * Modern Android-style dark theme with neon accents