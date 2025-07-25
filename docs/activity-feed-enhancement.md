# Activity Feed Enhancement

## Changes Made

### 1. Database Structure Updates
- **New columns added to activities table:**
  - `activity_data` (JSONB): Stores structured activity information
  - `duration_minutes` (INTEGER): Duration of the activity
  - `goal_id` (UUID): Reference to related goal
  - `goal_progress_percentage` (INTEGER): Progress contribution (0-100%)

### 2. Type System Updates
- **New interfaces:**
  - `ActivityData`: Contains type and content for activities
  - `ActivityProgress`: For detailed workout/progress tracking
- **Updated Activity interface** to include new fields

### 3. Form Features
- **Dialog-based input** instead of inline form
- **Three input types:**
  1. **Simple**: Basic text description
  2. **Link**: URL input for videos/resources (YouTube, Instagram, Medium, etc.)
  3. **Multiple**: Detailed progress tracking (exercise name, amount, unit)

### 4. Enhanced Activity Display
- **Duration badges** showing time spent
- **Goal progress badges** showing percentage contribution
- **Link rendering** for URL-type activities
- **Detailed progress display** for multiple-type activities

### 5. Goal Integration
- **Goal selection** dropdown in activity form
- **Progress percentage** input when goal is selected
- **Visual indicators** in activity feed

## Usage

### Creating Activities

1. **Simple Activity:**
   - Select category (Workout/Learning/Creating Something)
   - Set duration in minutes
   - Choose "Simple" input type
   - Write description
   - Optionally link to a goal and set progress percentage

2. **Link-based Activity:**
   - Choose "Link" input type
   - Paste URL (YouTube, Instagram, Medium, etc.)
   - The link will be displayed as clickable in the feed

3. **Detailed Progress Activity:**
   - Choose "Multiple" input type
   - Add multiple progress items (name, value, unit)
   - Example: "Squats 50 reps", "Push-ups 30 reps"
   - Each item will be displayed separately in the feed

### Migration Required

Run the migration file to update your database:
```sql
-- File: supabase/migrations/20250724000002_update_activities_structure.sql
```

This will:
- Add new columns to activities table
- Create indexes for performance
- Migrate existing activities to new structure
- Set proper constraints

## Next Steps

You may want to consider:
1. **Embed support** for YouTube/Instagram URLs
2. **Activity templates** for common workouts
3. **Progress charts** for detailed tracking
4. **Goal achievement notifications**
5. **Activity sharing** features
