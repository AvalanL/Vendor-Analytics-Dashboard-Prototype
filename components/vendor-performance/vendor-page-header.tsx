import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Clock, CheckCircle } from "lucide-react"

interface VendorPageHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function VendorPageHeader({ activeTab, onTabChange }: VendorPageHeaderProps) {
  const tabs = [
    { id: "Performance", label: "Performance", icon: TrendingUp },
    { id: "Candidates", label: "Candidates", icon: Users },
    { id: "Insights", label: "Insights", icon: Clock },
    { id: "Benchmarks", label: "Benchmarks", icon: CheckCircle },
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Performance Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your placement performance and optimize your recruitment strategy</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Active Vendor
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Premium Tier
          </Badge>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
} 