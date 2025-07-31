import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  TrendingDown, TrendingUp, AlertTriangle, Target, Users, 
  Code, MessageCircle, Clock, Brain, CheckCircle, X,
  ArrowRight, BookOpen, Lightbulb, Zap
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface PerformanceDeepDiveModalProps {
  isOpen: boolean
  onClose: () => void
  client?: string
  role?: string
  metric: 'pass_rate' | 'time_to_fill' | 'quality_score' | 'placement_rate'
  currentValue: number
  targetValue: number
}

export function PerformanceDeepDiveModal({
  isOpen,
  onClose,
  client,
  role,
  metric,
  currentValue,
  targetValue
}: PerformanceDeepDiveModalProps) {
  const [activeTab, setActiveTab] = useState("analysis")

  // Mock data - in real app this would be based on the specific client/role
  const failureAnalysis = [
    { stage: "Technical Assessment", failureRate: 35, commonIssues: ["Algorithm complexity", "Data structures", "Code optimization"] },
    { stage: "System Design", failureRate: 28, commonIssues: ["Scalability planning", "Database design", "API architecture"] },
    { stage: "Communication", failureRate: 22, commonIssues: ["Explaining solutions", "Asking clarifying questions", "Presentation skills"] },
    { stage: "Cultural Fit", failureRate: 15, commonIssues: ["Team collaboration", "Work style mismatch", "Company values alignment"] }
  ]

  const sourcingBreakdown = [
    { source: "LinkedIn", candidates: 145, passRate: 32, cost: 85, quality: 3.8 },
    { source: "Internal Referrals", candidates: 89, passRate: 56, cost: 45, quality: 4.2 },
    { source: "Job Boards", candidates: 234, passRate: 18, cost: 35, quality: 3.2 },
    { source: "Technical Communities", candidates: 67, passRate: 48, cost: 65, quality: 4.0 },
    { source: "University Partnerships", candidates: 123, passRate: 41, cost: 55, quality: 3.9 }
  ]

  const skillGapAnalysis = [
    { skill: "React/Frontend", demand: 85, supply: 45, gap: 40, priority: "high" },
    { skill: "System Design", demand: 78, supply: 32, gap: 46, priority: "high" },
    { skill: "Python/Backend", demand: 92, supply: 78, gap: 14, priority: "medium" },
    { skill: "Communication", demand: 100, supply: 60, gap: 40, priority: "high" },
    { skill: "Database Design", demand: 65, supply: 48, gap: 17, priority: "medium" }
  ]

  const recommendations = [
    {
      priority: "High",
      category: "Training",
      action: "System Design Bootcamp",
      impact: "+12% pass rate",
      timeframe: "3 weeks",
      cost: "$2,500",
      description: "Intensive training on scalable architecture patterns, focusing on microservices and database optimization"
    },
    {
      priority: "High", 
      category: "Sourcing",
      action: "Expand Internal Referrals",
      impact: "+8% pass rate",
      timeframe: "2 weeks",
      cost: "$1,200",
      description: "Implement referral incentive program and automate referral tracking system"
    },
    {
      priority: "Medium",
      category: "Screening",
      action: "Pre-interview Assessment",
      impact: "+6% efficiency",
      timeframe: "1 week",
      cost: "$800",
      description: "Add technical screening to filter candidates before expensive client interviews"
    },
    {
      priority: "Medium",
      category: "Training",
      action: "Communication Workshop",
      impact: "+5% pass rate",
      timeframe: "2 weeks",
      cost: "$1,800",
      description: "Focus on technical communication and presentation skills for client interviews"
    }
  ]

  const getMetricTitle = () => {
    switch (metric) {
      case 'pass_rate': return 'Pass Rate Analysis'
      case 'time_to_fill': return 'Time to Fill Analysis'
      case 'quality_score': return 'Quality Score Analysis'
      case 'placement_rate': return 'Placement Rate Analysis'
      default: return 'Performance Analysis'
    }
  }

  const getMetricIcon = () => {
    switch (metric) {
      case 'pass_rate': return <Target className="h-5 w-5" />
      case 'time_to_fill': return <Clock className="h-5 w-5" />
      case 'quality_score': return <Users className="h-5 w-5" />
      case 'placement_rate': return <CheckCircle className="h-5 w-5" />
      default: return <Target className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getMetricIcon()}
            {getMetricTitle()}
            {client && role && <span className="text-base font-normal text-gray-600">• {role} at {client}</span>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{currentValue}%</div>
                  <div className="text-sm text-gray-600">Current {metric.replace('_', ' ')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{targetValue}%</div>
                  <div className="text-sm text-gray-600">Target {metric.replace('_', ' ')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{targetValue - currentValue}%</div>
                  <div className="text-sm text-gray-600">Gap to close</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress to Target</span>
                  <span>{Math.round((currentValue / targetValue) * 100)}%</span>
                </div>
                <Progress value={(currentValue / targetValue) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="analysis">Failure Analysis</TabsTrigger>
              <TabsTrigger value="sourcing">Sourcing Breakdown</TabsTrigger>
              <TabsTrigger value="skills">Skill Gaps</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Where Candidates Are Failing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={failureAnalysis}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="stage" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="failureRate" fill="#ef4444" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      {failureAnalysis.map((stage, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{stage.stage}</h4>
                            <Badge variant="destructive">{stage.failureRate}% failure</Badge>
                          </div>
                          <div className="space-y-1">
                            {stage.commonIssues.map((issue, issueIndex) => (
                              <div key={issueIndex} className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                {issue}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sourcing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Sourcing Channel Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Source</th>
                          <th className="text-left p-2">Candidates</th>
                          <th className="text-left p-2">Pass Rate</th>
                          <th className="text-left p-2">Cost per Hire</th>
                          <th className="text-left p-2">Quality Score</th>
                          <th className="text-left p-2">Efficiency</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sourcingBreakdown.map((source, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2 font-medium">{source.source}</td>
                            <td className="p-2">{source.candidates}</td>
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <span className={`font-medium ${source.passRate > 40 ? 'text-green-600' : source.passRate > 25 ? 'text-yellow-600' : 'text-red-600'}`}>
                                  {source.passRate}%
                                </span>
                                {source.passRate > 40 ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
                              </div>
                            </td>
                            <td className="p-2">${source.cost}</td>
                            <td className="p-2">{source.quality}/5</td>
                            <td className="p-2">
                              <Badge variant={source.passRate > 40 ? "default" : source.passRate > 25 ? "secondary" : "destructive"}>
                                {source.passRate > 40 ? "High" : source.passRate > 25 ? "Medium" : "Low"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Alert className="mt-4">
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Key Insight:</strong> Internal referrals have 56% pass rate vs 18% from job boards. 
                      Focus on expanding referral programs and reducing job board dependency.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    Skills Gap Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {skillGapAnalysis.map((skill, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{skill.skill}</h4>
                          <Badge className={getPriorityColor(skill.priority)}>
                            {skill.priority} priority
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-gray-600">Market Demand</div>
                            <div className="font-medium">{skill.demand}%</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Your Supply</div>
                            <div className="font-medium">{skill.supply}%</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Gap</div>
                            <div className="font-medium text-red-600">{skill.gap}%</div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex gap-2">
                            <div className="flex-1 bg-blue-200 h-2 rounded">
                              <div 
                                className="bg-blue-500 h-2 rounded" 
                                style={{ width: `${skill.supply}%` }}
                              />
                            </div>
                            <div className="flex-1 bg-red-200 h-2 rounded">
                              <div 
                                className="bg-red-500 h-2 rounded" 
                                style={{ width: `${skill.gap}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600 mt-1">
                            <span>Current Supply</span>
                            <span>Skills Gap</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Actionable Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge className={getPriorityColor(rec.priority.toLowerCase())}>
                              {rec.priority}
                            </Badge>
                            <div>
                              <h4 className="font-semibold">{rec.action}</h4>
                              <p className="text-sm text-gray-600">{rec.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">{rec.impact}</div>
                            <div className="text-sm text-gray-600">{rec.timeframe}</div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600">Cost: <span className="font-medium">{rec.cost}</span></span>
                            <span className="text-gray-600">Timeline: <span className="font-medium">{rec.timeframe}</span></span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <BookOpen className="h-4 w-4 mr-1" />
                              Learn More
                            </Button>
                            <Button size="sm">
                              <ArrowRight className="h-4 w-4 mr-1" />
                              Implement
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Alert className="mt-4">
                    <Target className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Implementation Priority:</strong> Start with System Design training and Internal Referral expansion 
                      for maximum impact. Expected combined improvement: +20% pass rate within 5 weeks.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
} 