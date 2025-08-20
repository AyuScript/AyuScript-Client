// TODO refactor this file
// TODO find these two value in wasm
const base = 19286288;
const overflow = 3563868;

function writeString(str: string) {
  if (!window.Module.HEAPU8) {
    throw Error('Game isn\'t ready');
  }
  const encoder = new TextEncoder();
  const utf8 = encoder.encode(str);
  const ptr = window.Module._malloc(utf8.length + 1);
  window.Module.HEAPU8.set(utf8, ptr);
  window.Module.HEAPU8[ptr + utf8.length] = 0;
  return ptr;
}

function utf8Length(str: string) {
  const encoder = new TextEncoder();
  const utf8 = encoder.encode(str);
  return utf8.length;
}

function canvasTextWidth(text: string) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx!.font = '14px Game';
  return ctx!.measureText(text).width;
}

export function addChatMessage(segments: {text: string, r: number, g: number, b: number}[]) {
  if (!window.Module.HEAPU8) {
    return;
  }
  let count = window.Module.HEAP32[(base - 8) / 4];
  if (count >= 100) {
    for (let i = 0; i < 99; i++) {
      for (let j = 0; j < 408; j++) {
        window.Module.HEAP8[base + 408 * i + j] = window.Module.HEAP8[base + 408 * (i + 1) + j];
      }
    }
    count = 99;
  }

  const var5 = base + 408 * count;
  for (let i = 0; i < 408; i++) {
    window.Module.HEAP8[var5 + i] = 0;
  }

  window.Module.HEAP32[(var5 + 4) / 4] = 1;
  window.Module.HEAP32[(var5 + 12) / 4] = 0;
  window.Module.HEAPF64[(var5 + 24) / 8] = Date.now();
  window.Module.HEAP32[(var5 + 48) / 4] = overflow;

  const segCount = segments.length;

  const var1 = window.Module._malloc(32 + segCount * 48);
  window.Module.HEAP32[(var5 + 12) / 4] = var1;
  for (let i = 0; i < 32 + segCount * 48; i++) {
    window.Module.HEAP8[var1 + i] = 0;
  }

  window.Module.HEAP32[var1 / 4] = segCount;
  window.Module.HEAP32[(var1 + 4) / 4] = 55;

  const segBase = var1 + 32;
  window.Module.HEAP32[(var1 + 8) / 4] = segBase;

  for (let s = 0; s < segCount; s++) {
    const {text, r = 255, g = 255, b = 255} = segments[s];
    const var0 = segBase + s * 48;

    window.Module.HEAPF32[var0 / 4] = canvasTextWidth(text);
    window.Module.HEAP32[(var0 + 4) / 4] = 1;
    window.Module.HEAPF32[(var0 + 8) / 4] = -13;
    window.Module.HEAPF32[(var0 + 12) / 4] = 3;
    window.Module.HEAP32[(var0 + 16) / 4] = 1;
    window.Module.HEAP32[(var0 + 20) / 4] = writeString(text);
    window.Module.HEAP32[(var0 + 24) / 4] = utf8Length(text);
    window.Module.HEAPU8[var0 + 28] = 64;
    window.Module.HEAPU8[var0 + 29] = 0;
    window.Module.HEAPU8[var0 + 30] = 0;
    window.Module.HEAPU8[var0 + 31] = 128;
    window.Module.HEAPU8[var0 + 32] = r;
    window.Module.HEAPU8[var0 + 33] = g;
    window.Module.HEAPU8[var0 + 34] = b;
    window.Module.HEAPU8[var0 + 35] = 0;
    window.Module.HEAPU8[var0 + 36] = 0;
    window.Module.HEAPU8[var0 + 37] = 0;
    window.Module.HEAPU8[var0 + 38] = 0;
    window.Module.HEAPU8[var0 + 39] = 0;
    window.Module.HEAPF32[(var0 + 40) / 4] = 0.12;
    window.Module.HEAPF32[(var0 + 44) / 4] = 14.0;
  }

  window.Module.HEAP32[(base - 8) / 4] = count + 1;
}