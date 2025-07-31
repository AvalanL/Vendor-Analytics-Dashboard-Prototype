import { Button } from "@/components/ui/button"
import { Download, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { TabNavigation } from "./tab-navigation"

interface DeepAnalyticsHeaderProps {
  analyticsView: string
  onViewChange: (view: string) => void
}

export function DeepAnalyticsHeader({ analyticsView, onViewChange }: DeepAnalyticsHeaderProps) {
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

  const breadcrumbTextStyle = {
    color: "#1A1C1C",
    fontFamily: '"Work Sans", sans-serif',
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "143%",
  }

  return (
    <div className="mb-6">
      <div className="mb-2">
        <Link href="/" style={breadcrumbStyle}>
          Acme
        </Link>
        <span style={breadcrumbTextStyle} className="mx-1">
          /
        </span>
        <Link href="/" style={breadcrumbStyle}>
          Vendors
        </Link>
        <span style={breadcrumbTextStyle} className="mx-1">
          /
        </span>
        <span style={breadcrumbTextStyle}>Deep Analytics</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 style={pageTitleStyle}>Vendor Deep Analytics</h1>
        </div>
        <Button variant="outline" className="flex items-center gap-2 text-gray-900">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Tab navigation handled by main page */}
    </div>
  )
}