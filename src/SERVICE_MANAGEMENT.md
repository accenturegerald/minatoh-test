# Service Management Guide

## Overview
The Minatoh Resource Manager includes a comprehensive service management system that allows you to add, edit, and delete services offered at your spa or wellness center.

## Where to Manage Services

### Location: Admin Page → Services Tab

1. Navigate to the **Admin** page from the main navigation
2. Click on the **Services** tab
3. You'll see a list of all currently available services

## Adding a New Service

1. Click the **"Add Service"** button in the top right
2. Fill in the following fields:
   - **Service Name**: The display name (e.g., "Swedish Massage")
   - **Service Type**: Category (Massage, Facial, Body Treatment, or Therapy)
   - **Duration (min)**: How long the service takes
   - **Price ($)**: Cost to the client
   - **Commission (%)**: Percentage paid to therapist
3. Click **"Add Service"** to save

## Editing an Existing Service

1. Find the service in the list
2. Click the **Edit** button (pencil icon)
3. Modify any fields as needed
4. Click **"Update Service"** to save changes

## Deleting a Service

1. Find the service in the list
2. Click the **Delete** button (trash icon)
3. Confirm the deletion in the dialog
4. ⚠️ **Warning**: Staff members assigned to this service will need to be updated

## Service Details

Each service includes:
- **Name**: Display name shown to clients and staff
- **Type**: Category for filtering and organization
- **Duration**: Minutes required to complete the service
- **Price**: Cost charged to the client
- **Commission**: Percentage of price paid to the therapist

## How Services Connect to Other Features

### Staff Capabilities
- When adding/editing staff in the **Staff** page, you assign which services they can perform
- Staff can only be assigned to clients requesting services in their capability list
- Changes to services here affect staff capability options

### Walk-in Assignment
- Only shows staff who can perform the selected service
- Service duration is displayed to help with scheduling
- Commission rate affects staff prioritization

### Booking System
- Clients can only book available services
- Duration affects scheduling and time slot availability

### Queue Management
- Service duration determines estimated wait times
- Commission impacts staff assignment priority

## Best Practices

1. **Commission Rates**: Lower commission = higher priority in auto-assignment
2. **Duration Accuracy**: Set realistic durations including cleanup time
3. **Service Types**: Use consistent typing for easier filtering
4. **Regular Review**: Update services as your business offerings change

## Technical Notes

- Service IDs are automatically generated
- Deleting a service doesn't remove historical data
- Service changes take effect immediately across the entire app
- Services are stored in `/lib/mockData.ts` as the initial dataset
