import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Clock, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { allVendors } from "@/lib/dummy-data"

interface EfficiencyAnalyticsProps {
  selectedVendors: string[]
  selectedPeriod: string
}

export function EfficiencyAnalytics({ selectedVendors, selectedPeriod }: EfficiencyAnalyticsProps) {
  const getVendorData = () => {
    let vendors = allVendors.filter(v => v.status === 'Active')
    
    if (!selectedVendors.includes("All Vendors")) {
      vendors = vendors.filter(v => selectedVendors.includes(v.name))
    }
    
    return vendors
  }

  const getEfficiencyTrendData = () => {
    const vendors = getVendorData().slice(0, 5) // Top 5 for readability
    
    if (vendors.length === 0 || !vendors[0].timeSeriesData) {
      return []
    }
    
    const timeSeriesLength = vendors[0].timeSeriesData.length
    
    return Array.from({ length: timeSeriesLength }, (_, index) => {
      const dataPoint: any = {
        period: vendors[0].timeSeriesData![index].periodLabel,
        date: vendors[0].timeSeriesData![index].date
      }
      
      vendors.forEach(vendor => {
        if (vendor.timeSeriesData && vendor.timeSeriesData[index]) {
          const efficiency = vendor.timeSeriesData[index].interviewsPerPlacement
          dataPoint[vendor.name] = efficiency === Infinity ? 0 : efficiency
        }
      })
      
      return dataPoint
    })
  }

  const getProcessStageData = () => {
    const vendors = getVendorData()
    
    const stages = [
      { stage: "Screening", avgDays: 2, efficiency: 95 },
      { stage: "Karat Interview", avgDays: 1, efficiency: 75 },
      { stage: "Technical Review", avgDays: 3, efficiency: 85 },
      { stage: "Onsite", avgDays: 7, efficiency: 55 },
      { stage: "Decision", avgDays: 4, efficiency: 80 },
      { stage: "Offer", avgDays: 2, efficiency: 90 }
    ]
    
    return stages.map(stage => ({
      ...stage,
      totalDays: stage.avgDays,
      bottleneck: stage.efficiency < 70,
      improvement: Math.round((100 - stage.efficiency) * 0.3)
    }))
  }

  const getEfficiencyMetrics = () => {
    const vendors = getVendorData()
    
    if (vendors.length === 0) return null
    
    const avgTimeInProcess = vendors.reduce((sum, v) => sum + v.timeInProcess, 0) / vendors.length
    const avgInterviewsPerPlacement = vendors.reduce((sum, v) => sum + v.interviewsPerPlacement, 0) / vendors.length
    const avgNoShows = vendors.reduce((sum, v) => sum + v.noShows, 0) / vendors.length
    const avgIntegrityFlag = vendors.reduce((sum, v) => sum + v.integrityFlag, 0) / vendors.length
    
    const bestEfficiency = Math.min(...vendors.map(v => v.interviewsPerPlacement))
    const worstEfficiency = Math.max(...vendors.map(v => v.interviewsPerPlacement))
    
    const improvementPotential = ((avgInterviewsPerPlacement - bestEfficiency) / avgInterviewsPerPlacement * 100)
    
    return {
      avgTimeInProcess: avgTimeInProcess.toFixed(1),
      avgInterviewsPerPlacement: avgInterviewsPerPlacement.toFixed(1),
      avgNoShows: avgNoShows.toFixed(1),
      avgIntegrityFlag: avgIntegrityFlag.toFixed(1),
      bestEfficiency: bestEfficiency.toFixed(1),
      worstEfficiency: worstEfficiency.toFixed(1),
      improvementPotential: improvementPotential.toFixed(1),
      estimatedSavings: Math.round((avgInterviewsPerPlacement - bestEfficiency) * 150 * vendors.reduce((sum, v) => sum + v.placements, 0))
    }
  }

  const vendors = getVendorData()
  const trendData = getEfficiencyTrendData()
  const processData = getProcessStageData()
  const metrics = getEfficiencyMetrics()
  
  const COLORS = ['#5751F9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.dataKey}: <span className="font-semibold">{entry.value.toFixed(1)}:1</span>
              </p>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Efficiency Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No data available for selected filters.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Efficiency Analytics
          <Badge variant="outline" className="text-xs">
            {vendors.length} vendors
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{metrics.avgInterviewsPerPlacement}</div>
              <div className="text-xs text-blue-600">Avg Interviews:Placement</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{metrics.avgTimeInProcess}d</div>
              <div className="text-xs text-green-600">Avg Time in Process</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{metrics.improvementPotential}%</div>
              <div className="text-xs text-purple-600">Improvement Potential</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">${metrics.estimatedSavings.toLocaleString()}</div>
              <div className="text-xs text-orange-600">Potential Savings</div>
            </div>
          </div>

          {/* Efficiency Trend */}
          {trendData.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-4">Interview Efficiency Trend</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="period" 
                    tick={{ fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  {vendors.slice(0, 5).map((vendor, index) => (
                    <Line
                      key={vendor.id}
                      type="monotone"
                      dataKey={vendor.name}
                      stroke={COLORS[index % COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Process Stage Analysis */}
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-4">Process Stage Efficiency</h4>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={processData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'efficiency' ? `${value}%` : `${value} days`,
                    name === 'efficiency' ? 'Efficiency' : 'Avg Days'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="efficiency"
                  stackId="1"
                  stroke="#5751F9"
                  fill="#5751F9"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Process Bottlenecks */}
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-4">Process Bottleneck Analysis</h4>
            <div className="space-y-3">
              {processData.map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {stage.bottleneck ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    <div>
                      <div className="font-semibold text-sm">{stage.stage}</div>
                      <div className="text-xs text-gray-600">
                        {stage.avgDays} days • {stage.efficiency}% efficiency
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-semibold">{stage.totalDays}d</span>
                    {stage.bottleneck && (
                      <Badge variant="destructive" className="text-xs">
                        -{stage.improvement}% potential
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Efficiency Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-800">Best Efficiency</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{metrics.bestEfficiency}:1</div>
              <div className="text-xs text-green-600">Interviews per placement</div>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="font-semibold text-red-800">Needs Improvement</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{metrics.worstEfficiency}:1</div>
              <div className="text-xs text-red-600">Highest ratio observed</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}