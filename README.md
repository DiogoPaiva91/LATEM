# Lá tem Costa Marta - B2B E-commerce Mockup

This project is a high-fidelity frontend mockup for a construction materials wholesaler, designed specifically for B2B clients (retailers and construction companies).

## Branding
- **Colors:** Navy Blue (#01034a) & Yellow (#fdd700)
- **Mascot:** "TheTeo" (integrated into Login, Register, FAQ, and Home)
- **Target Audience:** Business owners (CNPJ) and Rural Producers

## Implemented Features

### 1. Public Storefront
- **Home Page:**
  - Hero section with value proposition ("Precisou? Lá tem")
  - Visual categories grid
  - Featured products slider
  - Institutional values (Delivery, Payment, Security)
- **Catalog:**
  - Advanced filtering (Categories, Price, Brand)
  - Grid/List view toggle
  - Sorting options
- **Product Details:**
  - Image gallery
  - Technical specifications table
  - Related products
- **Shopping Cart & Checkout:**
  - Slide-out cart drawer
  - **Business Logic:** Minimum order validation (R$ 600.00)
  - Checkout flow mockup

### 2. Customer Experience
- **Authentication:**
  - **Login:** Modal and dedicated page with mascot branding
  - **Register:** B2B-specific form (CNPJ, State Registration) with "Benefits Sidebar"
  - **Minimal Layout:** Header/Footer hidden on auth pages for focus
- **FAQ (Central de Ajuda):**
  - Real-time search functionality
  - Accordion-style questions
  - Mascot integration ("Como podemos ajudar?")
  - Direct contact channels (WhatsApp, Phone, Email)

### 3. Administrative Area
- **Admin Dashboard (`/admin`):**
  - Dashboard overview with KPI cards
  - Customer management table
  - Sidebar navigation
  - Minimal layout (no public header/footer)

## Tech Stack
- **Framework:** React + Vite
- **Routing:** wouter
- **Styling:** Tailwind CSS + Shadcn UI
- **Icons:** Lucide React
- **Animation:** Framer Motion

## Current Status
- ✅ Phase 1: Core Storefront (Completed)
- ✅ Phase 2: Auth & Help Center (Completed)
- 🚧 Phase 3: Admin & Dashboard (Design Only)
