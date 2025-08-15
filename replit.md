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

### 2025-01-24 - Server & HTTP Configuration Fixes + Deployment Ready
- ✅ **HTTP/Server Ayarları Tamamen Düzeltildi**: Session handling, type safety, security headers
- ✅ **Production Build Problemleri Çözüldü**: Render ve Railway deployment hatalarının kök nedenleri bulundu
- ✅ **Manuel Deployment Configuration**: render.yaml ve railway.json sorunları tespit edildi, manuel setup öneriliyor
- ✅ **Deployment Guides Updated**: DEPLOYMENT_ERRORS_FIX.md ile comprehensive troubleshooting
- ✅ **Security Headers**: Production için X-Frame-Options, CSP, XSS protection eklendi
- ✅ **Environment Config**: Centralized config.ts with deployment detection (Render/Railway/Replit)
- ✅ **Graceful Shutdown**: SIGTERM/SIGINT handling for cloud deployments
- ✅ **Health Check**: /health endpoint for monitoring
- ✅ **Session Security**: Fixed HTTPS/secure cookie handling for production
- ✅ **Landing Page Content**: Casino content replaced with "GİRİŞİMCİLİK SİMÜLASYONU"

### 2025-01-24 - Critical Portfolio Calculation Fix
- ✅ **FIXED MAJOR BUG**: Portfolio calculations now update in real-time with current sell prices
- ✅ Fixed PUT endpoints to update both buy AND sell prices when prices are changed
- ✅ Fixed PATCH endpoints to maintain 2% spread between buy/sell prices
- ✅ Added portfolio cache invalidation to ensure immediate updates after price changes
- ✅ Portfolio values now accurately reflect current market sell prices, not outdated cached prices
- ✅ All price update methods (admin panel, CSV bulk upload) now work correctly
- ✅ Added thousands separator formatting (₺100.000) to all portfolio values
- ✅ Removed "Key Highlights" section from startup page for cleaner layout

### 2025-01-21 - Landing Page & Portfolio Updates
- ✅ Created welcome landing page matching Figma design with dark theme and vibrant branding
- ✅ Implemented pixel-perfect design with exact positioning and typography (Inter font, 128px hero text)
- ✅ Added stylized "CASH CRASH!" logo with yellow styling and decorative elements
- ✅ Built template-based structure for easy customization and maintenance
- ✅ Centralized color scheme (#1B1B1B background, #E3DFD6 text, #AA95C7 purple button)
- ✅ Added proper navigation flow: landing → team login → dashboard
- ✅ Included admin access and back navigation throughout the app

### 2025-01-07 - CSV Editor Enhancement
- ✅ Added inline CSV editor to admin panel alongside file upload option
- ✅ Built-in template loading with sample data for quick editing
- ✅ Updated CSV format to use company/currency names instead of IDs
- ✅ Copy/paste functionality for direct text editing in large textarea
- ✅ Real-time validation and preview before applying changes

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
- **Deployment**: Ready for production use with cloud platform support

## Cloud Deployment
- **Render**: Configured with render.yaml (automatic HTTPS, free tier)
- **Railway**: Configured with railway.json and nixpacks.toml
- **Docker**: Multi-stage Dockerfile for custom deployments
- **HTTPS**: Session security configured for production
- **Port**: Dynamic PORT environment variable support

## User Preferences
- **Language**: Turkish localization preferred
- **Design**: Custom cream/beige theme for team login
- **Workflow**: 20-minute simulation intervals with bulk price updates
- **Admin Tools**: Efficient portfolio and price management tools

## Next Steps
- Application is ready for classroom deployment
- All core features implemented and tested
- Admin tools optimized for real-time classroom management