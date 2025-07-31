// Shared dummy data for the entire application

// --- Interfaces ---

// Rate card interface for vendor pricing
export interface RateCard {
  vendorId: string
  roleCategory: string // e.g., "Senior Engineer", "Junior Developer"
  region: string
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD"
  hourlyRate?: number // For contract roles
  placementFee: number // Fixed fee per successful placement
  interviewFee: number // Fee per interview conducted
  volume: number // Expected monthly volume
  tier: "Premium" | "Standard" | "Budget"
  effectiveDate: Date
  discountThreshold?: number // Volume threshold for discounts
  discountRate?: number // Percentage discount after threshold
}

// Geographic performance data
export interface GeographicData {
  region: string
  country: string
  city?: string
  costOfLiving: number // Index relative to baseline (100 = baseline)
  timezone: string
  language: string[]
  marketMaturity: "Emerging" | "Developing" | "Mature"
  talentAvailability: "Low" | "Medium" | "High"
  averageSalary: number // In USD for comparison
  competitionLevel: "Low" | "Medium" | "High"
}

// Interface for a single point in the time series data
export interface TimeSeriesDataPoint {
  periodLabel: string // e.g., "2024-01", "Jan '24"
  date: Date
  volume: number
  passRate: number
  timeInProcess: number
  noShows: number
  integrityFlag: number
  placements: number
  interviewsPerPlacement: number
}

// Vendor data
export interface Vendor {
  id: string
  name: string
  status: "Active" | "Inactive" | "Pending"
  volume: number // Total candidates interviewed (unscaled, base for 30 days)
  passRate: number // % (passTotal / volume)
  passTotal: number // Candidates passed (unscaled)
  timeInProcess: number // Average days
  timeAverage: string // Placeholder text
  noShows: number // % (noShowsTotal / volume, representing late cancels/no-shows rate)
  noShowsTotal: number // Total no-shows (unscaled)
  integrityFlag: number // % (integrityTotal / volume, representing integrity issues rate)
  integrityTotal: number // Total integrity flags (unscaled)
  placements: number // Actual placements (unscaled)
  placementsTotal: number // Target/capacity placements (unscaled, slightly > placements)
  interviewsPerPlacement: number // Calculated: volume / placements
  interviewsPercentage: number // Placeholder, maybe % of interviews leading to placement?
  timeSeriesData?: TimeSeriesDataPoint[] // Optional array for historical data
  // Cost and geographic data
  primaryRegions: string[] // Main operating regions
  costPerHire: number // Average cost per successful placement
  costPerInterview: number // Average cost per interview
  tier: "Premium" | "Standard" | "Budget"
  rateCards?: RateCard[] // Associated rate cards
}

// Role data
export interface Role {
  id: string
  name: string
  location: string
  vendors: Vendor[]
}

// Funnel stage data
export interface FunnelStage {
  name: string
  count: number // Unscaled base count (e.g., for 30 days)
  avgDays: number
  percentage: number | null
  bgClass: string
  progressColor: string
  height: string
}

// --- Helper Function to Generate Time Series Data ---

// Function to get the week number of a date
const getWeekNumber = (d: Date): number => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate the week number
    // Corrected type casting for arithmetic operation
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
    return weekNo;
}

