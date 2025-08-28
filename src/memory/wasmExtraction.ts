import { matches, readLeb128 } from "@/memory/utils.ts";

function parsePattern(
  bytes: Uint8Array,
  prefix: number[],
  suffix: number[],
  transform: (value: number) => number = v => v
): number {
  for (let i = 0; i < bytes.length; i++) {
    if (!matches(bytes, i, prefix)) continue;

    const addrStart = i + prefix.length;
    const { value, nextIndex } = readLeb128(bytes, addrStart);

    if (!matches(bytes, nextIndex, suffix)) continue;

    return transform(value);
  }

  throw new Error(`Could not find pattern.`);
}

async function fetchWasmBytes(): Promise<Uint8Array> {
  const response = await fetch(`https://static.florr.io/${window.versionHash}/client.wasm`);
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}

export async function injectAPI(): Promise<{
  inventory: number;
  chatBase: number;
  chatOverflow: number;
}> {
  const bytes = await fetchWasmBytes();

  return {
    inventory: parsePattern(
      bytes,
      [0x41, 0x01, 0x3a, 0x00, 0x00, 0x41],
      [0x41, 0x05, 0x36, 0x02, 0x00],
      value => value >> 2
    ),
    chatBase: parsePattern(
      bytes,
      [0x41, 0x98, 0x03, 0x6C, 0x22, 0x00, 0x41],
      [0x6A, 0x41, 0x00, 0x41, 0x98, 0x03]
    ),
    chatOverflow: parsePattern(
      bytes,
      [0x22, 0x05, 0x41],
      [0x36, 0x02, 0x00, 0x20, 0x02, 0x41, 0x08, 0x6A]
    )
  };
}
