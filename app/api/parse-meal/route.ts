import { NextRequest, NextResponse } from 'next/server';
import { AIParseResponse, FoodItem, MealType } from '@/types/nutrition';

interface FoodRef {
  serving: string;
  unitWeightGram?: number; // Grams or ML for 1 base serving
  calories: number;        // per base serving
  protein: number;         // grams
  carbs: number;           // grams
  fat: number;             // grams
}

// Master Healthify-Grade Clinical Food & Brand Database
const MASTER_FOOD_DATABASE: Record<string, FoodRef> = {
  // --- Protein Powders & Supplements ---
  'muscleblaze protein shake': { serving: '1 scoop (33g)', unitWeightGram: 33, calories: 120, protein: 25.0, carbs: 2.0, fat: 1.5 },
  'muscleblaze protein': { serving: '1 scoop (33g)', unitWeightGram: 33, calories: 120, protein: 25.0, carbs: 2.0, fat: 1.5 },
  'muscleblaze': { serving: '1 scoop (33g)', unitWeightGram: 33, calories: 120, protein: 25.0, carbs: 2.0, fat: 1.5 },
  'muscle blaze protein shake': { serving: '1 scoop (33g)', unitWeightGram: 33, calories: 120, protein: 25.0, carbs: 2.0, fat: 1.5 },
  'muscle blaze protein': { serving: '1 scoop (33g)', unitWeightGram: 33, calories: 120, protein: 25.0, carbs: 2.0, fat: 1.5 },
  'muscle blaze': { serving: '1 scoop (33g)', unitWeightGram: 33, calories: 120, protein: 25.0, carbs: 2.0, fat: 1.5 },
  'optimum nutrition': { serving: '1 scoop (30g)', unitWeightGram: 30, calories: 120, protein: 24.0, carbs: 3.0, fat: 1.0 },
  'on whey': { serving: '1 scoop (30g)', unitWeightGram: 30, calories: 120, protein: 24.0, carbs: 3.0, fat: 1.0 },
  'myprotein': { serving: '1 scoop (25g)', unitWeightGram: 25, calories: 100, protein: 21.0, carbs: 1.0, fat: 1.5 },
  'asitis': { serving: '1 scoop (30g)', unitWeightGram: 30, calories: 120, protein: 24.0, carbs: 2.0, fat: 1.5 },
  'atom protein': { serving: '1 scoop (30g)', unitWeightGram: 30, calories: 120, protein: 24.0, carbs: 2.0, fat: 1.5 },
  'whey protein powder': { serving: '1 scoop (30g)', unitWeightGram: 30, calories: 120, protein: 24.0, carbs: 2.0, fat: 1.5 },
  'whey protein': { serving: '1 scoop (30g)', unitWeightGram: 30, calories: 120, protein: 24.0, carbs: 2.0, fat: 1.5 },
  'protein powder': { serving: '1 scoop (30g)', unitWeightGram: 30, calories: 120, protein: 24.0, carbs: 2.0, fat: 1.5 },
  'protein scoop': { serving: '1 scoop (30g)', unitWeightGram: 30, calories: 120, protein: 24.0, carbs: 2.0, fat: 1.5 },

  // --- Indian Quick-Commerce Brands (Amul, Frubon, Yogabar, Epigamia, Whole Truth) ---
  'amul protein lassi': { serving: '1 pack (250ml)', unitWeightGram: 250, calories: 125, protein: 15.0, carbs: 13.0, fat: 1.5 },
  'amul protein buttermilk': { serving: '1 pack (200ml)', unitWeightGram: 200, calories: 85, protein: 15.0, carbs: 5.0, fat: 0.5 },
  'amul protein chaas': { serving: '1 pack (200ml)', unitWeightGram: 200, calories: 85, protein: 15.0, carbs: 5.0, fat: 0.5 },
  'amul protein milk': { serving: '1 bottle (250ml)', unitWeightGram: 250, calories: 140, protein: 15.0, carbs: 14.0, fat: 2.0 },
  'amul blueberry shake': { serving: '1 pack (200ml)', unitWeightGram: 200, calories: 160, protein: 20.0, carbs: 15.0, fat: 2.0 },
  'amul blueberry protein shake': { serving: '1 pack (200ml)', unitWeightGram: 200, calories: 160, protein: 20.0, carbs: 15.0, fat: 2.0 },
  'amul blueberry': { serving: '1 pack (200ml)', unitWeightGram: 200, calories: 160, protein: 20.0, carbs: 15.0, fat: 2.0 },
  'amul protein shake': { serving: '1 pack (200ml)', unitWeightGram: 200, calories: 160, protein: 20.0, carbs: 15.0, fat: 2.0 },
  'amul kool': { serving: '1 bottle (200ml)', unitWeightGram: 200, calories: 165, protein: 6.0, carbs: 25.0, fat: 4.8 },
  'amul smoothie': { serving: '1 bottle (200ml)', unitWeightGram: 200, calories: 175, protein: 6.0, carbs: 27.0, fat: 5.0 },
  'amul taaza': { serving: '1 cup (200ml)', unitWeightGram: 200, calories: 118, protein: 6.2, carbs: 9.4, fat: 6.0 },
  'amul gold': { serving: '1 cup (200ml)', unitWeightGram: 200, calories: 148, protein: 6.4, carbs: 10.0, fat: 9.0 },

  'frubon protein milk': { serving: '1 bottle (250ml)', unitWeightGram: 250, calories: 150, protein: 15.0, carbs: 14.0, fat: 2.0 },
  'frubon protein shake': { serving: '1 bottle (250ml)', unitWeightGram: 250, calories: 150, protein: 15.0, carbs: 14.0, fat: 2.0 },
  'frubon protein': { serving: '1 bottle (250ml)', unitWeightGram: 250, calories: 150, protein: 15.0, carbs: 14.0, fat: 2.0 },
  'frubon': { serving: '1 bottle (250ml)', unitWeightGram: 250, calories: 150, protein: 15.0, carbs: 14.0, fat: 2.0 },
  'phab protein shake': { serving: '1 bottle (250ml)', unitWeightGram: 250, calories: 160, protein: 18.0, carbs: 15.0, fat: 2.5 },
  'yogabar protein bar': { serving: '1 bar (50g)', unitWeightGram: 50, calories: 180, protein: 20.0, carbs: 18.0, fat: 5.0 },
  'yogabar': { serving: '1 bar (50g)', unitWeightGram: 50, calories: 180, protein: 20.0, carbs: 18.0, fat: 5.0 },
  'whole truth protein bar': { serving: '1 bar (52g)', unitWeightGram: 52, calories: 190, protein: 15.0, carbs: 16.0, fat: 6.0 },
  'epigamia greek yogurt': { serving: '1 cup (100g)', unitWeightGram: 100, calories: 90, protein: 8.0, carbs: 10.0, fat: 2.0 },

  // --- Indian Dishes, Curries & Grains ---
  'rajma': { serving: '1 bowl (150g)', unitWeightGram: 150, calories: 165, protein: 8.5, carbs: 22.0, fat: 4.5 },
  'rajma curry': { serving: '1 bowl (150g)', unitWeightGram: 150, calories: 165, protein: 8.5, carbs: 22.0, fat: 4.5 },
  'rajma chawal': { serving: '1 plate (350g)', unitWeightGram: 350, calories: 420, protein: 14.0, carbs: 68.0, fat: 10.0 },
  'chole': { serving: '1 bowl (150g)', unitWeightGram: 150, calories: 190, protein: 8.0, carbs: 26.0, fat: 6.0 },
  'chana masala': { serving: '1 bowl (150g)', unitWeightGram: 150, calories: 190, protein: 8.0, carbs: 26.0, fat: 6.0 },
  'dal': { serving: '1 bowl (200g)', unitWeightGram: 200, calories: 180, protein: 12.0, carbs: 28.0, fat: 3.0 },
  'dal makhani': { serving: '1 bowl (200g)', unitWeightGram: 200, calories: 300, protein: 11.0, carbs: 26.0, fat: 16.0 },

  'cooked rice': { serving: '100g cooked', unitWeightGram: 100, calories: 130, protein: 2.7, carbs: 28.0, fat: 0.3 },
  'white rice': { serving: '100g cooked', unitWeightGram: 100, calories: 130, protein: 2.7, carbs: 28.0, fat: 0.3 },
  'basmati rice': { serving: '100g cooked', unitWeightGram: 100, calories: 130, protein: 2.7, carbs: 28.0, fat: 0.3 },
  'brown rice': { serving: '100g cooked', unitWeightGram: 100, calories: 111, protein: 2.6, carbs: 23.0, fat: 0.9 },
  'rice': { serving: '100g cooked', unitWeightGram: 100, calories: 130, protein: 2.7, carbs: 28.0, fat: 0.3 },
  'roti': { serving: '1 piece (40g)', unitWeightGram: 40, calories: 110, protein: 3.5, carbs: 22.0, fat: 1.5 },
  'chapati': { serving: '1 piece (40g)', unitWeightGram: 40, calories: 110, protein: 3.5, carbs: 22.0, fat: 1.5 },
  'naan': { serving: '1 piece (90g)', unitWeightGram: 90, calories: 260, protein: 8.0, carbs: 45.0, fat: 5.0 },

  'paneer': { serving: '100g', unitWeightGram: 100, calories: 265, protein: 18.0, carbs: 3.5, fat: 20.0 },
  'paneer butter masala': { serving: '1 portion (250g)', unitWeightGram: 250, calories: 420, protein: 16.0, carbs: 18.0, fat: 32.0 },
  'chicken tikka': { serving: '1 portion (200g)', unitWeightGram: 200, calories: 300, protein: 38.0, carbs: 6.0, fat: 14.0 },
  'butter chicken': { serving: '1 portion (250g)', unitWeightGram: 250, calories: 490, protein: 30.0, carbs: 12.0, fat: 35.0 },
  'chicken curry': { serving: '1 portion (250g)', unitWeightGram: 250, calories: 330, protein: 32.0, carbs: 10.0, fat: 18.0 },
  'chicken breast': { serving: '100g cooked', unitWeightGram: 100, calories: 165, protein: 31.0, carbs: 0.0, fat: 3.6 },
  'grilled chicken breast': { serving: '100g cooked', unitWeightGram: 100, calories: 165, protein: 31.0, carbs: 0.0, fat: 3.6 },
  'chicken': { serving: '100g cooked', unitWeightGram: 100, calories: 190, protein: 28.0, carbs: 0.5, fat: 8.0 },
  'mutton': { serving: '100g cooked', unitWeightGram: 100, calories: 265, protein: 23.0, carbs: 1.0, fat: 19.0 },

  // --- Eggs & Produce ---
  'boiled egg': { serving: '1 large egg', calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8 },
  'scrambled egg': { serving: '1 large egg', calories: 91, protein: 6.1, carbs: 1.0, fat: 6.7 },
  'egg': { serving: '1 large egg', calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8 },
  'eggs': { serving: '1 large egg', calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8 },
  'avocado': { serving: '1 medium (150g)', unitWeightGram: 150, calories: 240, protein: 3.0, carbs: 12.0, fat: 22.0 },
  'banana': { serving: '1 medium (118g)', unitWeightGram: 118, calories: 105, protein: 1.3, carbs: 27.0, fat: 0.3 },
  'apple': { serving: '1 medium (182g)', unitWeightGram: 182, calories: 95, protein: 0.5, carbs: 25.0, fat: 0.3 },
  'oats': { serving: '1 cup cooked (234g)', unitWeightGram: 234, calories: 158, protein: 6.0, carbs: 27.0, fat: 3.0 },
  'milk': { serving: '1 cup (240ml)', unitWeightGram: 240, calories: 149, protein: 7.7, carbs: 11.7, fat: 8.0 },
  'appy fizz': { serving: '1 bottle (250ml)', unitWeightGram: 250, calories: 120, protein: 0.0, carbs: 30.0, fat: 0.0 },
};

