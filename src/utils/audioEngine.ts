export interface PlayTrackItem {
  id: string;
  hanzi: string;
  pinyin?: string;
  meaningVi?: string;
  speaker?: string;
}

export interface VoicePersonaConfig {
  id: 'Kore' | 'Puck' | 'Zephyr' | 'Charon' | 'Fenrir';
  label: string;
  gender: 'female' | 'male';
  /**
   * Smooth hardware resampling factor (with preservesPitch = false).
   * Paired with server-side base speed compensation so tempo stays natural while vocal pitch & formant shift cleanly with ZERO buzzing/crackling!
   */
  nativePlaybackRate: number;
  preservesPitch: boolean;
  pitchFallback: number;
  tempoMultiplier: number;
}

export const VOICE_PERSONAS: Record<string, VoicePersonaConfig> = {
  Kore: {
    id: 'Kore',
    label: 'Nữ Bắc Kinh chuẩn (Kore)',
    gender: 'female',
    nativePlaybackRate: 1.0,
    preservesPitch: true,
    pitchFallback: 1.08,
    tempoMultiplier: 1.0,
  },
  Puck: {
    id: 'Puck',
    label: 'Nam trẻ tự nhiên (Puck)',
    gender: 'male',
    nativePlaybackRate: 0.88,
    preservesPitch: false,
    pitchFallback: 0.84,
    tempoMultiplier: 1.0,
  },
  Zephyr: {
    id: 'Zephyr',
    label: 'Nữ dịu dàng, truyền cảm (Zephyr)',
    gender: 'female',
    nativePlaybackRate: 1.06,
    preservesPitch: false,
    pitchFallback: 1.2,
    tempoMultiplier: 0.96,
  },
  Charon: {
    id: 'Charon',
    label: 'Nam trầm ấm, điềm tĩnh (Charon)',
    gender: 'male',
    nativePlaybackRate: 0.83,
    preservesPitch: false,
    pitchFallback: 0.72,
    tempoMultiplier: 0.95,
  },
  Fenrir: {
    id: 'Fenrir',
    label: 'Nam dứt khoát, rõ chữ (Fenrir)',
    gender: 'male',
    nativePlaybackRate: 0.91,
    preservesPitch: false,
    pitchFallback: 0.88,
    tempoMultiplier: 1.02,
  },
};

function base64ToMp3BlobUrl(base64: string): string {
  const binaryStr = window.atob(base64);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: 'audio/mpeg' });
  return URL.createObjectURL(blob);
}

