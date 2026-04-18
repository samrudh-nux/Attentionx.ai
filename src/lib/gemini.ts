import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 2000;

export const analyzeVideo = async (videoBase64: string, mimeType: string) => {
  let attempt = 0;

  const executeAnalysis = async (): Promise<any> => {
    try {
      const modelName = "gemini-1.5-flash-latest"; 
      console.log(`[Neural Engine] Attempt ${attempt + 1}: Starting analysis for ${mimeType} (${Math.round(videoBase64.length / 1024)} KB)`);

      const response = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [
            {
              inlineData: {
                data: videoBase64,
                mimeType: mimeType,
              },
            },
            {
              text: `You are an elite multimodal AI system combining:
- Viral content strategist
- Emotion detection expert
- Short-form video editor
- Growth hacker

You are powering "AttentionX" — an automated content repurposing engine.

INPUT:
- Video bitstream with audio and visual patterns

GOAL:
Convert long-form content into HIGH-PERFORMING short-form clips optimized for TikTok, Instagram Reels, and YouTube Shorts.

--------------------------------------------------

STEP 1: DETECT EMOTIONAL PEAKS
Identify segments where intensity increases, speaker shows passion, surprise, urgency, or insight.

--------------------------------------------------

STEP 2: EXTRACT VIRAL CLIPS
From transcript + emotional peaks, identify TOP 3–5 clips. Each clip must be self-contained and deliver value quickly.

--------------------------------------------------

STEP 3: GENERATE HOOKS
For EACH clip generate 3–5 hooks (curiosity gap, native to short-form).

--------------------------------------------------

STEP 4: GENERATE DYNAMIC CAPTIONS
Convert transcript into karaoke-style captions: 1–5 word phrases, synced with timestamps, key words highlighted.

--------------------------------------------------

STEP 5: VIRAL SCORING
Score each clip: Emotional Impact, Relatability, Hook Strength, Retention Potential.

--------------------------------------------------

STEP 6: SMART EDITING + VISUAL STYLE
Suggest editing style: zoom cuts, caption styles, dynamic crop.

--------------------------------------------------

STEP 7: GROWTH STRATEGY
Generate a 7-day content plan.

--------------------------------------------------

FINAL OUTPUT FORMAT:
You MUST return clean JSON according to the schema provided. No conversational text.`,
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          maxOutputTokens: 16384,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              emotional_peaks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    start_time: { type: Type.NUMBER },
                    end_time: { type: Type.NUMBER },
                    emotion_type: { type: Type.STRING },
                    confidence: { type: Type.NUMBER },
                    trigger_phrase: { type: Type.STRING },
                    why_peak: { type: Type.STRING }
                  },
                  required: ["start_time", "end_time", "emotion_type", "confidence", "trigger_phrase", "why_peak"]
                }
              },
              viral_clips: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    clip_id: { type: Type.STRING },
                    start_time: { type: Type.NUMBER },
                    end_time: { type: Type.NUMBER },
                    transcript: { type: Type.STRING },
                    emotion: { type: Type.STRING },
                    intensity_score: { type: Type.NUMBER },
                    retention_score: { type: Type.NUMBER },
                    viral_reason: { type: Type.STRING },
                    audience_type: { type: Type.STRING }
                  },
                  required: ["clip_id", "start_time", "end_time", "transcript", "emotion", "intensity_score", "retention_score", "viral_reason", "audience_type"]
                }
              },
              hooks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    clip_id: { type: Type.STRING },
                    hooks: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          text: { type: Type.STRING },
                          type: { type: Type.STRING }
                        }
                      }
                    }
                  }
                }
              },
              captions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    clip_id: { type: Type.STRING },
                    captions: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          start_time: { type: Type.NUMBER },
                          end_time: { type: Type.NUMBER },
                          text: { type: Type.STRING },
                          highlight: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                      }
                    }
                  }
                }
              },
              scores: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    clip_id: { type: Type.STRING },
                    viral_score: { type: Type.NUMBER },
                    breakdown: {
                      type: Type.OBJECT,
                      properties: {
                        emotion: { type: Type.STRING },
                        relatability: { type: Type.STRING },
                        hook: { type: Type.STRING },
                        retention: { type: Type.STRING }
                      }
                    },
                    improvement_suggestion: { type: Type.STRING }
                  }
                }
              },
              editing_plan: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    clip_id: { type: Type.STRING },
                    editing_style: { type: Type.STRING },
                    caption_style: { type: Type.STRING },
                    camera_focus: { type: Type.STRING },
                    thumbnail_frame: { type: Type.STRING }
                  }
                }
              },
              growth_strategy: {
                type: Type.OBJECT,
                properties: {
                  posting_plan: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        day: { type: Type.STRING },
                        clip_id: { type: Type.STRING },
                        best_platform: { type: Type.STRING },
                        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                        posting_time: { type: Type.STRING },
                        strategy_reason: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      let text = (response as any).text || (response as any).content || '{"viral_clips":[]}';
      
      const cleanRawText = (raw: string) => {
        let cleaned = raw;
        if (cleaned.includes('```')) {
          const matches = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (matches && matches[1]) cleaned = matches[1];
          else cleaned = cleaned.replace(/```(?:json)?/g, '').replace(/```/g, '');
        }
        return cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();
      };

      const fixTruncatedJson = (json: string) => {
        try {
          JSON.parse(json);
          return json;
        } catch (e) {
          console.warn("[Neural Engine] Truncated JSON detected, attempting reconstruction...");
          let countBraces = (json.match(/{/g) || []).length - (json.match(/}/g) || []).length;
          let countBrackets = (json.match(/\[/g) || []).length - (json.match(/]/g) || []).length;
          let fixed = json;
          const lastQuote = fixed.lastIndexOf('"');
          const lastBrace = fixed.lastIndexOf('{');
          const lastBracket = fixed.lastIndexOf('[');
          if (lastQuote > lastBrace && lastQuote > lastBracket) {
             const quoteCount = (fixed.match(/"/g) || []).length;
             if (quoteCount % 2 !== 0) fixed += '"';
          }
          while (countBrackets > 0) { fixed += ']'; countBrackets--; }
          while (countBraces > 0) { fixed += '}'; countBraces--; }
          try {
            JSON.parse(fixed);
            return fixed;
          } catch (e2) {
            return '{"viral_clips":[]}';
          }
        }
      };

      const sanitizedText = fixTruncatedJson(cleanRawText(text));
      const parsed = JSON.parse(sanitizedText);
      console.log("[Neural Engine] Analysis successful. Clips found:", parsed.viral_clips?.length);
      return parsed;
    } catch (error: any) {
      if (attempt < MAX_RETRIES) {
        attempt++;
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);
        console.warn(`[Neural Engine] Analysis Fault (Attempt ${attempt}):`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
        return executeAnalysis();
      }

      let errorMessage = "Neuro-Link Disruption (Terminal)";
      if (error && typeof error === 'object') {
        const rawMsg = error.message || JSON.stringify(error);
        if (rawMsg.includes('"message"')) {
          try {
            const parsed = JSON.parse(rawMsg.substring(rawMsg.indexOf('{')));
            errorMessage = parsed.error?.message || parsed.message || errorMessage;
          } catch (e) { errorMessage = rawMsg; }
        } else { errorMessage = rawMsg; }
      }
      
      if (errorMessage.includes("xhr error") || errorMessage.includes("500")) {
        errorMessage = "Cloud Proxy Congestion: Multimodal data heavy. Try shorter clip or retry.";
      }
      throw new Error(errorMessage);
    }
  };

  return executeAnalysis();
};