function determineMealType(): MealType {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 16) return 'lunch';
  if (hour >= 16 && hour < 22) return 'dinner';
  return 'snack';
}

function parseQuantityWord(str: string): number {
  const wordMap: Record<string, number> = {
    a: 1, an: 1, one: 1, single: 1, two: 2, double: 2, pair: 2,
    three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    half: 0.5, quarter: 0.25, small: 1.0, medium: 1.2, large: 1.5,
  };
  const cleaned = str.trim().toLowerCase();
  if (wordMap[cleaned] !== undefined) return wordMap[cleaned];
  if (cleaned === '1/2' || cleaned === 'half') return 0.5;
  if (cleaned === '1/4' || cleaned === 'quarter') return 0.25;
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 1 : parsed;
}

function normalizePromptTokens(rawPrompt: string): string {
  return rawPrompt
    .replace(/(\d+)([a-zA-Z]+)/g, '$1 $2')
    .replace(/^i\s+(?:had|ate|drank|consumed|enjoyed|got|ordered|bought)\s+/gi, '')
    .replace(/^(?:from\s+(?:zepto|blinkit|instamart|swiggy|zomato))\s+/gi, '')
    .replace(/^(?:for\s+(?:breakfast|lunch|dinner|snack|my\s+meal)\s+(?:i\s+had|i\s+ate)?)\s+/gi, '')
    .replace(/^(?:today|just)\s+/gi, '')
    .trim();
}

