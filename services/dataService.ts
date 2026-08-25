import { 
  ColumnDefinition, 
  MarketPortfolioData, 
  PillarDefinition,
  PillarId,
  PillarScores,
  ProductValues, 
  RangeSummary, 
  RegionSummary 
} from '../types';

// ==========================================
// 1. THE 6 STRATEGIC FMC PILLARS (The 6 Sheets in Excel)
// ==========================================

export const PILLARS: PillarDefinition[] = [
  {
    id: 'hd',
    name: 'HD',
    sheetName: 'HD',
    shortName: 'HD',
    tagline: 'Standard & high-efficiency hemodialysis machines and essential disposables',
    description: 'Foundational 4008 series platforms, Bibag dry cartridges, FX Classix dialyzers, and extracorporeal bloodline tubing sets.',
    color: 'bg-[#7ecedf]',
    badgeBg: 'bg-[#7ecedf]/15',
    badgeText: 'text-[#0b6371]',
    borderColor: 'border-[#7ecedf]/50',
    accentHex: '#7ecedf',
    iconName: 'Activity',
    productIds: [
      'ess_4008a_evo',
      'ess_bibag',
      'ess_fx_classix',
      'ess_bloodlines',
      'ess_acid_concentrates',
      'exp_4008sv10',
      'exp_bibag',
      'exp_4008_bloodlines'
    ]
  },
  {
    id: 'hvhdf',
    name: 'HvHDF',
    sheetName: 'HvHDF',
    shortName: 'HvHDF',
    tagline: 'Cardioprotective high-volume therapy, advanced Helixone membranes & ultrapure water',
    description: 'FX CorAL HD dialyzers with nano-hydro membrane technology, double-stage reverse osmosis water treatment, and DIASAFEplus ultrafiltration.',
    color: 'bg-[#377cb5]',
    badgeBg: 'bg-[#377cb5]/15',
    badgeText: 'text-[#1c4b72]',
    borderColor: 'border-[#377cb5]/50',
    accentHex: '#377cb5',
    iconName: 'ShieldCheck',
    productIds: [
      'ess_saubern_modular',
      'ess_diasafeplus',
      'exp_fx_coral_hd',
      'exp_aquab_saubern',
      'exp_diasafeplus'
    ]
  },
  {
    id: 'personalization',
    name: 'Personalization',
    sheetName: 'Personalization',
    shortName: 'Personalization',
    tagline: 'Patient comfort ergonomics, vascular access care, and clinical preparation sets',
    description: 'Ergonomic treatment chairs (ETC-1B, PY-SOY), high-flow Light Needles, Easy On/Easy Off connection sets, and prefilled Steriset/MedXL flush syringes.',
    color: 'bg-[#071b45]',
    badgeBg: 'bg-[#071b45]/10',
    badgeText: 'text-[#071b45]',
    borderColor: 'border-[#071b45]/30',
    accentHex: '#071b45',
    iconName: 'HeartHandshake',
    productIds: [
      'ess_tg_etc1b',
      'ess_tg_pysoy',
      'ess_tg_light_needles',
      'ess_tg_finesse',
      'ess_tg_steriset',
      'ess_tg_medxl',
      'exp_tg_etc1b',
      'exp_tg_pysoy',
      'exp_tg_light_needles',
      'exp_tg_finesse',
      'exp_tg_steriset',
      'exp_tg_medxl'
    ]
  },
  {
    id: 'digital',
    name: 'Digital',
    sheetName: 'Digital',
    shortName: 'Digital',
    tagline: 'Real-time clinic connectivity, electronic medical records & TDMS therapy management',
    description: '7Connect clinic data bridge and full-scale TDMS software integrating treatment parameters across machines.',
    color: 'bg-[#089e9a]',
    badgeBg: 'bg-[#089e9a]/15',
    badgeText: 'text-[#066e6b]',
    borderColor: 'border-[#089e9a]/50',
    accentHex: '#089e9a',
    iconName: 'Cpu',
    productIds: [
      'ess_7connect',
      'exp_tdms'
    ]
  },
  {
    id: 'services',
    name: 'Services',
    sheetName: 'Services',
    shortName: 'Services',
    tagline: 'Technical engineering SLAs, preventive maintenance, and expert clinical consultancy',
    description: 'Certified biomedical technical support, guaranteed spare parts availability, and application consultancy for workflow optimization.',
    color: 'bg-[#a8a39d]',
    badgeBg: 'bg-[#a8a39d]/20',
    badgeText: 'text-[#504d49]',
    borderColor: 'border-[#a8a39d]/50',
    accentHex: '#a8a39d',
    iconName: 'Wrench',
    productIds: [
      'ess_tech_service',
      'ess_app_consultancy',
      'exp_tech_service',
      'exp_app_consultancy'
    ]
  },
  {
    id: 'sustainability',
    name: 'Sustainability',
    sheetName: 'Sustainability',
    shortName: 'Sustainability',
    tagline: 'Central concentrate distribution, carbon footprint reduction & eco-safe disinfection',
    description: 'Granumix+ CDS central concentrate mixing, Smartbag automated supply, and biodegradable Citrosteril/Puristeril thermal-chemical disinfection.',
    color: 'bg-[#8bc53f]',
    badgeBg: 'bg-[#8bc53f]/15',
    badgeText: 'text-[#486e1a]',
    borderColor: 'border-[#8bc53f]/50',
    accentHex: '#8bc53f',
    iconName: 'Leaf',
    productIds: [
      'ess_citrosteril',
      'exp_granumix_smartbag',
      'exp_citro_puristeril'
    ]
  }
];

// ==========================================
// 2. COLUMN DEFINITIONS (Exact structure of CSV)
// ==========================================

