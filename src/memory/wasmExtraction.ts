import {matches, readLeb128} from "@/memory/utils.ts";

function parseInventory(bytes: Uint8Array): number {
  const patternPrefix = [0x41, 0x01, 0x3a, 0x00, 0x00, 0x41];
  const patternSuffix = [0x41, 0x05, 0x36, 0x02, 0x00];

  for (let i = 0; i < bytes.length; i++) {
    if (!matches(bytes, i, patternPrefix)) continue;

    const addrStart = i + patternPrefix.length;
    const { value: addr, nextIndex } = readLeb128(bytes, addrStart);

    if (!matches(bytes, nextIndex, patternSuffix)) continue;

    return addr >> 2;
  }

  throw new Error('Could not find the magic value for "inventory"');
}

export async function injectAPI(): Promise<{
  inventory: number
}>{
  return new Promise((resolve => {
    WebAssembly.instantiateStreaming =
      (src, imports) => (src as Response).arrayBuffer().then(buf => WebAssembly.instantiate(buf, imports));
    const instantiate = WebAssembly.instantiate;
    WebAssembly.instantiate = ((buf: ArrayBuffer, imports: WebAssembly.Imports) => {
      const bytes = new Uint8Array(buf);
      resolve({
        inventory: parseInventory(bytes)
      });
      return instantiate(buf, imports);
    }) as any;
  }));
}