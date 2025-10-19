# Quick Reference Guide

## Service Management

### Where to modify your list of services:
**Admin Page → Services Tab**

#### Step-by-step:
1. Click **"Admin"** in the navigation menu
2. Click the **"Services"** tab (second tab)
3. You'll see all your services listed

#### What you can do:
- **Add Service**: Click "Add Service" button (top right)
- **Edit Service**: Click pencil icon next to any service
- **Delete Service**: Click trash icon next to any service

---

## Staff Management

### Where to add/edit therapists and their capabilities:
**Staff Page**

#### Step-by-step:
1. Click **"Staff"** in the navigation menu
2. Click **"Add Therapist"** button (top right) to add new
3. Hover over any staff card and click **"Edit"** to modify

#### What you can configure:
- Name, Gender, Commission Rate, Rating
- **Service Capabilities** (which services they can perform)

---

## Walk-in Assignment

### Where to assign clients to therapists:
**Walk-in Page**

#### Features:
- Shows only staff qualified for selected service
- Displays available and busy staff
- Includes time estimates with buffer
- Confirmation dialog before assignment

---

## Settings & Configuration

### Where to configure system rules:
**Admin Page → Other Tabs**

#### Available settings:
- **General**: Notifications, walk-in enabled, queue limits
- **Queue**: Buffer time (15m), escort time (12m), late threshold
- **Staff**: Default commission rates, priority algorithm
- **Integrations**: POS, SMS, webhooks

---

## File Locations (for developers)

### Services data:
- Initial data: `/lib/mockData.ts` → `services` array
- Management UI: `/pages/Admin.tsx` → Services tab
- Type definition: `/types/index.ts` → `Service` interface

### Staff/Therapist data:
- Initial data: `/lib/mockData.ts` → `therapists` array
- Management UI: `/pages/Staff.tsx`
- Type definition: `/types/index.ts` → `Therapist` interface

### Walk-in functionality:
- Main page: `/pages/WalkIn.tsx`
- Components: `/components/ServicePicker.tsx`, `/components/GenderPicker.tsx`

---

## Common Tasks

### I want to add a new massage service:
1. Admin → Services → Add Service
2. Name: "New Massage Name"
3. Type: Massage
4. Set duration, price, commission
5. Save

### I want to hire a new therapist:
1. Staff → Add Therapist
2. Enter name, gender, rates
3. Check all services they can perform
4. Save

### I want to change who can do facials:
1. Staff → Find therapist → Click Edit
2. Scroll to "Service Capabilities"
3. Check/uncheck "Facial Treatment"
4. Update

### I want to adjust a service price:
1. Admin → Services
2. Find service → Click Edit (pencil icon)
3. Change price
4. Update Service

---

## Troubleshooting

### "No staff can perform this service"
- Go to Staff page
- Edit therapists to add this service to their capabilities

### Service not showing in walk-in:
- Check Admin → Services to ensure it exists
- Verify at least one staff member has it in their capabilities

### Commission not updating:
- Staff individual rates: Staff page → Edit therapist
- Service default rates: Admin → Services → Edit service
- System default: Admin → Staff tab → Default Commission Rate

---

## Support

For detailed documentation, see:
- `/SERVICE_MANAGEMENT.md` - Service management guide
- `/CHANGELOG.md` - Recent changes and features
- `/FEATURES.md` - Complete feature list
