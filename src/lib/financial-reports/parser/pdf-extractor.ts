/**
 * FinAi KAP PDF Parser — PDF Layout & Text Stream Extractor
 * Pure Node.js zero-dependency PDF text stream reader with strict ToUnicode CMap decoding
 * and coordinate-based horizontal / vertical line grouping.
 */

import * as zlib from 'zlib';
import * as crypto from 'crypto';
import type { ExtractedPageLayout, ExtractedRawLine } from './types';
import { cleanWhitespace } from './normalizer';

/**
 * Calculates SHA-256 hash of a buffer or string
 */
export function calculateSha256(buffer: Buffer | string): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Strict parser for PDF ToUnicode CMaps (Adobe-Identity-UCS)
 * Correctly isolates beginbfchar / beginbfrange to avoid begincodespacerange corruption.
 */
export function parseStrictCMap(cmapText: string): Map<number, string> {
  const map = new Map<number, string>();

  // 1. Single character mappings: beginbfchar ... endbfchar
  const charBlocks = cmapText.matchAll(/beginbfchar([\s\S]*?)endbfchar/g);
  for (const cb of charBlocks) {
    const matches = cb[1].matchAll(/<([0-9a-fA-F]+)>\s+<([0-9a-fA-F]+)>/g);
    for (const m of matches) {
      const src = parseInt(m[1], 16);
      const destHex = m[2];
      let destStr = '';
      for (let i = 0; i < destHex.length; i += 4) {
        destStr += String.fromCodePoint(parseInt(destHex.slice(i, i + 4), 16));
      }
      map.set(src, destStr);
    }
  }

  // 2. Range mappings: beginbfrange ... endbfrange
  const rangeBlocks = cmapText.matchAll(/beginbfrange([\s\S]*?)endbfrange/g);
  for (const rb of rangeBlocks) {
    const blockText = rb[1];

    // Array form: <start> <end> [ <dest1> <dest2> ... ]
    const arrMatches = blockText.matchAll(/<([0-9a-fA-F]+)>\s+<([0-9a-fA-F]+)>\s+\[(.*?)\]/g);
    for (const m of arrMatches) {
      const start = parseInt(m[1], 16);
      const tokens = m[3].match(/<([0-9a-fA-F]+)>/g) || [];
      tokens.forEach((tok, idx) => {
        const hex = tok.replace(/[<>]/g, '');
        let destStr = '';
        for (let i = 0; i < hex.length; i += 4) {
          destStr += String.fromCodePoint(parseInt(hex.slice(i, i + 4), 16));
        }
        map.set(start + idx, destStr);
      });
    }

    // Scalar form: <start> <end> <destStart>
    const singleMatches = blockText.matchAll(/<([0-9a-fA-F]+)>\s+<([0-9a-fA-F]+)>\s+<([0-9a-fA-F]+)>/g);
    for (const m of singleMatches) {
      const start = parseInt(m[1], 16);
      const end = parseInt(m[2], 16);
      let destStart = parseInt(m[3], 16);
      for (let c = start; c <= end; c++) {
        map.set(c, String.fromCodePoint(destStart++));
      }
    }
  }

  return map;
}

/**
 * Low-level PDF stream extraction from Buffer
 */
export function extractStreamsFromPdf(pdfBuffer: Buffer): Array<{ stream: Buffer; dict: string }> {
  const streams: Array<{ stream: Buffer; dict: string }> = [];
  const bufferStr = pdfBuffer.toString('binary');

  let searchPos = 0;
  while (true) {
    const streamStart = bufferStr.indexOf('stream', searchPos);
    if (streamStart === -1) break;

    // Find preceding dictionary "<<" ... ">>"
    const dictEnd = streamStart;
    const dictStart = bufferStr.lastIndexOf('<<', dictEnd);
    const dict = dictStart !== -1 ? bufferStr.slice(dictStart, dictEnd) : '';

    // Stream content starts after \r\n or \n
    let contentStart = streamStart + 6;
    if (pdfBuffer[contentStart] === 0x0d && pdfBuffer[contentStart + 1] === 0x0a) {
      contentStart += 2;
    } else if (pdfBuffer[contentStart] === 0x0a || pdfBuffer[contentStart] === 0x0d) {
      contentStart += 1;
    }

    const endstreamPos = bufferStr.indexOf('endstream', contentStart);
    if (endstreamPos === -1) break;

    let contentEnd = endstreamPos;
    if (pdfBuffer[contentEnd - 1] === 0x0a && pdfBuffer[contentEnd - 2] === 0x0d) {
      contentEnd -= 2;
    } else if (pdfBuffer[contentEnd - 1] === 0x0a || pdfBuffer[contentEnd - 1] === 0x0d) {
      contentEnd -= 1;
    }

    const rawStreamSlice = pdfBuffer.subarray(contentStart, contentEnd);

    // Decompress if FlateDecode
    if (dict.includes('/FlateDecode') || dict.includes('/Fl')) {
      try {
        const decompressed = zlib.inflateSync(rawStreamSlice);
        streams.push({ stream: decompressed, dict });
      } catch {
        streams.push({ stream: rawStreamSlice, dict });
      }
    } else {
      streams.push({ stream: rawStreamSlice, dict });
    }

    searchPos = endstreamPos + 9;
  }

  return streams;
}