const generateTimeSeriesData = (baseVendor: Vendor): TimeSeriesDataPoint[] => {
  const data: TimeSeriesDataPoint[] = [];
  const now = new Date();
  const WEEKS_TO_GENERATE = 16; // Generate data for the past ~4 months (covers 90 days)

  for (let i = WEEKS_TO_GENERATE - 1; i >= 0; i--) {
    // Calculate the date for the start of the week (e.g., Sunday)
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - (i * 7));
    
    // Create a label like "Wk 28 '24"
    const weekNum = getWeekNumber(date);
    const yearLabel = date.getFullYear().toString().slice(-2);
    const periodLabel = `Wk ${weekNum} '${yearLabel}`;

    // Introduce some variation and trend simulation (adjusted for weekly view)
    const trendFactor = (WEEKS_TO_GENERATE - i) / WEEKS_TO_GENERATE; // Trend over the generated weeks
    const randomFactor = 0.9 + Math.random() * 0.2; // Reduced randomness for weekly view (+/- 10%)

    const volume = Math.max(0, Math.round((baseVendor.volume / 4) * trendFactor * randomFactor)); // Adjust base volume to weekly estimate
    const passRate = Math.max(0, Math.min(100, Math.round(baseVendor.passRate * (0.95 + Math.random() * 0.1)))); // +/- 5% randomness
    const timeInProcess = Math.max(1, Math.round(baseVendor.timeInProcess * (0.9 + Math.random() * 0.2)));
    const noShows = Math.max(0, Math.min(100, Math.round(baseVendor.noShows * (0.9 + Math.random() * 0.2))));
    const integrityFlag = Math.max(0, Math.min(100, Math.round(baseVendor.integrityFlag * (0.85 + Math.random() * 0.3))));
    // Adjust base placements to weekly estimate & correlate
    const placements = Math.max(0, Math.round((baseVendor.placements / 4) * trendFactor * randomFactor * (passRate / baseVendor.passRate))); 
    const interviewsPerPlacement = placements > 0 ? Math.round(volume / placements) : Infinity;

    data.push({
      periodLabel,
      date,
      volume,
      passRate,
      timeInProcess,
      noShows,
      integrityFlag,
      placements,
      interviewsPerPlacement,
    });
  }
  return data;
};

