'use client'

import { Fragment, useMemo, useState, useRef, useEffect, useCallback } from 'react'
import { KaratSidebar } from '@/components/karat-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Clock, Video, HelpCircle, CheckCircle, X, FileText, MessageSquare, Monitor, ExternalLink, Plus } from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { PTSTrainingHeader } from '@/components/vendor-analytics/pts-training-header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'


interface TrainingVideo {
  id: string
  title: string
  description: string
  duration: string
  category: 'Demo Setup' | 'Demo Execution' | 'Customer FAQ' | 'Advanced Features' | 'Implementation'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  thumbnail: string
  videoUrl: string
  completed?: boolean
  lastWatched?: string
}

interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'Technical' | 'Pricing' | 'Integration' | 'Features'
  tags: string[]
}

// Training videos data
const trainingVideos: TrainingVideo[] = [
  {
    id: 'pts-demo-client-side',
    title: 'PTS Demo - Client Side',
    description: 'Complete walkthrough of the Partner Talent Solutions system from the client perspective',
    duration: 'TBD',
    category: 'Demo Execution',
    difficulty: 'Beginner',
    thumbnail: '/api/placeholder/320/180',
    videoUrl: '/videos/PTS demo - client side.mp4',
    completed: false
  },
  {
    id: 'pts-demo-vendor-side',
    title: 'PTS Demo - Vendor Side',
    description: 'Complete walkthrough of the Partner Talent Solutions system from the vendor perspective',
    duration: 'TBD',
    category: 'Demo Execution',
    difficulty: 'Beginner',
    thumbnail: '/api/placeholder/320/180',
    videoUrl: '/videos/PTS demo - Vendor side.mp4',
    completed: false
  },
  {
    id: 'pts-deployment-training',
    title: 'PTS Deployment Team Training',
    description: 'Implementation team knowledge transfer covering PTS setup, client demos, vendor management, and ongoing support',
    duration: 'TBD',
    category: 'Implementation',
    difficulty: 'Advanced',
    thumbnail: '/api/placeholder/320/180',
    videoUrl: '/videos/PTS Internal Training with Deployment.mp4',
    completed: false
  }
]

// Client Demo Summary Data
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

