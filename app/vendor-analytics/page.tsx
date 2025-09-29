"use client"

import { useState } from "react"
import { KaratSidebar } from "@/components/karat-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { PageHeader } from "@/components/vendor-analytics/page-header"
import { Filters } from "@/components/vendor-analytics/filters"
import { AnalyticsCards } from "@/components/vendor-analytics/analytics-cards"
import { MetricsCards } from "@/components/vendor-analytics/metrics-cards"
import { PerformanceTable } from "@/components/vendor-analytics/performance-table"
import { RolesTable } from "@/components/vendor-analytics/roles-table"
import { VendorTrendGraphs } from "@/components/vendor-analytics/vendor-trend-graphs"
import { JobFamiliesTable } from "@/components/vendor-analytics/job-families-table"
import { JobFamiliesPassRateGraph } from "@/components/vendor-analytics/job-families-pass-rate-graph"

export default function VendorAnalyticsPage() {
  const [activeTab, setActiveTab] = useState("Vendors")
  const [selectedPeriod, setSelectedPeriod] = useState("30days")
  const [selectedVendor, setSelectedVendor] = useState("All Vendors")
  const [selectedRole, setSelectedRole] = useState("All Roles")
  const [selectedJobFamily, setSelectedJobFamily] = useState("All Job Families")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] overflow-hidden">
      <SidebarProvider defaultOpen={true}>
        <div className="h-full">
          <KaratSidebar />
        </div>
        <SidebarInset className="overflow-auto">
          <main className="flex-1 py-6 px-8 md:px-12 lg:px-16">
            <PageHeader activeTab={activeTab} onTabChange={setActiveTab} />
            <Filters
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              selectedVendor={selectedVendor}
              onVendorChange={setSelectedVendor}
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
              selectedJobFamily={selectedJobFamily}
              onJobFamilyChange={setSelectedJobFamily}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <AnalyticsCards
              selectedPeriod={selectedPeriod}
              selectedVendor={selectedVendor}
              selectedRole={selectedRole}
              selectedJobFamily={selectedJobFamily}
              activeTab={activeTab}
              searchQuery={searchQuery}
            />
            <MetricsCards
              selectedPeriod={selectedPeriod}
              selectedVendor={selectedVendor}
              selectedRole={selectedRole}
              selectedJobFamily={selectedJobFamily}
              activeTab={activeTab}
              searchQuery={searchQuery}
            />
            {/* <Funnel selectedPeriod={selectedPeriod} selectedVendor={selectedVendor} selectedRole={selectedRole} /> */}
            
            {/* Conditionally render VendorTrendGraphs above the table when a specific vendor is selected */}
            {selectedVendor !== "All Vendors" && (
              <VendorTrendGraphs 
                selectedVendor={selectedVendor} 
                selectedPeriod={selectedPeriod}
              />
            )}

            {activeTab === "Vendors" ? (
              <PerformanceTable
                selectedPeriod={selectedPeriod}
                selectedVendor={selectedVendor}
                selectedRole={selectedRole}
                selectedJobFamily={selectedJobFamily}
                searchQuery={searchQuery}
              />
            ) : activeTab === "Roles" ? (
              <RolesTable
                selectedPeriod={selectedPeriod}
                selectedVendor={selectedVendor}
                selectedRole={selectedRole}
                selectedJobFamily={selectedJobFamily}
                searchQuery={searchQuery}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <JobFamiliesPassRateGraph
                    selectedPeriod={selectedPeriod}
                    selectedVendor={selectedVendor}
                    selectedRole={selectedRole}
                    selectedJobFamily={selectedJobFamily}
                    searchQuery={searchQuery}
                  />
                </div>
                <JobFamiliesTable
                  selectedPeriod={selectedPeriod}
                  selectedVendor={selectedVendor}
                  selectedRole={selectedRole}
                  selectedJobFamily={selectedJobFamily}
                  searchQuery={searchQuery}
                />
              </>
            )}

          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

