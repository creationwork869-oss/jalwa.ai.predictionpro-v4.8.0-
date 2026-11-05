export type ColorType = 'green' | 'red' | 'red_violet' | 'green_violet';
export type SizeType = 'big' | 'small';

export interface GameResult {
  id: string;
  period: string;
  number: number;
  size: SizeType;
  color: ColorType;
  timestamp: number;
}

export interface NumberProbability {
  number: number;
  prob: number;
  frequency: number;
  isHot?: boolean;
  isCold?: boolean;
}

export interface PredictionData {
  periodTarget: string;
  predictedNumber: number;
  top3Numbers: number[];
  predictedSize: SizeType;
  predictedColor: 'green' | 'red';
  confidence: number;
  sizeConfidence: number;
  colorConfidence: number;
  aiExplanationEn: string;
  aiExplanationHi: string;
  patternDetectedEn: string;
  patternDetectedHi: string;
  numberProbabilities: NumberProbability[];
  source: 'gemini-ai' | 'statistical-engine';
}

export interface PredictionHistoryItem {
  id: string;
  period: string;
  predictedNumber: number;
  top3Numbers: number[];
  predictedSize: SizeType;
  predictedColor: 'green' | 'red';
  actualNumber?: number;
  actualSize?: SizeType;
  actualColor?: ColorType;
  hitSize?: boolean;
  hitColor?: boolean;
  hitNumber?: boolean;
  hitTop3?: boolean;
  status: 'pending' | 'win' | 'loss' | 'partial';
  confidence: number;
  timestamp: number;
}

export interface UserAuth {
  isAuthenticated: boolean;
  isDemo: boolean;
  role: 'guest' | 'user' | 'admin';
  username: string;
  vipExpiry?: string;
}

export type Language = 'en' | 'hi';
