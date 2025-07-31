import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { MapPin, Users, Target } from "lucide-react"
import { roles, allVendors } from "@/lib/dummy-data"

interface RolePlacementsProps {
  selectedRoles: string[]
  selectedPeriod: string
}

export function RolePlacements({ selectedRoles, selectedPeriod }: RolePlacementsProps) {
  const getRoleData = () => {
    let filteredRoles = roles
    
    if (!selectedRoles.includes("All Roles")) {
      filteredRoles = roles.filter(role => selectedRoles.includes(role.name))
    }
    
    return filteredRoles.map(role => {
      const activeVendors = role.vendors.filter(v => v.status === 'Active')
      const totalPlacements = activeVendors.reduce((sum, vendor) => sum + vendor.placements, 0)
      const totalVolume = activeVendors.reduce((sum, vendor) => sum + vendor.volume, 0)
      const avgPassRate = activeVendors.length > 0 
        ? Math.round(activeVendors.reduce((sum, vendor) => sum + vendor.passRate, 0) / activeVendors.length)
        : 0
      
      return {
        ...role,
        totalPlacements,
        totalVolume,
        avgPassRate,
        vendorCount: activeVendors.length,
        efficiency: totalVolume > 0 ? (totalVolume / totalPlacements).toFixed(1) : 0
      }
    })
  }

  const getRegionData = () => {
    const regionMap = new Map()
    
    roles.forEach(role => {
      const activeVendors = role.vendors.filter(v => v.status === 'Active')
      const placements = activeVendors.reduce((sum, vendor) => sum + vendor.placements, 0)
      const volume = activeVendors.reduce((sum, vendor) => sum + vendor.volume, 0)
      
      if (regionMap.has(role.location)) {
        const existing = regionMap.get(role.location)
        regionMap.set(role.location, {
          ...existing,
          placements: existing.placements + placements,
          volume: existing.volume + volume,
          roles: existing.roles + 1
        })
      } else {
        regionMap.set(role.location, {
          region: role.location,
          placements,
          volume,
          roles: 1
        })
      }
    })
    
    return Array.from(regionMap.values()).sort((a, b) => b.placements - a.placements)
  }

  const roleData = getRoleData().sort((a, b) => b.totalPlacements - a.totalPlacements)
  const regionData = getRegionData()
  
  const COLORS = ['#5751F9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316']

  const pieData = roleData.slice(0, 6).map((role, index) => ({
    name: role.name.length > 20 ? role.name.substring(0, 20) + "..." : role.name,
    value: role.totalPlacements,
    color: COLORS[index % COLORS.length]
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-gray-600">Placements: <span className="font-semibold">{data.value}</span></p>
        </div>
      )
    }
    return null
  }

  const BarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <div className="mt-2 space-y-1 text-sm">
            <p className="text-gray-600">Placements: <span className="font-semibold">{data.placements}</span></p>
            <p className="text-gray-600">Volume: <span className="font-semibold">{data.volume}</span></p>
            <p className="text-gray-600">Roles: <span className="font-semibold">{data.roles}</span></p>
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
          Role & Regional Analysis
          <Badge variant="outline" className="text-xs">
            {roleData.length} roles
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Role Placements Pie Chart */}
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-4">Placements by Role</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600 truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Analysis */}
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-4">Regional Distribution</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={regionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="region" 
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<BarTooltip />} />
                <Bar dataKey="placements" fill="#5751F9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Role Performance Table */}
        <div className="mt-6">
          <h4 className="font-semibold text-sm text-gray-900 mb-4">Role Performance Summary</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-900">Role</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Location</th>
                  <th className="text-right p-3 font-semibold text-gray-900">Vendors</th>
                  <th className="text-right p-3 font-semibold text-gray-900">Placements</th>
                  <th className="text-right p-3 font-semibold text-gray-900">Volume</th>
                  <th className="text-right p-3 font-semibold text-gray-900">Avg Pass Rate</th>
                  <th className="text-right p-3 font-semibold text-gray-900">Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {roleData.slice(0, 8).map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{role.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">{role.location}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">{role.vendorCount}</td>
                    <td className="p-3 text-right font-semibold">{role.totalPlacements}</td>
                    <td className="p-3 text-right text-gray-600">{role.totalVolume}</td>
                    <td className="p-3 text-right">
                      <Badge 
                        variant={role.avgPassRate > 60 ? "default" : role.avgPassRate > 50 ? "secondary" : "destructive"}
                        className="text-xs"
                      >
                        {role.avgPassRate}%
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Target className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">{role.efficiency}:1</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}