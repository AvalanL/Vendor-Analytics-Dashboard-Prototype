"use client"

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Target, TrendingUp, AlertTriangle, CheckCircle, Building2, GraduationCap, Code, Users } from 'lucide-react'

interface SourcingIntelligence {
  mustHaveSkills: {
    skill: string
    importance: 'Critical' | 'High' | 'Medium'
    passRate: number
    description: string
  }[]
  experiencePatterns: {
    pattern: string
    successRate: number
    description: string
    examples: string[]
  }[]
  companyBackgrounds: {
    type: string
    successRate: number
    reasoning: string
    examples: string[]
  }[]
  redFlags: {
    flag: string
    failureRate: number
    explanation: string
  }[]
  sourcingChannels: {
    channel: string
    passRate: number
    volume: string
    recommendation: string
  }[]
}

interface RoleSpecificSourcingProps {
  roleName: string
}

const getSourcingData = (roleName: string): SourcingIntelligence => {
  const roleData: Record<string, SourcingIntelligence> = {
    'Frontend Engineer': {
      mustHaveSkills: [
        {
          skill: 'Vanilla JavaScript Mastery',
          importance: 'Critical',
          passRate: 85,
          description: 'Deep understanding of closures, prototypes, event loop - not just framework knowledge'
        },
        {
          skill: 'CSS Layout Systems',
          importance: 'Critical',
          passRate: 78,
          description: 'Flexbox, Grid, and responsive design without relying on frameworks'
        },
        {
          skill: 'Browser Performance',
          importance: 'High',
          passRate: 72,
          description: 'Understanding of rendering, reflow, repaint, and optimization techniques'
        },
        {
          skill: 'State Management',
          importance: 'High',
          passRate: 68,
          description: 'Redux, Context API, or complex component state patterns'
        }
      ],
      experiencePatterns: [
        {
          pattern: '3-5 years with pre-React experience',
          successRate: 92,
          description: 'Candidates who learned JavaScript before React understand fundamentals better',
          examples: ['jQuery → React transition', 'Vanilla JS → Vue → React', 'Backbone.js background']
        },
        {
          pattern: 'Performance optimization projects',
          successRate: 88,
          description: 'Experience making slow apps fast indicates deep understanding',
          examples: ['Bundle size reduction', 'Core Web Vitals improvement', 'Memory leak fixes']
        },
        {
          pattern: 'Design system implementation',
          successRate: 84,
          description: 'Building reusable components shows architectural thinking',
          examples: ['Component library creation', 'Storybook setup', 'Design token systems']
        }
      ],
      companyBackgrounds: [
        {
          type: 'High-traffic consumer apps',
          successRate: 89,
          reasoning: 'Performance and scale challenges develop strong fundamentals',
          examples: ['Netflix', 'Airbnb', 'Instagram', 'Pinterest']
        },
        {
          type: 'Design-focused startups',
          successRate: 82,
          reasoning: 'Attention to UI detail and CSS mastery',
          examples: ['Figma', 'Canva', 'Sketch', 'InVision']
        },
        {
          type: 'E-commerce platforms',
          successRate: 76,
          reasoning: 'Complex state management and performance requirements',
          examples: ['Shopify', 'Stripe', 'Square', 'BigCommerce']
        }
      ],
      redFlags: [
        {
          flag: 'Only framework experience',
          failureRate: 73,
          explanation: 'Candidates who only know React/Vue but not vanilla JS struggle with fundamentals'
        },
        {
          flag: 'CSS framework dependency',
          failureRate: 67,
          explanation: 'Relies only on Bootstrap/Tailwind without understanding underlying CSS'
        },
        {
          flag: 'No performance optimization experience',
          failureRate: 58,
          explanation: 'Cannot explain bundle optimization, lazy loading, or rendering performance'
        }
      ],
      sourcingChannels: [
        {
          channel: 'GitHub (active contributors)',
          passRate: 87,
          volume: 'Low',
          recommendation: 'Priority channel - look for personal projects with vanilla JS'
        },
        {
          channel: 'Frontend meetups/conferences',
          passRate: 83,
          volume: 'Medium',
          recommendation: 'Speakers and regular attendees show passion and deep knowledge'
        },
        {
          channel: 'Design community crossover',
          passRate: 79,
          volume: 'Low',
          recommendation: 'Dribbble, Behance users who code often have great CSS skills'
        },
        {
          channel: 'LinkedIn (React keyword)',
          passRate: 42,
          volume: 'High',
          recommendation: 'Use sparingly - too many framework-only candidates'
        }
      ]
    },
    'Backend Engineer': {
      mustHaveSkills: [
        {
          skill: 'Database Query Optimization',
          importance: 'Critical',
          passRate: 81,
          description: 'EXPLAIN plans, indexing strategy, N+1 problem identification'
        },
        {
          skill: 'System Design Fundamentals',
          importance: 'Critical',
          passRate: 75,
          description: 'Caching, load balancing, distributed system concepts'
        },
        {
          skill: 'Algorithm Complexity Analysis',
          importance: 'Critical',
          passRate: 69,
          description: 'Big O notation, time/space complexity for nested operations'
        },
        {
          skill: 'API Design Patterns',
          importance: 'High',
          passRate: 73,
          description: 'RESTful principles, HTTP status codes, idempotency'
        }
      ],
      experiencePatterns: [
        {
          pattern: 'High-scale system experience',
          successRate: 94,
          description: 'Worked on systems handling millions of requests/day',
          examples: ['Payment processing', 'Social media feeds', 'Real-time messaging']
        },
        {
          pattern: 'Database-heavy applications',
          successRate: 88,
          description: 'Experience with complex queries and large datasets',
          examples: ['Analytics platforms', 'Financial systems', 'E-commerce inventory']
        },
        {
          pattern: 'Microservices architecture',
          successRate: 85,
          description: 'Designed and maintained distributed service systems',
          examples: ['Service decomposition', 'API gateway setup', 'Inter-service communication']
        }
      ],
      companyBackgrounds: [
        {
          type: 'High-traffic tech companies',
          successRate: 92,
          reasoning: 'Experience with scale, performance, and reliability challenges',
          examples: ['Google', 'Facebook', 'Amazon', 'Netflix', 'Uber']
        },
        {
          type: 'Fintech companies',
          successRate: 88,
          reasoning: 'Strong database skills and system reliability requirements',
          examples: ['Stripe', 'Square', 'PayPal', 'Robinhood', 'Coinbase']
        },
        {
          type: 'Data-intensive startups',
          successRate: 84,
          reasoning: 'Complex data modeling and query optimization experience',
          examples: ['Databricks', 'Snowflake', 'MongoDB', 'Elastic']
        }
      ],
      redFlags: [
        {
          flag: 'Only CRUD application experience',
          failureRate: 79,
          explanation: 'Cannot handle complex system design or optimization challenges'
        },
        {
          flag: 'No algorithm practice',
          failureRate: 85,
          explanation: 'Struggles with complexity analysis and optimization problems'
        },
        {
          flag: 'Framework-only knowledge',
          failureRate: 71,
          explanation: 'Knows Rails/Django but not underlying database or system concepts'
        }
      ],
      sourcingChannels: [
        {
          channel: 'GitHub (system design repos)',
          passRate: 89,
          volume: 'Low',
          recommendation: 'Look for candidates with distributed systems or database projects'
        },
        {
          channel: 'Tech blog authors',
          passRate: 91,
          volume: 'Very Low',
          recommendation: 'Engineers who write about scalability often have deep knowledge'
        },
        {
          channel: 'Database/infrastructure meetups',
          passRate: 86,
          volume: 'Low',
          recommendation: 'PostgreSQL, Redis, Kubernetes meetup attendees'
        },
        {
          channel: 'LinkedIn (Java/Python keywords)',
          passRate: 38,
          volume: 'High',
          recommendation: 'Avoid - too many junior developers without systems experience'
        }
      ]
    },
    'Full Stack Engineer': {
      mustHaveSkills: [
        {
          skill: 'End-to-End Feature Ownership',
          importance: 'Critical',
          passRate: 82,
          description: 'Database design through UI implementation for complete features'
        },
        {
          skill: 'API Integration Patterns',
          importance: 'Critical',
          passRate: 76,
          description: 'Error handling, authentication, CORS, request lifecycle understanding'
        },
        {
          skill: 'DevOps Fundamentals',
          importance: 'High',
          passRate: 71,
          description: 'CI/CD, containerization, environment management basics'
        },
        {
          skill: 'Database Schema Design',
          importance: 'High',
          passRate: 68,
          description: 'Normalization, relationships, migration strategies'
        }
      ],
      experiencePatterns: [
        {
          pattern: 'Startup full-stack ownership',
          successRate: 91,
          description: 'Sole or primary developer on features from conception to deployment',
          examples: ['MVP development', 'Feature lead at <50 person company', 'Solo technical founder']
        },
        {
          pattern: 'Consulting/agency background',
          successRate: 87,
          description: 'Exposure to multiple tech stacks and rapid development cycles',
          examples: ['Digital agency work', 'Freelance projects', 'Consulting firm experience']
        },
        {
          pattern: 'Technical leadership experience',
          successRate: 84,
          description: 'Mentored other developers or made architectural decisions',
          examples: ['Tech lead role', 'Architecture decisions', 'Code review responsibility']
        }
      ],
      companyBackgrounds: [
        {
          type: 'Early-stage startups',
          successRate: 89,
          reasoning: 'Forced to work across the entire stack with limited resources',
          examples: ['Series A companies', 'YC companies', '<100 employee startups']
        },
        {
          type: 'Digital agencies',
          successRate: 85,
          reasoning: 'Rapid development cycles and diverse technology exposure',
          examples: ['Thoughtbot', 'IDEO', 'Huge', 'R/GA']
        },
        {
          type: 'Product-focused companies',
          successRate: 81,
          reasoning: 'Understanding of user needs and business requirements',
          examples: ['GitHub', 'Slack', 'Notion', 'Linear']
        }
      ],
      redFlags: [
        {
          flag: 'Specialized in one layer only',
          failureRate: 74,
          explanation: 'Strong frontend OR backend but cannot connect the pieces effectively'
        },
        {
          flag: 'No deployment experience',
          failureRate: 82,
          explanation: 'Cannot explain how their code gets from development to production'
        },
        {
          flag: 'Large company only experience',
          failureRate: 65,
          explanation: 'May have worked on small pieces without understanding full system'
        }
      ],
      sourcingChannels: [
        {
          channel: 'Indie hacker communities',
          passRate: 92,
          volume: 'Low',
          recommendation: 'Solo developers who build complete products show full-stack skills'
        },
        {
          channel: 'Startup job boards',
          passRate: 84,
          volume: 'Medium',
          recommendation: 'AngelList, YC jobs - candidates comfortable with full-stack roles'
        },
        {
          channel: 'GitHub (full-stack projects)',
          passRate: 81,
          volume: 'Medium',
          recommendation: 'Look for repos with both frontend and backend code'
        },
        {
          channel: 'General job boards',
          passRate: 45,
          volume: 'High',
          recommendation: 'Too many specialized developers applying for full-stack roles'
        }
      ]
    },
    'Data Engineer': {
      mustHaveSkills: [
        {
          skill: 'Distributed Computing Frameworks',
          importance: 'Critical',
          passRate: 79,
          description: 'Hands-on Spark, Hadoop, or similar big data framework experience'
        },
        {
          skill: 'Data Pipeline Architecture',
          importance: 'Critical',
          passRate: 74,
          description: 'ETL design, fault tolerance, data quality, monitoring'
        },
        {
          skill: 'Advanced SQL & Query Optimization',
          importance: 'Critical',
          passRate: 82,
          description: 'Window functions, CTEs, query execution plans, performance tuning'
        },
        {
          skill: 'Stream Processing Concepts',
          importance: 'High',
          passRate: 67,
          description: 'Kafka, real-time data processing, event-driven architectures'
        }
      ],
      experiencePatterns: [
        {
          pattern: 'Big data platform experience',
          successRate: 93,
          description: 'Worked with petabyte-scale data processing systems',
          examples: ['Data lake architecture', 'Real-time analytics', 'ML pipeline infrastructure']
        },
        {
          pattern: 'Analytics platform development',
          successRate: 87,
          description: 'Built systems for business intelligence and reporting',
          examples: ['Dashboard backends', 'Data warehouse design', 'Metrics infrastructure']
        },
        {
          pattern: 'Infrastructure automation',
          successRate: 84,
          description: 'Experience with data infrastructure as code and automation',
          examples: ['Airflow DAGs', 'Terraform for data resources', 'Kubernetes data jobs']
        }
      ],
      companyBackgrounds: [
        {
          type: 'Data-first companies',
          successRate: 94,
          reasoning: 'Core business built around data processing and analytics',
          examples: ['Databricks', 'Snowflake', 'Palantir', 'Confluent']
        },
        {
          type: 'High-scale consumer platforms',
          successRate: 89,
          reasoning: 'Massive data volumes requiring sophisticated processing',
          examples: ['Netflix', 'Spotify', 'Uber', 'Airbnb']
        },
        {
          type: 'Financial services',
          successRate: 86,
          reasoning: 'Complex data requirements and regulatory compliance',
          examples: ['Goldman Sachs', 'JPMorgan', 'Two Sigma', 'Citadel']
        }
      ],
      redFlags: [
        {
          flag: 'SQL-only experience',
          failureRate: 87,
          explanation: 'Cannot handle distributed computing or big data frameworks'
        },
        {
          flag: 'No production pipeline experience',
          failureRate: 81,
          explanation: 'Academic or toy projects only, no real-world data engineering'
        },
        {
          flag: 'BI tool focus only',
          failureRate: 76,
          explanation: 'Tableau/PowerBI experience without underlying data engineering skills'
        }
      ],
      sourcingChannels: [
        {
          channel: 'Data engineering conferences',
          passRate: 91,
          volume: 'Very Low',
          recommendation: 'Strata, DataEngConf speakers and attendees have proven expertise'
        },
        {
          channel: 'Apache project contributors',
          passRate: 94,
          volume: 'Very Low',
          recommendation: 'Spark, Kafka, Airflow contributors demonstrate deep technical knowledge'
        },
        {
          channel: 'Data science → engineering transition',
          passRate: 78,
          volume: 'Low',
          recommendation: 'Data scientists with strong engineering skills often excel'
        },
        {
          channel: 'LinkedIn (data engineer title)',
          passRate: 41,
          volume: 'High',
          recommendation: 'Many BI analysts or junior developers use this title incorrectly'
        }
      ]
    }
  }

  return roleData[roleName] || roleData['Frontend Engineer']
}

