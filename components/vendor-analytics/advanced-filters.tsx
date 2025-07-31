import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"
import { allVendors, roles } from "@/lib/dummy-data"

interface AdvancedFiltersProps {
  selectedPeriod: string
  onPeriodChange: (period: string) => void
  selectedVendors: string[]
  onVendorsChange: (vendors: string[]) => void
  selectedRoles: string[]
  onRolesChange: (roles: string[]) => void
  selectedRegions: string[]
  onRegionsChange: (regions: string[]) => void
}

export function AdvancedFilters({
  selectedPeriod,
  onPeriodChange,
  selectedVendors,
  onVendorsChange,
  selectedRoles,
  onRolesChange,
  selectedRegions,
  onRegionsChange
}: AdvancedFiltersProps) {
  const periods = [
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "90days", label: "Last 90 days" },
    { value: "12months", label: "Last 12 months" },
    { value: "24months", label: "Last 24 months" }
  ]

  const vendors = allVendors.filter(v => v.status === 'Active').map(v => v.name)
  const rolesList = roles.map(r => r.name)
  const regions = [...new Set(roles.map(r => r.location))]

  const addVendor = (vendor: string) => {
    if (!selectedVendors.includes(vendor) && vendor !== "All Vendors") {
      onVendorsChange(selectedVendors.filter(v => v !== "All Vendors").concat(vendor))
    }
  }

  const removeVendor = (vendor: string) => {
    const updated = selectedVendors.filter(v => v !== vendor)
    onVendorsChange(updated.length === 0 ? ["All Vendors"] : updated)
  }

  const addRole = (role: string) => {
    if (!selectedRoles.includes(role) && role !== "All Roles") {
      onRolesChange(selectedRoles.filter(r => r !== "All Roles").concat(role))
    }
  }

  const removeRole = (role: string) => {
    const updated = selectedRoles.filter(r => r !== role)
    onRolesChange(updated.length === 0 ? ["All Roles"] : updated)
  }

  const addRegion = (region: string) => {
    if (!selectedRegions.includes(region) && region !== "All Regions") {
      onRegionsChange(selectedRegions.filter(r => r !== "All Regions").concat(region))
    }
  }

  const removeRegion = (region: string) => {
    const updated = selectedRegions.filter(r => r !== region)
    onRegionsChange(updated.length === 0 ? ["All Regions"] : updated)
  }

  const clearAllFilters = () => {
    onVendorsChange(["All Vendors"])
    onRolesChange(["All Roles"])
    onRegionsChange(["All Regions"])
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearAllFilters}
          className="ml-auto text-sm text-gray-600 hover:text-gray-900"
        >
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
          <Select value={selectedPeriod} onValueChange={onPeriodChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periods.map(period => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vendors</label>
          <Select onValueChange={addVendor}>
            <SelectTrigger>
              <SelectValue placeholder="Add vendor..." />
            </SelectTrigger>
            <SelectContent>
              {vendors.filter(v => !selectedVendors.includes(v)).map(vendor => (
                <SelectItem key={vendor} value={vendor}>
                  {vendor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
          <Select onValueChange={addRole}>
            <SelectTrigger>
              <SelectValue placeholder="Add role..." />
            </SelectTrigger>
            <SelectContent>
              {rolesList.filter(r => !selectedRoles.includes(r)).map(role => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Regions</label>
          <Select onValueChange={addRegion}>
            <SelectTrigger>
              <SelectValue placeholder="Add region..." />
            </SelectTrigger>
            <SelectContent>
              {regions.filter(r => !selectedRegions.includes(r)).map(region => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {selectedVendors.filter(v => v !== "All Vendors").length > 0 && (
          <div>
            <span className="text-sm text-gray-600 mr-2">Vendors:</span>
            <div className="inline-flex flex-wrap gap-1">
              {selectedVendors.filter(v => v !== "All Vendors").map(vendor => (
                <Badge key={vendor} variant="secondary" className="flex items-center gap-1">
                  {vendor}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-600" 
                    onClick={() => removeVendor(vendor)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {selectedRoles.filter(r => r !== "All Roles").length > 0 && (
          <div>
            <span className="text-sm text-gray-600 mr-2">Roles:</span>
            <div className="inline-flex flex-wrap gap-1">
              {selectedRoles.filter(r => r !== "All Roles").map(role => (
                <Badge key={role} variant="secondary" className="flex items-center gap-1">
                  {role}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-600" 
                    onClick={() => removeRole(role)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {selectedRegions.filter(r => r !== "All Regions").length > 0 && (
          <div>
            <span className="text-sm text-gray-600 mr-2">Regions:</span>
            <div className="inline-flex flex-wrap gap-1">
              {selectedRegions.filter(r => r !== "All Regions").map(region => (
                <Badge key={region} variant="secondary" className="flex items-center gap-1">
                  {region}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-600" 
                    onClick={() => removeRegion(region)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}