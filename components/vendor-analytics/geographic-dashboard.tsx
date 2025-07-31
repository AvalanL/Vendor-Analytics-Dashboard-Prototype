import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { MapPin, Globe, TrendingUp, Users, DollarSign, Clock, Target } from "lucide-react"
import { allVendors, geographicData, roles } from "@/lib/dummy-data"

interface GeographicDashboardProps {
  selectedPeriod: string
}

export function GeographicDashboard({ selectedPeriod }: GeographicDashboardProps) {
  const getRegionalPerformance = () => {
    const regionMap = new Map()
    
    // Aggregate vendor data by region
    allVendors.filter(v => v.status === 'Active').forEach(vendor => {
      vendor.primaryRegions.forEach(region => {
        if (!regionMap.has(region)) {
          regionMap.set(region, {
            region,
            vendors: [],
            totalPlacements: 0,
            totalVolume: 0,
            totalCost: 0,
            avgPassRate: 0,
            avgTimeInProcess: 0,
            marketData: geographicData.find(geo => geo.region === region)
          })
        }
        
        const regionData = regionMap.get(region)
        regionData.vendors.push(vendor)
        regionData.totalPlacements += vendor.placements
        regionData.totalVolume += vendor.volume
        regionData.totalCost += vendor.costPerHire * vendor.placements
      })
    })
    
    return Array.from(regionMap.values()).map(region => {
      const vendorCount = region.vendors.length
      region.avgPassRate = region.vendors.reduce((sum: number, v: any) => sum + v.passRate, 0) / vendorCount
      region.avgTimeInProcess = region.vendors.reduce((sum: number, v: any) => sum + v.timeInProcess, 0) / vendorCount
      region.costPerHire = region.totalCost / region.totalPlacements
      region.efficiency = region.totalVolume / region.totalPlacements
      region.marketScore = region.marketData ? 
        (region.marketData.talentAvailability === "High" ? 3 : region.marketData.talentAvailability === "Medium" ? 2 : 1) +
        (region.marketData.marketMaturity === "Mature" ? 3 : region.marketData.marketMaturity === "Developing" ? 2 : 1) +
        (region.marketData.competitionLevel === "Low" ? 3 : region.marketData.competitionLevel === "Medium" ? 2 : 1)
        : 5
      
      return region
    }).sort((a, b) => b.totalPlacements - a.totalPlacements)
  }

  const getCityInsights = () => {
    return geographicData.map(city => {
      // Find vendors operating in this region
      const regionalVendors = allVendors.filter(v => 
        v.status === 'Active' && v.primaryRegions.includes(city.region)
      )
      
      const totalPlacements = regionalVendors.reduce((sum, v) => sum + v.placements, 0)
      const avgCostPerHire = regionalVendors.length > 0 
        ? regionalVendors.reduce((sum, v) => sum + v.costPerHire, 0) / regionalVendors.length 
        : 0
      
      // Calculate value score based on cost of living vs average cost
      const valueScore = city.costOfLiving > 0 ? (avgCostPerHire / city.costOfLiving) * 100 : 0
      
      return {
        ...city,
        vendorCount: regionalVendors.length,
        totalPlacements,
        avgCostPerHire,
        valueScore,
        marketAttractiveness: 
          (city.talentAvailability === "High" ? 3 : city.talentAvailability === "Medium" ? 2 : 1) +
          (city.marketMaturity === "Mature" ? 3 : city.marketMaturity === "Developing" ? 2 : 1) +
          (city.competitionLevel === "Low" ? 3 : city.competitionLevel === "Medium" ? 2 : 1) +
          (city.costOfLiving < 80 ? 3 : city.costOfLiving < 120 ? 2 : 1)
      }
    }).sort((a, b) => b.marketAttractiveness - a.marketAttractiveness)
  }

  const getTimezoneDistribution = () => {
    const timezoneMap = new Map()
    
    geographicData.forEach(geo => {
      const vendors = allVendors.filter(v => 
        v.status === 'Active' && v.primaryRegions.includes(geo.region)
      )
      
      if (vendors.length > 0) {
        const placements = vendors.reduce((sum, v) => sum + v.placements, 0)
        
        if (timezoneMap.has(geo.timezone)) {
          timezoneMap.set(geo.timezone, timezoneMap.get(geo.timezone) + placements)
        } else {
          timezoneMap.set(geo.timezone, placements)
        }
      }
    })
    
    return Array.from(timezoneMap.entries()).map(([timezone, placements]) => ({
      timezone,
      placements,
      percentage: 0 // Will calculate after getting total
    })).sort((a, b) => b.placements - a.placements)
  }

  const getRoleGeographyMatrix = () => {
    const matrix: any[] = []
    
    roles.forEach(role => {
      const activeVendors = role.vendors.filter(v => v.status === 'Active')
      const totalPlacements = activeVendors.reduce((sum, v) => sum + v.placements, 0)
      const avgCost = activeVendors.length > 0 
        ? activeVendors.reduce((sum, v) => sum + v.costPerHire, 0) / activeVendors.length 
        : 0
      
      const geoData = geographicData.find(geo => geo.region === role.location || geo.country === role.location)
      
      matrix.push({
        roleName: role.name,
        location: role.location,
        totalPlacements,
        avgCost,
        vendorCount: activeVendors.length,
        costOfLiving: geoData?.costOfLiving || 100,
        talentAvailability: geoData?.talentAvailability || "Medium",
        efficiency: totalPlacements / avgCost * 1000 // Placements per $1000 cost
      })
    })
    
    return matrix.sort((a, b) => b.efficiency - a.efficiency)
  }

  const regionalData = getRegionalPerformance()
  const cityData = getCityInsights()
  const timezoneData = getTimezoneDistribution()
  const roleMatrix = getRoleGeographyMatrix()

  // Calculate timezone percentages
  const totalPlacements = timezoneData.reduce((sum, tz) => sum + tz.placements, 0)
  timezoneData.forEach(tz => {
    tz.percentage = Math.round((tz.placements / totalPlacements) * 100)
  })

  const COLORS = ['#5751F9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

  const RegionalTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <div className="mt-2 space-y-1 text-sm">
            <p className="text-gray-600">Placements: <span className="font-semibold">{data.totalPlacements}</span></p>
            <p className="text-gray-600">Vendors: <span className="font-semibold">{data.vendors.length}</span></p>
            <p className="text-gray-600">Avg Pass Rate: <span className="font-semibold">{data.avgPassRate.toFixed(1)}%</span></p>
            <p className="text-gray-600">Cost per Hire: <span className="font-semibold">${data.costPerHire.toLocaleString()}</span></p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Regional Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Regional Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={regionalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="region" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<RegionalTooltip />} />
              <Bar dataKey="totalPlacements" fill="#5751F9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Regional Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {regionalData.map((region, index) => (
          <Card key={region.region}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{region.region}</h3>
                  <p className="text-sm text-gray-600">{region.vendors.length} vendors</p>
                </div>
                <Badge variant={index < 2 ? "default" : index < 4 ? "secondary" : "outline"}>
                  #{index + 1}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Placements</span>
                  </div>
                  <span className="font-semibold">{region.totalPlacements}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Cost/Hire</span>
                  </div>
                  <span className="font-semibold">${region.costPerHire.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Pass Rate</span>
                  </div>
                  <span className="font-semibold">{region.avgPassRate.toFixed(1)}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Avg Time</span>
                  </div>
                  <span className="font-semibold">{region.avgTimeInProcess.toFixed(1)}d</span>
                </div>
              </div>
              
              {region.marketData && (
                <div className="mt-4 pt-3 border-t space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Talent Availability</span>
                    <Badge 
                      variant={region.marketData.talentAvailability === "High" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {region.marketData.talentAvailability}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Market Maturity</span>
                    <Badge 
                      variant={region.marketData.marketMaturity === "Mature" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {region.marketData.marketMaturity}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timezone Distribution & City Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Timezone Coverage</CardTitle>
            <p className="text-sm text-gray-600">Placement distribution across timezones</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={timezoneData.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="placements"
                >
                  {timezoneData.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [value, 'Placements']}
                  labelFormatter={(label) => `${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {timezoneData.slice(0, 6).map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-600">{item.timezone} ({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Opportunities</CardTitle>
            <p className="text-sm text-gray-600">Cities ranked by market attractiveness</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cityData.slice(0, 8).map((city, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="font-semibold text-sm">{city.city || city.country}</div>
                      <div className="text-xs text-gray-600">
                        CoL: {city.costOfLiving} • Talent: {city.talentAvailability}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">Score: {city.marketAttractiveness}</div>
                    <div className="text-xs text-gray-600">{city.vendorCount} vendors</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role-Geography Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Role-Geography Performance Matrix</CardTitle>
          <p className="text-sm text-gray-600">Cost efficiency across roles and locations</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-semibold">Role</th>
                  <th className="text-left p-3 font-semibold">Location</th>
                  <th className="text-right p-3 font-semibold">Placements</th>
                  <th className="text-right p-3 font-semibold">Avg Cost</th>
                  <th className="text-right p-3 font-semibold">Efficiency</th>
                  <th className="text-center p-3 font-semibold">Talent Pool</th>
                  <th className="text-center p-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {roleMatrix.slice(0, 10).map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.roleName}</td>
                    <td className="p-3">{item.location}</td>
                    <td className="p-3 text-right">{item.totalPlacements}</td>
                    <td className="p-3 text-right">${item.avgCost.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <Badge 
                        variant={item.efficiency > 0.1 ? "default" : item.efficiency > 0.05 ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {item.efficiency.toFixed(3)}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge 
                        variant={item.talentAvailability === "High" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {item.talentAvailability}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Expand
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