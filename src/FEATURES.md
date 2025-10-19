# Minatoh Resource Manager - Feature Overview

## Design System
- **Colors**: Primary (#0FA3B1), Secondary (#6FCF97), Neutral (#0E0F12/#F7F9FC), Accent (#FFB020)
- **Typography**: Poppins for headings, Inter for body text
- **Theme**: Full light/dark mode support with 140ms transitions
- **Accessibility**: WCAG AA compliant with focus states, semantic HTML, and ARIA labels

## Pages (All with 3+ Variants)

### 1. Dashboard
- Real-time stats (revenue, commissions, active clients, wait times)
- Therapist utilization tracking
- Active service monitoring with timers
- Alert notifications for late arrivals and queue buildup

### 2. Walk-in Registration
**Variants:**
- **Quick Add**: Minimal friction, service + gender preference only
- **Detailed**: Balanced info collection with optional client details
- **Assisted**: Full control with manual therapist assignment

### 3. Booking Management
**Variants:**
- **Calendar View**: Visual scheduling with date picker and time slots
- **List View**: Chronological list for bulk operations

### 4. Queue Management
- Real-time drag-and-drop reordering
- Auto-assignment with priority algorithm
- Live wait time tracking
- Late client alerts (>15 minutes)
- Gender preference matching

### 5. Reports & Analytics
**Variants:**
- **Overview**: Charts and graphs for revenue and service distribution
- **Therapist Details**: Comprehensive performance table
- **Service Breakdown**: Revenue analysis by service type

### 6. Staff Management
**Variants:**
- **Priority View**: Sortable by commission %, serves, rating, or last-served
- **Grid View**: Detailed cards with all metrics
- **Status Groups**: Organized by availability status

### 7. Admin Settings
**Tabs:**
- **General**: Notifications, walk-in allowance, queue limits
- **Queue Rules**: Buffer time (15m), escort time (12m), late threshold (15m)
- **Staff**: Default commission rates, assignment algorithm
- **Integrations**: POS connectivity ready

## Key Components

### ServicePicker
- 3 variants: compact (dropdown), detailed (scrollable list), grid (visual cards)
- Filterable by service type
- Shows duration, price, and commission rate

### GenderPicker
- Simple toggle for male/female/any preference
- Compact and default variants

### TherapistCard
- 3 variants: compact, detailed, priority
- Shows status, commission rate, serves, earnings
- Real-time service timers
- Manager-only commission editing

### PriorityList
- Live sorting by multiple criteria
- Best performer badges (⭐)
- Commission rate editing (manager-only)
- Auto-grouped by availability

### TimerChip
- Real-time countdown/count-up
- Variants: elapsed, remaining, scheduled
- Visual alerts for late/urgent states

## Business Rules Implemented

1. **Buffer Time**: 15-minute cleanup between services
2. **Escort Time**: 12-minute client handoff period
3. **Late Threshold**: 15 minutes past scheduled time
4. **Auto-Promote**: Late clients get priority boost
5. **Assignment Priority**:
   - Filter by gender preference
   - Sort by commission % (highest first)
   - Tie-breaker: last-served time (earliest first)

## Interactions

- **Realtime Reorder**: Drag-and-drop queue management
- **Manager-only Edit**: Commission rate adjustment
- **Auto-assignment**: Smart therapist matching
- **Motion**: 140ms transitions, 40ms stagger animations
- **States**: Hover, press, focus, empty, loading, error

## POS Extension Ready

- Integration toggle in Admin settings
- API endpoint configuration
- Secure credential storage
- Test connection functionality

## Responsive Design

- Mobile-friendly navigation with hamburger menu
- Adaptive layouts for tablet and desktop
- Touch-optimized controls
- Accessible on all screen sizes

## Additional Features

- Dark mode persistence (localStorage)
- Toast notifications for user actions
- Staggered animations for visual polish
- Empty states with helpful messaging
- Loading states with skeletons
- Error handling with fallbacks