export const ESSENTIALS_COLUMNS: ColumnDefinition[] = [
  // Must-have portfolio (5 items)
  {
    id: 'ess_4008a_evo',
    name: '4008A Evo (or FME Alternative)',
    range: 'Essentials',
    importance: 'Must-have',
    pillar: 'hd',
    group: 'HD Equipment',
    description: 'Hemodialysis system platform for essential operations.'
  },
  {
    id: 'ess_bibag',
    name: 'Bibag',
    range: 'Essentials',
    importance: 'Must-have',
    pillar: 'hd',
    group: 'Disposables & Concentrates',
    description: 'Dry bicarbonate concentrate system for hygienic on-line dialysis.'
  },
  {
    id: 'ess_fx_classix',
    name: 'FX Classix',
    range: 'Essentials',
    importance: 'Must-have',
    pillar: 'hd',
    group: 'Disposables & Concentrates',
    description: 'High performance Helixone dialyzer series for essential HD.'
  },
  {
    id: 'ess_saubern_modular',
    name: 'Saubern / Modular',
    range: 'Essentials',
    importance: 'Must-have',
    pillar: 'hvhdf',
    group: 'Water & Hygiene',
    description: 'Water treatment and fluid management system.'
  },
  {
    id: 'ess_diasafeplus',
    name: 'DIASAFEplus',
    range: 'Essentials',
    importance: 'Must-have',
    pillar: 'hvhdf',
    group: 'Water & Hygiene',
    description: 'Ultrafilter for the production of ultrapure dialysis fluid.'
  },

  // Nice-to-have portfolio (10 items / Trading goods)
  {
    id: 'ess_7connect',
    name: '7Connect',
    range: 'Essentials',
    importance: 'Nice-to-have',
    pillar: 'digital',
    group: 'Digital Systems',
    description: 'Connectivity adapter and clinic data bridge.'
  },
  {
    id: 'ess_citrosteril',
    name: 'Citrosteril',
    range: 'Essentials',
    importance: 'Nice-to-have',
    pillar: 'sustainability',
    group: 'Water & Hygiene',
    description: 'Citric acid-based disinfectant and decalcifier for HD machines.'
  },
  {
    id: 'ess_bloodlines',
    name: 'Bloodlines',
    range: 'Essentials',
    importance: 'Nice-to-have',
    pillar: 'hd',
    group: 'Disposables & Concentrates',
    description: 'Standard extracorporeal blood tubing systems.'
  },
  {
    id: 'ess_acid_concentrates',
    name: 'Acid Concentrates',
    range: 'Essentials',
    importance: 'Nice-to-have',
    pillar: 'hd',
    group: 'Disposables & Concentrates',
    description: 'Liquid acid concentrate formulations for standard HD.'
  },

  // Trading Goods (6 subcolumns)
  {
    id: 'ess_tg_etc1b',
    name: 'ETC-1B',
    range: 'Essentials',
    importance: 'Nice-to-have',
    pillar: 'personalization',
    group: 'Trading Goods',
    subCategory: 'Seating',
    subName: 'ETC-1B',
    description: 'Ergonomic patient treatment chair.'
  },
  {
    id: 'ess_tg_pysoy',
    name: 'PY-SOY',
    range: 'Essentials',
    importance: 'Nice-to-have',
    pillar: 'personalization',
    group: 'Trading Goods',
    subCategory: 'Seating',
    subName: 'PY-SOY',
    description: 'Clinical seating solution for dialysis centers.'
  },
  {
    id: 'ess_tg_light_needles',
    name: 'Light Needles',
    range: 'Essentials',
    importance: 'Nice-to-have',
    pillar: 'personalization',
    group: 'Trading Goods',
    subCategory: 'Needles',
    subName: 'Light Needles',
    description: 'Fistula needles designed for vascular access with low pain.'
  },
  {
    id: 'ess_tg_finesse',
    name: 'Easy On/Easy Off (Finesse)',
    range: 'Essentials',
    importance: 'Nice-to-have',
    pillar: 'personalization',
    group: 'Trading Goods',
    subCategory: 'Patient Preparation Sets',
    subName: 'Easy On/Easy Off (Finesse)',
    description: 'Sterile access connection and disconnection kits.'
  },
  {
    id: 'ess_tg_steriset',
    name: 'Saline Syringe (Steriset)',
    range: 'Essentials',
    importance: 'Nice-to-have',
    pillar: 'personalization',
    group: 'Trading Goods',
    subCategory: 'Syringes',
    subName: 'Saline Syringe (Steriset)',
    description: 'Prefilled flush saline syringes for vascular access maintenance.'
  },
  {
    id: 'ess_tg_medxl',
    name: 'Prefilled Syringe (MedXL)',
    range: 'Essentials',
    importance: 'Nice-to-have',
    pillar: 'personalization',
    group: 'Trading Goods',
    subCategory: 'Locking Solutions',
    subName: 'Prefilled Syringe (MedXL)',
    description: 'Catheter lock solutions in prefilled safety syringes.'
  },

  // Services
  {
    id: 'ess_tech_service',
    name: 'Technical service',
    range: 'Essentials',
    importance: 'Nice-to-have',
    pillar: 'services',
    group: 'Services',
    description: 'Preventive maintenance, repairs, and technical engineering.'
  },
  {
    id: 'ess_app_consultancy',
    name: 'Application consultancy',
    range: 'Essentials',
    importance: 'Nice-to-have',
    pillar: 'services',
    group: 'Services',
    description: 'Clinical workflow optimization and staff clinical training.'
  }
];

