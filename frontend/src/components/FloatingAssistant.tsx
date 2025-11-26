import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X, Sparkles } from 'lucide-react'
import { aiService } from '../services/aiService'
import { useAppStore } from '../store/appStore'
import { Button } from './common/Button'
import { cn } from '../utils/cn'

const influencerSuggestions = [
  'Help me optimize my profile',
  'Find campaigns matching my niche',
  'Review my application draft',
]

const brandSuggestions = [
  'Recommend influencers for my campaign',
  'How should I price my campaign?',
  'Best practices for campaign briefs',
]

type Message = {
  from: 'bot' | 'user'
  text: string
}

export const FloatingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [conversation, setConversation] = useState<Message[]>([
    { from: 'bot', text: 'Hey! I am Lumi—the AI strategist helping you ship campaigns faster.' },
  ])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { userType } = useAppStore()

  const suggestions = userType === 'brand' ? brandSuggestions : influencerSuggestions

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  const handleSend = async (prompt?: string) => {
    const content = prompt ?? message.trim()
    if (!content || loading) return

    setMessage('')
    setConversation((prev) => [...prev, { from: 'user', text: content }])
    setLoading(true)

    try {
      const response = await aiService.chat(content, { userType })
      setConversation((prev) => [
        ...prev,
        {
          from: 'bot',
          text: response.data?.response || 'I hit a snag, mind trying again?',
        },
      ])
    } catch (error) {
      console.error('AI chat error:', error)
      setConversation((prev) => [
        ...prev,
        {
          from: 'bot',
          text: 'I lost connection for a second—try again in a moment.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <div
        className={cn(
          'w-[360px] overflow-hidden rounded-[32px] border border-white/60 bg-white/95 shadow-glass backdrop-blur transition',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        {isOpen && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b border-charcoal/5 px-5 py-4">
              <div>
                <p className="font-semibold text-charcoal">Lumi · AI Copilot</p>
                <p className="text-xs text-charcoal/50">Here to unblock your next move</p>
              </div>
              <button className="rounded-full border border-charcoal/10 p-1 text-charcoal/60" onClick={() => setIsOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="flex max-h-[360px] flex-col gap-3 overflow-y-auto px-5 py-4">
              {conversation.map((entry, index) => (
                <div
                  key={`${entry.text}-${index}`}
                  className={cn(
                    'rounded-3xl px-4 py-3 text-sm shadow-sm',
                    entry.from === 'bot' ? 'bg-cream/80 text-charcoal' : 'ml-auto bg-sage text-white'
                  )}
                >
                  {entry.text}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 rounded-3xl bg-cream/80 px-4 py-3 text-sm text-charcoal/70">
                  <Sparkles className="animate-pulse text-sage" size={16} />
                  Thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-charcoal/5 px-5 py-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    className="rounded-full border border-charcoal/10 px-3 py-1 text-xs text-charcoal/70 transition hover:border-sage hover:text-sage"
                    onClick={() => handleSend(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 rounded-3xl border border-charcoal/10 bg-white px-3">
                <input
                  className="h-11 flex-1 bg-transparent text-sm outline-none"
                  placeholder="Ask Lumi anything…"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && !event.shiftKey && handleSend()}
                />
                <button
                  className="rounded-2xl bg-sage p-2 text-white transition hover:bg-olive"
                  disabled={loading || !message.trim()}
                  onClick={() => handleSend()}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Button
        className="shadow-halo"
        onClick={() => setIsOpen((prev) => !prev)}
        variant="primary"
        size="lg"
        leftIcon={<MessageCircle size={18} />}
      >
        {isOpen ? 'Close Lumi' : 'Ask Lumi'}
      </Button>
    </div>
  )
}

