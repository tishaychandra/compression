// algorithms/huffman.js
import { Buffer } from "buffer";

class Node {
  constructor(v = null, f = 0, l = null, r = null) {
    this.v = v;
    this.f = f;
    this.l = l;
    this.r = r;
  }
}

// Build freq[256]
function freqMap(buf) {
  const f = new Uint32Array(256);
  for (const b of buf) f[b]++;
  return f;
}

// Build Huffman tree
function buildTree(f) {
  const nodes = [];
  for (let v = 0; v < 256; v++) {
    if (f[v] > 0) nodes.push(new Node(v, f[v]));
  }
  if (!nodes.length) return null;
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.f - b.f);
    const a = nodes.shift(),
      b = nodes.shift();
    nodes.push(new Node(null, a.f + b.f, a, b));
  }
  return nodes[0];
}

// Generate codes { byte → string of bits }
function genCodes(node, prefix = "", map = {}) {
  if (!node) return map;
  if (node.v !== null) map[node.v] = prefix || "0";
  else {
    genCodes(node.l, prefix + "0", map);
    genCodes(node.r, prefix + "1", map);
  }
  return map;
}

// Pack bitstring into Buffer
function packBits(bits) {
  const out = Buffer.alloc(Math.ceil(bits.length / 8));
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === "1") {
      out[Math.floor(i / 8)] |= 1 << (7 - (i % 8));
    }
  }
  return out;
}

// Unpack
function unpackBits(buf, bitLen) {
  let s = "";
  for (let i = 0; i < bitLen; i++) {
    s += (buf[Math.floor(i / 8)] >> (7 - (i % 8))) & 1 ? "1" : "0";
  }
  return s;
}

export default class HuffmanCoding {
  compress(data) {
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const f = freqMap(buf);
    const tree = buildTree(f);
    const codes = genCodes(tree);

    // Build full bit string
    let bits = "";
    for (const b of buf) bits += codes[b];

    const packed = packBits(bits);
    const bitLen = bits.length;

    // Build header:
    // [ 2‐byte symbol count ][ for each symbol: 1‐byte value + 4‐byte freq ]
    // [ 4‐byte bitLen ][ packed data... ]
    const symbols = Object.keys(codes).map((x) => parseInt(x));
    const headerSize = 2 + symbols.length * 5 + 4;
    const out = Buffer.alloc(headerSize + packed.length);

    // symbol count
    out.writeUInt16BE(symbols.length, 0);
    let offset = 2;
    for (const v of symbols) {
      out.writeUInt8(v, offset++);
      out.writeUInt32BE(f[v], offset);
      offset += 4;
    }
    out.writeUInt32BE(bitLen, offset);
    offset += 4;

    packed.copy(out, offset);

    return out;
  }

  decompress(bufIn) {
    const buf = Buffer.isBuffer(bufIn) ? bufIn : Buffer.from(bufIn);
    let offset = 0;

    // Read symbol count
    const count = buf.readUInt16BE(offset);
    offset += 2;
    const f = new Uint32Array(256);
    // Read frequencies
    for (let i = 0; i < count; i++) {
      const v = buf.readUInt8(offset++);
      const freq = buf.readUInt32BE(offset);
      offset += 4;
      f[v] = freq;
    }
    // Read bit length
    const bitLen = buf.readUInt32BE(offset);
    offset += 4;

    // Rebuild tree
    const tree = buildTree(f);

    // Unpack bits
    const packed = buf.slice(offset);
    const bits = unpackBits(packed, bitLen);

    // Decode
    const out = [];
    let node = tree;
    for (const bit of bits) {
      node = bit === "0" ? node.l : node.r;
      if (node.v !== null) {
        out.push(node.v);
        node = tree;
      }
    }
    return Buffer.from(out);
  }
}
