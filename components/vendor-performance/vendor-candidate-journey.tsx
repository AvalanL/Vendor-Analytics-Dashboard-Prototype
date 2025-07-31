import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Users, Filter } from "lucide-react"

interface VendorCandidateJourneyProps {
  selectedPeriod: string
  selectedClient: string
  selectedRole: string
}

export function VendorCandidateJourney({ selectedPeriod, selectedClient, selectedRole }: VendorCandidateJourneyProps) {
  // Dynamic data based on filters
  const getFilteredData = () => {
    if (selectedClient === "Citibank") {
      return {
        totalSubmitted: 342,
        totalPassed: 178,
        passRate: 52,
        marketAverage: 47,
        trend: "up"
      }
    } else if (selectedClient === "Bank of America") {
      return {
        totalSubmitted: 289,
        totalPassed: 110,
        passRate: 38,
        marketAverage: 41,
        trend: "down"
      }
    } else if (selectedClient === "HSBC") {
      return {
        totalSubmitted: 234,
        totalPassed: 105,
        passRate: 45,
        marketAverage: 39,
        trend: "up"
      }
    } else if (selectedClient === "Société Générale") {
      return {
        totalSubmitted: 198,
        totalPassed: 71,
        passRate: 36,
        marketAverage: 35,
        trend: "up"
      }
    } else {
      // All Clients
      return {
        totalSubmitted: 1247,
        totalPassed: 536,
        passRate: 43,
        marketAverage: 38,
        trend: "up"
      }
    }
  }

  const assessmentData = getFilteredData()

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />
  }

  const getHeaderTitle = () => {
    if (selectedClient !== "All Clients" && selectedRole !== "All Roles") {
      return `${selectedRole} at ${selectedClient}`
    } else if (selectedClient !== "All Clients") {
      return selectedClient
    } else if (selectedRole !== "All Roles") {
      return selectedRole
    } else {
      return "Overall Performance"
    }
  }

  const isFiltered = selectedClient !== "All Clients" || selectedRole !== "All Roles"

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          {isFiltered && <Filter className="h-3 w-3 text-blue-500" />}
          Assessment Performance
        </CardTitle>
        {isFiltered && (
          <div className="text-xs text-gray-600">{getHeaderTitle()}</div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="text-lg font-bold text-blue-600">{assessmentData.passRate}%</div>
            <div className="text-xs text-gray-600">Pass Rate</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-600">{assessmentData.totalPassed}</div>
            <div className="text-xs text-gray-600">Placements</div>
          </div>
        </div>

        {/* Progress vs Market */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">vs Market Average</span>
            <div className="flex items-center gap-1">
              {getTrendIcon(assessmentData.trend)}
              <span className={`text-xs font-medium ${
                assessmentData.passRate > assessmentData.marketAverage ? 'text-green-600' : 'text-red-600'
              }`}>
                {assessmentData.passRate > assessmentData.marketAverage ? '+' : ''}
                {assessmentData.passRate - assessmentData.marketAverage}%
              </span>
            </div>
          </div>
          <Progress value={assessmentData.passRate} className="h-1.5" />
          <div className="text-xs text-gray-500">Market: {assessmentData.marketAverage}%</div>
        </div>

        {/* Filter Status */}
        <div className="p-2 bg-gray-50 rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 text-blue-500" />
              <span className="text-sm font-medium">
                {isFiltered ? "Filtered View" : "All Data"}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold">{assessmentData.totalSubmitted}</div>
              <div className="text-xs text-gray-600">total candidates</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 