'use client'

import { useState } from 'react'
import { KaratSidebar } from '@/components/karat-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Users, Target, CheckCircle, XCircle, AlertCircle, Clock, BarChart3, PieChart, FileText, Download, ChevronDown } from 'lucide-react'
import { SourcingPageHeader } from '@/components/vendor-analytics/sourcing-page-header'
import { Button } from '@/components/ui/button'
import { TabNavigation } from '@/components/vendor-analytics/tab-navigation'
import { PerformanceTable } from '@/components/vendor-analytics/performance-table'
import { TechnicalFailureAnalysis } from '@/components/vendor-analytics/technical-failure-analysis'
import { RoleSpecificSourcing } from '@/components/vendor-analytics/role-specific-sourcing'
import { SkillGapAnalysis } from '@/components/vendor-analytics/skill-gap-analysis'
import { roleInsightsData, generateDynamicRoleInsights, type RoleInsight } from '@/lib/role-insights-data'
import { candidatesData } from '@/lib/candidate-data'


interface VendorInsight {
  vendorName: string
  submissionVolume: number
  aboveBarRate: number
  recommendationDistribution: {
    doNotPass: number
    requiresFurtherReview: number
    inviteToNextRound: number
    fastTrack: number
  }
  quarterlyTrend: {
    change: number
    direction: 'up' | 'down' | 'stable'
    previousQuarter: number
  }
  topStrengths: string[]
  areasForImprovement: string[]
  roleInsights: RoleInsight[]
  benchmarkComparison: {
    aboveBarRate: number // Industry average
    fastTrackRate: number // Industry average
  }
  monthlyTrends: {
    month: string
    submissions: number
    aboveBarRate: number
  }[]
}

// Single vendor data (the logged-in vendor) - calculated from actual candidate data
const calculateVendorMetrics = () => {
  const totalCandidates = candidatesData.length
  const aboveBarCandidates = candidatesData.filter(c => c.aboveBar).length
  const aboveBarRate = Math.round((aboveBarCandidates / totalCandidates) * 100)
  
  // Calculate recommendation distribution
  const fastTrackCount = candidatesData.filter(c => c.overallRecommendation === 'Fast Track').length
  const inviteCount = candidatesData.filter(c => c.overallRecommendation === 'Invite to Next Round').length
  const reviewCount = candidatesData.filter(c => c.overallRecommendation === 'Requires Further Review').length
  const doNotPassCount = candidatesData.filter(c => c.overallRecommendation === 'Do Not Pass').length
  
  return {
    submissionVolume: totalCandidates,
    aboveBarRate,
    recommendationDistribution: {
      doNotPass: Math.round((doNotPassCount / totalCandidates) * 100),
      requiresFurtherReview: Math.round((reviewCount / totalCandidates) * 100),
      inviteToNextRound: Math.round((inviteCount / totalCandidates) * 100),
      fastTrack: Math.round((fastTrackCount / totalCandidates) * 100)
    }
  }
}

const vendorMetrics = calculateVendorMetrics()

const vendorData: VendorInsight = {
  vendorName: 'TechTalent Solutions',
  submissionVolume: vendorMetrics.submissionVolume,
  aboveBarRate: vendorMetrics.aboveBarRate,
  recommendationDistribution: vendorMetrics.recommendationDistribution,
  quarterlyTrend: {
    change: 12,
    direction: 'up',
    previousQuarter: 56
  },
  topStrengths: [
    'Candidates demonstrate exceptional debugging skills with systematic approaches to isolating and resolving complex issues',
    'Strong technical communication with clear explanations of architectural decisions and trade-off considerations',
    'Consistent application of software engineering best practices including proper error handling and code organization',
    'Effective problem decomposition strategies that break complex challenges into manageable, logical components',
    'High-quality code structure with attention to readability, maintainability, and performance considerations'
  ],
  areasForImprovement: [
    'System design responses often lack depth in scalability considerations and distributed architecture patterns',
    'Time management challenges evident in rushed implementations and incomplete solution exploration under pressure',
    'Limited demonstration of comprehensive testing strategies including edge cases and error condition handling',
    'Database optimization knowledge gaps particularly in query performance tuning and indexing strategies',
    'Insufficient depth in distributed systems concepts including consistency models and fault tolerance patterns'
  ],
  roleInsights: generateDynamicRoleInsights(),
  benchmarkComparison: {
    aboveBarRate: 55, // Industry average
    fastTrackRate: 7   // Industry average
  },
  monthlyTrends: [
    { month: 'Jan 2024', submissions: 78, aboveBarRate: 58 },
    { month: 'Feb 2024', submissions: 82, aboveBarRate: 62 },
    { month: 'Mar 2024', submissions: 87, aboveBarRate: 68 }
  ]
}

