"use client";

import { useState } from "react";
import { Settings, Key, Eye, EyeOff, Plus, Trash2, Check, ChevronDown } from "lucide-react";

const PROVIDERS = [
  { id: "openai", name: "OpenAI", models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"] },
  { id: "anthropic", name: "Anthropic", models: ["claude-sonnet-4-20250514", "claude-3-5-haiku-20241022", "claude-3-opus-20240229"] },
  { id: "google", name: "Google AI", models: ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-3.5-flash-lite"] },
  { id: "openrouter", name: "OpenRouter", models: ["openrouter/free", "google/gemini-2.5-flash:free", "meta-llama/llama-3.3-70b-instruct:free", "mistralai/mistral-small-3.1-24b-instruct:free", "openai/gpt-4o-mini", "anthropic/claude-sonnet-4"] },
  { id: "nvidia", name: "NVIDIA NIM", models: ["meta/llama-3.1-405b-instruct", "meta/llama-3.1-70b-instruct", "mistralai/mixtral-8x22b-instruct-v0.1"] },
  { id: "groq", name: "Groq", models: ["llama-3.3-70b-versatile", "mixtral-8x7b-32768"] },
  { id: "deepseek", name: "DeepSeek", models: ["deepseek-chat", "deepseek-reasoner"] },
  { id: "custom", name: "Custom Endpoint", models: [] },
];

export default function SettingsDialog({ isOpen, onClose, llmKeys, onSaveKeys }) {
  const [keys, setKeys] = useState(llmKeys || []);
  const [showKeys, setShowKeys] = useState({});
  const [selectedProvider, setSelectedProvider] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newModel, setNewModel] = useState("");
  const [customEndpoint, setCustomEndpoint] = useState("");

  const activeProvider = PROVIDERS.find((p) => p.id === selectedProvider);

  const handleAddKey = () => {
    if (!selectedProvider || !newKey.trim()) return;

    const existing = keys.findIndex((k) => k.provider === selectedProvider);
    const entry = {
      provider: selectedProvider,
      apiKey: newKey.trim(),
      model: newModel || null,
      endpoint: selectedProvider === "custom" ? customEndpoint : null,
    };

    if (existing >= 0) {
      const updated = [...keys];
      updated[existing] = entry;
      setKeys(updated);
    } else {
      setKeys([...keys, entry]);
    }

    setNewKey("");
    setNewModel("");
    setCustomEndpoint("");
  };

  const handleRemoveKey = (provider) => {
    setKeys(keys.filter((k) => k.provider !== provider));
  };

  const handleSave = () => {
    onSaveKeys(keys);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center">
              <Key size={18} className="text-teal" />
            </div>
            <div>
              <h2 className="font-semibold text-navy">API Keys</h2>
              <p className="text-xs text-muted-foreground">Bring your own key</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Existing keys */}
          {keys.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Keys</p>
              {keys.map((k) => {
                const provider = PROVIDERS.find((p) => p.id === k.provider);
                return (
                  <div
                    key={k.provider}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-navy/10 flex items-center justify-center">
                        <Key size={14} className="text-navy" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {provider?.name || k.provider}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {k.model || "Default model"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={16} className="text-teal" />
                      <button
                        onClick={() => handleRemoveKey(k.provider)}
                        className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} className="text-destructive" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add new key */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {keys.length > 0 ? "Add / Replace Key" : "Add Your API Key"}
            </p>

            {/* Provider select */}
            <div className="relative">
              <select
                value={selectedProvider}
                onChange={(e) => {
                  setSelectedProvider(e.target.value);
                  setNewModel("");
                }}
                className="w-full appearance-none bg-muted border border-border rounded-xl px-4 py-2.5 pr-10 text-sm text-foreground outline-none focus:border-teal transition-colors cursor-pointer"
              >
                <option value="">Select provider...</option>
                {PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>

            {/* Model select (if provider has models) */}
            {activeProvider && activeProvider.models.length > 0 && (
              <div className="relative">
                <select
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full appearance-none bg-muted border border-border rounded-xl px-4 py-2.5 pr-10 text-sm text-foreground outline-none focus:border-teal transition-colors cursor-pointer"
                >
                  <option value="">Default model</option>
                  {activeProvider.models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            )}

            {/* Custom endpoint */}
            {selectedProvider === "custom" && (
              <input
                type="text"
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
                placeholder="API endpoint URL (e.g., http://localhost:11434/v1)"
                className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-teal transition-colors placeholder:text-muted-foreground"
              />
            )}

            {/* API Key input */}
            {selectedProvider && (
              <div className="relative">
                <input
                  type={showKeys[selectedProvider] ? "text" : "password"}
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Paste your API key..."
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 pr-10 text-sm text-foreground outline-none focus:border-teal transition-colors placeholder:text-muted-foreground"
                />
                <button
                  onClick={() => setShowKeys({ ...showKeys, [selectedProvider]: !showKeys[selectedProvider] })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKeys[selectedProvider] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            )}

            {/* Add button */}
            {selectedProvider && newKey.trim() && (
              <button
                onClick={handleAddKey}
                className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
              >
                <Plus size={16} />
                {keys.find((k) => k.provider === selectedProvider) ? "Update Key" : "Add Key"}
              </button>
            )}
          </div>

          {/* Info */}
          <div className="bg-teal-light border border-teal/20 rounded-xl p-4">
            <p className="text-xs text-navy leading-relaxed">
              <strong>Your keys stay in your browser.</strong> We never store API keys on our servers.
              All AI requests are made directly from your browser to the provider.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium bg-teal hover:bg-teal/90 text-white rounded-lg transition-colors"
          >
            Save Keys
          </button>
        </div>
      </div>
    </div>
  );
}
