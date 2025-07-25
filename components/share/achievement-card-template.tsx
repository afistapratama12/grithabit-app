"use client"

import { forwardRef } from "react"
import { GRADIENT_THEMES } from "@/lib/share-utils"
import type { ShareCardData, ShareTemplate } from "@/lib/share-utils"

interface AchievementCardTemplateProps {
  data: ShareCardData
  template: ShareTemplate
  className?: string
}

export const AchievementCardTemplate = forwardRef<HTMLDivElement, AchievementCardTemplateProps>(
  ({ data, template, className = "" }, ref) => {
    const { achievement, user } = data
    const isStoryFormat = template.size === "instagram-story"
    
    // Get gradient based on rarity
    const gradient = achievement?.rarity 
      ? GRADIENT_THEMES[achievement.rarity as keyof typeof GRADIENT_THEMES]
      : GRADIENT_THEMES.achievement

    return (
      <div
        ref={ref}
        className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`}
        style={{
          width: template.dimensions.width,
          height: template.dimensions.height,
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern id="trophy-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
                <circle cx="10" cy="10" r="1" fill="white" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#trophy-pattern)"/>
          </svg>
        </div>

        {/* Content Container */}
        <div className={`relative z-10 h-full flex flex-col ${isStoryFormat ? 'justify-center px-16' : 'justify-center px-12'}`}>
          
          {/* Achievement Unlocked Header */}
          <div className="text-center mb-8">
            <div className="text-white/90 font-bold text-3xl mb-2">
              🏆 ACHIEVEMENT UNLOCKED!
            </div>
            <div className="w-24 h-1 bg-white/40 mx-auto rounded-full"></div>
          </div>

          {/* Achievement Icon */}
          <div className="text-center mb-8">
            <div className="text-8xl mb-4 drop-shadow-lg">
              {achievement?.icon || "🎯"}
            </div>
          </div>

          {/* Achievement Info */}
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
              {achievement?.name || "Achievement"}
            </h1>
            <p className="text-xl opacity-90 leading-relaxed max-w-md mx-auto">
              {achievement?.description || "You did something amazing!"}
            </p>
          </div>

          {/* Rarity Badge */}
          {achievement?.rarity && (
            <div className="flex justify-center mb-8">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30">
                <span className="text-white font-semibold uppercase tracking-wider text-sm">
                  {achievement.rarity} Achievement
                </span>
              </div>
            </div>
          )}

          {/* User Stats */}
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="grid grid-cols-3 gap-4 text-center text-white">
              <div>
                <div className="text-2xl font-bold">{user?.level || 1}</div>
                <div className="text-sm opacity-80">Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{user?.totalXp || 0}</div>
                <div className="text-sm opacity-80">XP</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{user?.streak || 0}</div>
                <div className="text-sm opacity-80">Streak</div>
              </div>
            </div>
          </div>

          {/* Earned Date */}
          <div className="text-center mt-6">
            <p className="text-white/70 text-sm">
              Earned on {achievement?.earnedDate || new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Branding */}
          <div className="absolute bottom-6 right-6">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <span className="text-white font-semibold text-sm">Grithabit</span>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-6 left-6 text-white/20 text-4xl">✨</div>
          <div className="absolute top-6 right-6 text-white/20 text-4xl">⭐</div>
          <div className="absolute bottom-20 left-6 text-white/20 text-3xl">🎉</div>
        </div>
      </div>
    )
  }
)

AchievementCardTemplate.displayName = "AchievementCardTemplate"
