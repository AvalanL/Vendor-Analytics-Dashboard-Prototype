import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line } from "recharts"
import { Clock, Calendar, Target, TrendingUp, AlertCircle } from "lucide-react"
import { allVendors } from "@/lib/dummy-data"

interface DetailedTimelineAnalysisProps {
  selectedVendors: string[]
  selectedPeriod: string
}

export function DetailedTimelineAnalysis({ selectedVendors, selectedPeriod }: DetailedTimelineAnalysisProps) {
  const getVendorData = () => {
    let vendors = allVendors.filter(v => v.status === 'Active')
    
    if (!selectedVendors.includes("All Vendors")) {
      vendors = vendors.filter(v => selectedVendors.includes(v.name))
    }
    
    return vendors
  }

  const getTimelineBreakdown = () => {
    const vendors = getVendorData()
    
    return vendors.slice(0, 8).map(vendor => {
      const stages = [
        { name: "Screening", days: Math.max(1, Math.round(vendor.timeInProcess * 0.15)), target: 2 },
        { name: "Interview", days: Math.max(1, Math.round(vendor.timeInProcess * 0.25)), target: 3 },
        { name: "Review", days: Math.max(1, Math.round(vendor.timeInProcess * 0.20)), target: 2 },
        { name: "Onsite", days: Math.max(1, Math.round(vendor.timeInProcess * 0.30)), target: 5 },
        { name: "Decision", days: Math.max(1, Math.round(vendor.timeInProcess * 0.10)), target: 2 }
      ]
      
      const totalActual = stages.reduce((sum, stage) => sum + stage.days, 0)
      const totalTarget = stages.reduce((sum, stage) => sum + stage.target, 0)
      
      return {
        vendor: vendor.name.length > 12 ? vendor.name.substring(0, 12) + "..." : vendor.name,
        fullName: vendor.name,
        stages,
        totalActual,
        totalTarget,
        efficiency: ((totalTarget / totalActual) * 100).toFixed(1),
        passRate: vendor.passRate,
        placements: vendor.placements
      }
    })
  }

  const getTimeDistribution = () => {
    const vendors = getVendorData()
    
    const timeRanges = [
      { range: "1-3 days", min: 1, max: 3, count: 0, vendors: [] },
      { range: "4-7 days", min: 4, max: 7, count: 0, vendors: [] },
      { range: "8-14 days", min: 8, max: 14, count: 0, vendors: [] },
      { range: "15-21 days", min: 15, max: 21, count: 0, vendors: [] },
      { range: "22+ days", min: 22, max: 999, count: 0, vendors: [] }
    ]
    
    vendors.forEach(vendor => {
      const range = timeRanges.find(r => vendor.timeInProcess >= r.min && vendor.timeInProcess <= r.max)
      if (range) {
        range.count++
        range.vendors.push(vendor.name)
      }
    })
    
    return timeRanges.map(range => ({
      ...range,
      percentage: vendors.length > 0 ? Math.round((range.count / vendors.length) * 100) : 0
    }))
  }

  const getSLAPerformance = () => {
    const vendors = getVendorData()
    const targetSLA = 14 // days
    
    const slaMetrics = {
      onTime: vendors.filter(v => v.timeInProcess <= targetSLA).length,
      delayed: vendors.filter(v => v.timeInProcess > targetSLA && v.timeInProcess <= targetSLA * 1.5).length,
      critical: vendors.filter(v => v.timeInProcess > targetSLA * 1.5).length,
      total: vendors.length
    }
    
    return {
      ...slaMetrics,
      onTimePercentage: vendors.length > 0 ? Math.round((slaMetrics.onTime / vendors.length) * 100) : 0,
      delayedPercentage: vendors.length > 0 ? Math.round((slaMetrics.delayed / vendors.length) * 100) : 0,
      criticalPercentage: vendors.length > 0 ? Math.round((slaMetrics.critical / vendors.length) * 100) : 0
    }
  }

  const timelineData = getTimelineBreakdown()
  const distributionData = getTimeDistribution()
  const slaData = getSLAPerformance()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.fullName}</p>
          <div className="mt-2 space-y-1 text-sm">
            <p className="text-gray-600">Total Time: <span className="font-semibold">{data.totalActual} days</span></p>
            <p className="text-gray-600">Target Time: <span className="font-semibold">{data.totalTarget} days</span></p>
            <p className="text-gray-600">Efficiency: <span className="font-semibold">{data.efficiency}%</span></p>
            <p className="text-gray-600">Pass Rate: <span className="font-semibold">{data.passRate}%</span></p>
          </div>
        </div>
      )
    }
    return null
  }

  const DistributionTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <div className="mt-2 space-y-1 text-sm">
            <p className="text-gray-600">Vendors: <span className="font-semibold">{data.count}</span></p>
            <p className="text-gray-600">Percentage: <span className="font-semibold">{data.percentage}%</span></p>
            {data.vendors.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Vendors:</p>
                <p className="text-xs text-gray-700">{data.vendors.slice(0, 3).join(", ")}</p>
                {data.vendors.length > 3 && <p className="text-xs text-gray-500">+{data.vendors.length - 3} more</p>}
              </div>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Timeline Analysis
          <Badge variant="outline" className="text-xs">
            {timelineData.length} vendors
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* SLA Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-800">On Time</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{slaData.onTimePercentage}%</div>
              <div className="text-xs text-green-600">{slaData.onTime} vendors ≤ 14 days</div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Delayed</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{slaData.delayedPercentage}%</div>
              <div className="text-xs text-yellow-600">{slaData.delayed} vendors 15-21 days</div>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="font-semibold text-red-800">Critical</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{slaData.criticalPercentage}%</div>
              <div className="text-xs text-red-600">{slaData.critical} vendors > 21 days</div>
            </div>
          </div>

          {/* Timeline Comparison */}
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-4">Vendor Timeline Comparison</h4>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="vendor" 
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="totalTarget" fill="#E5E7EB" name="Target" opacity={0.7} />
                <Bar dataKey="totalActual" fill="#5751F9" name="Actual" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Time Distribution */}
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-4">Time Distribution Analysis</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={distributionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<DistributionTooltip />} />
                <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Timeline Breakdown */}
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-4">Stage-by-Stage Analysis</h4>
            <div className="space-y-4">
              {timelineData.slice(0, 5).map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h5 className="font-semibold text-sm">{item.fullName}</h5>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>Total: {item.totalActual} days</span>
                        <span>Target: {item.totalTarget} days</span>
                        <Badge 
                          variant={parseFloat(item.efficiency) > 100 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {item.efficiency}% efficiency
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{item.passRate}%</div>
                      <div className="text-xs text-gray-600">pass rate</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {item.stages.map((stage, stageIndex) => {
                      const isOverTarget = stage.days > stage.target
                      const progress = Math.min((stage.days / Math.max(stage.target, stage.days)) * 100, 100)
                      
                      return (
                        <div key={stageIndex} className="text-center">
                          <div className="text-xs font-medium text-gray-700 mb-1">{stage.name}</div>
                          <div className="text-xs text-gray-600 mb-2">
                            {stage.days}d / {stage.target}d
                          </div>
                          <Progress 
                            value={progress}
                            className={`h-2 ${isOverTarget ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'}`}
                          />
                          {isOverTarget && (
                            <div className="text-xs text-red-600 mt-1">
                              +{stage.days - stage.target}d
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}