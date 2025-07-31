"use client"

import { useState, useEffect } from "react"
import { Search, ChevronDown } from "lucide-react"
import { allVendors } from "@/lib/dummy-data"

type TimeRange = "7 days" | "30 days" | "90 days" | "1 year"

interface FiltersProps {
  selectedPeriod: string
  onPeriodChange: (period: string) => void
  selectedVendor: string
  onVendorChange: (vendor: string) => void
  selectedRole: string
  onRoleChange: (role: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function Filters({
  selectedPeriod,
  onPeriodChange,
  selectedVendor,
  onVendorChange,
  selectedRole,
  onRoleChange,
  searchQuery,
  onSearchChange,
}: FiltersProps) {
  // Set default to "30 days" regardless of what comes in from props
  const [activeTab, setActiveTab] = useState<TimeRange>("30 days")

  // Sync with parent component on mount
  useEffect(() => {
    // Set the default to "30 days" and notify parent
    if (selectedPeriod !== "30days") {
      onPeriodChange("30days")
    }
  }, [])

  const handleTabChange = (tab: TimeRange) => {
    setActiveTab(tab)
    onPeriodChange(tab.replace(" ", "").toLowerCase())
  }

  // Get unique vendor names for dropdown
  const vendorOptions = ["All Vendors", ...new Set(allVendors.map((vendor) => vendor.name))]

  // Get unique role names for dropdown
  const roleOptions = [
    "All Roles",
    "Senior Backend Engineer",
    "Junior Frontend Engineer",
    "DevOps Engineer",
    "Data Scientist",
  ]

  return (
    <div className="mb-6 w-full rounded-[8px] border border-[#D1D1D1] bg-[#F1F1F1] p-4 md:p-6 flex flex-col gap-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#888888]" />
        </div>
        <input
          type="text"
          placeholder="Search by vendor or role"
          className="w-full h-[48px] py-3 pl-10 pr-4 bg-white border border-[#d1d1d1] rounded-lg text-[#5c5e5e] placeholder-[#888] focus:outline-none text-base leading-[144%]"
          style={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 400 }}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col md:flex-row flex-wrap gap-4">
        {/* Time period tabs - removed overflow-x-auto to prevent scroll bars */}
        <div className="inline-flex h-[48px] p-[2px] justify-end items-center gap-[4px] flex-shrink-0 rounded-[8px] border border-[#D1D1D1] bg-white w-full md:w-auto">
          {(["7 days", "30 days", "90 days", "1 year"] as TimeRange[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex h-[44px] px-[16px] justify-center items-center gap-[8px] transition-colors text-center text-base leading-[144%] flex-shrink-0 ${
                activeTab === tab
                  ? "bg-[#5751f9] text-white rounded-[8px] shadow-[0px_2px_3px_0px_rgba(0,0,0,0.20)] my-[2px]"
                  : "text-[#5c5e5e] hover:bg-[#f8f8f8]"
              }`}
              style={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 600 }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:flex-1">
          {/* Vendor dropdown */}
          <div className="relative flex-1 min-w-[200px]">
            <select
              className="w-full h-[48px] appearance-none px-4 py-2 pr-10 bg-white border border-[#d1d1d1] rounded-lg text-[#5c5e5e] focus:outline-none cursor-pointer text-base leading-[144%]"
              style={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 400 }}
              value={selectedVendor}
              onChange={(e) => onVendorChange(e.target.value)}
            >
              {vendorOptions.map((vendor) => (
                <option key={vendor} value={vendor}>
                  {vendor}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <div className="flex w-[24px] h-[24px] justify-center items-center flex-shrink-0">
                <ChevronDown className="w-5 h-5 text-[#5751F9]" />
              </div>
            </div>
          </div>

          {/* Role dropdown */}
          <div className="relative flex-1 min-w-[200px]">
            <select
              className="w-full h-[48px] appearance-none px-4 py-2 pr-10 bg-white border border-[#d1d1d1] rounded-lg text-[#5c5e5e] focus:outline-none cursor-pointer text-base leading-[144%]"
              style={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 400 }}
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value)}
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <div className="flex w-[24px] h-[24px] justify-center items-center flex-shrink-0">
                <ChevronDown className="w-5 h-5 text-[#5751F9]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
