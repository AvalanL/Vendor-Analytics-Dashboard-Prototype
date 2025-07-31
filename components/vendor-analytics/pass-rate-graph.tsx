import { useState } from "react"
import { ChevronDown, ChevronUp, InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Helper function to generate 'nice' ticks for pass rate (0-100)
const generatePassRateTicks = (numTicks: number = 6): number[] => {
  // For pass rate, we want ticks from 0 to 100
  const interval = 100 / (numTicks - 1);
  const ticks: number[] = [];
  for (let i = 0; i < numTicks; i++) {
    ticks.push(Math.round(i * interval));
  }
  return ticks;
};

interface PassRateItem {
  name: string
  percentage: number
  count: number
}

interface PassRateGraphProps {
  items: PassRateItem[]
  overallPassRate: number
  itemType?: "vendor" | "role"
}

export function PassRateGraph({ items, overallPassRate, itemType = "vendor" }: PassRateGraphProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Header style
  const headerStyle = {
    color: "#888888",
    fontFamily: '"Work Sans", sans-serif',
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "143%",
    textTransform: "uppercase",
  }

  // Main value style - updated to match specifications
  const valueStyle = {
    color: "#000",
    fontFamily: "Satoshi, sans-serif",
    fontSize: "34px",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "118%",
  }

  // Name style - updated to match specifications
  const nameStyle = {
    color: "#1A1C1C",
    fontFamily: '"Work Sans", sans-serif',
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "143%",
  }

  // Volume style - for displaying volume on right
  const volumeStyle = {
    color: "#1A1C1C",
    fontFamily: '"Work Sans", sans-serif',
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "143%",
  }

  // Percentage style - for displaying pass rate percentage inside bars
  const percentageStyle = {
    color: "#1A1C1C",
    fontFamily: '"Work Sans", sans-serif',
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "143%",
  }

  // X-axis label style
  const xAxisLabelStyle = {
    color: "#5C5E5E",
    fontFamily: '"Work Sans", sans-serif',
    fontSize: "12px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "134%",
  }

  // Generate pass rate ticks (0-100)
  const passRateTicks = generatePassRateTicks();

  // Sort items by pass rate in descending order (highest first)
  const sortedItems = [...items].sort((a, b) => b.percentage - a.percentage);

  // Show only top 5 items when collapsed, all items when expanded
  const displayItems = isExpanded ? sortedItems : sortedItems.slice(0, 5);
  
  // Check if we have more than 5 items to show the expand button
  const hasMoreItems = sortedItems.length > 5;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      {/* Header Section */}
      <div className="mb-4">
        <span style={headerStyle}>Overall Pass Rate %</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="ml-1 h-4 w-4 text-gray-400 inline-block align-text-bottom" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Percentage of candidates who passed the interview</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="mb-4">
        <div style={valueStyle}>{overallPassRate}%</div>
      </div>
      <div className="h-px w-full bg-gray-100 mb-3"></div>

      {/* Chart Area */}
      <div className="space-y-6">
        {displayItems.map((item, index) => {
          // Bar width is based on pass rate percentage (0-100)
          const barWidth = item.percentage;

          return (
            <div key={index} className="flex items-center">
              {/* Vendor Name */}
              <span style={nameStyle} className="min-w-[180px] text-left mr-6">
                {item.name}
              </span>
              
              {/* Progress Bar Container */}
              <div className="flex-1 relative mr-6">
                <div className="flex items-center">
                  <div className="h-2" style={{ width: `${barWidth}%`, backgroundColor: "#4CAF50" }} />
                  <span style={percentageStyle} className="ml-4">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              {/* Volume */}
              <div style={volumeStyle} className="text-right min-w-[80px]">
                {item.count.toLocaleString()}
              </div>
            </div>
          )
        })}
      </div>

      {/* Expand/Collapse Button */}
      {hasMoreItems && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isExpanded ? (
              <>
                <span>View Less</span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>View All ({sortedItems.length})</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Axis Labels */}
      <div className="mt-6">
        <div className="flex">
          <div className="min-w-[180px] mr-6" style={xAxisLabelStyle}>
            Pass Rate (%)
          </div>
          <div className="flex-1 flex justify-between mr-6">
            {passRateTicks.map((tick, index) => (
              <div key={index} style={xAxisLabelStyle}>
                {tick}%
              </div>
            ))}
          </div>
          <div style={xAxisLabelStyle} className="min-w-[80px] text-right">
            Volume
          </div>
        </div>
      </div>
    </div>
  )
}
