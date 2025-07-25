"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AchievementCardTemplate } from "./achievement-card-template"
import { ModernAchievementTemplate } from "./modern-achievement-template"
import { MinimalAchievementTemplate } from "./minimal-achievement-template"
import { CelebrationAchievementTemplate } from "./celebration-achievement-template"
import { ProgressCardTemplate } from "./progress-card-template"
import { SHARE_TEMPLATES, ACHIEVEMENT_TEMPLATE_STYLES, shareToPlatform, generateShareText } from "@/lib/share-utils"
import type { ShareCardData, ShareTemplate } from "@/lib/share-utils"
import { Download, Share2, Copy, Loader2 } from "lucide-react"
import html2canvas from "html2canvas"

interface ShareCardDialogProps {
  isOpen: boolean
  onClose: () => void
  data: ShareCardData
}

export default function ShareCardDialog({ isOpen, onClose, data }: ShareCardDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ShareTemplate>(SHARE_TEMPLATES[0])
  const [selectedStyle, setSelectedStyle] = useState(ACHIEVEMENT_TEMPLATE_STYLES[0])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const generateImage = async (): Promise<string | null> => {
    if (!cardRef.current) return null
    
    setIsGenerating(true)
    try {
      // Wait for fonts and images to load
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: false,
        width: selectedTemplate.dimensions.width,
        height: selectedTemplate.dimensions.height,
      })
      
      const imageUrl = canvas.toDataURL('image/png', 1.0)
      setGeneratedImageUrl(imageUrl)
      return imageUrl
    } catch (error) {
      console.error('Error generating image:', error)
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = async () => {
    const imageUrl = generatedImageUrl || await generateImage()
    if (!imageUrl) return

    try {
      const link = document.createElement('a')
      link.download = `grithabit-${data.type}-${Date.now()}.png`
      link.href = imageUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast({
        title: "Success",
        description: "Image downloaded successfully!",
      })
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to download image.",
        variant: "destructive",
      })
    }
  }

  const shareToSocial = async (platform: string) => {
    const imageUrl = generatedImageUrl || await generateImage()
    if (!imageUrl) return

    try {
      // Convert data URL to blob for sharing
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const file = new File([blob], `grithabit-${data.type}.png`, { type: 'image/png' })
      
      const shareText = generateShareText(data)
      
      // Check if Web Share API is supported and can share files
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Grithabit - ${data.type}`,
          text: shareText,
        })
        
        toast({
          title: "Success",
          description: "Shared successfully!",
        })
      } else {
        // Fallback to platform-specific URLs
        const shareUrl = shareToPlatform(platform, window.location.origin, shareText)
        if (shareUrl) {
          window.open(shareUrl, '_blank', 'noopener,noreferrer')
        } else {
          // Copy to clipboard as fallback
          await navigator.clipboard.writeText(shareText)
          toast({
            title: "Text Copied",
            description: "Share text copied to clipboard. Please download the image separately.",
          })
        }
      }
    } catch (error) {
      console.error('Error sharing:', error)
      toast({
        title: "Error",
        description: "Failed to share. Please try downloading instead.",
        variant: "destructive",
      })
    }
  }

  const copyShareText = async () => {
    try {
      const shareText = generateShareText(data)
      await navigator.clipboard.writeText(shareText)
      toast({
        title: "Copied!",
        description: "Share text copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text.",
        variant: "destructive",
      })
    }
  }

  const renderTemplate = () => {
    const commonProps = {
      data,
      template: selectedTemplate,
      className: "mx-auto shadow-2xl"
    }

    if (data.type === "progress") {
      return <ProgressCardTemplate ref={cardRef} {...commonProps} />
    }

    // Achievement templates
    switch (selectedStyle.id) {
      case "modern":
        return <ModernAchievementTemplate ref={cardRef} {...commonProps} />
      case "minimal":
        return <MinimalAchievementTemplate ref={cardRef} {...commonProps} />
      case "celebration":
        return <CelebrationAchievementTemplate ref={cardRef} {...commonProps} />
      case "original":
      default:
        return <AchievementCardTemplate ref={cardRef} {...commonProps} />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your {data.type === "achievement" ? "Achievement" : "Progress"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Template Format</label>
            <Select
              value={selectedTemplate.id}
              onValueChange={(value) => {
                const template = SHARE_TEMPLATES.find(t => t.id === value)
                if (template) {
                  setSelectedTemplate(template)
                  setGeneratedImageUrl(null) // Reset generated image
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SHARE_TEMPLATES.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} ({template.aspectRatio})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Template Style Selection - Only show for achievements */}
          {data.type === "achievement" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Template Style</label>
              <Select
                value={selectedStyle.id}
                onValueChange={(value) => {
                  const style = ACHIEVEMENT_TEMPLATE_STYLES.find(s => s.id === value)
                  if (style) {
                    setSelectedStyle(style)
                    setGeneratedImageUrl(null) // Reset generated image
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACHIEVEMENT_TEMPLATE_STYLES.map((style) => (
                    <SelectItem key={style.id} value={style.id}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${style.preview}`} />
                        <span>{style.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Preview */}
          <div className="space-y-4">
            <label className="text-sm font-medium">Preview</label>
            <div className="flex justify-center bg-gray-50 p-8 rounded-lg overflow-auto">
              <div style={{ 
                transform: `scale(${selectedTemplate.size === 'instagram-story' ? 0.3 : 0.5})`,
                transformOrigin: 'center center'
              }}>
                {renderTemplate()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={downloadImage}
                disabled={isGenerating}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Download Image
              </Button>
              
              <Button
                onClick={copyShareText}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Text
              </Button>
            </div>

            {/* Social Share Buttons */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Share to Platform</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => shareToSocial('twitter')}
                  disabled={isGenerating}
                >
                  🐦 Twitter
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => shareToSocial('facebook')}
                  disabled={isGenerating}
                >
                  📘 Facebook
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => shareToSocial('linkedin')}
                  disabled={isGenerating}
                >
                  💼 LinkedIn
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => shareToSocial('whatsapp')}
                  disabled={isGenerating}
                >
                  💬 WhatsApp
                </Button>
              </div>
            </div>

            {/* Share Text Preview */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Share Text Preview</label>
              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                <pre className="whitespace-pre-wrap font-sans text-gray-700">
                  {generateShareText(data)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
