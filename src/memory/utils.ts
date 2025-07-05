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