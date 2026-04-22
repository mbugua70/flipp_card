const fs   = require('fs')
const path = require('path')

const SR      = 44100  // sample rate
const OUT_DIR = path.join(__dirname, '../public/sounds')

// ── WAV writer ────────────────────────────────────
function writeWav(filename, samples) {
  const buf = Buffer.alloc(44 + samples.length * 2)
  buf.write('RIFF', 0, 'ascii')
  buf.writeUInt32LE(36 + samples.length * 2, 4)
  buf.write('WAVE', 8, 'ascii')
  buf.write('fmt ', 12, 'ascii')
  buf.writeUInt32LE(16, 16)
  buf.writeUInt16LE(1,  20)   // PCM
  buf.writeUInt16LE(1,  22)   // mono
  buf.writeUInt32LE(SR, 24)
  buf.writeUInt32LE(SR * 2, 28)
  buf.writeUInt16LE(2,  32)
  buf.writeUInt16LE(16, 34)
  buf.write('data', 36, 'ascii')
  buf.writeUInt32LE(samples.length * 2, 40)
  for (let i = 0; i < samples.length; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i])) * 32767), 44 + i * 2)
  }
  fs.writeFileSync(path.join(OUT_DIR, filename), buf)
  console.log('  ✓', filename)
}

// ── Helpers ───────────────────────────────────────
function sine(freq, dur, amp = 0.5, attack = 0.01, release = 0.08) {
  const n  = Math.round(SR * dur)
  const ta = Math.round(SR * attack)
  const tr = Math.round(SR * release)
  return Float32Array.from({ length: n }, (_, i) => {
    const t   = i / SR
    let   env = 1
    if (i < ta)       env = i / ta
    if (i > n - tr)   env = (n - i) / tr
    return amp * env * Math.sin(2 * Math.PI * freq * t)
  })
}

function concat(...tracks) {
  const out = new Float32Array(tracks.reduce((s, t) => s + t.length, 0))
  let offset = 0
  for (const t of tracks) { out.set(t, offset); offset += t.length }
  return out
}

function overlay(a, b, offsetSamples = 0) {
  const len = Math.max(a.length, b.length + offsetSamples)
  const out = new Float32Array(len)
  for (let i = 0; i < a.length; i++) out[i] += a[i]
  for (let i = 0; i < b.length; i++) out[i + offsetSamples] += b[i]
  return out
}

// ── Sound generators ──────────────────────────────

// Card flip: quick frequency sweep 800→200 Hz with noise
function flip() {
  const n = Math.round(SR * 0.14)
  return Float32Array.from({ length: n }, (_, i) => {
    const p    = i / n
    const freq = 800 - 600 * p
    const env  = Math.pow(1 - p, 1.5) * 0.45
    const t    = i / SR
    return env * (Math.sin(2 * Math.PI * freq * t) + (Math.random() * 2 - 1) * 0.06)
  })
}

// Correct: ascending chime C5 → E5 → G5
function correct() {
  return concat(
    sine(523.25, 0.13, 0.48, 0.004, 0.08),
    sine(659.25, 0.13, 0.48, 0.004, 0.08),
    sine(783.99, 0.24, 0.5,  0.004, 0.18),
  )
}

// Wrong: low descending tone with slight distortion
function wrong() {
  const n = Math.round(SR * 0.38)
  return Float32Array.from({ length: n }, (_, i) => {
    const t    = i / SR
    const p    = i / n
    const freq = 220 - 90 * p
    const env  = Math.max(0, 1 - p * 1.8) * 0.55
    const raw  = Math.sin(2 * Math.PI * freq * t)
    return env * Math.sign(raw) * Math.pow(Math.abs(raw), 0.65)
  })
}

// Win: staggered C5 E5 G5 then C6 + sustained chord
function win() {
  const lead = concat(
    sine(523.25, 0.11, 0.44, 0.004, 0.04),
    sine(659.25, 0.11, 0.44, 0.004, 0.04),
    sine(783.99, 0.11, 0.44, 0.004, 0.04),
    sine(1046.5,  0.5,  0.5,  0.004, 0.35),
  )
  const chordLen = Math.round(SR * 0.55)
  const chord = Float32Array.from({ length: chordLen }, (_, i) => {
    const t   = i / SR
    const env = Math.max(0, 1 - i / chordLen) * 0.35
    return env * (
      Math.sin(2 * Math.PI * 523.25 * t) +
      Math.sin(2 * Math.PI * 659.25 * t) +
      Math.sin(2 * Math.PI * 783.99 * t)
    ) / 3
  })
  return overlay(lead, chord, Math.round(SR * 0.33))
}

// Lose: descending G4 → D4 → B3 → G3
function lose() {
  return concat(
    sine(392.00, 0.17, 0.44, 0.004, 0.07),
    sine(293.66, 0.17, 0.44, 0.004, 0.07),
    sine(246.94, 0.17, 0.44, 0.004, 0.07),
    sine(196.00, 0.48, 0.5,  0.004, 0.38),
  )
}

// Ambient music loop: A-minor pad, 8 seconds seamless
function music() {
  const dur    = 8
  const n      = Math.round(SR * dur)
  const voices = [
    { freq: 110.00, amp: 0.13, lfoRate: 0.25, lfoDepth: 0.3 },  // A2
    { freq: 164.81, amp: 0.10, lfoRate: 0.37, lfoDepth: 0.25 }, // E3
    { freq: 220.00, amp: 0.09, lfoRate: 0.51, lfoDepth: 0.3 },  // A3
    { freq: 261.63, amp: 0.07, lfoRate: 0.42, lfoDepth: 0.2 },  // C4
    { freq: 329.63, amp: 0.06, lfoRate: 0.63, lfoDepth: 0.25 }, // E4
    { freq: 440.00, amp: 0.04, lfoRate: 0.29, lfoDepth: 0.2 },  // A4
  ]
  const fadeLen = Math.round(SR * 0.6)
  return Float32Array.from({ length: n }, (_, i) => {
    const t       = i / SR
    const fadeIn  = i < fadeLen ? i / fadeLen : 1
    const fadeOut = i > n - fadeLen ? (n - i) / fadeLen : 1
    let   sample  = 0
    for (const v of voices) {
      const lfo = 1 - v.lfoDepth + v.lfoDepth * Math.sin(2 * Math.PI * v.lfoRate * t)
      sample += v.amp * lfo * Math.sin(2 * Math.PI * v.freq * t)
    }
    return fadeIn * fadeOut * sample
  })
}

// Countdown tick: crisp wood-block style click (~65 ms)
function tick() {
  const n = Math.round(SR * 0.065)
  return Float32Array.from({ length: n }, (_, i) => {
    const p   = i / n
    const env = Math.pow(1 - p, 2.8) * 0.72
    const t   = i / SR
    // two partials for a wood-block feel
    return env * (
      Math.sin(2 * Math.PI * 820 * t) * 0.6 +
      Math.sin(2 * Math.PI * 410 * t) * 0.4 +
      (Math.random() * 2 - 1) * 0.05
    )
  })
}

// ── Run ───────────────────────────────────────────
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

console.log('Generating sounds...')
writeWav('flip.wav',    flip())
writeWav('correct.wav', correct())
writeWav('wrong.wav',   wrong())
writeWav('win.wav',     win())
writeWav('lose.wav',    lose())
writeWav('music.wav',   music())
writeWav('tick.wav',    tick())
console.log('\nDone — files in public/sounds/')
