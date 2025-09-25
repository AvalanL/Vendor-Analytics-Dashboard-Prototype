"use client"

import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, TrendingDown, Target, CheckCircle, XCircle, BookOpen, Users, Lightbulb } from 'lucide-react'
import { candidatesData } from '@/lib/candidate-data'

interface SkillGap {
  skillCategory: string
  averageScore: number
  failureRate: number
  candidatesAffected: number
  trend: number
  criticalWeaknesses: string[]
  passingThreshold: number
  improvementActions: string[]
  sourcingFocus: string
}

interface AggregatedInsight {
  category: string
  priority: 'Critical' | 'High' | 'Medium'
  impact: string
  recommendation: string
  candidateCoaching: string[]
  sourcingStrategy: string
}

export function SkillGapAnalysis() {
  // Calculate skill gaps from actual candidate data
  const calculateSkillGaps = (): SkillGap[] => {
    const skillCategories = ['technicalSkills', 'problemSolving', 'communication', 'codeQuality'] as const
    
    return skillCategories.map(category => {
      const scores = candidatesData.map(c => c.assessmentScores[category].score)
      const averageScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      const failingCandidates = scores.filter(score => score < 70).length
      const failureRate = Math.round((failingCandidates / scores.length) * 100)
      
      const skillData: Record<string, any> = {
        technicalSkills: {
          skillCategory: 'Technical Skills',
          criticalWeaknesses: [
            'Algorithm complexity analysis - 78% cannot explain Big O notation',
            'Data structure selection - 65% choose inefficient structures',
            'Framework-specific knowledge gaps - 58% lack depth beyond basics'
          ],
          passingThreshold: 75,
          improvementActions: [
            'Practice algorithm complexity analysis daily',
            'Complete data structures fundamentals course',
            'Build projects using multiple frameworks'
          ],
          sourcingFocus: 'Target candidates with CS fundamentals or active algorithm practice'
        },
        problemSolving: {
          skillCategory: 'Problem Solving',
          criticalWeaknesses: [
            'Systematic debugging approach - 72% use trial-and-error',
            'Edge case identification - 67% miss boundary conditions',
            'Solution optimization - 61% stop at first working solution'
          ],
          passingThreshold: 70,
          improvementActions: [
            'Learn systematic debugging methodologies',
            'Practice identifying edge cases in coding problems',
            'Focus on solution optimization and trade-offs'
          ],
          sourcingFocus: 'Look for candidates with debugging experience and optimization background'
        },
        communication: {
          skillCategory: 'Communication',
          criticalWeaknesses: [
            'Technical explanation clarity - 45% cannot explain complex concepts simply',
            'Thought process verbalization - 52% work silently without explanation',
            'Question asking - 38% don\'t clarify requirements'
          ],
          passingThreshold: 75,
          improvementActions: [
            'Practice explaining technical concepts to non-technical audiences',
            'Develop habit of thinking out loud during problem solving',
            'Learn to ask clarifying questions before starting'
          ],
          sourcingFocus: 'Prioritize candidates with teaching, mentoring, or presentation experience'
        },
        codeQuality: {
          skillCategory: 'Code Quality',
          criticalWeaknesses: [
            'Code organization - 68% write monolithic functions',
            'Error handling - 71% don\'t implement proper error handling',
            'Best practices - 59% ignore naming conventions and patterns'
          ],
          passingThreshold: 70,
          improvementActions: [
            'Learn code organization and modularization principles',
            'Study error handling patterns and defensive programming',
            'Practice following style guides and best practices'
          ],
          sourcingFocus: 'Target candidates from companies with strong code review cultures'
        }
      }

      return {
        ...skillData[category],
        averageScore,
        failureRate,
        candidatesAffected: failingCandidates,
        trend: Math.floor(Math.random() * 20) - 10 // Random trend for demo
      }
    })
  }

  const skillGaps = calculateSkillGaps()

  // Generate aggregated insights
  const generateAggregatedInsights = (): AggregatedInsight[] => {
    return [
      {
        category: 'Fundamental Knowledge Gaps',
        priority: 'Critical',
        impact: '78% of candidates fail on algorithm complexity - this is blocking most placements',
        recommendation: 'Immediately shift sourcing to candidates with CS degrees or active algorithm practice',
        candidateCoaching: [
          'Provide algorithm complexity cheat sheet before interviews',
          'Recommend 2 weeks of daily LeetCode practice',
          'Share time/space complexity analysis examples'
        ],
        sourcingStrategy: 'Target: CS graduates, bootcamp grads with 6+ months additional study, candidates who mention algorithm practice'
      },
      {
        category: 'Communication Barriers',
        priority: 'High',
        impact: '52% work silently without explaining their thought process',
        recommendation: 'Coach candidates on technical communication before interviews',
        candidateCoaching: [
          'Practice "thinking out loud" during coding exercises',
          'Teach the "Explain-Code-Test" pattern',
          'Provide examples of good technical explanations'
        ],
        sourcingStrategy: 'Prioritize: Teachers, mentors, team leads, conference speakers, technical writers'
      },
      {
        category: 'Code Quality Standards',
        priority: 'High',
        impact: '71% don\'t implement proper error handling - shows lack of production experience',
        recommendation: 'Focus on candidates from companies with strong engineering practices',
        candidateCoaching: [
          'Share error handling best practices guide',
          'Provide examples of defensive programming',
          'Teach code organization principles'
        ],
        sourcingStrategy: 'Target: Companies known for code quality (Google, Netflix, Stripe), senior engineers, code reviewers'
      },
      {
        category: 'Systematic Problem Solving',
        priority: 'Medium',
        impact: '67% miss edge cases - indicates rushed or incomplete analysis',
        recommendation: 'Teach structured problem-solving approach before interviews',
        candidateCoaching: [
          'Share edge case identification checklist',
          'Practice boundary condition analysis',
          'Teach systematic testing approaches'
        ],
        sourcingStrategy: 'Look for: QA background, testing experience, systematic thinkers, detail-oriented profiles'
      }
    ]
  }

  const aggregatedInsights = generateAggregatedInsights()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600'
    if (score >= 65) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Skill Gap Overview */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-500" />
              Skill Gap Analysis - What Your Candidates Need to Pass
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Based on {candidatesData.length} candidate assessments - specific areas for improvement
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {skillGaps.map((gap, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-900">{gap.skillCategory}</h4>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getScoreColor(gap.averageScore)}`}>
                    {gap.averageScore}/100
                  </div>
                  <div className="text-xs text-gray-500">avg score</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Failure Rate</span>
                  <span>{gap.failureRate}% ({gap.candidatesAffected} candidates)</span>
                </div>
                <Progress value={gap.failureRate} className="h-2" />
              </div>

              <div className="space-y-3">
                <div>
                  <h5 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                    <XCircle className="w-3 h-3 mr-1 text-red-500" />
                    Critical Weaknesses
                  </h5>
                  <ul className="space-y-1">
                    {gap.criticalWeaknesses.map((weakness, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start">
                        <span className="w-1 h-1 bg-red-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-xs font-medium text-blue-700 mb-2 flex items-center">
                    <Target className="w-3 h-3 mr-1 text-blue-500" />
                    Sourcing Focus
                  </h5>
                  <p className="text-xs text-blue-700 bg-blue-50 p-2 rounded">
                    {gap.sourcingFocus}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Aggregated Action Items */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              Aggregated Sourcing Intelligence
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Key insights and actionable recommendations to improve candidate pass rates
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {aggregatedInsights.map((insight, index) => (
            <div key={index} className={`p-4 border rounded-lg ${getPriorityColor(insight.priority)}`}>
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-900">{insight.category}</h4>
                <Badge className={getPriorityColor(insight.priority)} variant="secondary">
                  {insight.priority} Priority
                </Badge>
              </div>

              <div className="mb-4">
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 font-medium">{insight.impact}</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-700 font-medium">{insight.recommendation}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <BookOpen className="w-4 h-4 mr-1 text-purple-500" />
                    Candidate Coaching Actions
                  </h5>
                  <ul className="space-y-1">
                    {insight.candidateCoaching.map((action, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start">
                        <span className="w-1 h-1 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-1 text-blue-500" />
                    Sourcing Strategy
                  </h5>
                  <p className="text-xs text-blue-700 bg-blue-50 p-2 rounded">
                    {insight.sourcingStrategy}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Summary */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Immediate Action Plan to Improve Pass Rates
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-blue-900 mb-2">🎯 This Week</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Shift 80% sourcing effort to CS degree holders</li>
              <li>• Add algorithm practice requirement to candidate prep</li>
              <li>• Create "thinking out loud" coaching guide</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-900 mb-2">📈 This Month</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Target companies with strong code review culture</li>
              <li>• Build relationships with coding bootcamp instructors</li>
              <li>• Develop pre-interview technical communication workshop</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-900 mb-2">🎯 This Quarter</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Achieve 85% pass rate (from current 68%)</li>
              <li>• Reduce algorithm failure rate to &lt;30%</li>
              <li>• Build pipeline of communication-strong candidates</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-blue-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-blue-700">
              <strong>Expected Impact:</strong> Following this plan should improve your pass rate from 68% to 85% within 3 months
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Download Action Plan
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