// --- Base Vendor Definitions (Raw Data Before Calculations) ---
// Using a separate array for raw definitions before mapping/calculations
const baseVendorsRaw: Omit<Vendor, 'passTotal' | 'noShowsTotal' | 'integrityTotal' | 'placementsTotal' | 'interviewsPerPlacement' | 'interviewsPercentage' | 'timeSeriesData' | 'costPerHire' | 'costPerInterview' | 'rateCards'>[] = [
  // Top Tier - Premium vendors (High Volume)
  { id: "v6", name: "TechFlow Global", status: "Active", volume: 2850, passRate: 43, placements: 285, timeInProcess: 4, timeAverage: "avg", noShows: 2, integrityFlag: 8, primaryRegions: ["North America", "Europe"], tier: "Premium" },
  { id: "v16", name: "CodeCraft Solutions", status: "Active", volume: 2650, passRate: 45, placements: 310, timeInProcess: 3, timeAverage: "avg", noShows: 1, integrityFlag: 5, primaryRegions: ["North America", "Europe", "Asia Pacific"], tier: "Premium" },
  { id: "v7", name: "DataBridge Systems", status: "Active", volume: 2400, passRate: 18, placements: 240, timeInProcess: 5, timeAverage: "avg", noShows: 3, integrityFlag: 12, primaryRegions: ["Asia Pacific", "North America"], tier: "Standard" },

  // High Volume - Standard vendors
  { id: "v8", name: "NextGen Technologies", status: "Active", volume: 2250, passRate: 40, placements: 220, timeInProcess: 4, timeAverage: "avg", noShows: 2, integrityFlag: 9, primaryRegions: ["North America", "Europe"], tier: "Premium" },
  { id: "v12", name: "CloudTech Partners", status: "Active", volume: 2150, passRate: 22, placements: 215, timeInProcess: 4, timeAverage: "avg", noShows: 3, integrityFlag: 11, primaryRegions: ["Asia Pacific", "North America"], tier: "Standard" },
  { id: "v10", name: "DevCore Systems", status: "Active", volume: 1950, passRate: 19, placements: 195, timeInProcess: 5, timeAverage: "avg", noShows: 2, integrityFlag: 8, primaryRegions: ["Europe", "North America"], tier: "Standard" },
  { id: "v9", name: "InnovateTech Hub", status: "Active", volume: 1850, passRate: 16, placements: 175, timeInProcess: 4, timeAverage: "avg", noShows: 3, integrityFlag: 10, primaryRegions: ["Asia Pacific", "Europe"], tier: "Standard" },
  { id: "v11", name: "TechSphere Global", status: "Active", volume: 1750, passRate: 14, placements: 160, timeInProcess: 5, timeAverage: "avg", noShows: 4, integrityFlag: 13, primaryRegions: ["North America", "Asia Pacific"], tier: "Standard" },

  // Mid Volume - Premium efficiency vendors
  { id: "v1", name: "EliteCode Partners", status: "Active", volume: 1650, passRate: 37, placements: 180, timeInProcess: 3, timeAverage: "avg", noShows: 1, integrityFlag: 6, primaryRegions: ["North America"], tier: "Premium" },
  { id: "v5", name: "DevElite Solutions", status: "Active", volume: 1550, passRate: 41, placements: 190, timeInProcess: 4, timeAverage: "avg", noShows: 1, integrityFlag: 3, primaryRegions: ["North America"], tier: "Premium" },
  { id: "v20", name: "TechPro Systems", status: "Active", volume: 1450, passRate: 38, placements: 200, timeInProcess: 3, timeAverage: "avg", noShows: 1, integrityFlag: 2, primaryRegions: ["Europe", "North America"], tier: "Premium" },
  { id: "v28", name: "CodeCrafters Elite", status: "Active", volume: 1350, passRate: 42, placements: 205, timeInProcess: 3, timeAverage: "avg", noShows: 1, integrityFlag: 2, primaryRegions: ["Europe"], tier: "Premium" },
  { id: "v30", name: "DevStream Global", status: "Active", volume: 1250, passRate: 44, placements: 210, timeInProcess: 3, timeAverage: "avg", noShows: 1, integrityFlag: 1, primaryRegions: ["Latin America"], tier: "Premium" },
  { id: "v13", name: "TechBridge Solutions", status: "Active", volume: 1450, passRate: 25, placements: 165, timeInProcess: 4, timeAverage: "avg", noShows: 2, integrityFlag: 7, primaryRegions: ["Asia Pacific", "North America"], tier: "Standard" },
  { id: "v19", name: "SystemsCore Ltd", status: "Active", volume: 1350, passRate: 21, placements: 140, timeInProcess: 5, timeAverage: "avg", noShows: 3, integrityFlag: 9, primaryRegions: ["North America", "Europe"], tier: "Standard" },
  { id: "v21", name: "DevForce International", status: "Active", volume: 1250, passRate: 33, placements: 155, timeInProcess: 4, timeAverage: "avg", noShows: 2, integrityFlag: 6, primaryRegions: ["Latin America", "North America"], tier: "Standard" },
  { id: "v29", name: "CodeFlow Systems", status: "Active", volume: 1150, passRate: 35, placements: 150, timeInProcess: 4, timeAverage: "avg", noShows: 2, integrityFlag: 5, primaryRegions: ["Asia Pacific"], tier: "Standard" },
  { id: "v2", name: "TechStorm Solutions", status: "Active", volume: 1100, passRate: 12, placements: 85, timeInProcess: 5, timeAverage: "avg", noShows: 4, integrityFlag: 18, primaryRegions: ["North America"], tier: "Budget" },
  { id: "v3", name: "QuickDev Partners", status: "Active", volume: 950, passRate: 10, placements: 65, timeInProcess: 3, timeAverage: "avg", noShows: 6, integrityFlag: 22, primaryRegions: ["North America"], tier: "Budget" },
  { id: "v14", name: "TechOps Global", status: "Active", volume: 1300, passRate: 15, placements: 110, timeInProcess: 5, timeAverage: "avg", noShows: 4, integrityFlag: 15, primaryRegions: ["Asia Pacific", "North America"], tier: "Budget" },
  { id: "v15", name: "DevTech Solutions", status: "Active", volume: 1200, passRate: 13, placements: 105, timeInProcess: 5, timeAverage: "avg", noShows: 4, integrityFlag: 16, primaryRegions: ["Asia Pacific"], tier: "Budget" },
  { id: "v17", name: "TechSync Corp", status: "Active", volume: 1100, passRate: 11, placements: 85, timeInProcess: 6, timeAverage: "avg", noShows: 7, integrityFlag: 20, primaryRegions: ["North America", "Europe"], tier: "Budget" },
  { id: "v22", name: "CodeBridge Systems", status: "Active", volume: 1050, passRate: 28, placements: 115, timeInProcess: 4, timeAverage: "avg", noShows: 3, integrityFlag: 12, primaryRegions: ["Asia Pacific"], tier: "Standard" },
  { id: "v24", name: "TechPrecision Ltd", status: "Active", volume: 950, passRate: 39, placements: 130, timeInProcess: 3, timeAverage: "avg", noShows: 1, integrityFlag: 3, primaryRegions: ["Europe", "Asia Pacific"], tier: "Premium" },
  { id: "v25", name: "DevCore International", status: "Active", volume: 900, passRate: 23, placements: 95, timeInProcess: 4, timeAverage: "avg", noShows: 3, integrityFlag: 8, primaryRegions: ["North America", "Asia Pacific"], tier: "Standard" },
  { id: "v26", name: "TechFlow Partners", status: "Active", volume: 850, passRate: 17, placements: 80, timeInProcess: 5, timeAverage: "avg", noShows: 5, integrityFlag: 17, primaryRegions: ["Asia Pacific"], tier: "Budget" },
  { id: "v27", name: "CodeCraft Elite", status: "Active", volume: 800, passRate: 40, placements: 120, timeInProcess: 3, timeAverage: "avg", noShows: 1, integrityFlag: 2, primaryRegions: ["Europe"], tier: "Premium" },

  // Inactive / Pending Vendors
  { id: "v4", name: "TechTalent Pro", status: "Inactive", volume: 750, passRate: 29, placements: 85, timeInProcess: 4, timeAverage: "avg", noShows: 3, integrityFlag: 8, primaryRegions: ["North America"], tier: "Standard" },
  { id: "v18", name: "SystemsDev Corp", status: "Pending", volume: 1000, passRate: 26, placements: 95, timeInProcess: 4, timeAverage: "avg", noShows: 4, integrityFlag: 14, primaryRegions: ["North America", "Europe"], tier: "Standard" },
  { id: "v23", name: "TechSolutions Global", status: "Pending", volume: 1200, passRate: 31, placements: 125, timeInProcess: 4, timeAverage: "avg", noShows: 2, integrityFlag: 7, primaryRegions: ["North America"], tier: "Premium" },
]

