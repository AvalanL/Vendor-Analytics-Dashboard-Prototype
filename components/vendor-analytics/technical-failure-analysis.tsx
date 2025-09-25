"use client"

import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, TrendingDown, Target, CheckCircle, XCircle } from 'lucide-react'

interface FailurePattern {
  category: string
  subcategory: string
  failureRate: number
  totalAttempts: number
  trend: number
  commonMistakes: string[]
  passingCandidateProfile: string
  sourcingRecommendation: string
}

interface TechnicalFailureAnalysisProps {
  roleName: string
}

const getFailureData = (roleName: string): FailurePattern[] => {
  const basePatterns: Record<string, FailurePattern[]> = {
    'Frontend Engineer': [
      {
        category: 'JavaScript Fundamentals',
        subcategory: 'Closures & Scope',
        failureRate: 68,
        totalAttempts: 89,
        trend: 5,
        commonMistakes: [
          'Cannot explain closure behavior in event handlers',
          'Confuses function scope with block scope',
          'Struggles with this binding in different contexts'
        ],
        passingCandidateProfile: '3+ years with modern JS frameworks, understands ES6+ features',
        sourcingRecommendation: 'Look for candidates who mention "vanilla JavaScript" skills, not just framework experience'
      },
      {
        category: 'React/Component Architecture',
        subcategory: 'State Management',
        failureRate: 45,
        totalAttempts: 89,
        trend: -8,
        commonMistakes: [
          'Overuses useState for complex state',
          'Cannot explain when to lift state up',
          'Unfamiliar with useReducer for complex logic'
        ],
        passingCandidateProfile: 'Experience with Redux or Context API, understands component lifecycle',
        sourcingRecommendation: 'Target candidates from companies known for complex React apps (Netflix, Airbnb, Meta)'
      },
      {
        category: 'CSS & Styling',
        subcategory: 'Layout & Responsive Design',
        failureRate: 52,
        totalAttempts: 89,
        trend: 12,
        commonMistakes: [
          'Cannot implement complex layouts without frameworks',
          'Poor understanding of flexbox vs grid',
          'Struggles with responsive breakpoints'
        ],
        passingCandidateProfile: 'Strong CSS fundamentals, experience with design systems',
        sourcingRecommendation: 'Avoid candidates who only mention CSS frameworks - need vanilla CSS skills'
      },
      {
        category: 'Browser APIs & Performance',
        subcategory: 'DOM Manipulation',
        failureRate: 71,
        totalAttempts: 89,
        trend: 15,
        commonMistakes: [
          'Inefficient DOM queries and updates',
          'Cannot explain event delegation',
          'Poor understanding of browser rendering'
        ],
        passingCandidateProfile: 'Pre-framework JavaScript experience, performance optimization background',
        sourcingRecommendation: 'Prioritize candidates with 5+ years experience who worked before React dominance'
      }
    ],
    'Backend Engineer': [
      {
        category: 'Database Design',
        subcategory: 'Query Optimization',
        failureRate: 72,
        totalAttempts: 76,
        trend: 8,
        commonMistakes: [
          'Cannot identify N+1 query problems',
          'Poor understanding of index strategy',
          'Struggles with complex JOIN operations'
        ],
        passingCandidateProfile: 'Experience with large-scale databases, understands EXPLAIN plans',
        sourcingRecommendation: 'Target candidates from data-heavy companies (fintech, e-commerce, analytics)'
      },
      {
        category: 'System Design',
        subcategory: 'Scalability Patterns',
        failureRate: 65,
        totalAttempts: 76,
        trend: 3,
        commonMistakes: [
          'Cannot explain caching strategies',
          'Poor understanding of load balancing',
          'Struggles with distributed system concepts'
        ],
        passingCandidateProfile: 'Experience at high-scale companies, microservices background',
        sourcingRecommendation: 'Focus on candidates from companies with >1M users (Uber, Netflix, Amazon)'
      },
      {
        category: 'API Design',
        subcategory: 'RESTful Principles',
        failureRate: 41,
        totalAttempts: 76,
        trend: -12,
        commonMistakes: [
          'Inconsistent HTTP status code usage',
          'Poor resource naming conventions',
          'Cannot explain idempotency'
        ],
        passingCandidateProfile: 'API-first company experience, understands HTTP specifications',
        sourcingRecommendation: 'Look for candidates who have built public APIs or worked at API companies'
      },
      {
        category: 'Algorithms & Data Structures',
        subcategory: 'Time Complexity Analysis',
        failureRate: 78,
        totalAttempts: 76,
        trend: 20,
        commonMistakes: [
          'Cannot analyze nested loop complexity',
          'Struggles with recursive algorithm analysis',
          'Poor space complexity understanding'
        ],
        passingCandidateProfile: 'Computer Science background or strong self-taught algorithms knowledge',
        sourcingRecommendation: 'Prioritize CS degree holders or candidates who actively practice on LeetCode/HackerRank'
      }
    ],
    'Full Stack Engineer': [
      {
        category: 'Frontend/Backend Integration',
        subcategory: 'API Communication',
        failureRate: 58,
        totalAttempts: 45,
        trend: 2,
        commonMistakes: [
          'Poor error handling in API calls',
          'Cannot explain CORS issues',
          'Struggles with authentication flow'
        ],
        passingCandidateProfile: 'End-to-end development experience, understands full request lifecycle',
        sourcingRecommendation: 'Target candidates from smaller companies where they owned entire features'
      },
      {
        category: 'Database & Backend Logic',
        subcategory: 'Data Modeling',
        failureRate: 64,
        totalAttempts: 45,
        trend: 7,
        commonMistakes: [
          'Overly complex database schemas',
          'Cannot normalize data properly',
          'Poor understanding of relationships'
        ],
        passingCandidateProfile: 'Experience designing schemas from scratch, understands business logic',
        sourcingRecommendation: 'Look for candidates who have been technical leads on greenfield projects'
      },
      {
        category: 'DevOps & Deployment',
        subcategory: 'CI/CD Understanding',
        failureRate: 69,
        totalAttempts: 45,
        trend: 11,
        commonMistakes: [
          'Cannot explain deployment strategies',
          'Poor understanding of environment differences',
          'Struggles with containerization concepts'
        ],
        passingCandidateProfile: 'Hands-on deployment experience, understands infrastructure basics',
        sourcingRecommendation: 'Prioritize candidates from startups where they handled their own deployments'
      }
    ],
    'Data Engineer': [
      {
        category: 'Data Pipeline Design',
        subcategory: 'ETL Optimization',
        failureRate: 73,
        totalAttempts: 37,
        trend: 18,
        commonMistakes: [
          'Cannot design fault-tolerant pipelines',
          'Poor understanding of data partitioning',
          'Struggles with batch vs stream processing'
        ],
        passingCandidateProfile: 'Experience with large-scale data processing, understands distributed systems',
        sourcingRecommendation: 'Target candidates from data-intensive companies (Spotify, Netflix, Uber)'
      },
      {
        category: 'SQL & Query Performance',
        subcategory: 'Complex Aggregations',
        failureRate: 59,
        totalAttempts: 37,
        trend: -5,
        commonMistakes: [
          'Inefficient window function usage',
          'Cannot optimize subqueries',
          'Poor understanding of query execution plans'
        ],
        passingCandidateProfile: 'Strong SQL background, experience with data warehousing',
        sourcingRecommendation: 'Look for candidates with analytics or BI background, not just software engineering'
      },
      {
        category: 'Big Data Technologies',
        subcategory: 'Distributed Computing',
        failureRate: 81,
        totalAttempts: 37,
        trend: 25,
        commonMistakes: [
          'Cannot explain Spark execution model',
          'Poor understanding of data locality',
          'Struggles with memory management in distributed systems'
        ],
        passingCandidateProfile: 'Hands-on experience with Spark, Hadoop, or similar frameworks',
        sourcingRecommendation: 'Essential: candidates must have worked with big data frameworks, not just SQL'
      }
    ]
  }

  return basePatterns[roleName] || []
}

