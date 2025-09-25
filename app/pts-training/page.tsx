'use client'

import { useState } from 'react'
import { KaratSidebar } from '@/components/karat-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Clock, Video, HelpCircle, CheckCircle, Rocket, Calendar, Users, Settings, FileText, AlertTriangle, Target } from 'lucide-react'
import { PTSTrainingHeader } from '@/components/vendor-analytics/pts-training-header'


interface TrainingVideo {
  id: string
  title: string
  description: string
  duration: string
  category: 'Demo Setup' | 'Demo Execution' | 'Customer FAQ' | 'Advanced Features'
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

interface DeploymentTask {
  id: string
  title: string
  description: string
  phase: 'Pre-Sales' | 'Contract & Setup' | 'Technical Integration' | 'Content Development' | 'Testing & QA' | 'Go-Live' | 'Post-Launch'
  owner: 'Sales' | 'Customer Success' | 'Engineering' | 'Content' | 'Client' | 'Shared'
  estimatedDays: number
  dependencies?: string[]
  critical: boolean
  status: 'pending' | 'in-progress' | 'completed' | 'blocked'
}

// Training videos data
const trainingVideos: TrainingVideo[] = [
  {
    id: 'demo-setup-001',
    title: 'PTS Demo Environment Setup',
    description: 'Learn how to set up the demo environment, configure test data, and prepare for client presentations',
    duration: '12:30',
    category: 'Demo Setup',
    difficulty: 'Beginner',
    thumbnail: '/api/placeholder/320/180',
    videoUrl: '#',
    completed: true,
    lastWatched: '2024-03-15'
  },
  {
    id: 'demo-setup-002',
    title: 'Customizing Demo Data for Client Context',
    description: 'How to tailor demo data to match client industry, role types, and specific use cases',
    duration: '8:45',
    category: 'Demo Setup',
    difficulty: 'Intermediate',
    thumbnail: '/api/placeholder/320/180',
    videoUrl: '#',
    completed: false
  },
  {
    id: 'demo-exec-001',
    title: 'Opening the Demo - First Impressions',
    description: 'Master the first 5 minutes: introductions, context setting, and capturing attention',
    duration: '15:20',
    category: 'Demo Execution',
    difficulty: 'Beginner',
    thumbnail: '/api/placeholder/320/180',
    videoUrl: '#',
    completed: true,
    lastWatched: '2024-03-14'
  },
  {
    id: 'demo-exec-002',
    title: 'Navigating the Skill Gap Analysis',
    description: 'How to explain technical failure patterns and sourcing recommendations to non-technical audiences',
    duration: '18:15',
    category: 'Demo Execution',
    difficulty: 'Intermediate',
    thumbnail: '/api/placeholder/320/180',
    videoUrl: '#',
    completed: false
  },
  {
    id: 'demo-exec-003',
    title: 'Handling Objections During Demos',
    description: 'Common client objections and how to address them while maintaining demo flow',
    duration: '22:10',
    category: 'Demo Execution',
    difficulty: 'Advanced',
    thumbnail: '/api/placeholder/320/180',
    videoUrl: '#',
    completed: false
  },
  {
    id: 'advanced-001',
    title: 'Advanced Analytics Deep Dive',
    description: 'Technical deep dive into role-specific insights and industry benchmarking features',
    duration: '25:30',
    category: 'Advanced Features',
    difficulty: 'Advanced',
    thumbnail: '/api/placeholder/320/180',
    videoUrl: '#',
    completed: false
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

// Deployment checklist data
const deploymentTasks: DeploymentTask[] = [
  // Pre-Sales Phase
  {
    id: 'pre-001',
    title: 'Initial Discovery Call',
    description: 'Conduct discovery call to understand client needs, current process, and technical requirements',
    phase: 'Pre-Sales',
    owner: 'Sales',
    estimatedDays: 1,
    critical: true,
    status: 'pending'
  },
  {
    id: 'pre-002',
    title: 'Technical Architecture Review',
    description: 'Review client technical architecture, existing tools, and integration requirements',
    phase: 'Pre-Sales',
    owner: 'Engineering',
    estimatedDays: 2,
    dependencies: ['pre-001'],
    critical: true,
    status: 'pending'
  },
  {
    id: 'pre-003',
    title: 'Vendor Partner Identification',
    description: 'Identify all vendor partners that will need PTS access and their requirements',
    phase: 'Pre-Sales',
    owner: 'Client',
    estimatedDays: 3,
    critical: true,
    status: 'pending'
  },
  {
    id: 'pre-004',
    title: 'ROI & Success Metrics Definition',
    description: 'Define success metrics, KPIs, and expected ROI for the PTS implementation',
    phase: 'Pre-Sales',
    owner: 'Shared',
    estimatedDays: 2,
    critical: false,
    status: 'pending'
  },

  // Contract & Setup Phase
  {
    id: 'contract-001',
    title: 'Contract Execution',
    description: 'Execute master service agreement and statement of work for PTS implementation',
    phase: 'Contract & Setup',
    owner: 'Sales',
    estimatedDays: 5,
    dependencies: ['pre-002', 'pre-003'],
    critical: true,
    status: 'pending'
  },
  {
    id: 'contract-002',
    title: 'Client Organization Setup',
    description: 'Create client organization in Karat platform with appropriate permissions and settings',
    phase: 'Contract & Setup',
    owner: 'Engineering',
    estimatedDays: 1,
    dependencies: ['contract-001'],
    critical: true,
    status: 'pending'
  },
  {
    id: 'contract-003',
    title: 'Vendor Partner Organization Setup',
    description: 'Create vendor partner organizations and establish data relationships',
    phase: 'Contract & Setup',
    owner: 'Engineering',
    estimatedDays: 2,
    dependencies: ['contract-002'],
    critical: true,
    status: 'pending'
  },
  {
    id: 'contract-004',
    title: 'Project Kickoff Meeting',
    description: 'Conduct project kickoff with all stakeholders including timeline and responsibilities',
    phase: 'Contract & Setup',
    owner: 'Customer Success',
    estimatedDays: 1,
    dependencies: ['contract-001'],
    critical: true,
    status: 'pending'
  },

  // Technical Integration Phase
  {
    id: 'tech-001',
    title: 'API Integration Setup',
    description: 'Configure API endpoints and authentication for client systems integration',
    phase: 'Technical Integration',
    owner: 'Engineering',
    estimatedDays: 3,
    dependencies: ['contract-002'],
    critical: true,
    status: 'pending'
  },
  {
    id: 'tech-002',
    title: 'Single Sign-On (SSO) Configuration',
    description: 'Set up SSO integration with client identity provider if required',
    phase: 'Technical Integration',
    owner: 'Engineering',
    estimatedDays: 5,
    dependencies: ['tech-001'],
    critical: false,
    status: 'pending'
  },
  {
    id: 'tech-003',
    title: 'Data Pipeline Configuration',
    description: 'Configure data pipelines for candidate flow and results reporting',
    phase: 'Technical Integration',
    owner: 'Engineering',
    estimatedDays: 4,
    dependencies: ['tech-001'],
    critical: true,
    status: 'pending'
  },
  {
    id: 'tech-004',
    title: 'Webhook & Notification Setup',
    description: 'Configure webhooks and notification systems for real-time updates',
    phase: 'Technical Integration',
    owner: 'Engineering',
    estimatedDays: 2,
    dependencies: ['tech-003'],
    critical: false,
    status: 'pending'
  },
  {
    id: 'tech-005',
    title: 'Historical Data Migration',
    description: 'Migrate historical candidate data if requested (optional)',
    phase: 'Technical Integration',
    owner: 'Engineering',
    estimatedDays: 7,
    dependencies: ['tech-003'],
    critical: false,
    status: 'pending'
  },

  // Content Development Phase
  {
    id: 'content-001',
    title: 'Role Definition Workshop',
    description: 'Conduct workshops with client engineering leaders to define role requirements',
    phase: 'Content Development',
    owner: 'Content',
    estimatedDays: 3,
    dependencies: ['contract-004'],
    critical: true,
    status: 'pending'
  },
  {
    id: 'content-002',
    title: 'Assessment Content Creation',
    description: 'Create customized assessment content for each defined role',
    phase: 'Content Development',
    owner: 'Content',
    estimatedDays: 10,
    dependencies: ['content-001'],
    critical: true,
    status: 'pending'
  },
  {
    id: 'content-003',
    title: 'Scoring Rubric Calibration',
    description: 'Calibrate scoring rubrics and pass/fail thresholds with client team',
    phase: 'Content Development',
    owner: 'Content',
    estimatedDays: 5,
    dependencies: ['content-002'],
    critical: true,
    status: 'pending'
  },
  {
    id: 'content-004',
    title: 'Interview Engineer Training',
    description: 'Train interview engineers on new assessment content and client-specific requirements',
    phase: 'Content Development',
    owner: 'Content',
    estimatedDays: 3,
    dependencies: ['content-003'],
    critical: true,
    status: 'pending'
  },
  {
    id: 'content-005',
    title: 'Content Review & Approval',
    description: 'Client engineering leadership reviews and approves all assessment content',
    phase: 'Content Development',
    owner: 'Client',
    estimatedDays: 5,
    dependencies: ['content-004'],
    critical: true,
    status: 'pending'
  },

  // Testing & QA Phase
  {
    id: 'test-001',
    title: 'Platform User Acceptance Testing',
    description: 'Client team tests PTS platform functionality and user experience',
    phase: 'Testing & QA',
    owner: 'Client',
    estimatedDays: 5,
    dependencies: ['tech-003', 'content-005'],
    critical: true,
    status: 'pending'
  },
  {
    id: 'test-002',
    title: 'Vendor Partner Platform Testing',
    description: 'Vendor partners test their access and functionality in the partner portal',
    phase: 'Testing & QA',
    owner: 'Client',
    estimatedDays: 3,
    dependencies: ['contract-003', 'test-001'],
    critical: true,
    status: 'pending'
  },
  {
    id: 'test-003',
    title: 'End-to-End Workflow Testing',
    description: 'Test complete candidate flow from invitation to results delivery',
    phase: 'Testing & QA',
    owner: 'Shared',
    estimatedDays: 3,
    dependencies: ['test-002'],
    critical: true,
    status: 'pending'
  },
  {
    id: 'test-004',
    title: 'Performance & Load Testing',
    description: 'Conduct performance testing with expected candidate volume',
    phase: 'Testing & QA',
    owner: 'Engineering',
    estimatedDays: 2,
    dependencies: ['test-003'],
    critical: false,
    status: 'pending'
  },
  {
    id: 'test-005',
    title: 'Security & Compliance Review',
    description: 'Complete security audit and compliance verification',
    phase: 'Testing & QA',
    owner: 'Engineering',
    estimatedDays: 3,
    dependencies: ['test-001'],
    critical: true,
    status: 'pending'
  },

  // Go-Live Phase
  {
    id: 'golive-001',
    title: 'Production Deployment',
    description: 'Deploy PTS solution to production environment',
    phase: 'Go-Live',
    owner: 'Engineering',
    estimatedDays: 1,
    dependencies: ['test-005', 'test-003'],
    critical: true,
    status: 'pending'
  },
  {
    id: 'golive-002',
    title: 'Client Team Training',
    description: 'Train client team on PTS platform usage and administration',
    phase: 'Go-Live',
    owner: 'Customer Success',
    estimatedDays: 2,
    dependencies: ['golive-001'],
    critical: true,
    status: 'pending'
  },
  {
    id: 'golive-003',
    title: 'Vendor Partner Training',
    description: 'Train all vendor partners on partner portal usage and workflows',
    phase: 'Go-Live',
    owner: 'Customer Success',
    estimatedDays: 3,
    dependencies: ['golive-001'],
    critical: true,
    status: 'pending'
  },
  {
    id: 'golive-004',
    title: 'Soft Launch with Limited Volume',
    description: 'Begin with limited candidate volume to validate production workflows',
    phase: 'Go-Live',
    owner: 'Shared',
    estimatedDays: 7,
    dependencies: ['golive-002', 'golive-003'],
    critical: true,
    status: 'pending'
  },
  {
    id: 'golive-005',
    title: 'Full Production Launch',
    description: 'Scale to full candidate volume across all roles and vendors',
    phase: 'Go-Live',
    owner: 'Shared',
    estimatedDays: 3,
    dependencies: ['golive-004'],
    critical: true,
    status: 'pending'
  },

  // Post-Launch Phase
  {
    id: 'post-001',
    title: '30-Day Health Check',
    description: 'Review system performance, user adoption, and initial metrics after 30 days',
    phase: 'Post-Launch',
    owner: 'Customer Success',
    estimatedDays: 1,
    dependencies: ['golive-005'],
    critical: true,
    status: 'pending'
  },
  {
    id: 'post-002',
    title: 'Feedback Collection & Analysis',
    description: 'Collect feedback from client team and vendor partners for improvements',
    phase: 'Post-Launch',
    owner: 'Customer Success',
    estimatedDays: 2,
    dependencies: ['post-001'],
    critical: false,
    status: 'pending'
  },
  {
    id: 'post-003',
    title: 'Performance Optimization',
    description: 'Implement optimizations based on production usage patterns',
    phase: 'Post-Launch',
    owner: 'Engineering',
    estimatedDays: 5,
    dependencies: ['post-002'],
    critical: false,
    status: 'pending'
  },
  {
    id: 'post-004',
    title: 'Success Metrics Review',
    description: 'Review achievement of defined success metrics and ROI targets',
    phase: 'Post-Launch',
    owner: 'Shared',
    estimatedDays: 2,
    dependencies: ['post-001'],
    critical: true,
    status: 'pending'
  },
  {
    id: 'post-005',
    title: 'Quarterly Business Review Setup',
    description: 'Establish ongoing QBR process for continuous improvement',
    phase: 'Post-Launch',
    owner: 'Customer Success',
    estimatedDays: 1,
    dependencies: ['post-004'],
    critical: false,
    status: 'pending'
  }
]

// Component functions for the training library
function VideoCard({ video }: { video: TrainingVideo }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <Video className="w-12 h-12 text-gray-400" />
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
          <Button size="sm" className="flex items-center gap-1">
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

function DeploymentTaskCard({ task }: { task: DeploymentTask }) {
  const getOwnerColor = (owner: string) => {
    switch (owner) {
      case 'Sales': return 'bg-blue-100 text-blue-800'
      case 'Customer Success': return 'bg-green-100 text-green-800'
      case 'Engineering': return 'bg-purple-100 text-purple-800'
      case 'Content': return 'bg-orange-100 text-orange-800'
      case 'Client': return 'bg-gray-100 text-gray-800'
      case 'Shared': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'blocked': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'in-progress': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'blocked': return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return <Calendar className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon(task.status)}
          <h4 className="font-semibold text-gray-900">{task.title}</h4>
          {task.critical && (
            <Badge variant="destructive" className="text-xs">
              Critical
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getOwnerColor(task.owner)} variant="secondary">
            {task.owner}
          </Badge>
          <Badge className={getStatusColor(task.status)} variant="secondary">
            {task.status}
          </Badge>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{task.estimatedDays} day{task.estimatedDays !== 1 ? 's' : ''}</span>
          </div>
          {task.dependencies && task.dependencies.length > 0 && (
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              <span>{task.dependencies.length} dependencies</span>
            </div>
          )}
        </div>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {task.id}
        </span>
      </div>
    </Card>
  )
}

export default function PTSTrainingPage() {
  const [activeSection, setActiveSection] = useState('Internal Demo Training')

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

                {/* Video Categories */}
                <div className="space-y-8">
                  {/* Demo Setup */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Demo Setup</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {trainingVideos
                        .filter(video => video.category === 'Demo Setup')
                        .map((video) => (
                          <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                  </div>

                  {/* Demo Execution */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Demo Execution</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {trainingVideos
                        .filter(video => video.category === 'Demo Execution')
                        .map((video) => (
                          <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                  </div>

                  {/* Advanced Features */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Advanced Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {trainingVideos
                        .filter(video => video.category === 'Advanced Features')
                        .map((video) => (
                          <VideoCard key={video.id} video={video} />
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
                  </p>
                </div>

                {/* FAQ Categories */}
                <div className="space-y-6">
                  {['Technical', 'Features', 'Pricing', 'Integration'].map((category) => (
                    <div key={category}>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">{category}</h4>
                      <div className="space-y-3">
                        {faqItems
                          .filter(faq => faq.category === category)
                          .map((faq) => (
                            <FAQCard key={faq.id} faq={faq} />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {/* Deployment Checklist Section */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">PTS Deployment Checklist</h3>
                  <p className="text-gray-600 mb-6">
                    Comprehensive checklist for Partner Talent Solutions client deployments. Track progress across all phases from pre-sales to post-launch.
                  </p>
                </div>

                {/* Deployment Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Tasks</p>
                        <p className="text-2xl font-bold text-gray-900">{deploymentTasks.length}</p>
                      </div>
                      <Rocket className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        7 Phases
                      </Badge>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Critical Tasks</p>
                        <p className="text-2xl font-bold text-red-600">{deploymentTasks.filter(t => t.critical).length}</p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <div className="mt-2">
                      <Badge variant="destructive" className="text-xs">
                        High Priority
                      </Badge>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Est. Timeline</p>
                        <p className="text-2xl font-bold text-blue-600">8-12</p>
                      </div>
                      <Calendar className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        Weeks
                      </Badge>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Team Members</p>
                        <p className="text-2xl font-bold text-green-600">6</p>
                      </div>
                      <Users className="w-8 h-8 text-green-500" />
                    </div>
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        Cross-functional
                      </Badge>
                    </div>
                  </Card>
                </div>

                {/* Deployment Phases */}
                <div className="space-y-8">
                  {['Pre-Sales', 'Contract & Setup', 'Technical Integration', 'Content Development', 'Testing & QA', 'Go-Live', 'Post-Launch'].map((phase) => (
                    <div key={phase}>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Rocket className="w-5 h-5 mr-2 text-blue-500" />
                        {phase}
                        <Badge variant="outline" className="ml-3 text-xs">
                          {deploymentTasks.filter(task => task.phase === phase).length} tasks
                        </Badge>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {deploymentTasks
                          .filter(task => task.phase === phase)
                          .map((task) => (
                            <DeploymentTaskCard key={task.id} task={task} />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Export Actions */}
                <div className="flex justify-center mt-8">
                  <div className="flex gap-4">
                    <Button variant="outline" size="lg">
                      <FileText className="w-4 h-4 mr-2" />
                      Export Checklist (PDF)
                    </Button>
                    <Button variant="outline" size="lg">
                      <Settings className="w-4 h-4 mr-2" />
                      Customize Template
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}