// --- Processed Vendors with Calculations and Time Series Data ---
const vendors: Vendor[] = baseVendorsRaw.map(baseVendor => {
  const vendor = { ...baseVendor } as Vendor // Cast to Vendor type initially

  // Perform calculations (ensure values exist)
  vendor.passTotal = Math.round((vendor.volume || 0) * ((vendor.passRate || 0) / 100))
  vendor.placements = vendor.placements ?? 0
  vendor.timeInProcess = vendor.timeInProcess ?? Math.round(6 + Math.random() * 4)
  vendor.timeAverage = vendor.timeAverage ?? "avg"
  vendor.noShows = vendor.noShows ?? Math.round(5 + Math.random() * 10)
  vendor.noShowsTotal = Math.round((vendor.volume || 0) * ((vendor.noShows || 10) / 100))
  vendor.integrityFlag = vendor.integrityFlag ?? Math.round(1 + Math.random() * 5)
  vendor.integrityTotal = Math.round((vendor.volume || 0) * ((vendor.integrityFlag || 3) / 100))
  vendor.placementsTotal = vendor.placements + Math.ceil(vendor.placements * 0.1) + 1
  vendor.interviewsPerPlacement = vendor.placements > 0 ? Math.round((vendor.volume || 0) / vendor.placements) : Infinity
  vendor.interviewsPercentage = (vendor.volume || 0) > 0 ? Math.round((vendor.placements / (vendor.volume || 1)) * 100) : 0

  // Calculate cost metrics based on tier
  const baseCostPerInterview = vendor.tier === "Premium" ? 180 : vendor.tier === "Standard" ? 150 : 120
  const baseCostPerHire = vendor.tier === "Premium" ? 8500 : vendor.tier === "Standard" ? 6500 : 4500
  
  // Add regional cost modifiers
  const regionMultiplier = vendor.primaryRegions.includes("North America") ? 1.2 : 
                          vendor.primaryRegions.includes("Europe") ? 1.1 :
                          vendor.primaryRegions.includes("Asia Pacific") ? 0.8 : 
                          vendor.primaryRegions.includes("Latin America") ? 0.7 : 1.0
  
  vendor.costPerInterview = Math.round(baseCostPerInterview * regionMultiplier)
  vendor.costPerHire = Math.round(baseCostPerHire * regionMultiplier)

  // Generate time series data only for active vendors
  if (vendor.status === 'Active') {
    vendor.timeSeriesData = generateTimeSeriesData(vendor)
  } else {
    vendor.timeSeriesData = [] // Empty array for inactive/pending
  }

  return vendor
})

