export type RangeType = 'Essentials' | 'Expert';

export type ImportanceType = 'Must-have' | 'Nice-to-have';

export type PillarId = 
  | 'hd' 
  | 'hvhdf' 
  | 'personalization' 
  | 'digital' 
  | 'services' 
  | 'sustainability';

export interface PillarDefinition {
  id: PillarId;
  name: string;
  sheetName: string; // The 6 sheets in the FMC Excel
  shortName: string;
  tagline: string;
  description: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  accentHex: string;
  iconName: string;
  productIds: string[];
}

export type ProductGroup = 
  | 'HD Equipment' 
  | 'Disposables & Concentrates' 
  | 'Water & Hygiene' 
  | 'Digital Systems' 
  | 'Trading Goods' 
  | 'Services';

export type TradingGoodsCategory = 
  | 'Seating' 
  | 'Needles' 
  | 'Patient Preparation Sets' 
  | 'Syringes' 
  | 'Locking Solutions';

export interface ColumnDefinition {
  id: string;
  name: string;
  range: RangeType;
  importance: ImportanceType;
  pillar: PillarId;
  group?: ProductGroup;
  subCategory?: TradingGoodsCategory;
  subName?: string; // e.g. "ETC-1B", "PY-SOY", etc.
  description?: string;
}

export type ProductValues = Record<string, boolean>; // key: column id, value: true for 'Yes', false for 'No'

export interface RangeSummary {
  mustHaveTotal: number;
  mustHaveActive: number;
  niceToHaveTotal: number;
  niceToHaveActive: number;
  totalProducts: number;
  activeProducts: number;
  completeness: number; // 0 - 100%
  actionNeeded: boolean;
  missingMustHaves: string[];
}

export interface PillarScore {
  total: number;
  active: number;
  percentage: number;
  status: 'optimal' | 'moderate' | 'gap';
}

export type PillarScores = Record<PillarId, PillarScore>;

export interface MarketPortfolioData {
  id: string; // unique slug / iso code
  isoCode: string;
  country: string;
  region: string;
  values: ProductValues; // map of col id to boolean (Yes/No)
  essentials: RangeSummary;
  expert: RangeSummary;
  pillarScores: PillarScores;
  overallCompleteness: number;
  overallActionNeeded: boolean;
  notes?: string;
}

export type ViewMode = 
  | 'home'         // Main Landing page with universal search by Country, Region, Product & fast cards
  | 'cards'        // Prioritized Market Cards view
  | 'matrix'       // Full interactive spreadsheet matching the sheet with sorting & advanced filtering
  | 'heatmap'      // Heatmap grouped/sectioned by Region
  | 'pillars'      // Detailed breakdown of the 6 FMC Strategic Pillars (HD, HvHDF, Personalization, Digital, Services, Sustainability)
  | 'comparison'   // Side-by-side market comparator
  | 'analytics';   // Regional & product intelligence breakdown

export interface RegionSummary {
  region: string;
  marketCount: number;
  avgEssentialsCompleteness: number;
  avgExpertCompleteness: number;
  avgOverallCompleteness: number;
  actionNeededCount: number;
  pillarAverages?: Record<PillarId, number>;
}

