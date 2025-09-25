"use client"

import React, { useState, useMemo } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { jobFamilies, roles, allVendors } from "@/lib/dummy-data"
import { filterVendors } from "@/lib/filter-utils"

interface JobFamiliesPassRateGraphProps {
  selectedPeriod: string
  selectedVendor: string
  selectedRole: string
  selectedJobFamily?: string
  searchQuery: string
}

interface JobFamilyData {
  id: string
  name: string
  passRate: number
  volume: number
  isExpanded: boolean
  vendors?: {
    name: string
    passRate: number
    volume: number
  }[]
}

export function JobFamiliesPassRateGraph({ 
  selectedPeriod, 
  selectedVendor, 
  selectedRole, 
  selectedJobFamily, 
  searchQuery 
}: JobFamiliesPassRateGraphProps) {
  const [expandedFamilies, setExpandedFamilies] = useState<Set<string>>(new Set())

  const toggleFamily = (familyId: string) => {
    const newExpanded = new Set(expandedFamilies)
    if (newExpanded.has(familyId)) {
      newExpanded.delete(familyId)
    } else {
      newExpanded.add(familyId)
    }
    setExpandedFamilies(newExpanded)
  }

  // Generate data from real data sources
  const jobFamiliesData = useMemo(() => {
    const data: JobFamilyData[] = []
    const activeVendors = allVendors.filter(v => v.status === "Active")
    const scaledVendors = filterVendors(activeVendors, selectedPeriod)
    
    // Process each job family
    jobFamilies.forEach(jf => {
      // Get all roles in this job family
      const familyRoles = roles.filter(role => role.jobFamilyId === jf.id)
      
      if (familyRoles.length === 0) return
      
      // Get unique vendors across all roles in this family
      const vendorsInFamily = new Map<string, any>()
      
      familyRoles.forEach(role => {
        role.vendors.forEach(vendor => {
          if (!vendorsInFamily.has(vendor.id)) {
            const scaledVendor = scaledVendors.find(v => v.id === vendor.id)
            if (scaledVendor) {
              vendorsInFamily.set(vendor.id, scaledVendor)
            }
          }
        })
      })
      
      // Calculate aggregated metrics for the job family
      let totalVolume = 0
      let totalPasses = 0
      const vendorData: any[] = []
      
      vendorsInFamily.forEach((vendor) => {
        totalVolume += vendor.volume
        totalPasses += vendor.passTotal
        
        vendorData.push({
          name: vendor.name,
          passRate: vendor.passRate,
          volume: vendor.volume
        })
      })
      
      if (totalVolume > 0) {
        const avgPassRate = Math.round(totalPasses / totalVolume * 100)
        
        data.push({
          id: jf.id,
          name: jf.name,
          passRate: avgPassRate,
          volume: totalVolume,
          isExpanded: expandedFamilies.has(jf.id),
          vendors: vendorData.sort((a, b) => b.passRate - a.passRate)
        })
      }
    })
    
    // Sort by pass rate descending and take top 5
    return data.sort((a, b) => b.passRate - a.passRate).slice(0, 5)
  }, [selectedPeriod, expandedFamilies])

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return jobFamiliesData.filter((item) => {
      const matchesSearch = searchQuery === "" || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesJobFamily = !selectedJobFamily || selectedJobFamily === "All Job Families" ||
        item.name === selectedJobFamily
      
      return matchesSearch && matchesJobFamily
    })
  }, [jobFamiliesData, searchQuery, selectedJobFamily])

  // Find the maximum pass rate for scaling
  const maxPassRate = Math.max(...filteredData.map(d => d.passRate), 70)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            % CANDIDATES ABOVE BAR
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            BY JOB FAMILY
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {filteredData.map((family, index) => (
          <div key={family.id}>
            <div className="space-y-2">
              {/* Job Family Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-[160px]">
                  <span className="text-sm font-semibold text-gray-900">
                    {family.name}
                  </span>
                  {family.vendors && family.vendors.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={() => toggleFamily(family.id)}
                    >
                      <Plus className={`h-4 w-4 text-gray-400 transition-transform ${family.isExpanded ? 'rotate-45' : ''}`} />
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1 max-w-2xl">
                    <div className="relative h-6 bg-gray-100 rounded-sm overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-[#86EFAC] transition-all duration-300"
                        style={{ width: `${(family.passRate / maxPassRate) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                    {family.passRate}%
                  </span>
                  <span className="text-sm text-gray-500 w-20 text-right">
                    {family.volume.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Expanded Vendor Rows */}
              {family.isExpanded && family.vendors && (
                <div className="ml-8 space-y-2">
                  {family.vendors.map((vendor, vendorIndex) => (
                    <div key={`${family.id}-${vendorIndex}`} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 min-w-[152px]">
                        {vendor.name}
                      </span>
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-1 max-w-2xl">
                          <div className="relative h-5 bg-gray-100 rounded-sm overflow-hidden">
                            <div
                              className="absolute left-0 top-0 h-full bg-[#5DD4DC] transition-all duration-300"
                              style={{ width: `${(vendor.passRate / maxPassRate) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-12 text-right">
                          {vendor.passRate}%
                        </span>
                        <span className="text-sm text-gray-500 w-20 text-right">
                          {vendor.volume.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <a href="#" className="text-sm text-[#5751F9] hover:underline">
          See All Job Families ({jobFamilies.length})
        </a>
      </div>
    </div>
  )
}