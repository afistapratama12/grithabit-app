"use client"

import { forwardRef } from "react"
import { GRADIENT_THEMES } from "@/lib/share-utils"
import type { ShareCardData, ShareTemplate } from "@/lib/share-utils"

interface ProgressCardTemplateProps {
  data: ShareCardData
  template: ShareTemplate
  className?: string
}

export const ProgressCardTemplate = forwardRef<HTMLDivElement, ProgressCardTemplateProps>(
  ({ data, template, className = "" }, ref) => {
    const { user, stats } = data
    const isStoryFormat = template.size === "instagram-story"

    return (
      <div
        ref={ref}
        className={`relative overflow-hidden bg-gradient-to-br ${GRADIENT_THEMES.progress} ${className}`}
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
              <pattern id="progress-pattern" patternUnits="userSpaceOnUse" width="15" height="15">
                <rect x="0" y="0" width="2" height="15" fill="white" opacity="0.2"/>
                <rect x="0" y="0" width="15" height="2" fill="white" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#progress-pattern)"/>
          </svg>
        </div>

        {/* Content Container */}
        <div className={`relative z-10 h-full flex flex-col ${isStoryFormat ? 'justify-center px-16' : 'justify-center px-12'}`}>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-white/90 font-bold text-3xl mb-2">
              📊 PROGRESS RECAP
            </div>
            <div className="text-white/70 text-lg">This Week's Achievements</div>
            <div className="w-24 h-1 bg-white/40 mx-auto rounded-full mt-4"></div>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-4xl mb-3">✅</div>
              <div className="text-3xl font-bold text-white mb-1">{stats?.thisWeekActivities || 0}</div>
              <div className="text-white/80 text-sm">Activities</div>
            </div>
            
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-3xl font-bold text-white mb-1">{stats?.goalsCompleted || 0}</div>
              <div className="text-white/80 text-sm">Goals</div>
            </div>
          </div>

          {/* Streak Highlight */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 text-center mb-8">
            <div className="text-5xl mb-3">🔥</div>
            <div className="text-4xl font-bold text-white mb-2">{stats?.currentStreak || 0}</div>
            <div className="text-white/90 text-lg">Day Streak</div>
          </div>

          {/* User Level Info */}
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xl font-bold">{user?.level || 1}</span>
                </div>
                <div>
                  <div className="font-semibold">Level {user?.level || 1}</div>
                  <div className="text-white/70 text-sm">{user?.totalXp || 0} XP</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl">📈</div>
                <div className="text-white/70 text-xs mt-1">Growing</div>
              </div>
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="text-center mt-8">
            <p className="text-white/80 text-lg italic">
              "Progress, not perfection"
            </p>
          </div>

          {/* Branding */}
          <div className="absolute bottom-6 right-6">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <span className="text-white font-semibold text-sm">Grithabit</span>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-6 left-6 text-white/20 text-4xl">💪</div>
          <div className="absolute top-6 right-6 text-white/20 text-4xl">⚡</div>
          <div className="absolute bottom-20 left-6 text-white/20 text-3xl">🌟</div>
        </div>
      </div>
    )
  }
)

ProgressCardTemplate.displayName = "ProgressCardTemplate"