export const EXPERT_COLUMNS: ColumnDefinition[] = [
  // Must-have portfolio (7 items)
  {
    id: 'exp_4008sv10',
    name: '4008SV10',
    range: 'Expert',
    importance: 'Must-have',
    pillar: 'hd',
    group: 'HD Equipment',
    description: 'Next-generation 4008S V10 advanced hemodialysis platform.'
  },
  {
    id: 'exp_bibag',
    name: 'Bibag',
    range: 'Expert',
    importance: 'Must-have',
    pillar: 'hd',
    group: 'Disposables & Concentrates',
    description: 'Dry bicarbonate cartridge for hygienic high-efficiency HD.'
  },
  {
    id: 'exp_fx_coral_hd',
    name: 'FX CorAL HD',
    range: 'Expert',
    importance: 'Must-have',
    pillar: 'hvhdf',
    group: 'Disposables & Concentrates',
    description: 'High-end Helixone hydro membrane dialyzers.'
  },
  {
    id: 'exp_4008_bloodlines',
    name: '4008 Bloodlines',
    range: 'Expert',
    importance: 'Must-have',
    pillar: 'hd',
    group: 'Disposables & Concentrates',
    description: 'Precision bloodlines optimized for 4008 platform.'
  },
  {
    id: 'exp_aquab_saubern',
    name: 'AquaBplus / Saubern / Modular',
    range: 'Expert',
    importance: 'Must-have',
    pillar: 'hvhdf',
    group: 'Water & Hygiene',
    description: 'Double stage reverse osmosis and automated disinfection.'
  },
  {
    id: 'exp_tdms',
    name: 'TDMS',
    range: 'Expert',
    importance: 'Must-have',
    pillar: 'digital',
    group: 'Digital Systems',
    description: 'Therapy Data Management System connecting all center machines.'
  },
  {
    id: 'exp_diasafeplus',
    name: 'DIASAFEplus',
    range: 'Expert',
    importance: 'Must-have',
    pillar: 'hvhdf',
    group: 'Water & Hygiene',
    description: 'Ultrafilter safeguarding ultrapure dialysate delivery.'
  },

  // Nice-to-have portfolio (10 items / Trading goods)
  // Trading Goods (6 subcolumns)
  {
    id: 'exp_tg_etc1b',
    name: 'ETC-1B',
    range: 'Expert',
    importance: 'Nice-to-have',
    pillar: 'personalization',
    group: 'Trading Goods',
    subCategory: 'Seating',
    subName: 'ETC-1B',
    description: 'Ergonomic patient treatment chair.'
  },
  {
    id: 'exp_tg_pysoy',
    name: 'PY-SOY',
    range: 'Expert',
    importance: 'Nice-to-have',
    pillar: 'personalization',
    group: 'Trading Goods',
    subCategory: 'Seating',
    subName: 'PY-SOY',
    description: 'Advanced clinical seating with power adjustments.'
  },
  {
    id: 'exp_tg_light_needles',
    name: 'Light Needles',
    range: 'Expert',
    importance: 'Nice-to-have',
    pillar: 'personalization',
    group: 'Trading Goods',
    subCategory: 'Needles',
    subName: 'Light Needles',
    description: 'High-flow fistula needles for high-volume treatment.'
  },
  {
    id: 'exp_tg_finesse',
    name: 'Easy On/Easy Off (Finesse)',
    range: 'Expert',
    importance: 'Nice-to-have',
    pillar: 'personalization',
    group: 'Trading Goods',
    subCategory: 'Patient Preparation Sets',
    subName: 'Easy On/Easy Off (Finesse)',
    description: 'Sterile access connection and disconnection kits.'
  },
  {
    id: 'exp_tg_steriset',
    name: 'Saline Syringe (Steriset)',
    range: 'Expert',
    importance: 'Nice-to-have',
    pillar: 'personalization',
    group: 'Trading Goods',
    subCategory: 'Syringes',
    subName: 'Saline Syringe (Steriset)',
    description: 'Prefilled flush saline syringes for vascular access maintenance.'
  },
  {
    id: 'exp_tg_medxl',
    name: 'Prefilled Syringe (MedXL)',
    range: 'Expert',
    importance: 'Nice-to-have',
    pillar: 'personalization',
    group: 'Trading Goods',
    subCategory: 'Locking Solutions',
    subName: 'Prefilled Syringe (MedXL)',
    description: 'Catheter lock solutions in prefilled safety syringes.'
  },

  // Additional Expert Nice-to-haves
  {
    id: 'exp_granumix_smartbag',
    name: 'Granumix+ CDS / Smartbag',
    range: 'Expert',
    importance: 'Nice-to-have',
    pillar: 'sustainability',
    group: 'Disposables & Concentrates',
    description: 'Central acid concentrate mixing and automated distribution.'
  },
  {
    id: 'exp_citro_puristeril',
    name: 'Citrosteril / Puristeril',
    range: 'Expert',
    importance: 'Nice-to-have',
    pillar: 'sustainability',
    group: 'Water & Hygiene',
    description: 'Advanced hot and cold chemical disinfection regimen.'
  },
  {
    id: 'exp_tech_service',
    name: 'Technical service',
    range: 'Expert',
    importance: 'Nice-to-have',
    pillar: 'services',
    group: 'Services',
    description: '24/7 Priority engineering SLA and proactive uptime monitoring.'
  },
  {
    id: 'exp_app_consultancy',
    name: 'Application consultancy',
    range: 'Expert',
    importance: 'Nice-to-have',
    pillar: 'services',
    group: 'Services',
    description: 'Advanced clinical benchmarking and patient outcome consultancy.'
  }
];

export const ALL_COLUMNS: ColumnDefinition[] = [
  ...ESSENTIALS_COLUMNS,
  ...EXPERT_COLUMNS
];


// ==========================================
// 2. RAW REGION & COUNTRY LIST (From CSV)
// ==========================================

export interface RawCountryEntry {
  region: string;
  country: string;
  isoCode: string;
}

