"use client"

import { cn } from "@/lib/utils"

interface TabNavigationProps {
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
  variant?: "large" | "default"
}

export function TabNavigation({ tabs, activeTab, onTabChange, variant = "default" }: TabNavigationProps) {
  // Tab text style with exact specifications
  const tabTextStyle = {
    color: "#1A1C1C",
    fontFamily: '"Work Sans", sans-serif',
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "144%",
  }

  return (
    <div className={cn("border-b border-gray-200", variant === "large" ? "mb-6" : "mb-0")}>
      <div className={cn("flex", variant === "large" ? "space-x-12" : "space-x-8")}>
        {tabs.map((tab) => (
          <button
            key={tab}
            style={tabTextStyle}
            className={cn("relative pb-4", activeTab === tab ? "" : "text-gray-500 hover:text-gray-700")}
            onClick={() => onTabChange(tab)}
          >
            {tab}
            {activeTab === tab && (
              <div
                className={cn("absolute bottom-0 left-0 bg-[#5751F9]", variant === "large" ? "h-1" : "h-0.5", "w-full")}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
