import React, { useState } from 'react';
import {
  Play,
  Square,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  ListMusic,
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react';
import { PlayTrackItem, VOICE_PERSONAS } from '../utils/audioEngine';

interface AudioPlayerBarProps {
  currentTrack: PlayTrackItem | null;
  isPlaying: boolean;
  playlist: PlayTrackItem[];
  playlistIndex: number;
  playbackRate: number;
  onChangeRate: (rate: number) => void;
  voiceName: string;
  onChangeVoice: (voice: string) => void;
  loopOne: boolean;
  onToggleLoopOne: () => void;
  autoAdvance: boolean;
  onToggleAutoAdvance: () => void;
  pageSoundEnabled: boolean;
  onTogglePageSound: () => void;
  onPlayResume: () => void;
  onStop: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentTrack,
  isPlaying,
  playlist,
  playlistIndex,
  playbackRate,
  onChangeRate,
  voiceName,
  onChangeVoice,
  loopOne,
  onToggleLoopOne,
  autoAdvance,
  onToggleAutoAdvance,
  pageSoundEnabled,
  onTogglePageSound,
  onPlayResume,
  onStop,
  onPrevTrack,
  onNextTrack,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('q1_audio_bar_collapsed');
      if (saved !== null) return saved === 'true';
    } catch {
      // ignore
    }
    return false;
  });

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('q1_audio_bar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const activeVoiceLabel =
    VOICE_PERSONAS[voiceName]?.label || 'Nữ Bắc Kinh chuẩn (Kore)';

  if (isCollapsed) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <Volume2
                className={`h-4 w-4 ${isPlaying ? 'animate-bounce' : ''}`}
              />
            </div>

            {currentTrack ? (
              <div className="flex items-baseline gap-2 min-w-0 flex-1 truncate">
                <span className="font-['Noto_Sans_SC'] text-xs sm:text-sm font-bold text-stone-900 truncate">
                  {currentTrack.hanzi}
                </span>
                {currentTrack.pinyin && (
                  <span className="hidden sm:inline font-mono text-xs text-amber-800 truncate">
                    [{currentTrack.pinyin}]
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 min-w-0 flex-1 truncate text-xs text-stone-700">
                <span className="font-semibold text-stone-900 whitespace-nowrap">
                  Quản lý giọng đọc:
                </span>
                <span className="truncate text-amber-900 font-medium">
                  {activeVoiceLabel} ({playbackRate}x)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isPlaying ? (
              <button
                onClick={onStop}
                className="inline-flex h-7 items-center gap-1 rounded-lg bg-rose-700 px-2.5 text-xs font-semibold text-white hover:bg-rose-800 transition-colors whitespace-nowrap"
              >
                <Square className="h-3 w-3 fill-current" />
                <span>Dừng</span>
              </button>
            ) : currentTrack ? (
              <button
                onClick={onPlayResume}
                className="inline-flex h-7 items-center gap-1 rounded-lg bg-amber-700 px-2.5 text-xs font-semibold text-white hover:bg-amber-800 transition-colors whitespace-nowrap"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>Phát</span>
              </button>
            ) : null}

            <button
              onClick={toggleCollapsed}
              className="inline-flex h-7 items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 px-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors whitespace-nowrap"
              title="Mở rộng khung Quản lý giọng đọc & điều khiển âm thanh"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-amber-700" />
              <span>Mở rộng</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-stone-300 bg-white p-3 sm:px-4 sm:py-3 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Active Sentence / Word Display */}
        <div className="flex items-center justify-between lg:justify-start gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <Volume2
                className={`h-5 w-5 ${isPlaying ? 'animate-bounce' : ''}`}
              />
            </div>
            {currentTrack ? (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  <span>{currentTrack.speaker || 'Đang phát'}</span>
                  {playlist.length > 1 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        Câu {playlistIndex + 1}/{playlist.length}
                      </span>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap items-baseline gap-2 truncate">
                  <span className="font-['Noto_Sans_SC'] text-sm sm:text-base font-bold text-stone-900 truncate">
                    {currentTrack.hanzi}
                  </span>
                  {currentTrack.pinyin && (
                    <span className="font-mono text-xs font-medium text-amber-800 truncate">
                      [{currentTrack.pinyin}]
                    </span>
                  )}
                  {currentTrack.meaningVi && (
                    <span className="text-xs text-stone-600 truncate">
                      — {currentTrack.meaningVi}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-stone-800">
                  Quản lý giọng đọc & Điều khiển phát âm thanh
                </div>
                <div className="text-xs text-stone-500 truncate">
                  Chọn 5 giọng đọc (Nam/Nữ), tốc độ phát, lặp câu hoặc nhấn nút loa cạnh từng câu để nghe.
                </div>
              </div>
            )}
          </div>

          {/* Mobile Collapse Button */}
          <button
            onClick={toggleCollapsed}
            className="inline-flex lg:hidden h-8 items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 px-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 shrink-0"
            title="Thu gọn khung Quản lý giọng đọc"
          >
            <span>Thu gọn</span>
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Center: Transport Playback Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onPrevTrack}
            disabled={playlist.length <= 1 || playlistIndex <= 0}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 disabled:opacity-40"
            title="Câu trước"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          {isPlaying ? (
            <button
              onClick={onStop}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-rose-700 px-3.5 text-xs font-semibold text-white hover:bg-rose-800 transition-colors whitespace-nowrap shrink-0"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
              Dừng
            </button>
          ) : (
            <button
              onClick={onPlayResume}
              disabled={!currentTrack}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-amber-700 px-3.5 text-xs font-semibold text-white hover:bg-amber-800 disabled:opacity-40 transition-colors whitespace-nowrap shrink-0"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Phát lại
            </button>
          )}

          <button
            onClick={onNextTrack}
            disabled={
              playlist.length <= 1 || playlistIndex >= playlist.length - 1
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 disabled:opacity-40"
            title="Câu tiếp theo"
          >
            <SkipForward className="h-4 w-4" />
          </button>

          <button
            onClick={onToggleLoopOne}
            className={`inline-flex h-9 items-center gap-1 rounded-lg border px-2.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              loopOne
                ? 'border-amber-500 bg-amber-50 text-amber-900'
                : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
            }`}
            title="Lặp lại câu đang nghe"
          >
            <Repeat className="h-3.5 w-3.5" />
            <span>Lặp câu</span>
          </button>

          <button
            onClick={onToggleAutoAdvance}
            className={`inline-flex h-9 items-center gap-1 rounded-lg border px-2.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              autoAdvance
                ? 'border-sky-500 bg-sky-50 text-sky-900'
                : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
            }`}
            title="Tự động đọc câu tiếp theo"
          >
            <ListMusic className="h-3.5 w-3.5" />
            <span>Liên tục</span>
          </button>
        </div>

        {/* Right: Speed, Voice Persona, Page Sound & Collapse Button */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center gap-0.5 rounded-lg bg-stone-100 p-1">
            {[0.65, 0.85, 1.0, 1.2].map((r) => (
              <button
                key={r}
                onClick={() => onChangeRate(r)}
                className={`rounded-md px-2 py-1 font-mono text-xs font-medium transition-colors tabular-nums ${
                  playbackRate === r
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {r}x
              </button>
            ))}
          </div>

          <select
            value={voiceName}
            onChange={(e) => onChangeVoice(e.target.value)}
            aria-label="Chọn giọng đọc tiếng Trung"
            className="rounded-lg border border-stone-300 bg-stone-50 px-2.5 py-1.5 text-xs font-semibold text-stone-900 focus:border-amber-700 focus:bg-white focus:outline-hidden"
          >
            {Object.values(VOICE_PERSONAS).map((vp) => (
              <option key={vp.id} value={vp.id}>
                {vp.label}
              </option>
            ))}
          </select>

          <button
            onClick={onTogglePageSound}
            className={`inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              pageSoundEnabled
                ? 'border-stone-300 bg-stone-50 text-stone-700'
                : 'border-stone-200 bg-white text-stone-400'
            }`}
            title="Bật/tắt tiếng lật giấy"
          >
            {pageSoundEnabled ? (
              <Volume2 className="h-3.5 w-3.5" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">Tiếng lật sách</span>
          </button>

          <button
            onClick={toggleCollapsed}
            className="hidden lg:inline-flex h-8 items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 px-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 shrink-0"
            title="Thu gọn khung Quản lý giọng đọc"
          >
            <span>Thu gọn</span>
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