function extractQuantityAndName(clauseText: string): {
  foodName: string;
  qty: number;
  explicitWeightGram: number | null;
} {
  let text = clauseText.trim();
  let explicitWeightGram: number | null = null;
  let qty = 1;

  // Step A: Extract trailing volume e.g. "frubon protein milk 500ml" or "frubon protein milk 500 ml"
  const trailingVol = text.match(/^(.*?)\s+(\d+(?:\.\d+)?)\s*(ml|milliliters?|l|liters?|litres?)$/i);
  if (trailingVol) {
    const volVal = parseFloat(trailingVol[2]);
    const unitStr = trailingVol[3].trim();
    const isLiter = /^l$|^liters?$|^litres?$/i.test(unitStr); // Match ONLY literals for liters, not "ml"!
    explicitWeightGram = isLiter ? volVal * 1000 : volVal;
    text = trailingVol[1].trim();
  } else {
    // Step B: Extract leading volume e.g. "500ml frubon protein milk"
    const leadingVol = text.match(/^(\d+(?:\.\d+)?)\s*(ml|milliliters?|l|liters?|litres?)(?:\s+of)?\s+(.*)$/i);
    if (leadingVol) {
      const volVal = parseFloat(leadingVol[1]);
      const unitStr = leadingVol[2].trim();
      const isLiter = /^l$|^liters?$|^litres?$/i.test(unitStr);
      explicitWeightGram = isLiter ? volVal * 1000 : volVal;
      text = leadingVol[3].trim();
    }
  }

  // Step C: Extract trailing weight e.g. "rice 50g" or "grilled chicken 150gm"
  if (!explicitWeightGram) {
    const trailingWeight = text.match(/^(.*?)\s+(\d+(?:\.\d+)?)\s*(g|gm|grams?|oz|ounces?)$/i);
    if (trailingWeight) {
      const weightVal = parseFloat(trailingWeight[2]);
      const unitStr = trailingWeight[3].trim();
      const isOz = /^oz$|^ounces?$/i.test(unitStr);
      explicitWeightGram = isOz ? weightVal * 28.35 : weightVal;
      text = trailingWeight[1].trim();
    } else {
      // Step D: Extract leading weight e.g. "50g rice"
      const leadingWeight = text.match(/^(\d+(?:\.\d+)?)\s*(g|gm|grams?|oz|ounces?)(?:\s+of)?\s+(.*)$/i);
      if (leadingWeight) {
        const weightVal = parseFloat(leadingWeight[1]);
        const unitStr = leadingWeight[2].trim();
        const isOz = /^oz$|^ounces?$/i.test(unitStr);
        explicitWeightGram = isOz ? weightVal * 28.35 : weightVal;
        text = leadingWeight[3].trim();
      }
    }
  }

  // Step E: Extract count quantity e.g. "2 bottles", "6 eggs", "1 scoop"
  const qtyMatch = text.match(/^(\d+(?:\.\d+)?|\d+\/\d+|two|three|four|five|six|seven|eight|nine|ten|a|an|half|quarter|small|medium|large|1 scoop|2 scoops)\s*(?:x|slices?|pieces?|cups?|tbsp|scoops?|bottles?|cans?|packs?|boxes?|bars?|bowls?|plates?)?\s*(?:of)?\s+(.*)/i);

  if (qtyMatch) {
    qty = parseQuantityWord(qtyMatch[1]);
    text = qtyMatch[2].replace(/^of\s+/i, '').trim();
  }

  return { foodName: text, qty, explicitWeightGram };
}

