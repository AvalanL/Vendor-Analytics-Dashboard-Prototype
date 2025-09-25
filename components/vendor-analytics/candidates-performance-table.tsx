"use client"

import { useState } from "react"
import Link from "next/link"
import { InfoIcon, ChevronUp, ChevronDown } from "lucide-react"
import { candidatesData } from "@/lib/candidate-data"

type SortDirection = "asc" | "desc" | null
type SortColumn =
  | "candidate"
  | "role" 
  | "score"
  | "recommendation"
  | "interviewDate"
  | "duration"
  | "seniority"
  | null

interface CandidatesPerformanceTableProps {
  selectedPeriod: string
  selectedVendor: string
  selectedRole: string
  searchQuery: string
}

export function CandidatesPerformanceTable({ selectedPeriod, selectedVendor, selectedRole, searchQuery }: CandidatesPerformanceTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Filter candidates based on props
  const filteredCandidates = candidatesData.filter(candidate => {
    const matchesSearch = searchQuery === '' || 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.roleName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = selectedRole === 'All Roles' || candidate.roleName === selectedRole
    
    return matchesSearch && matchesRole
  })

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

  // Sort candidates based on current sort column and direction
  const candidates = [...filteredCandidates].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0

    let valueA, valueB

    switch (sortColumn) {
      case "candidate":
        valueA = a.name
        valueB = b.name
        break
      case "role":
        valueA = a.roleName
        valueB = b.roleName
        break
      case "score":
        valueA = a.overallScore
        valueB = b.overallScore
        break
      case "recommendation":
        valueA = a.overallRecommendation
        valueB = b.overallRecommendation
        break
      case "interviewDate":
        valueA = new Date(a.interviewDate).getTime()
        valueB = new Date(b.interviewDate).getTime()
        break
      case "duration":
        valueA = a.interviewDuration
        valueB = b.interviewDuration
        break
      case "seniority":
        valueA = a.seniority
        valueB = b.seniority
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

  // Get recommendation pill class
  const getRecommendationPillClass = (recommendation: string) => {
    switch (recommendation) {
      case 'Fast Track':
        return 'active-pill'
      case 'Invite to Next Round':
        return 'pending-pill'
      case 'Requires Further Review':
        return 'pending-pill'
      case 'Do Not Pass':
        return 'inactive-pill'
      default:
        return 'pending-pill'
    }
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
          Candidate Performance
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
        
        .candidate-name {
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
        
        .candidate-table {
          border: 1px solid #E2E8F0;
          border-radius: 0.5rem;
          background: #FFF;
          overflow: hidden;
        }
        
        .candidate-table-row {
          border-top: 1px solid #E2E8F0;
          border-bottom: 1px solid #E2E8F0;
        }
        
        .candidate-table-row:first-child {
          border-top: none;
        }
        
        .candidate-table-row:last-child {
          border-bottom: none;
        }
        
        .candidate-table-header {
          border-bottom: 1px solid #E2E8F0;
          background: #F9F9F9;
        }
        
        .candidate-table-cell {
          padding: 16px;
          vertical-align: top;
          white-space: nowrap;
        }
        
        .candidate-table-container {
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
          .candidate-table-wrapper {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
      <div className="candidate-table">
        <div className="candidate-table-wrapper">
          <table className="candidate-table-container">
            <thead>
              <tr className="candidate-table-header">
                <th
                  className="candidate-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("candidate")}
                >
                  <div className="flex items-center">
                    Candidate
                    {renderSortIndicator("candidate")}
                  </div>
                </th>
                <th
                  className="candidate-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("role")}
                >
                  <div className="flex items-center">
                    Role
                    {renderSortIndicator("role")}
                  </div>
                </th>
                <th
                  className="candidate-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("score")}
                >
                  <div className="flex items-center">
                    Overall Score
                    <div className="info-icon ml-1">
                      <InfoIcon size={14} />
                    </div>
                    {renderSortIndicator("score")}
                  </div>
                </th>
                <th
                  className="candidate-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("recommendation")}
                >
                  <div className="flex items-center">
                    Recommendation
                    <div className="info-icon ml-1">
                      <InfoIcon size={14} />
                    </div>
                    {renderSortIndicator("recommendation")}
                  </div>
                </th>
                <th
                  className="candidate-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("interviewDate")}
                >
                  <div className="flex items-center">
                    Interview Date
                    <div className="info-icon ml-1">
                      <InfoIcon size={14} />
                    </div>
                    {renderSortIndicator("interviewDate")}
                  </div>
                </th>
                <th
                  className="candidate-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("duration")}
                >
                  <div className="flex items-center">
                    Duration
                    <div className="info-icon ml-1">
                      <InfoIcon size={14} />
                    </div>
                    {renderSortIndicator("duration")}
                  </div>
                </th>
                <th
                  className="candidate-table-cell cursor-pointer column-header text-left"
                  onClick={() => handleSort("seniority")}
                >
                  <div className="flex items-center">
                    Seniority
                    <div className="info-icon ml-1">
                      <InfoIcon size={14} />
                    </div>
                    {renderSortIndicator("seniority")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, index) => (
                <tr key={index} className="candidate-table-row">
                  <td className="candidate-table-cell">
                    <div className="flex flex-col">
                      <Link href="#" className="candidate-name hover:text-blue-700">
                        {candidate.name}
                      </Link>
                      <div className="mt-1">
                        <span className="cell-subtext">
                          {candidate.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="candidate-table-cell">
                    <div className="flex flex-col">
                      <span className="cell-content">{candidate.roleName}</span>
                      <span className="cell-subtext">{candidate.location}</span>
                    </div>
                  </td>

                  <td className="candidate-table-cell">
                    <div className="flex flex-col">
                      <span className="cell-content">{candidate.overallScore}/100</span>
                      <span className="cell-subtext">{candidate.aboveBar ? 'Above Bar' : 'Below Bar'}</span>
                    </div>
                  </td>

                  <td className="candidate-table-cell">
                    <div className="flex flex-col">
                      <span
                        className={getRecommendationPillClass(candidate.overallRecommendation)}
                      >
                        {candidate.overallRecommendation}
                      </span>
                      <span className="cell-subtext mt-1">
                        Percentile: {candidate.benchmarkData.percentileRank}%
                      </span>
                    </div>
                  </td>

                  <td className="candidate-table-cell">
                    <div className="flex flex-col">
                      <span className="cell-content">{new Date(candidate.interviewDate).toLocaleDateString()}</span>
                      <span className="cell-subtext">Submitted: {new Date(candidate.submissionDate).toLocaleDateString()}</span>
                    </div>
                  </td>

                  <td className="candidate-table-cell">
                    <div className="flex flex-col">
                      <span className="cell-content">{candidate.interviewDuration} min</span>
                      <span className="cell-subtext">{candidate.performance.completedInTime ? 'On time' : 'Over time'}</span>
                    </div>
                  </td>

                  <td className="candidate-table-cell">
                    <div className="flex flex-col">
                      <span className="cell-content">{candidate.seniority}</span>
                      <span className="cell-subtext">{candidate.performance.showedGrowthMindset ? 'Growth mindset' : 'Fixed mindset'}</span>
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