// Helper function to get vendor by ID (accessing the final processed vendors array)
const getVendor = (id: string): Vendor | undefined => vendors.find(v => v.id === id)

// --- Re-create role instances with potentially updated vendor references ---
export const roles: Role[] = [
  // Senior Level Positions
  { id: "r1", name: "Senior Backend Engineer", location: "United Kingdom", vendors: [getVendor("v1"), getVendor("v6"), getVendor("v10"), getVendor("v20")].filter(Boolean) as Vendor[] },
  { id: "r2", name: "Senior Frontend Engineer", location: "United States", vendors: [getVendor("v5"), getVendor("v16"), getVendor("v20"), getVendor("v28")].filter(Boolean) as Vendor[] },
  { id: "r3", name: "Senior Software Engineer", location: "Brazil", vendors: [getVendor("v6"), getVendor("v16"), getVendor("v21"), getVendor("v30")].filter(Boolean) as Vendor[] },
  { id: "r4", name: "Senior Full Stack Engineer", location: "Germany", vendors: [getVendor("v8"), getVendor("v24"), getVendor("v27"), getVendor("v28")].filter(Boolean) as Vendor[] },
  { id: "r5", name: "Senior DevOps Engineer", location: "United States", vendors: [getVendor("v5"), getVendor("v8"), getVendor("v16"), getVendor("v23")].filter(Boolean) as Vendor[] },

  // Staff/Principal Level Positions
  { id: "r6", name: "Staff Software Engineer", location: "Singapore", vendors: [getVendor("v6"), getVendor("v9"), getVendor("v16"), getVendor("v28")].filter(Boolean) as Vendor[] },
  { id: "r7", name: "Principal Software Engineer", location: "Australia", vendors: [getVendor("v8"), getVendor("v11"), getVendor("v20"), getVendor("v29")].filter(Boolean) as Vendor[] },
  { id: "r8", name: "Staff Backend Engineer", location: "Canada", vendors: [getVendor("v1"), getVendor("v19"), getVendor("v25"), getVendor("v27")].filter(Boolean) as Vendor[] },

  // Mid-Level Positions
  { id: "r9", name: "Mid-Level Software Engineer", location: "Poland", vendors: [getVendor("v13"), getVendor("v20"), getVendor("v27"), getVendor("v28")].filter(Boolean) as Vendor[] },
  { id: "r10", name: "Mid-Level Frontend Engineer", location: "Netherlands", vendors: [getVendor("v10"), getVendor("v24"), getVendor("v27"), getVendor("v28")].filter(Boolean) as Vendor[] },
  { id: "r11", name: "Mid-Level Backend Engineer", location: "Ukraine", vendors: [getVendor("v9"), getVendor("v27"), getVendor("v28"), getVendor("v29")].filter(Boolean) as Vendor[] },
  { id: "r12", name: "Full Stack Engineer", location: "Argentina", vendors: [getVendor("v21"), getVendor("v30"), getVendor("v11"), getVendor("v25")].filter(Boolean) as Vendor[] },

  // Junior Level Positions
  { id: "r13", name: "Junior Software Engineer", location: "Canada", vendors: [getVendor("v2"), getVendor("v15"), getVendor("v19"), getVendor("v25")].filter(Boolean) as Vendor[] },
  { id: "r14", name: "Junior Frontend Engineer", location: "India", vendors: [getVendor("v7"), getVendor("v12"), getVendor("v14"), getVendor("v22")].filter(Boolean) as Vendor[] },
  { id: "r15", name: "Junior Backend Engineer", location: "Philippines", vendors: [getVendor("v14"), getVendor("v22"), getVendor("v26"), getVendor("v29")].filter(Boolean) as Vendor[] },
  { id: "r16", name: "Entry Level Software Engineer", location: "Vietnam", vendors: [getVendor("v15"), getVendor("v22"), getVendor("v26"), getVendor("v3")].filter(Boolean) as Vendor[] },

  // Specialized Positions
  { id: "r17", name: "DevOps Engineer", location: "Ireland", vendors: [getVendor("v5"), getVendor("v8"), getVendor("v10"), getVendor("v19")].filter(Boolean) as Vendor[] },
  { id: "r18", name: "Data Scientist", location: "Germany", vendors: [getVendor("v9"), getVendor("v19"), getVendor("v24"), getVendor("v27")].filter(Boolean) as Vendor[] },
  { id: "r19", name: "Machine Learning Engineer", location: "France", vendors: [getVendor("v6"), getVendor("v10"), getVendor("v16"), getVendor("v24")].filter(Boolean) as Vendor[] },
  { id: "r20", name: "Site Reliability Engineer", location: "Sweden", vendors: [getVendor("v5"), getVendor("v8"), getVendor("v27"), getVendor("v28")].filter(Boolean) as Vendor[] },
  { id: "r21", name: "Mobile App Developer", location: "Spain", vendors: [getVendor("v21"), getVendor("v24"), getVendor("v28"), getVendor("v30")].filter(Boolean) as Vendor[] },
  { id: "r22", name: "Cloud Engineer", location: "Japan", vendors: [getVendor("v9"), getVendor("v11"), getVendor("v13"), getVendor("v29")].filter(Boolean) as Vendor[] },
]

