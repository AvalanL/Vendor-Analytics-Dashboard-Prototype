import type React from "react"
import { BarChart3, FileText, Plus, ThumbsUp, TrendingUp, LayoutGrid, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function KaratSidebar() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <TooltipProvider>
      <Sidebar
        collapsible="icon"
        className="border-none bg-white border-r border-[#e8e8e8]"
        style={
          {
            "--sidebar-width": "240px",
            "--sidebar-width-icon": "64px",
          } as React.CSSProperties
        }
      >
        <SidebarHeader className={cn("flex flex-col", isCollapsed ? "items-center px-0 py-6" : "px-6 pt-6 pb-2")}>
          {!isCollapsed ? (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-[#1A1C1C]" style={{fontFamily: 'Satoshi, sans-serif'}}>karat</span>
                <span className="text-3xl text-[#5751F9]">^</span>
              </div>
              <SidebarTrigger className="text-[#1A1C1C] hover:bg-gray-50" />
            </div>
          ) : (
            <div className="mb-6 flex flex-col items-center">
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold text-[#1A1C1C]" style={{fontFamily: 'Satoshi, sans-serif'}}>k</span>
                <span className="text-3xl text-[#5751F9]">^</span>
              </div>
              <SidebarTrigger className="mt-4 text-[#1A1C1C] hover:bg-gray-50" />
            </div>
          )}

          {!isCollapsed ? (
            <Button className="mt-6 w-full bg-[#5751F9] text-white hover:bg-[#4A45E8]" style={{fontFamily: '"Work Sans", sans-serif'}}>
              <Plus className="mr-2 h-5 w-5" />
              Invite Candidate
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="aspect-square h-10 w-10 bg-[#5751F9] p-0 text-white hover:bg-[#4A45E8]">
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Invite Candidate</TooltipContent>
            </Tooltip>
          )}
        </SidebarHeader>

        <SidebarContent className={cn("py-4", isCollapsed ? "px-0" : "px-6")}>
          <SidebarMenu>
            <MenuItem
              icon={<LayoutGrid className="h-5 w-5" />}
              label="Active Funnel"
              isCollapsed={isCollapsed}
              isActive={true}
            />

            <MenuItem icon={<TrendingUp className="h-5 w-5" />} label="Analytics" isCollapsed={isCollapsed} />

            <MenuItem icon={<ThumbsUp className="h-5 w-5" />} label="Review Hub" isCollapsed={isCollapsed} />

            <MenuItem icon={<BarChart3 className="h-5 w-5" />} label="Interviews" isCollapsed={isCollapsed} />

            <MenuItem icon={<FileText className="h-5 w-5" />} label="Roles" isCollapsed={isCollapsed} />

            <MenuItem icon={<Settings className="h-5 w-5" />} label="Settings" isCollapsed={isCollapsed} />
          </SidebarMenu>
        </SidebarContent>

        {!isCollapsed && (
          <SidebarFooter className="px-6 pb-6">
            <div className="rounded-md border border-gray-200 p-4">
              <p className="mb-4 text-[#1A1C1C]" style={{fontFamily: '"Work Sans", sans-serif'}}>We'd love your feedback on Karat Portal!</p>
              <Button variant="outline" className="w-full border-gray-300 text-[#1A1C1C] hover:bg-gray-50" style={{fontFamily: '"Work Sans", sans-serif'}}>
                Let us know
              </Button>
            </div>
          </SidebarFooter>
        )}
        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  )
}

// Helper component for menu items
function MenuItem({
  icon,
  label,
  isCollapsed,
  isActive = false,
}: {
  icon: React.ReactNode
  label: string
  isCollapsed: boolean
  isActive?: boolean
}) {
  return (
    <SidebarMenuItem>
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarMenuButton
            className={cn(
              "text-[#1A1C1C] hover:bg-gray-50",
              isCollapsed ? "flex h-10 w-10 justify-center p-0 mx-auto" : "w-full",
              isActive && "bg-[#5751F9]/10 text-[#5751F9]",
            )}
          >
            <span className={cn("flex items-center", isCollapsed ? "justify-center" : "")}>
              {icon}
              {!isCollapsed && <span className="ml-3" style={{fontFamily: '"Work Sans", sans-serif'}}>{label}</span>}
            </span>
          </SidebarMenuButton>
        </TooltipTrigger>
        {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </SidebarMenuItem>
  )
}
