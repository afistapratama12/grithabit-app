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
import { LogOut, User } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-auth";
import { useDeviceRedirect } from "@/hooks/use-mobile";

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: user, error, isLoading } = useCurrentUser();
  
  // Client-side device detection and redirect
  useDeviceRedirect();
  
  // if (error || !user) {
  //   redirect("/auth")
  // }

  // const [user, setUser] = useState<any>(null)
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly">("weekly");
  // const [isAuthLoading, setIsAuthLoading] = useState(true)

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
    // isFetched: isContributionFetched,
    isFetching: isContributionFetching,
  } = useContribution(user?.id || "", timeRange);

  const {
    invalidateActivities,
    invalidateUserStats,
    invalidateUserAchievements,
    invalidateGoals,
  } = useInvalidateQueries();

  console.log("userid", user?.id);
  console.log("activities", activities);

  console.log("loading:", loadingContribution, isContributionFetching)


  const handleTimeRangeChange = (range: "weekly" | "monthly") => {
    setTimeRange(range);
    // React Query will automatically refetch contribution data when timeRange changes
  };

  // const handleRefreshData = () => {
  //   if (user?.id) {
  //     invalidateQueries.invalidateAll(user.id)
  //   }
  // }

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Grithabit</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-700">
                <User className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">{user?.email}</span>
              </div>
              {/* <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshData}
                disabled={activitiesQuery.isRefetching || goalsQuery.isRefetching || contributionQuery.isRefetching}
              >
                Refresh
              </Button> */}
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ContributionChart
              data={contribution || []}
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
              isLoading={loadingContribution || isContributionFetching}
            />
            <ActivityFeed
              activities={activities || []}
              goals={goals || []}
              onActivityAdded={() => {
                invalidateActivities(user?.id || "");
                invalidateUserStats(user?.id || "");
                invalidateUserAchievements(user?.id || "");
              }}
            />
          </div>
          <div className="space-y-8">
            <AchievementSystem userId={user?.id || ""} />
            <GoalTracker
              goals={goals || []}
              activities={activities || []}
              onGoalAdded={() => invalidateGoals(user?.id || "")}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
