import { Card, CardContent } from '@/components/ui/card'
import { allVendors, roles } from '@/lib/dummy-data'
import { filterVendorsByRole, filterVendors } from '@/lib/filter-utils'

interface AnalyticsCardsProps {
  selectedPeriod: string
  selectedVendor: string
  selectedRole: string
  activeTab: string
  searchQuery: string
}

interface MetricCardProps {
  title: string
  value: string | number
  className?: string
}

function MetricCard({ title, value, className = '' }: MetricCardProps) {
  return (
    <Card className={`${className}`}>
      <CardContent className="p-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function AnalyticsCards({
  selectedPeriod,
  selectedVendor,
  selectedRole,
  activeTab,
  searchQuery,
}: AnalyticsCardsProps) {
  // Filter vendors based on selected criteria
  const roleFilteredVendors = filterVendorsByRole(allVendors, roles, selectedRole)
  const filteredVendors = filterVendors(
    roleFilteredVendors,
    selectedPeriod,
    selectedVendor,
    selectedRole,
    searchQuery,
  )

  // Filter roles based on search query and selected filters
  const filteredRoles = roles.filter(role => {
    const matchesSearch = searchQuery === '' || 
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = selectedRole === 'All Roles' || role.name === selectedRole
    
    return matchesSearch && matchesRole
  })

  // Calculate metrics based on filtered data
  const totalCandidates = filteredVendors.reduce((sum, vendor) => sum + vendor.volume, 0)
  const totalPlacements = filteredVendors.reduce((sum, vendor) => sum + vendor.placements, 0)
  const totalPassedCandidates = filteredVendors.reduce((sum, vendor) => sum + vendor.passTotal, 0)
  
  // Calculate averages
  const avgTimeInProcess = filteredVendors.length > 0 
    ? Math.round(filteredVendors.reduce((sum, vendor) => sum + vendor.timeInProcess, 0) / filteredVendors.length)
    : 0

  const avgNoShows = filteredVendors.length > 0
    ? Math.round(filteredVendors.reduce((sum, vendor) => sum + vendor.noShows, 0) / filteredVendors.length)
    : 0

  const avgIntegrityFlags = filteredVendors.length > 0
    ? Math.round(filteredVendors.reduce((sum, vendor) => sum + vendor.integrityFlag, 0) / filteredVendors.length)
    : 0

  // Calculate pass rate percentage
  const passRatePercentage = totalCandidates > 0
    ? Math.round((totalPassedCandidates / totalCandidates) * 100)
    : 0

  // Use different metrics based on active tab
  const metrics = activeTab === 'Roles' ? {
    totalRoles: filteredRoles.length,
    candidates: totalCandidates,
    avgTimeInProcess: avgTimeInProcess > 0 ? `${avgTimeInProcess} days` : '-',
    noShows: `${avgNoShows} %`,
    lateCancels: `${avgNoShows} %`,
    integrityFlags: `${avgIntegrityFlags} %`,
    candidatesAboveBar: `${passRatePercentage} %`,
    overallPlacements: totalPlacements,
  } : {
    totalRoles: filteredRoles.length,
    candidates: totalCandidates,
    avgTimeInProcess: avgTimeInProcess > 0 ? `${avgTimeInProcess} days` : '-',
    noShows: `${avgNoShows} %`,
    lateCancels: `${avgNoShows} %`,
    integrityFlags: `${avgIntegrityFlags} %`,
    candidatesAboveBar: `${passRatePercentage} %`,
    overallPlacements: totalPlacements,
  }

  return (
    <div className="mb-8">
      {/* First row of cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
        <MetricCard title="Total Roles" value={metrics.totalRoles} />
        <MetricCard title="Candidates" value={metrics.candidates} />
        <MetricCard title="Avg. Time in Process" value={metrics.avgTimeInProcess} />
        <MetricCard title="No Shows" value={metrics.noShows} />
        <MetricCard title="Late Cancels" value={metrics.lateCancels} />
        <MetricCard title="Integrity Flags" value={metrics.integrityFlags} />
      </div>

      {/* Second row of cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard title="Candidates Above Bar" value={metrics.candidatesAboveBar} />
        <MetricCard title="Overall Placements" value={metrics.overallPlacements} />
      </div>
    </div>
  )
} 