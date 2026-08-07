"use client";

// Bunyi ringkas gaya game, disintesis terus (Web Audio API) - tiada fail audio
// diperlukan, saiz kecil, dan jalan offline (sesuai untuk PWA).

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    type WindowWithWebkitAudio = typeof window & {
      webkitAudioContext?: typeof AudioContext;
    };
    const w = window as WindowWithWebkitAudio;
    const AudioContextClass = window.AudioContext || w.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
  }
  return audioCtx;
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  startDelay = 0,
  gainValue = 0.15
) {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;

  const startTime = ctx.currentTime + startDelay;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

/** Bunyi "klik" pendek - untuk tap kad kucing / navigasi / butang biasa. */
export function playClick() {
  tone(720, 0.08, "triangle");
}

/** Bunyi kejayaan / level-up - arpeggio naik. */
export function playSuccess() {
  tone(523.25, 0.12, "triangle", 0); // C5
  tone(659.25, 0.12, "triangle", 0.09); // E5
  tone(783.99, 0.18, "triangle", 0.18); // G5
}

/** Bunyi ralat / ditolak - nada rendah pendek. */
export function playError() {
  tone(180, 0.18, "sawtooth");
}