export const RAW_COUNTRIES: RawCountryEntry[] = [
  { region: 'EMEA EAST', country: 'Albania', isoCode: 'al' },
  { region: 'EMEA EAST', country: 'Algeria', isoCode: 'dz' },
  { region: 'EMEA EAST', country: 'Angola', isoCode: 'ao' },
  { region: 'LATAM', country: 'Argentina', isoCode: 'ar' },
  { region: 'EMEA EAST', country: 'Armenia', isoCode: 'am' },
  { region: 'APAC', country: 'Australia', isoCode: 'au' },
  { region: 'DACH', country: 'Austria', isoCode: 'at' },
  { region: 'EMEA EAST', country: 'Azerbaijan', isoCode: 'az' },
  { region: 'EMEA EAST', country: 'Bahrain', isoCode: 'bh' },
  { region: 'APAC', country: 'Bangladesh', isoCode: 'bd' },
  { region: 'EMEA EAST', country: 'Belarus', isoCode: 'by' },
  { region: 'EMEA WEST', country: 'Belgium', isoCode: 'be' },
  { region: 'LATAM', country: 'Belize', isoCode: 'bz' },
  { region: 'EMEA EAST', country: 'Benin', isoCode: 'bj' },
  { region: 'APAC', country: 'Bhutan', isoCode: 'bt' },
  { region: 'LATAM', country: 'Bolivia', isoCode: 'bo' },
  { region: 'EMEA EAST', country: 'Bosnia and Herzegovina - Federation', isoCode: 'ba' },
  { region: 'EMEA EAST', country: 'Botswana', isoCode: 'bw' },
  { region: 'LATAM', country: 'Brazil', isoCode: 'br' },
  { region: 'APAC', country: 'Brunei Darussalam', isoCode: 'bn' },
  { region: 'EMEA EAST', country: 'Bulgaria', isoCode: 'bg' },
  { region: 'EMEA EAST', country: 'Burkina Faso', isoCode: 'bf' },
  { region: 'APAC', country: 'Cambodia', isoCode: 'kh' },
  { region: 'EMEA EAST', country: 'Cameroon', isoCode: 'cm' },
  { region: 'EMEA WEST', country: 'Canada', isoCode: 'ca' },
  { region: 'EMEA EAST', country: 'Chad', isoCode: 'td' },
  { region: 'LATAM', country: 'Chile', isoCode: 'cl' },
  { region: 'China & HK', country: 'China', isoCode: 'cn' },
  { region: 'LATAM', country: 'Colombia', isoCode: 'co' },
  { region: 'LATAM', country: 'Costa Rica', isoCode: 'cr' },
  { region: 'EMEA EAST', country: "Cote d'Ivoire", isoCode: 'ci' },
  { region: 'EMEA EAST', country: 'Croatia', isoCode: 'hr' },
  { region: 'LATAM', country: 'Cuba', isoCode: 'cu' },
  { region: 'LATAM', country: 'Curacao', isoCode: 'cw' },
  { region: 'EMEA EAST', country: 'Cyprus', isoCode: 'cy' },
  { region: 'EMEA WEST', country: 'Czech Republic', isoCode: 'cz' },
  { region: 'EMEA EAST', country: 'Democratic Republic of Congo', isoCode: 'cd' },
  { region: 'EMEA WEST', country: 'Denmark', isoCode: 'dk' },
  { region: 'LATAM', country: 'Dominican Republic', isoCode: 'do' },
  { region: 'LATAM', country: 'Ecuador', isoCode: 'ec' },
  { region: 'EMEA EAST', country: 'Egypt', isoCode: 'eg' },
  { region: 'LATAM', country: 'El Salvador', isoCode: 'sv' },
  { region: 'EMEA EAST', country: 'Eritrea', isoCode: 'er' },
  { region: 'EMEA EAST', country: 'Estonia', isoCode: 'ee' },
  { region: 'EMEA EAST', country: 'Eswatini', isoCode: 'sz' },
  { region: 'EMEA EAST', country: 'Ethiopia', isoCode: 'et' },
  { region: 'EMEA WEST', country: 'Finland', isoCode: 'fi' },
  { region: 'EMEA WEST', country: 'France', isoCode: 'fr' },
  { region: 'EMEA EAST', country: 'Gabon', isoCode: 'ga' },
  { region: 'EMEA EAST', country: 'Gambia', isoCode: 'gm' },
  { region: 'EMEA EAST', country: 'Georgia', isoCode: 'ge' },
  { region: 'DACH', country: 'Germany', isoCode: 'de' },
  { region: 'EMEA EAST', country: 'Ghana', isoCode: 'gh' },
  { region: 'EMEA WEST', country: 'Great Britain', isoCode: 'gb' },
  { region: 'EMEA EAST', country: 'Greece', isoCode: 'gr' },
  { region: 'LATAM', country: 'Guatemala', isoCode: 'gt' },
  { region: 'LATAM', country: 'Honduras', isoCode: 'hn' },
  { region: 'China & HK', country: 'Hong Kong Special Administrative Region of China', isoCode: 'hk' },
  { region: 'EMEA EAST', country: 'Hungary', isoCode: 'hu' },
  { region: 'EMEA WEST', country: 'Iceland', isoCode: 'is' },
  { region: 'APAC', country: 'India', isoCode: 'in' },
  { region: 'APAC', country: 'Indonesia', isoCode: 'id' },
  { region: 'EMEA EAST', country: 'Iraq', isoCode: 'iq' },
  { region: 'EMEA WEST', country: 'Ireland', isoCode: 'ie' },
  { region: 'EMEA EAST', country: 'Islamic Republic of Iran', isoCode: 'ir' },
  { region: 'EMEA EAST', country: 'Israel', isoCode: 'il' },
  { region: 'EMEA EAST', country: 'Italy', isoCode: 'it' },
  { region: 'APAC', country: 'Japan', isoCode: 'jp' },
  { region: 'EMEA EAST', country: 'Jordan', isoCode: 'jo' },
  { region: 'EMEA EAST', country: 'Kazakhstan', isoCode: 'kz' },
  { region: 'EMEA EAST', country: 'Kenya', isoCode: 'ke' },
  { region: 'EMEA EAST', country: 'Kosovo', isoCode: 'xk' },
  { region: 'EMEA EAST', country: 'Kuwait', isoCode: 'kw' },
  { region: 'EMEA EAST', country: 'Kyrgyzstan', isoCode: 'kg' },
  { region: 'APAC', country: 'Laos', isoCode: 'la' },
  { region: 'EMEA WEST', country: 'Latvia', isoCode: 'lv' },
  { region: 'EMEA EAST', country: 'Lebanon', isoCode: 'lb' },
  { region: 'EMEA EAST', country: 'Libya', isoCode: 'ly' },
  { region: 'EMEA WEST', country: 'Lithuania', isoCode: 'lt' },
  { region: 'EMEA WEST', country: 'Luxembourg', isoCode: 'lu' },
  { region: 'China & HK', country: 'Macau Special Administrative Region of China', isoCode: 'mo' },
  { region: 'EMEA EAST', country: 'Madagascar', isoCode: 'mg' },
  { region: 'EMEA EAST', country: 'Malawi', isoCode: 'mw' },
  { region: 'APAC', country: 'Malaysia', isoCode: 'my' },
  { region: 'APAC', country: 'Maldives', isoCode: 'mv' },
  { region: 'EMEA EAST', country: 'Mali', isoCode: 'ml' },
  { region: 'EMEA EAST', country: 'Malta', isoCode: 'mt' },
  { region: 'EMEA EAST', country: 'Mauritania', isoCode: 'mr' },
  { region: 'EMEA EAST', country: 'Mauritius', isoCode: 'mu' },
  { region: 'LATAM', country: 'Mexico', isoCode: 'mx' },
  { region: 'EMEA EAST', country: 'Mongolia', isoCode: 'mn' },
  { region: 'EMEA EAST', country: 'Montenegro', isoCode: 'me' },
  { region: 'EMEA EAST', country: 'Morocco', isoCode: 'ma' },
  { region: 'EMEA EAST', country: 'Mozambique', isoCode: 'mz' },
  { region: 'APAC', country: 'Myanmar', isoCode: 'mm' },
  { region: 'EMEA EAST', country: 'Namibia', isoCode: 'na' },
  { region: 'APAC', country: 'Nepal', isoCode: 'np' },
  { region: 'EMEA WEST', country: 'Netherlands', isoCode: 'nl' },
  { region: 'APAC', country: 'New Zealand', isoCode: 'nz' },
  { region: 'LATAM', country: 'Nicaragua', isoCode: 'ni' },
  { region: 'EMEA EAST', country: 'Niger', isoCode: 'ne' },
  { region: 'EMEA EAST', country: 'Nigeria', isoCode: 'ng' },
  { region: 'EMEA EAST', country: 'North Macedonia', isoCode: 'mk' },
  { region: 'EMEA WEST', country: 'Northern Ireland', isoCode: 'gb' },
  { region: 'EMEA WEST', country: 'Norway', isoCode: 'no' },
  { region: 'EMEA EAST', country: 'Oman', isoCode: 'om' },
  { region: 'APAC', country: 'Pakistan', isoCode: 'pk' },
  { region: 'EMEA EAST', country: 'Palestine', isoCode: 'ps' },
  { region: 'LATAM', country: 'Panama', isoCode: 'pa' },
  { region: 'LATAM', country: 'Paraguay', isoCode: 'py' },
  { region: 'LATAM', country: 'Peru', isoCode: 'pe' },
  { region: 'APAC', country: 'Philippines', isoCode: 'ph' },
  { region: 'EMEA WEST', country: 'Poland', isoCode: 'pl' },
  { region: 'EMEA WEST', country: 'Portugal', isoCode: 'pt' },
  { region: 'EMEA EAST', country: 'Qatar', isoCode: 'qa' },
  { region: 'APAC', country: 'Republic of Korea', isoCode: 'kr' },
  { region: 'EMEA EAST', country: 'Republic of Moldova', isoCode: 'md' },
  { region: 'EMEA EAST', country: 'Romania', isoCode: 'ro' },
  { region: 'EMEA EAST', country: 'Russian Federation', isoCode: 'ru' },
  { region: 'EMEA EAST', country: 'Rwanda', isoCode: 'rw' },
  { region: 'EMEA EAST', country: 'Saudi Arabia', isoCode: 'sa' },
  { region: 'EMEA EAST', country: 'Senegal', isoCode: 'sn' },
  { region: 'EMEA EAST', country: 'Serbia', isoCode: 'rs' },
  { region: 'EMEA EAST', country: 'Seychelles', isoCode: 'sc' },
  { region: 'APAC', country: 'Singapore', isoCode: 'sg' },
  { region: 'EMEA WEST', country: 'Slovakia', isoCode: 'sk' },
  { region: 'EMEA EAST', country: 'Slovenia', isoCode: 'si' },
  { region: 'EMEA EAST', country: 'South Africa', isoCode: 'za' },
  { region: 'EMEA WEST', country: 'Spain', isoCode: 'es' },
  { region: 'APAC', country: 'Sri Lanka', isoCode: 'lk' },
  { region: 'EMEA EAST', country: 'Sudan', isoCode: 'sd' },
  { region: 'EMEA WEST', country: 'Sweden', isoCode: 'se' },
  { region: 'DACH', country: 'Switzerland', isoCode: 'ch' },
  { region: 'EMEA EAST', country: 'Syrian Arab Republic', isoCode: 'sy' },
  { region: 'APAC', country: 'Taiwan Province of China', isoCode: 'tw' },
  { region: 'EMEA EAST', country: 'Tajikistan', isoCode: 'tj' },
  { region: 'APAC', country: 'Thailand', isoCode: 'th' },
  { region: 'EMEA EAST', country: 'Togo', isoCode: 'tg' },
  { region: 'LATAM', country: 'Trinidad and Tobago', isoCode: 'tt' },
  { region: 'EMEA EAST', country: 'Tunisia', isoCode: 'tn' },
  { region: 'EMEA EAST', country: 'Turkiye', isoCode: 'tr' },
  { region: 'EMEA EAST', country: 'Turkmenistan', isoCode: 'tm' },
  { region: 'EMEA EAST', country: 'Uganda', isoCode: 'ug' },
  { region: 'EMEA EAST', country: 'Ukraine', isoCode: 'ua' },
  { region: 'EMEA EAST', country: 'United Arab Emirates', isoCode: 'ae' },
  { region: 'EMEA EAST', country: 'United Republic of Tanzania', isoCode: 'tz' },
  { region: 'LATAM', country: 'Uruguay', isoCode: 'uy' },
  { region: 'EMEA EAST', country: 'Uzbekistan', isoCode: 'uz' },
  { region: 'LATAM', country: 'Venezuela', isoCode: 've' },
  { region: 'APAC', country: 'Vietnam', isoCode: 'vn' },
  { region: 'EMEA EAST', country: 'Yemen', isoCode: 'ye' },
  { region: 'EMEA EAST', country: 'Zambia', isoCode: 'zm' },
  { region: 'EMEA EAST', country: 'Zimbabwe', isoCode: 'zw' },
  { region: 'United States', country: 'United States of America', isoCode: 'us' }
];

