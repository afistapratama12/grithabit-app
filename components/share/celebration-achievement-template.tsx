"use client"

import { forwardRef } from "react"
import { GRADIENT_THEMES } from "@/lib/share-utils"
import type { ShareCardData, ShareTemplate } from "@/lib/share-utils"

interface CelebrationAchievementTemplateProps {
  data: ShareCardData
  template: ShareTemplate
  className?: string
}

export const CelebrationAchievementTemplate = forwardRef<HTMLDivElement, CelebrationAchievementTemplateProps>(
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
        {/* Confetti and celebration elements */}
        <div className="absolute inset-0">
          {/* Confetti */}
          <div className="absolute top-10 left-10 text-yellow-300 text-4xl animate-bounce">🎉</div>
          <div className="absolute top-16 right-20 text-pink-300 text-3xl animate-pulse">✨</div>
          <div className="absolute top-32 left-32 text-blue-300 text-2xl animate-bounce">🎊</div>
          <div className="absolute top-20 right-10 text-purple-300 text-3xl animate-pulse">⭐</div>
          <div className="absolute bottom-32 left-16 text-green-300 text-3xl animate-bounce">🌟</div>
          <div className="absolute bottom-20 right-32 text-orange-300 text-2xl animate-pulse">💫</div>
          <div className="absolute bottom-40 left-40 text-red-300 text-4xl animate-bounce">🎈</div>
          <div className="absolute bottom-16 right-16 text-indigo-300 text-3xl animate-pulse">🎆</div>
          
          {/* More confetti for story format */}
          {isStoryFormat && (
            <>
              <div className="absolute top-80 left-20 text-yellow-300 text-3xl animate-bounce">🎉</div>
              <div className="absolute top-96 right-24 text-pink-300 text-2xl animate-pulse">✨</div>
              <div className="absolute bottom-80 left-24 text-blue-300 text-3xl animate-bounce">🎊</div>
              <div className="absolute bottom-96 right-20 text-purple-300 text-2xl animate-pulse">⭐</div>
            </>
          )}
        </div>

        {/* Radial burst pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="burst-gradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="white" stopOpacity="0.4"/>
                <stop offset="50%" stopColor="white" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="white" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#burst-gradient)"/>
            {/* Burst lines */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30) * Math.PI / 180
              const x1 = 50 + Math.cos(angle) * 20
              const y1 = 50 + Math.sin(angle) * 20
              const x2 = 50 + Math.cos(angle) * 35
              const y2 = 50 + Math.sin(angle) * 35
              return (
                <line 
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2} 
                  stroke="white" 
                  strokeWidth="0.5" 
                  opacity="0.6"
                />
              )
            })}
          </svg>
        </div>

        {/* Content */}
        <div className={`relative z-10 h-full flex flex-col ${isStoryFormat ? 'justify-center px-16' : 'justify-center px-12'}`}>
          
          {/* Celebration header */}
          <div className="text-center mb-8">
            <div className="text-white text-2xl font-bold mb-4 animate-pulse">
              🏆 WOOHOO! 🏆
            </div>
            <div className="text-white/90 font-bold text-xl tracking-wider">
              ACHIEVEMENT UNLOCKED!
            </div>
          </div>

          {/* Pulsing icon */}
          <div className="text-center mb-10">
            <div className="inline-block animate-pulse">
              <div className="text-9xl drop-shadow-2xl">
                {achievement?.icon || "🎯"}
              </div>
            </div>
          </div>

          {/* Achievement name with celebration */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white mb-4 drop-shadow-lg">
              {achievement?.name || "Achievement"}
            </h1>
            <div className="flex justify-center items-center gap-2 mb-4">
              <span className="text-yellow-300 text-2xl">🌟</span>
              <div className="h-0.5 bg-white/60 flex-1 max-w-xs"></div>
              <span className="text-yellow-300 text-2xl">🌟</span>
            </div>
            <p className="text-lg text-white/90 leading-relaxed max-w-md mx-auto">
              {achievement?.description || "You did something amazing!"}
            </p>
          </div>

          {/* Celebratory stats */}
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/30 mb-8 shadow-2xl">
            <div className="grid grid-cols-3 gap-4 text-center text-white">
              <div className="animate-bounce" style={{ animationDelay: '0s' }}>
                <div className="text-3xl font-bold">{user?.level || 1}</div>
                <div className="text-sm opacity-80">LEVEL</div>
              </div>
              <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>
                <div className="text-3xl font-bold">{user?.totalXp || 0}</div>
                <div className="text-sm opacity-80">XP</div>
              </div>
              <div className="animate-bounce" style={{ animationDelay: '0.4s' }}>
                <div className="text-3xl font-bold">{user?.streak || 0}</div>
                <div className="text-sm opacity-80">STREAK</div>
              </div>
            </div>
          </div>

          {/* Rarity with celebration */}
          {achievement?.rarity && (
            <div className="text-center mb-6">
              <div className="inline-flex items-center bg-white/25 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/40 animate-pulse">
                <span className="text-white font-bold uppercase tracking-widest text-sm">
                  ⭐ {achievement.rarity} ACHIEVEMENT ⭐
                </span>
              </div>
            </div>
          )}

          {/* Date */}
          <div className="text-center mb-6">
            <p className="text-white/80 text-sm font-medium">
              🎊 Achieved on {achievement?.earnedDate || new Date().toLocaleDateString()} 🎊
            </p>
          </div>

          {/* Branding with celebration */}
          <div className="absolute bottom-8 right-8">
            <div className="bg-white/25 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/40">
              <span className="text-white font-bold text-lg">🎉 Grithabit</span>
            </div>
          </div>
        </div>

        {/* Animated overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full animate-ping"></div>
        </div>
      </div>
    )
  }
)

CelebrationAchievementTemplate.displayName = "CelebrationAchievementTemplate"
