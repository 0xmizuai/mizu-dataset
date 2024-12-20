import { inflate } from "pako";

// Start of Selection
export const R2_DOWNLOAD_URL = "https://rawdata.mizu.technology";

export const StatusText: Record<number, string> = {
  0: "Pending",
  1: "Processing",
  2: "Finished",
  3: "Error",
};

export async function downloadAndParseJSON(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const base64EncodedData = await response.text();
    const decodedBuffer = Buffer.from(base64EncodedData, "base64");

    try {
      const decompressedData = inflate(decodedBuffer);
      const textDecoder = new TextDecoder("utf-8", { fatal: false });
      const lines = textDecoder
        .decode(decompressedData)
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      return lines.map((line) => JSON.parse(line));
    } catch (parseErr) {
      console.error("Parse error details:", url, parseErr);
      return [];
    }
  } catch (error: any) {
    console.error("downloadAndParseJSON error:", url, error);
    return [];
  }
}
