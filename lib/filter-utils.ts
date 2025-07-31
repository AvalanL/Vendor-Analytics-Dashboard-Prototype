import type { Vendor, Role, FunnelStage } from "./dummy-data"

// Time period multipliers for data scaling
const TIME_PERIOD_MULTIPLIERS = {
  "7days": 0.25,
  "30days": 1.0, // Base reference
  "90days": 2.5,
  "1year": 8.0,
}

// Filter vendors based on selected filters
export function filterVendors(
  vendors: Vendor[],
  selectedPeriod: string,
  selectedVendor: string | null = null,
  selectedRole: string | null = null,
  searchQuery = "",
): Vendor[] {
  // First filter by vendor name if specified
  let filteredVendors = vendors
  if (selectedVendor && selectedVendor !== "All Vendors") {
    filteredVendors = vendors.filter((vendor) => vendor.name === selectedVendor)
  }

  // First filter by search query if provided
  if (searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase().trim()
    filteredVendors = filteredVendors.filter((vendor) => vendor.name.toLowerCase().includes(query))
  }

  // Apply time period scaling to each vendor's data
  const multiplier = TIME_PERIOD_MULTIPLIERS[selectedPeriod as keyof typeof TIME_PERIOD_MULTIPLIERS] || 1.0

  return filteredVendors.map((vendor) => {
    // Create a copy of the vendor to avoid mutating the original
    const scaledVendor = { ...vendor }

    // Scale numeric values based on time period
    scaledVendor.volume = Math.round(vendor.volume * multiplier)
    scaledVendor.passTotal = Math.round(vendor.passTotal * multiplier)
    scaledVendor.noShowsTotal = Math.round(vendor.noShowsTotal * multiplier)
    scaledVendor.integrityTotal = Math.round(vendor.integrityTotal * multiplier)
    scaledVendor.placements = Math.round(vendor.placements * multiplier)
    scaledVendor.placementsTotal = Math.round(vendor.placementsTotal * multiplier)

    // Some values should remain as percentages
    // scaledVendor.passRate = vendor.passRate
    // scaledVendor.noShows = vendor.noShows
    // scaledVendor.integrityFlag = vendor.integrityFlag

    return scaledVendor
  })
}

// Filter vendors based on selected role
export function filterVendorsByRole(allVendors: Vendor[], roles: Role[], selectedRole: string | null = null): Vendor[] {
  if (!selectedRole || selectedRole === "All Roles") {
    return allVendors
  }

  // Find the role that matches the selected role
  const matchingRole = roles.find((role) => role.name === selectedRole)
  if (!matchingRole) {
    return allVendors
  }

  // Get vendor names from the matching role
  const vendorNames = matchingRole.vendors.map((vendor) => vendor.name)

  // Filter all vendors to only include those in the selected role
  return allVendors.filter((vendor) => vendorNames.includes(vendor.name))
}

// Filter roles based on selected filters
export function filterRoles(
  roles: Role[],
  selectedPeriod: string,
  selectedVendor: string | null = null,
  selectedRole: string | null = null,
  searchQuery = "",
): Role[] {
  let filteredRoles = [...roles]

  // Filter by role name if specified
  if (selectedRole && selectedRole !== "All Roles") {
    filteredRoles = filteredRoles.filter((role) => role.name === selectedRole)
  }

  // Apply search filter if provided
  if (searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase().trim()

    filteredRoles = filteredRoles.filter((role) => {
      // Check if role name matches search
      if (role.name.toLowerCase().includes(query)) {
        return true
      }

      // Check if any vendors in this role match search
      const hasMatchingVendor = role.vendors.some((vendor) => vendor.name.toLowerCase().includes(query))

      return hasMatchingVendor
    })

    // Also filter vendors within each role
    filteredRoles = filteredRoles.map((role) => ({
      ...role,
      vendors: role.vendors.filter(
        (vendor) => vendor.name.toLowerCase().includes(query) || role.name.toLowerCase().includes(query),
      ),
    }))
  }

  // Apply vendor filter and time period scaling to each role's vendors
  const multiplier = TIME_PERIOD_MULTIPLIERS[selectedPeriod as keyof typeof TIME_PERIOD_MULTIPLIERS] || 1.0

  return filteredRoles
    .map((role) => {
      // Filter vendors within each role if a vendor filter is applied
      let filteredVendors = role.vendors
      if (selectedVendor && selectedVendor !== "All Vendors") {
        filteredVendors = filteredVendors.filter((vendor) => vendor.name === selectedVendor)
      }

      // Scale vendor data based on time period
      const scaledVendors = filteredVendors.map((vendor) => {
        const scaledVendor = { ...vendor }

        // Scale numeric values based on time period
        scaledVendor.volume = Math.round(vendor.volume * multiplier)
        scaledVendor.passTotal = Math.round(vendor.passTotal * multiplier)
        scaledVendor.noShowsTotal = Math.round(vendor.noShowsTotal * multiplier)
        scaledVendor.integrityTotal = Math.round(vendor.integrityTotal * multiplier)
        scaledVendor.placements = Math.round(vendor.placements * multiplier)
        scaledVendor.placementsTotal = Math.round(vendor.placementsTotal * multiplier)

        return scaledVendor
      })

      return {
        ...role,
        vendors: scaledVendors,
      }
    })
    .filter((role) => role.vendors.length > 0) // Remove roles with no vendors after filtering
}

