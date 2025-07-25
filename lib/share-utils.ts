export interface ShareCardData {
  type: "achievement" | "progress" | "milestone"
  achievement?: {
    name: string
    description: string
    icon: string
    rarity: string
    earnedDate: string
  }
  user?: {
    name: string
    level: number
    totalXp: number
    streak: number
  }
  stats?: {
    totalActivities: number
    goalsCompleted: number
    currentStreak: number
    thisWeekActivities: number
  }
  branding?: {
    appName: string
    website: string
  }
}

export interface ShareTemplate {
  id: string
  name: string
  size: "instagram-post" | "instagram-story" | "twitter" | "facebook"
  dimensions: { width: number; height: number }
  aspectRatio: string
}

export const SHARE_TEMPLATES: ShareTemplate[] = [
  {
    id: "ig-post",
    name: "Instagram Post",
    size: "instagram-post",
    dimensions: { width: 1080, height: 1080 },
    aspectRatio: "1:1"
  },
  {
    id: "ig-story", 
    name: "Instagram Story",
    size: "instagram-story",
    dimensions: { width: 1080, height: 1920 },
    aspectRatio: "9:16"
  },
  {
    id: "twitter",
    name: "Twitter/X",
    size: "twitter", 
    dimensions: { width: 1200, height: 675 },
    aspectRatio: "16:9"
  }
]

export const ACHIEVEMENT_TEMPLATE_STYLES = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean geometric design with glass effects",
    preview: "bg-gradient-to-r from-slate-900 to-slate-700"
  },
  {
    id: "minimal", 
    name: "Minimal",
    description: "Simple white background with clean typography",
    preview: "bg-gradient-to-r from-gray-100 to-gray-200"
  },
  {
    id: "celebration",
    name: "Celebration", 
    description: "Festive design with confetti and animations",
    preview: "bg-gradient-to-r from-yellow-400 to-orange-500"
  },
  {
    id: "original",
    name: "Original",
    description: "Classic gradient design",
    preview: "bg-gradient-to-r from-blue-500 to-purple-600"
  }
]

export const GRADIENT_THEMES = {
  achievement: "from-yellow-400 via-orange-500 to-red-500",
  progress: "from-blue-400 via-purple-500 to-pink-500", 
  milestone: "from-green-400 via-teal-500 to-blue-500",
  common: "from-gray-400 via-gray-500 to-gray-600",
  rare: "from-blue-400 via-blue-500 to-blue-600",
  epic: "from-purple-400 via-purple-500 to-purple-600",
  legendary: "from-yellow-400 via-yellow-500 to-yellow-600"
}

// Platform-specific sharing
export const shareToPlatform = (platform: string, imageUrl: string, text: string) => {
  const encodedText = encodeURIComponent(text)
  const encodedUrl = encodeURIComponent(imageUrl)
  
  const urls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText} ${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
  }
  
  return urls[platform as keyof typeof urls] || ""
}

// Generate share text
export const generateShareText = (data: ShareCardData): string => {
  switch (data.type) {
    case "achievement":
      return `🏆 Achievement Unlocked: ${data.achievement?.name}! 
      
${data.achievement?.description}

Level ${data.user?.level} • ${data.user?.totalXp} XP • ${data.user?.streak} day streak

Tracking my habits with #Grithabit 💪 #Achievement #HabitTracking`

    case "progress":
      return `📊 This week's progress recap! 

✅ ${data.stats?.thisWeekActivities} activities completed
🎯 ${data.stats?.goalsCompleted} goals achieved  
🔥 ${data.stats?.currentStreak} day streak

Level ${data.user?.level} and growing! 💪

#Grithabit #Progress #HabitTracking #Productivity`

    case "milestone":
      return `🎉 Milestone achieved! 

${data.stats?.currentStreak} day streak and counting! 🔥

${data.stats?.totalActivities} total activities logged
Level ${data.user?.level} • ${data.user?.totalXp} XP

Consistency is key! 💪

#Grithabit #Milestone #HabitTracking #Consistency`

    default:
      return "Tracking my progress with Grithabit! 💪 #HabitTracking"
  }
}
