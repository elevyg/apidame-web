export function fitRect(
  sourceWidth: number,
  sourceHeight: number,
  maxWidth: number,
  maxHeight: number,
) {
  if (sourceWidth <= 0 || sourceHeight <= 0) {
    return { width: maxWidth, height: maxHeight, scale: 1 };
  }
  const scale = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight);
  return {
    width: sourceWidth * scale,
    height: sourceHeight * scale,
    scale,
  };
}

const PDF_CHAR_REPLACEMENTS: Record<string, string> = {
  "\u2018": "'",
  "\u2019": "'",
  "\u201C": '"',
  "\u201D": '"',
  "\u2013": "-",
  "\u2014": "-",
  "\u2026": "...",
  "\u00A0": " ",
  "\u26A0": "ATENCION",
};

export function sanitizePdfText(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/\uFE0F/g, "")
    .replace(/./gu, (ch) => PDF_CHAR_REPLACEMENTS[ch] ?? ch)
    .replace(/[^\u0009\u000A\u000D\u0020-\u007E\u00A0-\u00FF]/g, "");
}

export function wrapWords(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}
