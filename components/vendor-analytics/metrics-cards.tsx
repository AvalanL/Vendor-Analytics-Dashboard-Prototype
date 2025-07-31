import {
  allVendors,
  roles,
  overallPassRate as trueOverallPassRate,
  totalPlacements as trueTotalPlacements,
} from "@/lib/dummy-data"
import {
  generatePassRateData,
  generatePlacementsData,
  filterVendors,
  filterVendorsByRole,
  filterRoles,
  generateRolePassRateData,
  generateRolePlacementsData,
} from "@/lib/filter-utils"
import { PassRateGraph } from "./pass-rate-graph"
import { PlacementsGraph } from "./placements-graph"

interface MetricsCardsProps {
  selectedPeriod: string
  selectedVendor: string
  selectedRole: string
  activeTab: string
  searchQuery: string
}

export function MetricsCards({
  selectedPeriod,
  selectedVendor,
  selectedRole,
  activeTab,
  searchQuery,
}: MetricsCardsProps) {
  if (activeTab === "Vendors") {
    // First filter vendors by role if a role is selected
    const roleFilteredVendors = filterVendorsByRole(allVendors, roles, selectedRole)

    // Then apply other filters
    const filteredVendors = filterVendors(
      roleFilteredVendors,
      selectedPeriod,
      selectedVendor,
      selectedRole,
      searchQuery,
    )

    // Generate pass rate data
    const passRateData = generatePassRateData(filteredVendors, selectedPeriod, trueOverallPassRate)

    // Generate placements data
    const placementsData = generatePlacementsData(filteredVendors, selectedPeriod, trueTotalPlacements)

    return (
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <PassRateGraph items={passRateData.vendors} overallPassRate={passRateData.overallPassRate} itemType="vendor" />
        <PlacementsGraph
          items={placementsData.vendors}
          totalPlacements={placementsData.totalPlacements}
          itemType="vendor"
        />
      </div>
    )
  } else {
    // Filter roles based on selected filters
    const filteredRoles = filterRoles(roles, selectedPeriod, selectedVendor, selectedRole, searchQuery)

    // Generate role-based pass rate data
    const rolePassRateData = generateRolePassRateData(filteredRoles, selectedPeriod, trueOverallPassRate)

    // Generate role-based placements data
    const rolePlacementsData = generateRolePlacementsData(filteredRoles, selectedPeriod, trueTotalPlacements)

    return (
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <PassRateGraph
          items={rolePassRateData.roles}
          overallPassRate={rolePassRateData.overallPassRate}
          itemType="role"
        />
        <PlacementsGraph
          items={rolePlacementsData.roles}
          totalPlacements={rolePlacementsData.totalPlacements}
          itemType="role"
        />
      </div>
    )
  }
}
