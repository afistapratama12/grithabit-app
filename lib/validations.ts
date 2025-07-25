import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const verificationSchema = z.object({
  pin: z.string()
    .length(6, "PIN must be exactly 6 digits")
    .regex(/^\d{6}$/, "PIN must contain only numbers"),
})

export const activityProgressSchema = z.object({
  name: z.string().min(1, "Progress name is required"),
  value: z.number().min(0, "Value must be positive"),
  unit: z.string().min(1, "Unit is required"),
})

export const activityDataSchema = z.object({
  type: z.enum(["link", "multiple", "simple"]),
  content: z.union([
    z.string().url("Must be a valid URL").optional(),
    z.array(activityProgressSchema).optional(),
    z.string().optional(),
  ]),
})

export const activitySchema = z.object({
  category: z.enum(["Workout", "Learning", "Creating Something"]),
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  activity_data: activityDataSchema,
  duration_minutes: z.number().min(1, "Duration must be at least 1 minute").optional(),
  goal_id: z.string().optional(),
  sub_goal_id: z.string().optional(),
  goal_progress_percentage: z.number().min(0).max(100).optional(),
})

export const subGoalSchema = z.object({
  name: z.string().min(1, "Sub-goal name is required").max(100, "Name too long"),
  description: z.string().max(200, "Description too long").optional(),
  target_count: z.number().min(1, "Target must be at least 1"),
})

export const goalSchema = z.object({
  title: z.string().min(1, "Goal title is required").max(100, "Title too long"),
  description: z.string().max(300, "Description too long").optional(),
  category: z.enum(["Workout", "Learning", "Creating Something"]),
  type: z.enum(["monthly", "yearly"]),
  target_count: z.number().min(1, "Target must be at least 1"),
  sub_goals: z.array(subGoalSchema).min(1, "At least one sub-goal is required"),
})