// Export all vendors (the processed array)
export const allVendors = vendors

// --- Adjusted Funnel Stages to align with new base volume (~45000) & pass rate (~27%) ---
const BASE_INTERVIEWS = 45000; // Target base volume for active vendors
export const funnelStages: FunnelStage[] = [
  { name: "Invited", count: Math.round(BASE_INTERVIEWS / 0.75), avgDays: 3, percentage: 100, bgClass: "bg-[#EFEEFF]", progressColor: "#EFEEFF", height: "h-24" }, // ~60000 invited assuming 75% make it to interview
  { name: "Karat Interview", count: BASE_INTERVIEWS, avgDays: 7, percentage: 75, bgClass: "bg-[#C0BEFF]", progressColor: "#C0BEFF", height: "h-20" }, // ~45000 interviews
  { name: "Onsite", count: Math.round(BASE_INTERVIEWS * 0.27), avgDays: 20, percentage: 27, bgClass: "bg-[#8A86FB]", progressColor: "#8A86FB", height: "h-16" },    // 27% pass rate (matches overall target) -> ~12150
  { name: "Offers", count: Math.round(BASE_INTERVIEWS * 0.27 * 0.80), avgDays: 9, percentage: 80, bgClass: "bg-[#5751F9]", progressColor: "#5751F9", height: "h-12" }, // 80% offer rate -> ~9720 offers
  { name: "Placed", count: Math.round(BASE_INTERVIEWS * 0.27 * 0.80 * 0.70), avgDays: 6, percentage: null, bgClass: "bg-[#5751F9]", progressColor: "#5751F9", height: "h-8" }, // 70% accept rate -> ~6804 placements (base)
]


// --- Recalculate overall metrics and top vendor lists ---

const activeVendors = vendors.filter(v => v.status === 'Active');

// Calculate overall pass rate based on ALL active vendors
export const totalInterviews = activeVendors.reduce((sum, v) => sum + v.volume, 0); // Base total volume
export const totalPasses = activeVendors.reduce((sum, v) => sum + v.passTotal, 0); // Base total passed
export const overallPassRate = totalInterviews > 0 ? Math.round((totalPasses / totalInterviews) * 100) : 0;

