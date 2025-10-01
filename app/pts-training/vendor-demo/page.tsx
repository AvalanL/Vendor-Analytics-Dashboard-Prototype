'use client'

import { useState } from 'react'
import { ArrowLeft, Play, FileText, MessageSquare, Users, Clock, CheckCircle, X, HelpCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

// Vendor Demo Summary Data
const vendorDemoSummary = {
  title: "PTS Vendor-Side Demo Guide",
  overview: "This guide covers how to effectively demonstrate Partner Talent Solutions (PTS) from the vendor perspective, including access methods, core workflows, and advanced features like vendor results pages.",
  keyPoints: [
    "Vendors access PTS through their own dedicated workspace URLs (e.g., avarian-demo-vendor@karat.io)",
    "Two main workflows: Active Funnel (tracking candidate progress) and Invite Candidates",
    "Vendor Results Pages provide detailed feedback without compromising assessment integrity",
    "Demo uses Avarian (vendor) working with Diamondly (client) as example organizations"
  ],
  coreWorkflows: [
    {
      name: "Active Funnel",
      description: "Track all candidates submitted for client assessments",
      features: ["Real-time status tracking", "Recommendation visibility", "No need to contact clients for updates"],
      demoValue: "High - Shows immediate vendor value"
    },
    {
      name: "Invite Candidates",
      description: "Direct candidate invitation capabilities",
      features: ["Individual and bulk invites", "Role-specific permissions", "Self-schedule or schedule on behalf"],
      demoValue: "Medium - Shows workflow flexibility"
    },
    {
      name: "Vendor Results Pages",
      description: "Detailed candidate feedback without assessment integrity risk",
      features: ["Redacted technical feedback", "Strengths and improvement areas", "General guidance for future candidates"],
      demoValue: "High - Unique differentiator, requires special setup"
    }
  ],
  setupRequirements: {
    access: "Must be added as user and org admin in vendor organization (e.g., Avarian)",
    demoAccount: "Use shared demo account: avarian-demo-user credentials",
    vendorResultsPage: "Requires LaunchDarkly flag or Central setting - contact Griffin/Aram for setup"
  }
}

// Vendor Demo FAQ
const vendorDemoFAQ = [
  {
    id: 'vendor-access-001',
    question: 'How do I access the vendor demo environment?',
    answer: 'Vendors access through dedicated URLs like avarian-demo-vendor@karat.io. You need to be added as a user and organization admin. For demos, you can use the shared demo account credentials or get added as a user by an admin. In real scenarios, vendors log in directly to their workspace URL.',
    category: 'Technical',
    tags: ['vendor access', 'demo environment', 'workspace', 'credentials']
  },
  {
    id: 'vendor-workflow-001',
    question: 'What are the main vendor workflows to demonstrate?',
    answer: 'Focus on two core workflows: 1) Active Funnel - showing how vendors track candidate progress without contacting clients, and 2) Invite Candidates - demonstrating direct invitation capabilities. The vendor results page is a bonus feature that requires special setup but provides high demo value.',
    category: 'Features',
    tags: ['workflows', 'active funnel', 'candidate invites', 'core features']
  },
  {
    id: 'vendor-active-funnel-001',
    question: 'How do I demo the Active Funnel effectively?',
    answer: 'Show how vendors can see all candidates they\'ve submitted across different stages: Invited, Scheduled, Processing, Results. Emphasize the value proposition - vendors no longer need to bug clients for updates. Point out recommendation buckets and real-time status tracking. Note: Active Funnel loads slowly - acknowledge this during demos.',
    category: 'Features',
    tags: ['active funnel', 'candidate tracking', 'status updates', 'recommendations']
  },
  {
    id: 'vendor-results-page-001',
    question: 'What is the Vendor Results Page and how do I set it up?',
    answer: 'The Vendor Results Page shows redacted candidate feedback - strengths and improvement areas without compromising assessment integrity. It requires special setup: either a LaunchDarkly flag on your Central account or organization settings. Contact Griffin Hale or Aram for setup. This is not always included - confirm if your demo needs this feature.',
    category: 'Technical',
    tags: ['vendor results page', 'candidate feedback', 'launchdarkly', 'setup required']
  },
  {
    id: 'vendor-data-issues-001',
    question: 'What should I know about demo data quality for vendor demos?',
    answer: 'Similar to client-side demos, vendor demo data has issues (old test data from 5+ years ago). The SRE engineering team is working to fix this. For now, acknowledge the data quality during demos but show that the workflows and value proposition are clear. Focus on the process rather than specific data points.',
    category: 'Technical',
    tags: ['demo data', 'data quality', 'known issues', 'workarounds']
  },
  {
    id: 'vendor-invite-demo-001',
    question: 'How do I demonstrate the vendor invite functionality?',
    answer: 'Show the standard Karat invite experience but emphasize role-specific permissions - vendors only see roles they\'re authorized for. Demonstrate both individual and bulk invite options, and show scheduling flexibility (self-schedule or schedule on behalf). Any invited candidates will appear in Active Funnel under "Invited" status.',
    category: 'Features',
    tags: ['candidate invites', 'role permissions', 'scheduling', 'bulk invites']
  },
  {
    id: 'vendor-workspace-001',
    question: 'How do vendor workspaces work with multiple clients?',
    answer: 'Vendors can work with multiple clients through workspace selection. Each workspace represents a different client relationship (e.g., Diamondly, HSBC). When accessing a workspace, vendors see only data relevant to that client. Vendors also have their own company workspace for internal user management.',
    category: 'Features',
    tags: ['workspaces', 'multi-client', 'data isolation', 'user management']
  },
  {
    id: 'vendor-legal-001',
    question: 'What about the legal acceptance flow for new vendors?',
    answer: 'First-time vendor users must accept service terms from a legal perspective - this is built into the platform. This happens automatically on first login to a workspace. Mention this briefly during demos as it shows enterprise-ready compliance features.',
    category: 'Features',
    tags: ['legal acceptance', 'compliance', 'first login', 'terms of service']
  },
  {
    id: 'vendor-impersonation-001',
    question: 'Should I use impersonation or actual vendor login for demos?',
    answer: 'For real demos, use actual vendor login through their dedicated URL. For internal training or when access is limited, impersonation in Central works fine. Be transparent about which method you\'re using. The vendor experience is identical regardless of access method.',
    category: 'Technical',
    tags: ['impersonation', 'login methods', 'demo approach', 'access methods']
  },
  {
    id: 'vendor-results-integrity-001',
    question: 'How does the Vendor Results Page maintain assessment integrity?',
    answer: 'The vendor results page uses redacted summaries that provide thematic feedback without revealing specific questions or solutions. The "litmus test" is that candidate N+1 should have no advantage from reading candidate N\'s feedback. Focus on general areas like "coding style" or "time management" rather than specific technical details.',
    category: 'Features',
    tags: ['assessment integrity', 'feedback redaction', 'candidate fairness', 'security']
  },
  {
    id: 'vendor-demo-prep-001',
    question: 'How should I prepare for a vendor-side demo?',
    answer: 'Ensure you have vendor org access 30 minutes before. If demoing vendor results pages, confirm the LaunchDarkly flag is set up. Focus demo time on Active Funnel (high value) and briefly show invites. Only include vendor results pages if specifically requested and properly set up. Have Griffin/Aram contact info ready for technical setup questions.',
    category: 'Technical',
    tags: ['demo preparation', 'access requirements', 'feature prioritization', 'technical contacts']
  },
  {
    id: 'vendor-value-prop-001',
    question: 'What\'s the key value proposition for vendors in PTS?',
    answer: 'Eliminate the "black box" problem - vendors no longer need to contact clients for candidate status updates. They get real-time visibility into where candidates are in the assessment process, what recommendations they received, and can proactively manage their candidate pipeline. This transforms vendor-client communication from reactive to proactive.',
    category: 'Features',
    tags: ['value proposition', 'transparency', 'communication', 'pipeline management']
  }
]

// Demo Guide Component
function VendorDemoGuide() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{vendorDemoSummary.title}</h2>
        <p className="text-gray-700 text-lg leading-relaxed">{vendorDemoSummary.overview}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Demo Points</h3>
        <div className="grid gap-3">
          {vendorDemoSummary.keyPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-lg">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mt-0.5 flex-shrink-0">
                {index + 1}
              </div>
              <span className="text-gray-800 leading-relaxed">{point}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Core Vendor Workflows</h3>
        <div className="grid gap-6">
          {vendorDemoSummary.coreWorkflows.map((workflow, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{workflow.name}</h4>
                  <p className="text-gray-600 mb-3">{workflow.description}</p>
                </div>
                <Badge
                  variant="outline"
                  className={workflow.demoValue === 'High' ? 'border-green-200 bg-green-50 text-green-700' : 'border-yellow-200 bg-yellow-50 text-yellow-700'}
                >
                  {workflow.demoValue}
                </Badge>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Key Features:</h5>
                <ul className="space-y-1">
                  {workflow.features.map((feature, fIndex) => (
                    <li key={fIndex} className="text-sm text-gray-600 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Setup Requirements</h3>
        <Card className="p-6 border-orange-200 bg-orange-50">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Pre-Demo Setup Checklist</h4>
              <p className="text-gray-700 mb-4">Complete these steps before any vendor demo:</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
              <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-gray-900">Access Requirements</h5>
                <p className="text-sm text-gray-600">{vendorDemoSummary.setupRequirements.access}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
              <Users className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-gray-900">Demo Account Available</h5>
                <p className="text-sm text-gray-600">{vendorDemoSummary.setupRequirements.demoAccount}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-yellow-200 bg-yellow-50">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-gray-900">Vendor Results Page</h5>
                <p className="text-sm text-gray-700 font-medium">{vendorDemoSummary.setupRequirements.vendorResultsPage}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h5 className="font-semibold text-blue-900 mb-2">Technical Contacts for Setup</h5>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Griffin Hale</strong> - LaunchDarkly flags and vendor results page setup</p>
              <p><strong>Aram</strong> - SRE Engineering team, demo data fixes</p>
              <p><strong>Arun</strong> - Product Lead for PTS</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// FAQ Component
function VendorDemoFAQ() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

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
      case 'Technical': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Features': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Vendor Demo FAQ</h2>
        <p className="text-gray-600 text-lg">
          Common questions and best practices for demonstrating PTS from the vendor perspective.
        </p>
      </div>

      <div className="grid gap-4">
        {vendorDemoFAQ.map((faq) => (
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
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed text-base">{faq.answer}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function VendorDemoTrainingPage() {
  const videoUrl = '/videos/PTS-demo-vendor-side.mp4'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/pts-training" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                Back to Training
              </Link>
              <div className="w-px h-6 bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">PTS Vendor Demo Training</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="video" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto">
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Video
            </TabsTrigger>
            <TabsTrigger value="guide" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Demo Guide
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              FAQ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video" className="space-y-6">
            <div className="max-w-5xl mx-auto">
              <div className="bg-black rounded-xl overflow-hidden shadow-2xl" style={{ aspectRatio: '16/9' }}>
                <video
                  className="w-full h-full"
                  controls
                  preload="metadata"
                  src={videoUrl}
                >
                  <source src={videoUrl} type="video/quicktime" />
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">PTS Demo - Vendor Side</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Complete walkthrough of the Partner Talent Solutions system from the vendor perspective.
                  This internal training video covers workspace access, Active Funnel workflow, candidate invitations, and vendor results pages.
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Demo Execution</Badge>
                  </span>
                  <span className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Beginner</Badge>
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Full Walkthrough
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-6">
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-sm border">
              <VendorDemoGuide />
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <VendorDemoFAQ />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}