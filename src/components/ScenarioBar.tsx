import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  RotateCcw, 
  Bell, 
  MessageSquare, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Applicant } from '../types';

interface ScenarioBarProps {
  currentRole: 'candidate' | 'franchisor';
  onRoleChange: (role: 'candidate' | 'franchisor') => void;
  activeApplicant: Applicant | null;
  hasRegistered: boolean;
  allApplicants: Applicant[];
  onSelectApplicant: (applicant: Applicant) => void;
  onSelectGuestMode: () => void;
  onResetData: () => void;
  onOpenNotifications: () => void;
  unreadNotifsCount: number;
  onOpenAiChat: () => void;
}

export const ScenarioBar: React.FC<ScenarioBarProps> = ({
  currentRole,
  onRoleChange,
  activeApplicant,
  hasRegistered,
  allApplicants,
  onSelectApplicant,
  onSelectGuestMode,
  onResetData,
  onOpenNotifications,
  unreadNotifsCount,
  onOpenAiChat,
}) => {
  return (
    <div className="bg-stone-900 text-stone-200 border-b border-stone-800 text-xs py-2 px-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-stone-400 font-medium">Mode Perspektif:</span>
          <div className="inline-flex rounded-lg bg-stone-800 p-0.5 border border-stone-700">
            <button
              onClick={() => onRoleChange('candidate')}
              className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                currentRole === 'candidate'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Calon Mitra</span>
            </button>
            <button
              onClick={() => onRoleChange('franchisor')}
              className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                currentRole === 'franchisor'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Tim Franchisor (TehKita)</span>
            </button>
          </div>
        </div>

        {/* Center: Scenario Selector for PRD Testing */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-stone-400 font-medium">Skenario PRD:</span>
          <div className="relative inline-block">
            <select
              value={!hasRegistered || !activeApplicant ? 'guest' : activeApplicant.id}
              onChange={(e) => {
                if (e.target.value === 'guest') {
                  onSelectGuestMode();
                } else {
                  const found = allApplicants.find((a) => a.id === e.target.value);
                  if (found) onSelectApplicant(found);
                }
              }}
              className="bg-stone-800 text-stone-100 border border-stone-700 rounded-md px-3 py-1 pr-7 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer appearance-none"
            >
              <option value="guest">Calon Baru (Belum Mendaftar Kemitraan)</option>
              <option value="app-001">Skenario 1: Budi Santoso (Proposal Siap Ditinjau & Negosiasi)</option>
              <option value="app-002">Skenario 2: Siti Rahmawati (Perlu Perbaikan Dokumen KTP)</option>
              <option value="app-003">Skenario 3: Dimas Pratama (Menunggu Lokasi & Usulan Baru)</option>
              <option value="app-004">Skenario 4: Rina Anggraini (Kemitraan Resmi Disetujui)</option>
              <option value="app-005">Skenario 5: Hendra Wijaya (Pengajuan Ditolak - Benturan Zonasi)</option>
            </select>
            <ChevronDown className="w-3 h-3 text-stone-400 absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Right: Quick Tools (AI Chat, WhatsApp & Email Notifs, Reset) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAiChat}
            className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Buka Chatbot AI Tanya Jawab (Scope 1)"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Tanya AI</span>
          </button>

          <button
            onClick={onOpenNotifications}
            className="relative px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Lihat Simulasi Notifikasi WhatsApp & Email (Scope 7)"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Simulasi Notifikasi</span>
            {unreadNotifsCount > 0 && (
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          <button
            onClick={onResetData}
            className="px-2.5 py-1 rounded bg-stone-800 hover:bg-red-950/40 text-stone-400 hover:text-red-300 border border-stone-700 flex items-center gap-1 transition-colors cursor-pointer"
            title="Reset Data Skenario ke Awal"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
