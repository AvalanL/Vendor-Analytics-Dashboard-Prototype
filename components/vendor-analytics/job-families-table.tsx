"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { InfoIcon, ChevronUp, ChevronDown } from "lucide-react"
import { jobFamilies, roles, allVendors } from "@/lib/dummy-data"
import { filterVendors } from "@/lib/filter-utils"

type SortDirection = "asc" | "desc" | null
type SortColumn =
  | "jobFamily"
  | "vendor"
  | "volume"
  | "passRate"
  | "timeInProcess"
  | "lateCancels"
  | "integrityChecks"
  | "placements"
  | "interviewsPerPlacement"
  | null

interface JobFamiliesTableProps {
  selectedPeriod: string
  selectedVendor: string
  selectedRole: string
  selectedJobFamily?: string
  searchQuery: string
}

interface JobFamilyRow {
  id: string
  name: string
  jobFamilyId: string
  vendors: {
    id: string
    name: string
    status: string
    volume: number
    passRate: number
    passTotal: number
    timeInProcess: number
    timeAverage: string
    noShows: number
    noShowsTotal: number
    integrityFlag: number
    integrityTotal: number
    placements: number
    placementsTotal: number
    interviewsPerPlacement: number
    interviewsPercentage: number
  }[]
}

export function JobFamiliesTable({ selectedPeriod, selectedVendor, selectedRole, selectedJobFamily, searchQuery }: JobFamiliesTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Generate data from real data sources
  const jobFamiliesData = useMemo(() => {
    const data: JobFamilyRow[] = []
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
      
      // Convert map to array for the job family row
      const vendorArray = Array.from(vendorsInFamily.values())
      
      if (vendorArray.length > 0) {
        data.push({
          id: jf.id,
          name: jf.name,
          jobFamilyId: jf.id,
          vendors: vendorArray.sort((a, b) => b.volume - a.volume), // Sort by volume
        })
      }
    })
    
    return data
  }, [selectedPeriod])

  // Filter data based on search query and selected filters
  const filteredJobFamilies = useMemo(() => {
    let filtered = jobFamiliesData
    
    // Filter by job family if specified
    if (selectedJobFamily && selectedJobFamily !== "All Job Families") {
      filtered = filtered.filter(jf => jf.name === selectedJobFamily)
    }
    
    // Apply search filter if provided
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim()
      
      filtered = filtered.filter((jf) => {
        // Check if job family name matches search
        if (jf.name.toLowerCase().includes(query)) {
          return true
        }
        
        // Check if any vendors in this job family match search
        const hasMatchingVendor = jf.vendors.some((vendor) => 
          vendor.name.toLowerCase().includes(query)
        )
        
        return hasMatchingVendor
      })
      
      // Also filter vendors within each job family
      filtered = filtered.map((jf) => ({
        ...jf,
        vendors: jf.vendors.filter(
          (vendor) => vendor.name.toLowerCase().includes(query) || jf.name.toLowerCase().includes(query),
        ),
      }))
    }
    
    // Apply vendor filter
    if (selectedVendor && selectedVendor !== "All Vendors") {
      filtered = filtered.map((jf) => ({
        ...jf,
        vendors: jf.vendors.filter((vendor) => vendor.name === selectedVendor)
      })).filter((jf) => jf.vendors.length > 0)
    }
    
    return filtered
  }, [jobFamiliesData, searchQuery, selectedVendor, selectedJobFamily])

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle direction or reset
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortDirection(null)
        setSortColumn(null)
      } else {
        setSortDirection("asc")
      }
    } else {
      // New column, set to ascending
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Helper to render sort indicator
  const renderSortIndicator = (column: SortColumn) => {
    if (sortColumn !== column) return null

    if (sortDirection === "asc") {
      return <ChevronUp className="ml-1 h-4 w-4 text-gray-600" />
    } else if (sortDirection === "desc") {
      return <ChevronDown className="ml-1 h-4 w-4 text-gray-600" />
    }

    return null
  }

  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center">
        <h2
          style={{
            color: "#5C5E5E",
            fontFamily: '"Work Sans", sans-serif',
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "144%",
          }}
        >
          Job Family Performance
        </h2>
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@600&family=Work+Sans:wght@400;600;700&display=swap');
        
        .column-header {
          color: #888;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
          line-height: 145.227%;
          letter-spacing: 1px;
          text-transform: uppercase;
          white-space: nowrap;
        }
        
        .vendor-name {
          color: #5751F9;
          font-family: 'Work Sans', sans-serif;
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          line-height: 143%;
          text-decoration-line: underline;
        }
        
        .active-pill {
          display: inline-flex;
          height: 16px;
          padding: 4px 8px;
          justify-content: center;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          border-radius: 4px;
          background: #E1FBDA;
          font-family: 'Work Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          line-height: 134%;
          color: #2E8540;
        }
        
        .inactive-pill {
          display: inline-flex;
          height: 16px;
          padding: 4px 8px;
          justify-content: center;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          border-radius: 4px;
          background: #F8D7DA;
          font-family: 'Work Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          line-height: 134%;
          color: #721C24;
        }
        
        .pending-pill {
          display: inline-flex;
          height: 16px;
          padding: 4px 8px;
          justify-content: center;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          border-radius: 4px;
          background: #FFF3CD;
          font-family: 'Work Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          line-height: 134%;
          color: #856404;
        }
        
        .cell-content {
          color: #1A1C1C;
          font-family: 'Work Sans', sans-serif;
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          line-height: 143%;
        }
        
        .cell-subtext {
          color: #5C5E5E;
          font-family: 'Work Sans', sans-serif;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 134%;
        }
        
        .job-family-name {
          color: #1A1C1C;
          font-family: 'Work Sans', sans-serif;
          font-size: 16px;
          font-style: normal;
          font-weight: 600;
          line-height: 143%;
          margin-bottom: 4px;
        }
        
        .job-family-location {
          color: #5C5E5E;
          font-family: 'Work Sans', sans-serif;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 134%;
        }
        
        .job-families-table {
          border: 1px solid #E2E8F0;
          border-radius: 0.5rem;
          background: #FFF;
          overflow: hidden;
        }
        
        .job-families-table-row {
          border-top: 1px solid #E2E8F0;
        }
        
        .job-families-table-row:first-child {
          border-top: none;
        }
        
        .job-families-table-header {
          border-bottom: 1px solid #E2E8F0;
          background: #F9F9F9;
        }
        
        .job-families-table-cell {
          padding: 16px;
          vertical-align: top;
          white-space: nowrap;
        }
        
        .job-families-table-container {
          width: 100%;
          border-collapse: collapse;
        }
        
        .info-icon {
          display: flex;
          width: 14px;
          height: 14px;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
          aspect-ratio: 1/1;
          color: #A6A7A7;
        }

        @media (max-width: 768px) {
          .job-families-table-wrapper {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
      <div className="job-families-table">
        <div className="job-families-table-wrapper">
          <table className="job-families-table-container">
            <thead>
              <tr className="job-families-table-header">
                <th
                  className="job-families-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("jobFamily")}
                  style={{ borderRight: "1px solid #E2E8F0" }}
                >
                  <div className="flex items-center">
                    JOB FAMILY
                    {renderSortIndicator("jobFamily")}
                  </div>
                </th>
                <th
                  className="job-families-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("vendor")}
                >
                  <div className="flex items-center">
                    VENDOR
                    {renderSortIndicator("vendor")}
                  </div>
                </th>
                <th
                  className="job-families-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("volume")}
                >
                  <div className="flex items-center">
                    VOLUME
                    {renderSortIndicator("volume")}
                  </div>
                </th>
                <th
                  className="job-families-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("passRate")}
                >
                  <div className="flex items-center">
                    PASS RATE
                    <div className="info-icon ml-1">
                      <InfoIcon size={14} />
                    </div>
                    {renderSortIndicator("passRate")}
                  </div>
                </th>
                <th
                  className="job-families-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("timeInProcess")}
                >
                  <div className="flex items-center">
                    TIME IN PROCESS
                    <div className="info-icon ml-1">
                      <InfoIcon size={14} />
                    </div>
                    {renderSortIndicator("timeInProcess")}
                  </div>
                </th>
                <th
                  className="job-families-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("lateCancels")}
                >
                  <div className="flex items-center">
                    LATE CANCELS / NO-SHOWS
                    <div className="info-icon ml-1">
                      <InfoIcon size={14} />
                    </div>
                    {renderSortIndicator("lateCancels")}
                  </div>
                </th>
                <th
                  className="job-families-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("integrityChecks")}
                >
                  <div className="flex items-center">
                    INTEGRITY CHECKS
                    <div className="info-icon ml-1">
                      <InfoIcon size={14} />
                    </div>
                    {renderSortIndicator("integrityChecks")}
                  </div>
                </th>
                <th
                  className="job-families-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("placements")}
                >
                  <div className="flex items-center">
                    PLACEMENTS
                    <div className="info-icon ml-1">
                      <InfoIcon size={14} />
                    </div>
                    {renderSortIndicator("placements")}
                  </div>
                </th>
                <th
                  className="job-families-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("interviewsPerPlacement")}
                >
                  <div className="flex items-center">
                    INTERVIEWS PER PLACEMENT
                    <div className="info-icon ml-1">
                      <InfoIcon size={14} />
                    </div>
                    {renderSortIndicator("interviewsPerPlacement")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredJobFamilies.flatMap((jobFamily, jobFamilyIndex) =>
                jobFamily.vendors.map((vendor, vendorIndex) => (
                  <tr key={`${jobFamilyIndex}-${vendorIndex}`} className="job-families-table-row">
                    {/* Job Family column - only show for first vendor in each job family with rowspan */}
                    {vendorIndex === 0 && (
                      <td
                        className="job-families-table-cell"
                        rowSpan={jobFamily.vendors.length}
                        style={{
                          borderRight: "1px solid #E2E8F0",
                          verticalAlign: "top",
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="job-family-name">{jobFamily.name}</span>
                          <span className="job-family-location">{jobFamily.vendors.length} vendors</span>
                        </div>
                      </td>
                    )}

                    {/* Vendor column */}
                    <td className="job-families-table-cell">
                      <div className="flex flex-col">
                        <Link href="#" className="vendor-name hover:text-blue-700">
                          {vendor.name}
                        </Link>
                        <div className="mt-1">
                          <span
                            className={
                              vendor.status === "Active"
                                ? "active-pill"
                                : vendor.status === "Inactive"
                                  ? "inactive-pill"
                                  : "pending-pill"
                            }
                          >
                            {vendor.status}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Volume column */}
                    <td className="job-families-table-cell">
                      <div className="flex flex-col">
                        <span className="cell-content">{vendor.volume.toLocaleString()}</span>
                        <span className="cell-subtext">candidates</span>
                      </div>
                    </td>

                    {/* Pass Rate column */}
                    <td className="job-families-table-cell">
                      <div className="flex flex-col">
                        <span className="cell-content">{vendor.passRate}%</span>
                        <span className="cell-subtext">{vendor.passTotal.toLocaleString()} total</span>
                      </div>
                    </td>

                    {/* Time in Process column */}
                    <td className="job-families-table-cell">
                      <div className="flex flex-col">
                        <span className="cell-content">{vendor.timeInProcess} days</span>
                        <span className="cell-subtext">{vendor.timeAverage}</span>
                      </div>
                    </td>

                    {/* Late Cancels column */}
                    <td className="job-families-table-cell">
                      <div className="flex flex-col">
                        <span className="cell-content">{vendor.noShows}%</span>
                        <span className="cell-subtext">{vendor.noShowsTotal} total</span>
                      </div>
                    </td>

                    {/* Integrity Checks column */}
                    <td className="job-families-table-cell">
                      <div className="flex flex-col">
                        <span className="cell-content">{vendor.integrityFlag}%</span>
                        <span className="cell-subtext">{vendor.integrityTotal} total</span>
                      </div>
                    </td>

                    {/* Placements column */}
                    <td className="job-families-table-cell">
                      <div className="flex flex-col">
                        <span className="cell-content">{vendor.placements}</span>
                        <span className="cell-subtext">{vendor.placementsTotal}%</span>
                      </div>
                    </td>

                    {/* Interviews per Placement column */}
                    <td className="job-families-table-cell">
                      <div className="flex flex-col">
                        <span className="cell-content">{vendor.interviewsPerPlacement}</span>
                        <span className="cell-subtext">{vendor.interviewsPercentage}%</span>
                      </div>
                    </td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}