export interface CandidateResult {
  id: string
  name: string
  email: string
  submissionDate: string
  roleName: string
  roleId: string
  seniority: 'Junior' | 'Mid-level' | 'Senior' | 'Staff' | 'Principal'
  location: string
  interviewDate: string
  interviewDuration: number // in minutes
  overallRecommendation: 'Fast Track' | 'Invite to Next Round' | 'Requires Further Review' | 'Do Not Pass'
  overallScore: number // 0-100
  aboveBar: boolean
  
  // Detailed Assessment Scores
  assessmentScores: {
    technicalSkills: {
      score: number
      details: {
        dataStructuresAlgorithms?: number
        systemDesign?: number
        sweKnowledge?: number
        frameworkSpecific?: number
      }
    }
    problemSolving: {
      score: number
      details: {
        approachMethodology: number
        debuggingStrategy: number
        edgeCaseHandling: number
        timeComplexity: number
      }
    }
    communication: {
      score: number
      details: {
        technicalExplanation: number
        questionClarification: number
        thoughtProcess: number
        collaboration: number
      }
    }
    codeQuality: {
      score: number
      details: {
        structure: number
        readability: number
        bestPractices: number
        errorHandling: number
      }
    }
  }

  // Specific Feedback
  feedback: {
    strengths: string[]
    areasForImprovement: string[]
    specificObservations: string[]
    interviewerNotes: string
  }

  // Performance Indicators
  performance: {
    completedInTime: boolean
    askedGoodQuestions: boolean
    handledPressureWell: boolean
    showedGrowthMindset: boolean
  }

  // Benchmarking
  benchmarkData: {
    percentileRank: number // 0-100, where they rank among all candidates
    roleSpecificRank: number // 0-100, where they rank for this specific role
    comparedToBar: number // How much above/below the bar (-50 to +50)
  }
}

