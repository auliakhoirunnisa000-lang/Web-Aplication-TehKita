import React from 'react';
import { Sparkles, ArrowRight, Compass, Activity, FileText } from 'lucide-react';
import { Applicant, RegistrationDraft } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, sectionId?: string) => void;
  onOpenAiChat: () => void;
  applicantStageName?: string;
  currentRole: 'candidate' | 'franchisor';
  activeApplicant?: Applicant | null;
  hasRegistered?: boolean;
  registrationDraft?: RegistrationDraft | null;
  onResumeDraft?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAiChat,
  currentRole,
  activeApplicant,
  hasRegistered = false,
  registrationDraft,
  onResumeDraft,
}) => {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-[37px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate(currentRole === 'franchisor' ? 'franchisor_dashboard' : 'landing')}
          className="text-xl font-bold tracking-tight text-emerald-900 hover:text-emerald-800 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-sm">
            TK
          </span>
          <span>TehKita</span>
          {currentRole === 'franchisor' && (
            <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-medium ml-1">
              Internal Hub
            </span>
          )}
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-stone-600">
          {currentRole === 'candidate' ? (
            <>
              <button
                onClick={() => onNavigate('landing')}
                className={`hover:text-emerald-700 transition-colors py-1 cursor-pointer ${
                  currentView === 'landing' ? 'text-emerald-800 font-semibold border-b-2 border-emerald-600' : ''
                }`}
              >
                Beranda
              </button>
              <button
                onClick={() => onNavigate('landing', 'paket-kemitraan')}
                className="hover:text-emerald-700 transition-colors py-1 cursor-pointer"
              >
                Paket Kemitraan
              </button>
              <button
                onClick={() => onNavigate('landing', 'skor-lokasi')}
                className="hover:text-emerald-700 transition-colors py-1 cursor-pointer"
              >
                Skor Lokasi
              </button>

              {/* Noticeable & Eye-Catching 'Lacak Pengajuan' Button with Live Beacon & Micro-Badge (Only visible if registered) */}
              {hasRegistered && activeApplicant && (
                <button
                  onClick={() => onNavigate('tracker')}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                    currentView === 'tracker'
                      ? 'bg-emerald-700 text-white ring-2 ring-emerald-500/40 shadow-sm'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-300/90 hover:bg-emerald-100 hover:border-emerald-500'
                  }`}
                  title="Klik untuk melihat progres tahapan pengajuan kemitraan Anda secara realtime"
                >
                  {/* Live pulsating beacon dot */}
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>

                  <Compass className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Lacak Pengajuan</span>

                  {/* Noticeable Stage Status Indicator */}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      currentView === 'tracker'
                        ? 'bg-emerald-800 text-emerald-100'
                        : activeApplicant.requestedAction
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-emerald-200/90 text-emerald-950 font-bold'
                    }`}
                  >
                    {activeApplicant.requestedAction
                      ? 'Perlu Tindakan'
                      : activeApplicant.stage === 'disetujui'
                      ? 'Disetujui ✓'
                      : 'Pantau Progres'}
                  </span>
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => onNavigate('franchisor_dashboard')}
                className={`hover:text-amber-800 transition-colors py-1 cursor-pointer ${
                  currentView === 'franchisor_dashboard' ? 'text-amber-900 font-semibold border-b-2 border-amber-600' : ''
                }`}
              >
                Pipeline Pengajuan
              </button>
              <button
                onClick={() => onNavigate('franchisor_evaluasi')}
                className={`hover:text-amber-800 transition-colors py-1 cursor-pointer ${
                  currentView === 'franchisor_evaluasi' ? 'text-amber-900 font-semibold border-b-2 border-amber-600' : ''
                }`}
              >
                Review Dokumen & Lokasi
              </button>
              <button
                onClick={() => onNavigate('franchisor_proposal')}
                className={`hover:text-amber-800 transition-colors py-1 cursor-pointer ${
                  currentView === 'franchisor_proposal' ? 'text-amber-900 font-semibold border-b-2 border-amber-600' : ''
                }`}
              >
                Kelola Proposal
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAiChat}
            className="px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1.5 border border-emerald-200 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tanya AI TehKita</span>
          </button>

          {currentRole === 'candidate' ? (
            !hasRegistered && registrationDraft ? (
              <button
                onClick={onResumeDraft || (() => onNavigate('register'))}
                className="px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap animate-pulse"
                title={`Lanjutkan pendaftaran Anda di Langkah ${registrationDraft.step}`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Lanjut Daftar (Langkah {registrationDraft.step})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('register')}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>Daftar Kemitraan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )
          ) : (
            <button
              onClick={() => onNavigate('franchisor_dashboard')}
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Kelola Data Mitra</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
