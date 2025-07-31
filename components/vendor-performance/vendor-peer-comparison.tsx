import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Trophy, Users, Building, Filter } from "lucide-react"

interface VendorPeerComparisonProps {
  selectedPeriod: string
  selectedClient: string
  selectedRole: string
}

export function VendorPeerComparison({ selectedPeriod, selectedClient, selectedRole }: VendorPeerComparisonProps) {
  // Dynamic peer data based on client
  const getFilteredPeerData = () => {
    if (selectedClient === "Citibank") {
      return {
        ranking: 2,
        totalVendors: 8,
        percentile: 87,
        passRate: 52,
        peerAverage: 47,
        topPerformer: 58,
        context: "Citibank vendor pool",
        insight: "Strong performer at Citibank. Close to market leader."
      }
    } else if (selectedClient === "Bank of America") {
      return {
        ranking: 5,
        totalVendors: 7,
        percentile: 43,
        passRate: 38,
        peerAverage: 41,
        topPerformer: 49,
        context: "Bank of America vendor pool",
        insight: "Below average at Bank of America. Focus on communication skills."
      }
    } else if (selectedClient === "HSBC") {
      return {
        ranking: 3,
        totalVendors: 6,
        percentile: 67,
        passRate: 45,
        peerAverage: 39,
        topPerformer: 51,
        context: "HSBC vendor pool",
        insight: "Above average at HSBC. Strong in technical skills."
      }
    } else if (selectedClient === "Société Générale") {
      return {
        ranking: 4,
        totalVendors: 5,
        percentile: 40,
        passRate: 36,
        peerAverage: 35,
        topPerformer: 42,
        context: "Société Générale vendor pool",
        insight: "Middle tier at Société Générale. Improve coding speed."
      }
    } else {
      // All Clients - overall performance
      return {
        ranking: 3,
        totalVendors: 12,
        percentile: 75,
        passRate: 43,
        peerAverage: 38,
        topPerformer: 45,
        context: "All clients combined",
        insight: "Strong overall performance across all clients."
      }
    }
  }

  const peerData = getFilteredPeerData()

  const getPerformanceColor = (yourRate: number, peerAverage: number) => {
    return yourRate > peerAverage ? "text-green-600" : "text-red-600"
  }

  const getPerformanceIcon = (yourRate: number, peerAverage: number) => {
    return yourRate > peerAverage ? 
      <TrendingUp className="h-3 w-3 text-green-500" /> : 
      <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
  }

  const getRankingColor = (ranking: number, total: number) => {
    const percentile = ((total - ranking + 1) / total) * 100
    if (percentile >= 66) return "bg-green-100 text-green-700"
    if (percentile >= 33) return "bg-yellow-100 text-yellow-700"
    return "bg-red-100 text-red-700"
  }

  const isFiltered = selectedClient !== "All Clients" || selectedRole !== "All Roles"

  const getHeaderTitle = () => {
    if (selectedClient !== "All Clients" && selectedRole !== "All Roles") {
      return `${selectedRole} at ${selectedClient}`
    } else if (selectedClient !== "All Clients") {
      return `${selectedClient} Market`
    } else if (selectedRole !== "All Roles") {
      return `${selectedRole} Ranking`
    } else {
      return "Overall Market"
    }
  }

  const getProgressToTop = () => {
    return (peerData.passRate / peerData.topPerformer) * 100
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          {isFiltered && <Filter className="h-3 w-3 text-blue-500" />}
          <Trophy className="h-4 w-4 text-yellow-500" />
          Peer Ranking
        </CardTitle>
        {isFiltered && (
          <div className="text-xs text-gray-600">{getHeaderTitle()}</div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Current Position */}
        <div className="text-center p-2 bg-blue-50 rounded">
          <div className="text-lg font-bold text-blue-600">#{peerData.ranking}</div>
          <div className="text-xs text-gray-600">of {peerData.totalVendors} vendors</div>
          <Badge className="mt-1 bg-blue-100 text-blue-800" variant="outline">
            {peerData.percentile}th percentile
          </Badge>
        </div>

        {/* Performance vs Peers */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Building className="h-3 w-3 text-blue-500" />
            <span className="text-sm font-medium">Performance vs Peers</span>
          </div>
          
          <div className="p-2 bg-gray-50 rounded text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">Your Pass Rate</span>
              <div className="flex items-center gap-1">
                <span className="font-bold">{peerData.passRate}%</span>
                {getPerformanceIcon(peerData.passRate, peerData.peerAverage)}
              </div>
            </div>
            <Progress value={getProgressToTop()} className="h-1 mb-1" />
            <div className="flex justify-between">
              <span className="text-gray-600">Peer Avg: {peerData.peerAverage}%</span>
              <span className="text-gray-600">Top: {peerData.topPerformer}%</span>
            </div>
          </div>

          <div className="text-xs text-center">
            <span className={getPerformanceColor(peerData.passRate, peerData.peerAverage)}>
              {peerData.passRate > peerData.peerAverage ? '+' : ''}
              {peerData.passRate - peerData.peerAverage}% vs peer average
            </span>
          </div>
        </div>

        {/* Contextual Insight */}
        <div className="p-2 bg-green-50 rounded">
          <div className="flex items-center gap-1 mb-1">
            <Users className="h-3 w-3 text-green-600" />
            <span className="text-xs font-medium text-green-700">Market Position</span>
          </div>
          <p className="text-xs text-green-600">{peerData.insight}</p>
        </div>
      </CardContent>
    </Card>
  )
} 