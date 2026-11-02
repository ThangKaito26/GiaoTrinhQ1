import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

function getAIClient() {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Simple in-memory caches for fast repeated lookups and TTS playback
const ttsCache = new Map<string, string>();
const dictCache = new Map<string, unknown>();

const VOICE_STYLE_PROFILES: Record<string, string> = {
  Kore: 'Speak in standard Mandarin Chinese (Putonghua) as a clear, articulate female Beijing teacher',
  Puck: 'Speak in standard Mandarin Chinese (Putonghua) as an energetic, friendly young male native speaker',
  Zephyr: 'Speak in standard Mandarin Chinese (Putonghua) as a soft, gentle, warm female speaker',
  Charon: 'Speak in standard Mandarin Chinese (Putonghua) as a deep, calm, mature male radio announcer',
  Fenrir: 'Speak in standard Mandarin Chinese (Putonghua) as a crisp, resonant male language instructor',
};

const VOICE_TTS_ENDPOINTS: Record<
  string,
  (encodedText: string, slow: boolean) => string[]
> = {
  // Kore: Standard articulate Beijing Female (Google zh-CN primary)
  Kore: (q, slow) => [
    `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=zh-CN&client=tw-ob&ttsspeed=${
      slow ? '0.24' : '1'
    }&q=${q}`,
    `https://fanyi.baidu.com/gettts?lan=zh&spd=${
      slow ? '3' : '5'
    }&source=web&text=${q}`,
  ],
  // Puck: Young natural Male (Baidu spd=6 base so 0.88x native resampling yields natural tempo + male pitch)
  Puck: (q, slow) => [
    `https://fanyi.baidu.com/gettts?lan=zh&spd=${
      slow ? '4' : '6'
    }&source=web&text=${q}`,
    `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=zh-CN&client=tw-ob&ttsspeed=${
      slow ? '0.24' : '1'
    }&q=${q}`,
  ],
  // Zephyr: Gentle warm Female (Baidu spd=4 base so 1.06x native resampling yields soft bright female timbre)
  Zephyr: (q, slow) => [
    `https://fanyi.baidu.com/gettts?lan=zh&spd=${
      slow ? '3' : '4'
    }&source=web&text=${q}`,
    `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=zh-TW&client=tw-ob&ttsspeed=${
      slow ? '0.24' : '1'
    }&q=${q}`,
  ],
  // Charon: Deep calm Male (Baidu spd=7 base so 0.83x native resampling yields warm baritone pitch)
  Charon: (q, slow) => [
    `https://fanyi.baidu.com/gettts?lan=zh&spd=${
      slow ? '4' : '7'
    }&source=web&text=${q}`,
    `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=zh-CN&client=tw-ob&ttsspeed=${
      slow ? '0.24' : '1'
    }&q=${q}`,
  ],
  // Fenrir: Crisp resonant Male instructor (Google zh-CN base with 0.89x native resampling)
  Fenrir: (q, slow) => [
    `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=zh-CN&client=tw-ob&ttsspeed=${
      slow ? '0.24' : '1'
    }&q=${q}`,
    `https://fanyi.baidu.com/gettts?lan=zh&spd=${
      slow ? '4' : '6'
    }&source=web&text=${q}`,
  ],
};

async function fetchMandarinAudioBase64(
  text: string,
  voiceName: string,
  slow: boolean
): Promise<{ base64: string; mimeType: string } | null> {
  const encoded = encodeURIComponent(text);
  const builder = VOICE_TTS_ENDPOINTS[voiceName] || VOICE_TTS_ENDPOINTS.Kore;
  const candidateUrls = builder(encoded, slow);

  for (const url of candidateUrls) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Accept: 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8',
        },
      });
      if (response.ok) {
        const arrayBuf = await response.arrayBuffer();
        if (arrayBuf.byteLength > 256) {
          const base64 = Buffer.from(arrayBuf).toString('base64');
          const contentType =
            response.headers.get('content-type') || 'audio/mpeg';
          return { base64, mimeType: contentType };
        }
      }
    } catch {
      // Try next candidate URL
    }
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  // 1. Multi-Persona Mandarin Text-to-Speech Endpoint (Quota-free & Fast)
  app.post('/api/tts', async (req, res) => {
    try {
      const { text, voiceName = 'Kore', slow = false } = req.body as {
        text?: string;
        voiceName?: string;
        slow?: boolean;
      };

      if (!text || !text.trim()) {
        res.status(400).json({ error: 'Missing text for TTS' });
        return;
      }

      const validVoice = ['Kore', 'Puck', 'Zephyr', 'Charon', 'Fenrir'].includes(
        voiceName
      )
        ? voiceName
        : 'Kore';

      const cleanText = text.trim();
      const cacheKey = `${validVoice}:${slow ? 'slow' : 'normal'}:${cleanText}`;
      if (ttsCache.has(cacheKey)) {
        res.json({
          audioBase64: ttsCache.get(cacheKey),
          mimeType: 'audio/mpeg',
          voiceName: validVoice,
          cached: true,
        });
        return;
      }

      const fetched = await fetchMandarinAudioBase64(
        cleanText,
        validVoice,
        Boolean(slow)
      );

      if (fetched) {
        if (ttsCache.size > 500) {
          const firstKey = ttsCache.keys().next().value;
          if (firstKey) ttsCache.delete(firstKey);
        }
        ttsCache.set(cacheKey, fetched.base64);

        res.json({
          audioBase64: fetched.base64,
          mimeType: fetched.mimeType,
          voiceName: validVoice,
          cached: false,
        });
        return;
      }

      res.json({
        audioBase64: null,
        fallback: true,
        voiceName: validVoice,
      });
    } catch {
      res.json({
        audioBase64: null,
        fallback: true,
      });
    }
  });

  // 2. Specialized Contextual Dictionary Lookup Endpoint
  app.post('/api/dictionary', async (req, res) => {
    try {
      const { hanzi, pinyin, contextSentence, lessonTitle } = req.body as {
        hanzi?: string;
        pinyin?: string;
        contextSentence?: string;
        lessonTitle?: string;
      };

      if (!hanzi || !hanzi.trim()) {
        res.status(400).json({ error: 'Missing word to look up' });
        return;
      }

      const cacheKey = `${hanzi.trim()}:${contextSentence || ''}`;
      if (dictCache.has(cacheKey)) {
        res.json(dictCache.get(cacheKey));
        return;
      }

      const prompt = `Tra cứu chuyên sâu từ vựng tiếng Trung "${hanzi.trim()}" ${
        pinyin ? `(Pinyin: ${pinyin})` : ''
      } trong ngữ cảnh Giáo Trình Tiếng Trung Quyển 1 (${
        lessonTitle || 'Sơ cấp'
      }).
${contextSentence ? `Câu ngữ cảnh trong sách: "${contextSentence}"` : ''}
Hãy cung cấp thông tin từ điển chuyên dụng thật chi tiết, dễ hiểu cho người Việt học tiếng Trung.`;

      const ai = getAIClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hanzi: { type: Type.STRING },
              pinyin: {
                type: Type.STRING,
                description: 'Phiên âm Pinyin chuẩn có dấu thanh điệu',
              },
              sinoVietnamese: {
                type: Type.STRING,
                description: 'Âm Hán Việt chuẩn',
              },
              partOfSpeech: {
                type: Type.STRING,
                description: 'Từ loại (Danh từ, Động từ, Tính từ, Đại từ, Trợ từ, Lượng từ...)',
              },
              coreMeaningVi: {
                type: Type.STRING,
                description: 'Nghĩa tiếng Việt đầy đủ, rõ ràng',
              },
              contextualUsageVi: {
                type: Type.STRING,
                description:
                  'Giải thích cách dùng của từ trong ngữ cảnh cụ thể của bài học và cấu trúc thường đi kèm.',
              },
              radicalAndComponents: {
                type: Type.STRING,
                description:
                  'Phân tích bộ thủ và mẹo nhớ chữ Hán ngắn gọn, thú vị.',
              },
              synonymsAndRelated: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    hanzi: { type: Type.STRING },
                    pinyin: { type: Type.STRING },
                    meaningVi: { type: Type.STRING },
                    relationType: {
                      type: Type.STRING,
                      description: 'Đồng nghĩa / Trái nghĩa / Từ cùng chủ đề',
                    },
                    distinctionVi: {
                      type: Type.STRING,
                      description: 'Điểm giống hoặc khác nhau ngắn gọn',
                    },
                  },
                },
              },
              collocations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    hanzi: { type: Type.STRING },
                    pinyin: { type: Type.STRING },
                    meaningVi: { type: Type.STRING },
                  },
                },
              },
              examples: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    hanzi: { type: Type.STRING },
                    pinyin: { type: Type.STRING },
                    meaningVi: { type: Type.STRING },
                    contextLabel: { type: Type.STRING },
                  },
                },
              },
            },
            required: [
              'hanzi',
              'pinyin',
              'sinoVietnamese',
              'partOfSpeech',
              'coreMeaningVi',
              'contextualUsageVi',
              'radicalAndComponents',
              'synonymsAndRelated',
              'collocations',
              'examples',
            ],
          },
        },
      });

      const jsonText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(jsonText);
      dictCache.set(cacheKey, parsed);
      res.json(parsed);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Không thể tra cứu từ điển AI';
      console.error('Dictionary API Error:', message);
      res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
