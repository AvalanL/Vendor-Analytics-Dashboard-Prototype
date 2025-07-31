import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingDown, Target, Users, Filter } from "lucide-react"

interface VendorSourcingInsightsProps {
  selectedPeriod: string
  selectedClient: string
  selectedRole: string
}

export function VendorSourcingInsights({ selectedPeriod, selectedClient, selectedRole }: VendorSourcingInsightsProps) {
  // Dynamic failure insights based on filters
  const getFilteredInsights = () => {
    if (selectedClient === "Citibank") {
      return [
        {
          type: "skill_gap",
          title: "Top Failure Reason",
          description: "System Design (48% of failures)",
          context: "Citibank specific",
          action: "Focus on distributed systems patterns"
        },
        {
          type: "communication",
          title: "Technical Presentation",
          description: "Architecture explanation (31% of failures)",
          context: "Citibank specific",
          action: "Practice whiteboard system design"
        }
      ]
    } else if (selectedClient === "Bank of America") {
      return [
        {
          type: "communication",
          title: "Top Failure Reason",
          description: "Technical communication (45% of failures)",
          context: "Bank of America specific",
          action: "Screen for clear problem explanation"
        },
        {
          type: "coding_speed",
          title: "Implementation Speed",
          description: "Code completion (29% of failures)",
          context: "Bank of America specific", 
          action: "Practice live coding exercises"
        }
      ]
    } else if (selectedClient === "HSBC") {
      return [
        {
          type: "skill_gap",
          title: "Data Structures Focus",
          description: "Algorithm optimization (41% of failures)",
          context: "HSBC specific",
          action: "Strengthen DS&A fundamentals"
        },
        {
          type: "communication",
          title: "Code Review Skills",
          description: "Code explanation (26% of failures)",
          context: "HSBC specific",
          action: "Practice code walkthrough sessions"
        }
      ]
    } else if (selectedClient === "Société Générale") {
      return [
        {
          type: "coding_speed",
          title: "Top Failure Reason",
          description: "Time management (38% of failures)",
          context: "Société Générale specific",
          action: "Practice timed coding challenges"
        },
        {
          type: "skill_gap",
          title: "Backend Focus",
          description: "Database design (33% of failures)",
          context: "Société Générale specific",
          action: "Improve SQL and schema design skills"
        }
      ]
    } else {
      // All Clients
      return [
        {
          type: "skill_gap",
          title: "Top Failure Reason",
          description: "System Design (42% of failures)",
          context: "All clients",
          action: "Screen for distributed systems experience"
        },
        {
          type: "communication",
          title: "Communication Issues",
          description: "Technical explanation (28% of failures)",
          context: "All clients",
          action: "Add technical communication assessment"
        },
        {
          type: "coding_speed",
          title: "Time Management",
          description: "Incomplete solutions (22% of failures)",
          context: "All clients",
          action: "Practice timed coding exercises"
        }
      ]
    }
  }

  const failureInsights = getFilteredInsights()

  const getIcon = (type: string) => {
    switch (type) {
      case "skill_gap": return <AlertTriangle className="h-3 w-3 text-red-500" />
      case "communication": return <Users className="h-3 w-3 text-yellow-500" />
      case "coding_speed": return <TrendingDown className="h-3 w-3 text-orange-500" />
      default: return <Target className="h-3 w-3" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "skill_gap": return "bg-red-100 text-red-700"
      case "communication": return "bg-yellow-100 text-yellow-700"
      case "coding_speed": return "bg-orange-100 text-orange-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const isFiltered = selectedClient !== "All Clients" || selectedRole !== "All Roles"

  const getHeaderTitle = () => {
    if (selectedClient !== "All Clients" && selectedRole !== "All Roles") {
      return `${selectedRole} at ${selectedClient}`
    } else if (selectedClient !== "All Clients") {
      return selectedClient
    } else if (selectedRole !== "All Roles") {
      return selectedRole
    } else {
      return "All Contexts"
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          {isFiltered && <Filter className="h-3 w-3 text-blue-500" />}
          <AlertTriangle className="h-4 w-4 text-red-500" />
          Failure Analysis
        </CardTitle>
        {isFiltered && (
          <div className="text-xs text-gray-600">{getHeaderTitle()}</div>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {failureInsights.map((insight, index) => (
          <div key={index} className="p-2 bg-gray-50 rounded text-sm">
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-1">
                {getIcon(insight.type)}
                <span className="font-medium text-xs">{insight.title}</span>
              </div>
              <Badge className={getTypeColor(insight.type)} variant="outline">
                {insight.type.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mb-1">{insight.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-600">{insight.context}</span>
              <span className="text-xs text-green-600">{insight.action}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 