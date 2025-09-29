'use client'

import { useState } from 'react'
import { ArrowLeft, Play, FileText, MessageSquare, Monitor, Clock, CheckCircle, X, HelpCircle } from 'lucide-react'
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

// Import the data from the main page
const clientDemoSummary = {
  title: "PTS Client-Side Demo Guide",
  overview: "This guide covers how to effectively demonstrate Partner Talent Solutions (PTS) from the client perspective, including setup, navigation, and key talking points for prospect meetings.",
  keyPoints: [
    "PTS connects client organizations with vendor partners through a centralized analytics platform",
    "Demo uses Diamondly (client) and Avarian (vendor) as example organizations",
    "Vendor Analytics Dashboard provides real-time insights into partner performance",
    "Data helps clients make informed budget allocation and vendor relationship decisions"
  ],
  demoEnvironments: {
    production: {
      name: "Diamondly on Central",
      pros: ["Stable environment", "No risk of changes during demo"],
      cons: ["Demo data has known issues (blank job families, NA values)", "Limited storyline capability"],
      recommendation: "Use only if staging is unavailable"
    },
    staging: {
      name: "PTS Demo on Staging",
      pros: ["Better data quality", "Complete storylines", "Realistic vendor performance patterns"],
      cons: ["Risk of environment changes", "Contains obfuscated client data"],
      recommendation: "Preferred for demos until production data is fixed"
    }
  }
}

const clientDemoFAQ = [
  {
    id: 'demo-access-001',
    question: 'How do I access the demo environment for client presentations?',
    answer: 'There are two ways: 1) Log in directly as a user in the Diamondly organization, or 2) Access as a Central admin and navigate to Organizations > Diamondly > Vendors. The second method is often easier and doesn\'t require separate login credentials.',
    category: 'Technical',
    tags: ['demo access', 'login', 'diamondly', 'central']
  },
  {
    id: 'demo-setup-001',
    question: 'Should I show the vendor setup process during client demos?',
    answer: 'No, avoid showing vendor setup during client-facing demos. This is an internal administrative process that happens behind the scenes. Instead, focus on the end result - show how the analytics dashboard provides insights once vendors are already configured. Clients care about the value and insights, not the setup mechanics.',
    category: 'Features',
    tags: ['vendor setup', 'client demo', 'focus areas']
  },
  {
    id: 'demo-data-001',
    question: 'What timeline should I use for the demo to show meaningful data?',
    answer: 'Default to 1 year for demos. This provides enough data volume to show interesting patterns and statistically significant sample sizes. Avoid shorter timeframes unless specifically requested, as they may not provide enough context for meaningful insights.',
    category: 'Features',
    tags: ['timeline', 'data volume', 'sample size']
  },
  {
    id: 'demo-story-001',
    question: 'What\'s the key storyline for the Vendor Analytics Dashboard?',
    answer: 'Focus on "not all vendors are created equal" - some excel in specific job families while struggling in others. Use real examples: show how Vendor A might have 89% pass rate in Data but 11% in Backend, while Vendor B is the opposite. This demonstrates how clients can optimize budget allocation based on actual performance data rather than anecdotes.',
    category: 'Features',
    tags: ['vendor analytics', 'performance comparison', 'budget allocation']
  },
  {
    id: 'demo-metrics-001',
    question: 'What are the key metrics to highlight in the dashboard?',
    answer: 'Focus on: 1) Candidates Above Bar (adjusted for integrity flags), 2) Pass rates by job family, 3) Volume metrics, 4) Integrity flag percentages, 5) Placement data (where available). Explain that "Above Bar" means candidates who passed AND had no integrity flags - giving clients confidence in quality.',
    category: 'Features',
    tags: ['metrics', 'above bar', 'integrity flags', 'pass rates']
  },
  {
    id: 'demo-navigation-001',
    question: 'How should I navigate between the different dashboard tabs?',
    answer: 'Start with Overview (vendor-centric view), then move to Job Families (role-type-centric view). Avoid the Roles tab as it will be replaced by Archetypes. Emphasize that all views are dynamic - selections in filters instantly update all data on the page.',
    category: 'Features',
    tags: ['navigation', 'dashboard tabs', 'dynamic filtering']
  },
  {
    id: 'demo-filtering-001',
    question: 'How do I demonstrate the filtering and analysis capabilities?',
    answer: 'Show multi-select functionality - select 2-3 vendors and specific job families to demonstrate how the data updates dynamically. Highlight the expandable vendor cards showing job family breakdowns, and demonstrate the export functionality for further analysis. Always mention that everything is searchable and customizable.',
    category: 'Features',
    tags: ['filtering', 'multi-select', 'export', 'analysis']
  },
  {
    id: 'demo-issues-001',
    question: 'How do I avoid showing data issues like N/A values or blank job families during demos?',
    answer: 'NEVER demo with visible data issues - this destroys credibility. Always pre-screen your demo environment and identify vendors with clean data. Use staging environment when possible as it has better data quality. Have 2-3 "safe" vendors pre-selected that show clear, compelling stories. If you accidentally encounter bad data, immediately navigate away and focus on your prepared examples.',
    category: 'Technical',
    tags: ['data quality', 'demo preparation', 'credibility']
  },
  {
    id: 'demo-value-001',
    question: 'How do I articulate the business value during the demo?',
    answer: 'Emphasize moving from anecdotal vendor management to data-driven decisions. Highlight: "You\'re spending millions on talent partners but don\'t know who\'s performing. PTS gives you real-time access to compare apples-to-apples performance, helping you optimize budget allocation and improve vendor relationships based on actual results."',
    category: 'Features',
    tags: ['business value', 'roi', 'data-driven decisions']
  },
  {
    id: 'demo-client-invite-001',
    question: 'Should I show the client invite functionality?',
    answer: 'Yes, briefly demonstrate that clients can still invite candidates directly and attribute them to specific vendors using the vendor dropdown in the invite flow. This shows flexibility - vendors can invite directly OR clients can invite on behalf of vendors, with all data properly attributed.',
    category: 'Features',
    tags: ['client invites', 'vendor attribution', 'invite flow']
  },
  {
    id: 'demo-sample-size-001',
    question: 'How do I handle questions about small sample sizes in the data?',
    answer: 'Always call attention to sample sizes - if a vendor shows 100% pass rate but only has 2 candidates, mention that larger sample sizes provide more reliable insights. Use this to demonstrate why the 1-year timeline is valuable and why clients need consistent data over time to make decisions.',
    category: 'Features',
    tags: ['sample size', 'data reliability', 'statistical significance']
  },
  {
    id: 'demo-preparation-001',
    question: 'How should I prepare before a client demo?',
    answer: 'Always prepare thoroughly: 1) Log in 30 minutes before and identify 2-3 vendors with clean, compelling data, 2) Test your narrative flow with specific examples, 3) Verify no N/A values or blank job families are visible, 4) Have your key talking points ready, 5) Prepare for common objections. Never wing a demo - preparation is everything for credibility.',
    category: 'Technical',
    tags: ['demo preparation', 'best practices', 'planning']
  },
  {
    id: 'demo-future-001',
    question: 'What features are coming soon that I should mention?',
    answer: 'Mention that rate card integration is in development, which will allow clients to see cost-effectiveness alongside performance metrics. Also note the transition from "Roles" to "Archetypes" for better job classification. The Trends timeline view is being polished and will provide historical performance tracking.',
    category: 'Features',
    tags: ['roadmap', 'rate cards', 'archetypes', 'trends']
  }
]

