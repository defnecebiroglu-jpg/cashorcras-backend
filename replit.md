# Cash or Crash - Entrepreneurship Simulation Web App

## Overview
An advanced educational entrepreneurship simulation platform that transforms learning into an engaging, interactive experience for high school students through gamified mechanics and intuitive design.

**Purpose**: High school entrepreneurship education simulation featuring team-based gameplay with stock market, currency trading, and startup management mechanics.

**Technology Stack**: React, Node.js, Express, TypeScript, Tailwind CSS, In-Memory Storage, TanStack Query

## Project Architecture

### Frontend (React + TypeScript)
- **Pages**: Team/Admin login, Team dashboard, Admin panel
- **Components**: Modular UI components with shadcn/ui
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with dark mode support

### Backend (Node.js + Express)
- **API Routes**: RESTful endpoints for all game mechanics
- **Storage**: In-memory storage with IStorage interface
- **Authentication**: Team access codes and admin password
- **File Upload**: Multer for logo uploads

### Key Features
1. **Team Dashboard**: Stock market, currency trading, startup management
2. **Admin Panel**: Portfolio management, financial overview, bulk updates
3. **Real-time Trading**: Different buy/sell prices for realistic simulation
4. **Bulk Price Updates**: CSV upload for efficient price management
5. **Dark Mode**: Complete theme system with persistence
6. **Turkish Localization**: All UI text in Turkish

## Recent Changes

### 2025-01-07 - Bulk Price Update Enhancement
- ✅ Added comprehensive bulk price update system with CSV upload
- ✅ Implemented PATCH endpoints for companies (`/api/companies/:id`) and currencies (`/api/currencies/:id`)
- ✅ Enhanced admin panel with "Toplu Güncelleme" tab for efficient price management
- ✅ Added price validation and error handling for bulk updates
- ✅ Integrated with existing admin workflow for 20-minute simulation intervals

### 2025-01-07 - Dark Mode Implementation
- ✅ Complete dark mode system with ThemeProvider
- ✅ Theme toggle component with persistence
- ✅ Consistent dark/light styling across all components
- ✅ CSS variables for seamless theme switching

### 2025-01-07 - Custom UI Design
- ✅ Updated team login page with cream/beige background (`bg-[#fbf7eb]`)
- ✅ Enhanced portfolio management with custom sell amounts
- ✅ Improved admin salesman functionality

## Current Status
- **Backend**: Fully functional with all CRUD operations
- **Frontend**: Complete with all major features implemented
- **Authentication**: Team and admin access control working
- **Database**: In-memory storage with sample data
- **Deployment**: Ready for production use

## User Preferences
- **Language**: Turkish localization preferred
- **Design**: Custom cream/beige theme for team login
- **Workflow**: 20-minute simulation intervals with bulk price updates
- **Admin Tools**: Efficient portfolio and price management tools

## Next Steps
- Application is ready for classroom deployment
- All core features implemented and tested
- Admin tools optimized for real-time classroom management