import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Mail, 
  Check, 
  CheckCheck, 
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onSelectAction: (targetView: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onSelectAction,
  onMarkAllAsRead,
}) => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email'>('whatsapp');

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter((n) => n.channel === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl flex flex-col h-[580px] max-h-[90vh] overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="bg-stone-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base tracking-tight">Simulasi Notifikasi Terpadu</h3>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-medium">
                Scope 7 PRD
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Notifikasi instan otomatis via WhatsApp Business & Email resmi saat status berubah
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Selector */}
        <div className="flex border-b border-stone-200 bg-stone-100 p-2 gap-2">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Business Official</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'email'
                ? 'bg-stone-800 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email Terstruktur</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
          {activeTab === 'whatsapp' ? (
            /* WhatsApp UI Mockup */
            <div className="space-y-4">
              {/* WhatsApp Contact Header Card */}
              <div className="bg-emerald-900 text-white p-3 rounded-xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-500">
                    TK
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span>TehKita Partnership Official</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    </div>
                    <span className="text-[10px] text-emerald-200">Akun Resmi Bisnis Terverifikasi</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-800/80 px-2 py-1 rounded text-emerald-200">
                  Bot Otomasi
                </span>
              </div>

              {filteredNotifs.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-xs">
                  Belum ada pesan WhatsApp baru.
                </div>
              ) : (
                filteredNotifs.map((item) => (
                  <div key={item.id} className="flex flex-col items-start max-w-[92%]">
                    {/* Date pill */}
                    <div className="w-full flex justify-center my-1">
                      <span className="text-[10px] bg-stone-200/80 text-stone-600 px-2 py-0.5 rounded-full">
                        {item.timestamp}
                      </span>
                    </div>

                    {/* WhatsApp Chat Bubble */}
                    <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-xs p-3.5 shadow-xs text-xs space-y-2 text-stone-800 w-full">
                      <div className="font-bold text-emerald-800 text-xs flex items-center justify-between">
                        <span>📢 {item.title}</span>
                      </div>
                      <p className="text-stone-700 whitespace-pre-line leading-relaxed">
                        {item.content}
                      </p>

                      {/* Interactive Deep Link inside WhatsApp message */}
                      {item.linkText && item.targetView && (
                        <div className="pt-2 border-t border-stone-100">
                          <button
                            onClick={() => {
                              onClose();
                              onSelectAction(item.targetView!);
                            }}
                            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>{item.linkText}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-1 text-[10px] text-stone-400 pt-1">
                        <span>{item.timestamp}</span>
                        <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Email UI Mockup */
            <div className="space-y-4">
              {filteredNotifs.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-xs">
                  Belum ada pesan email baru.
                </div>
              ) : (
                filteredNotifs.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs space-y-3"
                  >
                    <div className="border-b border-stone-100 pb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-stone-900">
                          Dari: kemitraan@tehkita.co.id
                        </span>
                        <span className="text-[10px] text-stone-400">{item.timestamp}</span>
                      </div>
                      <h4 className="font-bold text-xs text-stone-800 mt-1">{item.title}</h4>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-lg text-xs text-stone-700 leading-relaxed whitespace-pre-line border border-stone-100">
                      {item.content}
                    </div>

                    {item.linkText && item.targetView && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => {
                            onClose();
                            onSelectAction(item.targetView!);
                          }}
                          className="bg-stone-900 hover:bg-stone-800 text-white font-medium py-1.5 px-3 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{item.linkText}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Menjaga calon mitra tetap informed tanpa menunggu manual</span>
          <button
            onClick={onMarkAllAsRead}
            className="text-stone-700 hover:text-stone-900 font-semibold cursor-pointer"
          >
            Tandai Semua Dibaca
          </button>
        </div>
      </div>
    </div>
  );
};