function PerformanceOverview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Main Performance Card */}
      <Card className="p-6 lg:col-span-2">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quarterly Performance</h3>
            <div className="flex items-center gap-4">
              <Badge variant="default" className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +{vendorData.quarterlyTrend.change}% QoQ
              </Badge>
              <span className="text-sm text-gray-600">
                Improved from {vendorData.quarterlyTrend.previousQuarter}% last quarter
              </span>
            </div>
          </div>
        </div>

        {/* Recommendation Distribution */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recommendation Distribution</h4>
          <div className="flex gap-1 h-6 rounded-lg overflow-hidden bg-gray-100">
            <div 
              className="bg-green-500" 
              style={{ width: `${vendorData.recommendationDistribution.fastTrack}%` }}
              title={`Fast Track: ${vendorData.recommendationDistribution.fastTrack}%`}
            />
            <div 
              className="bg-blue-500" 
              style={{ width: `${vendorData.recommendationDistribution.inviteToNextRound}%` }}
              title={`Invite to Next Round: ${vendorData.recommendationDistribution.inviteToNextRound}%`}
            />
            <div 
              className="bg-yellow-500" 
              style={{ width: `${vendorData.recommendationDistribution.requiresFurtherReview}%` }}
              title={`Requires Further Review: ${vendorData.recommendationDistribution.requiresFurtherReview}%`}
            />
            <div 
              className="bg-red-500" 
              style={{ width: `${vendorData.recommendationDistribution.doNotPass}%` }}
              title={`Do Not Pass: ${vendorData.recommendationDistribution.doNotPass}%`}
            />
          </div>
          <div className="grid grid-cols-4 gap-4 text-xs text-gray-600 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Fast Track ({vendorData.recommendationDistribution.fastTrack}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Invite ({vendorData.recommendationDistribution.inviteToNextRound}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Review ({vendorData.recommendationDistribution.requiresFurtherReview}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Do Not Pass ({vendorData.recommendationDistribution.doNotPass}%)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Benchmark Comparison */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Industry Benchmark</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Above Bar Rate</span>
              <span className={`text-sm font-medium ${vendorData.aboveBarRate > vendorData.benchmarkComparison.aboveBarRate ? 'text-green-600' : 'text-red-600'}`}>
                {vendorData.aboveBarRate > vendorData.benchmarkComparison.aboveBarRate ? '+' : ''}
                {vendorData.aboveBarRate - vendorData.benchmarkComparison.aboveBarRate}%
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Your Rate: {vendorData.aboveBarRate}%</span>
                <span>Industry: {vendorData.benchmarkComparison.aboveBarRate}%</span>
              </div>
              <Progress value={vendorData.aboveBarRate} className="h-2" />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Fast Track Rate</span>
              <span className={`text-sm font-medium ${vendorData.recommendationDistribution.fastTrack > vendorData.benchmarkComparison.fastTrackRate ? 'text-green-600' : 'text-red-600'}`}>
                {vendorData.recommendationDistribution.fastTrack > vendorData.benchmarkComparison.fastTrackRate ? '+' : ''}
                {vendorData.recommendationDistribution.fastTrack - vendorData.benchmarkComparison.fastTrackRate}%
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Your Rate: {vendorData.recommendationDistribution.fastTrack}%</span>
                <span>Industry: {vendorData.benchmarkComparison.fastTrackRate}%</span>
              </div>
              <Progress value={vendorData.recommendationDistribution.fastTrack * 10} className="h-2" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function RoleInsightCard({ role }: { role: RoleInsight }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 70) return 'bg-blue-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <Card className="mb-6">
      <div className="p-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-lg font-semibold text-gray-900">{role.roleName}</h4>
              <Badge variant={role.benchmarkComparison.yourRanking.includes('Top') ? 'default' : 'secondary'}>
                {role.benchmarkComparison.yourRanking}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{role.volume} submissions</span>
              <span>•</span>
              <span>{role.aboveBarRate}% above bar</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                {role.trend > 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={role.trend > 0 ? 'text-green-600' : 'text-red-600'}>
                  {role.trend > 0 ? '+' : ''}{role.trend}% QoQ
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{role.aboveBarRate}%</div>
              <div className="text-xs text-gray-600">Above Bar</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{role.recommendationDistribution.fastTrack}%</div>
              <div className="text-xs text-gray-600">Fast Track</div>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Recommendation Distribution Bar */}
        <div className="mb-4">
          <div className="flex gap-1 h-3 rounded-lg overflow-hidden bg-gray-100">
            <div 
              className="bg-green-500" 
              style={{ width: `${role.recommendationDistribution.fastTrack}%` }}
              title={`Fast Track: ${role.recommendationDistribution.fastTrack}%`}
            />
            <div 
              className="bg-blue-500" 
              style={{ width: `${role.recommendationDistribution.inviteToNextRound}%` }}
              title={`Invite to Next Round: ${role.recommendationDistribution.inviteToNextRound}%`}
            />
            <div 
              className="bg-yellow-500" 
              style={{ width: `${role.recommendationDistribution.requiresFurtherReview}%` }}
              title={`Requires Further Review: ${role.recommendationDistribution.requiresFurtherReview}%`}
            />
            <div 
              className="bg-red-500" 
              style={{ width: `${role.recommendationDistribution.doNotPass}%` }}
              title={`Do Not Pass: ${role.recommendationDistribution.doNotPass}%`}
            />
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="pt-6 space-y-6">
            
            {/* Detailed Feedback Scores */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">Detailed Performance Scores</h5>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(role.detailedFeedback).map(([category, data]) => (
                  <div key={category} className={`p-3 rounded-lg ${getScoreBackground(data.score)}`}>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(data.score)}`}>
                        {data.score}
                      </div>
                      <div className="text-xs text-gray-600 capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths and Areas for Improvement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Strengths Observed ({role.strengthsObserved.length})
                </h5>
                <ul className="space-y-2">
                  {role.strengthsObserved.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-700 leading-relaxed">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-amber-500" />
                  Areas for Improvement ({role.areasForImprovement.length})
                </h5>
                <ul className="space-y-2">
                  {role.areasForImprovement.map((area, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-700 leading-relaxed">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Common Patterns */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">Common Interview Patterns</h5>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <h6 className="text-xs font-medium text-green-800 mb-2">Strong Areas</h6>
                  <ul className="space-y-1">
                    {role.commonPatterns.strongAreas.map((area, index) => (
                      <li key={index} className="text-xs text-green-700">• {area}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <h6 className="text-xs font-medium text-amber-800 mb-2">Challenging Areas</h6>
                  <ul className="space-y-1">
                    {role.commonPatterns.challengingAreas.map((area, index) => (
                      <li key={index} className="text-xs text-amber-700">• {area}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h6 className="text-xs font-medium text-blue-800 mb-2">Interview Behaviors</h6>
                  <ul className="space-y-1">
                    {role.commonPatterns.interviewBehaviors.map((behavior, index) => (
                      <li key={index} className="text-xs text-blue-700">• {behavior}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Detailed Insights */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">Detailed Category Insights</h5>
              <div className="space-y-3">
                {Object.entries(role.detailedFeedback).map(([category, data]) => (
                  <div key={category} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="text-sm font-medium text-gray-800 capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </h6>
                      <span className={`text-sm font-bold ${getScoreColor(data.score)}`}>
                        {data.score}/100
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {data.insights.map((insight, index) => (
                        <li key={index} className="text-xs text-gray-600">• {insight}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </Card>
  )
}

function RoleInsightsSection() {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Role-Specific Insights</h3>
        <Badge variant="outline" className="text-xs">
          {vendorData.roleInsights.length} roles analyzed
        </Badge>
      </div>
      
      <div className="space-y-4">
        {vendorData.roleInsights.map((role) => (
          <RoleInsightCard key={role.roleName} role={role} />
        ))}
      </div>
    </div>
  )
}

function InsightsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
          Strengths Observed
        </h3>
        <ul className="space-y-3">
          {vendorData.topStrengths.map((strength, index) => (
            <li key={index} className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-700 leading-relaxed">{strength}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-amber-500" />
          Opportunities for Improvement
        </h3>
        <ul className="space-y-3">
          {vendorData.areasForImprovement.map((area, index) => (
            <li key={index} className="flex items-start">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-sm text-gray-700 leading-relaxed">{area}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Submissions</p>
            <p className="text-2xl font-bold text-gray-900">{vendorData.submissionVolume}</p>
          </div>
          <FileText className="w-8 h-8 text-blue-500" />
        </div>
        <div className="mt-2">
          <Badge variant="secondary" className="text-xs">
            This quarter
          </Badge>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Above Bar Rate</p>
            <p className="text-2xl font-bold text-emerald-600">{vendorData.aboveBarRate}%</p>
          </div>
          <TrendingUp className="w-8 h-8 text-emerald-500" />
        </div>
        <div className="mt-2">
          <Badge variant="default" className="text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            +{vendorData.quarterlyTrend.change}% QoQ
          </Badge>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Fast Track Rate</p>
            <p className="text-2xl font-bold text-green-600">{vendorData.recommendationDistribution.fastTrack}%</p>
          </div>
          <Target className="w-8 h-8 text-green-500" />
        </div>
        <div className="mt-2">
          <Badge variant="outline" className="text-xs">
            Industry avg: {vendorData.benchmarkComparison.fastTrackRate}%
          </Badge>
        </div>
      </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Integrity Flag Rate</p>
                  <p className="text-2xl font-bold text-red-600">3.2%</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  Assessment integrity issues
                </Badge>
              </div>
            </Card>
    </div>
  )
}

export default function SourcingInsightsPage() {
  const [activeTab, setActiveTab] = useState('Insights')

  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] overflow-hidden">
      <SidebarProvider defaultOpen={true}>
        <div className="h-full">
          <KaratSidebar />
        </div>
        <SidebarInset className="overflow-auto">
                <main className="flex-1 py-6 px-8 md:px-12 lg:px-16">
                  <SourcingPageHeader />
                  
                  {/* Tab Navigation */}
                  <div className="mb-6">
                    <TabNavigation 
                      tabs={['Insights', 'Candidates']} 
                      activeTab={activeTab} 
                      onTabChange={setActiveTab}
                      variant="large"
                    />
                  </div>

                  {/* Conditional Content Based on Active Tab */}
                   {activeTab === 'Insights' ? (
                     <>
                       <SummaryCards />
                       <PerformanceOverview />
                       <SkillGapAnalysis />
                       <InsightsSection />
                       <RoleInsightsSection />
                       
                       <div className="flex justify-center mt-8">
                         <div className="flex gap-4">
                           <Button variant="outline" size="lg">
                             <Download className="w-4 h-4 mr-2" />
                             Download Full Report (PDF)
                           </Button>
                           <Button variant="outline" size="lg">
                             <FileText className="w-4 h-4 mr-2" />
                             Export Data (CSV)
                           </Button>
                         </div>
                       </div>
                     </>
                   ) : (
                    <PerformanceTable
                      selectedPeriod="30days"
                      selectedVendor="All Vendors"
                      selectedRole="All Roles"
                      searchQuery=""
                    />
                  )}
                </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
