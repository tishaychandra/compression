// algorithms/lz77.js
export default class LZ77 {
  constructor(windowSize = 4096, lookaheadSize = 16) {
    this.windowSize = windowSize;
    this.lookaheadSize = lookaheadSize;
  }

  compress(data) {
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const out = [];
    let pos = 0;

    while (pos < buf.length) {
      const start = Math.max(0, pos - this.windowSize);
      const window = buf.slice(start, pos);
      const lookahead = buf.slice(pos, pos + this.lookaheadSize);

      let bestLen = 0,
        bestDist = 0;
      for (let i = 0; i < window.length; i++) {
        let length = 0;
        while (
          length < lookahead.length &&
          window[i + length] === lookahead[length]
        ) {
          length++;
        }
        if (length > bestLen) {
          bestLen = length;
          bestDist = window.length - i;
        }
      }

      if (bestLen >= 3) {
        // encode as (2-byte distance, 1-byte length, 1-byte next)
        const nextByte = buf[pos + bestLen] ?? 0;
        out.push((bestDist >> 8) & 0xff, bestDist & 0xff, bestLen, nextByte);
        pos += bestLen + 1;
      } else {
        // literal: length=0 signals "no-match"
        out.push(0, 0, 0, buf[pos]);
        pos++;
      }
    }

    return Buffer.from(out);
  }

  decompress(data) {
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const out = [];

    // each entry is exactly 4 bytes
    for (let i = 0; i + 3 < buf.length; i += 4) {
      const dist = (buf[i] << 8) | buf[i + 1];
      const len = buf[i + 2];
      const next = buf[i + 3];

      if (dist === 0 && len === 0) {
        // literal
        out.push(next);
      } else {
        // back-reference of length `len`
        const start = out.length - dist;
        for (let j = 0; j < len; j++) {
          out.push(out[start + j]);
        }
        // then the "next" byte
        out.push(next);
      }
    }

    return Buffer.from(out);
  }
}
