'use client'

import { useState } from 'react'
import { KaratSidebar } from '@/components/karat-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, TrendingUp, CheckCircle, XCircle, AlertCircle, Code, Server, Database, Layers, Layout, Search, Workflow } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface AssessmentArea {
  name: string
  description: string
  icon: string
}

interface RoleStats {
  submissionVolume: string
  aboveBarRate: string
  recommendationDistribution: {
    doNotPass: number
    requiresFurtherReview: number
    inviteToNextRound: number
    fastTrack: number
  }
}

interface Role {
  id: string
  title: string
  description: string
  seniorityLevels: string[]
  areasAssessed: AssessmentArea[]
  stats: RoleStats
}

const mockRoles: Role[] = [
  {
    id: 'frontend-engineer',
    title: 'Frontend Engineer',
    description: 'Develops user-facing applications using modern JavaScript frameworks, HTML, CSS, and related technologies. Focuses on creating responsive, accessible, and performant web experiences.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    areasAssessed: [
      {
        name: 'Problem Solving & Coding',
        description: 'JavaScript/TypeScript fundamentals, algorithmic thinking, code quality and structure',
        icon: 'code'
      },
      {
        name: 'Frontend Systems & Architecture',
        description: 'Component design, state management, performance optimization, browser APIs',
        icon: 'layout'
      },
      {
        name: 'Communication & Collaboration',
        description: 'Technical explanation, problem-solving approach, working through requirements',
        icon: 'users'
      }
    ],
    stats: {
      submissionVolume: '15-20% of total submissions',
      aboveBarRate: '25-35%',
      recommendationDistribution: {
        doNotPass: 40,
        requiresFurtherReview: 25,
        inviteToNextRound: 25,
        fastTrack: 10
      }
    }
  },
  {
    id: 'backend-engineer',
    title: 'Backend Engineer',
    description: 'Builds server-side applications, APIs, and distributed systems. Works with databases, cloud services, and scalable architecture patterns.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    areasAssessed: [
      {
        name: 'Problem Solving & Coding',
        description: 'Core programming concepts, data structures, algorithms, code quality',
        icon: 'code'
      },
      {
        name: 'System Design & Architecture',
        description: 'API design, database modeling, scalability, distributed systems concepts',
        icon: 'server'
      },
      {
        name: 'Communication & Collaboration',
        description: 'Technical explanation, problem-solving approach, requirements analysis',
        icon: 'users'
      }
    ],
    stats: {
      submissionVolume: '25-30% of total submissions',
      aboveBarRate: '20-30%',
      recommendationDistribution: {
        doNotPass: 45,
        requiresFurtherReview: 25,
        inviteToNextRound: 20,
        fastTrack: 10
      }
    }
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    description: 'Designs and maintains data pipelines, ETL processes, and data infrastructure. Works with big data technologies and ensures data quality and accessibility.',
    seniorityLevels: ['Mid-level (3-5 years)', 'Senior (5+ years)'],
    areasAssessed: [
      {
        name: 'Data Modeling & SQL',
        description: 'Database design, complex queries, data warehousing concepts, performance optimization',
        icon: 'database'
      },
      {
        name: 'ETL/Workflow Design',
        description: 'Pipeline architecture, data transformation, workflow orchestration, error handling',
        icon: 'workflow'
      },
      {
        name: 'Problem Solving',
        description: 'Analytical thinking, debugging data issues, optimization strategies',
        icon: 'search'
      }
    ],
    stats: {
      submissionVolume: '8-12% of total submissions',
      aboveBarRate: '30-40%',
      recommendationDistribution: {
        doNotPass: 35,
        requiresFurtherReview: 30,
        inviteToNextRound: 25,
        fastTrack: 10
      }
    }
  },
  {
    id: 'full-stack-engineer',
    title: 'Full Stack Engineer',
    description: 'Works across the entire technology stack, from frontend user interfaces to backend services and databases. Versatile in multiple technologies.',
    seniorityLevels: ['Mid-level (3-5 years)', 'Senior (5+ years)'],
    areasAssessed: [
      {
        name: 'Problem Solving & Coding',
        description: 'Multi-language proficiency, algorithmic thinking, code organization',
        icon: 'code'
      },
      {
        name: 'Full Stack Architecture',
        description: 'End-to-end system design, API integration, database interaction, deployment',
        icon: 'layers'
      },
      {
        name: 'Communication & Collaboration',
        description: 'Cross-functional communication, technical trade-offs, project planning',
        icon: 'users'
      }
    ],
    stats: {
      submissionVolume: '20-25% of total submissions',
      aboveBarRate: '22-32%',
      recommendationDistribution: {
        doNotPass: 42,
        requiresFurtherReview: 26,
        inviteToNextRound: 22,
        fastTrack: 10
      }
    }
  }
]

function getIconComponent(iconName: string) {
  const icons: Record<string, any> = {
    code: Code,
    users: Users,
    layout: Layout,
    server: Server,
    database: Database,
    search: Search,
    workflow: Workflow,
    layers: Layers
  }
  return icons[iconName] || Code
}

