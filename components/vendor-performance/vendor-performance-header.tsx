import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

interface VendorPerformanceHeaderProps {
  selectedPeriod: string
  setSelectedPeriod: (period: string) => void
}

export function VendorPerformanceHeader({ selectedPeriod, setSelectedPeriod }: VendorPerformanceHeaderProps) {
  // Mock vendor data - in real app this would come from auth/API
  const vendorData = {
    name: "TechFlow Global",
    status: "Active",
    performanceStatus: "trending_up", // trending_up, stable, attention_needed
    currentPassRate: 43,
    marketAverage: 27,
    ranking: 3, // out of all vendors
    totalVendors: 25
  }

  const getStatusIcon = () => {
    switch (vendorData.performanceStatus) {
      case "trending_up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "attention_needed":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-blue-600" />
    }
  }

  const getStatusText = () => {
    switch (vendorData.performanceStatus) {
      case "trending_up":
        return "Outperforming Market"
      case "attention_needed":
        return "Needs Attention"
      default:
        return "Stable Performance"
    }
  }

  const getStatusColor = () => {
    switch (vendorData.performanceStatus) {
      case "trending_up":
        return "bg-green-100 text-green-800"
      case "attention_needed":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">
            {vendorData.name}
          </h1>
          <Badge variant="outline" className="text-sm">
            {vendorData.status}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge className={getStatusColor()}>
              {getStatusText()}
            </Badge>
          </div>
          <span>•</span>
          <span>Pass Rate: {vendorData.currentPassRate}% (Market: {vendorData.marketAverage}%)</span>
          <span>•</span>
          <span>Ranking: #{vendorData.ranking} of {vendorData.totalVendors}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm text-gray-500">Time Period</p>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="365">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
} 