// Calculate total placements based on ALL active vendors (unscaled base number)
export const totalPlacements = activeVendors.reduce((sum, v) => sum + v.placements, 0);

// Verify totals:
// console.log(`Base Total Interviews: ${totalInterviews}`); // Should be ~45000
// console.log(`Overall Pass Rate: ${overallPassRate}%`); // Should be ~27%
// console.log(`Base Total Placements: ${totalPlacements}`); // Should be ~6800

// Re-generate top 10 vendor lists based on new data
const activeVendorsSortedByVolume = [...activeVendors]
  .sort((a, b) => b.volume - a.volume);

export const passRateVendors = activeVendorsSortedByVolume.slice(0, 10).map(v => ({
  name: v.name,
  percentage: v.passRate,
  count: v.volume, // Use base volume for the bar length in pass rate graph
}));

export const placementsVendors = [...activeVendors]
  .sort((a, b) => b.placements - a.placements) // Sort by placements for this list
  .slice(0, 10)
  .map(v => ({
    name: v.name,
    count: v.placements, // Use base placements
  }));

// --- Geographic Data ---
export const geographicData: GeographicData[] = [
  { region: "North America", country: "United States", city: "San Francisco", costOfLiving: 150, timezone: "PST", language: ["English"], marketMaturity: "Mature", talentAvailability: "High", averageSalary: 165000, competitionLevel: "High" },
  { region: "North America", country: "United States", city: "Austin", costOfLiving: 110, timezone: "CST", language: ["English"], marketMaturity: "Mature", talentAvailability: "High", averageSalary: 140000, competitionLevel: "Medium" },
  { region: "North America", country: "Canada", city: "Toronto", costOfLiving: 120, timezone: "EST", language: ["English", "French"], marketMaturity: "Mature", talentAvailability: "Medium", averageSalary: 90000, competitionLevel: "Medium" },
  
  { region: "Europe", country: "United Kingdom", city: "London", costOfLiving: 140, timezone: "GMT", language: ["English"], marketMaturity: "Mature", talentAvailability: "High", averageSalary: 85000, competitionLevel: "High" },
  { region: "Europe", country: "Germany", city: "Berlin", costOfLiving: 105, timezone: "CET", language: ["German", "English"], marketMaturity: "Mature", talentAvailability: "High", averageSalary: 75000, competitionLevel: "Medium" },
  { region: "Europe", country: "Poland", city: "Krakow", costOfLiving: 60, timezone: "CET", language: ["Polish", "English"], marketMaturity: "Developing", talentAvailability: "High", averageSalary: 35000, competitionLevel: "Low" },
  
  { region: "Asia Pacific", country: "India", city: "Bangalore", costOfLiving: 35, timezone: "IST", language: ["English", "Hindi"], marketMaturity: "Mature", talentAvailability: "High", averageSalary: 25000, competitionLevel: "High" },
  { region: "Asia Pacific", country: "Singapore", costOfLiving: 130, timezone: "SGT", language: ["English"], marketMaturity: "Mature", talentAvailability: "Medium", averageSalary: 75000, competitionLevel: "High" },
  { region: "Asia Pacific", country: "Australia", city: "Sydney", costOfLiving: 115, timezone: "AEST", language: ["English"], marketMaturity: "Mature", talentAvailability: "Medium", averageSalary: 95000, competitionLevel: "Medium" },
  
  { region: "Latin America", country: "Brazil", city: "São Paulo", costOfLiving: 45, timezone: "BRT", language: ["Portuguese", "English"], marketMaturity: "Developing", talentAvailability: "Medium", averageSalary: 30000, competitionLevel: "Low" },
  { region: "Latin America", country: "Argentina", city: "Buenos Aires", costOfLiving: 40, timezone: "ART", language: ["Spanish", "English"], marketMaturity: "Developing", talentAvailability: "Medium", averageSalary: 25000, competitionLevel: "Low" }
];

