"use client"

import { useState } from "react"
import { KaratSidebar } from "@/components/karat-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DeepAnalyticsHeader } from "@/components/vendor-analytics/deep-analytics-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CostEfficiencyDashboard } from "@/components/vendor-analytics/cost-efficiency-dashboard"
import { GeographicDashboard } from "@/components/vendor-analytics/geographic-dashboard"
import { RateCardComparison } from "@/components/vendor-analytics/rate-card-comparison"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function VendorInsights() {
  const [selectedPeriod, setSelectedPeriod] = useState("90days")
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["All Regions"])
  const [activeTab, setActiveTab] = useState("cost-efficiency")

  const periods = [
    { value: "30days", label: "Last 30 days" },
    { value: "90days", label: "Last 90 days" },
    { value: "6months", label: "Last 6 months" },
    { value: "12months", label: "Last 12 months" }
  ]

  const regions = ["All Regions", "North America", "Europe", "Asia Pacific", "Latin America"]

  const addRegion = (region: string) => {
    if (!selectedRegions.includes(region) && region !== "All Regions") {
      setSelectedRegions(selectedRegions.filter(r => r !== "All Regions").concat(region))
    }
  }

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      <SidebarProvider defaultOpen={true}>
        <div className="h-full bg-[#2A2A2A]">
          <KaratSidebar />
        </div>
        <SidebarInset className="overflow-auto">
          <main className="flex-1 py-6 px-8 md:px-12 lg:px-16">
            <DeepAnalyticsHeader 
              analyticsView={activeTab} 
              onViewChange={setActiveTab} 
            />
            
            {/* Simplified Filters */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Time Period:</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map(period => (
                        <SelectItem key={period.value} value={period.value}>
                          {period.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Region:</label>
                  <Select onValueChange={addRegion}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Add region..." />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.filter(r => !selectedRegions.includes(r)).map(region => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedRegions.filter(r => r !== "All Regions").length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Selected:</span>
                    {selectedRegions.filter(r => r !== "All Regions").map(region => (
                      <Badge key={region} variant="secondary" className="text-xs">
                        {region}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Main Analytics Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="cost-efficiency" className="flex items-center gap-2">
                  💰 Cost & ROI
                </TabsTrigger>
                <TabsTrigger value="geographic" className="flex items-center gap-2">
                  🌍 Geographic
                </TabsTrigger>
                <TabsTrigger value="rate-cards" className="flex items-center gap-2">
                  📋 Rate Cards
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cost-efficiency" className="space-y-6">
                <CostEfficiencyDashboard 
                  selectedPeriod={selectedPeriod}
                  selectedRegions={selectedRegions}
                />
              </TabsContent>

              <TabsContent value="geographic" className="space-y-6">
                <GeographicDashboard 
                  selectedPeriod={selectedPeriod}
                />
              </TabsContent>

              <TabsContent value="rate-cards" className="space-y-6">
                <RateCardComparison 
                  selectedRegion={selectedRegions.length === 1 ? selectedRegions[0] : undefined}
                />
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}