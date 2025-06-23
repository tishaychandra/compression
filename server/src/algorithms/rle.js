// algorithms/rle.js
export default class RunLengthEncoding {
  compress(data) {
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
    if (!buf.length) return Buffer.alloc(0);
    const o = [];
    let run = buf[0],
      cnt = 1;
    for (let i = 1; i < buf.length; i++) {
      if (buf[i] === run && cnt < 255) cnt++;
      else {
        o.push(cnt, run);
        run = buf[i];
        cnt = 1;
      }
    }
    o.push(cnt, run);
    return Buffer.from(o);
  }
  decompress(data) {
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data),
      o = [];
    for (let i = 0; i + 1 < buf.length; i += 2) {
      const cnt = buf[i],
        v = buf[i + 1];
      for (let j = 0; j < cnt; j++) o.push(v);
    }
    return Buffer.from(o);
  }
}