// Client Demo FAQ data extracted from internal training
const clientDemoFAQ: FAQItem[] = [
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

// FAQ data extracted from actual client calls
const faqItems: FAQItem[] = [
  // Access & Setup
  {
    id: 'faq-001',
    question: 'How does Karat ensure vendors only see their own candidates?',
    answer: 'Access is controlled through data relationships between your vendor tenant and client organization. Any candidate invited through your interface or tagged to your organization will be visible to you. This is all managed at the tenant level for security.',
    category: 'Technical',
    tags: ['access control', 'security', 'data visibility']
  },
  {
    id: 'faq-002',
    question: 'Can vendors invite candidates directly or do they still go through the client?',
    answer: 'Yes, vendors can directly invite candidates to assessments through the partner portal. You can invite individual candidates or bulk upload via CSV. Candidates can then self-schedule their interviews 24/7 globally.',
    category: 'Features',
    tags: ['candidate invitation', 'scheduling', 'workflow']
  },
  {
    id: 'faq-003',
    question: 'Will vendors have access to historical candidate data?',
    answer: 'Initially, you\'ll start with a fresh slate. However, historical data exists and can potentially be migrated with engineering resources. This would be a "day two" enhancement that can be discussed based on volume and business need.',
    category: 'Integration',
    tags: ['historical data', 'migration', 'setup']
  },

  // Assessment Process
  {
    id: 'faq-004',
    question: 'What do the different recommendation levels mean?',
    answer: 'Fast Track = exceptional performance (top percentile). Invite to Next Round = solid pass. Both are considered "pass" from a binary perspective. Requires Further Review = borderline/maybe bucket. Do Not Pursue = fail. The exact thresholds are calibrated with each client.',
    category: 'Features',
    tags: ['recommendations', 'scoring', 'pass rates']
  },
  {
    id: 'faq-005',
    question: 'Are assessments different for junior vs senior roles?',
    answer: 'Assessments are typically set as a baseline floor that junior resources should be able to pass. Senior candidates are expected to score higher on the same assessment rather than taking different tests. This may evolve over time.',
    category: 'Features',
    tags: ['seniority levels', 'assessment difficulty', 'scoring']
  },
  {
    id: 'faq-006',
    question: 'How long do invitation links remain valid?',
    answer: 'Invitation links typically expire after 2 days, but this is configurable based on client preferences. If a link expires, authorized users can trigger a new invitation to restart the process.',
    category: 'Technical',
    tags: ['invitations', 'expiration', 'configuration']
  },

  // Integrity & Quality
  {
    id: 'faq-007',
    question: 'How are integrity flags determined and what should candidates avoid?',
    answer: 'Integrity flags are determined by trained interview engineers (not AI) who monitor for signs of cheating like: someone else in the room, copy-pasting from external sources, or lip-syncing. All flags are reviewed by a second engineer. Using LLMs when prohibited is the most common flag.',
    category: 'Technical',
    tags: ['integrity', 'cheating detection', 'interview process']
  },
  {
    id: 'faq-008',
    question: 'Can candidates reschedule if there are technical issues?',
    answer: 'Yes, if candidates need to reschedule due to technical issues, they return to "invited" status with a note indicating it\'s a reschedule. The system maintains a visual indication of the rescheduling.',
    category: 'Features',
    tags: ['rescheduling', 'technical issues', 'candidate experience']
  },
  {
    id: 'faq-009',
    question: 'Is there a cooldown period for retaking assessments?',
    answer: 'There\'s no built-in system cooldown, but clients typically set policies around retakes. Generally, retakes are allowed for the same role if circumstances warrant it (nerves, technical issues). Different roles don\'t have restrictions, but cost considerations apply.',
    category: 'Features',
    tags: ['retakes', 'cooldown period', 'policy']
  },

  // Feedback & Results
  {
    id: 'faq-010',
    question: 'What level of feedback will vendors receive on candidate performance?',
    answer: 'Vendors receive detailed feedback including strengths observed, areas for improvement, and specific insights related to each assessment component. This helps improve sourcing and candidate coaching without revealing actual questions or scores.',
    category: 'Features',
    tags: ['feedback', 'candidate insights', 'performance data']
  },
  {
    id: 'faq-011',
    question: 'Will vendors see the actual scoring breakdown and percentages?',
    answer: 'No, actual scores will not be available to vendors. Instead, you\'ll receive qualitative feedback (strengths and areas for improvement) and relative benchmarking data that compares your candidates\' performance against your own historical candidate pool for each role.',
    category: 'Features',
    tags: ['scoring', 'benchmarking', 'analytics']
  },
  {
    id: 'faq-012',
    question: 'How quickly is feedback available after an assessment?',
    answer: 'Feedback is available immediately after the interview is completed and processed. You\'ll have real-time visibility into candidate status and detailed results without having to chase down information via email.',
    category: 'Technical',
    tags: ['real-time feedback', 'processing time', 'availability']
  },

  // AI & Future Considerations
  {
    id: 'faq-013',
    question: 'How does Karat handle AI/LLM usage in assessments?',
    answer: 'Karat offers both traditional coding assessments and "Next Gen" interviews that allow LLM usage to replicate real-world conditions. The choice depends on client preferences - some want basic coding skills tested, others prefer open-book scenarios with debugging and LLM interaction.',
    category: 'Features',
    tags: ['AI', 'LLM usage', 'assessment types']
  },
  {
    id: 'faq-014',
    question: 'Can assessments be expanded beyond current technical tracks?',
    answer: 'Yes, Karat is actively expanding assessment coverage. Beyond current software development and data engineering tracks, they\'re building assessments for product specialists (Guidewire, Ab Initio, MicroStrategy) and other specialized roles based on client needs.',
    category: 'Features',
    tags: ['assessment expansion', 'specialized roles', 'product knowledge']
  },

  // Process & Workflow
  {
    id: 'faq-015',
    question: 'How does the partner portal handle team-based hiring (pods)?',
    answer: 'While traditional assessments focus on individual technical skills, Karat is exploring team composition features including technical skill mapping, collaboration assessment, and team dynamics. This is an area of active development for pod-based staffing.',
    category: 'Features',
    tags: ['team hiring', 'pod staffing', 'collaboration assessment']
  },
  {
    id: 'faq-016',
    question: 'What documentation is available to help candidates prepare?',
    answer: 'Candidates receive detailed email instructions with assessment format, main skill areas, and weighted importance of each component. Additional preparation materials and common questions can be shared offline, though specific question details are kept confidential.',
    category: 'Features',
    tags: ['candidate preparation', 'documentation', 'assessment format']
  }
]


// Video Thumbnail Component
function VideoThumbnail({ videoUrl, className }: {
  videoUrl: string
  className?: string
}) {
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const generateThumbnail = () => {
      const video = videoRef.current
      if (!video) return

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      video.currentTime = 1 // Seek to 1 second for thumbnail

      const onLoadedData = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            setThumbnail(url)
          }
          setLoading(false)
        }, 'image/jpeg', 0.8)
      }

      video.addEventListener('loadeddata', onLoadedData, { once: true })
      video.load()
    }

    generateThumbnail()

    return () => {
      if (thumbnail) {
        URL.revokeObjectURL(thumbnail)
      }
    }
  }, [videoUrl])

  if (loading) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <Video className="w-12 h-12 text-gray-400 animate-pulse" />
      </div>
    )
  }

  return (
    <div className={`bg-gray-200 overflow-hidden ${className}`}>
      {thumbnail ? (
        <img
          src={thumbnail}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Video className="w-12 h-12 text-gray-400" />
        </div>
      )}
      <video
        ref={videoRef}
        className="hidden"
        preload="metadata"
        muted
        playsInline
      >
        <source src={videoUrl} type="video/quicktime" />
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  )
}

