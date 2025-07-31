import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Code, Database, Settings, Brain, TrendingUp, TrendingDown, AlertTriangle, Filter } from "lucide-react"

interface VendorSkillMatrixProps {
  selectedPeriod: string
  selectedClient: string
  selectedRole: string
}

export function VendorSkillMatrix({ selectedPeriod, selectedClient, selectedRole }: VendorSkillMatrixProps) {
  // Dynamic skill data based on client
  const getFilteredSkillData = () => {
    if (selectedClient === "Citibank") {
      return [
        {
          name: "System Design",
          icon: <Settings className="h-3 w-3" />,
          score: 48,
          marketAverage: 61,
          status: "needs_focus",
          failureRate: 48,
          clientFocus: "High priority at Citibank"
        },
        {
          name: "Problem Solving",
          icon: <Brain className="h-3 w-3" />,
          score: 76,
          marketAverage: 71,
          status: "strong",
          failureRate: 18,
          clientFocus: "Strong advantage"
        },
        {
          name: "Data Structures",
          icon: <Code className="h-3 w-3" />,
          score: 71,
          marketAverage: 65,
          status: "strong",
          failureRate: 22,
          clientFocus: "Above average"
        }
      ]
    } else if (selectedClient === "Bank of America") {
      return [
        {
          name: "Communication",
          icon: <Brain className="h-3 w-3" />,
          score: 52,
          marketAverage: 68,
          status: "needs_focus",
          failureRate: 45,
          clientFocus: "Critical for Bank of America"
        },
        {
          name: "System Design",
          icon: <Settings className="h-3 w-3" />,
          score: 65,
          marketAverage: 61,
          status: "strong",
          failureRate: 28,
          clientFocus: "Good performance"
        },
        {
          name: "Coding Speed",
          icon: <Code className="h-3 w-3" />,
          score: 58,
          marketAverage: 62,
          status: "average",
          failureRate: 29,
          clientFocus: "Room for improvement"
        }
      ]
    } else if (selectedClient === "HSBC") {
      return [
        {
          name: "Data Structures",
          icon: <Code className="h-3 w-3" />,
          score: 89,
          marketAverage: 65,
          status: "strong",
          failureRate: 8,
          clientFocus: "Excellent strength"
        },
        {
          name: "Database Design",
          icon: <Database className="h-3 w-3" />,
          score: 73,
          marketAverage: 64,
          status: "strong",
          failureRate: 19,
          clientFocus: "Above average"
        },
        {
          name: "Communication",
          icon: <Brain className="h-3 w-3" />,
          score: 61,
          marketAverage: 68,
          status: "average",
          failureRate: 26,
          clientFocus: "Needs improvement"
        }
      ]
    } else if (selectedClient === "Société Générale") {
      return [
        {
          name: "Coding Speed",
          icon: <Code className="h-3 w-3" />,
          score: 45,
          marketAverage: 62,
          status: "needs_focus",
          failureRate: 38,
          clientFocus: "Major weakness"
        },
        {
          name: "Database Design",
          icon: <Database className="h-3 w-3" />,
          score: 55,
          marketAverage: 64,
          status: "average",
          failureRate: 33,
          clientFocus: "Below average"
        },
        {
          name: "System Design",
          icon: <Settings className="h-3 w-3" />,
          score: 68,
          marketAverage: 61,
          status: "strong",
          failureRate: 24,
          clientFocus: "Good performance"
        }
      ]
    } else {
      // All Clients - aggregated view
      return [
        {
          name: "System Design",
          icon: <Settings className="h-3 w-3" />,
          score: 52,
          marketAverage: 61,
          status: "needs_focus",
          failureRate: 42,
          clientFocus: "Overall weakness"
        },
        {
          name: "Data Structures",
          icon: <Code className="h-3 w-3" />,
          score: 78,
          marketAverage: 65,
          status: "strong",
          failureRate: 15,
          clientFocus: "Overall strength"
        },
        {
          name: "Problem Solving",
          icon: <Brain className="h-3 w-3" />,
          score: 84,
          marketAverage: 71,
          status: "strong",
          failureRate: 12,
          clientFocus: "Key differentiator"
        },
        {
          name: "Database Design",
          icon: <Database className="h-3 w-3" />,
          score: 61,
          marketAverage: 64,
          status: "average",
          failureRate: 28,
          clientFocus: "Room for improvement"
        }
      ]
    }
  }

  const skillData = getFilteredSkillData()

  const getPerformanceIcon = (score: number, marketAverage: number) => {
    return score > marketAverage ? 
      <TrendingUp className="h-3 w-3 text-green-500" /> : 
      <TrendingDown className="h-3 w-3 text-red-500" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "strong": return "bg-green-100 text-green-700"
      case "average": return "bg-yellow-100 text-yellow-700"
      case "needs_focus": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "strong": return "Strong"
      case "average": return "Average"
      case "needs_focus": return "Focus Area"
      default: return "Unknown"
    }
  }

  const isFiltered = selectedClient !== "All Clients" || selectedRole !== "All Roles"

  const getHeaderTitle = () => {
    if (selectedClient !== "All Clients" && selectedRole !== "All Roles") {
      return `${selectedRole} at ${selectedClient}`
    } else if (selectedClient !== "All Clients") {
      return `${selectedClient} Requirements`
    } else if (selectedRole !== "All Roles") {
      return `${selectedRole} Skills`
    } else {
      return "Overall Skills"
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          {isFiltered && <Filter className="h-3 w-3 text-blue-500" />}
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          Skill Gaps
        </CardTitle>
        {isFiltered && (
          <div className="text-xs text-gray-600">{getHeaderTitle()}</div>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {skillData.map((skill, index) => (
          <div key={index} className="p-2 bg-gray-50 rounded">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                {skill.icon}
                <span className="text-sm font-medium">{skill.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge className={getStatusColor(skill.status)} variant="outline">
                  {getStatusText(skill.status)}
                </Badge>
                <span className="text-sm font-bold">{skill.score}%</span>
                {getPerformanceIcon(skill.score, skill.marketAverage)}
              </div>
            </div>
            <Progress value={skill.score} className="h-1 mb-1" />
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Market: {skill.marketAverage}%</span>
              <span className="text-red-600">{skill.failureRate}% failure rate</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 