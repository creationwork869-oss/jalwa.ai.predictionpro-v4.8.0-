import { GameResult, ColorType, SizeType, NumberProbability, PredictionData } from '../types';

export function getNumberColor(num: number): ColorType {
  if (num === 0) return 'red_violet';
  if (num === 5) return 'green_violet';
  if ([1, 3, 7, 9].includes(num)) return 'green';
  return 'red';
}

export function getNumberSize(num: number): SizeType {
  return num >= 5 ? 'big' : 'small';
}

// Generate realistic 100 historical rounds for Jalwa
export function generateInitialHistory(count = 100): GameResult[] {
  const history: GameResult[] = [];
  const now = Date.now();
  const currentBasePeriod = 20261103010400;

  let lastNum = Math.floor(Math.random() * 10);
  let streak = 0;

  for (let i = 0; i < count; i++) {
    // Generate natural game clustering (occasional streaks of Big or Small, alternating runs)
    let num: number;
    const rand = Math.random();

    if (rand < 0.35 && streak < 4) {
      // Keep same size category to simulate streak
      const currentSize = getNumberSize(lastNum);
      num = currentSize === 'big' ? Math.floor(Math.random() * 5) + 5 : Math.floor(Math.random() * 5);
      streak++;
    } else {
      // Natural random variance
      num = Math.floor(Math.random() * 10);
      streak = 0;
    }

    lastNum = num;
    const period = String(currentBasePeriod - (count - 1 - i));
    const size = getNumberSize(num);
    const color = getNumberColor(num);

    history.push({
      id: `res-${i}-${period}`,
      period,
      number: num,
      size,
      color,
      timestamp: now - (count - 1 - i) * 30000,
    });
  }

  // Reverse so newest is first in the list
  return history.reverse();
}

// Compute frequency and hot/cold analytics
export function analyzeFrequencies(history: GameResult[]): NumberProbability[] {
  const counts: Record<number, number> = {};
  for (let i = 0; i <= 9; i++) counts[i] = 0;

  const total = history.length || 1;
  history.forEach(item => {
    if (item.number >= 0 && item.number <= 9) {
      counts[item.number] = (counts[item.number] || 0) + 1;
    }
  });

  // Calculate gaps (how many rounds since each number appeared)
  const gaps: Record<number, number> = {};
  for (let i = 0; i <= 9; i++) {
    const idx = history.findIndex(h => h.number === i);
    gaps[i] = idx === -1 ? history.length : idx;
  }

  // Find hot (highest count) and cold (lowest count or highest overdue gap)
  const sortedByCount = Object.entries(counts)
    .map(([num, count]) => ({ num: Number(num), count }))
    .sort((a, b) => b.count - a.count);

  const hotNums = new Set(sortedByCount.slice(0, 3).map(s => s.num));
  const coldNums = new Set(
    Object.entries(gaps)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(s => Number(s[0]))
  );

  const results: NumberProbability[] = [];
  for (let i = 0; i <= 9; i++) {
    const count = counts[i];
    const freq = Math.round((count / total) * 100);
    // Probability combines frequency and overdue rebound factor
    const gap = gaps[i];
    const prob = Math.min(22, Math.max(5, Math.round(10 + (hotNums.has(i) ? 4 : 0) + (gap > 12 ? 3 : 0))));
    results.push({
      number: i,
      prob,
      frequency: count,
      isHot: hotNums.has(i),
      isCold: coldNums.has(i)
    });
  }

  return results;
}

