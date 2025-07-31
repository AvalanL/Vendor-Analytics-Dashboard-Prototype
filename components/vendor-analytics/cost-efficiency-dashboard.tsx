import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from "recharts"
import { DollarSign, TrendingUp, TrendingDown, MapPin, Award, AlertTriangle } from "lucide-react"
import { allVendors, rateCards, geographicData } from "@/lib/dummy-data"

interface CostEfficiencyDashboardProps {
  selectedPeriod: string
  selectedRegions: string[]
}

export function CostEfficiencyDashboard({ selectedPeriod, selectedRegions }: CostEfficiencyDashboardProps) {
  const getVendorCostData = () => {
    const activeVendors = allVendors.filter(v => v.status === 'Active')
    
    let filteredVendors = activeVendors
    if (!selectedRegions.includes("All Regions")) {
      filteredVendors = activeVendors.filter(v => 
        v.primaryRegions.some(region => selectedRegions.includes(region))
      )
    }
    
    return filteredVendors.map(vendor => {
      const totalCostPerMonth = (vendor.volume * vendor.costPerInterview) + (vendor.placements * vendor.costPerHire)
      const roi = vendor.placements > 0 ? ((vendor.placements * 85000) - totalCostPerMonth) / totalCostPerMonth * 100 : 0 // Assuming $85k average hire value
      const qualityScore = (vendor.passRate + (100 - vendor.noShows) + (100 - vendor.integrityFlag * 10)) / 3
      
      return {
        ...vendor,
        totalCostPerMonth,
        roi,
        qualityScore,
        costEfficiencyRatio: vendor.costPerHire / vendor.placements,
        valueScore: qualityScore * (roi / 100) // Combined quality and ROI score
      }
    }).sort((a, b) => b.valueScore - a.valueScore)
  }

  const getRegionalCostAnalysis = () => {
    const regionMap = new Map()
    
    allVendors.filter(v => v.status === 'Active').forEach(vendor => {
      vendor.primaryRegions.forEach(region => {
        if (!regionMap.has(region)) {
          regionMap.set(region, {
            region,
            vendors: [],
            avgCostPerHire: 0,
            avgCostPerInterview: 0,
            totalPlacements: 0,
            totalVolume: 0,
            marketData: geographicData.find(geo => geo.region === region)
          })
        }
        
        const regionData = regionMap.get(region)
        regionData.vendors.push(vendor)
        regionData.totalPlacements += vendor.placements
        regionData.totalVolume += vendor.volume
      })
    })
    
    const regionArray = Array.from(regionMap.values()).map(region => {
      const vendorCount = region.vendors.length
      region.avgCostPerHire = region.vendors.reduce((sum: number, v: any) => sum + v.costPerHire, 0) / vendorCount
      region.avgCostPerInterview = region.vendors.reduce((sum: number, v: any) => sum + v.costPerInterview, 0) / vendorCount
      region.costEfficiency = region.totalPlacements > 0 ? region.totalVolume / region.totalPlacements : 0
      region.marketValue = region.marketData ? region.marketData.costOfLiving : 100
      
      return region
    })
    
    return regionArray.sort((a, b) => a.avgCostPerHire - b.avgCostPerHire)
  }

  const getRateCardInsights = () => {
    const vendorRateMap = new Map()
    
    rateCards.forEach(rateCard => {
      const vendor = allVendors.find(v => v.id === rateCard.vendorId)
      if (!vendor || vendor.status !== 'Active') return
      
      if (!vendorRateMap.has(vendor.name)) {
        vendorRateMap.set(vendor.name, {
          vendorName: vendor.name,
          tier: vendor.tier,
          rateCards: [],
          avgPlacementFee: 0,
          avgInterviewFee: 0,
          totalVolume: 0
        })
      }
      
      const vendorData = vendorRateMap.get(vendor.name)
      vendorData.rateCards.push(rateCard)
    })
    
    return Array.from(vendorRateMap.values()).map(vendor => {
      const rateCardCount = vendor.rateCards.length
      vendor.avgPlacementFee = vendor.rateCards.reduce((sum: number, rc: any) => sum + rc.placementFee, 0) / rateCardCount
      vendor.avgInterviewFee = vendor.rateCards.reduce((sum: number, rc: any) => sum + rc.interviewFee, 0) / rateCardCount
      vendor.totalVolume = vendor.rateCards.reduce((sum: number, rc: any) => sum + rc.volume, 0)
      
      return vendor
    }).sort((a, b) => a.avgPlacementFee - b.avgPlacementFee)
  }

  const vendorCostData = getVendorCostData()
  const regionalData = getRegionalCostAnalysis()
  const rateCardData = getRateCardInsights()

  // Calculate key metrics
  const totalSpend = vendorCostData.reduce((sum, v) => sum + v.totalCostPerMonth, 0)
  const avgROI = vendorCostData.reduce((sum, v) => sum + v.roi, 0) / vendorCostData.length
  const topPerformers = vendorCostData.slice(0, 3)
  const underperformers = vendorCostData.slice(-3).reverse()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <div className="mt-2 space-y-1 text-sm">
            <p className="text-gray-600">Cost per Hire: <span className="font-semibold">${data.costPerHire.toLocaleString()}</span></p>
            <p className="text-gray-600">ROI: <span className="font-semibold">{data.roi.toFixed(1)}%</span></p>
            <p className="text-gray-600">Quality Score: <span className="font-semibold">{data.qualityScore.toFixed(1)}</span></p>
            <p className="text-gray-600">Monthly Cost: <span className="font-semibold">${data.totalCostPerMonth.toLocaleString()}</span></p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">${totalSpend.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Monthly Spend</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              {avgROI > 0 ? <TrendingUp className="h-8 w-8 text-green-600" /> : <TrendingDown className="h-8 w-8 text-red-600" />}
              <div>
                <div className="text-2xl font-bold text-gray-900">{avgROI.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Average ROI</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{topPerformers.length}</div>
                <div className="text-sm text-gray-600">Top Performers</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{underperformers.length}</div>
                <div className="text-sm text-gray-600">Need Attention</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost vs Quality Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Cost vs Quality Analysis</CardTitle>
          <p className="text-sm text-gray-600">Vendor positioning by cost efficiency and quality scores</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={vendorCostData.slice(0, 12)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                type="number" 
                dataKey="costPerHire" 
                name="Cost per Hire" 
                tick={{ fontSize: 11 }}
                label={{ value: 'Cost per Hire ($)', position: 'bottom' }}
              />
              <YAxis 
                type="number" 
                dataKey="qualityScore" 
                name="Quality Score" 
                tick={{ fontSize: 11 }}
                label={{ value: 'Quality Score', angle: -90, position: 'insideLeft' }}
              />
              <ZAxis type="number" dataKey="placements" range={[50, 400]} name="Placements" />
              <Tooltip content={<CustomTooltip />} />
              <Scatter fill="#5751F9" fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Regional Cost Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Regional Cost Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(value: any, name: string) => [`$${value.toLocaleString()}`, 'Avg Cost per Hire']}
                  labelFormatter={(label) => `Region: ${label}`}
                />
                <Bar dataKey="avgCostPerHire" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top & Bottom Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Top Performers (Value Score)
                </h4>
                {topPerformers.map((vendor, index) => (
                  <div key={vendor.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg mb-2">
                    <div>
                      <div className="font-semibold text-sm">{vendor.name}</div>
                      <div className="text-xs text-gray-600">
                        ROI: {vendor.roi.toFixed(1)}% • Cost: ${vendor.costPerHire.toLocaleString()}
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      #{index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div>
                <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Need Attention
                </h4>
                {underperformers.map((vendor, index) => (
                  <div key={vendor.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg mb-2">
                    <div>
                      <div className="font-semibold text-sm">{vendor.name}</div>
                      <div className="text-xs text-gray-600">
                        ROI: {vendor.roi.toFixed(1)}% • Cost: ${vendor.costPerHire.toLocaleString()}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rate Card Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Card Summary</CardTitle>
          <p className="text-sm text-gray-600">Current vendor pricing across different service tiers</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-semibold">Vendor</th>
                  <th className="text-left p-3 font-semibold">Tier</th>
                  <th className="text-right p-3 font-semibold">Avg Placement Fee</th>
                  <th className="text-right p-3 font-semibold">Avg Interview Fee</th>
                  <th className="text-right p-3 font-semibold">Total Volume</th>
                  <th className="text-center p-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rateCardData.slice(0, 8).map((vendor) => (
                  <tr key={vendor.vendorName} className="hover:bg-gray-50">
                    <td className="p-3 font-medium">{vendor.vendorName}</td>
                    <td className="p-3">
                      <Badge 
                        variant={vendor.tier === "Premium" ? "default" : vendor.tier === "Standard" ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {vendor.tier}
                      </Badge>
                    </td>
                    <td className="p-3 text-right font-semibold">${vendor.avgPlacementFee.toLocaleString()}</td>
                    <td className="p-3 text-right">${vendor.avgInterviewFee}</td>
                    <td className="p-3 text-right">{vendor.totalVolume}</td>
                    <td className="p-3 text-center">
                      <Button variant="ghost" size="sm" className="text-xs">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}