// Demo Guide Component
function DemoGuide() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{clientDemoSummary.title}</h2>
        <p className="text-gray-700 text-lg leading-relaxed">{clientDemoSummary.overview}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Demo Points</h3>
        <div className="grid gap-3">
          {clientDemoSummary.keyPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mt-0.5 flex-shrink-0">
                {index + 1}
              </div>
              <span className="text-gray-800 leading-relaxed">{point}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Demo Environments</h3>
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Monitor className="w-6 h-6 text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">{clientDemoSummary.demoEnvironments.production.name}</h4>
            </div>
            <p className="text-gray-600 mb-4">{clientDemoSummary.demoEnvironments.production.recommendation}</p>

            <div className="grid gap-4">
              <div>
                <h5 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  PROS
                </h5>
                <ul className="space-y-2">
                  {clientDemoSummary.demoEnvironments.production.pros.map((pro, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                  <X className="w-4 h-4" />
                  CONS
                </h5>
                <ul className="space-y-2">
                  {clientDemoSummary.demoEnvironments.production.cons.map((con, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-blue-200 bg-blue-50 border-2">
            <div className="flex items-center gap-3 mb-4">
              <Monitor className="w-6 h-6 text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">{clientDemoSummary.demoEnvironments.staging.name}</h4>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">Recommended</Badge>
            </div>
            <p className="text-gray-700 mb-4 font-medium">{clientDemoSummary.demoEnvironments.staging.recommendation}</p>

            <div className="grid gap-4">
              <div>
                <h5 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  PROS
                </h5>
                <ul className="space-y-2">
                  {clientDemoSummary.demoEnvironments.staging.pros.map((pro, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                  <X className="w-4 h-4" />
                  CONS
                </h5>
                <ul className="space-y-2">
                  {clientDemoSummary.demoEnvironments.staging.cons.map((con, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// FAQ Component
function DemoFAQ() {
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Client Demo FAQ</h2>
        <p className="text-gray-600 text-lg">
          Common questions and best practices for demonstrating PTS to client prospects.
        </p>
      </div>

      <div className="grid gap-4">
        {clientDemoFAQ.map((faq) => (
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

export default function ClientDemoTrainingPage() {
  const videoUrl = '/videos/PTS demo - client side.mp4'

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
              <h1 className="text-xl font-semibold text-gray-900">PTS Client Demo Training</h1>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">PTS Demo - Client Side</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Complete walkthrough of the Partner Talent Solutions system from the client perspective.
                  This internal training video covers setup, navigation, and key talking points for client presentations.
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
              <DemoGuide />
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <DemoFAQ />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}