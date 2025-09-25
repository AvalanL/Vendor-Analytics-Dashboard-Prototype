import { candidatesData, getRolePerformanceSummary } from './candidate-data'

export interface RoleInsight {
  roleName: string
  volume: number
  aboveBarRate: number
  trend: number
  recommendationDistribution: {
    doNotPass: number
    requiresFurtherReview: number
    inviteToNextRound: number
    fastTrack: number
  }
  strengthsObserved: string[]
  areasForImprovement: string[]
  commonPatterns: {
    strongAreas: string[]
    challengingAreas: string[]
    interviewBehaviors: string[]
  }
  benchmarkComparison: {
    industryAboveBarRate: number
    yourRanking: string
  }
  detailedFeedback: {
    technicalSkills: {
      score: number
      insights: string[]
    }
    problemSolving: {
      score: number
      insights: string[]
    }
    communication: {
      score: number
      insights: string[]
    }
    codeQuality: {
      score: number
      insights: string[]
    }
  }
}

export const roleInsightsData: RoleInsight[] = [
  {
    roleName: 'Frontend Engineer',
    volume: 89,
    aboveBarRate: 72,
    trend: 8,
    recommendationDistribution: {
      doNotPass: 28,
      requiresFurtherReview: 25,
      inviteToNextRound: 35,
      fastTrack: 12
    },
    strengthsObserved: [
      'Excellent React component architecture with proper state management and lifecycle understanding',
      'Strong CSS skills including responsive design, flexbox/grid layouts, and modern styling approaches',
      'Effective use of JavaScript ES6+ features with clean, readable code structure and proper async handling',
      'Good understanding of browser performance optimization including lazy loading and code splitting techniques',
      'Clear articulation of accessibility considerations and semantic HTML practices'
    ],
    areasForImprovement: [
      'Limited experience with complex state management patterns beyond basic React state and props',
      'Insufficient depth in browser APIs and web platform features beyond common DOM manipulation',
      'Testing strategies often incomplete, missing unit tests for edge cases and integration scenarios',
      'Build tool configuration and optimization knowledge gaps affecting development workflow efficiency',
      'Cross-browser compatibility considerations not consistently demonstrated in solutions'
    ],
    commonPatterns: {
      strongAreas: [
        'Component composition and reusability',
        'Event handling and user interaction patterns',
        'Basic performance optimization techniques'
      ],
      challengingAreas: [
        'Advanced state management (Redux, Context patterns)',
        'Complex animation and transition implementations',
        'Progressive web app features and service workers'
      ],
      interviewBehaviors: [
        'Candidates often start with HTML structure before styling',
        'Strong preference for functional components over class components',
        'Tendency to over-engineer simple solutions initially'
      ]
    },
    benchmarkComparison: {
      industryAboveBarRate: 58,
      yourRanking: 'Top 25%'
    },
    detailedFeedback: {
      technicalSkills: {
        score: 75,
        insights: [
          'Strong foundation in React fundamentals and modern JavaScript',
          'Good grasp of CSS and responsive design principles',
          'Limited exposure to advanced frontend tooling and build processes'
        ]
      },
      problemSolving: {
        score: 78,
        insights: [
          'Systematic approach to breaking down UI requirements',
          'Good debugging skills for frontend-specific issues',
          'Sometimes struggles with performance optimization trade-offs'
        ]
      },
      communication: {
        score: 82,
        insights: [
          'Excellent at explaining component design decisions',
          'Clear articulation of user experience considerations',
          'Strong collaboration on design-development handoff discussions'
        ]
      },
      codeQuality: {
        score: 74,
        insights: [
          'Consistent code formatting and naming conventions',
          'Good component organization and file structure',
          'Room for improvement in comprehensive error boundary implementation'
        ]
      }
    }
  },
  {
    roleName: 'Backend Engineer',
    volume: 76,
    aboveBarRate: 65,
    trend: 15,
    recommendationDistribution: {
      doNotPass: 35,
      requiresFurtherReview: 28,
      inviteToNextRound: 27,
      fastTrack: 10
    },
    strengthsObserved: [
      'Solid understanding of RESTful API design principles with proper HTTP status codes and resource modeling',
      'Strong database design skills including normalization, indexing strategies, and query optimization techniques',
      'Effective error handling and logging implementation with appropriate exception management patterns',
      'Good grasp of authentication and authorization patterns including JWT, OAuth, and role-based access control',
      'Clear understanding of microservices architecture principles and service communication patterns'
    ],
    areasForImprovement: [
      'Limited experience with advanced caching strategies and distributed caching systems like Redis',
      'Insufficient depth in message queue systems and asynchronous processing patterns',
      'Database transaction management and concurrency control knowledge gaps in complex scenarios',
      'Limited exposure to containerization and orchestration technologies for deployment scalability',
      'Performance monitoring and observability implementation often incomplete or basic'
    ],
    commonPatterns: {
      strongAreas: [
        'API endpoint design and implementation',
        'SQL query writing and basic optimization',
        'Server-side validation and data processing'
      ],
      challengingAreas: [
        'Distributed system design and coordination',
        'Advanced database performance tuning',
        'Scalable architecture patterns for high-traffic systems'
      ],
      interviewBehaviors: [
        'Candidates typically start with database schema design',
        'Strong focus on data validation and business logic',
        'Often underestimate complexity of distributed system challenges'
      ]
    },
    benchmarkComparison: {
      industryAboveBarRate: 52,
      yourRanking: 'Above Average'
    },
    detailedFeedback: {
      technicalSkills: {
        score: 68,
        insights: [
          'Solid foundation in server-side development and API design',
          'Good database skills but limited advanced optimization experience',
          'Growing knowledge of cloud services and deployment practices'
        ]
      },
      problemSolving: {
        score: 72,
        insights: [
          'Methodical approach to system design and data flow planning',
          'Good at identifying potential bottlenecks and failure points',
          'Sometimes lacks creativity in exploring alternative architectural approaches'
        ]
      },
      communication: {
        score: 69,
        insights: [
          'Clear explanation of system architecture and data flow',
          'Good at discussing trade-offs between different technical approaches',
          'Could improve in explaining complex distributed system concepts'
        ]
      },
      codeQuality: {
        score: 71,
        insights: [
          'Well-structured code with appropriate separation of concerns',
          'Good error handling and input validation practices',
          'Room for improvement in comprehensive testing coverage'
        ]
      }
    }
  },
  {
    roleName: 'Full Stack Engineer',
    volume: 45,
    aboveBarRate: 71,
    trend: 5,
    recommendationDistribution: {
      doNotPass: 29,
      requiresFurtherReview: 26,
      inviteToNextRound: 33,
      fastTrack: 12
    },
    strengthsObserved: [
      'Excellent ability to bridge frontend and backend concerns with cohesive full-stack architecture',
      'Strong integration skills connecting APIs, databases, and user interfaces with proper data flow',
      'Versatile technology stack knowledge spanning multiple frameworks and programming languages',
      'Effective at end-to-end feature development from database design through user interface implementation',
      'Good understanding of deployment pipelines and DevOps practices for full application lifecycle'
    ],
    areasForImprovement: [
      'Depth vs breadth trade-off sometimes results in surface-level knowledge in specialized areas',
      'Complex state management across frontend and backend boundaries can be inconsistent',
      'Performance optimization strategies often focus on one layer while missing cross-stack opportunities',
      'Testing strategies across the full stack sometimes incomplete with gaps in integration testing',
      'Scalability planning tends to be theoretical rather than based on practical high-load experience'
    ],
    commonPatterns: {
      strongAreas: [
        'End-to-end feature development and data flow design',
        'Technology integration and API consumption patterns',
        'User experience considerations in technical decisions'
      ],
      challengingAreas: [
        'Deep specialization in performance-critical components',
        'Complex deployment and infrastructure management',
        'Advanced debugging across multiple system layers'
      ],
      interviewBehaviors: [
        'Candidates often demonstrate broad knowledge but may lack depth',
        'Strong at connecting user requirements to technical implementation',
        'Tendency to propose familiar technology stacks over optimal solutions'
      ]
    },
    benchmarkComparison: {
      industryAboveBarRate: 48,
      yourRanking: 'Top 15%'
    },
    detailedFeedback: {
      technicalSkills: {
        score: 73,
        insights: [
          'Broad technology knowledge with competency across multiple domains',
          'Good integration skills and understanding of system boundaries',
          'Could benefit from deeper specialization in key areas'
        ]
      },
      problemSolving: {
        score: 76,
        insights: [
          'Holistic approach to problem-solving across the entire application stack',
          'Good at identifying dependencies and integration points',
          'Sometimes overcomplicates solutions due to considering too many factors'
        ]
      },
      communication: {
        score: 79,
        insights: [
          'Excellent at translating between technical and business requirements',
          'Clear explanation of system interactions and data flow',
          'Strong ability to discuss trade-offs across different system layers'
        ]
      },
      codeQuality: {
        score: 72,
        insights: [
          'Consistent coding standards across different technologies',
          'Good modularization and separation of concerns',
          'Room for improvement in comprehensive error handling across stack layers'
        ]
      }
    }
  },
  {
    roleName: 'Data Engineer',
    volume: 37,
    aboveBarRate: 62,
    trend: 18,
    recommendationDistribution: {
      doNotPass: 38,
      requiresFurtherReview: 24,
      inviteToNextRound: 28,
      fastTrack: 10
    },
    strengthsObserved: [
      'Strong SQL skills with complex query writing, window functions, and advanced aggregation techniques',
      'Excellent understanding of data pipeline architecture and ETL process design with proper error handling',
      'Good grasp of data modeling principles including dimensional modeling and data warehouse design patterns',
      'Effective use of Python for data processing with pandas, numpy, and data manipulation libraries',
      'Clear understanding of data quality principles and validation strategies for pipeline reliability'
    ],
    areasForImprovement: [
      'Limited experience with real-time streaming data processing and event-driven architecture patterns',
      'Big data technologies knowledge often theoretical without practical implementation experience',
      'Data governance and compliance considerations sometimes overlooked in pipeline design discussions',
      'Performance optimization for large-scale data processing could be more sophisticated and systematic',
      'Cloud-native data services integration and cost optimization strategies need strengthening'
    ],
    commonPatterns: {
      strongAreas: [
        'SQL query optimization and database performance tuning',
        'ETL pipeline design and data transformation logic',
        'Data quality validation and error handling strategies'
      ],
      challengingAreas: [
        'Real-time data streaming and event processing',
        'Big data frameworks like Spark and distributed computing',
        'Advanced machine learning pipeline integration'
      ],
      interviewBehaviors: [
        'Candidates typically start with data source analysis and schema review',
        'Strong focus on data quality and validation throughout solutions',
        'Often underestimate complexity of real-time processing requirements'
      ]
    },
    benchmarkComparison: {
      industryAboveBarRate: 45,
      yourRanking: 'Above Average'
    },
    detailedFeedback: {
      technicalSkills: {
        score: 65,
        insights: [
          'Strong foundation in SQL and traditional data processing',
          'Good understanding of ETL principles and data pipeline design',
          'Limited exposure to modern big data and streaming technologies'
        ]
      },
      problemSolving: {
        score: 70,
        insights: [
          'Systematic approach to data pipeline design and optimization',
          'Good at identifying data quality issues and validation requirements',
          'Sometimes struggles with scalability challenges in high-volume scenarios'
        ]
      },
      communication: {
        score: 67,
        insights: [
          'Clear explanation of data flow and transformation logic',
          'Good at discussing data quality and business impact considerations',
          'Could improve in explaining complex distributed data processing concepts'
        ]
      },
      codeQuality: {
        score: 68,
        insights: [
          'Well-structured SQL queries with proper optimization techniques',
          'Good error handling and logging in data processing scripts',
          'Room for improvement in comprehensive testing of data pipelines'
        ]
      }
    }
  }
]

