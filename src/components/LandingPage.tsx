import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  Coffee, 
  Building2, 
  Users, 
  HelpCircle,
  Clock,
  DollarSign,
  FileText,
  RotateCcw
} from 'lucide-react';
import { FRANCHISE_PACKAGES } from '../data/mockData';
import { calculateLocationScore } from '../utils/locationScorer';
import { RegistrationDraft } from '../types';
import heroTeaImg from '../assets/images/tehkita_iced_tea_1791219345466.jpg';

interface LandingPageProps {
  onStartRegistration: () => void;
  onOpenAiChat: () => void;
  onOpenLocationGuide: () => void;
  onViewTracker: () => void;
  onResumeDraft?: () => void;
  onDiscardDraft?: () => void;
  hasRegistered?: boolean;
  registrationDraft?: RegistrationDraft | null;
  activeApplicant?: {
    registrationNumber: string;
    fullName: string;
    stage: string;
    requestedAction?: { title: string };
  } | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartRegistration,
  onOpenAiChat,
  onOpenLocationGuide,
  onViewTracker,
  onResumeDraft,
  onDiscardDraft,
  hasRegistered = false,
  registrationDraft,
  activeApplicant,
}) => {
  // Mini interactive location score simulator on landing page
  const [quickAddress, setQuickAddress] = useState('Jl. Margonda Raya No. 100, Depok');
  const [quickType, setQuickType] = useState<'depan_minimarket' | 'area_kampus_sekolah' | 'ruko'>('depan_minimarket');
  const [quickTraffic, setQuickTraffic] = useState<'tinggi' | 'sedang' | 'rendah'>('tinggi');
  const [quickDistance, setQuickDistance] = useState(2.2);

  const quickScore = calculateLocationScore({
    locationType: quickType,
    pedestrianTraffic: quickTraffic,
    vehicleTraffic: 'tinggi',
    hasParkingMotor: true,
    hasParkingMobil: true,
    nearestTehKitaDistanceKm: quickDistance,
    electricityPowerVa: 1300,
    hasCleanWater: true,
  });

  return (
    <div className="space-y-16 py-8">
      {/* Draft Resumption Trigger Banner */}
      {!hasRegistered && registrationDraft && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border-2 border-amber-500/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Draf Formulir Tersimpan:
                  </span>
                  <span className="text-xs font-semibold bg-amber-900/90 text-amber-200 px-2.5 py-0.5 rounded border border-amber-700/70">
                    Langkah {registrationDraft.step} dari 4: {
                      registrationDraft.step === 1 ? 'Data Calon Mitra' :
                      registrationDraft.step === 2 ? 'Paket & Modal' :
                      registrationDraft.step === 3 ? 'Kandidat Lokasi' : 'Unggah Dokumen'
                    }
                  </span>
                  <span className="text-[11px] text-stone-400">
                    (Disimpan {registrationDraft.lastSavedAt})
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-1">
                  Atas nama <strong>{registrationDraft.fullName}</strong> ({registrationDraft.city}). Klik tombol di samping untuk melanjutkan pengisian data Anda dari posisi terakhir tanpa mengulang.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              {onDiscardDraft && (
                <button
                  onClick={onDiscardDraft}
                  className="px-3 py-2 text-xs font-semibold text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                  title="Hapus draf ini dan mulai formulir baru dari awal"
                >
                  Hapus Draf
                </button>
              )}
              <button
                onClick={onResumeDraft}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
              >
                <span>Lanjutkan Edit Data (Langkah {registrationDraft.step})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Noticeable Quick Status Banner for Registered Applicants Only */}
      {hasRegistered && activeApplicant && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white rounded-2xl p-4 sm:p-5 shadow-md border border-emerald-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-3.5 w-3.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-300">
                    STATUS PENGAJUAN ANDA:
                  </span>
                  <span className="text-xs font-mono font-bold bg-emerald-800/80 px-2 py-0.5 rounded text-white">
                    {activeApplicant.registrationNumber}
                  </span>
                  <span className="text-xs text-stone-300">({activeApplicant.fullName})</span>
                </div>
                <p className="text-xs text-stone-300 mt-0.5">
                  {activeApplicant.requestedAction
                    ? `Perhatian: ${activeApplicant.requestedAction.title}`
                    : 'Pengajuan kemitraan Anda sedang diproses. Pantau posisi tahapan secara realtime.'}
                </p>
              </div>
            </div>

            <button
              onClick={onViewTracker}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>Buka Pelacak Pengajuan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span>Waralaba F&B Teh No. 1 dengan 350+ Mitra Aktif</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 leading-tight">
              Mulai Bisnis Teh Modern Bersama <span className="text-emerald-700">TehKita</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
              Model kemitraan transparan <strong>tanpa royalty fee bulanan</strong>. 100% laba harian milik Anda, didukung pasokan bahan baku teh melati eksklusif dan evaluasi lokasi terstandar.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-xs border-y border-stone-200 py-3">
              <div>
                <span className="text-xl font-bold font-mono text-stone-900 block">350+</span>
                <span className="text-stone-500">Mitra Aktif Nasional</span>
              </div>
              <div>
                <span className="text-xl font-bold font-mono text-emerald-700 block">0%</span>
                <span className="text-stone-500">Royalti Fee Bulanan</span>
              </div>
              <div>
                <span className="text-xl font-bold font-mono text-stone-900 block">2 - 4 Bln</span>
                <span className="text-stone-500">Estimasi Balik Modal</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {!hasRegistered && registrationDraft ? (
                <>
                  <button
                    onClick={onResumeDraft}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Lanjutkan Pendaftaran (Langkah {registrationDraft.step})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onStartRegistration}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm py-3.5 px-5 rounded-xl transition-colors flex items-center gap-2 border border-stone-300 cursor-pointer"
                  >
                    <span>Mulai Daftar Baru</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={onStartRegistration}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Daftar Kemitraan Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onOpenAiChat}
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm py-3.5 px-5 rounded-xl transition-colors flex items-center gap-2 border border-stone-300 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Tanya AI Seputar Syarat & Paket</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-200 aspect-16/9 lg:aspect-4/3 bg-stone-900 group">
              <img
                src={heroTeaImg}
                alt="Segelas Es Teh Melati Segar TehKita"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('public/images') && !target.src.includes('/images/')) {
                    target.src = '/images/tehkita_iced_tea_1791219345466.jpg';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/25 to-transparent flex flex-col justify-end p-6 text-white pointer-events-none">
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300">
                  Resep Signature Teh Melati Nusantara
                </span>
                <p className="text-sm font-bold text-white mt-1">
                  Margin keuntungan tinggi dari racikan konsentrat teh berkualitas tinggi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Packages Showcase */}
      <section id="paket-kemitraan" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 scroll-mt-28">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Pilihan Paket Kemitraan
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Investasi Terjangkau, Paket Lengkap Siap Jualan
          </h2>
          <p className="text-xs text-stone-500">
            Seluruh booth, mesin cup sealer, peralatan barista, dan bahan baku starter kit menjadi hak milik mitra 100%.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FRANCHISE_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                pkg.popular
                  ? 'border-emerald-600 shadow-md ring-2 ring-emerald-600/20'
                  : 'border-stone-200 shadow-xs hover:border-stone-300'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {pkg.popular ? 'Paling Diminati (Best Seller)' : 'Siap Operasional'}
                  </span>
                  <span className="text-xs text-stone-400">{pkg.estimatedRoiMonths} BEP</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-stone-900">{pkg.name}</h3>
                  <p className="text-xs text-stone-500 mt-1">{pkg.tagline}</p>
                </div>

                <div className="py-2 border-y border-stone-100">
                  <span className="text-2xl font-black text-emerald-800 font-mono">
                    Rp {pkg.price.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-stone-500 block mt-0.5">
                    Tanpa biaya royalty bulanan seumur hidup
                  </span>
                </div>

                <div className="space-y-2 text-xs text-stone-700">
                  <span className="font-bold text-stone-900 block">Rincian Paket & Peralatan:</span>
                  {pkg.equipment.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100">
                <button
                  onClick={onStartRegistration}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Pilih Paket & Daftar Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Interactive Location Scorer on Landing Page */}
      <section id="skor-lokasi" className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-28">
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold border border-amber-500/30">
                <MapPin className="w-3.5 h-3.5" />
                <span>Simulasi Kecocokan Lokasi Instan</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Cek Potensi Lokasi Anda Sebelum Mendaftar
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Algoritma kepatutan TehKita menghitung trafik pejalan kaki, visibilitas titik gerai, dan radius proteksi wilayah (min. 1.5 KM dari 350 mitra aktif).
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="text-stone-300 block mb-1">Kandidat Alamat:</label>
                  <input
                    type="text"
                    value={quickAddress}
                    onChange={(e) => setQuickAddress(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-300 block mb-1">Tipe Lokasi:</label>
                    <select
                      value={quickType}
                      onChange={(e) => setQuickType(e.target.value as any)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl px-2.5 py-2 text-stone-100 text-xs"
                    >
                      <option value="depan_minimarket">Depan Minimarket</option>
                      <option value="area_kampus_sekolah">Dekat Kampus/Sekolah</option>
                      <option value="ruko">Ruko / Kios</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-stone-300 block mb-1">Jarak Gerai Terdekat:</label>
                    <input
                      type="number"
                      step="0.1"
                      value={quickDistance}
                      onChange={(e) => setQuickDistance(parseFloat(e.target.value) || 0)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-stone-800/90 border border-stone-700 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-700 pb-3">
                <span className="text-xs text-stone-400">Hasil Penilaian Kelayakan Awal</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  quickScore.verdict === 'Sangat Direkomendasikan'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {quickScore.verdict}
                </span>
              </div>

              <div className="text-center py-2">
                <span className="text-4xl font-black font-mono text-emerald-400">
                  {quickScore.score}
                </span>
                <span className="text-xs text-stone-400"> / 100 Skor Kelayakan</span>
              </div>

              <div className="bg-stone-900/60 p-3 rounded-xl text-xs space-y-1 text-stone-300">
                {quickScore.notes.map((note, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[11px]">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <button
                  onClick={onOpenLocationGuide}
                  className="text-stone-300 hover:text-white underline cursor-pointer"
                >
                  Lihat Kriteria Lengkap
                </button>
                <button
                  onClick={onStartRegistration}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl cursor-pointer"
                >
                  Ajukan Titik Lokasi Ini
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Business Flow Steps (5 Tahap Sesuai PRD) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Alur Kemitraan Digital
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Dari Pengajuan Hingga Persetujuan Kedua Pihak
          </h2>
          <p className="text-xs text-stone-500">
            Menggantikan proses manual chat WhatsApp menjadi terpusat, transparan, dan terukur.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs">
          {[
            {
              step: '01',
              title: 'Cari Info & Tanya AI',
              desc: 'Tanya jawab instan seputar paket dan modal melalui chatbot resmi TehKita.',
            },
            {
              step: '02',
              title: 'Formulir & Dokumen',
              desc: 'Isi formulir bertahap & unggah e-KTP. Bisa simpan & lanjutkan nanti.',
            },
            {
              step: '03',
              title: 'Hitung Skor Lokasi',
              desc: 'Evaluasi otomatis trafik & zonasi 1.5 KM. Bisa status Menunggu Lokasi.',
            },
            {
              step: '04',
              title: 'Tinjauan Proposal',
              desc: 'Franchisor terbitkan draft resmi. Anda dapat setujui atau minta revisi.',
            },
            {
              step: '05',
              title: 'Kemitraan Sah',
              desc: 'Persetujuan kedua belah pihak, pengiriman booth & training barista.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-black font-mono text-emerald-700 block">
                  {item.step}
                </span>
                <h4 className="font-bold text-sm text-stone-900 mt-2">{item.title}</h4>
                <p className="text-stone-600 mt-1 leading-relaxed text-[11px]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={onStartRegistration}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 px-8 rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Mulai Pengajuan Kemitraan TehKita</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
