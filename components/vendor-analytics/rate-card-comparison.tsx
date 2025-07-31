import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, TrendingUp, TrendingDown, Award, Calendar } from "lucide-react"
import { useState } from "react"
import { rateCards, allVendors } from "@/lib/dummy-data"

interface RateCardComparisonProps {
  selectedRegion?: string
  selectedRole?: string
}

export function RateCardComparison({ selectedRegion, selectedRole }: RateCardComparisonProps) {
  const [sortBy, setSortBy] = useState("placementFee")
  const [filterTier, setFilterTier] = useState("All")
  const [filterRegion, setFilterRegion] = useState(selectedRegion || "All")
  const [filterRole, setFilterRole] = useState(selectedRole || "All")

  const getFilteredRateCards = () => {
    let filtered = rateCards.filter(card => {
      const vendor = allVendors.find(v => v.id === card.vendorId)
      if (!vendor || vendor.status !== 'Active') return false
      
      if (filterTier !== "All" && card.tier !== filterTier) return false
      if (filterRegion !== "All" && card.region !== filterRegion) return false
      if (filterRole !== "All" && !card.roleCategory.toLowerCase().includes(filterRole.toLowerCase())) return false
      
      return true
    })

    // Add vendor information
    filtered = filtered.map(card => {
      const vendor = allVendors.find(v => v.id === card.vendorId)
      return {
        ...card,
        vendorName: vendor?.name || "Unknown",
        vendorTier: vendor?.tier || "Standard",
        vendorPassRate: vendor?.passRate || 0,
        vendorPlacements: vendor?.placements || 0
      }
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "placementFee":
          return a.placementFee - b.placementFee
        case "interviewFee":
          return a.interviewFee - b.interviewFee
        case "vendorName":
          return a.vendorName.localeCompare(b.vendorName)
        case "performance":
          return b.vendorPassRate - a.vendorPassRate
        default:
          return 0
      }
    })

    return filtered
  }

  const getRateCardInsights = () => {
    const filtered = getFilteredRateCards()
    
    if (filtered.length === 0) return null

    const avgPlacementFee = filtered.reduce((sum, card) => sum + card.placementFee, 0) / filtered.length
    const avgInterviewFee = filtered.reduce((sum, card) => sum + card.interviewFee, 0) / filtered.length
    const cheapestCard = filtered.reduce((min, card) => card.placementFee < min.placementFee ? card : min)
    const mostExpensiveCard = filtered.reduce((max, card) => card.placementFee > max.placementFee ? card : max)
    const bestValueCard = filtered.reduce((best, card) => {
      const value = (card.vendorPassRate / card.placementFee) * 10000
      const bestValue = (best.vendorPassRate / best.placementFee) * 10000
      return value > bestValue ? card : best
    })

    return {
      avgPlacementFee,
      avgInterviewFee,
      cheapestCard,
      mostExpensiveCard,
      bestValueCard,
      totalCards: filtered.length,
      savingsPotential: mostExpensiveCard.placementFee - cheapestCard.placementFee
    }
  }

  const filteredCards = getFilteredRateCards()
  const insights = getRateCardInsights()

  const regions = [...new Set(rateCards.map(card => card.region))]
  const roles = [...new Set(rateCards.map(card => card.roleCategory))]
  const tiers = ["All", "Premium", "Standard", "Budget"]

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getDiscountInfo = (card: any) => {
    if (card.discountThreshold && card.discountRate) {
      return `${card.discountRate}% off after ${card.discountThreshold} placements`
    }
    return "No volume discount"
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Premium": return "bg-purple-100 text-purple-800"
      case "Standard": return "bg-blue-100 text-blue-800"
      case "Budget": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Rate Card Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <Select value={filterRegion} onValueChange={setFilterRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Regions</SelectItem>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Roles</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tier</label>
              <Select value={filterTier} onValueChange={setFilterTier}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tiers.map(tier => (
                    <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placementFee">Placement Fee</SelectItem>
                  <SelectItem value="interviewFee">Interview Fee</SelectItem>
                  <SelectItem value="vendorName">Vendor Name</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Insights */}
          {insights && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-900">{formatCurrency(insights.avgPlacementFee)}</div>
                <div className="text-sm text-blue-700">Average Placement Fee</div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-900">{insights.cheapestCard.vendorName}</div>
                <div className="text-sm text-green-700">Lowest Cost: {formatCurrency(insights.cheapestCard.placementFee)}</div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-900">{insights.bestValueCard.vendorName}</div>
                <div className="text-sm text-purple-700">Best Value: {insights.bestValueCard.vendorPassRate}% pass rate</div>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-900">{formatCurrency(insights.savingsPotential)}</div>
                <div className="text-sm text-orange-700">Potential Savings per Hire</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rate Cards Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Rate Cards ({filteredCards.length})</CardTitle>
            <Button variant="outline" size="sm">
              Export to CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead className="text-right">Placement Fee</TableHead>
                  <TableHead className="text-right">Interview Fee</TableHead>
                  <TableHead className="text-right">Monthly Volume</TableHead>
                  <TableHead className="text-right">Pass Rate</TableHead>
                  <TableHead>Volume Discount</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCards.map((card, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{card.vendorName}</div>
                        <div className="text-xs text-gray-500">
                          {card.vendorPlacements} placements/month
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{card.roleCategory}</TableCell>
                    <TableCell>{card.region}</TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getTierColor(card.tier)}`}>
                        {card.tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(card.placementFee, card.currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(card.interviewFee, card.currency)}
                    </TableCell>
                    <TableCell className="text-right">{card.volume}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {card.vendorPassRate > 65 ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : card.vendorPassRate < 50 ? (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        ) : null}
                        <span className={`font-semibold ${
                          card.vendorPassRate > 65 ? 'text-green-600' : 
                          card.vendorPassRate < 50 ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {card.vendorPassRate}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-gray-600">
                        {getDiscountInfo(card)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Negotiate Better Rates</h3>
                <p className="text-sm text-gray-600">Identify optimization opportunities</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold">Schedule Review</h3>
                <p className="text-sm text-gray-600">Plan vendor rate discussions</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Calendar Invite
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-semibold">Budget Planning</h3>
                <p className="text-sm text-gray-600">Forecast cost scenarios</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Cost Model
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}