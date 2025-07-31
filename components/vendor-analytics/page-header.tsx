import { Button } from "@/components/ui/button"
import { Download, BarChart3 } from "lucide-react"
import Link from "next/link"
import { TabNavigation } from "./tab-navigation"

interface PageHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function PageHeader({ activeTab, onTabChange }: PageHeaderProps) {
  // Page title style with exact specifications
  const pageTitleStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
    color: "#1A1C1C",
    fontFamily: "Satoshi, sans-serif",
    fontSize: "34px",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "118%",
  }

  // Breadcrumb style with exact specifications
  const breadcrumbStyle = {
    color: "#5751F9",
    fontFamily: '"Work Sans", sans-serif',
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "143%",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationSkipInk: "none",
    textDecorationThickness: "auto",
    textUnderlineOffset: "auto",
    textUnderlinePosition: "from-font",
  }

  // Non-link breadcrumb text style
  const breadcrumbTextStyle = {
    color: "#1A1C1C", // Dark text color
    fontFamily: '"Work Sans", sans-serif',
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "143%",
  }

  // Export button style
  const exportButtonStyle = {
    color: "#1A1C1C", // Dark text color
    fontFamily: '"Work Sans", sans-serif',
  }

  return (
    <div className="mb-6">
      {/* Breadcrumb with updated styling */}
      <div className="mb-2">
        <Link href="#" style={breadcrumbStyle}>
          Acme
        </Link>
        <span style={breadcrumbTextStyle} className="mx-1">
          /
        </span>
        <span style={breadcrumbTextStyle}>Vendors</span>
      </div>

      {/* Title and Action buttons - with updated page title typography */}
      <div className="flex items-center justify-between mb-6">
        <h1 style={pageTitleStyle}>Vendor Analytics</h1>
        <div className="flex items-center gap-3">
          <Link href="/vendor-insights">
            <Button className="flex items-center gap-2 bg-[#5751F9] hover:bg-[#4A45E8] text-white">
              <BarChart3 className="h-4 w-4" />
              Deep Analytics
            </Button>
          </Link>
          <Button variant="outline" className="flex items-center gap-2 text-gray-900" style={exportButtonStyle}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation tabs={["Vendors", "Roles"]} activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  )
}