// ==========================================
// 3. CALCULATION & RANGE SUMMARY ENGINE
// ==========================================

export const calculateRangeSummary = (
  values: ProductValues,
  columns: ColumnDefinition[]
): RangeSummary => {
  const mustHaves = columns.filter(c => c.importance === 'Must-have');
  const niceToHaves = columns.filter(c => c.importance === 'Nice-to-have');

  const mustHaveActive = mustHaves.filter(c => values[c.id] === true).length;
  const niceToHaveActive = niceToHaves.filter(c => values[c.id] === true).length;

  const totalProducts = columns.length;
  const activeProducts = mustHaveActive + niceToHaveActive;

  const completeness = totalProducts > 0 
    ? Math.round((activeProducts / totalProducts) * 100) 
    : 0;

  const missingMustHaves = mustHaves
    .filter(c => values[c.id] !== true)
    .map(c => c.name);

  // Action Needed logic:
  // Required if ANY must-have item is missing (not active), OR if total completeness is < 70%
  const actionNeeded = missingMustHaves.length > 0 || completeness < 70;

  return {
    mustHaveTotal: mustHaves.length,
    mustHaveActive,
    niceToHaveTotal: niceToHaves.length,
    niceToHaveActive,
    totalProducts,
    activeProducts,
    completeness,
    actionNeeded,
    missingMustHaves
  };
};