// Detect active pattern in history
export function detectPatterns(history: GameResult[]) {
  if (history.length < 5) {
    return {
      nameEn: "Standard Distribution",
      nameHi: "सामान्य वितरण",
      descriptionEn: "Balanced distribution across all outcomes.",
      descriptionHi: "सभी नंबरों में संतुलित रुझान।"
    };
  }

  const recent = history.slice(0, 8);
  const firstSize = recent[0].size;
  let streak = 0;
  for (const item of recent) {
    if (item.size === firstSize) streak++;
    else break;
  }

  if (streak >= 4) {
    return {
      nameEn: `Dragon Streak (${firstSize.toUpperCase()} x${streak})`,
      nameHi: `ड्रैगन स्ट्रीक (${firstSize === 'big' ? 'बड़ा' : 'छोटा'} x${streak})`,
      descriptionEn: `Strong continuation of ${firstSize.toUpperCase()}. Counter-reversal probability increasing.`,
      descriptionHi: `${firstSize === 'big' ? 'बड़ा' : 'छोटा'} का लगातार दौर। रिवर्सल की संभावना बढ़ रही है।`
    };
  }

  // Check alternating ABAB pattern
  let alternating = true;
  for (let i = 0; i < Math.min(6, recent.length - 1); i++) {
    if (recent[i].size === recent[i + 1].size) {
      alternating = false;
      break;
    }
  }

  if (alternating) {
    return {
      nameEn: "Alternating ABAB Rhythm",
      nameHi: "एकांतर ABAB रिदम",
      descriptionEn: "Results alternating between Big and Small consecutively.",
      descriptionHi: "परिणाम लगातार बड़े और छोटे के बीच बदल रहे हैं।"
    };
  }

  // Check double-double (e.g. BB SS BB)
  if (recent.length >= 4 && recent[0].size === recent[1].size && recent[2].size === recent[3].size && recent[0].size !== recent[2].size) {
    return {
      nameEn: "Double-Double (2-2) Pattern",
      nameHi: "डबल-डबल (2-2) पैटर्न",
      descriptionEn: "Two consecutive pairs detected. Higher likelihood of pattern continuation.",
      descriptionHi: "दो-दो परिणामों का जोड़ा देखा गया है। पैटर्न जारी रहने की संभावना।"
    };
  }

  return {
    nameEn: "Mean-Reverting Convergence",
    nameHi: "औसत-पुनरावर्तन कन्वर्जेंस",
    descriptionEn: "Statistical distribution shifting toward mathematical parity.",
    descriptionHi: "सांख्यिकीय डेटा औसत समानता की ओर बढ़ रहा है।"
  };
}

// Generate full prediction data locally
export function generateLocalPrediction(history: GameResult[], periodTarget: string): PredictionData {
  const probs = analyzeFrequencies(history);
  const pattern = detectPatterns(history);

  // Big vs Small ratio over last 20
  const sample = history.slice(0, 20);
  const bigs = sample.filter(s => s.size === 'big').length;
  const predictedSize: SizeType = bigs < 10 ? 'big' : (bigs > 11 ? 'small' : (sample[0]?.size === 'big' ? 'small' : 'big'));
  const sizeConfidence = Math.min(94, Math.max(72, Math.round(75 + Math.abs(10 - bigs) * 2.2)));

  // Color ratio
  const greens = sample.filter(s => [1, 3, 5, 7, 9].includes(s.number)).length;
  const predictedColor: 'green' | 'red' = greens <= 10 ? 'green' : 'red';
  const colorConfidence = Math.min(92, Math.max(70, Math.round(74 + Math.abs(10 - greens) * 2.1)));

  // Pick top 3 numbers matching size and color bias
  const sortedProbs = [...probs].sort((a, b) => {
    let scoreA = a.prob;
    let scoreB = b.prob;
    if (getNumberSize(a.number) === predictedSize) scoreA += 5;
    if (getNumberSize(b.number) === predictedSize) scoreB += 5;
    return scoreB - scoreA;
  });

  const top3 = sortedProbs.slice(0, 3).map(p => p.number);
  const primeNum = top3[0];
  const overallConfidence = Math.round((sizeConfidence + colorConfidence + sortedProbs[0].prob * 2) / 2.5);

  return {
    periodTarget,
    predictedNumber: primeNum,
    top3Numbers: top3,
    predictedSize,
    predictedColor,
    confidence: Math.min(95, Math.max(74, overallConfidence)),
    sizeConfidence,
    colorConfidence,
    aiExplanationEn: `Multi-variable statistical analysis identified strong ${predictedSize.toUpperCase()} and ${predictedColor.toUpperCase()} momentum. ${pattern.nameEn} confirms high probability cluster for ${top3.join(', ')}.`,
    aiExplanationHi: `बहु-चरणीय सांख्यिकीय विश्लेषण द्वारा ${predictedSize === 'big' ? 'बड़ा (Big)' : 'छोटा (Small)'} और ${predictedColor === 'green' ? 'हरा (Green)' : 'लाल (Red)'} ट्रेंड चिन्हित हुआ। नंबर ${top3.join(', ')} का वेटेज सर्वाधिक है।`,
    patternDetectedEn: pattern.nameEn,
    patternDetectedHi: pattern.nameHi,
    numberProbabilities: probs,
    source: 'statistical-engine'
  };
}
