"use client";

import { useEffect, useRef, useState } from "react";

// Web Audio API engine + ocean water sound generator (100% asset-free!)
class AudioDirector {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private waterGain: GainNode | null = null;
  public isPlaying = false;

  public init() {
    if (this.ctx) return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();

    // 1. Engine Oscillator (Motorcycle & Boat outboard engine)
    this.osc = this.ctx.createOscillator();
    this.osc.type = "sawtooth";
    this.osc.frequency.setValueAtTime(36, this.ctx.currentTime);

    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.setValueAtTime(140, this.ctx.currentTime);

    this.gain = this.ctx.createGain();
    this.gain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    this.osc.connect(this.filter);
    this.filter.connect(this.gain);
    this.gain.connect(this.ctx.destination);
    this.osc.start();

    // 2. Wind & Water Splashing Noise Generator
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    // Wind filter
    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = "bandpass";
    windFilter.frequency.setValueAtTime(450, this.ctx.currentTime);

    this.noiseGain = this.ctx.createGain();
    this.noiseGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    this.noiseNode.connect(windFilter);
    windFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.ctx.destination);

    // Ocean water lap filter
    const waterFilter = this.ctx.createBiquadFilter();
    waterFilter.type = "lowpass";
    waterFilter.frequency.setValueAtTime(250, this.ctx.currentTime);

    this.waterGain = this.ctx.createGain();
    this.waterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    this.noiseNode.connect(waterFilter);
    waterFilter.connect(this.waterGain);
    this.waterGain.connect(this.ctx.destination);

    this.noiseNode.start();
    this.isPlaying = true;
  }

  public update(mode: "idle" | "bike" | "boat", velocity: number) {
    if (!this.ctx || !this.gain || !this.osc || !this.filter || !this.noiseGain || !this.waterGain) return;

    if (mode === "idle") {
      this.osc.frequency.setTargetAtTime(32, this.ctx.currentTime, 0.1);
      this.gain.gain.setTargetAtTime(0.03, this.ctx.currentTime, 0.1);
      this.noiseGain.gain.setTargetAtTime(0.01, this.ctx.currentTime, 0.1);
      this.waterGain.gain.setTargetAtTime(0.01, this.ctx.currentTime, 0.1);
    } else if (mode === "bike") {
      const freq = 45 + velocity * 80;
      const vol = 0.07 + velocity * 0.1;
      this.osc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.08);
      this.filter.frequency.setTargetAtTime(180 + velocity * 220, this.ctx.currentTime, 0.08);
      this.gain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.08);
      this.noiseGain.gain.setTargetAtTime(0.03 + velocity * 0.07, this.ctx.currentTime, 0.08);
      this.waterGain.gain.setTargetAtTime(0.001, this.ctx.currentTime, 0.1);
    } else if (mode === "boat") {
      // Lower outboard engine hum + rhythmic ocean water spray
      const freq = 40 + velocity * 65;
      const vol = 0.08 + velocity * 0.11;
      this.osc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.08);
      this.filter.frequency.setTargetAtTime(150 + velocity * 200, this.ctx.currentTime, 0.08);
      this.gain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.08);
      this.noiseGain.gain.setTargetAtTime(0.04 + velocity * 0.08, this.ctx.currentTime, 0.08);
      this.waterGain.gain.setTargetAtTime(0.06 + velocity * 0.12, this.ctx.currentTime, 0.08);
    }
  }

  public stop() {
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
      this.isPlaying = false;
    }
  }
}

export const globalAudio = new AudioDirector();

export function SoundToggle() {
  const [enabled, setEnabled] = useState(false);

  const toggle = () => {
    if (!enabled) {
      globalAudio.init();
      setEnabled(true);
    } else {
      globalAudio.stop();
      setEnabled(false);
    }
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/40 bg-black/60 text-amber-300 text-xs font-mono tracking-widest hover:border-amber-400 hover:text-white transition-all pointer-events-auto cursor-pointer"
      style={{ backdropFilter: "blur(8px)" }}
    >
      <span className="flex items-end gap-0.5 h-3">
        <span className={`w-0.5 bg-amber-400 ${enabled ? "animate-pulse h-3" : "h-1"}`} />
        <span className={`w-0.5 bg-amber-400 ${enabled ? "animate-pulse h-2" : "h-1.5"}`} />
        <span className={`w-0.5 bg-amber-400 ${enabled ? "animate-pulse h-3.5" : "h-1"}`} />
      </span>
      <span>{enabled ? "AUDIO ON" : "AUDIO OFF"}</span>
    </button>
  );
}
