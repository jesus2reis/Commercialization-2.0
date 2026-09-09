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
  sheetName: string;
  shortName: string;
  tagline: string;
  description: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  accentHex: string;
  iconName: string;
}

export interface ParsedProduct {
  id: string; 
  pillarId: PillarId;
  name: string;
  categoryPath: string[]; 
  isEssential: boolean;   
  isExpert: boolean;      
  isMustHave: boolean;
  isNiceToHave: boolean;
}

export type ProductValues = Record<string, string>;

export interface MarketPortfolioData {
  id: string; 
  isoCode: string;
  country: string;
  region: string;
  values: ProductValues; 
  actionNeeded: Record<string, string[]>;
  rangeActionNeeded: Record<string, Record<string, string>>;
  rangeCompleteness: Record<string, Record<string, string>>;
}

export type ViewMode = 
  | 'home'
  | 'cards'
  | 'matrix'
  | 'heatmap'
  | 'pillars'
  | 'comparison'
  | 'analytics';