function parseSingleClause(clauseText: string): Omit<FoodItem, 'id'> | null {
  const { foodName, qty, explicitWeightGram } = extractQuantityAndName(clauseText);
  if (!foodName || foodName.length < 2) return null;

  const foodNameLower = foodName.toLowerCase();

  // Find longest matching key in master database
  let bestKey = '';
  for (const key of Object.keys(MASTER_FOOD_DATABASE)) {
    if (foodNameLower.includes(key) && key.length > bestKey.length) {
      bestKey = key;
    }
  }

  if (bestKey) {
    const base = MASTER_FOOD_DATABASE[bestKey];
    let multiplier = qty;

    if (explicitWeightGram && base.unitWeightGram) {
      multiplier = explicitWeightGram / base.unitWeightGram;
    } else if (explicitWeightGram && !base.unitWeightGram) {
      multiplier = explicitWeightGram / 100;
    }

    const capitalizedName = foodName.charAt(0).toUpperCase() + foodName.slice(1);
    const cleanBaseServing = base.serving.replace(/^\(|\)$/g, '');
    const servingLabel = explicitWeightGram
      ? `${Math.round(explicitWeightGram)}ml/g`
      : qty !== 1
      ? `${qty}x (${cleanBaseServing})`
      : cleanBaseServing;

    return {
      name: capitalizedName,
      servingSize: servingLabel,
      calories: Math.round(base.calories * multiplier),
      protein: Math.round(base.protein * multiplier * 10) / 10,
      carbs: Math.round(base.carbs * multiplier * 10) / 10,
      fat: Math.round(base.fat * multiplier * 10) / 10,
    };
  }

  // Fallback entity heuristic
  const capitalizedName = foodName.charAt(0).toUpperCase() + foodName.slice(1);
  const isBeverageOrSoda = /fizz|drink|soda|juice|cola|pop|tea|lemonade|beverage|water|cider|syrup|candy|sugar/i.test(foodName);
  const isProteinItem = /protein|shake|lassi|whey|bar/i.test(foodName);

  if (isProteinItem) {
    const mult = explicitWeightGram ? explicitWeightGram / 250 : qty;
    return {
      name: capitalizedName,
      servingSize: explicitWeightGram ? `${Math.round(explicitWeightGram)}ml` : qty > 1 ? `${qty}x packs` : '1 pack',
      calories: Math.round(150 * mult),
      protein: Math.round(15.0 * mult * 10) / 10,
      carbs: Math.round(14.0 * mult * 10) / 10,
      fat: Math.round(2.0 * mult * 10) / 10,
    };
  } else if (isBeverageOrSoda) {
    return {
      name: capitalizedName,
      servingSize: qty > 1 ? `${qty} drinks` : '1 drink',
      calories: Math.round(110 * qty),
      protein: 0.0,
      carbs: Math.round(27.0 * qty * 10) / 10,
      fat: 0.0,
    };
  }

  return {
    name: capitalizedName,
    servingSize: explicitWeightGram ? `${Math.round(explicitWeightGram)}g` : qty > 1 ? `${qty} portions` : '1 portion',
    calories: Math.round(150 * qty),
    protein: Math.round(4.0 * qty * 10) / 10,
    carbs: Math.round(20.0 * qty * 10) / 10,
    fat: Math.round(5.0 * qty * 10) / 10,
  };
}

