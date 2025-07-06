export function getString(ptr: number) {
  if (!window.Module.HEAPU8) {
    return '';
  }
  let end = ptr;
  while (window.Module.HEAPU8[end] !== 0 && end < window.Module.HEAPU8.length) {
    ++end;
  }
  const stringBytes = window.Module.HEAPU8.subarray(ptr, end);
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(stringBytes);
}

export function readLeb128(data: Uint8Array, idx: number): { value: number; nextIndex: number } {
  let result = 0, shift = 0, byte;
  do {
    byte   = data[idx++];
    result |= (byte & 0x7F) << shift;
    shift  += 7;
  } while (byte & 0x80);
  return { value: result, nextIndex: idx };
}

export function matches(bytes: Uint8Array, offset: number, pattern: number[]): boolean {
  if (offset + pattern.length > bytes.length) return false;
  for (let i = 0; i < pattern.length; i++) {
    if (bytes[offset + i] !== pattern[i]) return false;
  }
  return true;
}