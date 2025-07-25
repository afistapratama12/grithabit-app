"use client";

import { useState, useEffect, useMemo } from "react";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser, signOut } from "@/lib/auth";
import {
  useActivities,
  useGoals,
  useContribution,
  useInvalidateQueries,
} from "@/hooks/use-dashboard-data";
import ContributionChart from "@/components/contribution-chart";
import ActivityFeed from "@/components/activity-feed";
import GoalTracker from "@/components/goal-tracker";
import AchievementSystem from "@/components/achievement-system";
import { LogOut, User, Menu, Home, Target, Trophy, Activity, Plus } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-auth";
import { useDeviceRedirect } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type TabType = "home" | "activities" | "goals" | "achievements";

export default function MobileAppPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: user, error, isLoading } = useCurrentUser();
  
  // Client-side device detection and redirect
  useDeviceRedirect();
  
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly">("weekly");
  const [showMenu, setShowMenu] = useState(false);

  // React Query hooks
  const {
    data: activities,
    isLoading: activitiesLoading,
  } = useActivities(user?.id || "");

  const {
    data: goals,
    isLoading: goalsLoading,
  } = useGoals(user?.id || "");

  const {
    data: contribution,
    isLoading: loadingContribution,
    isFetching: isContributionFetching,
  } = useContribution(user?.id || "", timeRange);

  const {
    invalidateActivities,
    invalidateUserStats,
    invalidateUserAchievements,
    invalidateGoals,
  } = useInvalidateQueries();

  const handleTimeRangeChange = (range: "weekly" | "monthly") => {
    setTimeRange(range);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const isAuthLoading = useMemo(() => {
    return (
      isLoading || activitiesLoading || goalsLoading || loadingContribution
    );
  }, [isLoading, activitiesLoading, goalsLoading, loadingContribution]);

  // Show loading while checking authentication
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "activities", label: "Activities", icon: Activity },
    { id: "goals", label: "Goals", icon: Target },
    { id: "achievements", label: "Achievements", icon: Trophy },
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-4">
            <ContributionChart
              data={contribution || []}
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
              isLoading={loadingContribution || isContributionFetching}
            />
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Activity className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">{activities?.length || 0}</div>
                    <div className="text-sm text-gray-600">Activities</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Target className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-1">{goals?.length || 0}</div>
                    <div className="text-sm text-gray-600">Goals</div>
                  </div>
                </div>
              </div>
              <ActivityFeed
                activities={activities?.slice(0, 3) || []}
                goals={goals || []}
                onActivityAdded={() => {
                  invalidateActivities(user?.id || "");
                  invalidateUserStats(user?.id || "");
                  invalidateUserAchievements(user?.id || "");
                }}
              />
            </div>
          </div>
        );
      case "activities":
        return (
          <ActivityFeed
            activities={activities || []}
            goals={goals || []}
            onActivityAdded={() => {
              invalidateActivities(user?.id || "");
              invalidateUserStats(user?.id || "");
              invalidateUserAchievements(user?.id || "");
            }}
          />
        );
      case "goals":
        return (
          <GoalTracker
            goals={goals || []}
            activities={activities || []}
            onGoalAdded={() => invalidateGoals(user?.id || "")}
          />
        );
      case "achievements":
        return <AchievementSystem userId={user?.id || ""} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col mobile-app-container no-bounce">
      {/* Header with iOS-like styling */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Grithabit</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Dropdown Menu with iOS-like styling */}
        {showMenu && (
          <div className="absolute top-full right-4 w-64 bg-white shadow-xl border rounded-2xl z-50 overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center text-gray-700">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{user?.email}</div>
                  <div className="text-xs text-gray-500">Account</div>
                </div>
              </div>
            </div>
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 mobile-content-spacing">
          {renderTabContent()}
        </div>
      </main>

      {/* Bottom Navigation with iOS-like styling */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 z-50 mobile-bottom-nav">
        <div className="grid grid-cols-4 px-2 pt-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowMenu(false);
                }}
                className={cn(
                  "flex flex-col items-center justify-center py-3 px-1 min-h-[70px] transition-all duration-200 rounded-xl mx-1",
                  isActive
                    ? "text-blue-600 bg-blue-50 scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:scale-95"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 mb-1 transition-all duration-200", 
                  isActive && "scale-105"
                )} />
                <span className={cn(
                  "text-xs font-medium transition-all duration-200",
                  isActive ? "font-semibold" : "font-normal"
                )}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
