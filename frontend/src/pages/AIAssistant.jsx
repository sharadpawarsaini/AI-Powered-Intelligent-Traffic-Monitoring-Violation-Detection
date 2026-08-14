import React, { useState } from 'react';
import { assistantAPI } from '../services/api';
import { Bot, Send, Sparkles, Database, FileText, CheckCircle2, Clock } from 'lucide-react';

export const AIAssistant = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your AI Traffic Assistant. Ask me anything about today\'s accidents, traffic violations, or peak volume statistics.',
      retrieved: [],
      source: 'SYSTEM'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const sampleQueries = [
    "How many accidents occurred today?",
    "Which location has the highest number of traffic violations?",
    "Summarize today's major traffic incidents.",
    "How many helmet violations occurred?",
    "Which vehicle was involved in the most violations?"
  ];

  const handleSend = async (textToSend) => {
    const qText = textToSend || query;
    if (!qText.trim() || loading) return;

    const userMsg = { sender: 'user', text: qText };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const response = await assistantAPI.query(qText);
      const botMsg = {
        sender: 'bot',
        text: response.answer,
        retrieved: response.retrieved_events || [],
        sql: response.sql_executed,
        source: response.source,
        execution_ms: response.execution_time_ms
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'I could not retrieve sufficient evidence to process that question.',
        retrieved: [],
        source: 'ERROR'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header banner */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 flex items-center space-x-4">
        <div className="p-3 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl text-white shadow-lg shadow-cyan-500/20">
          <Bot className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">GenAI / RAG Traffic Assistant</h2>
          <p className="text-xs text-slate-400 font-mono">Grounded Querying across Structured DB Records & Vector Store Embeddings</p>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex flex-wrap gap-2">
        {sampleQueries.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sample)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800 transition font-medium"
          >
            "{sample}"
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="glass-panel rounded-xl border border-slate-800 p-5 space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-2xl rounded-xl p-4 text-xs ${
              msg.sender === 'user'
                ? 'bg-cyan-600 text-white font-medium'
                : 'bg-slate-900 border border-slate-800 text-slate-200 space-y-3'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.text}</p>

              {msg.source && msg.sender === 'bot' && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-mono text-[10px] text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Database className="w-3 h-3 text-cyan-400" />
                    <span>SOURCE: {msg.source}</span>
                  </span>
                  {msg.execution_ms && (
                    <span className="flex items-center space-x-1 text-emerald-400">
                      <Clock className="w-3 h-3" />
                      <span>{msg.execution_ms} ms</span>
                    </span>
                  )}
                </div>
              )}

              {msg.retrieved && msg.retrieved.length > 0 && (
                <div className="mt-3 p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Retrieved Grounded Evidence:</span>
                  {msg.retrieved.slice(0, 3).map((item, i) => (
                    <p key={i} className="text-[11px] font-mono text-slate-400">
                      • [{item.event_type || 'INCIDENT'}] {item.description || item.violation_type || 'Event logged'} (Conf: {(item.confidence * 100).toFixed(0)}%)
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-cyan-400 font-mono flex items-center space-x-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Querying Database & Embedding Vector Store...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex space-x-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask natural language question about traffic incidents..."
          className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold flex items-center space-x-2 text-sm transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>Ask AI</span>
        </button>
      </form>
    </div>
  );
};
