"use client"

import { Search, ChevronDown } from "lucide-react"

interface RoleFiltersProps {
  selectedPeriod: string
  onPeriodChange: (period: string) => void
  selectedLevel: string
  onLevelChange: (level: string) => void
  selectedJobFamily: string
  onJobFamilyChange: (jobFamily: string) => void
  selectedLocation: string
  onLocationChange: (location: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function RoleFilters({
  selectedPeriod,
  onPeriodChange,
  selectedLevel,
  onLevelChange,
  selectedJobFamily,
  onJobFamilyChange,
  selectedLocation,
  onLocationChange,
  searchQuery,
  onSearchChange,
}: RoleFiltersProps) {
  // Set default to "30 days" regardless of what comes in from props

  // Level options for roles
  const levelOptions = [
    "All Levels",
    "Junior",
    "Mid-level", 
    "Senior"
  ]

  // Job family options for roles
  const jobFamilyOptions = [
    "All Job Families",
    "Engineering",
    "Data & Analytics",
    "Product",
    "Design",
    "Marketing",
    "Sales"
  ]

  // Location options for roles
  const locationOptions = [
    "All Locations",
    "Remote",
    "United States",
    "India",
    "Europe",
    "Canada"
  ]

  return (
    <div className="mb-6 w-full rounded-[8px] border border-[#D1D1D1] bg-[#F1F1F1] p-4 md:p-6 flex flex-col gap-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#888888]" />
        </div>
        <input
          type="text"
          placeholder="Search by role name"
          className="w-full h-[48px] py-3 pl-10 pr-4 bg-white border border-[#d1d1d1] rounded-lg text-[#5c5e5e] placeholder-[#888] focus:outline-none text-base leading-[144%]"
          style={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 400 }}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col md:flex-row flex-wrap gap-4">

        <div className="flex flex-col sm:flex-row gap-4 w-full md:flex-1">
          {/* Level dropdown */}
          <div className="relative flex-1 min-w-[200px]">
            <select
              className="w-full h-[48px] appearance-none px-4 py-2 pr-10 bg-white border border-[#d1d1d1] rounded-lg text-[#5c5e5e] focus:outline-none cursor-pointer text-base leading-[144%]"
              style={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 400 }}
              value={selectedLevel}
              onChange={(e) => onLevelChange(e.target.value)}
            >
              {levelOptions.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <div className="flex w-[24px] h-[24px] justify-center items-center flex-shrink-0">
                <ChevronDown className="w-5 h-5 text-[#5751F9]" />
              </div>
            </div>
          </div>

          {/* Job Family dropdown */}
          <div className="relative flex-1 min-w-[200px]">
            <select
              className="w-full h-[48px] appearance-none px-4 py-2 pr-10 bg-white border border-[#d1d1d1] rounded-lg text-[#5c5e5e] focus:outline-none cursor-pointer text-base leading-[144%]"
              style={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 400 }}
              value={selectedJobFamily}
              onChange={(e) => onJobFamilyChange(e.target.value)}
            >
              {jobFamilyOptions.map((jobFamily) => (
                <option key={jobFamily} value={jobFamily}>
                  {jobFamily}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <div className="flex w-[24px] h-[24px] justify-center items-center flex-shrink-0">
                <ChevronDown className="w-5 h-5 text-[#5751F9]" />
              </div>
            </div>
          </div>

          {/* Location dropdown */}
          <div className="relative flex-1 min-w-[200px]">
            <select
              className="w-full h-[48px] appearance-none px-4 py-2 pr-10 bg-white border border-[#d1d1d1] rounded-lg text-[#5c5e5e] focus:outline-none cursor-pointer text-base leading-[144%]"
              style={{ fontFamily: '"Work Sans", sans-serif', fontWeight: 400 }}
              value={selectedLocation}
              onChange={(e) => onLocationChange(e.target.value)}
            >
              {locationOptions.map((location) => (
                <option key={location} value={location}>
                  {location}
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
