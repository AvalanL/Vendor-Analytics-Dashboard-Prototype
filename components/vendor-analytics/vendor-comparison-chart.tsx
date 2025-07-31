import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from "recharts"
import { useState } from "react"
import { allVendors } from "@/lib/dummy-data"

interface VendorComparisonChartProps {
  title: string
  selectedVendors: string[]
  selectedPeriod: string
}

export function VendorComparisonChart({ 
  title, 
  selectedVendors, 
  selectedPeriod 
}: VendorComparisonChartProps) {
  const [chartType, setChartType] = useState("bar")
  const [metric, setMetric] = useState("passRate")

  const getVendorData = () => {
    let vendors = allVendors.filter(v => v.status === 'Active')
    
    if (!selectedVendors.includes("All Vendors")) {
      vendors = vendors.filter(v => selectedVendors.includes(v.name))
    }
    
    return vendors.slice(0, 8) // Limit for readability
  }

  const getChartData = () => {
    const vendors = getVendorData()
    
    return vendors.map(vendor => ({
      name: vendor.name.length > 12 ? vendor.name.substring(0, 12) + "..." : vendor.name,
      fullName: vendor.name,
      passRate: vendor.passRate,
      placements: vendor.placements,
      volume: vendor.volume,
      timeInProcess: vendor.timeInProcess,
      efficiency: vendor.interviewsPerPlacement,
      noShows: vendor.noShows,
      integrityFlag: vendor.integrityFlag,
      performanceScore: Math.round(
        (vendor.passRate / 100 * 30) +
        (1 / vendor.interviewsPerPlacement * 100 * 25) +
        ((10 - Math.min(vendor.timeInProcess, 10)) / 10 * 20) +
        ((100 - vendor.integrityFlag) / 100 * 15) +
        ((100 - vendor.noShows) / 100 * 10)
      )
    }))
  }

  const getScatterData = () => {
    const vendors = getVendorData()
    
    return vendors.map(vendor => ({
      x: vendor.passRate,
      y: vendor.placements,
      z: vendor.volume,
      name: vendor.name,
      efficiency: vendor.interviewsPerPlacement.toFixed(1)
    }))
  }

  const metrics = [
    { value: "passRate", label: "Pass Rate (%)", color: "#5751F9" },
    { value: "placements", label: "Total Placements", color: "#10B981" },
    { value: "volume", label: "Interview Volume", color: "#F59E0B" },
    { value: "timeInProcess", label: "Time in Process (days)", color: "#EF4444" },
    { value: "efficiency", label: "Interview Efficiency (ratio)", color: "#8B5CF6" },
    { value: "performanceScore", label: "Performance Score", color: "#06B6D4" }
  ]

  const selectedMetricData = metrics.find(m => m.value === metric)
  const data = getChartData()
  const scatterData = getScatterData()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.fullName}</p>
          <div className="mt-2 space-y-1 text-sm">
            <p className="text-gray-600">Pass Rate: <span className="font-semibold">{data.passRate}%</span></p>
            <p className="text-gray-600">Placements: <span className="font-semibold">{data.placements}</span></p>
            <p className="text-gray-600">Volume: <span className="font-semibold">{data.volume}</span></p>
            <p className="text-gray-600">Efficiency: <span className="font-semibold">{data.efficiency.toFixed(1)}:1</span></p>
            <p className="text-gray-600">Score: <span className="font-semibold">{data.performanceScore}</span></p>
          </div>
        </div>
      )
    }
    return null
  }

  const ScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <div className="mt-2 space-y-1 text-sm">
            <p className="text-gray-600">Pass Rate: <span className="font-semibold">{data.x}%</span></p>
            <p className="text-gray-600">Placements: <span className="font-semibold">{data.y}</span></p>
            <p className="text-gray-600">Volume: <span className="font-semibold">{data.z}</span></p>
            <p className="text-gray-600">Efficiency: <span className="font-semibold">{data.efficiency}:1</span></p>
          </div>
        </div>
      )
    }
    return null
  }

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey={metric} 
          fill={selectedMetricData?.color || "#5751F9"}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )

  const renderScatterChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart data={scatterData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          type="number" 
          dataKey="x" 
          name="Pass Rate" 
          unit="%" 
          tick={{ fontSize: 12 }}
          label={{ value: 'Pass Rate (%)', position: 'bottom' }}
        />
        <YAxis 
          type="number" 
          dataKey="y" 
          name="Placements" 
          tick={{ fontSize: 12 }}
          label={{ value: 'Placements', angle: -90, position: 'insideLeft' }}
        />
        <ZAxis type="number" dataKey="z" range={[50, 400]} name="Volume" />
        <Tooltip content={<ScatterTooltip />} />
        <Scatter fill="#5751F9" fillOpacity={0.7} />
      </ScatterChart>
    </ResponsiveContainer>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              {data.length} vendors
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-3 mt-4">
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="scatter">Scatter Plot</SelectItem>
            </SelectContent>
          </Select>
          
          {chartType === "bar" && (
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {metrics.map(m => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {chartType === "bar" ? renderBarChart() : renderScatterChart()}
        
        {chartType === "scatter" && (
          <div className="mt-4 text-sm text-gray-600">
            <p className="font-semibold mb-2">Scatter Plot Legend:</p>
            <ul className="space-y-1">
              <li>• X-axis: Pass Rate (%)</li>
              <li>• Y-axis: Total Placements</li>
              <li>• Bubble size: Interview Volume</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}