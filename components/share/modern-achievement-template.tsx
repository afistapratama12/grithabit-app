"use client"

import { forwardRef } from "react"
import { GRADIENT_THEMES } from "@/lib/share-utils"
import type { ShareCardData, ShareTemplate } from "@/lib/share-utils"

interface ModernAchievementTemplateProps {
  data: ShareCardData
  template: ShareTemplate
  className?: string
}

export const ModernAchievementTemplate = forwardRef<HTMLDivElement, ModernAchievementTemplateProps>(
  ({ data, template, className = "" }, ref) => {
    const { achievement, user } = data
    const isStoryFormat = template.size === "instagram-story"
    
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
        {/* Geometric Background */}
        <div className="absolute inset-0">
          <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
            <defs>
              <linearGradient id="geometric-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="white" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            <polygon points="0,0 30,0 0,30" fill="url(#geometric-gradient)"/>
            <polygon points="70,0 100,0 100,30" fill="url(#geometric-gradient)"/>
            <polygon points="0,70 0,100 30,100" fill="url(#geometric-gradient)"/>
            <polygon points="70,100 100,100 100,70" fill="url(#geometric-gradient)"/>
            <circle cx="50" cy="50" r="25" fill="white" opacity="0.1"/>
          </svg>
        </div>

        {/* Content */}
        <div className={`relative z-10 h-full flex flex-col ${isStoryFormat ? 'justify-center px-16' : 'justify-center px-12'}`}>
          
          {/* Header with modern styling */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-8 py-3 rounded-full border border-white/30 mb-6">
              <span className="text-white font-bold text-lg tracking-wider">ACHIEVEMENT UNLOCKED</span>
            </div>
          </div>

          {/* Large Icon with glow effect */}
          <div className="text-center mb-12">
            <div className="inline-block p-8 bg-white/15 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl">
              <div className="text-9xl drop-shadow-2xl filter">
                {achievement?.icon || "🎯"}
              </div>
            </div>
          </div>

          {/* Achievement Name */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black text-white mb-4 drop-shadow-lg tracking-tight">
              {achievement?.name || "Achievement"}
            </h1>
            <div className="w-32 h-1 bg-white/60 mx-auto rounded-full"></div>
          </div>

          {/* Description */}
          <div className="text-center mb-10">
            <p className="text-xl text-white/90 leading-relaxed max-w-lg mx-auto font-medium">
              {achievement?.description || "You did something amazing!"}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
              <div className="text-3xl font-bold text-white">{user?.level || 1}</div>
              <div className="text-white/80 text-sm font-medium">LEVEL</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
              <div className="text-3xl font-bold text-white">{user?.totalXp || 0}</div>
              <div className="text-white/80 text-sm font-medium">XP</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
              <div className="text-3xl font-bold text-white">{user?.streak || 0}</div>
              <div className="text-white/80 text-sm font-medium">STREAK</div>
            </div>
          </div>

          {/* Rarity Badge */}
          {achievement?.rarity && (
            <div className="flex justify-center mb-6">
              <div className="bg-white/25 backdrop-blur-sm px-8 py-3 rounded-full border border-white/40">
                <span className="text-white font-bold uppercase tracking-widest text-sm">
                  {achievement.rarity} ✨
                </span>
              </div>
            </div>
          )}

          {/* Date */}
          <div className="text-center mb-6">
            <p className="text-white/70 text-sm font-medium">
              Earned • {achievement?.earnedDate || new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Branding */}
          <div className="absolute bottom-8 right-8">
            <div className="bg-white/25 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/40">
              <span className="text-white font-bold text-lg">Grithabit</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

ModernAchievementTemplate.displayName = "ModernAchievementTemplate"