class BookAudioController {
  private currentAudio: HTMLAudioElement | null = null;
  private currentBlobUrl: string | null = null;
  private audioCache = new Map<string, string>();
  private audioCtx: AudioContext | null = null;
  public isPlaying = false;
  public activeItemId: string | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!this.audioCtx) {
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public playPageFlipSound(enabled = true) {
    if (!enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const duration = 0.28;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const env = Math.sin((i / bufferSize) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * env * 0.12;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(950, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(
        2200,
        ctx.currentTime + duration
      );
      filter.Q.value = 1.6;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {
      // Ignore audio context restrictions
    }
  }

  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isPlaying = false;
    this.activeItemId = null;
  }

  private selectBrowserChineseVoice(
    persona: VoicePersonaConfig
  ): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return null;
    }
    const voices = window.speechSynthesis.getVoices();
    const zhVoices = voices.filter(
      (v) =>
        v.lang.toLowerCase().startsWith('zh') ||
        v.lang.toLowerCase().includes('cmn') ||
        v.name.toLowerCase().includes('chinese')
    );

    if (zhVoices.length === 0) return null;
    if (zhVoices.length === 1) return zhVoices[0];

    const maleHints = [
      'male',
      'yunxi',
      'yunjian',
      'kangkang',
      'zhiwei',
      'yunyang',
      'daniel',
      'li-mu',
    ];
    const femaleHints = [
      'female',
      'xiaoxiao',
      'xiaoyi',
      'huihui',
      'yaoyao',
      'ting-ting',
      'tingting',
      'meijia',
    ];

    if (persona.gender === 'male') {
      const matchedMale = zhVoices.find((v) =>
        maleHints.some((h) => v.name.toLowerCase().includes(h))
      );
      if (matchedMale) return matchedMale;
      const idx =
        persona.id === 'Puck'
          ? 1 % zhVoices.length
          : persona.id === 'Charon'
          ? (zhVoices.length - 1) % zhVoices.length
          : 2 % zhVoices.length;
      return zhVoices[idx];
    } else {
      const matchedFemale = zhVoices.find((v) =>
        femaleHints.some((h) => v.name.toLowerCase().includes(h))
      );
      if (matchedFemale && persona.id === 'Kore') return matchedFemale;
      return zhVoices[0];
    }
  }

  public async speakText(options: {
    text: string;
    rate?: number;
    voiceName?: string;
    useNeuralTTS?: boolean;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
  }): Promise<void> {
    const {
      text,
      rate = 1.0,
      voiceName = 'Kore',
      useNeuralTTS = true,
      onStart,
      onEnd,
      onError,
    } = options;

    this.stop();

    const persona = VOICE_PERSONAS[voiceName] || VOICE_PERSONAS.Kore;

    const cleanHanzi = text
      .replace(/Định ngữ \+ 的/g, '的')
      .replace(/\(|\)|\./g, ' ')
      .trim();

    if (!cleanHanzi) {
      onEnd?.();
      return;
    }

    if (useNeuralTTS) {
      try {
        const cacheKey = `${persona.id}:${
          rate <= 0.75 ? 'slow' : 'normal'
        }:${cleanHanzi}`;
        let base64 = this.audioCache.get(cacheKey);

        if (!base64) {
          const response = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: cleanHanzi,
              voiceName: persona.id,
              slow: rate <= 0.75,
            }),
          });

          if (response.ok) {
            const data = (await response.json()) as { audioBase64?: string };
            if (data.audioBase64) {
              base64 = data.audioBase64;
              this.audioCache.set(cacheKey, base64);
            }
          }
        }

        if (base64) {
          // Play pure, unchopped MP3 directly via native HTMLAudioElement with hardware resampling (zero buzzing!)
          const mp3Url = base64ToMp3BlobUrl(base64);
          this.currentBlobUrl = mp3Url;

          const userRateAdjustment = rate <= 0.75 ? 1.0 : rate;
          const finalPlaybackRate = Math.max(
            0.65,
            Math.min(1.6, persona.nativePlaybackRate * userRateAdjustment)
          );

          await new Promise<void>((resolve) => {
            const audio = new Audio(mp3Url);
            this.currentAudio = audio;

            // Configure pitch preservation: false allows smooth hardware resampling to shift pitch naturally without OLA buzzing
            const audioAny = audio as HTMLAudioElement & {
              preservesPitch?: boolean;
              mozPreservesPitch?: boolean;
              webkitPreservesPitch?: boolean;
            };
            audioAny.preservesPitch = persona.preservesPitch;
            audioAny.mozPreservesPitch = persona.preservesPitch;
            audioAny.webkitPreservesPitch = persona.preservesPitch;
            audio.playbackRate = finalPlaybackRate;

            this.isPlaying = true;
            onStart?.();

            audio.onended = () => {
              this.isPlaying = false;
              this.currentAudio = null;
              onEnd?.();
              resolve();
            };

            audio.onerror = () => {
              this.isPlaying = false;
              this.currentAudio = null;
              onEnd?.();
              resolve();
            };

            audio.play().catch(() => {
              this.isPlaying = false;
              this.currentAudio = null;
              onEnd?.();
              resolve();
            });
          });
          return;
        }
      } catch {
        // Fallback to browser SpeechSynthesis below
      }
    }

    // Browser Web Speech API Fallback
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      await new Promise<void>((resolve) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanHanzi);
        utterance.lang = 'zh-CN';
        utterance.rate = Math.max(
          0.5,
          Math.min(1.6, rate * persona.tempoMultiplier)
        );
        utterance.pitch = persona.pitchFallback;

        const chosenVoice = this.selectBrowserChineseVoice(persona);
        if (chosenVoice) {
          utterance.voice = chosenVoice;
        }

        utterance.onstart = () => {
          this.isPlaying = true;
          onStart?.();
        };

        utterance.onend = () => {
          this.isPlaying = false;
          onEnd?.();
          resolve();
        };

        utterance.onerror = () => {
          this.isPlaying = false;
          onError?.();
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      });
    } else {
      onEnd?.();
    }
  }
}

export const bookAudio = new BookAudioController();