export const calculatePillarScores = (values: ProductValues): PillarScores => {
  const scores: Partial<PillarScores> = {};

  PILLARS.forEach((p) => {
    const total = p.productIds.length;
    const active = p.productIds.filter((id) => values[id] === true).length;
    const percentage = total > 0 ? Math.round((active / total) * 100) : 0;
    const status: 'optimal' | 'moderate' | 'gap' = 
      percentage >= 75 ? 'optimal' : percentage >= 45 ? 'moderate' : 'gap';

    scores[p.id as PillarId] = {
      total,
      active,
      percentage,
      status
    };
  });

  return scores as PillarScores;
};

export const createMarketRecord = (
  entry: RawCountryEntry,
  values: ProductValues
): MarketPortfolioData => {
  const essentials = calculateRangeSummary(values, ESSENTIALS_COLUMNS);
  const expert = calculateRangeSummary(values, EXPERT_COLUMNS);
  const pillarScores = calculatePillarScores(values);

  const totalActive = essentials.activeProducts + expert.activeProducts;
  const totalProducts = ESSENTIALS_COLUMNS.length + EXPERT_COLUMNS.length;
  const overallCompleteness = Math.round((totalActive / totalProducts) * 100);
  const overallActionNeeded = essentials.actionNeeded || expert.actionNeeded;

  const slug = entry.country.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return {
    id: `${entry.isoCode}-${slug}`,
    isoCode: entry.isoCode,
    country: entry.country,
    region: entry.region,
    values,
    essentials,
    expert,
    pillarScores,
    overallCompleteness,
    overallActionNeeded
  };
};

// ==========================================
// 4. SEED GENERATOR (Realistic Yes/No Randomizer)
// ==========================================

// Simple pseudo-random hash generator for deterministic reproducible initial seed
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const generateRandomValuesForCountry = (
  countryName: string,
  regionName: string,
  randomnessFactor: number = 0
): ProductValues => {
  const values: ProductValues = {};
  
  // Base seed derived from string characters + optional randomnessFactor
  let seed = 0;
  for (let i = 0; i < countryName.length; i++) {
    seed += countryName.charCodeAt(i) * (i + 1);
  }
  for (let i = 0; i < regionName.length; i++) {
    seed += regionName.charCodeAt(i) * (i + 3);
  }
  seed += randomnessFactor * 1337;

  // Regional tiers of portfolio maturity for realistic market simulation
  let tierProbability = 0.55;
  if (regionName === 'DACH' || regionName === 'United States') {
    tierProbability = 0.85;
  } else if (regionName === 'EMEA WEST' || regionName === 'China & HK') {
    tierProbability = 0.75;
  } else if (regionName === 'APAC' || regionName === 'LATAM') {
    tierProbability = 0.60;
  } else if (regionName === 'EMEA EAST') {
    tierProbability = 0.50;
  }

  ALL_COLUMNS.forEach((col) => {
    seed++;
    const rand = pseudoRandom(seed);

    let threshold = tierProbability;

    // Must-haves generally have higher presence than nice-to-haves
    if (col.importance === 'Must-have') {
      threshold += 0.20;
    } else {
      threshold -= 0.10;
    }

    // Essentials generally more widespread than Expert
    if (col.range === 'Essentials') {
      threshold += 0.12;
    } else {
      threshold -= 0.12;
    }

    // Trading goods vary
    if (col.group === 'Trading Goods') {
      threshold -= 0.05;
    }

    // Clamp threshold between 0.15 and 0.95
    threshold = Math.max(0.15, Math.min(0.95, threshold));

    values[col.id] = rand < threshold;
  });

  return values;
};

export const generateAllMarketsData = (randomnessFactor: number = 0): MarketPortfolioData[] => {
  return RAW_COUNTRIES.map((entry) => {
    const values = generateRandomValuesForCountry(entry.country, entry.region, randomnessFactor);
    return createMarketRecord(entry, values);
  });
};