// --- Rate Card Data ---
export const rateCards: RateCard[] = [
  // Premium vendors - Accenture
  { vendorId: "v6", roleCategory: "Senior Software Engineer", region: "North America", currency: "USD", placementFee: 12000, interviewFee: 220, volume: 30, tier: "Premium", effectiveDate: new Date("2024-01-01"), discountThreshold: 50, discountRate: 10 },
  { vendorId: "v6", roleCategory: "Senior Software Engineer", region: "Europe", currency: "EUR", placementFee: 10000, interviewFee: 180, volume: 25, tier: "Premium", effectiveDate: new Date("2024-01-01"), discountThreshold: 40, discountRate: 8 },
  { vendorId: "v6", roleCategory: "Junior Software Engineer", region: "North America", currency: "USD", placementFee: 8000, interviewFee: 150, volume: 20, tier: "Premium", effectiveDate: new Date("2024-01-01") },
  
  // Deloitte Consulting
  { vendorId: "v16", roleCategory: "Senior Software Engineer", region: "North America", currency: "USD", placementFee: 13500, interviewFee: 250, volume: 35, tier: "Premium", effectiveDate: new Date("2024-01-01"), discountThreshold: 60, discountRate: 12 },
  { vendorId: "v16", roleCategory: "Data Scientist", region: "North America", currency: "USD", placementFee: 15000, interviewFee: 280, volume: 20, tier: "Premium", effectiveDate: new Date("2024-01-01") },
  { vendorId: "v16", roleCategory: "DevOps Engineer", region: "Europe", currency: "EUR", placementFee: 11000, interviewFee: 200, volume: 15, tier: "Premium", effectiveDate: new Date("2024-01-01") },
  
  // TCS - Standard tier
  { vendorId: "v7", roleCategory: "Senior Software Engineer", region: "Asia Pacific", currency: "USD", placementFee: 6000, interviewFee: 120, volume: 40, tier: "Standard", effectiveDate: new Date("2024-01-01"), discountThreshold: 80, discountRate: 15 },
  { vendorId: "v7", roleCategory: "Junior Software Engineer", region: "Asia Pacific", currency: "USD", placementFee: 4000, interviewFee: 80, volume: 50, tier: "Standard", effectiveDate: new Date("2024-01-01"), discountThreshold: 100, discountRate: 20 },
  { vendorId: "v7", roleCategory: "Senior Software Engineer", region: "North America", currency: "USD", placementFee: 8500, interviewFee: 160, volume: 25, tier: "Standard", effectiveDate: new Date("2024-01-01") },
  
  // BairesDev - Premium efficiency
  { vendorId: "v30", roleCategory: "Senior Software Engineer", region: "Latin America", currency: "USD", placementFee: 7500, interviewFee: 140, volume: 30, tier: "Premium", effectiveDate: new Date("2024-01-01"), discountThreshold: 40, discountRate: 10 },
  { vendorId: "v30", roleCategory: "Full Stack Engineer", region: "Latin America", currency: "USD", placementFee: 6500, interviewFee: 120, volume: 25, tier: "Premium", effectiveDate: new Date("2024-01-01") },
  
  // EPAM Systems
  { vendorId: "v20", roleCategory: "Senior Software Engineer", region: "Europe", currency: "EUR", placementFee: 9000, interviewFee: 170, volume: 20, tier: "Premium", effectiveDate: new Date("2024-01-01") },
  { vendorId: "v20", roleCategory: "Frontend Engineer", region: "Europe", currency: "EUR", placementFee: 7000, interviewFee: 130, volume: 18, tier: "Premium", effectiveDate: new Date("2024-01-01") },
  
  // Budget tier examples
  { vendorId: "v2", roleCategory: "Junior Software Engineer", region: "North America", currency: "USD", placementFee: 4500, interviewFee: 100, volume: 15, tier: "Budget", effectiveDate: new Date("2024-01-01") },
  { vendorId: "v14", roleCategory: "Junior Software Engineer", region: "Asia Pacific", currency: "USD", placementFee: 3500, interviewFee: 80, volume: 30, tier: "Budget", effectiveDate: new Date("2024-01-01"), discountThreshold: 50, discountRate: 15 },
];

