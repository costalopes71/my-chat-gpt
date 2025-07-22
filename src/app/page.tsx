// src/app/page.tsx
"use client";

import { useState } from "react";

type Message = {
  role: "User" | "Assistant";
  text: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const askTheAI = async (question: string) => {
    if (!question.trim()) return;

    const userMessage: Message = { role: "User", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: question }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        role: "Assistant",
        text: data.response ?? "No response from AI.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMsg: Message = {
        role: "Assistant",
        text: "There was an error communicating with the AI.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    askTheAI(input);
    setInput("");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-50">
      <div className="w-full max-w-3xl flex flex-col gap-4">
        {/* Conversation History */}
        <div className="flex flex-col gap-2 bg-white shadow-md rounded-lg p-4 overflow-y-auto max-h-[40vh] text-gray-800">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center">No conversation yet.</p>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="whitespace-pre-wrap">
                <span className="font-semibold">{msg.role}:</span>{" "}
                {msg.text}
              </div>
            ))
          )}
          {loading && (
            <div className="text-blue-500 font-semibold">Assistant is typing...</div>
          )}
        </div>

        {/* Textarea */}
        <textarea
          className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
          placeholder="Type your question here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask the AI"}
        </button>
      </div>
    </main>
  );
}