// ==========================================
// 5. LOCAL STORAGE PERSISTENCE & DATA SERVICE
// ==========================================

const STORAGE_KEY = 'fmc_portfolio_data_v2';
const RANDOM_SEED_KEY = 'fmc_portfolio_seed_v2';

export const loadStoredMarketsData = (): MarketPortfolioData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: MarketPortfolioData[] = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length === RAW_COUNTRIES.length) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load stored market data, using generated default', e);
  }

  const initial = generateAllMarketsData(0);
  saveMarketsData(initial);
  return initial;
};

export const saveMarketsData = (markets: MarketPortfolioData[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(markets));
  } catch (e) {
    console.error('Failed to save market data to localStorage', e);
  }
};

export const randomizeAllData = (): MarketPortfolioData[] => {
  const currentSeed = Number(localStorage.getItem(RANDOM_SEED_KEY) || '0') + 1;
  localStorage.setItem(RANDOM_SEED_KEY, String(currentSeed));
  const newMarkets = generateAllMarketsData(currentSeed);
  saveMarketsData(newMarkets);
  return newMarkets;
};

export const resetToInitialData = (): MarketPortfolioData[] => {
  localStorage.removeItem(RANDOM_SEED_KEY);
  const initial = generateAllMarketsData(0);
  saveMarketsData(initial);
  return initial;
};

export const updateMarketProductValue = (
  marketId: string,
  columnId: string,
  newValue: boolean,
  markets: MarketPortfolioData[]
): MarketPortfolioData[] => {
  const updated = markets.map((m) => {
    if (m.id !== marketId) return m;

    const newValues: ProductValues = {
      ...m.values,
      [columnId]: newValue
    };

    const entry: RawCountryEntry = {
      region: m.region,
      country: m.country,
      isoCode: m.isoCode
    };

    return createMarketRecord(entry, newValues);
  });

  saveMarketsData(updated);
  return updated;
};

export const calculateRegionSummaries = (markets: MarketPortfolioData[]): RegionSummary[] => {
  const map: Record<string, {
    count: number;
    essentialsSum: number;
    expertSum: number;
    overallSum: number;
    actionNeededCount: number;
    pillarSums: Record<PillarId, number>;
  }> = {};

  markets.forEach((m) => {
    if (!map[m.region]) {
      const initialPillars: Record<PillarId, number> = {
        hd: 0,
        hvhdf: 0,
        personalization: 0,
        digital: 0,
        services: 0,
        sustainability: 0
      };
      map[m.region] = {
        count: 0,
        essentialsSum: 0,
        expertSum: 0,
        overallSum: 0,
        actionNeededCount: 0,
        pillarSums: initialPillars
      };
    }

    const reg = map[m.region];
    reg.count++;
    reg.essentialsSum += m.essentials.completeness;
    reg.expertSum += m.expert.completeness;
    reg.overallSum += m.overallCompleteness;
    if (m.overallActionNeeded) {
      reg.actionNeededCount++;
    }

    if (m.pillarScores) {
      PILLARS.forEach((p) => {
        reg.pillarSums[p.id] += m.pillarScores[p.id]?.percentage || 0;
      });
    }
  });

  return Object.keys(map).map((region) => {
    const reg = map[region];
    const pillarAverages: Record<PillarId, number> = {
      hd: Math.round(reg.pillarSums.hd / reg.count),
      hvhdf: Math.round(reg.pillarSums.hvhdf / reg.count),
      personalization: Math.round(reg.pillarSums.personalization / reg.count),
      digital: Math.round(reg.pillarSums.digital / reg.count),
      services: Math.round(reg.pillarSums.services / reg.count),
      sustainability: Math.round(reg.pillarSums.sustainability / reg.count),
    };

    return {
      region,
      marketCount: reg.count,
      avgEssentialsCompleteness: Math.round(reg.essentialsSum / reg.count),
      avgExpertCompleteness: Math.round(reg.expertSum / reg.count),
      avgOverallCompleteness: Math.round(reg.overallSum / reg.count),
      actionNeededCount: reg.actionNeededCount,
      pillarAverages
    };
  });
};

// ==========================================
// 6. CSV EXPORT UTILITY (Exact spreadsheet format)
// ==========================================

