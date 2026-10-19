/**
 * Toddler Audio Engine using Web Audio API & Web Speech API
 * Pure client-side synthesized sound, zero external network assets required.
 */

class ToddlerAudioEngine {
  private ctx: AudioContext | null = null;
  private bgmInterval: number | null = null;
  private isBgmPlaying = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Soft marimba tap when moving blocks left/right
  playMoveSound(noteIndex = 0) {
    this.initCtx();
    if (!this.ctx) return;

    const notes = [329.63, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25]; // E4, G4, A4, B4, C5, D5, E5 (Pentatonic)
    const freq = notes[Math.abs(noteIndex) % notes.length];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // Cheerful rotate sound (chirp up)
  playRotateSound() {
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // Soft toy block drop / landing
  playDropSound() {
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // Sparkling Line Clear arpeggio with celebratory bell tone
  playLineClearSound(lineCount = 1) {
    this.initCtx();
    if (!this.ctx) return;

    const chords = [
      [523.25, 659.25, 783.99, 1046.50], // C major arpeggio
      [587.33, 739.99, 880.00, 1174.66], // D
      [659.25, 830.61, 987.77, 1318.51], // E
      [698.46, 880.00, 1046.50, 1396.91], // F (Big combo!)
    ];
    const freqs = chords[Math.min(lineCount - 1, chords.length - 1)];

    freqs.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx!.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, this.ctx!.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(this.ctx!.currentTime + idx * 0.08);
      osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.35);
    });
  }

  // Magic Broom whoosh with fairy chimes
  playBroomSound() {
    this.initCtx();
    if (!this.ctx) return;

    for (let i = 0; i < 6; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + i * 0.05;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600 + i * 180, startTime);
      osc.frequency.exponentialRampToValueAtTime(1400 + i * 100, startTime + 0.15);

      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.15);
    }
  }

  // Star Bomb pop
  playBombSound() {
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(280, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  // Squeaky toy sound for sticker clicks
  playSqueakSound() {
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + 0.08);
    osc.frequency.linearRampToValueAtTime(750, this.ctx.currentTime + 0.16);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  }

  // Sticker achievement unlocked fanfare
  playStickerUnlockSound() {
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const t = this.ctx!.currentTime + i * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  // Gentle music box BGM
  startBGM() {
    if (this.isBgmPlaying) return;
    this.initCtx();
    if (!this.ctx) return;
    this.isBgmPlaying = true;

    // Sweet calm melody notes: C4, E4, G4, A4, G4, E4, D4, C4
    const tune = [
      523.25, 659.25, 783.99, 880.00,
      783.99, 659.25, 587.33, 523.25
    ];
    let step = 0;

    this.bgmInterval = window.setInterval(() => {
      if (!this.isBgmPlaying || !this.ctx) return;
      const f = tune[step % tune.length];
      step++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.45);
    }, 550);
  }

  stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  // Spoken Korean praise via Web Speech API
  speakPraise(phrase?: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const praises = [
        '참 잘했어요!',
        '우와 멋져요!',
        '대단해요!',
        '별처럼 반짝반짝!',
        '팡팡! 최고예요!',
        '신나요 신나!',
        '블록 천재 어린이!'
      ];
      const text = phrase || praises[Math.floor(Math.random() * praises.length)];
      
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.pitch = 1.35; // Gentle high friendly tone
      utterance.rate = 1.0;
      utterance.volume = 0.85;

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore if speech fails or unsupported
    }
  }
}

export const toddlerAudio = new ToddlerAudioEngine();
