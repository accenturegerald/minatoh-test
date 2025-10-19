# Changelog

## Latest Updates

### Features Added

#### 1. Confirmation Dialog for Staff Assignment
- **Location**: Walk-in page
- All therapist selections now show a confirmation dialog before assignment
- Displays complete assignment details:
  - Client name
  - Service details (name, duration, commission)
  - Therapist name and status
  - Estimated start time with buffer calculations
- Shows buffer time warnings for busy/on-break staff
- Calculates 12-minute escort buffer automatically

#### 2. Busy Staff Assignment
- **Location**: Walk-in page
- Busy and on-break staff are now selectable (previously disabled)
- Shows "Free at [time] (+12m buffer)" on each busy staff card
- Confirmation dialog calculates exact start time including buffer
- Visual distinction between available and busy staff
- Auto-calculates service start time based on current client end time + escort buffer

#### 3. Comprehensive Staff Management
- **Location**: Staff page
- **Add New Therapist**:
  - Full form with name, gender, commission, rating
  - Service capabilities checkbox list
  - Validates all required fields
  - Automatically calculates specialties
- **Edit Existing Therapist**:
  - Edit button on hover for all therapist cards
  - Pre-fills form with current values
  - Update service capabilities
  - Modify commission rates
- **Service Capabilities Assignment**:
  - Visual checkbox list of all services
  - Shows service type and duration
  - Selected services displayed as badges
  - Prevents assignment without at least one service

#### 4. Service Management System
- **Location**: Admin page → Services tab
- **Add Services**:
  - Name, type, duration, price, commission
  - Service type dropdown (massage, facial, body-treatment, therapy)
  - Full validation
- **Edit Services**:
  - Modify any service details
  - Changes affect all staff capabilities
- **Delete Services**:
  - Confirmation dialog with warning
  - Alerts about staff assignment impacts
- **View Services**:
  - List view with all service details
  - Quick access edit/delete buttons
  - Organized display

### Bug Fixes

#### 1. Commission Logic Corrected
- **Fixed**: Commission sorting now prioritizes LOWER rates (better for business)
- **Location**: PriorityList.tsx, Walk-in page
- **Before**: Higher commission = higher priority (wrong)
- **After**: Lower commission = higher priority (correct)
- Also fixed "serves" sorting to prioritize staff with fewer serves

#### 2. Unused Import Removed
- **Fixed**: Removed unused `TherapistStatus` import from mockData.ts
- Prevents TypeScript warnings

#### 3. Algorithm Documentation Updated
- **Fixed**: Admin page now correctly states "lowest first" for commission sorting
- **Location**: Admin → Staff tab
- Ensures transparency matches actual behavior

### Data Structure Changes

#### 1. Therapist Type Extended
- Added `serviceIds: string[]` field
- Stores which services each therapist can perform
- Used for filtering qualified staff

#### 2. Service Capability Filtering
- New function: `getTherapistsForService(serviceId, preferredGender)`
- Filters by both service capability and gender preference
- Excludes offline staff
- Used in Walk-in assignment

### Constants Added
```typescript
const ESCORT_BUFFER_MINUTES = 12;
const LATE_THRESHOLD_MINUTES = 15;
```

### UI/UX Improvements

1. **Clearer Availability Indicators**:
   - Clock icon for unavailable staff
   - Arrow icon for available staff
   - Color-coded badges (Available/Busy)
   - Real-time countdown in minutes

2. **Better Staff Cards**:
   - "Best Rate" badge for lowest commission
   - "Recommended" badge for top priority
   - Availability time with buffer shown
   - Hover effects for edit buttons

3. **Service Management Interface**:
   - Clean list view
   - Inline edit/delete actions
   - Type badges for visual categorization
   - Responsive grid layout

4. **Confirmation Dialogs**:
   - Clear summary of assignment
   - Warning icons for delayed starts
   - Estimated start time calculation
   - Cancel/Confirm actions

### File Structure

New files:
- `/SERVICE_MANAGEMENT.md` - Service management documentation
- `/CHANGELOG.md` - This file

Modified files:
- `/pages/WalkIn.tsx` - Added confirmation, busy staff support
- `/pages/Staff.tsx` - Added add/edit with service capabilities
- `/pages/Admin.tsx` - Added Services tab with full CRUD
- `/components/PriorityList.tsx` - Fixed commission sorting logic
- `/lib/mockData.ts` - Added serviceIds, getTherapistsForService function
- `/types/index.ts` - Added serviceIds to Therapist interface

### How to Use New Features

#### Manage Services:
1. Go to **Admin** page
2. Click **Services** tab
3. Use Add/Edit/Delete buttons

#### Add Staff:
1. Go to **Staff** page
2. Click **Add Therapist**
3. Fill form and select service capabilities
4. Save

#### Edit Staff:
1. Go to **Staff** page
2. Hover over any staff card
3. Click **Edit** button
4. Update details and capabilities

#### Assign Walk-ins:
1. Go to **Walk-in** page
2. Select service
3. Click any staff (available or busy)
4. Review confirmation dialog
5. Confirm assignment

### Known Limitations

1. Services are stored in local state (resets on page refresh)
2. For production, integrate with backend API
3. No undo functionality for deletions
4. Historical data not affected by service changes

### Next Steps

Consider implementing:
- Backend persistence for services
- Service usage analytics
- Bulk staff capability assignment
- Service categories/grouping
- Seasonal service enabling/disabling
- Service-specific pricing rules
