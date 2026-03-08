"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Key } from "lucide-react";
import Layout from "@/components/ui/Layout";
import {
  sendChatMessage,
  getAvailableProvider,
  getSystemPrompt,
  checkRateLimit,
} from "@/lib/ai";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const hasProvider = getAvailableProvider() !== null;
  const { remaining } = checkRateLimit();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const chatMessages = [
      { role: "system" as const, content: getSystemPrompt() },
      ...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user" as const, content: userMsg.content },
    ];

    const result = await sendChatMessage(chatMessages);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: result.response },
    ]);
    setLoading(false);
  };

  if (!hasProvider) {
    return (
      <Layout>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-stone-800">AI Tutor</h1>
          <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm text-center space-y-4">
            <Bot className="w-16 h-16 mx-auto text-indigo-300" />
            <h2 className="text-xl font-bold text-stone-800">
              Stel je AI-tutor in
            </h2>
            <p className="text-stone-500 max-w-md mx-auto">
              Om de AI-tutor te gebruiken heb je een gratis API-key nodig van
              Google Gemini of Groq.
            </p>
            <div className="bg-stone-50 rounded-xl p-4 text-left text-sm space-y-2 max-w-md mx-auto">
              <p className="font-semibold text-stone-700">
                <Key className="w-4 h-4 inline mr-1" />
                Hoe krijg je een gratis key?
              </p>
              <ol className="list-decimal list-inside text-stone-600 space-y-1">
                <li>
                  Ga naar{" "}
                  <span className="text-indigo-600">
                    aistudio.google.com
                  </span>
                </li>
                <li>Log in met je Google account</li>
                <li>Klik op &quot;Get API Key&quot;</li>
                <li>Kopieer de key</li>
              </ol>
            </div>
            <Link
              href="/instellingen"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Ga naar Instellingen
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-stone-800">AI Tutor</h1>
          <span className="text-xs text-stone-400">
            {remaining} berichten over vandaag
          </span>
        </div>

        {/* Chat */}
        <div
          ref={chatRef}
          className="bg-white rounded-2xl border border-stone-200 shadow-sm h-[60vh] overflow-y-auto p-4 space-y-4"
        >
          {messages.length === 0 && (
            <div className="text-center py-12 text-stone-400">
              <Bot className="w-12 h-12 mx-auto mb-3 text-stone-300" />
              <p className="font-medium">Hoi! Ik ben SyntaxBot.</p>
              <p className="text-sm mt-1">
                Stel me een vraag over grammatica!
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {[
                  "Wanneer gebruik je は vs が?",
                  "Leg het presente indicativo uit",
                  "Wat zijn Italiaanse voorzetsels?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="text-xs px-3 py-1.5 bg-stone-100 rounded-full text-stone-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : ""
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-indigo-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-stone-100 text-stone-700"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-stone-500" />
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                <Bot className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="bg-stone-100 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <span
                    className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Stel een vraag over grammatica..."
            className="flex-1 px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm outline-none focus:border-indigo-400 transition-colors"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Layout>
  );
}
