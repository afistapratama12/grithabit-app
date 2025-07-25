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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Activity, Goal, ActivityProgress, ActivityData } from "@/lib/types"
import type { ActivityInput, WorkoutData, LearningData, CreatingData } from "@/lib/supabase/types"
import { activitySchema } from "@/lib/validations"
import { createActivity } from "@/lib/database"
import { Loader2, Plus, Dumbbell, BookOpen, Lightbulb, X, Clock, Target } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface ActivityFeedProps {
  activities: Activity[]
  goals: Goal[]
  onActivityAdded: () => void
}

type ActivityForm = {
  category: "Workout" | "Learning" | "Creating Something"
  description: string
  activity_data: {
    content: string // This will be used for link input or other simple content
  }
  duration_minutes?: number
  goal_id?: string
  sub_goal_id?: string
  goal_progress_percentage?: number
}

const categoryIcons = {
  Workout: Dumbbell,
  Learning: BookOpen,
  "Creating Something": Lightbulb,
}

const categoryColors = {
  Workout: "bg-red-100 text-red-800",
  Learning: "bg-blue-100 text-blue-800",
  "Creating Something": "bg-purple-100 text-purple-800",
}

export default function ActivityFeed({ activities, goals, onActivityAdded }: ActivityFeedProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [inputType, setInputType] = useState<"link" | "multiple" | null>()
  const [progressItems, setProgressItems] = useState<ActivityProgress[]>([{ name: "", value: 0, unit: "" }])
  const [durationHours, setDurationHours] = useState<number>(0)
  const [durationMinutes, setDurationMinutes] = useState<number>(0)
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const form = useForm<ActivityForm>({
    defaultValues: {
      category: undefined,
      description: "",
      activity_data: {
        content: "",
      },
      duration_minutes: undefined,
      goal_id: undefined,
      sub_goal_id: undefined,
      goal_progress_percentage: undefined,
    },
  })

  const onSubmit = async (data: ActivityForm) => {
    setIsLoading(true)
    try {
      // Validate required fields
      if (!data.category) {
        toast({
          title: "Error",
          description: "Please select a category",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (!data.description) {
        toast({
          title: "Error",
          description: "Please provide a description",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Prepare activity data based on input type and category
      let activityData: WorkoutData | LearningData | CreatingData

      // Create base data structure based on category
      if (data.category === "Workout") {
        const workoutData: WorkoutData = {}
        
        if (inputType === "link") {
          // For workout links, we could store them as exercise_type or use a custom field
          workoutData.exercise_type = data.activity_data.content as string || ""
        } else if (inputType === "multiple") {
          // For multiple workout items, we could store first item as exercise_type
          const firstItem = progressItems.filter(item => item.name && item.value > 0)[0]
          if (firstItem) {
            workoutData.exercise_type = firstItem.name
            workoutData.reps = firstItem.value
            // Store additional data in a way that fits workout structure
          }
        }
        
        activityData = workoutData
      } else if (data.category === "Learning") {
        const learningData: LearningData = {}
        
        if (inputType === "link") {
          learningData.resource_type = "Other"
          learningData.subject = data.activity_data.content as string || ""
        } else if (inputType === "multiple") {
          // For learning activities, use exercises_completed for count
          const completedItems = progressItems.filter(item => item.name && item.value > 0)
          learningData.exercises_completed = completedItems.length
          if (completedItems[0]) {
            learningData.subject = completedItems[0].name
          }
        }
        
        activityData = learningData
      } else { // Creating Something
        const creatingData: CreatingData = {}
        
        if (inputType === "link") {
          creatingData.project_type = data.activity_data.content as string || ""
        } else if (inputType === "multiple") {
          const features = progressItems
            .filter(item => item.name && item.value > 0)
            .map(item => `${item.name}: ${item.value} ${item.unit}`)
          creatingData.features_completed = features
        }
        
        activityData = creatingData
      }

      const { error } = await createActivity({
        category: data.category,
        description: data.description,
        activity_data: activityData,
        duration_minutes: durationHours * 60 + durationMinutes,
        goal_id: data.goal_id,
        sub_goal_id: data.sub_goal_id,
        goal_progress_percentage: data.goal_progress_percentage,
        timestamp: new Date().toISOString(),
      })

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
        description: "Activity recorded successfully!",
      })

      form.reset()
      setShowDialog(false)
      setInputType(null)
      setProgressItems([{ name: "", value: 0, unit: "" }])
      setDurationHours(0)
      setDurationMinutes(0)
      onActivityAdded()
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

  const addProgressItem = () => {
    setProgressItems([...progressItems, { name: "", value: 0, unit: "" }])
  }

  const removeProgressItem = (index: number) => {
    setProgressItems(progressItems.filter((_, i) => i !== index))
  }

  const updateProgressItem = (index: number, field: keyof ActivityProgress, value: string | number) => {
    const updated = [...progressItems]
    updated[index] = { ...updated[index], [field]: value }
    setProgressItems(updated)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) {
      return `${hours}h`
    }
    return `${hours}h ${remainingMinutes}m`
  }

  const getEmbedInfo = (url: string) => {
    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname.toLowerCase()
      
      // YouTube
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        let videoId = ''
        if (hostname.includes('youtu.be')) {
          videoId = urlObj.pathname.slice(1)
        } else if (urlObj.searchParams.get('v')) {
          videoId = urlObj.searchParams.get('v') || ''
        }
        
        return {
          platform: 'YouTube',
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          icon: '🎥',
          color: 'bg-red-50 border-red-200'
        }
      }
      
      // Instagram
      if (hostname.includes('instagram.com')) {
        return {
          platform: 'Instagram',
          embedUrl: url,
          thumbnailUrl: null,
          icon: '📸',
          color: 'bg-pink-50 border-pink-200'
        }
      }
      
      // Medium
      if (hostname.includes('medium.com')) {
        return {
          platform: 'Medium',
          embedUrl: url,
          thumbnailUrl: null,
          icon: '📝',
          color: 'bg-green-50 border-green-200'
        }
      }
      
      // Twitter/X
      if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
        return {
          platform: 'Twitter',
          embedUrl: url,
          thumbnailUrl: null,
          icon: '🐦',
          color: 'bg-blue-50 border-blue-200'
        }
      }
      
      // Generic URL
      return {
        platform: hostname,
        embedUrl: url,
        thumbnailUrl: null,
        icon: '🔗',
        color: 'bg-gray-50 border-gray-200'
      }
    } catch {
      return null
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg md:text-xl">Activity Feed</CardTitle>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1 md:gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Activity</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[96%] max-w-2xl max-h-[90vh] overflow-y-auto mx-auto p-4 md:p-6">
            <DialogHeader className="pb-2">
              <DialogTitle className="text-lg md:text-xl">Record New Activity</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 md:space-y-4">
              {/* Category */}
              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="category" className="text-sm md:text-base">Category</Label>
                <Select onValueChange={(value) => form.setValue("category", value as any)}>
                  <SelectTrigger className="h-10 md:h-11">
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

              {/* Duration */}
              <div className="space-y-1 md:space-y-2">
                <Label className="text-sm md:text-base">Duration</Label>
                <div className="flex gap-2 md:gap-4">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="hours" className="text-xs md:text-sm text-gray-600">Hours</Label>
                    <Select value={durationHours.toString()} onValueChange={(value) => setDurationHours(parseInt(value))}>
                      <SelectTrigger className="h-10 md:h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i} hr{i !== 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="minutes" className="text-xs md:text-sm text-gray-600">Minutes</Label>
                    <Select value={durationMinutes.toString()} onValueChange={(value) => setDurationMinutes(parseInt(value))}>
                      <SelectTrigger className="h-10 md:h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 60 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i} min{i !== 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  className="text-sm md:text-base"
                  id="description"
                  placeholder="Overall description of your activity..."
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.description.message}</p>
                )}
              </div>

              {/* Input Type Selection */}
              <div className="space-y-1">
                <Label>Activity Detail</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    type="button"
                    variant={inputType === "link" ? "default" : "outline"}
                    onClick={() => {
                      inputType === "link" ? setInputType(null) : setInputType("link")
                    }}
                    className="flex flex-col justify-center"
                  >
                    <span className="text-sm font-medium">Link</span>
                  </Button>
                  <Button
                    type="button"
                    variant={inputType === "multiple" ? "default" : "outline"}
                    onClick={() => {
                      inputType === "multiple" ? setInputType(null) : setInputType("multiple")
                    }}
                    className="flex flex-col justify-center"
                  >
                    <span className="text-sm font-medium">More Detail</span>
                  </Button>
                </div>
              </div>

              {/* Input Content based on type */}

              {
                inputType && (
                <div className="space-y-1">
                  <Label>Details</Label>
                  {/* {inputType === "simple" && (
                    <Textarea
                      placeholder="Describe your activity..."
                      {...form.register("activity_data.content")}
                    />
                  )} */}
                  {inputType === "link" && (
                    <Input
                      className="text-sm md:text-base"
                      placeholder="Paste URL (YouTube, Instagram, Medium, etc.)"
                      {...form.register("activity_data.content")}
                    />
                  )}
                  
                  {inputType === "multiple" && (
                    <div className="space-y-1">
                      {progressItems.map((item, index) => (
                        <div key={index} className="flex gap-2 items-end">
                          <div className="flex-1">
                            <Input
                              className="text-sm md:text-base"
                              placeholder="Exercise name"
                              value={item.name}
                              onChange={(e) => updateProgressItem(index, "name", e.target.value)}
                            />
                          </div>
                          <div className="w-24">
                            <Input
                              className="text-sm md:text-base"
                              type="number"
                              placeholder="Amount"
                              value={item.value || ""}
                              onChange={(e) => updateProgressItem(index, "value", parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div className="w-20">
                            <Input
                              className="text-sm md:text-base"
                              placeholder="Unit"
                              value={item.unit}
                              onChange={(e) => updateProgressItem(index, "unit", e.target.value)}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeProgressItem(index)}
                            disabled={progressItems.length === 1}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addProgressItem}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Detail
                      </Button>
                    </div>
                  )}
                </div>
                )
              }

              {/* Goal Selection */}
              <div className="space-y-1">
                <Label htmlFor="goal" className="text-xs md:text-sm">Related Goal (Optional)</Label>
                <Select onValueChange={(value) => form.setValue("goal_id", value)}>
                  <SelectTrigger className="h-10 md:h-11">
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {goals.map((goal) => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {goal.title} - {goal.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sub-Goal Selection */}
              {form.watch("goal_id") && (
                <div className="space-y-1">
                  <Label htmlFor="sub_goal" className="text-xs md:text-sm">Related Sub-Goal (Optional)</Label>
                  <Select onValueChange={(value) => form.setValue("sub_goal_id", value)}>
                    <SelectTrigger className="h-10 md:h-11">
                      <SelectValue placeholder="Select a sub-goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {goals
                        .find((goal) => goal.id === form.watch("goal_id"))
                        ?.sub_goals.map((subGoal) => (
                          <SelectItem key={subGoal.id} value={subGoal.id}>
                            {subGoal.name} ({subGoal.target_count} target)
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Goal Progress */}
              {form.watch("goal_id") && (
                <div>
                  <Label htmlFor="progress">Goal Progress (%)</Label>
                  <Input
                    id="progress"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="How much progress did this contribute?"
                    {...form.register("goal_progress_percentage", { valueAsNumber: true })}
                  />
                  {form.formState.errors.goal_progress_percentage && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.goal_progress_percentage.message}</p>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Record Activity
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
        <div className={`space-y-3 ${!isMobile ? 'overflow-y-auto' : ''}`}>
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No activities recorded yet.</p>
              <p className="text-sm">Start tracking your progress!</p>
            </div>
          ) : (
            activities.map((activity) => {
              const Icon = categoryIcons[activity.category]
              return (
                <div key={activity.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={categoryColors[activity.category]}>{activity.category}</Badge>
                      {activity.duration_minutes && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDuration(activity.duration_minutes)}
                        </Badge>
                      )}
                      {activity.sub_goal_id && (
                        (() => {
                          const goal = goals.find(g => g.id === activity.goal_id)
                          const subGoal = goal?.sub_goals.find(sg => sg.id === activity.sub_goal_id)
                          return subGoal ? (
                            <Badge variant="secondary" className="text-xs">
                              📌 {subGoal.name}
                            </Badge>
                          ) : null
                        })()
                      )}
                      {activity.goal_progress_percentage && (
                        <Badge variant="outline" className="text-xs">
                          <Target className="w-3 h-3 mr-1" />
                          {activity.goal_progress_percentage}%
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-900 mb-3">{activity.description}</p>
                    
                    {/* Render activity data based on type */}
                    {activity.activity_data?.type === "link" && activity.activity_data.content && (
                      <div className="mt-2">
                        {(() => {
                          const embedInfo = getEmbedInfo(activity.activity_data.content as string)
                          if (!embedInfo) return null
                          
                          return (
                            <div className={`border rounded-lg ${embedInfo.color}`}>
                              <div className="flex items-center gap-3 p-3">
                                {/* Thumbnail/Icon Section */}
                                <div className="flex-shrink-0">
                                  {embedInfo.platform === 'YouTube' && embedInfo.thumbnailUrl ? (
                                    <div className="w-24 h-18 bg-black rounded overflow-hidden">
                                      <img 
                                        src={embedInfo.thumbnailUrl}
                                        alt="Video thumbnail"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none'
                                          e.currentTarget.parentElement!.innerHTML = '<div class="w-20 h-12 bg-gray-800 rounded flex items-center justify-center text-white text-lg">🎥</div>'
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-12 h-12 bg-white rounded-lg border flex items-center justify-center text-xl">
                                      {embedInfo.icon}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Content Section */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-gray-900">{embedInfo.platform}</span>
                                    <Badge variant="outline" className="text-xs h-5">Link</Badge>
                                  </div>
                                  <p className="text-xs text-gray-600 truncate mb-2">
                                    {activity.activity_data.content as string}
                                  </p>
                                  <a
                                    href={activity.activity_data.content as string}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                                  >
                                    Open ↗
                                  </a>
                                </div>
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    )}
                    
                    {activity.activity_data?.type === "multiple" && (
                      <div className="mt-2">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                          {/* <div className="flex items-center gap-2 mb-2">
                            <div className="text-sm">📊</div>
                            <span className="text-xs font-medium text-gray-900">Progress Details</span>
                            <Badge variant="outline" className="text-xs h-5">Multiple</Badge>
                          </div> */}
                          
                          <div className="grid grid-cols-1 gap-2">
                            {(activity.activity_data.content as ActivityProgress[]).map((progress, index) => (
                              <div key={index} className="bg-white rounded-md p-2 border border-blue-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">
                                    {index === 0 && '🎯'}
                                    {index === 1 && '💪'}
                                    {index === 2 && '🔥'}
                                    {index >= 3 && '⭐'}
                                  </span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {progress.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-sm font-bold text-blue-600">
                                    {progress.value}
                                  </span>
                                  <span className="text-xs text-gray-500 uppercase">
                                    {progress.unit}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* <div className="mt-2 pt-2 border-t border-blue-200 flex justify-between items-center">
                            <span className="text-xs text-gray-600">Total exercises</span>
                            <span className="text-xs font-medium text-gray-900">
                              {(activity.activity_data.content as ActivityProgress[]).length} items
                            </span>
                          </div> */}
                        </div>
                      </div>
                    )}
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
