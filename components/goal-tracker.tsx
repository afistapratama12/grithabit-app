"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Goal, Activity, SubGoal } from "@/lib/types"
import { goalSchema } from "@/lib/validations"
import { createGoal } from "@/lib/database"
import { Loader2, Plus, Target, X, CheckCircle2, Circle } from "lucide-react"

interface GoalTrackerProps {
  goals: Goal[]
  activities: Activity[]
  onGoalAdded: () => void
}

type GoalForm = {
  title: string
  description?: string
  category: "Workout" | "Learning" | "Creating Something"
  type: "monthly" | "yearly"
  target_count: number
  sub_goals: { name: string; description?: string; target_count: number }[]
}

export default function GoalTracker({ goals, activities, onGoalAdded }: GoalTrackerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const { toast } = useToast()

  const form = useForm<GoalForm>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      description: "",
      category: undefined,
      type: undefined,
      target_count: 1,
      sub_goals: [{ name: "", description: "", target_count: 1 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sub_goals",
  })

  const onSubmit = async (data: GoalForm) => {
    setIsLoading(true)
    try {
      const { error } = await createGoal(data)

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Goal created successfully!",
      })

      form.reset()
      setShowDialog(false)
      onGoalAdded()
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getGoalProgress = (goal: Goal) => {
    const now = new Date()
    let startDate: Date

    if (goal.type === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    } else {
      startDate = new Date(now.getFullYear(), 0, 1)
    }

    const relevantActivities = activities.filter(
      (activity) => activity.category === goal.category && new Date(activity.timestamp) >= startDate,
    )

    return {
      current: relevantActivities.length,
      target: goal.target_count,
      percentage: Math.min((relevantActivities.length / goal.target_count) * 100, 100),
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Goals</CardTitle>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Learn React Advanced"
                    {...form.register("title")}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.title.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => form.setValue("category", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Workout">🏋️ Workout</SelectItem>
                      <SelectItem value="Learning">📚 Learning</SelectItem>
                      <SelectItem value="Creating Something">💡 Creating Something</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.category.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your goal..."
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Time Period</Label>
                  <Select onValueChange={(value) => form.setValue("type", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.type && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.type.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="target_count">Total Target Count</Label>
                  <Input
                    id="target_count"
                    type="number"
                    placeholder="e.g., 20"
                    {...form.register("target_count", { valueAsNumber: true })}
                  />
                  {form.formState.errors.target_count && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.target_count.message}</p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Sub-Goals (Goal Kecil)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: "", description: "", target_count: 1 })}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Sub-Goal
                  </Button>
                </div>
                {form.formState.errors.sub_goals && (
                  <p className="text-sm text-red-500 mb-2">{form.formState.errors.sub_goals.message}</p>
                )}
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-sm font-medium">Sub-Goal {index + 1}</h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`sub_goals.${index}.name`}>Sub-Goal Name</Label>
                          <Input
                            placeholder="e.g., Complete React Tutorial"
                            {...form.register(`sub_goals.${index}.name`)}
                          />
                          {form.formState.errors.sub_goals?.[index]?.name && (
                            <p className="text-sm text-red-500 mt-1">
                              {form.formState.errors.sub_goals[index]?.name?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor={`sub_goals.${index}.target_count`}>Target Count</Label>
                          <Input
                            type="number"
                            placeholder="e.g., 5"
                            {...form.register(`sub_goals.${index}.target_count`, { valueAsNumber: true })}
                          />
                          {form.formState.errors.sub_goals?.[index]?.target_count && (
                            <p className="text-sm text-red-500 mt-1">
                              {form.formState.errors.sub_goals[index]?.target_count?.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3">
                        <Label htmlFor={`sub_goals.${index}.description`}>Description (Optional)</Label>
                        <Input
                          placeholder="Describe this sub-goal..."
                          {...form.register(`sub_goals.${index}.description`)}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Goal
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {goals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No goals set yet.</p>
              <p className="text-sm">Create your first goal to start tracking!</p>
            </div>
          ) : (
            goals.map((goal) => {
              const progress = getGoalProgress(goal)
              return (
                <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{goal.category}</Badge>
                        <Badge variant="secondary">{goal.type}</Badge>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {progress.current} / {progress.target}
                    </span>
                  </div>
                  <Progress value={progress.percentage} className="mb-3" />
                  <p className="text-sm text-gray-600 mb-3">{progress.percentage.toFixed(0)}% complete</p>
                  
                  {/* Sub-goals */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Sub-Goals:</h4>
                    {goal.sub_goals.map((subGoal) => {
                      const subGoalActivities = activities.filter(
                        (activity) => activity.sub_goal_id === subGoal.id
                      )
                      const subGoalProgress = Math.min(
                        (subGoalActivities.length / subGoal.target_count) * 100,
                        100
                      )
                      
                      return (
                        <div key={subGoal.id} className="flex items-center justify-between p-2 bg-white rounded">
                          <div className="flex items-center gap-2">
                            {subGoal.is_completed ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-400" />
                            )}
                            <div>
                              <p className="text-sm font-medium">{subGoal.name}</p>
                              {subGoal.description && (
                                <p className="text-xs text-gray-500">{subGoal.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">
                              {subGoalActivities.length} / {subGoal.target_count}
                            </p>
                            <p className="text-xs text-gray-500">{subGoalProgress.toFixed(0)}%</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
