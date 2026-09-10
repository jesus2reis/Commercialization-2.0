import Papa from 'papaparse';
import { PillarId, PillarDefinition, MarketPortfolioData, ProductValues, ParsedProduct } from '../types';

export const PILLARS: PillarDefinition[] = [
  {
    id: 'hd', name: 'HD', sheetName: 'HD', shortName: 'HD',
    tagline: 'Standard & high-efficiency hemodialysis machines', description: 'Foundational 4008 series platforms.',
    color: 'bg-[#7ecedf]', badgeBg: 'bg-[#7ecedf]/15', badgeText: 'text-[#0b6371]', borderColor: 'border-[#7ecedf]/50', accentHex: '#7ecedf', iconName: 'Activity',
  },
  {
    id: 'hvhdf', name: 'HvHDF', sheetName: 'HvHDF', shortName: 'HvHDF',
    tagline: 'Cardioprotective high-volume therapy', description: 'FX CorAL HD dialyzers with nano-hydro membrane technology.',
    color: 'bg-[#377cb5]', badgeBg: 'bg-[#377cb5]/15', badgeText: 'text-[#1c4b72]', borderColor: 'border-[#377cb5]/50', accentHex: '#377cb5', iconName: 'ShieldCheck',
  },
  {
    id: 'personalization', name: 'Personalization', sheetName: 'Personalization', shortName: 'Personalization',
    tagline: 'Patient comfort ergonomics', description: 'Ergonomic treatment chairs.',
    color: 'bg-[#071b45]', badgeBg: 'bg-[#071b45]/10', badgeText: 'text-[#071b45]', borderColor: 'border-[#071b45]/30', accentHex: '#071b45', iconName: 'HeartHandshake',
  },
  {
    id: 'digital', name: 'Digital', sheetName: 'Digital', shortName: 'Digital',
    tagline: 'Real-time clinic connectivity', description: '7Connect clinic data bridge and full-scale TDMS software.',
    color: 'bg-[#089e9a]', badgeBg: 'bg-[#089e9a]/15', badgeText: 'text-[#066e6b]', borderColor: 'border-[#089e9a]/50', accentHex: '#089e9a', iconName: 'Cpu',
  },
  {
    id: 'services', name: 'Services', sheetName: 'Services', shortName: 'Services',
    tagline: 'Technical engineering SLAs', description: 'Certified biomedical technical support.',
    color: 'bg-[#a8a39d]', badgeBg: 'bg-[#a8a39d]/20', badgeText: 'text-[#504d49]', borderColor: 'border-[#a8a39d]/50', accentHex: '#a8a39d', iconName: 'Wrench',
  },
  {
    id: 'sustainability', name: 'Sustainability', sheetName: 'Sustainability', shortName: 'Sustainability',
    tagline: 'Central concentrate distribution', description: 'Granumix+ CDS central concentrate mixing.',
    color: 'bg-[#8bc53f]', badgeBg: 'bg-[#8bc53f]/15', badgeText: 'text-[#486e1a]', borderColor: 'border-[#8bc53f]/50', accentHex: '#8bc53f', iconName: 'Leaf',
  }
];

