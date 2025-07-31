"use client"

import { useState } from "react"
import Link from "next/link"
import { InfoIcon, ChevronUp, ChevronDown } from "lucide-react"
import { allVendors, roles } from "@/lib/dummy-data"
import { filterVendors, filterVendorsByRole } from "@/lib/filter-utils"

type SortDirection = "asc" | "desc" | null
type SortColumn =
  | "vendor"
  | "volume"
  | "passRate"
  | "timeInProcess"
  | "noShows"
  | "integrityFlag"
  | "placements"
  | "interviewsPerPlacement"
  | null

interface PerformanceTableProps {
  selectedPeriod: string
  selectedVendor: string
  selectedRole: string
  searchQuery: string
}

export function PerformanceTable({ selectedPeriod, selectedVendor, selectedRole, searchQuery }: PerformanceTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // First filter vendors by role if a role is selected
  const roleFilteredVendors = filterVendorsByRole(allVendors, roles, selectedRole)

  // Then apply other filters
  const filteredVendors = filterVendors(roleFilteredVendors, selectedPeriod, selectedVendor, selectedRole, searchQuery)

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

  // Sort vendors based on current sort column and direction
  const vendors = [...filteredVendors].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0

    let valueA, valueB

    switch (sortColumn) {
      case "vendor":
        valueA = a.name
        valueB = b.name
        break
      case "volume":
        valueA = a.volume
        valueB = b.volume
        break
      case "passRate":
        valueA = a.passRate
        valueB = b.passRate
        break
      case "timeInProcess":
        valueA = a.timeInProcess
        valueB = b.timeInProcess
        break
      case "noShows":
        valueA = a.noShows
        valueB = b.noShows
        break
      case "integrityFlag":
        valueA = a.integrityFlag
        valueB = b.integrityFlag
        break
      case "placements":
        valueA = a.placements
        valueB = b.placements
        break
      case "interviewsPerPlacement":
        valueA = a.interviewsPerPlacement
        valueB = b.interviewsPerPlacement
        break
      default:
        return 0
    }

    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1
    } else {
      return valueA < valueB ? 1 : -1
    }
  })

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
          Vendor Performance
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
        
        .vendor-table {
          border: 1px solid #E2E8F0;
          border-radius: 0.5rem;
          background: #FFF;
          overflow: hidden;
        }
        
        .vendor-table-row {
          border-top: 1px solid #E2E8F0;
          border-bottom: 1px solid #E2E8F0;
        }
        
        .vendor-table-row:first-child {
          border-top: none;
        }
        
        .vendor-table-row:last-child {
          border-bottom: none;
        }
        
        .vendor-table-header {
          border-bottom: 1px solid #E2E8F0;
          background: #F9F9F9;
        }
        
        .vendor-table-cell {
          padding: 16px;
          vertical-align: top;
          white-space: nowrap;
        }
        
        .vendor-table-container {
          width: 100%;
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
          .vendor-table-wrapper {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
      <div className="vendor-table">
        <div className="vendor-table-wrapper">
          <table className="vendor-table-container">
            <thead>
              <tr className="vendor-table-header">
                <th
                  className="vendor-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("vendor")}
                >
                  <div className="flex items-center">
                    Vendor
                    {renderSortIndicator("vendor")}
                  </div>
                </th>
                <th
                  className="vendor-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("volume")}
                >
                  <div className="flex items-center">
                    Volume
                    {renderSortIndicator("volume")}
                  </div>
                </th>
                <th
                  className="vendor-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("passRate")}
                >
                  <div className="flex items-center">
                    Pass Rate
                    <div className="info-icon ml-1">
                      <InfoIcon size={14} />
                    </div>
                    {renderSortIndicator("passRate")}
                  </div>
                </th>
                <th
                  className="vendor-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("timeInProcess")}
                >
                  <div className="flex items-center">
                    Time in Process
                    <div className="info-icon ml-1">
                      <InfoIcon size={14} />
                    </div>
                    {renderSortIndicator("timeInProcess")}
                  </div>
                </th>
                <th
                  className="vendor-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("noShows")}
                >
                  <div className="flex items-center">
                    No Shows
                    <div className="info-icon ml-1">
                      <InfoIcon size={14} />
                    </div>
                    {renderSortIndicator("noShows")}
                  </div>
                </th>
                <th
                  className="vendor-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("integrityFlag")}
                >
                  <div className="flex items-center">
                    Integrity Flag
                    <div className="info-icon ml-1">
                      <InfoIcon size={14} />
                    </div>
                    {renderSortIndicator("integrityFlag")}
                  </div>
                </th>
                <th
                  className="vendor-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("placements")}
                >
                  <div className="flex items-center">
                    Placements
                    <div className="info-icon ml-1">
                      <InfoIcon size={14} />
                    </div>
                    {renderSortIndicator("placements")}
                  </div>
                </th>
                <th
                  className="vendor-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("interviewsPerPlacement")}
                >
                  <div className="flex items-center">
                    Interviews per Placement
                    <div className="info-icon ml-1">
                      <InfoIcon size={14} />
                    </div>
                    {renderSortIndicator("interviewsPerPlacement")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor, index) => (
                <tr key={index} className="vendor-table-row">
                  <td className="vendor-table-cell">
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

                  <td className="vendor-table-cell">
                    <div className="flex flex-col">
                      <span className="cell-content">{vendor.volume}</span>
                      <span className="cell-subtext">Interviews</span>
                    </div>
                  </td>

                  <td className="vendor-table-cell">
                    <div className="flex flex-col">
                      <span className="cell-content">{vendor.passRate}%</span>
                      <span className="cell-subtext">{vendor.passTotal} total</span>
                    </div>
                  </td>

                  <td className="vendor-table-cell">
                    <div className="flex flex-col">
                      <span className="cell-content">{vendor.timeInProcess} days</span>
                      <span className="cell-subtext">{vendor.timeAverage}</span>
                    </div>
                  </td>

                  <td className="vendor-table-cell">
                    <div className="flex flex-col">
                      <span className="cell-content">{vendor.noShows}%</span>
                      <span className="cell-subtext">{vendor.noShowsTotal} total</span>
                    </div>
                  </td>

                  <td className="vendor-table-cell">
                    <div className="flex flex-col">
                      <span className="cell-content">{vendor.integrityFlag}%</span>
                      <span className="cell-subtext">{vendor.integrityTotal} total</span>
                    </div>
                  </td>

                  <td className="vendor-table-cell">
                    <div className="flex flex-col">
                      <span className="cell-content">{vendor.placements}</span>
                      <span className="cell-subtext">{vendor.placementsTotal} total</span>
                    </div>
                  </td>

                  <td className="vendor-table-cell">
                    <div className="flex flex-col">
                      <span className="cell-content">{vendor.interviewsPerPlacement}</span>
                      <span className="cell-subtext">{vendor.interviewsPercentage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