/**
 * Decodes a hex token using the CMap
 */
function decodeHexWithCMap(hex: string, cmap: Map<number, string>): string {
  let result = '';
  const step = hex.length % 4 === 0 ? 4 : 2;
  for (let i = 0; i < hex.length; i += step) {
    const code = parseInt(hex.slice(i, i + step), 16);
    if (cmap.has(code)) {
      result += cmap.get(code);
    } else if (code >= 32 && code <= 126) {
      result += String.fromCharCode(code);
    } else {
      result += ' ';
    }
  }
  return result;
}

/**
 * Decodes literal PDF string escapes
 */
function decodeLiteralString(raw: string): string {
  return raw
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\');
}

/**
 * Merges adjacent tokens that belong to the same split word or number (e.g. "1,501," and "098" -> "1,501,098")
 */
function mergeAdjacentTokens(tokens: string[]): string[] {
  if (tokens.length <= 1) return tokens;

  const merged: string[] = [];
  let current = tokens[0];

  for (let i = 1; i < tokens.length; i++) {
    const next = tokens[i];

    // Numbers split across formatting: "1,501," + "098" or "4,011," + "647" or "(1," + "153)"
    const currentIsNumberPart = /[\d,\.\(\-–—]+$/.test(current) && (current.endsWith(',') || current.endsWith('.') || current.endsWith('('));
    const nextIsNumberPart = /^[\d,\.\)\-]+/.test(next);

    // Split year like "202" + "6" -> "2026"
    const isSplitYear = /^20[12]\d$/.test(current) && /^\d$/.test(next);

    // Single character letters split: "G" + "ELECEK"
    const currentIsSingleLetter = current.length === 1 && /[a-zA-ZçğıöşüÇĞİÖŞÜ]/.test(current);
    const nextIsShortWord = next.length > 0 && /[a-zA-ZçğıöşüÇĞİÖŞÜ]/.test(next[0]);

    if (isSplitYear) {
      current += next;
    } else if (currentIsNumberPart && nextIsNumberPart) {
      current += next;
    } else if (currentIsSingleLetter && nextIsShortWord && !current.endsWith('.')) {
      current += next;
    } else {
      merged.push(current);
      current = next;
    }
  }

  if (current) merged.push(current);
  return merged;
}

/**
 * Extracts page layouts and positioned lines from raw binary PDF buffer
 */