// Scale funnel data based on selected time period
export function scaleFunnelData(funnelStages: FunnelStage[], selectedPeriod: string): FunnelStage[] {
  const multiplier = TIME_PERIOD_MULTIPLIERS[selectedPeriod as keyof typeof TIME_PERIOD_MULTIPLIERS] || 1.0

  // Create a deep copy and scale the count values
  return funnelStages.map((stage) => {
    const scaledStage = { ...stage }
    scaledStage.count = Math.round(stage.count * multiplier)
    return scaledStage
  })
}

// Generate pass rate data for metrics cards based on filtered vendors
export function generatePassRateData(
  vendors: Vendor[],
  selectedPeriod: string,
  trueOverallPassRate: number,
) {
  const multiplier = TIME_PERIOD_MULTIPLIERS[selectedPeriod as keyof typeof TIME_PERIOD_MULTIPLIERS] || 1.0

  // Return all vendors sorted by volume (not pass rate) to stack rank by volume
  const allVendors = [...vendors]
    .sort((a, b) => b.volume - a.volume)
    .map((vendor) => ({
      name: vendor.name,
      percentage: vendor.passRate,
      count: Math.round(vendor.volume * multiplier),
    }))

  return {
    vendors: allVendors,
    overallPassRate: trueOverallPassRate,
  }
}

// Generate placements data for metrics cards based on filtered vendors
export function generatePlacementsData(
  vendors: Vendor[],
  selectedPeriod: string,
  trueTotalPlacements: number,
) {
  const multiplier = TIME_PERIOD_MULTIPLIERS[selectedPeriod as keyof typeof TIME_PERIOD_MULTIPLIERS] || 1.0

  // Take top 5 vendors by volume (not placements) to stack rank by volume
  const topVendors = [...vendors]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5)
    .map((vendor) => ({
      name: vendor.name,
      count: Math.round(vendor.placements * multiplier),
    }))

  return {
    vendors: topVendors,
    totalPlacements: trueTotalPlacements,
  }
}

// Generate pass rate data for roles
export function generateRolePassRateData(
  roles: Role[],
  selectedPeriod: string,
  trueOverallPassRate: number,
) {
  const multiplier = TIME_PERIOD_MULTIPLIERS[selectedPeriod as keyof typeof TIME_PERIOD_MULTIPLIERS] || 1.0

  // Calculate pass rate for each role (for display)
  const roleData = roles.map((role) => {
    const totalInterviews = role.vendors.reduce((sum, vendor) => sum + Math.round(vendor.volume * multiplier), 0)
    const totalPasses = role.vendors.reduce(
      (sum, vendor) => sum + Math.round((vendor.passRate / 100) * vendor.volume * multiplier),
      0,
    )
    const passRate = totalInterviews > 0 ? Math.round((totalPasses / totalInterviews) * 100) : 0

    return {
      name: role.name,
      percentage: passRate,
      count: totalInterviews,
    }
  })

  // Sort by pass rate (percentage) and return all roles (for display)
  const allRoles = [...roleData].sort((a, b) => b.percentage - a.percentage)

  // Remove calculation of overall pass rate based on topRoles
  // const totalInterviews = topRoles.reduce((sum, role) => sum + role.count, 0)
  // const totalPasses = topRoles.reduce((sum, role) => sum + (role.percentage / 100) * role.count, 0)
  // const overallPassRate = totalInterviews > 0 ? Math.round((totalPasses / totalInterviews) * 100) : 0

  return {
    roles: allRoles,
    overallPassRate: trueOverallPassRate,
  }
}

// Generate placements data for roles
export function generateRolePlacementsData(
  roles: Role[],
  selectedPeriod: string,
  trueTotalPlacements: number,
) {
  const multiplier = TIME_PERIOD_MULTIPLIERS[selectedPeriod as keyof typeof TIME_PERIOD_MULTIPLIERS] || 1.0

  // Calculate placements for each role (for display)
  const roleData = roles.map((role) => {
    const totalPlacements = role.vendors.reduce((sum, vendor) => sum + Math.round(vendor.placements * multiplier), 0)

    return {
      name: role.name,
      count: totalPlacements,
    }
  })

  // Sort by placements and take top 5 (for display)
  const topRoles = [...roleData].sort((a, b) => b.count - a.count).slice(0, 5)

  // Remove calculation of total placements based on topRoles
  // const totalPlacements = topRoles.reduce((sum, role) => sum + role.count, 0)

  return {
    roles: topRoles,
    totalPlacements: trueTotalPlacements,
  }
}
