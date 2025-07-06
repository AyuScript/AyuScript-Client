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

async function streamToUint8Array(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  // Calculate total length
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);

  // Concatenate all chunks
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}


export async function injectAPI(): Promise<{
  inventory: number
}>{
  return new Promise((resolve => {
    fetch(`https://static.florr.io/${window.versionHash}/client.wasm`)
      .then(response => response.body)
      .then(async stream => {
      const bytes = await streamToUint8Array(stream!);
      resolve({
        inventory: parseInventory(bytes)
      });
    });
  }));
}