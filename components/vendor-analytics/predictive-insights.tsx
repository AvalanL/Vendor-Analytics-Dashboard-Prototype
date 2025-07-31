import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar } from "recharts"
import { TrendingUp, TrendingDown, AlertTriangle, Brain, Target, Calendar, Zap } from "lucide-react"
import { allVendors } from "@/lib/dummy-data"

interface PredictiveInsightsProps {
  selectedVendors: string[]
  selectedPeriod: string
}

export function PredictiveInsights({ selectedVendors, selectedPeriod }: PredictiveInsightsProps) {
  const getVendorData = () => {
    let vendors = allVendors.filter(v => v.status === 'Active')
    
    if (!selectedVendors.includes("All Vendors")) {
      vendors = vendors.filter(v => selectedVendors.includes(v.name))
    }
    
    return vendors
  }

  const generateForecastData = () => {
    const vendors = getVendorData()
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    // Generate historical data (last 6 months) and forecast (next 6 months)
    const forecastData = []
    
    for (let i = -6; i <= 6; i++) {
      const date = new Date(currentYear, currentMonth + i, 1)
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      const isHistorical = i <= 0
      const isForecast = i > 0
      
      // Calculate metrics with trend simulation
      const trendFactor = isHistorical ? (6 + i) / 6 : 1 + (i * 0.05) // Growth trend for forecast
      const seasonality = 1 + Math.sin((date.getMonth() / 12) * 2 * Math.PI) * 0.1 // Seasonal variation
      const randomness = isHistorical ? 0.9 + Math.random() * 0.2 : 1 // Less randomness in forecast
      
      const totalVolume = Math.round(vendors.reduce((sum, v) => sum + v.volume, 0) * trendFactor * seasonality * randomness / 4)
      const totalPlacements = Math.round(vendors.reduce((sum, v) => sum + v.placements, 0) * trendFactor * seasonality * randomness / 4)
      const avgPassRate = Math.round(vendors.reduce((sum, v) => sum + v.passRate, 0) / vendors.length * (isHistorical ? randomness : 1 + i * 0.01))
      const avgTimeInProcess = Math.round(vendors.reduce((sum, v) => sum + v.timeInProcess, 0) / vendors.length * (isHistorical ? randomness : Math.max(0.9, 1 - i * 0.02)))
      
      forecastData.push({
        month: monthName,
        volume: totalVolume,
        placements: totalPlacements,
        passRate: Math.min(100, Math.max(0, avgPassRate)),
        timeInProcess: Math.max(1, avgTimeInProcess),
        isHistorical,
        isForecast,
        efficiency: totalPlacements > 0 ? (totalVolume / totalPlacements).toFixed(1) : 0,
        confidence: isForecast ? Math.max(60, 90 - i * 5) : 100
      })
    }
    
    return forecastData
  }

  const getInsightRecommendations = () => {
    const vendors = getVendorData()
    
    const insights = []
    
    // Volume trend analysis
    const highVolumeVendors = vendors.filter(v => v.volume > 250)
    const lowPassRateVendors = vendors.filter(v => v.passRate < 50)
    const inefficientVendors = vendors.filter(v => v.interviewsPerPlacement > 12)
    const slowVendors = vendors.filter(v => v.timeInProcess > 10)
    
    if (lowPassRateVendors.length > 0) {
      insights.push({
        type: "alert",
        title: "Low Pass Rate Alert",
        description: `${lowPassRateVendors.length} vendors have pass rates below 50%`,
        impact: "High",
        recommendation: "Review screening criteria and provide vendor training",
        icon: AlertTriangle,
        color: "red",
        vendors: lowPassRateVendors.slice(0, 3).map(v => v.name)
      })
    }
    
    if (inefficientVendors.length > 0) {
      insights.push({
        type: "optimization",
        title: "Efficiency Opportunity",
        description: `${inefficientVendors.length} vendors require >12 interviews per placement`,
        impact: "Medium",
        recommendation: "Implement pre-screening improvements and candidate quality filters",
        icon: Target,
        color: "orange",
        vendors: inefficientVendors.slice(0, 3).map(v => v.name)
      })
    }
    
    if (slowVendors.length > 0) {
      insights.push({
        type: "process",
        title: "Timeline Improvement",
        description: `${slowVendors.length} vendors exceed 10-day processing time`,
        impact: "Medium",
        recommendation: "Streamline process stages and reduce decision bottlenecks",
        icon: Calendar,
        color: "blue",
        vendors: slowVendors.slice(0, 3).map(v => v.name)
      })
    }
    
    const topPerformers = vendors
      .filter(v => v.passRate > 65 && v.interviewsPerPlacement < 8)
      .slice(0, 3)
    
    if (topPerformers.length > 0) {
      insights.push({
        type: "success",
        title: "Top Performers",
        description: `${topPerformers.length} vendors show excellent efficiency and quality`,
        impact: "Positive",
        recommendation: "Scale up partnership and replicate best practices",
        icon: TrendingUp,
        color: "green",
        vendors: topPerformers.map(v => v.name)
      })
    }
    
    return insights
  }

  const getCapacityPrediction = () => {
    const vendors = getVendorData()
    const currentCapacity = vendors.reduce((sum, v) => sum + v.placements, 0) * 4 // Quarterly capacity
    const projectedGrowth = 15 // 15% growth assumed
    
    return {
      current: currentCapacity,
      projected: Math.round(currentCapacity * (1 + projectedGrowth / 100)),
      gap: Math.round(currentCapacity * (projectedGrowth / 100)),
      vendorsNeeded: Math.ceil((currentCapacity * (projectedGrowth / 100)) / 100), // Assuming 100 placements per new vendor
      confidence: 85
    }
  }

  const forecastData = generateForecastData()
  const insights = getInsightRecommendations()
  const capacity = getCapacityPrediction()

  const getIconColor = (color: string) => {
    switch (color) {
      case "red": return "text-red-600"
      case "orange": return "text-orange-600"
      case "blue": return "text-blue-600"
      case "green": return "text-green-600"
      default: return "text-gray-600"
    }
  }

  const getBgColor = (color: string) => {
    switch (color) {
      case "red": return "bg-red-50 border-red-200"
      case "orange": return "bg-orange-50 border-orange-200"
      case "blue": return "bg-blue-50 border-blue-200"
      case "green": return "bg-green-50 border-green-200"
      default: return "bg-gray-50 border-gray-200"
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <div className="mt-2 space-y-1 text-sm">
            <p className="text-gray-600">Volume: <span className="font-semibold">{data.volume}</span></p>
            <p className="text-gray-600">Placements: <span className="font-semibold">{data.placements}</span></p>
            <p className="text-gray-600">Pass Rate: <span className="font-semibold">{data.passRate}%</span></p>
            {data.isForecast && (
              <p className="text-blue-600">Confidence: <span className="font-semibold">{data.confidence}%</span></p>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Predictive Analytics & Insights
          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
            AI-Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Forecast Chart */}
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-4">6-Month Performance Forecast</h4>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={forecastData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Volume trend line */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="volume"
                  stroke="#5751F9"
                  strokeWidth={2}
                  dot={{ fill: "#5751F9", r: 4 }}
                />
                
                <Bar yAxisId="right" dataKey="placements" fill="#10B981" opacity={0.7} />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span>Volume Trend</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                <span>Placements</span>
              </div>
              <div className="text-blue-600 font-medium">
                Forecast: Next 6 months with {forecastData.find(d => d.isForecast)?.confidence || 85}% confidence
              </div>
            </div>
          </div>

          {/* Capacity Planning */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-800">Current Capacity</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{capacity.current.toLocaleString()}</div>
              <div className="text-xs text-blue-600">Quarterly placements</div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-800">Projected Need</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{capacity.projected.toLocaleString()}</div>
              <div className="text-xs text-green-600">+{capacity.gap} additional</div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-purple-800">Action Required</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{capacity.vendorsNeeded}</div>
              <div className="text-xs text-purple-600">New vendor partnerships</div>
            </div>
          </div>

          {/* AI Insights & Recommendations */}
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-4">AI-Generated Insights & Recommendations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight, index) => {
                const IconComponent = insight.icon
                return (
                  <div key={index} className={`p-4 border rounded-lg ${getBgColor(insight.color)}`}>
                    <div className="flex items-start gap-3">
                      <IconComponent className={`h-5 w-5 mt-0.5 ${getIconColor(insight.color)}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-semibold text-sm">{insight.title}</h5>
                          <Badge 
                            variant={insight.impact === "High" ? "destructive" : insight.impact === "Positive" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {insight.impact}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                        <p className="text-xs text-gray-600 mb-3">{insight.recommendation}</p>
                        {insight.vendors.length > 0 && (
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">Affected vendors: </span>
                            {insight.vendors.join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Items */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm text-gray-900 mb-3">Recommended Actions</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Schedule vendor performance reviews for underperforming partners</span>
                <Button variant="outline" size="sm" className="text-xs">
                  Schedule
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Implement capacity planning for Q2 growth projection</span>
                <Button variant="outline" size="sm" className="text-xs">
                  Plan
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Analyze top performer strategies for replication</span>
                <Button variant="outline" size="sm" className="text-xs">
                  Analyze
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}