export function extractPagesFromPdfBuffer(pdfBuffer: Buffer): ExtractedPageLayout[] {
  const streams = extractStreamsFromPdf(pdfBuffer);

  // 1. Collect all CMaps
  const cmap = new Map<number, string>();
  for (const s of streams) {
    const txt = s.stream.toString('utf8');
    if (txt.includes('begincmap')) {
      const parsed = parseStrictCMap(txt);
      for (const [k, v] of parsed.entries()) {
        cmap.set(k, v);
      }
    }
  }

  // 2. Process content streams
  const pages: ExtractedPageLayout[] = [];
  let pageNumber = 1;

  for (const s of streams) {
    const raw = s.stream.toString('binary');
    if (!raw.includes('BT') || !raw.includes('ET')) continue;

    // Filter out font definitions or XObject images
    if (s.dict.includes('/Subtype/Type1') || s.dict.includes('/Subtype/CIDFontType2') || raw.includes('begincmap')) {
      continue;
    }

    const items: Array<{ x: number; y: number; text: string }> = [];

    // Parse each BT ... ET block independently according to PDF specification
    const btMatches = raw.matchAll(/BT([\s\S]*?)ET/g);
    for (const btMatch of btMatches) {
      const btBlock = btMatch[1];
      let curX = 0;
      let curY = 0;

      // Tokenize operators inside the BT block
      const opMatches = btBlock.matchAll(
        /(?:([0-9\.\-]+)\s+([0-9\.\-]+)\s+([0-9\.\-]+)\s+([0-9\.\-]+)\s+([0-9\.\-]+)\s+([0-9\.\-]+)\s+Tm)|(?:([0-9\.\-]+)\s+([0-9\.\-]+)\s+(?:Td|TD))|(?:\[(.*?)\]\s*TJ)|(?:\((.*?)\)\s*Tj)|(?:<([0-9a-fA-F]+)>\s*Tj)/g
      );

      for (const op of opMatches) {
        if (op[1] !== undefined && op[6] !== undefined) {
          // Tm: sets text matrix (op[5] is e/X, op[6] is f/Y)
          curX = parseFloat(op[5]);
          curY = parseFloat(op[6]);
        } else if (op[7] !== undefined && op[8] !== undefined) {
          // Td or TD: translates
          curX += parseFloat(op[7]);
          curY += parseFloat(op[8]);
        } else if (op[9] !== undefined) {
          // TJ array
          const arrayStr = op[9];
          const hexMatches = arrayStr.matchAll(/<([0-9a-fA-F]+)>|\((.*?)\)/g);
          let combined = '';
          for (const hm of hexMatches) {
            if (hm[1]) combined += decodeHexWithCMap(hm[1], cmap);
            else if (hm[2]) combined += decodeLiteralString(hm[2]);
          }
          const cleaned = combined.trim();
          if (cleaned) items.push({ x: curX, y: Math.round(curY * 10) / 10, text: cleaned });
        } else if (op[10] !== undefined) {
          const cleaned = decodeLiteralString(op[10]).trim();
          if (cleaned) items.push({ x: curX, y: Math.round(curY * 10) / 10, text: cleaned });
        } else if (op[11] !== undefined) {
          const cleaned = decodeHexWithCMap(op[11], cmap).trim();
          if (cleaned) items.push({ x: curX, y: Math.round(curY * 10) / 10, text: cleaned });
        }
      }
    }

    if (items.length === 0) continue;

    // Group items by vertical position (Y coordinate descending)
    items.sort((a, b) => b.y - a.y || a.x - b.x);

    const groupedRows: Array<{ y: number; rawTokens: string[] }> = [];
    for (const item of items) {
      const existing = groupedRows.find((g) => Math.abs(g.y - item.y) <= 3.0);
      if (existing) {
        existing.rawTokens.push(item.text);
      } else {
        groupedRows.push({ y: item.y, rawTokens: [item.text] });
      }
    }

    const lines: ExtractedRawLine[] = groupedRows.map((row, lineIndex) => {
      const mergedTokens = mergeAdjacentTokens(row.rawTokens);
      const lineText = mergedTokens.join('\t');
      return {
        pageNumber,
        lineIndex,
        text: lineText,
        indentLevel: mergedTokens[0]?.startsWith('  ') ? 1 : 0,
        rawTokens: mergedTokens,
      };
    });

    pages.push({
      pageNumber,
      rawText: lines.map((l) => l.text).join('\n'),
      lines,
    });

    pageNumber++;
  }

  return pages;
}

/**
 * Creates mock page layouts from tabular text for testing and verification
 */
export function createSyntheticPageLayout(
  pageNumber: number,
  tableLines: Array<{ label: string; values: string[]; indentLevel?: number }>
): ExtractedPageLayout {
  const lines: ExtractedRawLine[] = tableLines.map((item, lineIndex) => {
    const lineText = `${'  '.repeat(item.indentLevel || 0)}${item.label}\t${item.values.join('\t')}`;
    return {
      pageNumber,
      lineIndex,
      text: lineText,
      indentLevel: item.indentLevel || 0,
      rawTokens: [item.label, ...item.values],
    };
  });

  return {
    pageNumber,
    rawText: lines.map((l) => l.text).join('\n'),
    lines,
  };
}
