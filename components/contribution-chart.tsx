"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Calendar, CalendarDays } from "lucide-react"
import type { ContributionData } from "@/lib/types"
import { useContribution } from "@/hooks/use-dashboard-data"
import { cn } from "@/lib/utils"

interface ContributionChartProps {
  data: ContributionData[]
  timeRange: "weekly" | "monthly"
  onTimeRangeChange: (range: "weekly" | "monthly") => void
  isLoading?: boolean
}

export default function ContributionChart({ data, timeRange, onTimeRangeChange, isLoading = false }: ContributionChartProps) {
  const getIntensityClass = (count: number, dateStr: string) => {
    const baseClass = (() => {
      if (count === 0) return "bg-gray-100 text-gray-600"
      if (count <= 2) return "bg-green-200 text-gray-700"
      if (count <= 4) return "bg-green-400 text-white"
      if (count <= 6) return "bg-green-600 text-white"
      return "bg-green-800 text-white"
    })()
    
    // Add border highlight for today
    const todayClass = isToday(dateStr) ? " ring-2 ring-blue-500 ring-offset-1" : ""
    
    // Add transparency for future dates
    const futureClass = isFuture(dateStr) ? " opacity-40" : ""
    
    return baseClass + todayClass + futureClass
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const formatDateNumber = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.getDate()
  }

  const isToday = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isFuture = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    today.setHours(23, 59, 59, 999) // Set to end of today
    return date > today
  }

  const getWeekData = () => {
    if (timeRange !== "weekly") return data
    
    // Get current week starting from Monday
    const today = new Date()
    const currentDay = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay // If Sunday, go back 6 days
    
    const monday = new Date(today)
    monday.setDate(today.getDate() + mondayOffset)
    monday.setHours(0, 0, 0, 0)
    
    // Generate week data (Monday to Sunday)
    const weekData = []
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(monday)
      currentDate.setDate(monday.getDate() + i)
      const dateStr = currentDate.toISOString().split('T')[0]
      // Format date using local timezone (UTC+7) instead of UTC
      // const year = currentDate.getFullYear()
      // const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      // const day = String(currentDate.getDate()).padStart(2, '0')
      // const dateStr = `${year}-${month}-${day}`
      
      // Find existing data for this date or create empty entry
      const existingData = data.find(item => item.date === dateStr)
      weekData.push({
        date: dateStr,
        count: existingData ? existingData.count : 0
      })
    }
    
    return weekData
  }

  const getMonthlyCalendarData = () => {
    if (timeRange !== "monthly") return data
    
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    
    // Get first day of current month (July 1, 2025 = Tuesday)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    
    // Get the day of week for first day (0 = Sunday, 1 = Monday, 2 = Tuesday, etc.)
    const firstDayWeekday = firstDayOfMonth.getDay() // For July 1, 2025 this is 2 (Tuesday)
    
    // Start from the Sunday before the first day of the month
    // If first day is Tuesday (2), we need to go back 2 days to reach Sunday
    const calendarStart = new Date(currentYear, currentMonth, 1 - firstDayWeekday)
    
    // Generate 28 days (4 weeks x 7 days)
    const calendarData = []
    for (let i = 0; i < 28; i++) {
      const currentDate = new Date(calendarStart)
      currentDate.setDate(calendarStart.getDate() + i)
      
      // Format date using local timezone (UTC+7) instead of UTC
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const day = String(currentDate.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`
      
      // Find existing data for this date or create empty entry
      const existingData = data.find(item => item.date === dateStr)
      calendarData.push({
        date: dateStr,
        count: existingData ? existingData.count : 0,
        isCurrentMonth: currentDate.getMonth() === currentMonth
      })
    }
    
    return calendarData
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg md:text-xl">Activity Contribution</CardTitle>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onTimeRangeChange("weekly")}
            disabled={isLoading}
            className={cn(
              "flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
              timeRange === "weekly"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden md:inline">Week</span>
          </button>
          <button
            onClick={() => onTimeRangeChange("monthly")}
            disabled={isLoading}
            className={cn(
              "flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
              timeRange === "monthly"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            <CalendarDays className="h-4 w-4" />
            <span className="hidden md:inline">Month</span>
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading {timeRange} data...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {timeRange === "weekly" ? (
              // Weekly view: Responsive boxes
              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {getWeekData().map((item, index) => (
                  <div key={index} className="group relative">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${getIntensityClass(item.count, item.date)} transition-all hover:scale-105 flex flex-col items-center justify-center font-medium shadow-sm`}
                      title={`${formatDate(item.date)}: ${item.count} activities`}
                    >
                      <span className="text-xs">
                        {formatDate(item.date).split(' ')[0]}
                      </span>
                      <span className="text-xs font-bold">
                        {formatDate(item.date).split(' ')[1]}
                      </span>
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {formatDate(item.date)}: {item.count} activities
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Monthly view: Calendar-like compact grid (4 weeks x 7 days)
              <div className="space-y-2">
                <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 text-center">
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>
                <div className="grid grid-cols-7 grid-rows-4 gap-1 md:gap-1.5">
                  {getMonthlyCalendarData().map((item, index) => (
                    <div key={index} className="group relative">
                      <div
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-md ${getIntensityClass(item.count, item.date)} transition-all hover:scale-105 flex items-center justify-center text-xs font-medium ${
                          !(item as any).isCurrentMonth ? 'opacity-30' : ''
                        }`}
                        title={`${formatDate(item.date)}: ${item.count} activities`}
                      >
                        {formatDateNumber(item.date)}
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {formatDate(item.date)}: {item.count} activities
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
                <div className="w-3 h-3 rounded-sm bg-green-200"></div>
                <div className="w-3 h-3 rounded-sm bg-green-400"></div>
                <div className="w-3 h-3 rounded-sm bg-green-600"></div>
                <div className="w-3 h-3 rounded-sm bg-green-800"></div>
              </div>
              <span>More</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
