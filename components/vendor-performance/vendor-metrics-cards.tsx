import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, Target, Zap, Calendar } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

interface VendorMetricsCardsProps {
  selectedPeriod: string
  selectedClients: string[]
  selectedRoles: string[]
  activeTab: string
  searchQuery: string
}

export function VendorMetricsCards({
  selectedPeriod,
  selectedClients,
  selectedRoles,
  activeTab,
  searchQuery
}: VendorMetricsCardsProps) {
  // Mock data for charts
  const skillPerformanceData = [
    { skill: "React", success: 85, demand: 120 },
    { skill: "Python", success: 92, demand: 95 },
    { skill: "Node.js", success: 78, demand: 110 },
    { skill: "Java", success: 68, demand: 85 },
    { skill: "TypeScript", success: 90, demand: 75 },
  ]

  const timelineData = [
    { week: "W1", placements: 12, interviews: 45 },
    { week: "W2", placements: 18, interviews: 52 },
    { week: "W3", placements: 15, interviews: 48 },
    { week: "W4", placements: 22, interviews: 58 },
  ]

  const peerBenchmarkData = [
    { metric: "Pass Rate", you: 43, peer: 35, market: 27 },
    { metric: "Time to Fill", you: 28, peer: 32, market: 35 },
    { metric: "Quality Score", you: 4.2, peer: 3.8, market: 3.5 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Skill Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Skill Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={skillPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="success" fill="#3b82f6" name="Success Rate %" />
              <Bar dataKey="demand" fill="#e5e7eb" name="Market Demand" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Top Performing Skill</span>
              <Badge variant="secondary">Python (92%)</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Needs Improvement</span>
              <Badge variant="outline">Java (68%)</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            Recent Performance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="placements" stroke="#10b981" strokeWidth={2} name="Placements" />
              <Line type="monotone" dataKey="interviews" stroke="#6b7280" strokeWidth={2} name="Interviews" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">+25% this month</span>
            </div>
            <div className="text-sm text-gray-500">
              Conversion Rate: 38%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Peer Benchmarking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Peer Benchmarking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {peerBenchmarkData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.metric}</span>
                  <div className="flex gap-4 text-xs">
                    <span className="text-blue-600">You: {item.you}</span>
                    <span className="text-gray-600">Peer: {item.peer}</span>
                    <span className="text-gray-400">Market: {item.market}</span>
                  </div>
                </div>
                <div className="flex gap-1 h-2 bg-gray-200 rounded">
                  <div 
                    className="bg-blue-500 rounded" 
                    style={{ width: `${(item.you / Math.max(item.you, item.peer, item.market)) * 100}%` }}
                  />
                  <div 
                    className="bg-gray-400 rounded" 
                    style={{ width: `${(item.peer / Math.max(item.you, item.peer, item.market)) * 100}%` }}
                  />
                  <div 
                    className="bg-gray-300 rounded" 
                    style={{ width: `${(item.market / Math.max(item.you, item.peer, item.market)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800 font-medium">
                Outperforming 78% of peers
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-orange-600" />
            Quick Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium">Strong in Backend Roles</p>
                <p className="text-xs text-gray-600">85% success rate in senior backend positions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium">Frontend Opportunity</p>
                <p className="text-xs text-gray-600">Consider focusing on React/TypeScript roles</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium">Client Preference</p>
                <p className="text-xs text-gray-600">Higher success with tech startups vs enterprises</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Recommendations</span>
              <Badge variant="outline" className="text-xs">3 New</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 