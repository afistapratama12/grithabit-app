"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useUserStats, useUserAchievements } from "@/hooks/use-dashboard-data"
import { ACHIEVEMENTS, RARITY_COLORS, calculateLevel, getXpForNextLevel } from "@/lib/achievements"
import ShareCardDialog from "@/components/share/share-card-dialog"
import type { ShareCardData } from "@/lib/share-utils"
import { Trophy, Share2, Star, Zap, Target } from "lucide-react"
import type { UserAchievement } from "@/lib/types"

interface AchievementSystemProps {
  userId: string
}

export default function AchievementSystem({ userId }: AchievementSystemProps) {
  const [showAllAchievements, setShowAllAchievements] = useState(false)
  const [shareData, setShareData] = useState<ShareCardData | null>(null)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const userStatsQuery = useUserStats(userId)
  const userAchievementsQuery = useUserAchievements(userId)

  const userStats = userStatsQuery.data
  const userAchievements = userAchievementsQuery.data || []

  // Get earned achievement IDs
  const earnedAchievementIds = userAchievements.map(ua => ua.achievement_id)

  // Separate earned and not earned achievements
  const earnedAchievements = ACHIEVEMENTS.filter(a => earnedAchievementIds.includes(a.id))
  const notEarnedAchievements = ACHIEVEMENTS.filter(a => !earnedAchievementIds.includes(a.id))

  if (userStatsQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Progress & Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const level = userStats?.level || 1
  const totalXp = userStats?.total_xp || 0
  const xpForNext = getXpForNextLevel(totalXp)
  const currentLevelXp = totalXp - ((level - 1) * 100)

  const handleShareAchievement = (achievement: typeof ACHIEVEMENTS[0], userAchievement?: UserAchievement) => {
    const shareData: ShareCardData = {
      type: "achievement",
      achievement: {
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        rarity: achievement.rarity,
        earnedDate: userAchievement ? new Date(userAchievement.earned_at).toLocaleDateString() : new Date().toLocaleDateString()
      },
      user: {
        name: "User", // You can get this from user context
        level: level,
        totalXp: totalXp,
        streak: userStats?.current_streak || 0
      }
    }
    setShareData(shareData)
    setShowShareDialog(true)
  }

  const handleShareProgress = () => {
    const shareData: ShareCardData = {
      type: "progress",
      user: {
        name: "User",
        level: level,
        totalXp: totalXp,
        streak: userStats?.current_streak || 0
      },
      stats: {
        totalActivities: userStats?.total_activities || 0,
        goalsCompleted: userStats?.goals_completed || 0,
        currentStreak: userStats?.current_streak || 0,
        thisWeekActivities: 5 // You can calculate this from recent activities
      }
    }
    setShareData(shareData)
    setShowShareDialog(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Progress & Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level & XP Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{level}</span>
              </div>
              <div>
                <p className="font-semibold">Level {level}</p>
                <p className="text-sm text-gray-600">{totalXp} XP total</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{xpForNext} XP to next level</p>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentLevelXp / 100) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-600">Streak</span>
            </div>
            <p className="text-lg font-bold">{userStats?.current_streak || 0} days</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">Activities</span>
            </div>
            <p className="text-lg font-bold">{userStats?.total_activities || 0}</p>
          </div>
        </div>

        {/* Share Progress Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleShareProgress}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Progress
          </Button>
        </div>

        {/* Recent Achievements */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Recent Achievements</h3>
            <Dialog open={showAllAchievements} onOpenChange={setShowAllAchievements}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>All Achievements</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Earned Achievements */}
                  <div>
                    <h4 className="font-semibold mb-3 text-green-700">
                      Earned ({earnedAchievements.length}/{ACHIEVEMENTS.length})
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {earnedAchievements.map(achievement => {
                        const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id)
                        return (
                          <AchievementCard 
                            key={achievement.id} 
                            achievement={achievement} 
                            userAchievement={userAchievement}
                            isEarned={true}
                            onShare={() => handleShareAchievement(achievement, userAchievement)}
                          />
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Not Earned Achievements */}
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-600">
                      Not Yet Earned ({notEarnedAchievements.length})
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {notEarnedAchievements.map(achievement => (
                        <AchievementCard 
                          key={achievement.id} 
                          achievement={achievement} 
                          isEarned={false}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Show last 3 earned achievements */}
          <div className="space-y-2">
            {earnedAchievements.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <Star className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No achievements yet</p>
                <p className="text-xs">Complete activities to earn badges!</p>
              </div>
            ) : (
              earnedAchievements.slice(0, 3).map(achievement => {
                const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id)
                return (
                  <AchievementCard 
                    key={achievement.id} 
                    achievement={achievement} 
                    userAchievement={userAchievement}
                    isEarned={true}
                    compact={true}
                    onShare={() => handleShareAchievement(achievement, userAchievement)}
                  />
                )
              })
            )}
          </div>
        </div>
      </CardContent>

      {/* Share Dialog */}
      {shareData && (
        <ShareCardDialog
          isOpen={showShareDialog}
          onClose={() => {
            setShowShareDialog(false)
            setShareData(null)
          }}
          data={shareData}
        />
      )}
    </Card>
  )
}

interface AchievementCardProps {
  achievement: typeof ACHIEVEMENTS[0]
  userAchievement?: UserAchievement
  isEarned: boolean
  compact?: boolean
  onShare?: () => void
}

function AchievementCard({ achievement, userAchievement, isEarned, compact = false, onShare }: AchievementCardProps) {
  const earnedDate = userAchievement ? new Date(userAchievement.earned_at).toLocaleDateString() : null

  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-lg border ${isEarned ? 'bg-white' : 'bg-gray-50 opacity-60'}`}>
        <div className="text-2xl">{isEarned ? achievement.icon : '🔒'}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">{achievement.name}</p>
            <Badge variant="outline" className={`text-xs ${RARITY_COLORS[achievement.rarity]}`}>
              {achievement.rarity}
            </Badge>
          </div>
          <p className="text-xs text-gray-600 truncate">{achievement.description}</p>
        </div>
        {isEarned && onShare && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onShare}
            className="flex-shrink-0"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={`p-4 rounded-lg border ${isEarned ? 'bg-white' : 'bg-gray-50 opacity-60'}`}>
      <div className="flex items-start gap-3">
        <div className="text-3xl">{isEarned ? achievement.icon : '🔒'}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold">{achievement.name}</h4>
            <Badge variant="outline" className={RARITY_COLORS[achievement.rarity]}>
              {achievement.rarity}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {isEarned ? `Earned on ${earnedDate}` : `Reward: ${achievement.xp_reward} XP`}
            </span>
            {isEarned && onShare && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onShare}
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
