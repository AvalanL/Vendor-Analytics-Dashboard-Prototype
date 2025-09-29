import type React from "react"
import { BarChart3, FileText, Plus, ThumbsUp, TrendingUp, LayoutGrid, Settings, Target, GraduationCap, Video, HelpCircle, ArrowLeft, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

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

interface KaratSidebarProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
}

export function KaratSidebar({ activeSection, onSectionChange }: KaratSidebarProps = {}) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const pathname = usePathname()
  const isTrainingPage = pathname === '/pts-training'
  const { logout } = useAuth()

  return (
    <TooltipProvider>
      <Sidebar
        collapsible="icon"
        className="bg-white border-r border-[#e8e8e8]"
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

          {!isTrainingPage && (
            !isCollapsed ? (
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
            )
          )}
        </SidebarHeader>

        <SidebarContent className={cn("py-4", isCollapsed ? "px-0" : "px-6")}>
          <SidebarMenu>
            {isTrainingPage ? (
              // Training page menu items
              <>
                {!isCollapsed && (
                  <div className="px-3 py-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Training Sections
                    </h3>
                  </div>
                )}
                
                <MenuItem 
                  icon={<Video className="h-5 w-5" />} 
                  label="Internal Demo Training" 
                  isCollapsed={isCollapsed}
                  isActive={activeSection === 'Internal Demo Training'}
                  onClick={() => onSectionChange?.('Internal Demo Training')}
                />

                <MenuItem
                  icon={<HelpCircle className="h-5 w-5" />}
                  label="Customer FAQ"
                  isCollapsed={isCollapsed}
                  isActive={activeSection === 'Customer FAQ'}
                  onClick={() => onSectionChange?.('Customer FAQ')}
                />
              </>
            ) : (
              // Regular dashboard menu items
              <>
                <MenuItem
                  icon={<LayoutGrid className="h-5 w-5" />}
                  label="Active Funnel"
                  isCollapsed={isCollapsed}
                  isActive={pathname === '/vendor-analytics'}
                  href="/vendor-analytics"
                />

                <MenuItem 
                  icon={<TrendingUp className="h-5 w-5" />} 
                  label="Analytics" 
                  isCollapsed={isCollapsed}
                  href="/vendor-analytics"
                />

                <MenuItem 
                  icon={<ThumbsUp className="h-5 w-5" />} 
                  label="Review Hub" 
                  isCollapsed={isCollapsed}
                  href="/review-hub"
                />

                <MenuItem 
                  icon={<BarChart3 className="h-5 w-5" />} 
                  label="Interviews" 
                  isCollapsed={isCollapsed}
                  href="/interviews"
                />

                <MenuItem 
                  icon={<FileText className="h-5 w-5" />} 
                  label="Roles" 
                  isCollapsed={isCollapsed}
                  href="/roles"
                />

                <MenuItem 
                  icon={<Target className="h-5 w-5" />} 
                  label="Sourcing Insights" 
                  isCollapsed={isCollapsed}
                  href="/sourcing-insights"
                />

                <MenuItem 
                  icon={<GraduationCap className="h-5 w-5" />} 
                  label="PTS Internal Training" 
                  isCollapsed={isCollapsed}
                  href="/pts-training"
                />

                <MenuItem 
                  icon={<Settings className="h-5 w-5" />} 
                  label="Settings" 
                  isCollapsed={isCollapsed}
                  href="/settings"
                />

                <MenuItem 
                  icon={<LogOut className="h-5 w-5" />} 
                  label="Logout" 
                  isCollapsed={isCollapsed}
                  onClick={() => {
                    logout()
                    window.location.reload()
                  }}
                />
              </>
            )}
          </SidebarMenu>
        </SidebarContent>

        {!isCollapsed && !isTrainingPage && (
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
  href,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  isCollapsed: boolean
  isActive?: boolean
  href?: string
  onClick?: () => void
}) {
  const content = (
    <SidebarMenuButton
      className={cn(
        "text-[#1A1C1C] hover:bg-gray-50",
        isCollapsed ? "flex h-10 w-10 justify-center p-0 mx-auto" : "w-full",
        isActive && "bg-[#5751F9]/10 text-[#5751F9]",
      )}
      onClick={onClick}
    >
      <span className={cn("flex items-center", isCollapsed ? "justify-center" : "")}>
        {icon}
        {!isCollapsed && <span className="ml-3" style={{fontFamily: '"Work Sans", sans-serif'}}>{label}</span>}
      </span>
    </SidebarMenuButton>
  )

  return (
    <SidebarMenuItem>
      <Tooltip>
        <TooltipTrigger asChild>
          {href ? (
            <Link href={href}>
              {content}
            </Link>
          ) : (
            content
          )}
        </TooltipTrigger>
        {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </SidebarMenuItem>
  )
}
