import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Helper function to generate 'nice' ticks for an axis
const generateAxisTicks = (maxValue: number, numTicks: number = 5): { ticks: number[], maxBound: number } => {
  if (maxValue <= 0) return { ticks: [0], maxBound: 10 }; // Handle zero/negative case

  // Calculate a rough interval
  const roughInterval = maxValue / (numTicks - 1);

  // Find a 'nice' interval (e.g., 1, 2, 5, 10, 20, 50, 100, ...)
  const exponent = Math.floor(Math.log10(roughInterval));
  const fraction = roughInterval / Math.pow(10, exponent);

  let niceInterval;
  if (fraction <= 1) niceInterval = Math.pow(10, exponent);
  else if (fraction <= 2) niceInterval = 2 * Math.pow(10, exponent);
  else if (fraction <= 5) niceInterval = 5 * Math.pow(10, exponent);
  else niceInterval = 10 * Math.pow(10, exponent);

  // Calculate the upper bound and generate ticks
  const maxBound = Math.ceil(maxValue / niceInterval) * niceInterval;
  const ticks: number[] = [];
  for (let i = 0; i * niceInterval <= maxBound; i++) {
    ticks.push(i * niceInterval);
  }
  // Ensure the upper bound is slightly more than max value if ticks are too few initially
  if (ticks.length < 2 && maxValue > 0) {
     const adjustedMaxBound = Math.ceil(maxValue / 1) * 1; // Adjust for small max values
     // Ensure at least 0 and the adjusted bound are present
     const finalTicks = [0];
     if(adjustedMaxBound > 0) finalTicks.push(adjustedMaxBound);
     return { ticks: [...new Set(finalTicks)].sort((a, b) => a - b), maxBound: adjustedMaxBound || 10 };
  }
  
  return { ticks, maxBound };
};

interface PlacementItem {
  name: string
  count: number
}

interface PlacementsGraphProps {
  items: PlacementItem[]
  totalPlacements: number
  itemType?: "vendor" | "role"
}

export function PlacementsGraph({ items, totalPlacements, itemType = "vendor" }: PlacementsGraphProps) {
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

  // Count style - updated to match specifications
  const countStyle = {
    color: "#1A1C1C",
    fontFamily: '"Work Sans", sans-serif',
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 700,
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

  // Find the actual maximum count from the data
  const actualMaxCount = Math.max(...items.map((item) => item.count), 0);

  // Generate dynamic ticks and the upper bound for the axis scale
  const { ticks: xTicks, maxBound: dynamicMaxCount } = generateAxisTicks(actualMaxCount);

  // Use the dynamic upper bound for scaling bars
  const maxCount = dynamicMaxCount > 0 ? dynamicMaxCount : 1; // Prevent division by zero if max is 0

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4">
        <span style={headerStyle}>Overall Placements</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="ml-1 h-4 w-4 text-gray-400 inline-block align-text-bottom" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Total number of candidates placed</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="mb-4">
        <div style={valueStyle}>{totalPlacements}</div>
      </div>
      <div className="h-px w-full bg-gray-100 mb-3"></div>
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <span style={nameStyle} className="min-w-[180px] mr-1">
              {item.name}
            </span>
            <div className="flex-1 relative">
              <div className="flex items-center">
                <div
                  className="h-2"
                  style={{
                    // Use dynamic maxCount for scaling
                    width: `${(item.count / maxCount) * 100}%`, 
                    background: "linear-gradient(90deg, #06B6C6 0%, #5751F9 100%)",
                  }}
                />
                <span style={countStyle} className="ml-4">
                  {item.count.toLocaleString()}
                </span>
              </div>
            </div>
             {/* Spacer to align with counts next to bars */}
            <div className="min-w-[40px]"></div> 
          </div>
        ))}
      </div>
      <div className="mt-6">
        <div className="flex">
           {/* Align label using the same structure as items above */}
           <div className="min-w-[180px] mr-1" style={xAxisLabelStyle}>
            Placed Candidates
           </div>
          <div className="flex-1 flex justify-between">
            {/* Render dynamic ticks */}
            {xTicks.map((tick, index) => (
              <div key={index} style={xAxisLabelStyle}>
                {tick.toLocaleString()}
              </div>
            ))}
          </div>
           {/* Spacer to align with counts next to bars */}
          <div className="ml-4 min-w-[40px]"></div>
        </div>
      </div>
    </div>
  )
}