export function RoleSpecificSourcing({ roleName }: RoleSpecificSourcingProps) {
  const data = getSourcingData(roleName)

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'Critical': return 'bg-red-100 text-red-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 85) return 'text-green-600'
    if (rate >= 70) return 'text-blue-600'
    return 'text-orange-600'
  }

  return (
    <Card className="p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-500" />
            Role-Specific Sourcing Intelligence - {roleName}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Exactly what to look for when sourcing candidates who will pass technical assessments
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Must-Have Skills */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Must-Have Technical Skills
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.mustHaveSkills.map((skill, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-900">{skill.skill}</h5>
                  <Badge className={getImportanceColor(skill.importance)} variant="secondary">
                    {skill.importance}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{skill.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Pass rate when present:</span>
                  <span className={`font-bold ${getSuccessRateColor(skill.passRate)}`}>
                    {skill.passRate}%
                  </span>
                </div>
                <Progress value={skill.passRate} className="h-1 mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Experience Patterns */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            High-Success Experience Patterns
          </h4>
          <div className="space-y-3">
            {data.experiencePatterns.map((pattern, index) => (
              <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-blue-900">{pattern.pattern}</h5>
                  <Badge className="bg-blue-100 text-blue-800" variant="secondary">
                    {pattern.successRate}% success rate
                  </Badge>
                </div>
                <p className="text-sm text-blue-800 mb-2">{pattern.description}</p>
                <div className="flex flex-wrap gap-1">
                  {pattern.examples.map((example, idx) => (
                    <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Backgrounds */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-purple-500" />
            Optimal Company Backgrounds
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {data.companyBackgrounds.map((bg, index) => (
              <div key={index} className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-purple-900">{bg.type}</h5>
                  <Badge className="bg-purple-100 text-purple-800" variant="secondary">
                    {bg.successRate}%
                  </Badge>
                </div>
                <p className="text-sm text-purple-800 mb-3">{bg.reasoning}</p>
                <div className="space-y-1">
                  {bg.examples.map((example, idx) => (
                    <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded inline-block mr-1 mb-1">
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Red Flags */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
            Red Flags to Avoid
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {data.redFlags.map((flag, index) => (
              <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-red-900">{flag.flag}</h5>
                  <Badge className="bg-red-100 text-red-800" variant="secondary">
                    {flag.failureRate}% fail
                  </Badge>
                </div>
                <p className="text-sm text-red-800">{flag.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sourcing Channels */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Users className="w-5 h-5 mr-2 text-green-500" />
            Sourcing Channel Performance
          </h4>
          <div className="space-y-3">
            {data.sourcingChannels.map((channel, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{channel.channel}</h5>
                    <p className="text-sm text-gray-600 mt-1">{channel.recommendation}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getSuccessRateColor(channel.passRate)}`}>
                      {channel.passRate}%
                    </div>
                    <div className="text-xs text-gray-500">pass rate</div>
                    <Badge variant="outline" className="text-xs mt-1">
                      {channel.volume} volume
                    </Badge>
                  </div>
                </div>
                <Progress value={channel.passRate} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