export const exportToCsv = (markets: MarketPortfolioData[]): string => {
  const rows: string[][] = [];

  // Row 1: Header Row 1
  rows.push([
    '', '', 'Portfolio', ...Array(18).fill(''), 'Portfolio', ...Array(17).fill('')
  ]);

  // Row 2: Header Row 2
  rows.push([
    '', '', 'Essentials Range', ...Array(18).fill(''), 'Expert Range', ...Array(17).fill('')
  ]);

  // Row 3: Header Row 3
  rows.push([
    '', '', 
    'Must-have portfolio', ...Array(4).fill(''), 
    'Nice-to-have portfolio', ...Array(11).fill(''), 
    '', '', 
    'Must-have portfolio', ...Array(6).fill(''), 
    'Nice-to-have portfolio', ...Array(8).fill(''), 
    '', ''
  ]);

  // Row 4: Column names & categories
  rows.push([
    'Region', 'Country',
    '4008A Evo (or FME Alternative)', 'Bibag', 'FX Classix', 'Saubern/Modular', 'DIASAFEplus',
    '7Connect', 'Citrosteril', 'Bloodlines', 'Acid Concentrates',
    'Trading Goods', '', '', '', '', '',
    'Technical service', 'Application consultancy',
    'Portfolio Completeness', 'Action Needed',
    '4008SV10', 'Bibag', 'FX CorAL HD', '4008 Bloodlines', 'AquaBplus/Saubern/Modular', 'TDMS', 'DIASAFEplus',
    'Trading Goods', '', '', '', '', '',
    'Granumix+ CDS/ Smartbag', 'Citrosteril/Puristeril',
    'Technical service', 'Application consultancy',
    'Portfolio Completeness', 'Action Needed'
  ]);

  // Row 5: Sub-categories for Trading Goods
  rows.push([
    '', '',
    '', '', '', '', '',
    '', '', '', '',
    'Seating', '', 'Needles', 'Patient Preparation Sets', 'Syringes', 'Locking Solutions',
    '', '',
    '', '',
    '', '', '', '', '', '', '',
    'Seating', '', 'Needles', 'Patient Preparation Sets', 'Syringes', 'Locking Solutions',
    '', '',
    '', '',
    '', ''
  ]);

  // Row 6: Sub-item names
  rows.push([
    '', '',
    '', '', '', '', '',
    '', '', '', '',
    'ETC-1B', 'PY-SOY', 'Light Needles', 'Easy On/Easy Off (Finesse)', 'Saline Syringe (Steriset)', 'Prefilled Syringe (MedXL)',
    '', '',
    '', '',
    '', '', '', '', '', '', '',
    'ETC-1B', 'PY-SOY', 'Light Needles', 'Easy On/Easy Off (Finesse)', 'Saline Syringe (Steriset)', 'Prefilled Syringe (MedXL)',
    '', '',
    '', '',
    '', ''
  ]);

  // Data rows
  markets.forEach((m) => {
    const row = [
      m.region,
      m.country,
      // Essentials Must-have
      m.values['ess_4008a_evo'] ? 'Yes' : 'No',
      m.values['ess_bibag'] ? 'Yes' : 'No',
      m.values['ess_fx_classix'] ? 'Yes' : 'No',
      m.values['ess_saubern_modular'] ? 'Yes' : 'No',
      m.values['ess_diasafeplus'] ? 'Yes' : 'No',
      // Essentials Nice-to-have
      m.values['ess_7connect'] ? 'Yes' : 'No',
      m.values['ess_citrosteril'] ? 'Yes' : 'No',
      m.values['ess_bloodlines'] ? 'Yes' : 'No',
      m.values['ess_acid_concentrates'] ? 'Yes' : 'No',
      // Essentials Trading Goods
      m.values['ess_tg_etc1b'] ? 'Yes' : 'No',
      m.values['ess_tg_pysoy'] ? 'Yes' : 'No',
      m.values['ess_tg_light_needles'] ? 'Yes' : 'No',
      m.values['ess_tg_finesse'] ? 'Yes' : 'No',
      m.values['ess_tg_steriset'] ? 'Yes' : 'No',
      m.values['ess_tg_medxl'] ? 'Yes' : 'No',
      // Essentials Services
      m.values['ess_tech_service'] ? 'Yes' : 'No',
      m.values['ess_app_consultancy'] ? 'Yes' : 'No',
      // Essentials Derived
      `${m.essentials.completeness}%`,
      m.essentials.actionNeeded ? 'Yes' : 'No',

      // Expert Must-have
      m.values['exp_4008sv10'] ? 'Yes' : 'No',
      m.values['exp_bibag'] ? 'Yes' : 'No',
      m.values['exp_fx_coral_hd'] ? 'Yes' : 'No',
      m.values['exp_4008_bloodlines'] ? 'Yes' : 'No',
      m.values['exp_aquab_saubern'] ? 'Yes' : 'No',
      m.values['exp_tdms'] ? 'Yes' : 'No',
      m.values['exp_diasafeplus'] ? 'Yes' : 'No',
      // Expert Trading Goods
      m.values['exp_tg_etc1b'] ? 'Yes' : 'No',
      m.values['exp_tg_pysoy'] ? 'Yes' : 'No',
      m.values['exp_tg_light_needles'] ? 'Yes' : 'No',
      m.values['exp_tg_finesse'] ? 'Yes' : 'No',
      m.values['exp_tg_steriset'] ? 'Yes' : 'No',
      m.values['exp_tg_medxl'] ? 'Yes' : 'No',
      // Expert Nice-to-have other
      m.values['exp_granumix_smartbag'] ? 'Yes' : 'No',
      m.values['exp_citro_puristeril'] ? 'Yes' : 'No',
      m.values['exp_tech_service'] ? 'Yes' : 'No',
      m.values['exp_app_consultancy'] ? 'Yes' : 'No',
      // Expert Derived
      `${m.expert.completeness}%`,
      m.expert.actionNeeded ? 'Yes' : 'No'
    ];
    rows.push(row);
  });

  return rows.map((r) => r.map((cell) => `"${(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n');
};

// Helper to determine if a market requires action for a specific pillar and range
export const isPillarActionNeeded = (
  market: MarketPortfolioData, 
  pillarId: PillarId, 
  range: 'ALL' | 'Essentials' | 'Expert' = 'ALL'
): boolean => {
  // Get must-have columns for this pillar and range
  let relevantMustHaves = ALL_COLUMNS.filter(c => c.pillar === pillarId && c.importance === 'Must-have');
  if (range === 'Essentials') {
    relevantMustHaves = ESSENTIALS_COLUMNS.filter(c => c.pillar === pillarId && c.importance === 'Must-have');
  } else if (range === 'Expert') {
    relevantMustHaves = EXPERT_COLUMNS.filter(c => c.pillar === pillarId && c.importance === 'Must-have');
  }

  // Check if any must-have in this pillar is missing
  const hasMissingMustHave = relevantMustHaves.some(c => market.values[c.id] !== true);

  // Check completeness score
  let score = market.pillarScores?.[pillarId]?.percentage ?? 0;
  if (range === 'Essentials') {
    const essCols = ESSENTIALS_COLUMNS.filter(c => c.pillar === pillarId);
    if (essCols.length > 0) {
      const active = essCols.filter(c => market.values[c.id] === true).length;
      score = Math.round((active / essCols.length) * 100);
    }
  } else if (range === 'Expert') {
    const expCols = EXPERT_COLUMNS.filter(c => c.pillar === pillarId);
    if (expCols.length > 0) {
      const active = expCols.filter(c => market.values[c.id] === true).length;
      score = Math.round((active / expCols.length) * 100);
    }
  }

  return hasMissingMustHave || score < 70;
};
