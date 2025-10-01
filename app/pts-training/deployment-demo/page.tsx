'use client'

import { Suspense, useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Play, Users, HelpCircle, Settings, FileText, Clock, Calendar, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

const deploymentDemoSummary = {
  title: "PTS Deployment Team Training Guide",
  overview: "Comprehensive training for the implementation team covering PTS setup, client demos, vendor management, and ongoing support. This session transfers critical knowledge for supporting Partner Talent Solutions across client implementations.",
  keyPoints: [
    "Two-sided platform architecture: Client analytics dashboard and vendor active funnel",
    "Setup requires LaunchDarkly flags (transitioning to Central settings)",
    "Three analytical perspectives: Overview (vendor-centric), Job Families, and Roles",
    "Vendor connection management through Central with careful organization mapping",
    "Demo best practices: Use staging environment with better data than Diamondly",
    "Data integrity: Only shipped interviews with Karat recommendations included",
    "Export capabilities for all dashboard views (Excel/CSV)",
    "Team responsibilities clearly defined across implementations"
  ],
  coreComponents: [
    {
      name: "Client Analytics Dashboard",
      description: "Main client-facing feature with vendor performance insights",
      features: ["Dynamic filtering by date/vendor/job family", "Three analytical perspectives", "Data export capabilities", "Key performance metrics"],
      demoValue: "High - Shows clear ROI and vendor optimization opportunities"
    },
    {
      name: "Vendor Active Funnel",
      description: "Real-time candidate progress tracking for vendors",
      features: ["Full candidate pipeline visibility", "Invitation capabilities", "Structured results with feedback", "Multi-client workspace support"],
      demoValue: "High - Demonstrates immediate vendor value and process transparency"
    },
    {
      name: "Setup & Configuration",
      description: "Internal tools for connecting vendors and managing access",
      features: ["Vendor connection management", "Role-based permissions", "Access provisioning", "LaunchDarkly flag management"],
      demoValue: "Low - Internal process, don't demo to clients"
    }
  ]
}

type DeploymentVideoPart = 'part1' | 'part2'

const deploymentVideoParts: { id: DeploymentVideoPart; label: string; src: string }[] = [
  {
    id: 'part1',
    label: 'Part 1',
    src: '/videos/PTS-Deployment-Demo-Training-Part1.mp4'
  },
  {
    id: 'part2',
    label: 'Part 2',
    src: '/videos/PTS-Deployment-Demo-Training-Part2.mp4'
  }
]

const deploymentDemoFAQ = [
  {
    id: 'setup-new-client',
    category: 'Setup',
    question: 'How do we set up PTS for a new client?',
    answer: 'Currently requires LaunchDarkly flags - contact Griffin or Aram from engineering team. This is being moved to Central settings (expected within a week). Once enabled, you\'ll see a "Vendors" tab in the client\'s organization page.',
    tags: ['Setup', 'LaunchDarkly', 'Central', 'Engineering']
  },
  {
    id: 'connect-vendors',
    category: 'Setup',
    question: 'How do we connect vendors to clients?',
    answer: 'Done through Central\'s Vendors tab. Add vendor name, set to active, and carefully select the correct Karat organization from dropdown. This establishes the critical connection. Control invitation permissions with the toggle.',
    tags: ['Vendor Management', 'Central', 'Organization Mapping']
  },
  {
    id: 'linked-vs-nonlinked',
    category: 'Setup',
    question: 'What\'s the difference between linked and non-linked vendors?',
    answer: 'Linked vendors have their own Karat organization and can log in to see active funnel, invite candidates, and view results. Non-linked vendors exist only as data tags - clients can assign candidates to them, but vendors cannot access the platform.',
    tags: ['Vendor Types', 'Access Control', 'Platform Access']
  },
  {
    id: 'demo-environment',
    category: 'Demo',
    question: 'Should we demo in production or staging?',
    answer: 'Use staging for client demos - it has better, more realistic data that tells a clearer story. Diamondly\'s demo data is currently messy and not ideal for storytelling (engineering is working to fix this).',
    tags: ['Demo Environment', 'Staging', 'Data Quality']
  },
  {
    id: 'demo-access',
    category: 'Demo',
    question: 'How do we get access to demo PTS features?',
    answer: 'Contact Griffin or Aram for setup. Options: 1) Admin access for impersonation, 2) Demo user accounts, 3) Staging environment credentials. For vendor-side demos, use Avarian demo vendor organization.',
    tags: ['Access', 'Demo Setup', 'User Accounts']
  },
  {
    id: 'demo-avoid',
    category: 'Demo',
    question: 'What should we avoid showing in demos?',
    answer: 'Don\'t show internal vendor setup interface - adds no client value. Be cautious with "Other" job family data as it raises confusing questions. Focus on client-facing Vendor Analytics Dashboard and vendor active funnel features.',
    tags: ['Demo Best Practices', 'Client Value', 'Presentation']
  },
  {
    id: 'analytics-data',
    category: 'Analytics',
    question: 'What data is included in the Vendor Analytics Dashboard?',
    answer: 'Only candidacies with shipped interviews and Karat recommendations. Excludes in-flux candidates (invited, scheduled, etc.). Shows: candidates above bar, time in process, no-shows, late cancellations, integrity flags, and placements.',
    tags: ['Data Inclusion', 'Analytics', 'Metrics']
  },
  {
    id: 'integrity-flags',
    category: 'Analytics',
    question: 'How are integrity flags handled in metrics?',
    answer: 'Candidates who passed but received integrity flags are counted in total volume (denominator) but excluded from candidates above bar count (numerator). This ensures the metric reflects truly qualified candidates who didn\'t cheat.',
    tags: ['Data Integrity', 'Metrics Calculation', 'Quality Control']
  },
  {
    id: 'data-export',
    category: 'Analytics',
    question: 'Can clients export the analytics data?',
    answer: 'Yes, any view in the Vendor Analytics Dashboard can be exported as Excel or CSV files using the export button. This includes all filtered views and data perspectives.',
    tags: ['Export', 'Data Access', 'Client Tools']
  },
  {
    id: 'vendor-capabilities',
    category: 'Vendor Experience',
    question: 'What can vendors see and do on the platform?',
    answer: 'Vendors can: 1) View active funnel showing candidate progress, 2) Invite candidates to authorized roles, 3) See Karat recommendations, 4) Access results pages with structured feedback, 5) Work across multiple client workspaces.',
    tags: ['Vendor Features', 'Platform Capabilities', 'Multi-client']
  },
  {
    id: 'vendor-results',
    category: 'Vendor Experience',
    question: 'What information is included in vendor results pages?',
    answer: 'Vendors see: Karat recommendation, assessment components, structured feedback (strengths/areas for improvement), candidate name and date. They do NOT see scores, videos, or detailed question information.',
    tags: ['Results Access', 'Information Security', 'Feedback Structure']
  },
  {
    id: 'feedback-design',
    category: 'Vendor Experience',
    question: 'How is vendor results feedback designed to prevent gaming?',
    answer: 'Feedback uses a "litmus test" - a second candidate reading the feedback should not have an advantage over the first. Feedback is applicable but broad enough to not compromise assessment integrity while providing sourcing improvement value.',
    tags: ['Security', 'Feedback Design', 'Assessment Integrity']
  },
  {
    id: 'client-analysis',
    category: 'Client Workflow',
    question: 'How do clients analyze vendor performance?',
    answer: 'Three perspectives in Vendor Analytics Dashboard: 1) Overview tab (vendor-centric with job family drill-downs), 2) Job Families tab (job family-centric with vendor drill-downs), 3) Roles tab (role-specific analysis). All support dynamic filtering.',
    tags: ['Analytics Perspectives', 'Performance Analysis', 'Filtering']
  },
  {
    id: 'client-value',
    category: 'Client Workflow',
    question: 'What\'s the value proposition for clients using PTS?',
    answer: 'Clients get: 1) Data-driven vendor performance insights, 2) Budget optimization based on vendor strengths by job family, 3) Quality metrics (above bar rates), 4) Operational insights (time/cancellations), 5) Granular analysis for matching vendor strengths with hiring needs.',
    tags: ['Value Proposition', 'ROI', 'Vendor Optimization']
  },
  {
    id: 'budgeting-decisions',
    category: 'Client Workflow',
    question: 'How should clients make vendor budgeting decisions?',
    answer: 'Use job family drill-down data to identify each vendor\'s strengths. Example: if Vendor A excels in mobile and Vendor B in backend, allocate accordingly. Consider both pass rates and volume. Rate card information (not in Karat) would be the final budgeting factor.',
    tags: ['Budget Allocation', 'Vendor Strengths', 'Decision Making']
  },
  {
    id: 'team-responsibilities',
    category: 'Implementation',
    question: 'Who handles PTS setup during implementation?',
    answer: 'Implementation team owns setup and support: Dana Rodriguez (overall coordination), MJ (Cognizant/Citizens), Ran (HSBC), Megan (backend setup and support). Arun owns product (taking over from Benjamin Warberg who\'s on paternity leave).',
    tags: ['Team Structure', 'Responsibilities', 'Support Contacts']
  },
  {
    id: 'current-limitations',
    category: 'Implementation',
    question: 'What are the current limitations or rough edges?',
    answer: 'Known issues: 1) Diamondly demo data needs improvement, 2) LaunchDarkly flags required for setup (being fixed), 3) Some vendor results show empty data from old demos, 4) Placement data may show "not applicable" for newer implementations, 5) Role-level analysis can be messy.',
    tags: ['Known Issues', 'Limitations', 'Future Improvements']
  },
  {
    id: 'redo-scenarios',
    category: 'Implementation',
    question: 'How do we handle redo scenarios in the data?',
    answer: 'Currently, both attempts are counted in analytics, which could skew metrics. Sydney is working on a solution across all Karat data (not just vendor data). This should be addressed in future updates.',
    tags: ['Data Accuracy', 'Redo Handling', 'Future Improvements']
  }
]

export default function DeploymentDemoPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-16 text-gray-500">Loading deployment training…</div>}>
      <DeploymentDemoContent />
    </Suspense>
  )
}

function DeploymentDemoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedVideoPart, setSelectedVideoPart] = useState<DeploymentVideoPart>('part1')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const activeVideoPart = deploymentVideoParts.find((part) => part.id === selectedVideoPart) ?? deploymentVideoParts[0]

  useEffect(() => {
    const partParam = searchParams.get('part')
    const nextPart: DeploymentVideoPart = partParam === 'part2' ? 'part2' : 'part1'
    setSelectedVideoPart((prev) => (prev === nextPart ? prev : nextPart))
  }, [searchParams])

  const handleVideoPartChange = (value: string) => {
    const part = value === 'part2' ? 'part2' : 'part1'
    setSelectedVideoPart(part)

    const params = new URLSearchParams(searchParams.toString())
    if (part === 'part1') {
      params.delete('part')
    } else {
      params.set('part', part)
    }

    const queryString = params.toString()
    router.replace(`/pts-training/deployment-demo${queryString ? `?${queryString}` : ''}`, { scroll: false })
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Setup': return 'bg-blue-100 text-blue-800'
      case 'Demo': return 'bg-green-100 text-green-800'
      case 'Analytics': return 'bg-purple-100 text-purple-800'
      case 'Vendor Experience': return 'bg-orange-100 text-orange-800'
      case 'Client Workflow': return 'bg-cyan-100 text-cyan-800'
      case 'Implementation': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/pts-training">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Training
                </Button>
              </Link>
              <div className="h-6 border-l border-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PTS Deployment Training</h1>
                <p className="text-sm text-gray-600">Implementation Team Knowledge Transfer</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-orange-100 text-orange-800" variant="secondary">
                Internal Training
              </Badge>
              <Badge className="bg-green-100 text-green-800" variant="secondary">
                September 29, 2025
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="video" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto">
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Video
            </TabsTrigger>
            <TabsTrigger value="guide" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Training Guide
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video">
            <Card className="p-6 space-y-6">
              <Tabs
                value={selectedVideoPart}
                onValueChange={handleVideoPartChange}
                className="space-y-4"
              >
                <TabsList className="grid w-full max-w-xs grid-cols-2 mx-auto">
                  {deploymentVideoParts.map((part) => (
                    <TabsTrigger key={part.id} value={part.id} className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      {part.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {deploymentVideoParts.map((part) => (
                  <TabsContent key={part.id} value={part.id} className="mt-0">
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                      <video
                        key={part.id}
                        controls
                        className="w-full h-full rounded-lg"
                        poster=""
                      >
                        <source src={part.src} type="video/quicktime" />
                        <source src={part.src} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">PTS Deployment Team Training</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      September 29, 2025
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Implementation Team
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Currently viewing {activeVideoPart.label}
                </div>
                <p className="text-gray-700">
                  Comprehensive knowledge transfer session covering PTS setup, client demos, vendor management,
                  and ongoing support responsibilities for the implementation team.
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="guide">
            <div className="grid gap-6">
              {/* Training Overview */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="w-6 h-6 text-orange-600" />
                  <h2 className="text-xl font-semibold">{deploymentDemoSummary.title}</h2>
                </div>
                <p className="text-gray-700 mb-4">{deploymentDemoSummary.overview}</p>

                <h3 className="font-semibold text-gray-900 mb-3">Key Training Points:</h3>
                <ul className="space-y-2">
                  {deploymentDemoSummary.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Core Components */}
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold text-gray-900">PTS Core Components</h3>
                {deploymentDemoSummary.coreComponents.map((component, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{component.name}</h4>
                      <Badge
                        className={component.demoValue === 'High' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        variant="secondary"
                      >
                        Demo Value: {component.demoValue}
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-3">{component.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {component.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Team Contacts */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Key Team Contacts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="font-semibold text-orange-900 mb-2">Implementation Team</h5>
                    <div className="text-sm text-orange-800 space-y-1">
                      <p><strong>Dana Rodriguez</strong> - Implementation team coordination</p>
                      <p><strong>MJ (Mridul Juyal)</strong> - Cognizant/Citizens implementation</p>
                      <p><strong>Ran</strong> - HSBC demo and implementation</p>
                      <p><strong>Megan</strong> - Backend setup and support questions</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h5 className="font-semibold text-blue-900 mb-2">Technical & Product</h5>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p><strong>Griffin & Aram</strong> - Engineering team, technical setup</p>
                      <p><strong>Arun</strong> - Product Lead for PTS</p>
                      <p><strong>Benjamin Warberg</strong> - Previous product lead (semi-available)</p>
                      <p><strong>Sydney</strong> - Data accuracy improvements</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="faq">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
                <Badge className="bg-orange-100 text-orange-800" variant="secondary">
                  {deploymentDemoFAQ.length} Questions
                </Badge>
              </div>

              <div className="grid gap-4 overflow-y-auto max-h-[70vh]">
                {deploymentDemoFAQ.map((faq) => (
                  <Card key={faq.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div
                      className="p-6 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleExpanded(faq.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className={getCategoryColor(faq.category)} variant="outline">
                              {faq.category}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-snug">{faq.question}</h3>
                          <div className="flex flex-wrap gap-2">
                            {faq.tags.slice(0, 4).map((tag) => (
                              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                            {faq.tags.length > 4 && (
                              <span className="text-xs text-gray-500">+{faq.tags.length - 4} more</span>
                            )}
                          </div>
                        </div>
                        <HelpCircle className={`w-6 h-6 text-gray-400 transition-transform duration-200 ml-4 flex-shrink-0 ${
                          expandedItems.has(faq.id) ? 'rotate-180' : ''
                        }`} />
                      </div>

                      {expandedItems.has(faq.id) && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
