export interface EmotionalPeak {
  start_time: number;
  end_time: number;
  emotion_type: 'inspiration' | 'shock' | 'curiosity' | 'urgency' | 'excitement';
  confidence: number;
  trigger_phrase: string;
  why_peak: string;
}

export interface ViralClip {
  clip_id: string;
  start_time: number;
  end_time: number;
  transcript: string;
  emotion: string;
  intensity_score: number;
  retention_score: number;
  viral_reason: string;
  audience_type: string;
}

export interface HookOption {
  text: string;
  type: 'curiosity' | 'shock' | 'value';
}

export interface ClipHooks {
  clip_id: string;
  hooks: HookOption[];
}

export interface CaptionPhrase {
  start_time: number;
  end_time: number;
  text: string;
  highlight: string[];
}

export interface ClipCaptions {
  clip_id: string;
  captions: CaptionPhrase[];
}

export interface ViralScore {
  clip_id: string;
  viral_score: number;
  breakdown: {
    emotion: string;
    relatability: string;
    hook: string;
    retention: string;
  };
  improvement_suggestion: string;
}

export interface EditingStyle {
  clip_id: string;
  editing_style: 'zoom cuts' | 'jump cuts' | 'face focus';
  caption_style: 'bold' | 'color highlight' | 'emojis';
  camera_focus: 'face' | 'object' | 'dynamic crop';
  thumbnail_frame: string;
}

export interface PostDay {
  day: string;
  clip_id: string;
  best_platform: string;
  hashtags: string[];
  posting_time: string;
  strategy_reason: string;
}

export interface GrowthStrategy {
  posting_plan: PostDay[];
}

export interface AnalysisResult {
  emotional_peaks: EmotionalPeak[];
  viral_clips: ViralClip[];
  hooks: ClipHooks[];
  captions: ClipCaptions[];
  scores: ViralScore[];
  editing_plan: EditingStyle[];
  growth_strategy: GrowthStrategy;
}

export interface ProcessingState {
  status: 'idle' | 'uploading' | 'analyzing' | 'cropping' | 'ready';
  progress: number;
  message: string;
}