export const candidatesData: CandidateResult[] = [
  {
    id: 'cand-001',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    submissionDate: '2024-03-15',
    roleName: 'Frontend Engineer',
    roleId: 'fe-001',
    seniority: 'Senior',
    location: 'San Francisco, CA',
    interviewDate: '2024-03-18',
    interviewDuration: 55,
    overallRecommendation: 'Fast Track',
    overallScore: 87,
    aboveBar: true,
    assessmentScores: {
      technicalSkills: {
        score: 85,
        details: {
          dataStructuresAlgorithms: 82,
          systemDesign: 78,
          sweKnowledge: 88,
          frameworkSpecific: 92
        }
      },
      problemSolving: {
        score: 89,
        details: {
          approachMethodology: 92,
          debuggingStrategy: 88,
          edgeCaseHandling: 85,
          timeComplexity: 91
        }
      },
      communication: {
        score: 91,
        details: {
          technicalExplanation: 93,
          questionClarification: 89,
          thoughtProcess: 92,
          collaboration: 90
        }
      },
      codeQuality: {
        score: 84,
        details: {
          structure: 87,
          readability: 85,
          bestPractices: 82,
          errorHandling: 82
        }
      }
    },
    feedback: {
      strengths: [
        'Excellent React component architecture with clean separation of concerns',
        'Strong debugging approach using browser dev tools effectively',
        'Clear communication of technical decisions and trade-offs',
        'Solid understanding of modern JavaScript ES6+ features'
      ],
      areasForImprovement: [
        'Could improve knowledge of advanced React patterns like render props',
        'Performance optimization strategies could be more comprehensive'
      ],
      specificObservations: [
        'Started with component structure planning before coding',
        'Asked clarifying questions about browser support requirements',
        'Demonstrated good understanding of accessibility principles'
      ],
      interviewerNotes: 'Strong candidate with excellent technical foundation. Communication skills are outstanding. Would be a great addition to the team.'
    },
    performance: {
      completedInTime: true,
      askedGoodQuestions: true,
      handledPressureWell: true,
      showedGrowthMindset: true
    },
    benchmarkData: {
      percentileRank: 92,
      roleSpecificRank: 89,
      comparedToBar: 37
    }
  },
  {
    id: 'cand-002',
    name: 'Marcus Johnson',
    email: 'marcus.j@email.com',
    submissionDate: '2024-03-14',
    roleName: 'Backend Engineer',
    roleId: 'be-001',
    seniority: 'Mid-level',
    location: 'Austin, TX',
    interviewDate: '2024-03-17',
    interviewDuration: 52,
    overallRecommendation: 'Invite to Next Round',
    overallScore: 72,
    aboveBar: true,
    assessmentScores: {
      technicalSkills: {
        score: 74,
        details: {
          dataStructuresAlgorithms: 78,
          systemDesign: 68,
          sweKnowledge: 76,
          frameworkSpecific: 75
        }
      },
      problemSolving: {
        score: 71,
        details: {
          approachMethodology: 73,
          debuggingStrategy: 69,
          edgeCaseHandling: 68,
          timeComplexity: 74
        }
      },
      communication: {
        score: 75,
        details: {
          technicalExplanation: 77,
          questionClarification: 72,
          thoughtProcess: 76,
          collaboration: 75
        }
      },
      codeQuality: {
        score: 68,
        details: {
          structure: 71,
          readability: 69,
          bestPractices: 65,
          errorHandling: 67
        }
      }
    },
    feedback: {
      strengths: [
        'Good understanding of RESTful API design principles',
        'Solid SQL skills with proper indexing knowledge',
        'Clear explanation of database design decisions',
        'Good grasp of authentication and authorization concepts'
      ],
      areasForImprovement: [
        'System design depth needs improvement for scalability scenarios',
        'Error handling patterns could be more comprehensive',
        'Performance optimization knowledge is limited'
      ],
      specificObservations: [
        'Started with database schema design approach',
        'Asked about expected load and scaling requirements',
        'Showed good understanding of ACID properties'
      ],
      interviewerNotes: 'Solid mid-level candidate with room for growth. Good fundamentals but needs more experience with large-scale systems.'
    },
    performance: {
      completedInTime: true,
      askedGoodQuestions: true,
      handledPressureWell: false,
      showedGrowthMindset: true
    },
    benchmarkData: {
      percentileRank: 68,
      roleSpecificRank: 72,
      comparedToBar: 22
    }
  },
  {
    id: 'cand-003',
    name: 'Elena Rodriguez',
    email: 'elena.r@email.com',
    submissionDate: '2024-03-13',
    roleName: 'Full Stack Engineer',
    roleId: 'fs-001',
    seniority: 'Senior',
    location: 'Remote',
    interviewDate: '2024-03-16',
    interviewDuration: 58,
    overallRecommendation: 'Fast Track',
    overallScore: 83,
    aboveBar: true,
    assessmentScores: {
      technicalSkills: {
        score: 81,
        details: {
          dataStructuresAlgorithms: 79,
          systemDesign: 84,
          sweKnowledge: 82,
          frameworkSpecific: 80
        }
      },
      problemSolving: {
        score: 85,
        details: {
          approachMethodology: 87,
          debuggingStrategy: 83,
          edgeCaseHandling: 84,
          timeComplexity: 86
        }
      },
      communication: {
        score: 86,
        details: {
          technicalExplanation: 88,
          questionClarification: 84,
          thoughtProcess: 87,
          collaboration: 85
        }
      },
      codeQuality: {
        score: 79,
        details: {
          structure: 82,
          readability: 78,
          bestPractices: 77,
          errorHandling: 79
        }
      }
    },
    feedback: {
      strengths: [
        'Excellent full-stack thinking with good frontend/backend integration',
        'Strong system design skills with practical experience',
        'Versatile technology knowledge across multiple domains',
        'Great at explaining complex technical concepts clearly'
      ],
      areasForImprovement: [
        'Could deepen expertise in specific areas rather than broad knowledge',
        'Performance optimization could be more systematic',
        'Testing strategies across the stack need improvement'
      ],
      specificObservations: [
        'Approached problem with end-to-end thinking',
        'Considered user experience in technical decisions',
        'Demonstrated good understanding of deployment practices'
      ],
      interviewerNotes: 'Excellent full-stack engineer with great balance of skills. Strong communicator and problem solver.'
    },
    performance: {
      completedInTime: true,
      askedGoodQuestions: true,
      handledPressureWell: true,
      showedGrowthMindset: true
    },
    benchmarkData: {
      percentileRank: 88,
      roleSpecificRank: 91,
      comparedToBar: 33
    }
  },
  {
    id: 'cand-004',
    name: 'David Kim',
    email: 'david.kim@email.com',
    submissionDate: '2024-03-12',
    roleName: 'Data Engineer',
    roleId: 'de-001',
    seniority: 'Senior',
    location: 'Seattle, WA',
    interviewDate: '2024-03-15',
    interviewDuration: 54,
    overallRecommendation: 'Invite to Next Round',
    overallScore: 75,
    aboveBar: true,
    assessmentScores: {
      technicalSkills: {
        score: 77,
        details: {
          dataStructuresAlgorithms: 74,
          systemDesign: 79,
          sweKnowledge: 76,
          frameworkSpecific: 78
        }
      },
      problemSolving: {
        score: 73,
        details: {
          approachMethodology: 76,
          debuggingStrategy: 71,
          edgeCaseHandling: 72,
          timeComplexity: 73
        }
      },
      communication: {
        score: 76,
        details: {
          technicalExplanation: 78,
          questionClarification: 74,
          thoughtProcess: 77,
          collaboration: 75
        }
      },
      codeQuality: {
        score: 74,
        details: {
          structure: 76,
          readability: 73,
          bestPractices: 72,
          errorHandling: 75
        }
      }
    },
    feedback: {
      strengths: [
        'Strong SQL skills with complex query optimization experience',
        'Good understanding of ETL pipeline design and implementation',
        'Solid data modeling and warehouse design knowledge',
        'Clear explanation of data quality and validation strategies'
      ],
      areasForImprovement: [
        'Real-time streaming processing knowledge is limited',
        'Big data frameworks experience is mostly theoretical',
        'Cloud-native data services could be better understood'
      ],
      specificObservations: [
        'Started with data source analysis and quality assessment',
        'Focused on scalability and performance considerations',
        'Showed good understanding of data governance principles'
      ],
      interviewerNotes: 'Strong traditional data engineering skills. Would benefit from more modern big data experience.'
    },
    performance: {
      completedInTime: true,
      askedGoodQuestions: true,
      handledPressureWell: true,
      showedGrowthMindset: false
    },
    benchmarkData: {
      percentileRank: 72,
      roleSpecificRank: 68,
      comparedToBar: 25
    }
  },
  {
    id: 'cand-005',
    name: 'Aisha Patel',
    email: 'aisha.patel@email.com',
    submissionDate: '2024-03-11',
    roleName: 'Frontend Engineer',
    roleId: 'fe-001',
    seniority: 'Junior',
    location: 'New York, NY',
    interviewDate: '2024-03-14',
    interviewDuration: 48,
    overallRecommendation: 'Requires Further Review',
    overallScore: 58,
    aboveBar: false,
    assessmentScores: {
      technicalSkills: {
        score: 56,
        details: {
          dataStructuresAlgorithms: 52,
          systemDesign: 45,
          sweKnowledge: 61,
          frameworkSpecific: 65
        }
      },
      problemSolving: {
        score: 59,
        details: {
          approachMethodology: 62,
          debuggingStrategy: 54,
          edgeCaseHandling: 51,
          timeComplexity: 69
        }
      },
      communication: {
        score: 63,
        details: {
          technicalExplanation: 65,
          questionClarification: 61,
          thoughtProcess: 64,
          collaboration: 62
        }
      },
      codeQuality: {
        score: 55,
        details: {
          structure: 58,
          readability: 56,
          bestPractices: 51,
          errorHandling: 55
        }
      }
    },
    feedback: {
      strengths: [
        'Good enthusiasm and willingness to learn',
        'Basic React knowledge is solid for junior level',
        'Clear communication and asks relevant questions',
        'Shows good potential for growth with mentorship'
      ],
      areasForImprovement: [
        'JavaScript fundamentals need strengthening',
        'Debugging approach is not systematic enough',
        'Need more practice with complex problem solving',
        'Code organization and best practices need work'
      ],
      specificObservations: [
        'Struggled with advanced JavaScript concepts',
        'Needed guidance to complete the coding challenge',
        'Showed good attitude when receiving feedback'
      ],
      interviewerNotes: 'Junior candidate with potential but needs significant development. Could be good with strong mentorship program.'
    },
    performance: {
      completedInTime: false,
      askedGoodQuestions: true,
      handledPressureWell: false,
      showedGrowthMindset: true
    },
    benchmarkData: {
      percentileRank: 32,
      roleSpecificRank: 28,
      comparedToBar: -12
    }
  },
  {
    id: 'cand-006',
    name: 'James Wilson',
    email: 'james.wilson@email.com',
    submissionDate: '2024-03-10',
    roleName: 'Backend Engineer',
    roleId: 'be-001',
    seniority: 'Junior',
    location: 'Chicago, IL',
    interviewDate: '2024-03-13',
    interviewDuration: 45,
    overallRecommendation: 'Do Not Pass',
    overallScore: 42,
    aboveBar: false,
    assessmentScores: {
      technicalSkills: {
        score: 38,
        details: {
          dataStructuresAlgorithms: 35,
          systemDesign: 28,
          sweKnowledge: 42,
          frameworkSpecific: 47
        }
      },
      problemSolving: {
        score: 44,
        details: {
          approachMethodology: 41,
          debuggingStrategy: 39,
          edgeCaseHandling: 38,
          timeComplexity: 58
        }
      },
      communication: {
        score: 48,
        details: {
          technicalExplanation: 45,
          questionClarification: 51,
          thoughtProcess: 47,
          collaboration: 49
        }
      },
      codeQuality: {
        score: 40,
        details: {
          structure: 38,
          readability: 41,
          bestPractices: 37,
          errorHandling: 44
        }
      }
    },
    feedback: {
      strengths: [
        'Shows basic understanding of programming concepts',
        'Willing to ask questions when stuck',
        'Has some exposure to web development frameworks'
      ],
      areasForImprovement: [
        'Fundamental programming concepts need significant work',
        'Problem-solving approach is not structured',
        'Lacks understanding of basic system design principles',
        'Code quality and organization need major improvement'
      ],
      specificObservations: [
        'Struggled with basic algorithm implementation',
        'Could not explain time complexity concepts',
        'Required significant hints to make progress'
      ],
      interviewerNotes: 'Not ready for this level of position. Would benefit from more foundational training before interviewing again.'
    },
    performance: {
      completedInTime: false,
      askedGoodQuestions: false,
      handledPressureWell: false,
      showedGrowthMindset: false
    },
    benchmarkData: {
      percentileRank: 15,
      roleSpecificRank: 12,
      comparedToBar: -28
    }
  }
  // Add more candidates as needed...
]