// Function to generate dynamic role insights based on actual candidate data
export function generateDynamicRoleInsights(): RoleInsight[] {
  const roles = ['Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer', 'Data Engineer']
  
  return roles.map(roleName => {
    const roleCandidates = candidatesData.filter(c => c.roleName === roleName)
    const summary = getRolePerformanceSummary(roleName)
    
    if (!summary || roleCandidates.length === 0) {
      // Return the static data if no candidates found
      return roleInsightsData.find(r => r.roleName === roleName) || roleInsightsData[0]
    }

    // Calculate average scores from actual candidates
    const avgTechnical = Math.round(roleCandidates.reduce((sum, c) => sum + c.assessmentScores.technicalSkills.score, 0) / roleCandidates.length)
    const avgProblemSolving = Math.round(roleCandidates.reduce((sum, c) => sum + c.assessmentScores.problemSolving.score, 0) / roleCandidates.length)
    const avgCommunication = Math.round(roleCandidates.reduce((sum, c) => sum + c.assessmentScores.communication.score, 0) / roleCandidates.length)
    const avgCodeQuality = Math.round(roleCandidates.reduce((sum, c) => sum + c.assessmentScores.codeQuality.score, 0) / roleCandidates.length)

    // Aggregate strengths and improvement areas from actual candidates
    const allStrengths = roleCandidates.flatMap(c => c.feedback.strengths)
    const allImprovements = roleCandidates.flatMap(c => c.feedback.areasForImprovement)
    
    // Get unique strengths and improvements (simplified)
    const uniqueStrengths = [...new Set(allStrengths)].slice(0, 5)
    const uniqueImprovements = [...new Set(allImprovements)].slice(0, 5)

    // Get the static template for this role to preserve detailed insights
    const staticTemplate = roleInsightsData.find(r => r.roleName === roleName)
    
    return {
      roleName,
      volume: summary.totalCandidates,
      aboveBarRate: summary.aboveBarRate,
      trend: Math.floor(Math.random() * 20) - 5, // Random trend for now
      recommendationDistribution: summary.recommendationDistribution,
      strengthsObserved: uniqueStrengths.length > 0 ? uniqueStrengths : (staticTemplate?.strengthsObserved || []),
      areasForImprovement: uniqueImprovements.length > 0 ? uniqueImprovements : (staticTemplate?.areasForImprovement || []),
      commonPatterns: staticTemplate?.commonPatterns || {
        strongAreas: [],
        challengingAreas: [],
        interviewBehaviors: []
      },
      benchmarkComparison: staticTemplate?.benchmarkComparison || {
        industryAboveBarRate: 50,
        yourRanking: 'Average'
      },
      detailedFeedback: {
        technicalSkills: {
          score: avgTechnical,
          insights: staticTemplate?.detailedFeedback.technicalSkills.insights || []
        },
        problemSolving: {
          score: avgProblemSolving,
          insights: staticTemplate?.detailedFeedback.problemSolving.insights || []
        },
        communication: {
          score: avgCommunication,
          insights: staticTemplate?.detailedFeedback.communication.insights || []
        },
        codeQuality: {
          score: avgCodeQuality,
          insights: staticTemplate?.detailedFeedback.codeQuality.insights || []
        }
      }
    }
  })
}
