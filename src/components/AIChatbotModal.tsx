import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ArrowRight, 
  ExternalLink,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { ChatMessage } from '../types';
import { CHATBOT_KNOWLEDGE_BASE } from '../data/mockData';

interface AIChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToForm: () => void;
  onNavigateToLocation: () => void;
}

export const AIChatbotModal: React.FC<AIChatbotModalProps> = ({
  isOpen,
  onClose,
  onNavigateToForm,
  onNavigateToLocation,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      timestamp: 'Baru saja',
      text: 'Halo! Selamat datang di Layanan Informasi Kemitraan TehKita 🍵. Saya asisten cerdas resmi TehKita. Ada yang bisa saya bantu seputar paket waralaba, syarat pendaftaran, modal awal, atau kriteria lokasi?',
      actionChips: [
        { label: 'Apa saja paket kemitraan?', action: 'paket' },
        { label: 'Berapa modal awal & royalti bulanan?', action: 'royalty' },
        { label: 'Bagaimana jika belum punya lokasi?', action: 'lokasi' },
        { label: 'Bagaimana alur pendaftarannya?', action: 'alur' },
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: 'Baru saja',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let matchedEntry = CHATBOT_KNOWLEDGE_BASE.find((entry) =>
        entry.keywords.some((kw) => lower.includes(kw))
      );

      let replyText = '';
      let replyChips: { label: string; action: string }[] | undefined;

      if (matchedEntry) {
        replyText = matchedEntry.response;
        replyChips = matchedEntry.chips.map((c) => ({
          label: c,
          action: c.toLowerCase(),
        }));
      } else if (lower.includes('kontak') || lower.includes('admin') || lower.includes('telepon')) {
        replyText = `Untuk konsultasi khusus atau pertanyaan di luar panduan resmi, Anda dapat menghubungi Customer Service Kemitraan TehKita melalui WhatsApp resmi di **0812-8800-TEHKITA** (Senin - Sabtu, 08.00 - 17.00 WIB).`;
      } else {
        replyText = `Terima kasih atas pertanyaannya! Berdasarkan dokumen kemitraan resmi TehKita:
- Kami menawarkan paket kemitraan siap jualan mulai Rp 7,5 Juta.
- Sistem **0% royalty bulanan**, keuntungan 100% untuk Anda.
- Seluruh dokumen & kriteria lokasi dapat diproses secara terstruktur di sistem ini.

Jika pertanyaan Anda memerlukan pengecekan data spesifik, silakan hubungi tim kemitraan kami atau klik tombol formulir untuk memulai pengajuan.`;
        replyChips = [
          { label: 'Pilihan Paket Kemitraan', action: 'paket' },
          { label: 'Mulai Isi Formulir', action: 'form' },
        ];
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'Baru saja',
        text: replyText,
        actionChips: replyChips,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleChipClick = (action: string) => {
    if (action.includes('paket')) {
      handleSendMessage('Apa saja rincian paket kemitraan TehKita?');
    } else if (action.includes('royalt') || action.includes('modal')) {
      handleSendMessage('Berapa modal awal dan apakah ada royalti fee bulanan?');
    } else if (action.includes('lokasi')) {
      handleSendMessage('Bagaimana jika saya belum punya lokasi usaha?');
    } else if (action.includes('alur') || action.includes('syarat')) {
      handleSendMessage('Bagaimana alur dan syarat pengajuan kemitraan?');
    } else if (action.includes('form') || action.includes('pendaftaran') || action.includes('daftar')) {
      onClose();
      onNavigateToForm();
    } else {
      handleSendMessage(action);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl flex flex-col h-[600px] max-h-[90vh] overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="bg-emerald-800 text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-700 border border-emerald-500 flex items-center justify-center shadow-inner">
              <Bot className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-tight">Tanya AI TehKita</h3>
                <span className="text-[10px] bg-emerald-600/80 text-emerald-100 px-2 py-0.5 rounded font-medium">
                  Dokumen Resmi
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Informasi instan paket, syarat, biaya & alur kemitraan F&B
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-700/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer bar from PRD Scope 1 */}
        <div className="bg-emerald-50/90 border-b border-emerald-100 px-4 py-2 text-[11px] text-emerald-900 flex items-center gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>
            Jawaban berdasarkan SOP resmi TehKita. AI tidak memutuskan atau menjanjikan hasil pengajuan.
          </span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-br-none shadow-xs'
                    : 'bg-white text-stone-800 rounded-tl-none border border-stone-200 shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Optional Action Chips */}
                {msg.actionChips && msg.actionChips.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-wrap gap-1.5">
                    {msg.actionChips.map((chip, i) => (
                      <button
                        key={i}
                        onClick={() => handleChipClick(chip.action)}
                        className="text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-md transition-colors font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <span>{chip.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[9px] mt-1.5 ${
                    msg.sender === 'user' ? 'text-emerald-200 text-right' : 'text-stone-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-stone-600" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start items-center text-xs text-stone-500 italic py-1">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-700 animate-spin" />
              </div>
              <div className="bg-white border border-stone-200 px-3 py-2 rounded-xl text-stone-500 flex items-center gap-1">
                <span>AI sedang merangkum jawaban resmi</span>
                <span className="animate-pulse">...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Conversion CTA Bar */}
        <div className="bg-emerald-900/5 px-4 py-2 border-t border-stone-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-stone-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px]">Siap bergabung dengan 350+ mitra?</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onNavigateToForm();
            }}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Formulir Pendaftaran</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tanyakan paket, biaya franchise, syarat, lokasi..."
            className="flex-1 bg-stone-100 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-200 text-white disabled:text-stone-400 p-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
