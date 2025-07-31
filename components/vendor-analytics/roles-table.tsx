"use client"

import { useState } from "react"
import Link from "next/link"
import { InfoIcon, ChevronUp, ChevronDown } from "lucide-react"
import { roles } from "@/lib/dummy-data"
import { filterRoles } from "@/lib/filter-utils"

type SortDirection = "asc" | "desc" | null
type SortColumn =
  | "role"
  | "vendor"
  | "volume"
  | "passRate"
  | "timeInProcess"
  | "lateCancels"
  | "integrityChecks"
  | "placements"
  | "interviewsPerPlacement"
  | null

interface RolesTableProps {
  selectedPeriod: string
  selectedVendor: string
  selectedRole: string
  searchQuery: string
}

export function RolesTable({ selectedPeriod, selectedVendor, selectedRole, searchQuery }: RolesTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Filter roles based on selected filters
  const filteredRoles = filterRoles(roles, selectedPeriod, selectedVendor, selectedRole, searchQuery)

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
          Role Performance
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
        
        .role-name {
          color: #1A1C1C;
          font-family: 'Work Sans', sans-serif;
          font-size: 16px;
          font-style: normal;
          font-weight: 600;
          line-height: 143%;
          margin-bottom: 4px;
        }
        
        .role-location {
          color: #5C5E5E;
          font-family: 'Work Sans', sans-serif;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 134%;
        }
        
        .roles-table {
          border: 1px solid #E2E8F0;
          border-radius: 0.5rem;
          background: #FFF;
          overflow: hidden;
        }
        
        .roles-table-row {
          border-top: 1px solid #E2E8F0;
        }
        
        .roles-table-row:first-child {
          border-top: none;
        }
        
        .roles-table-header {
          border-bottom: 1px solid #E2E8F0;
          background: #F9F9F9;
        }
        
        .roles-table-cell {
          padding: 16px;
          vertical-align: top;
          white-space: nowrap;
        }
        
        .roles-table-container {
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
          .roles-table-wrapper {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
      <div className="roles-table">
        <div className="roles-table-wrapper">
          <table className="roles-table-container">
            <thead>
              <tr className="roles-table-header">
                <th
                  className="roles-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("role")}
                  style={{ borderRight: "1px solid #E2E8F0" }}
                >
                  <div className="flex items-center">
                    ROLE
                    {renderSortIndicator("role")}
                  </div>
                </th>
                <th
                  className="roles-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("vendor")}
                >
                  <div className="flex items-center">
                    VENDOR
                    {renderSortIndicator("vendor")}
                  </div>
                </th>
                <th
                  className="roles-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("volume")}
                >
                  <div className="flex items-center">
                    VOLUME
                    {renderSortIndicator("volume")}
                  </div>
                </th>
                <th
                  className="roles-table-cell cursor-pointer column-header text-left"
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
                  className="roles-table-cell cursor-pointer column-header text-left"
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
                  className="roles-table-cell cursor-pointer column-header text-left"
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
                  className="roles-table-cell cursor-pointer column-header text-left"
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
                  className="roles-table-cell cursor-pointer column-header text-left"
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
                  className="roles-table-cell cursor-pointer column-header text-left"
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
              {filteredRoles.flatMap((role, roleIndex) =>
                role.vendors.map((vendor, vendorIndex) => (
                  <tr key={`${roleIndex}-${vendorIndex}`} className="roles-table-row">
                    {/* Role column - only show for first vendor in each role with rowspan */}
                    {vendorIndex === 0 && (
                      <td
                        className="roles-table-cell"
                        rowSpan={role.vendors.length}
                        style={{
                          borderRight: "1px solid #E2E8F0",
                          verticalAlign: "top",
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="role-name">{role.name}</span>
                          <span className="role-location">{role.location}</span>
                        </div>
                      </td>
                    )}

                    {/* Vendor column */}
                    <td className="roles-table-cell">
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
                    <td className="roles-table-cell">
                      <div className="flex flex-col">
                        <span className="cell-content">{vendor.volume}</span>
                        <span className="cell-subtext">candidates</span>
                      </div>
                    </td>

                    {/* Pass Rate column */}
                    <td className="roles-table-cell">
                      <div className="flex flex-col">
                        <span className="cell-content">{vendor.passRate}%</span>
                        <span className="cell-subtext">{vendor.passTotal} total</span>
                      </div>
                    </td>

                    {/* Time in Process column */}
                    <td className="roles-table-cell">
                      <div className="flex flex-col">
                        <span className="cell-content">{vendor.timeInProcess} days</span>
                        <span className="cell-subtext">{vendor.timeAverage}</span>
                      </div>
                    </td>

                    {/* Late Cancels column */}
                    <td className="roles-table-cell">
                      <div className="flex flex-col">
                        <span className="cell-content">{vendor.noShows}%</span>
                        <span className="cell-subtext">{vendor.noShowsTotal} total</span>
                      </div>
                    </td>

                    {/* Integrity Checks column */}
                    <td className="roles-table-cell">
                      <div className="flex flex-col">
                        <span className="cell-content">{vendor.integrityFlag}%</span>
                        <span className="cell-subtext">{vendor.integrityTotal} total</span>
                      </div>
                    </td>

                    {/* Placements column */}
                    <td className="roles-table-cell">
                      <div className="flex flex-col">
                        <span className="cell-content">{vendor.placements}</span>
                        <span className="cell-subtext">{vendor.placementsTotal}%</span>
                      </div>
                    </td>

                    {/* Interviews per Placement column */}
                    <td className="roles-table-cell">
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
