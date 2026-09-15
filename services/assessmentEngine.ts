import { ParsedProduct, AssessmentItem, AssessmentRequirement } from '../types';

/**
 * Normalizes product requirement to 'must-have' | 'nice-to-have' | null
 */
export const getNormalizedRequirement = (
  req: 'Must-have portfolio' | 'Nice-to-have portfolio' | string | null | undefined
): AssessmentRequirement => {
  if (!req) return null;
  const lower = req.toLowerCase();
  if (lower.includes('must-have')) return 'must-have';
  if (lower.includes('nice-to-have')) return 'nice-to-have';
  return null;
};

export interface GroupedAssessments {
  mustHaveItems: AssessmentItem[];
  niceToHaveItems: AssessmentItem[];
  flatItems: AssessmentItem[];
  totalCount: number;
}

/**
 * Groups assessments into must-have, nice-to-have, and flat (for pillars without division)
 */
export const groupAssessments = (assessments: (AssessmentItem | string)[]): GroupedAssessments => {
  const normalized: AssessmentItem[] = assessments.map(a =>
    typeof a === 'string' ? { text: a, requirement: null } : a
  );
  const mustHaveItems = normalized.filter(a => a.requirement === 'must-have');
  const niceToHaveItems = normalized.filter(a => a.requirement === 'nice-to-have');
  const flatItems = normalized.filter(a => !a.requirement);
  return {
    mustHaveItems,
    niceToHaveItems,
    flatItems,
    totalCount: normalized.length,
  };
};

/**
 * Computes dynamic "Action Needed" assessments for a specific range of products.
 * 
 * Business Rules & Cascading Roll-up:
 * 1. Scope: Strictly independent per range (Essential Range vs Expert Range).
 * 2. Absence Criterion: ONLY products whose normalized value is "no".
 *    Excluded: "Currently not available", "3P/Local Alternative", "FME Alternative", "Yes", etc.
 * 3. Cascade Hierarchy:
 *    - Level 1 (Category): If category has >= 2 products and 100% are "no":
 *      Emit "${CategoryName} assessment needed". Suppress subcategories and products.
 *    - Level 2 (Subcategory): If parent category is not 100% absent, but 100% of products in subcategory are "no":
 *      Emit "${SubcategoryName} assessment needed". Suppress individual products.
 *    - Level 3 (Product): If product is "no" and not covered by category/subcategory:
 *      Emit "${ProductName} assessment needed".
 */
export const computeRangeAssessments = (
  products: ParsedProduct[],
  marketValues: Record<string, string> | undefined
): AssessmentItem[] => {
  if (!products || products.length === 0 || !marketValues) {
    return [];
  }

  const isAbsent = (p: ParsedProduct): boolean => {
    const val = marketValues[p.id];
    return (val?.trim().toLowerCase() || '') === 'no';
  };

  const actions: AssessmentItem[] = [];
  const handledProductIds = new Set<string>();

  // Helper to clean names from excess whitespace or trailing spaces
  const clean = (str: string) => str.replace(/\s+/g, ' ').trim();

  // 1. Level Category (>= 2 products assigned and 100% in state "no")
  const categoryMap = new Map<string, ParsedProduct[]>();
  for (const p of products) {
    if (p.category && p.category.trim()) {
      const catKey = clean(p.category);
      if (!categoryMap.has(catKey)) {
        categoryMap.set(catKey, []);
      }
      categoryMap.get(catKey)!.push(p);
    }
  }

  for (const [catName, catProducts] of categoryMap.entries()) {
    if (catProducts.length >= 2 && catProducts.every(isAbsent)) {
      const req = getNormalizedRequirement(catProducts.find(p => p.requirement)?.requirement);
      actions.push({ text: `${catName} assessment needed`, requirement: req });
      catProducts.forEach(p => handledProductIds.add(p.id));
    }
  }

  // 2. Level Subcategory (100% of products in subcategory are "no")
  // Group by compound key to avoid collision if subcategories exist across different categories
  const subcategoryMap = new Map<string, { name: string; products: ParsedProduct[] }>();
  for (const p of products) {
    if (!handledProductIds.has(p.id) && p.subcategory && p.subcategory.trim()) {
      const subName = clean(p.subcategory);
      const catPrefix = p.category ? clean(p.category) : '';
      const groupKey = `${catPrefix}:::${subName}`;
      
      if (!subcategoryMap.has(groupKey)) {
        subcategoryMap.set(groupKey, { name: subName, products: [] });
      }
      subcategoryMap.get(groupKey)!.products.push(p);
    }
  }

  for (const [, { name, products: subProducts }] of subcategoryMap.entries()) {
    if (subProducts.length > 0 && subProducts.every(isAbsent)) {
      const req = getNormalizedRequirement(subProducts.find(p => p.requirement)?.requirement);
      actions.push({ text: `${name} assessment needed`, requirement: req });
      subProducts.forEach(p => handledProductIds.add(p.id));
    }
  }

  // 3. Level Product (individual/orphan items in state "no")
  for (const p of products) {
    if (!handledProductIds.has(p.id) && isAbsent(p)) {
      const prodName = clean(p.name);
      actions.push({
        text: `${prodName} assessment needed`,
        requirement: getNormalizedRequirement(p.requirement),
      });
      handledProductIds.add(p.id);
    }
  }

  // Deduplicate preserving insertion order
  const seenTexts = new Set<string>();
  const uniqueActions: AssessmentItem[] = [];
  for (const act of actions) {
    if (!seenTexts.has(act.text)) {
      seenTexts.add(act.text);
      uniqueActions.push(act);
    }
  }

  return uniqueActions;
};
