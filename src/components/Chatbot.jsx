import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Loader2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import api from '../services/api';

const { chatAPI } = api;

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 'sys-1', role: 'model', text: 'Hi there! I\'m your SmartLodge assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const containerRef = useRef(null);

  // auto-scroll to bottom when messages update
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg = { id: `u-${Date.now()}`, role: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setSending(true);

    try {
      // prepare short history (last 6 messages)
      const history = messages.slice(-6).map(({ role, text }) => ({ role, text }));
      const resp = await chatAPI.sendMessage(text, history);
      const reply = resp?.data?.reply || 'Sorry, I could not generate a response.';
      setMessages((m) => [...m, { id: `m-${Date.now()}`, role: 'model', text: reply }]);
    } catch (e) {
      console.error('Chat error:', e);
      setMessages((m) => [...m, { id: `e-${Date.now()}`, role: 'model', text: 'I had trouble reaching the AI service. Please try again.' }]);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed z-40 right-5 bottom-5">
        <Button
          onClick={() => setOpen((v) => !v)}
          className="rounded-full h-14 w-14 shadow-lg bg-primary text-primary-foreground hover:opacity-90 flex items-center justify-center"
          aria-label={open ? 'Close chat' : 'Open chat'}
        >
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chat window */}
      {open && (
        <div className="fixed z-40 right-5 bottom-24 w-[360px] max-w-[92vw]">
          <div className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-primary text-primary-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <div className="font-semibold">SmartLodge Assistant</div>
              <div className="ml-auto text-xs opacity-90">Powered by Gemini</div>
            </div>

            {/* Messages */}
            <div ref={containerRef} className="max-h-[50vh] overflow-y-auto p-3 space-y-3 bg-background">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'} px-3 py-2 rounded-lg max-w-[80%] whitespace-pre-wrap leading-relaxed`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-secondary-foreground px-3 py-2 rounded-lg inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border p-3 bg-card flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask about hotels, bookings, amenities..."
                className="flex-1"
              />
              <Button onClick={send} disabled={sending || !input.trim()} className="shrink-0">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