// Client Demo Summary Component
function ClientDemoSummary() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{clientDemoSummary.title}</h3>
        <p className="text-gray-700 mb-4">{clientDemoSummary.overview}</p>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Key Demo Points</h4>
        <ul className="space-y-2">
          {clientDemoSummary.keyPoints.map((point, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700 text-sm">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Demo Environments</h4>
        <div className="grid gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Monitor className="w-4 h-4 text-blue-600" />
              <h5 className="font-medium text-gray-900">{clientDemoSummary.demoEnvironments.production.name}</h5>
            </div>
            <p className="text-sm text-gray-600 mb-3">{clientDemoSummary.demoEnvironments.production.recommendation}</p>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <h6 className="text-xs font-medium text-green-700 mb-1">PROS</h6>
                <ul className="space-y-1">
                  {clientDemoSummary.demoEnvironments.production.pros.map((pro, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h6 className="text-xs font-medium text-red-700 mb-1">CONS</h6>
                <ul className="space-y-1">
                  {clientDemoSummary.demoEnvironments.production.cons.map((con, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                      <X className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-blue-200 bg-blue-50">
            <div className="flex items-center gap-2 mb-2">
              <Monitor className="w-4 h-4 text-blue-600" />
              <h5 className="font-medium text-gray-900">{clientDemoSummary.demoEnvironments.staging.name}</h5>
              <Badge variant="outline" className="text-xs text-blue-700 bg-blue-100">Recommended</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">{clientDemoSummary.demoEnvironments.staging.recommendation}</p>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <h6 className="text-xs font-medium text-green-700 mb-1">PROS</h6>
                <ul className="space-y-1">
                  {clientDemoSummary.demoEnvironments.staging.pros.map((pro, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h6 className="text-xs font-medium text-red-700 mb-1">CONS</h6>
                <ul className="space-y-1">
                  {clientDemoSummary.demoEnvironments.staging.cons.map((con, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                      <X className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
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

// Add New FAQ Form Component
function AddFAQForm({ onAdd }: { onAdd: (faq: FAQItem) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [category, setCategory] = useState<FAQItem['category']>('Technical')
  const [tags, setTags] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim() || !answer.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/faq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim(),
          answer: answer.trim(),
          category,
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }),
      })

      if (response.ok) {
        const newFAQ = await response.json()
        onAdd(newFAQ)

        // Reset form
        setQuestion('')
        setAnswer('')
        setCategory('Technical')
        setTags('')
        setIsOpen(false)
      }
    } catch (error) {
      console.error('Error adding FAQ:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="mb-6">
        <Plus className="w-4 h-4 mr-2" />
        Add New FAQ
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New FAQ</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="question">Question *</Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question..."
                required
              />
            </div>

            <div>
              <Label htmlFor="answer">Answer *</Label>
              <Textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter the answer..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(value: FAQItem['category']) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Features">Features</SelectItem>
                  <SelectItem value="Pricing">Pricing</SelectItem>
                  <SelectItem value="Integration">Integration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="tag1, tag2, tag3..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add FAQ'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Client Demo FAQ Component
function ClientDemoFAQ() {
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
      case 'Technical': return 'bg-blue-100 text-blue-800'
      case 'Features': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Client Demo FAQ</h3>
        <p className="text-gray-600 text-sm">
          Common questions and best practices for demonstrating PTS to client prospects.
        </p>
      </div>

      <div className="space-y-3">
        {clientDemoFAQ.map((faq) => (
          <Card key={faq.id} className="overflow-hidden">
            <div
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleExpanded(faq.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getCategoryColor(faq.category)} variant="secondary">
                      {faq.category}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">{faq.question}</h4>
                  <div className="flex flex-wrap gap-1">
                    {faq.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                    {faq.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{faq.tags.length - 3} more</span>
                    )}
                  </div>
                </div>
                <HelpCircle className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  expandedItems.has(faq.id) ? 'rotate-180' : ''
                }`} />
              </div>

              {expandedItems.has(faq.id) && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Video Player Modal Component
function VideoPlayerModal({ video, isOpen, onClose }: {
  video: TrainingVideo | null
  isOpen: boolean
  onClose: () => void
}) {
  if (!video) return null

  const isClientDemo = video.id === 'pts-demo-client-side'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="text-xl font-semibold">{video.title}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            {isClientDemo ? (
              <Tabs defaultValue="video" className="h-full">
                <div className="px-6 pt-4 border-b">
                  <TabsList className="grid w-full grid-cols-3">
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
                </div>

                <TabsContent value="video" className="p-6 space-y-4">
                  <div className="bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <video
                      className="w-full h-full"
                      controls
                      preload="metadata"
                      src={video.videoUrl}
                    >
                      <source src={video.videoUrl} type="video/quicktime" />
                      <source src={video.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 mb-3">{video.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">{video.category}</Badge>
                      </span>
                      <span className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">{video.difficulty}</Badge>
                      </span>
                      {video.duration !== 'TBD' && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {video.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="guide" className="p-6 overflow-y-auto max-h-[60vh]">
                  <ClientDemoSummary />
                </TabsContent>

                <TabsContent value="faq" className="p-6 overflow-y-auto max-h-[60vh]">
                  <ClientDemoFAQ />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="p-6 space-y-4">
                <div className="bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <video
                    className="w-full h-full"
                    controls
                    preload="metadata"
                    src={video.videoUrl}
                  >
                    <source src={video.videoUrl} type="video/quicktime" />
                    <source src={video.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">{video.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">{video.category}</Badge>
                    </span>
                    <span className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">{video.difficulty}</Badge>
                    </span>
                    {video.duration !== 'TBD' && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {video.duration}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Component functions for the training library
function VideoCard({ video, onPlay }: {
  video: TrainingVideo
  onPlay: (video: TrainingVideo) => void
}) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const isClientDemo = video.id === 'pts-demo-client-side'
  const isVendorDemo = video.id === 'pts-demo-vendor-side'
  const isDeploymentTraining = video.id === 'pts-deployment-training'

  if (isClientDemo) {
    return (
      <Link href="/pts-training/client-demo">
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <div className="relative">
            <div className="w-full h-48 relative group">
              <VideoThumbnail videoUrl={video.videoUrl} className="w-full h-full" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4">
                    <ExternalLink className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <Badge className={getDifficultyColor(video.difficulty)} variant="secondary">
                {video.difficulty}
              </Badge>
            </div>
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
              Full Training
            </div>
            <div className="absolute top-2 left-2">
              <Badge className="bg-blue-100 text-blue-800" variant="secondary">
                Interactive Guide
              </Badge>
            </div>
            {video.completed && (
              <div className="absolute top-2 left-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <FileText className="w-3 h-3" />
                <span>Video + Guide + FAQ</span>
              </div>
              <Button size="sm" className="flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Open Training
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  if (isVendorDemo) {
    return (
      <Link href="/pts-training/vendor-demo">
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <div className="relative">
            <div className="w-full h-48 relative group">
              <VideoThumbnail videoUrl={video.videoUrl} className="w-full h-full" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4">
                    <ExternalLink className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <Badge className={getDifficultyColor(video.difficulty)} variant="secondary">
                {video.difficulty}
              </Badge>
            </div>
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
              Full Training
            </div>
            <div className="absolute top-2 left-2">
              <Badge className="bg-green-100 text-green-800" variant="secondary">
                Interactive Guide
              </Badge>
            </div>
            {video.completed && (
              <div className="absolute top-2 left-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <FileText className="w-3 h-3" />
                <span>Video + Guide + FAQ</span>
              </div>
              <Button size="sm" className="flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Open Training
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  if (isDeploymentTraining) {
    return (
      <Link href="/pts-training/deployment-demo">
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <div className="relative">
            <div className="w-full h-48 relative group">
              <VideoThumbnail videoUrl={video.videoUrl} className="w-full h-full" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4">
                    <ExternalLink className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <Badge className={getDifficultyColor(video.difficulty)} variant="secondary">
                {video.difficulty}
              </Badge>
            </div>
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
              Full Training
            </div>
            <div className="absolute top-2 left-2">
              <Badge className="bg-orange-100 text-orange-800" variant="secondary">
                Implementation Guide
              </Badge>
            </div>
            {video.completed && (
              <div className="absolute top-2 left-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <FileText className="w-3 h-3" />
                <span>Video + Guide + FAQ</span>
              </div>
              <Button size="sm" className="flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Open Training
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative cursor-pointer" onClick={() => onPlay(video)}>
        <div className="w-full h-48 relative group">
          <VideoThumbnail videoUrl={video.videoUrl} className="w-full h-full" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Play className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <Badge className={getDifficultyColor(video.difficulty)} variant="secondary">
            {video.difficulty}
          </Badge>
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
          {video.duration}
        </div>
        {video.completed && (
          <div className="absolute top-2 left-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{video.duration}</span>
            {video.lastWatched && (
              <>
                <span>•</span>
                <span>Watched {video.lastWatched}</span>
              </>
            )}
          </div>
          <Button
            size="sm"
            className="flex items-center gap-1"
            onClick={() => onPlay(video)}
          >
            <Play className="w-3 h-3" />
            {video.completed ? 'Rewatch' : 'Watch'}
          </Button>
        </div>
      </div>
    </Card>
  )
}

function FAQCard({ faq }: { faq: FAQItem }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technical': return 'bg-blue-100 text-blue-800'
      case 'Pricing': return 'bg-green-100 text-green-800'
      case 'Integration': return 'bg-purple-100 text-purple-800'
      case 'Features': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="mb-4">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getCategoryColor(faq.category)} variant="secondary">
                {faq.category}
              </Badge>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{faq.question}</h3>
            <div className="flex flex-wrap gap-1">
              {faq.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <HelpCircle className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-gray-700">{faq.answer}</p>
          </div>
        )}
      </div>
    </Card>
  )
}

export default function PTSTrainingPage() {
  const [activeSection, setActiveSection] = useState('Internal Demo Training')
  const [selectedVideo, setSelectedVideo] = useState<TrainingVideo | null>(null)
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false)
  const [customFAQs, setCustomFAQs] = useState<FAQItem[]>([])
  const [allFAQs, setAllFAQs] = useState<FAQItem[]>(faqItems)

  // Load custom FAQs from API
  const loadCustomFAQs = useCallback(async () => {
    try {
      const response = await fetch('/api/faq')
      if (response.ok) {
        const customItems = await response.json()
        setCustomFAQs(customItems)
        setAllFAQs([...faqItems, ...customItems])
      }
    } catch (error) {
      console.error('Error loading custom FAQs:', error)
    }
  }, [])

  // Handle adding new FAQ
  const handleAddFAQ = useCallback((newFAQ: FAQItem) => {
    setCustomFAQs(prev => [...prev, newFAQ])
    setAllFAQs(prev => [...prev, newFAQ])
  }, [])

  // Load custom FAQs on mount
  useEffect(() => {
    loadCustomFAQs()
  }, [loadCustomFAQs])

  const handlePlayVideo = (video: TrainingVideo) => {
    setSelectedVideo(video)
    setIsVideoPlayerOpen(true)
  }

  const handleCloseVideo = () => {
    setIsVideoPlayerOpen(false)
    setSelectedVideo(null)
  }

  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] overflow-hidden">
      <SidebarProvider defaultOpen={true}>
        <div className="h-full">
          <KaratSidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>
        <SidebarInset className="overflow-auto">
          <main className="flex-1 py-6 px-8 md:px-12 lg:px-16">
            <PTSTrainingHeader />
            
            {activeSection === 'Internal Demo Training' ? (
              <div>

                {/* Training Videos */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">PTS Demo Videos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {trainingVideos.map((video) => (
                        <VideoCard key={video.id} video={video} onPlay={handlePlayVideo} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : activeSection === 'Customer FAQ' ? (
              <div>
                {/* FAQ Section */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
                  <p className="text-gray-600 mb-6">
                    Common questions from vendors and prospects about Partner Talent Solutions and technical assessments.
                    Add your own questions and answers to customize this knowledge base.
                  </p>
                </div>

                {/* Add New FAQ Form */}
                <AddFAQForm onAdd={handleAddFAQ} />

                {/* FAQ Categories */}
                <div className="space-y-6">
                  {['Technical', 'Features', 'Pricing', 'Integration'].map((category) => {
                    const categoryFAQs = allFAQs.filter(faq => faq.category === category)

                    if (categoryFAQs.length === 0) return null

                    return (
                      <div key={category}>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          {category}
                          <Badge variant="outline" className="ml-2 text-xs">
                            {categoryFAQs.length}
                          </Badge>
                        </h4>
                        <div className="space-y-3">
                          {categoryFAQs.map((faq) => (
                            <FAQCard key={faq.id} faq={faq} />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </main>
        </SidebarInset>
      </SidebarProvider>

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={selectedVideo}
        isOpen={isVideoPlayerOpen}
        onClose={handleCloseVideo}
      />
    </div>
  )
}