export const RAW_COUNTRIES: Record<string, string> = {
  'Albania': 'al', 'Algeria': 'dz', 'Angola': 'ao', 'Argentina': 'ar', 'Armenia': 'am',
  'Australia': 'au', 'Austria': 'at', 'Azerbaijan': 'az', 'Bahrain': 'bh', 'Bangladesh': 'bd',
  'Belarus': 'by', 'Belgium': 'be', 'Belize': 'bz', 'Benin': 'bj', 'Bhutan': 'bt',
  'Bolivia': 'bo', 'Bosnia and Herzegovina - Federation': 'ba', 'Botswana': 'bw', 'Brazil': 'br',
  'Brunei Darussalam': 'bn', 'Bulgaria': 'bg', 'Burkina Faso': 'bf', 'Cambodia': 'kh', 'Cameroon': 'cm',
  'Canada': 'ca', 'Chad': 'td', 'Chile': 'cl', 'China': 'cn', 'Colombia': 'co',
  'Costa Rica': 'cr', "Cote d'Ivoire": 'ci', 'Croatia': 'hr', 'Cuba': 'cu', 'Curacao': 'cw',
  'Cyprus': 'cy', 'Czech Republic': 'cz', 'Democratic Republic of Congo': 'cd', 'Denmark': 'dk',
  'Dominican Republic': 'do', 'Ecuador': 'ec', 'Egypt': 'eg', 'El Salvador': 'sv', 'Eritrea': 'er',
  'Estonia': 'ee', 'Eswatini': 'sz', 'Ethiopia': 'et', 'Finland': 'fi', 'France': 'fr',
  'Gabon': 'ga', 'Gambia': 'gm', 'Georgia': 'ge', 'Germany': 'de', 'Ghana': 'gh',
  'Great Britain': 'gb', 'Greece': 'gr', 'Guatemala': 'gt', 'Honduras': 'hn',
  'Hong Kong Special Administrative Region of China': 'hk', 'Hungary': 'hu', 'Iceland': 'is',
  'India': 'in', 'Indonesia': 'id', 'Iraq': 'iq', 'Ireland': 'ie', 'Islamic Republic of Iran': 'ir',
  'Israel': 'il', 'Italy': 'it', 'Japan': 'jp', 'Jordan': 'jo', 'Kazakhstan': 'kz',
  'Kenya': 'ke', 'Kosovo': 'xk', 'Kuwait': 'kw', 'Kyrgyzstan': 'kg', 'Laos': 'la',
  'Latvia': 'lv', 'Lebanon': 'lb', 'Libya': 'ly', 'Lithuania': 'lt', 'Luxembourg': 'lu',
  'Macau Special Administrative Region of China': 'mo', 'Madagascar': 'mg', 'Malawi': 'mw',
  'Malaysia': 'my', 'Maldives': 'mv', 'Mali': 'ml', 'Malta': 'mt', 'Mauritania': 'mr',
  'Mauritius': 'mu', 'Mexico': 'mx', 'Mongolia': 'mn', 'Montenegro': 'me', 'Morocco': 'ma',
  'Mozambique': 'mz', 'Myanmar': 'mm', 'Namibia': 'na', 'Nepal': 'np', 'Netherlands': 'nl',
  'New Zealand': 'nz', 'Nicaragua': 'ni', 'Niger': 'ne', 'Nigeria': 'ng', 'North Macedonia': 'mk',
  'Northern Ireland': 'gb', 'Norway': 'no', 'Oman': 'om', 'Pakistan': 'pk', 'Palestine': 'ps',
  'Panama': 'pa', 'Paraguay': 'py', 'Peru': 'pe', 'Philippines': 'ph', 'Poland': 'pl',
  'Portugal': 'pt', 'Qatar': 'qa', 'Republic of Korea': 'kr', 'Republic of Moldova': 'md',
  'Romania': 'ro', 'Russian Federation': 'ru', 'Rwanda': 'rw', 'Saudi Arabia': 'sa',
  'Senegal': 'sn', 'Serbia': 'rs', 'Seychelles': 'sc', 'Singapore': 'sg', 'Slovakia': 'sk',
  'Slovenia': 'si', 'South Africa': 'za', 'Spain': 'es', 'Sri Lanka': 'lk', 'Sudan': 'sd',
  'Sweden': 'se', 'Switzerland': 'ch', 'Syrian Arab Republic': 'sy', 'Taiwan Province of China': 'tw',
  'Tajikistan': 'tj', 'Thailand': 'th', 'Togo': 'tg', 'Trinidad and Tobago': 'tt',
  'Tunisia': 'tn', 'Turkiye': 'tr', 'Turkmenistan': 'tm', 'Uganda': 'ug', 'Ukraine': 'ua',
  'United Arab Emirates': 'ae', 'United Republic of Tanzania': 'tz', 'Uruguay': 'uy',
  'Uzbekistan': 'uz', 'Venezuela': 've', 'Vietnam': 'vn', 'Yemen': 'ye', 'Zambia': 'zm',
  'Zimbabwe': 'zw', 'United States of America': 'us',
  
  // Custom manual mappings based on the requirements
  'Viet Nam': 'vn',
  'Bhutan': 'bt',
  'Cambodia': 'kh',
  'Brunei Darussalam': 'bn',
  'Bosnia and Herzegovina': 'ba',
};