function parseMealPromptMaster(promptText: string): Omit<FoodItem, 'id'>[] {
  const text = normalizePromptTokens(promptText);

  // Biryani Total Weight Specification e.g. "100 g chicken and 500 g biryani"
  if (/biryani/i.test(text)) {
    const doubleWeightMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:g|gm|grams?)\s+([a-zA-Z\s]+)(?:and|in|with|\+)\s+(\d+(?:\.\d+)?)\s*(?:g|gm|grams?)\s+(.*)/i) ||
                              text.match(/(\d+(?:\.\d+)?)\s*(?:g|gm|grams?)\s+(.*)\s+(?:in|with|\+)\s+(\d+(?:\.\d+)?)\s*(?:g|gm|grams?)\s+([a-zA-Z\s]+)/i);

    if (doubleWeightMatch) {
      const w1 = parseFloat(doubleWeightMatch[1]);
      const name1 = doubleWeightMatch[2].trim();
      const w2 = parseFloat(doubleWeightMatch[3]);

      let meatWeightGram = 0;
      let meatName = '';
      let totalDishWeightGram = 0;

      if (/chicken|mutton|lamb|paneer|fish/i.test(name1)) {
        meatWeightGram = w1;
        meatName = name1;
        totalDishWeightGram = w2;
      } else {
        meatWeightGram = w2;
        meatName = doubleWeightMatch[4].trim();
        totalDishWeightGram = w1;
      }

      if (meatWeightGram > 0 && totalDishWeightGram > meatWeightGram) {
        const remainingRiceWeight = totalDishWeightGram - meatWeightGram;
        const capMeatName = meatName.charAt(0).toUpperCase() + meatName.slice(1);
        const riceWeight = Math.round(remainingRiceWeight * 0.85);
        const friedOnionGheeWeight = Math.round(remainingRiceWeight * 0.15);

        return [
          {
            name: `Dum Marinated ${capMeatName} Pieces`,
            servingSize: `${Math.round(meatWeightGram)}g cooked`,
            calories: Math.round(210 * (meatWeightGram / 100)),
            protein: Math.round(26.0 * (meatWeightGram / 100) * 10) / 10,
            carbs: Math.round(1.5 * (meatWeightGram / 100) * 10) / 10,
            fat: Math.round(11.5 * (meatWeightGram / 100) * 10) / 10,
          },
          {
            name: 'Dum Biryani Basmati Rice (Ghee & Spices)',
            servingSize: `${riceWeight}g (from ${Math.round(totalDishWeightGram)}g total)`,
            calories: Math.round(205 * (riceWeight / 100)),
            protein: Math.round(3.8 * (riceWeight / 100) * 10) / 10,
            carbs: Math.round(30.0 * (riceWeight / 100) * 10) / 10,
            fat: Math.round(8.2 * (riceWeight / 100) * 10) / 10,
          },
          {
            name: 'Deep Fried Onions (Birista) & Dum Ghee',
            servingSize: `${friedOnionGheeWeight}g portion`,
            calories: Math.round(440 * (friedOnionGheeWeight / 50)),
            protein: Math.round(3.0 * (friedOnionGheeWeight / 50) * 10) / 10,
            carbs: Math.round(16.0 * (friedOnionGheeWeight / 50) * 10) / 10,
            fat: Math.round(40.0 * (friedOnionGheeWeight / 50) * 10) / 10,
          },
        ];
      }
    }
  }

  // Split clauses by "and", ",", "+", "with", "plus"
  const clauses = text.split(/,|\s+and\s+|\s*\+\s*|\s+with\s+|\s+plus\s+/gi);
  const items: Omit<FoodItem, 'id'>[] = [];

  for (const clause of clauses) {
    const parsed = parseSingleClause(clause);
    if (parsed) items.push(parsed);
  }

  if (items.length === 0) {
    items.push({
      name: 'Logged Meal',
      servingSize: '1 portion',
      calories: 250,
      protein: 10.0,
      carbs: 30.0,
      fat: 8.0,
    });
  }

  return items;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid meal description prompt.' },
        { status: 400 }
      );
    }

    const clientKey = req.headers.get('x-gemini-api-key');
    const envKey = process.env.GEMINI_API_KEY;
    const apiKey = (clientKey && clientKey.trim().length > 10) ? clientKey.trim() : envKey;

    if (apiKey && apiKey.length > 10) {
      const geminiModels = ['gemini-1.5-flash', 'gemini-1.5-pro'];

      const systemPrompt = `You are Gemini AI acting as Veritas, an expert clinical nutritionist.
Analyze the user's natural language meal description and return an exact itemized food breakdown.

CRITICAL PRODUCT & PORTION RULES:
1. WHEY / MUSCLEBLAZE PROTEIN SHAKE: 1 scoop of MuscleBlaze or Whey Protein Powder is ~120 kcal, 24g-25g Protein, 2g Carbs, 1.5g Fat.
2. VOLUME SCALING: "frubon protein milk 500ml" contains 500ml (2x 250ml bottles) = 300 kcal, 30g Protein, 28g Carbs, 4g Fat!
3. FLAVORED MILK vs HIGH PROTEIN MILK: "Amul blueberry shake" is a high-protein drink containing 20g Protein per 200ml pack.
4. RICE WEIGHT: "50gm rice" is 50g cooked rice = ~65 kcal, 1.4g Protein, 14g Carbs.

Return ONLY valid JSON matching this schema:
{
  "mealType": "breakfast" | "lunch" | "dinner" | "snack",
  "items": [
    {
      "name": "Food / Brand Item Name",
      "servingSize": "Exact portion",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number
    }
  ],
  "totals": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  },
  "summaryNote": "1-sentence concise nutritional summary"
}`;

      for (const model of geminiModels) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [
                      { text: systemPrompt },
                      { text: `User Meal Description: "${prompt.trim()}"` },
                    ],
                  },
                ],
                generationConfig: {
                  responseMimeType: 'application/json',
                  temperature: 0.1,
                },
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (jsonText) {
              const parsedData = JSON.parse(jsonText);
              const items: Omit<FoodItem, 'id'>[] = parsedData.items || [];
              const totals = items.reduce(
                (acc, item) => ({
                  calories: acc.calories + Number(item.calories || 0),
                  protein: Math.round((acc.protein + Number(item.protein || 0)) * 10) / 10,
                  carbs: Math.round((acc.carbs + Number(item.carbs || 0)) * 10) / 10,
                  fat: Math.round((acc.fat + Number(item.fat || 0)) * 10) / 10,
                }),
                { calories: 0, protein: 0, carbs: 0, fat: 0 }
              );

              return NextResponse.json({
                success: true,
                mealType: parsedData.mealType || determineMealType(),
                items,
                totals,
                summaryNote: parsedData.summaryNote || `Parsed by Gemini AI (${model})`,
              });
            }
          }
        } catch {
          // fallback
        }
      }
    }

    // Master Clinical Engine
    const items = parseMealPromptMaster(prompt);
    const totals = items.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: Math.round((acc.protein + item.protein) * 10) / 10,
        carbs: Math.round((acc.carbs + item.carbs) * 10) / 10,
        fat: Math.round((acc.fat + item.fat) * 10) / 10,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return NextResponse.json({
      success: true,
      mealType: determineMealType(),
      items,
      totals,
      summaryNote: 'Parsed by Veritas Master Clinical Engine',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to parse meal prompt';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