// Helper function to get candidates by role
export function getCandidatesByRole(roleName: string): CandidateResult[] {
  return candidatesData.filter(candidate => candidate.roleName === roleName)
}

// Helper function to get role performance summary
export function getRolePerformanceSummary(roleName: string) {
  const roleCandidates = getCandidatesByRole(roleName)
  if (roleCandidates.length === 0) return null

  const aboveBarCount = roleCandidates.filter(c => c.aboveBar).length
  const averageScore = roleCandidates.reduce((sum, c) => sum + c.overallScore, 0) / roleCandidates.length
  
  const recommendationCounts = {
    'Fast Track': roleCandidates.filter(c => c.overallRecommendation === 'Fast Track').length,
    'Invite to Next Round': roleCandidates.filter(c => c.overallRecommendation === 'Invite to Next Round').length,
    'Requires Further Review': roleCandidates.filter(c => c.overallRecommendation === 'Requires Further Review').length,
    'Do Not Pass': roleCandidates.filter(c => c.overallRecommendation === 'Do Not Pass').length,
  }

  return {
    totalCandidates: roleCandidates.length,
    aboveBarRate: Math.round((aboveBarCount / roleCandidates.length) * 100),
    averageScore: Math.round(averageScore),
    recommendationDistribution: {
      fastTrack: Math.round((recommendationCounts['Fast Track'] / roleCandidates.length) * 100),
      inviteToNextRound: Math.round((recommendationCounts['Invite to Next Round'] / roleCandidates.length) * 100),
      requiresFurtherReview: Math.round((recommendationCounts['Requires Further Review'] / roleCandidates.length) * 100),
      doNotPass: Math.round((recommendationCounts['Do Not Pass'] / roleCandidates.length) * 100),
    }
  }
}
