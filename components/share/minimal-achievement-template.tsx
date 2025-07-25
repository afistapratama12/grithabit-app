"use client"

import { forwardRef } from "react"
import { GRADIENT_THEMES } from "@/lib/share-utils"
import type { ShareCardData, ShareTemplate } from "@/lib/share-utils"

interface MinimalAchievementTemplateProps {
  data: ShareCardData
  template: ShareTemplate
  className?: string
}

export const MinimalAchievementTemplate = forwardRef<HTMLDivElement, MinimalAchievementTemplateProps>(
  ({ data, template, className = "" }, ref) => {
    const { achievement, user } = data
    const isStoryFormat = template.size === "instagram-story"

    return (
      <div
        ref={ref}
        className={`relative overflow-hidden bg-white ${className}`}
        style={{
          width: template.dimensions.width,
          height: template.dimensions.height,
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern id="minimal-dots" patternUnits="userSpaceOnUse" width="10" height="10">
                <circle cx="5" cy="5" r="1" fill="#000"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#minimal-dots)"/>
          </svg>
        </div>

        {/* Content */}
        <div className={`relative z-10 h-full flex flex-col ${isStoryFormat ? 'justify-center px-16' : 'justify-center px-12'}`}>
          
          {/* Simple header */}
          <div className="text-center mb-16">
            <div className="text-gray-600 font-semibold text-lg tracking-wide mb-2">
              ACHIEVEMENT
            </div>
            <div className="w-16 h-0.5 bg-gray-300 mx-auto"></div>
          </div>

          {/* Large clean icon */}
          <div className="text-center mb-16">
            <div className="text-8xl mb-6">
              {achievement?.icon || "🎯"}
            </div>
          </div>

          {/* Achievement info */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {achievement?.name || "Achievement"}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
              {achievement?.description || "You did something amazing!"}
            </p>
          </div>

          {/* Clean stats */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 mb-12">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{user?.level || 1}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{user?.totalXp || 0}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">XP</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{user?.streak || 0}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Streak</div>
              </div>
            </div>
          </div>

          {/* Rarity */}
          {achievement?.rarity && (
            <div className="text-center mb-8">
              <span className="inline-block bg-gray-100 text-gray-700 px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
                {achievement.rarity}
              </span>
            </div>
          )}

          {/* Date */}
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm">
              {achievement?.earnedDate || new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Clean branding */}
          <div className="absolute bottom-8 right-8">
            <div className="text-gray-400 font-semibold text-sm">
              Grithabit
            </div>
          </div>

          {/* Accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        </div>
      </div>
    )
  }
)

MinimalAchievementTemplate.displayName = "MinimalAchievementTemplate"
