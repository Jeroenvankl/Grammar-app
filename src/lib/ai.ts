const RATE_LIMIT_KEY = "syntaxlab_ai_messages";
const MAX_MESSAGES_PER_DAY = 20;

interface RateLimitData {
  date: string;
  count: number;
}

export function checkRateLimit(): { allowed: boolean; remaining: number } {
  if (typeof window === "undefined") return { allowed: true, remaining: MAX_MESSAGES_PER_DAY };
  const today = new Date().toISOString().split("T")[0];
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  if (!stored) return { allowed: true, remaining: MAX_MESSAGES_PER_DAY };
  try {
    const data: RateLimitData = JSON.parse(stored);
    if (data.date !== today) return { allowed: true, remaining: MAX_MESSAGES_PER_DAY };
    const remaining = MAX_MESSAGES_PER_DAY - data.count;
    return { allowed: remaining > 0, remaining: Math.max(0, remaining) };
  } catch {
    return { allowed: true, remaining: MAX_MESSAGES_PER_DAY };
  }
}

function incrementRateLimit(): void {
  if (typeof window === "undefined") return;
  const today = new Date().toISOString().split("T")[0];
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  let data: RateLimitData = { date: today, count: 0 };
  if (stored) {
    try {
      const parsed: RateLimitData = JSON.parse(stored);
      if (parsed.date === today) data = parsed;
    } catch { /* reset */ }
  }
  data.count += 1;
  data.date = today;
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
}

function getApiKey(provider: "gemini" | "groq"): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`syntaxlab_${provider}_key`);
}

export function getAvailableProvider(): "gemini" | "groq" | null {
  if (getApiKey("gemini")) return "gemini";
  if (getApiKey("groq")) return "groq";
  return null;
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

async function callGemini(messages: ChatMessage[], apiKey: string): Promise<string> {
  const systemMsg = messages.find((m) => m.role === "system");
  const chatMessages = messages.filter((m) => m.role !== "system");
  const contents = chatMessages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const body: Record<string, unknown> = {
    contents,
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
  };
  if (systemMsg) {
    body.systemInstruction = { parts: [{ text: systemMsg.content }] };
  }
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
  );
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API fout: ${response.status} — ${err}`);
  }
  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Geen antwoord ontvangen.";
}

async function callGroq(messages: ChatMessage[], apiKey: string): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API fout: ${response.status} — ${err}`);
  }
  const data = await response.json();
  return data?.choices?.[0]?.message?.content || "Geen antwoord ontvangen.";
}

export function getSystemPrompt(languageId?: string): string {
  const lang = languageId === "japanese" ? "Japans" : languageId === "italian" ? "Italiaans" : "de taal";
  return `Je bent SyntaxBot, een vriendelijke en geduldige grammatica-tutor in de SyntaxLab app.
Je helpt Nederlandse leerlingen met ${lang} grammatica.

Regels:
- Antwoord altijd in het Nederlands, behalve bij voorbeeldzinnen in de doeltaal.
- Geef korte, duidelijke uitleg (max 3-4 zinnen per punt).
- Gebruik voorbeelden om regels te illustreren.
- Als een leerling een fout maakt, leg dan vriendelijk uit waarom het fout is.
- Bij Japans: geef romaji naast kanji/kana voor beginners.
- Focus op grammatica, niet op vocabulaire.
- Als je het niet zeker weet, zeg dat eerlijk.`;
}

export async function sendChatMessage(
  messages: ChatMessage[]
): Promise<{ response: string; provider: string }> {
  const { allowed } = checkRateLimit();
  if (!allowed) {
    return {
      response: `Je hebt het dagelijkse limiet van ${MAX_MESSAGES_PER_DAY} berichten bereikt. Probeer het morgen opnieuw!`,
      provider: "system",
    };
  }
  const geminiKey = getApiKey("gemini");
  const groqKey = getApiKey("groq");
  if (!geminiKey && !groqKey) {
    return {
      response: "Geen API-key ingesteld. Ga naar Instellingen om je Gemini of Groq API-key toe te voegen.",
      provider: "system",
    };
  }
  try {
    let response: string;
    let provider: string;
    if (geminiKey) {
      response = await callGemini(messages, geminiKey);
      provider = "Gemini";
    } else {
      response = await callGroq(messages, groqKey!);
      provider = "Groq";
    }
    incrementRateLimit();
    return { response, provider };
  } catch (error) {
    try {
      if (geminiKey && groqKey) {
        const response = await callGroq(messages, groqKey);
        incrementRateLimit();
        return { response, provider: "Groq (fallback)" };
      }
    } catch { /* both failed */ }
    return {
      response: `Er is een fout opgetreden: ${error instanceof Error ? error.message : "Onbekende fout"}.`,
      provider: "error",
    };
  }
}