export default function RoleDetailPage() {
  const params = useParams()
  const roleId = params?.roleId as string
  
  const role = mockRoles.find(r => r.id === roleId)
  
  if (!role) {
    return (
      <div className="flex h-screen w-full bg-[#FAFAFA] overflow-hidden">
        <SidebarProvider defaultOpen={true}>
          <div className="h-full">
            <KaratSidebar />
          </div>
          <SidebarInset className="overflow-auto">
            <main className="flex-1 py-6 px-8 md:px-12 lg:px-16">
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Role Not Found</h1>
                <p className="text-gray-600 mb-4">The requested role could not be found.</p>
                <Link href="/roles">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Roles
                  </Button>
                </Link>
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] overflow-hidden">
      <SidebarProvider defaultOpen={true}>
        <div className="h-full">
          <KaratSidebar />
        </div>
        <SidebarInset className="overflow-auto">
          <main className="flex-1 py-6 px-8 md:px-12 lg:px-16">
            <div className="mb-6">
              <Link href="/roles">
                <Button variant="outline" className="mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Role Directory
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{role.title}</h1>
              <p className="text-gray-600">{role.description}</p>
            </div>

            {/* Role Overview - Using Exact Same Design */}
            <Card className="p-6 mb-4 shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{role.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{role.description}</p>
                  <div className="flex gap-2">
                    {role.seniorityLevels.map((level, index) => (
                      <span
                        key={index}
                        className={`${index === 0 ? 'bg-purple-600' : index === 1 ? 'bg-emerald-500' : 'bg-emerald-600'} text-white text-xs px-3 py-1 rounded-full font-medium inline-block`}
                      >
                        {level.split(' (')[0]}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-12">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{role.stats.submissionVolume.split('-')[0].replace('%', '')}</div>
                    <div className="text-sm text-gray-600">Submission<br />Volume %</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{role.stats.aboveBarRate.split('-')[0].replace('%', '')}</div>
                    <div className="text-sm text-gray-600">Above Bar<br />Rate %</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{role.areasAssessed.length}</div>
                    <div className="text-sm text-gray-600">Assessment<br />Areas</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Areas Assessed - Exact Same Table Design */}
            <Card className="p-6 mb-4 shadow-sm border border-gray-200">
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Assessment Area
                  </div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide text-center">
                    Focus Areas<br />
                    (Key Competencies)
                  </div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide text-center">
                    Importance<br />
                    (Assessment Weight)
                  </div>
                </div>

                {role.areasAssessed.map((area, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-center py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-2">
                      <div className="text-gray-700 text-sm">{area.name}</div>
                    </div>
                    <div className="text-center text-sm text-gray-700">{area.description}</div>
                    <div className="text-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">High</span>
                        <div className="flex-1">
                          <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${index === 0 ? 'bg-teal-500' : index === 1 ? 'bg-blue-500' : 'bg-sky-400'} rounded-full`}
                              style={{ width: '80%' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-3 gap-4 items-center py-3 mt-2 font-medium">
                  <div className="text-sm text-gray-900">OVERALL</div>
                  <div className="text-center text-sm text-gray-900">Comprehensive Assessment</div>
                  <div className="text-center text-sm text-gray-900">100%</div>
                </div>
              </div>
            </Card>

            {/* Role-Specific Statistics */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Role Statistics & Benchmarking</h2>
              <p className="text-sm text-gray-600 mb-6">
                Aggregated performance data for this role type, refreshed quarterly. Use these ranges to calibrate sourcing quality and set realistic expectations.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Submission Volume</h3>
                  <div className="text-2xl font-bold text-blue-600">{role.stats.submissionVolume}</div>
                  <p className="text-xs text-gray-600">of total vendor submissions</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Historical Above-Bar Rate</h3>
                  <div className="text-2xl font-bold text-emerald-600">{role.stats.aboveBarRate}</div>
                  <p className="text-xs text-gray-600">candidates advance above bar</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-4">Recommendation Distribution</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-sm text-gray-700">Do Not Pass</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">~{role.stats.recommendationDistribution.doNotPass}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="text-sm text-gray-700">Requires Further Review</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">~{role.stats.recommendationDistribution.requiresFurtherReview}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-sm text-gray-700">Invite to Next Round</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">~{role.stats.recommendationDistribution.inviteToNextRound}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-sm text-gray-700">Fast Track</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">~{role.stats.recommendationDistribution.fastTrack}%</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* General Guidelines */}
            <Card className="p-6 mb-6 bg-amber-50 border-amber-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Important Reminders</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    Statistics are directional and anonymized. Individual performance may vary based on candidate quality, market conditions, and specific client requirements.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    Do not use this information to reverse-engineer assessments or provide specific coaching to candidates.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    Focus on submitting candidates who genuinely align with the role requirements and competency areas.
                  </div>
                </div>
              </div>
            </Card>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