export const cleanCountryName = (name: string) => {
  return name.replace(/\s*\([^)]*\)/g, '').trim();
};

export const getIsoCode = (countryName: string) => {
  const cleanedName = cleanCountryName(countryName);
  return RAW_COUNTRIES[cleanedName] || RAW_COUNTRIES[countryName] || 'xx';
};

export interface AppData {
  markets: MarketPortfolioData[];
  products: ParsedProduct[];
}

export const fetchAndParseData = async (): Promise<AppData> => {
  const files: { pillar: PillarId, file: string }[] = [
    { pillar: 'hd', file: 'hd.csv' },
    { pillar: 'hvhdf', file: 'hvhdf.csv' },
    { pillar: 'digital', file: 'digital.csv' },
    { pillar: 'personalization', file: 'personalization.csv' },
    { pillar: 'services', file: 'services.csv' },
    { pillar: 'sustainability', file: 'sustainability.csv' },
  ];

  const allProducts: ParsedProduct[] = [];
  const marketMap = new Map<string, MarketPortfolioData>();

  for (const { pillar, file } of files) {
    const res = await fetch(`/data/${file}`);
    const csvText = await res.text();
    const { data } = Papa.parse<string[]>(csvText, { skipEmptyLines: true });

    let firstDataRow = -1;
    for (let i = 0; i < data.length; i++) {
      const r0 = (data[i][0] || '').trim().toUpperCase();
      const r1 = (data[i][1] || '').trim();
      const isRegion = ['EMEA EAST', 'LATAM', 'EMEA WEST', 'APAC', 'NORTH AMERICA'].includes(r0);
      const isRealCountry = r1 && r1.toLowerCase() !== 'country';
      if (isRegion || isRealCountry) {
        firstDataRow = i;
        break;
      }
    }

    if (firstDataRow < 1) continue;

    const productRowIndex = firstDataRow - 1;
    const headerRows = data.slice(0, productRowIndex);
    const dataRows = data.slice(firstDataRow);
    const productRow = data[productRowIndex];
    const maxCols = productRow.length;

    // Horizontal forward-fill for ancestors starting from column 2
    const filledHeaders = Array.from({ length: productRowIndex }, () => new Array(maxCols).fill(''));
    for (let i = 0; i < productRowIndex; i++) {
      let currentVal = '';
      for (let j = 2; j < maxCols; j++) {
        const val = (headerRows[i]?.[j] || '').trim();
        
        // Reset propagation when crossing range boundaries on row 1
        if (i > 1 && headerRows[1]?.[j]?.trim()) {
          currentVal = ''; 
        }
        
        if (val !== '') {
          currentVal = val;
        }
        filledHeaders[i][j] = currentVal;
      }
    }

    const colMappings: { index: number, product: ParsedProduct }[] = [];
    const actionNeededCols: number[] = [];
    const actionNeededRangeCols: { index: number, range: string }[] = [];
    const completenessRangeCols: { index: number, range: string }[] = [];

    for (let j = 2; j < maxCols; j++) {
      const rawName = (productRow[j] || '').trim().replace(/\n/g, ' ');
      if (!rawName) continue;
      
      const lowerName = rawName.toLowerCase();
      
      let rangeVal = '';
      let req: 'Must-have portfolio' | 'Nice-to-have portfolio' | null = null;
      let category: string | null = null;
      let subcategory: string | null = null;

      if (pillar === 'hd' || pillar === 'hvhdf') {
        rangeVal = filledHeaders[1]?.[j] || '';
        const rVal = (filledHeaders[2]?.[j] || '').toLowerCase();
        if (rVal.includes('must-have')) req = 'Must-have portfolio';
        else if (rVal.includes('nice-to-have')) req = 'Nice-to-have portfolio';
        
        category = filledHeaders[3]?.[j] || null;
        subcategory = filledHeaders[4]?.[j] || null;

        const resetKeywords = [
          'acid concentrates', 'citrosteril', 'puristeril', 'sporotal',
          'granumix', 'cds', 'smartbag', 'technical service', 'application consultancy'
        ];
        if (resetKeywords.some(kw => lowerName.includes(kw))) {
          category = null;
          subcategory = null;
        }
      } 
      else if (pillar === 'personalization' || pillar === 'services' || pillar === 'digital') {
        rangeVal = filledHeaders[1]?.[j] || '';
        category = filledHeaders[2]?.[j] || null;
        
        if (pillar === 'digital' && category?.toLowerCase() === 'tdms') {
          if (!lowerName.includes('tmon') && !lowerName.includes('tss')) {
            category = null;
          }
        }
      } 
      else if (pillar === 'sustainability') {
        // Row 0 is Winning Portfolio (ignored), Row 1 is Range
        rangeVal = filledHeaders[1]?.[j] || '';
      }

      const isEssential = rangeVal.toLowerCase().includes('essential');
      const isExpert = rangeVal.toLowerCase().includes('expert');
      let range = isEssential ? 'essential' : (isExpert ? 'expert' : '');

      if (lowerName.includes('portfolio completeness')) {
        if (range) completenessRangeCols.push({ index: j, range });
        continue;
      }
      if (lowerName.includes('action needed')) {
        actionNeededCols.push(j);
        if (range) actionNeededRangeCols.push({ index: j, range });
        continue;
      }

      let labelParts = [];
      if (category) labelParts.push(category);
      if (subcategory) labelParts.push(subcategory);
      const label = labelParts.length > 0 ? labelParts.join(' / ') : null;

      const product: ParsedProduct = {
        id: `${pillar}_${j}`,
        pillarId: pillar,
        name: rawName,
        categoryPath: [],
        category,
        subcategory,
        requirement: req,
        label,
        isEssential,
        isExpert,
        isMustHave: req === 'Must-have portfolio',
        isNiceToHave: req === 'Nice-to-have portfolio'
      };
      
      colMappings.push({ index: j, product });
      allProducts.push(product);
    }

    dataRows.forEach(row => {
      const region = row[0]?.trim() || '';
      const country = row[1]?.trim() || '';
      if (!region || !country) return;

      const slug = country.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const marketId = `iso-${slug}`;

      if (!marketMap.has(marketId)) {
        marketMap.set(marketId, {
          id: marketId,
          isoCode: getIsoCode(country),
          region,
          country,
          values: {},
          actionNeeded: {},
          rangeActionNeeded: {},
          rangeCompleteness: {}
        });
      }

      const market = marketMap.get(marketId)!;

      // Extract Action Needed messages
      if (!market.actionNeeded[pillar]) {
        market.actionNeeded[pillar] = [];
      }
      if (!market.rangeActionNeeded[pillar]) {
        market.rangeActionNeeded[pillar] = {};
      }
      if (!market.rangeCompleteness[pillar]) {
        market.rangeCompleteness[pillar] = {};
      }
      
      actionNeededCols.forEach(idx => {
        const val = row[idx]?.trim();
        if (val && val.toLowerCase() !== 'no' && !market.actionNeeded[pillar].includes(val)) {
          market.actionNeeded[pillar].push(val);
        }
      });
      
      actionNeededRangeCols.forEach(({ index, range }) => {
        const val = row[index]?.trim();
        if (val) {
          market.rangeActionNeeded[pillar][range] = val;
        }
      });
      
      completenessRangeCols.forEach(({ index, range }) => {
        const val = row[index]?.trim();
        if (val) {
          market.rangeCompleteness[pillar][range] = val;
        }
      });

      colMappings.forEach(mapping => {
        const cellVal = row[mapping.index]?.trim() || '';
        market.values[mapping.product.id] = cellVal;
      });
    });
  }

  return {
    markets: Array.from(marketMap.values()),
    products: allProducts
  };
};
