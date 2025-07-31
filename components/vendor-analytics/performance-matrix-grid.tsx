import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { allVendors } from "@/lib/dummy-data"

interface PerformanceMatrixGridProps {
  selectedPeriod: string
  selectedVendors: string[]
  selectedRoles: string[]
}

export function PerformanceMatrixGrid({ 
  selectedPeriod, 
  selectedVendors, 
  selectedRoles 
}: PerformanceMatrixGridProps) {
  const getVendorData = () => {
    let vendors = allVendors.filter(v => v.status === 'Active')
    
    if (!selectedVendors.includes("All Vendors")) {
      vendors = vendors.filter(v => selectedVendors.includes(v.name))
    }
    
    return vendors.slice(0, 12) // Show top 12 for the grid
  }

  const getPerformanceScore = (vendor: any) => {
    const passRateScore = vendor.passRate / 100 * 30
    const efficiencyScore = (1 / vendor.interviewsPerPlacement) * 100 * 25
    const timeScore = (10 - Math.min(vendor.timeInProcess, 10)) / 10 * 20
    const integrityScore = (100 - vendor.integrityFlag) / 100 * 15
    const noShowScore = (100 - vendor.noShows) / 100 * 10
    
    return Math.round(passRateScore + efficiencyScore + timeScore + integrityScore + noShowScore)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50"
    if (score >= 60) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getTrendIcon = (vendor: any) => {
    const hasUpwardTrend = vendor.passRate > 60
    if (hasUpwardTrend) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (vendor.passRate < 50) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const vendorData = getVendorData()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Performance Matrix
          <Badge variant="outline" className="text-xs">
            {vendorData.length} Vendors
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vendorData.map(vendor => {
            const score = getPerformanceScore(vendor)
            const scoreColor = getScoreColor(score)
            
            return (
              <div key={vendor.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">
                      {vendor.name}
                    </h4>
                    <div className="flex items-center gap-1 mt-1">
                      {getTrendIcon(vendor)}
                      <span className="text-xs text-gray-500">
                        {vendor.volume} interviews
                      </span>
                    </div>
                  </div>
                  <Badge className={`text-xs font-bold ${scoreColor}`}>
                    {score}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Pass Rate</span>
                    <span className="font-semibold">{vendor.passRate}%</span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Placements</span>
                    <span className="font-semibold">{vendor.placements}</span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Avg Time</span>
                    <span className="font-semibold">{vendor.timeInProcess}d</span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Efficiency</span>
                    <span className="font-semibold">
                      {vendor.interviewsPerPlacement.toFixed(1)}:1
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">No-Shows</span>
                    <span className={`font-semibold ${vendor.noShows > 15 ? 'text-red-600' : vendor.noShows > 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {vendor.noShows}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Integrity</span>
                    <span className={`font-semibold ${vendor.integrityFlag > 5 ? 'text-red-600' : vendor.integrityFlag > 2 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {vendor.integrityFlag}%
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        score >= 80 ? 'bg-green-500' : 
                        score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    Performance Score
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}