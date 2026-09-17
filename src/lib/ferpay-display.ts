export function messageList(message: unknown): string[] {
  if (message == null || message === "") return [];
  if (Array.isArray(message)) {
    return message.flatMap((item) => messageList(item)).filter(Boolean);
  }
  const text = normalizeMessage(message).trim();
  return text ? [text] : [];
}

export function normalizeMessage(message: unknown): string {
  if (message == null) return "";
  if (Array.isArray(message)) {
    return message.map((item) => normalizeMessage(item)).filter(Boolean).join("\n");
  }
  if (typeof message === "object") {
    const rec = message as Record<string, unknown>;
    return String(rec.text ?? rec.body ?? rec.message ?? JSON.stringify(message));
  }
  return String(message);
}

export function extractCode(text: string) {
  if (!text) return null;
  const match = text.match(/\b(\d{3}[\s-]?\d{3}|\d{4,8})\b/);
  return match ? match[1].replace(/\D/g, "") : null;
}
