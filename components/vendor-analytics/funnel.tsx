"use client"

import { useState } from "react"
import { funnelStages, roles, allVendors } from "@/lib/dummy-data"
import { scaleFunnelData, filterVendorsByRole } from "@/lib/filter-utils"

interface FunnelProps {
  selectedPeriod: string
  selectedVendor: string
  selectedRole: string
}

export function Funnel({ selectedPeriod, selectedVendor, selectedRole }: FunnelProps) {
  // State to track which card is selected
  const [selectedCard, setSelectedCard] = useState<number | null>(null)

  // Apply role filtering to adjust funnel data
  let funnelMultiplier = 1.0

  // If a role is selected, scale the funnel data based on the proportion of vendors in that role
  if (selectedRole && selectedRole !== "All Roles") {
    const roleFilteredVendors = filterVendorsByRole(allVendors, roles, selectedRole)
    funnelMultiplier = roleFilteredVendors.length / allVendors.length
    // Ensure multiplier is not too small
    funnelMultiplier = Math.max(funnelMultiplier, 0.2)
  }

  // Scale funnel data based on selected time period
  const scaledFunnelStages = scaleFunnelData(funnelStages, selectedPeriod).map((stage) => ({
    ...stage,
    count: Math.round(stage.count * funnelMultiplier),
  }))

  // Function to handle card click
  const handleCardClick = (index: number) => {
    setSelectedCard(index === selectedCard ? null : index)
  }

  return (
    <div className="mb-6 w-full box-border">
      <div className="mb-4 flex items-center">
        <h2 className="text-lg font-semibold">Active Funnel</h2>
      </div>
      <div className="rounded-lg border border-[#E5E7EB] shadow-sm overflow-hidden box-border">
        {/* Funnel Grid - Responsive with horizontal scroll on smaller screens */}
        <div className="flex overflow-x-auto divide-x divide-[#E5E7EB] box-border">
          {scaledFunnelStages.map((stage, index) => (
            <div
              key={index}
              className={`flex flex-col h-[200px] min-w-[200px] md:min-w-0 md:w-[20%] justify-between box-border cursor-pointer transition-all duration-200 ${
                selectedCard === index ? "" : "hover:bg-[#EFEEFF]"
              }`}
              onClick={() => handleCardClick(index)}
              style={
                selectedCard === index
                  ? {
                      background: "linear-gradient(90deg, #4864F0 0%, #06B6C6 99.79%)",
                    }
                  : {}
              }
            >
              {/* Bottom component: Content section (aligned at bottom) */}
              <div className="px-4 pt-4 pb-4 box-border relative h-full flex flex-col justify-end">
                {/* Title with specified styling */}
                <h3
                  className={`mb-8 box-border ${selectedCard === index ? "text-white" : "text-[#1A1C1C]"}`}
                  style={{
                    fontFamily: "Satoshi, sans-serif",
                    fontSize: "20px",
                    fontWeight: 500,
                    lineHeight: "140%",
                  }}
                >
                  {stage.name}
                </h3>

                {/* Left column: Count and Average days */}
                <div className="box-border">
                  {/* Numbers with specified styling */}
                  <div
                    className={`mb-1 box-border ${selectedCard === index ? "text-white" : "text-black"}`}
                    style={{
                      fontFamily: "Satoshi, sans-serif",
                      fontSize: "34px",
                      fontWeight: 700,
                      lineHeight: "118%",
                    }}
                  >
                    {stage.count.toLocaleString()}
                  </div>
                  {/* Average days with specified styling */}
                  <div
                    className={`box-border ${selectedCard === index ? "text-white" : "text-black"}`}
                    style={{
                      fontFamily: '"Work Sans", sans-serif',
                      fontSize: "12px",
                      fontWeight: 400,
                      lineHeight: "134%",
                    }}
                  >
                    Avg. {stage.avgDays} days
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
