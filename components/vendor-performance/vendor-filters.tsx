import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"

interface VendorFiltersProps {
  selectedPeriod: string
  onPeriodChange: (period: string) => void
  selectedClients: string[]
  onClientsChange: (clients: string[]) => void
  selectedRoles: string[]
  onRolesChange: (roles: string[]) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function VendorFilters({
  selectedPeriod,
  onPeriodChange,
  selectedClients,
  onClientsChange,
  selectedRoles,
  onRolesChange,
  searchQuery,
  onSearchChange,
}: VendorFiltersProps) {
  const clientOptions = [
    { value: "Google", label: "Google", count: 45 },
    { value: "Meta", label: "Meta", count: 32 },
    { value: "Amazon", label: "Amazon", count: 28 },
    { value: "Microsoft", label: "Microsoft", count: 41 },
    { value: "Apple", label: "Apple", count: 23 },
    { value: "Netflix", label: "Netflix", count: 18 },
    { value: "Uber", label: "Uber", count: 31 },
    { value: "Airbnb", label: "Airbnb", count: 22 },
    { value: "Citibank", label: "Citibank", count: 19 },
    { value: "Bank of America", label: "Bank of America", count: 24 },
    { value: "HSBC", label: "HSBC", count: 16 },
    { value: "Société Générale", label: "Société Générale", count: 14 },
  ]

  const roleOptions = [
    { value: "Senior Software Engineer", label: "Senior Software Engineer", count: 68 },
    { value: "Staff Software Engineer", label: "Staff Software Engineer", count: 34 },
    { value: "Principal Software Engineer", label: "Principal Software Engineer", count: 21 },
    { value: "Senior Frontend Engineer", label: "Senior Frontend Engineer", count: 45 },
    { value: "Senior Backend Engineer", label: "Senior Backend Engineer", count: 52 },
    { value: "Senior Full Stack Engineer", label: "Senior Full Stack Engineer", count: 38 },
    { value: "Senior DevOps Engineer", label: "Senior DevOps Engineer", count: 29 },
    { value: "Data Scientist", label: "Data Scientist", count: 33 },
    { value: "Machine Learning Engineer", label: "Machine Learning Engineer", count: 27 },
    { value: "Product Manager", label: "Product Manager", count: 19 },
    { value: "Engineering Manager", label: "Engineering Manager", count: 15 },
  ]

  const clearAllFilters = () => {
    onClientsChange([])
    onRolesChange([])
    onSearchChange("")
  }

  const hasActiveFilters = selectedClients.length > 0 || selectedRoles.length > 0 || searchQuery.trim() !== ""

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-6">
        {/* Main Filter Row */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
          {/* Period Filter */}
          <div className="flex flex-col gap-2 min-w-[180px]">
            <label className="text-sm font-medium text-gray-700">Time Period</label>
            <Select value={selectedPeriod} onValueChange={onPeriodChange}>
              <SelectTrigger className="h-[48px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="365days">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Client Multi-Select */}
          <MultiSelect
            label="Clients"
            placeholder="Select clients..."
            options={clientOptions}
            selectedValues={selectedClients}
            onSelectionChange={onClientsChange}
            maxDisplay={2}
            className="min-w-[280px] lg:flex-1"
          />

          {/* Role Multi-Select */}
          <MultiSelect
            label="Roles"
            placeholder="Select roles..."
            options={roleOptions}
            selectedValues={selectedRoles}
            onSelectionChange={onRolesChange}
            maxDisplay={2}
            className="min-w-[280px] lg:flex-1"
          />

          {/* Search */}
          <div className="flex flex-col gap-2 min-w-[250px]">
            <label className="text-sm font-medium text-gray-700">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search candidates, skills..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 h-[48px]"
              />
            </div>
          </div>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-600 hover:text-gray-900 underline whitespace-nowrap self-end mb-2"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Active filters:</span>
            
            {selectedClients.map(client => (
              <Badge key={client} variant="secondary" className="flex items-center gap-1">
                {client}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-600"
                  onClick={() => onClientsChange(selectedClients.filter(c => c !== client))}
                />
              </Badge>
            ))}
            
            {selectedRoles.map(role => (
              <Badge key={role} variant="outline" className="flex items-center gap-1">
                {role}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-600"
                  onClick={() => onRolesChange(selectedRoles.filter(r => r !== role))}
                />
              </Badge>
            ))}
            
            {searchQuery.trim() !== "" && (
              <Badge variant="destructive" className="flex items-center gap-1">
                Search: "{searchQuery}"
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-200"
                  onClick={() => onSearchChange("")}
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 