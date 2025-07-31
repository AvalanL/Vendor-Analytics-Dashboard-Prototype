import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target, DollarSign, Trophy } from "lucide-react"
import { allVendors, overallPassRate, totalPlacements } from "@/lib/dummy-data"

interface MarketBenchmarkCardProps {
  title: string
  subtitle: string
  selectedPeriod: string
}

export function MarketBenchmarkCard({ title, subtitle, selectedPeriod }: MarketBenchmarkCardProps) {
  const activeVendors = allVendors.filter(v => v.status === 'Active')
  
  const getIndustryBenchmarkData = () => {
    const industryPassRate = 52 // Industry average
    const industryPlacementRate = 12 // Industry average placements per 100 interviews
    const industryTimeInProcess = 9 // Industry average days
    
    return {
      passRate: { current: overallPassRate, benchmark: industryPassRate, label: "Pass Rate" },
      placementRate: { 
        current: Math.round((totalPlacements / activeVendors.reduce((sum, v) => sum + v.volume, 0)) * 100), 
        benchmark: industryPlacementRate, 
        label: "Placement Rate" 
      },
      timeInProcess: { 
        current: Math.round(activeVendors.reduce((sum, v) => sum + v.timeInProcess, 0) / activeVendors.length), 
        benchmark: industryTimeInProcess, 
        label: "Avg Time in Process" 
      }
    }
  }

  const getTopPerformerData = () => {
    const topByPassRate = [...activeVendors].sort((a, b) => b.passRate - a.passRate)[0]
    const topByPlacements = [...activeVendors].sort((a, b) => b.placements - a.placements)[0]
    const topByEfficiency = [...activeVendors].sort((a, b) => a.interviewsPerPlacement - b.interviewsPerPlacement)[0]
    
    return {
      passRate: { name: topByPassRate.name, value: topByPassRate.passRate },
      placements: { name: topByPlacements.name, value: topByPlacements.placements },
      efficiency: { name: topByEfficiency.name, value: topByEfficiency.interviewsPerPlacement }
    }
  }

  const getCostEfficiencyData = () => {
    const avgInterviewsPerPlacement = activeVendors.reduce((sum, v) => sum + v.interviewsPerPlacement, 0) / activeVendors.length
    const estimatedCostPerInterview = 150 // USD
    const estimatedCostPerPlacement = avgInterviewsPerPlacement * estimatedCostPerInterview
    
    const topEfficient = [...activeVendors].sort((a, b) => a.interviewsPerPlacement - b.interviewsPerPlacement).slice(0, 3)
    const avgEfficiency = topEfficient.reduce((sum, v) => sum + v.interviewsPerPlacement, 0) / topEfficient.length
    
    return {
      avgCostPerPlacement: Math.round(estimatedCostPerPlacement),
      topPerformers: topEfficient,
      avgEfficiency: avgEfficiency.toFixed(1),
      potentialSavings: Math.round((avgInterviewsPerPlacement - avgEfficiency) * estimatedCostPerInterview)
    }
  }

  const renderIndustryBenchmark = () => {
    const data = getIndustryBenchmarkData()
    
    return (
      <div className="space-y-4">
        {Object.entries(data).map(([key, metric]) => {
          const isAboveBenchmark = metric.current > metric.benchmark
          const difference = Math.abs(metric.current - metric.benchmark)
          const percentage = ((metric.current - metric.benchmark) / metric.benchmark * 100).toFixed(1)
          
          return (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-semibold text-sm">{metric.label}</div>
                <div className="text-xs text-gray-600">
                  Your: {metric.current}{key === 'timeInProcess' ? 'd' : '%'} | 
                  Industry: {metric.benchmark}{key === 'timeInProcess' ? 'd' : '%'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isAboveBenchmark && key !== 'timeInProcess' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : isAboveBenchmark && key === 'timeInProcess' ? (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                ) : !isAboveBenchmark && key === 'timeInProcess' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <Badge 
                  variant={
                    (isAboveBenchmark && key !== 'timeInProcess') || 
                    (!isAboveBenchmark && key === 'timeInProcess') ? 
                    "default" : "destructive"
                  }
                  className="text-xs"
                >
                  {key === 'timeInProcess' && isAboveBenchmark ? '-' : '+'}{percentage}%
                </Badge>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderTopPerformerAnalysis = () => {
    const data = getTopPerformerData()
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div>
            <div className="font-semibold text-sm">Highest Pass Rate</div>
            <div className="text-xs text-gray-600">{data.passRate.name}</div>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-green-600" />
            <Badge className="bg-green-100 text-green-800">{data.passRate.value}%</Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div>
            <div className="font-semibold text-sm">Most Placements</div>
            <div className="text-xs text-gray-600">{data.placements.name}</div>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-600" />
            <Badge className="bg-blue-100 text-blue-800">{data.placements.value}</Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
          <div>
            <div className="font-semibold text-sm">Most Efficient</div>
            <div className="text-xs text-gray-600">{data.efficiency.name}</div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <Badge className="bg-purple-100 text-purple-800">{data.efficiency.value.toFixed(1)}:1</Badge>
          </div>
        </div>
      </div>
    )
  }

  const renderCostEfficiency = () => {
    const data = getCostEfficiencyData()
    
    return (
      <div className="space-y-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">${data.avgCostPerPlacement.toLocaleString()}</div>
          <div className="text-xs text-gray-600">Average Cost per Placement</div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-700">Top Efficient Vendors:</div>
          {data.topPerformers.map((vendor, index) => (
            <div key={vendor.id} className="flex items-center justify-between text-xs">
              <span className="text-gray-600">
                #{index + 1} {vendor.name}
              </span>
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-green-600" />
                <span className="font-semibold">
                  ${Math.round(vendor.interviewsPerPlacement * 150).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-sm font-semibold text-green-800">Potential Savings</div>
          <div className="text-xs text-green-600">
            ${data.potentialSavings.toLocaleString()} per placement by optimizing to top performer efficiency
          </div>
        </div>
      </div>
    )
  }

  const getContent = () => {
    if (title.includes("Industry")) return renderIndustryBenchmark()
    if (title.includes("Top Performer")) return renderTopPerformerAnalysis()
    if (title.includes("Cost")) return renderCostEfficiency()
    return <div>No data available</div>
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </CardHeader>
      <CardContent>
        {getContent()}
      </CardContent>
    </Card>
  )
}