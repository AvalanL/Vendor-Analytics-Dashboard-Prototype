"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  ChevronDown, 
  ChevronUp, 
  User, 
  Calendar, 
  Clock, 
  MapPin,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react'
import { candidatesData, type CandidateResult } from '@/lib/candidate-data'

interface CandidatesTableProps {
  selectedPeriod: string
  selectedRole: string
  selectedJobFamily: string
  selectedLocation: string
  searchQuery: string
}

export function CandidatesTable({
  selectedPeriod,
  selectedRole,
  selectedJobFamily,
  selectedLocation,
  searchQuery,
}: CandidatesTableProps) {
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'name' | 'role'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null)

  // Filter candidates based on current filters
  const filteredCandidates = candidatesData.filter(candidate => {
    const matchesSearch = searchQuery === '' || 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.roleName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = selectedRole === 'All Roles' || candidate.roleName === selectedRole
    
    // For location, we'll check if the candidate location contains the selected location
    const matchesLocation = selectedLocation === 'All Locations' || 
      candidate.location.toLowerCase().includes(selectedLocation.toLowerCase())
    
    return matchesSearch && matchesRole && matchesLocation
  })

  // Sort candidates
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    let aValue: string | number
    let bValue: string | number

    switch (sortBy) {
      case 'name':
        aValue = a.name
        bValue = b.name
        break
      case 'score':
        aValue = a.overallScore
        bValue = b.overallScore
        break
      case 'role':
        aValue = a.roleName
        bValue = b.roleName
        break
      case 'date':
      default:
        aValue = new Date(a.interviewDate).getTime()
        bValue = new Date(b.interviewDate).getTime()
        break
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    return sortOrder === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number)
  })

  const handleSort = (field: 'date' | 'score' | 'name' | 'role') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Fast Track':
        return 'bg-green-100 text-green-800'
      case 'Invite to Next Round':
        return 'bg-blue-100 text-blue-800'
      case 'Requires Further Review':
        return 'bg-yellow-100 text-yellow-800'
      case 'Do Not Pass':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'Fast Track':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'Invite to Next Round':
        return <TrendingUp className="w-4 h-4 text-blue-600" />
      case 'Requires Further Review':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case 'Do Not Pass':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Candidate Results</h3>
          <p className="text-sm text-gray-600 mt-1">
            {filteredCandidates.length} candidates • {filteredCandidates.filter(c => c.aboveBar).length} above bar ({Math.round((filteredCandidates.filter(c => c.aboveBar).length / filteredCandidates.length) * 100)}%)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export Results
          </Button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 pb-3 border-b border-gray-200 text-sm font-medium text-gray-700">
        <div className="col-span-3 flex items-center gap-2 cursor-pointer" onClick={() => handleSort('name')}>
          Candidate
          {getSortIcon('name')}
        </div>
        <div className="col-span-2 flex items-center gap-2 cursor-pointer" onClick={() => handleSort('role')}>
          Role
          {getSortIcon('role')}
        </div>
        <div className="col-span-2 flex items-center gap-2 cursor-pointer" onClick={() => handleSort('date')}>
          Interview Date
          {getSortIcon('date')}
        </div>
        <div className="col-span-1 flex items-center gap-2 cursor-pointer" onClick={() => handleSort('score')}>
          Score
          {getSortIcon('score')}
        </div>
        <div className="col-span-3">
          Recommendation
        </div>
        <div className="col-span-1">
          Actions
        </div>
      </div>

      {/* Table Body */}
      <div className="space-y-2 mt-4">
        {sortedCandidates.map((candidate) => (
          <div key={candidate.id} className="border border-gray-200 rounded-lg">
            {/* Main Row */}
            <div className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50">
              <div className="col-span-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{candidate.name}</div>
                    <div className="text-sm text-gray-500">{candidate.email}</div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="font-medium text-gray-900">{candidate.roleName}</div>
                <div className="text-sm text-gray-500">{candidate.seniority}</div>
              </div>
              
              <div className="col-span-2">
                <div className="flex items-center gap-1 text-sm text-gray-900">
                  <Calendar className="w-4 h-4" />
                  {new Date(candidate.interviewDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {candidate.interviewDuration}min
                </div>
              </div>
              
              <div className="col-span-1">
                <div className={`text-lg font-bold ${candidate.aboveBar ? 'text-green-600' : 'text-red-600'}`}>
                  {candidate.overallScore}
                </div>
                <div className="text-xs text-gray-500">
                  {candidate.aboveBar ? 'Above Bar' : 'Below Bar'}
                </div>
              </div>
              
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  {getRecommendationIcon(candidate.overallRecommendation)}
                  <Badge className={getRecommendationColor(candidate.overallRecommendation)}>
                    {candidate.overallRecommendation}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {candidate.location}
                </div>
              </div>
              
              <div className="col-span-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedCandidate(
                    expandedCandidate === candidate.id ? null : candidate.id
                  )}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedCandidate === candidate.id && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="space-y-6">
                  
                  {/* Assessment Scores */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Assessment Breakdown</h4>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.entries(candidate.assessmentScores).map(([category, data]) => (
                        <div key={category} className="bg-white p-3 rounded-lg border">
                          <div className="text-center mb-2">
                            <div className={`text-xl font-bold ${data.score >= 80 ? 'text-green-600' : data.score >= 60 ? 'text-blue-600' : 'text-red-600'}`}>
                              {data.score}
                            </div>
                            <div className="text-xs text-gray-600 capitalize">
                              {category.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                          </div>
                          <Progress value={data.score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Strengths ({candidate.feedback.strengths.length})
                      </h4>
                      <ul className="space-y-2">
                        {candidate.feedback.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
                        Areas for Improvement ({candidate.feedback.areasForImprovement.length})
                      </h4>
                      <ul className="space-y-2">
                        {candidate.feedback.areasForImprovement.map((area, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Performance Indicators */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Interview Performance</h4>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        {candidate.performance.completedInTime ? 
                          <CheckCircle className="w-4 h-4 text-green-500" /> : 
                          <XCircle className="w-4 h-4 text-red-500" />
                        }
                        <span className="text-sm text-gray-700">Completed in Time</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {candidate.performance.askedGoodQuestions ? 
                          <CheckCircle className="w-4 h-4 text-green-500" /> : 
                          <XCircle className="w-4 h-4 text-red-500" />
                        }
                        <span className="text-sm text-gray-700">Asked Good Questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {candidate.performance.handledPressureWell ? 
                          <CheckCircle className="w-4 h-4 text-green-500" /> : 
                          <XCircle className="w-4 h-4 text-red-500" />
                        }
                        <span className="text-sm text-gray-700">Handled Pressure Well</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {candidate.performance.showedGrowthMindset ? 
                          <CheckCircle className="w-4 h-4 text-green-500" /> : 
                          <XCircle className="w-4 h-4 text-red-500" />
                        }
                        <span className="text-sm text-gray-700">Growth Mindset</span>
                      </div>
                    </div>
                  </div>

                  {/* Benchmarking */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Benchmark Comparison</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-lg border text-center">
                        <div className="text-lg font-bold text-blue-600">{candidate.benchmarkData.percentileRank}</div>
                        <div className="text-xs text-gray-600">Overall Percentile</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border text-center">
                        <div className="text-lg font-bold text-green-600">{candidate.benchmarkData.roleSpecificRank}</div>
                        <div className="text-xs text-gray-600">Role Percentile</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border text-center">
                        <div className={`text-lg font-bold ${candidate.benchmarkData.comparedToBar >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {candidate.benchmarkData.comparedToBar >= 0 ? '+' : ''}{candidate.benchmarkData.comparedToBar}
                        </div>
                        <div className="text-xs text-gray-600">vs. Bar</div>
                      </div>
                    </div>
                  </div>

                  {/* Interviewer Notes */}
                  {candidate.feedback.interviewerNotes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Interviewer Notes</h4>
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="text-sm text-gray-700 italic">"{candidate.feedback.interviewerNotes}"</p>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {sortedCandidates.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </Card>
  )
}