export function TechnicalFailureAnalysis({ roleName }: TechnicalFailureAnalysisProps) {
  const failurePatterns = getFailureData(roleName)

  const getFailureColor = (rate: number) => {
    if (rate >= 70) return 'text-red-600'
    if (rate >= 50) return 'text-orange-600'
    return 'text-yellow-600'
  }

  const getFailureBgColor = (rate: number) => {
    if (rate >= 70) return 'bg-red-50 border-red-200'
    if (rate >= 50) return 'bg-orange-50 border-orange-200'
    return 'bg-yellow-50 border-yellow-200'
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 10) return <TrendingDown className="w-4 h-4 text-red-500" />
    if (trend > 0) return <AlertTriangle className="w-4 h-4 text-orange-500" />
    return <CheckCircle className="w-4 h-4 text-green-500" />
  }

  return (
    <Card className="p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <XCircle className="w-5 h-5 mr-2 text-red-500" />
            Technical Failure Analysis - {roleName}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Where your candidates consistently fail and what to look for when sourcing
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {failurePatterns.reduce((sum, p) => sum + p.totalAttempts, 0)} assessments analyzed
        </Badge>
      </div>

      <div className="space-y-4">
        {failurePatterns.map((pattern, index) => (
          <div key={index} className={`p-4 rounded-lg border ${getFailureBgColor(pattern.failureRate)}`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-semibold text-gray-900">{pattern.category}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {pattern.subcategory}
                  </Badge>
                  {getTrendIcon(pattern.trend)}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{pattern.totalAttempts} attempts</span>
                  <span>•</span>
                  <span className={`font-medium ${getFailureColor(pattern.failureRate)}`}>
                    {pattern.failureRate}% failure rate
                  </span>
                  {pattern.trend > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-red-600">+{pattern.trend}% worse this quarter</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Failure Rate</span>
                <span>{pattern.failureRate}%</span>
              </div>
              <Progress value={pattern.failureRate} className="h-2" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1 text-orange-500" />
                  Common Mistakes
                </h5>
                <ul className="space-y-1">
                  {pattern.commonMistakes.map((mistake, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-start">
                      <span className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                  Passing Candidate Profile
                </h5>
                <p className="text-xs text-gray-700 bg-green-50 p-2 rounded">
                  {pattern.passingCandidateProfile}
                </p>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-1 text-blue-500" />
                  Sourcing Recommendation
                </h5>
                <p className="text-xs text-blue-700 bg-blue-50 p-2 rounded font-medium">
                  {pattern.sourcingRecommendation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">💡 Key Sourcing Insights for {roleName}</h4>
        <div className="text-sm text-blue-800 space-y-1">
          {roleName === 'Frontend Engineer' && (
            <>
              <p>• <strong>Critical Gap:</strong> 71% fail on vanilla JavaScript - prioritize candidates with pre-framework experience</p>
              <p>• <strong>Red Flag:</strong> Candidates who only mention CSS frameworks often lack fundamentals</p>
              <p>• <strong>Green Flag:</strong> Look for "vanilla JavaScript", "DOM manipulation", or "performance optimization" in resumes</p>
            </>
          )}
          {roleName === 'Backend Engineer' && (
            <>
              <p>• <strong>Critical Gap:</strong> 78% fail algorithm analysis - CS degree or active practice essential</p>
              <p>• <strong>Red Flag:</strong> Candidates from small companies may lack scalability experience</p>
              <p>• <strong>Green Flag:</strong> Experience at high-traffic companies (>1M users) or public API companies</p>
            </>
          )}
          {roleName === 'Full Stack Engineer' && (
            <>
              <p>• <strong>Critical Gap:</strong> 69% fail DevOps questions - need deployment experience</p>
              <p>• <strong>Red Flag:</strong> Candidates who've only worked on one part of the stack</p>
              <p>• <strong>Green Flag:</strong> Startup experience where they owned entire features end-to-end</p>
            </>
          )}
          {roleName === 'Data Engineer' && (
            <>
              <p>• <strong>Critical Gap:</strong> 81% fail distributed computing - big data experience mandatory</p>
              <p>• <strong>Red Flag:</strong> Candidates with only SQL experience, no distributed frameworks</p>
              <p>• <strong>Green Flag:</strong> Hands-on Spark, Hadoop, or similar framework experience required</p>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}
