import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Coffee, 
  DollarSign, 
  Award, 
  History,
  Send,
  Download,
  ArrowLeft
} from 'lucide-react';
import { Applicant, ProposalData } from '../types';

interface ProposalViewerProps {
  applicant: Applicant;
  proposal: ProposalData;
  onApproveProposal: (proposalId: string) => void;
  onRequestRevision: (proposalId: string, notes: string, requestedAdjustment: string) => void;
  onRejectProposal: (proposalId: string, reason: string) => void;
  onBack: () => void;
}

export const ProposalViewer: React.FC<ProposalViewerProps> = ({
  applicant,
  proposal,
  onApproveProposal,
  onRequestRevision,
  onRejectProposal,
  onBack,
}) => {
  const [selectedVersion, setSelectedVersion] = useState<number>(proposal.version);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveConfirmModal, setShowApproveConfirmModal] = useState(false);

  // Revision Form state
  const [revisionNotes, setRevisionNotes] = useState('');
  const [requestedAdjustment, setRequestedAdjustment] = useState('Termin Pembayaran');

  // Rejection Form state
  const [rejectionReason, setRejectionReason] = useState('Kendala finansial di luar rencana');

  // Find version if multiple proposals exist
  const currentDisplayedProposal = 
    applicant.proposals.find((p) => p.version === selectedVersion) || proposal;

  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestRevision(currentDisplayedProposal.id, revisionNotes, requestedAdjustment);
    setShowRevisionModal(false);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRejectProposal(currentDisplayedProposal.id, rejectionReason);
    setShowRejectModal(false);
  };

  const handleApproveConfirm = () => {
    onApproveProposal(currentDisplayedProposal.id);
    setShowApproveConfirmModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Lacak Pengajuan</span>
      </button>

      {/* Main Proposal Card Container */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Top Header Bar */}
        <div className="bg-stone-900 text-white p-6 sm:p-8 border-b border-stone-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  TK
                </span>
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                  Dokumen Resmi Kemitraan Franchisor
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Proposal Perjanjian Kemitraan TehKita
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-stone-400">
                <span>No. Reg: <strong className="text-stone-200">{applicant.registrationNumber}</strong></span>
                <span>·</span>
                <span>Calon Mitra: <strong className="text-stone-200">{applicant.fullName}</strong></span>
                <span>·</span>
                <span>Tanggal Terbit: <strong className="text-stone-200">{currentDisplayedProposal.issuedDate}</strong></span>
              </div>
            </div>

            {/* Version and Status Badge */}
            <div className="flex flex-col sm:items-end gap-2">
              <div className="inline-flex rounded-lg bg-stone-800 p-1 border border-stone-700">
                {applicant.proposals.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedVersion(p.version)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      selectedVersion === p.version
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Versi {p.version} {p.status === 'disetujui' && '✓'}
                  </button>
                ))}
              </div>

              <div>
                {currentDisplayedProposal.status === 'disetujui' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Kemitraan Disetujui (Kedua Pihak)
                  </span>
                ) : currentDisplayedProposal.status === 'revisi_diminta' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <History className="w-3.5 h-3.5 text-amber-400" />
                    Revisi Sedang Ditinjau Tim Franchisor
                  </span>
                ) : currentDisplayedProposal.status === 'ditolak' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                    Proposal Ditolak
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    Menunggu Peninjauan Calon Mitra
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Banner if Approved */}
        {currentDisplayedProposal.status === 'disetujui' && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-emerald-950">
                  Selamat! Surat Perjanjian Kemitraan Telah Sah & Disetujui
                </h4>
                <p className="text-xs text-emerald-800">
                  Kedua pihak telah menandatangani kesepakatan secara digital. Tim operasional TehKita sedang menyiapkan jadwal pengiriman booth dan starter kit.
                </p>
              </div>
            </div>
            <button
              onClick={() => alert('Unduhan Dokumen Kontrak PDF Resmi Kemitraan TehKita berhasil dimulai.')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Dokumen Kontrak Resmi (PDF)</span>
            </button>
          </div>
        )}

        {/* Revision Note Banner if Active Revision */}
        {currentDisplayedProposal.candidateRevisionRequest && (
          <div className="bg-amber-50 border-b border-amber-200 p-4 text-xs text-amber-900">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">
                  Catatan Permintaan Revisi Calon Mitra ({currentDisplayedProposal.candidateRevisionRequest.date}):
                </strong>
                <span className="text-amber-800">
                  {currentDisplayedProposal.candidateRevisionRequest.notes} (Penyesuaian: {currentDisplayedProposal.candidateRevisionRequest.requestedAdjustment})
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-8 text-stone-800">
          {/* Key Deal Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
              <span className="text-[11px] font-medium text-stone-500 block">Paket Pilihan</span>
              <strong className="text-sm font-bold text-stone-900 block mt-1">
                {currentDisplayedProposal.packageName}
              </strong>
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                Hak Milik 100%
              </span>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
              <span className="text-[11px] font-medium text-stone-500 block">Nilai Investasi Awal</span>
              <strong className="text-sm font-bold text-emerald-800 block mt-1 font-mono">
                Rp {currentDisplayedProposal.totalInvestment.toLocaleString('id-ID')}
              </strong>
              <span className="text-[10px] text-stone-500 mt-1 block">
                All-in siap jualan
              </span>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
              <span className="text-[11px] font-medium text-stone-500 block">Biaya Royalti Bulanan</span>
              <strong className="text-sm font-bold text-emerald-700 block mt-1">
                Rp 0 (0% Royalty)
              </strong>
              <span className="text-[10px] text-stone-500 mt-1 block">
                100% laba untuk mitra
              </span>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
              <span className="text-[11px] font-medium text-stone-500 block">Radius Proteksi Zonasi</span>
              <strong className="text-sm font-bold text-stone-900 block mt-1 font-mono">
                {currentDisplayedProposal.exclusiveRadiusKm} KM Eksklusif
              </strong>
              <span className="text-[10px] text-stone-500 mt-1 block">
                Bebas kanibalisasi
              </span>
            </div>
          </div>

          {/* Financial Feasibility & BEP Model */}
          <div className="bg-emerald-950 text-white rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-xs uppercase tracking-wide text-emerald-200">
                  Simulasi Proyeksi Finansial & Balik Modal (BEP)
                </h4>
              </div>
              <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded">
                Berdasarkan Rata-rata 350 Mitra Aktif
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <span className="text-[11px] text-emerald-300 block">Target Penjualan Harian</span>
                <span className="text-xl font-bold font-mono text-white">
                  {currentDisplayedProposal.estimatedDailyCups} Cup / hari
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">
                  Harga jual Rp 4.000 - Rp 10.000 / cup
                </span>
              </div>

              <div>
                <span className="text-[11px] text-emerald-300 block">Estimasi Laba Bersih / Bulan</span>
                <span className="text-xl font-bold font-mono text-emerald-300">
                  Rp {currentDisplayedProposal.estimatedNetProfitMonthly.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">
                  Setelah dikurangi HPP & operasional
                </span>
              </div>

              <div>
                <span className="text-[11px] text-emerald-300 block">Estimasi Waktu Balik Modal</span>
                <span className="text-xl font-bold font-mono text-amber-300">
                  ~ {currentDisplayedProposal.estimatedBepMonths} Bulan
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">
                  Tergantung konsistensi jam buka
                </span>
              </div>
            </div>
          </div>

          {/* Clauses and Agreement Sections */}
          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-sm text-stone-900 border-b border-stone-200 pb-2">
              Klausul Pokok Perjanjian Kemitraan
            </h4>

            <div className="space-y-3">
              {currentDisplayedProposal.clauses.map((clause, idx) => (
                <div key={idx} className="bg-stone-50 border border-stone-200 rounded-lg p-3.5">
                  <h5 className="font-bold text-stone-900 mb-1">{clause.title}</h5>
                  <p className="text-stone-600 leading-relaxed">{clause.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Terms and Raw Material Supply */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="border border-stone-200 rounded-xl p-4 bg-stone-50">
              <span className="font-bold text-stone-900 block mb-1">Skema Pembayaran</span>
              <p className="text-stone-600 leading-relaxed">
                {currentDisplayedProposal.paymentTerms}
              </p>
            </div>

            <div className="border border-stone-200 rounded-xl p-4 bg-stone-50">
              <span className="font-bold text-stone-900 block mb-1">Ketentuan Pasokan Bahan Baku</span>
              <p className="text-stone-600 leading-relaxed">
                {currentDisplayedProposal.rawMaterialSupplyTerm}
              </p>
            </div>
          </div>

          {/* Franchisor Notes */}
          {currentDisplayedProposal.franchisorNotes && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs">
              <strong className="block font-bold text-emerald-950 mb-1">
                Catatan Khusus dari Tim Kemitraan TehKita:
              </strong>
              <p className="text-emerald-900 leading-relaxed">
                {currentDisplayedProposal.franchisorNotes}
              </p>
            </div>
          )}

          {/* Decision Actions Bar for Candidate */}
          {currentDisplayedProposal.status === 'menunggu_review_calon' && (
            <div className="bg-stone-50 border-2 border-stone-300 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-stone-900">
                  Apakah Anda Menyetujui Proposal Kemitraan Ini?
                </h4>
                <p className="text-xs text-stone-600">
                  Anda dapat langsung menyetujui, meminta negosiasi/revisi poin klausul, atau menolak.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 rounded-xl transition-colors cursor-pointer"
                >
                  Tolak Proposal
                </button>

                <button
                  onClick={() => setShowRevisionModal(true)}
                  className="px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50 border border-amber-300 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <History className="w-3.5 h-3.5 text-amber-600" />
                  <span>Minta Revisi / Negosiasi</span>
                </button>

                <button
                  onClick={() => setShowApproveConfirmModal(true)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Setujui Proposal (Kedua Pihak)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Minta Revisi */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-stone-900">Ajukan Revisi Proposal</h3>
            <p className="text-xs text-stone-600">
              Sampaikan poin-poin yang ingin Anda negosiasikan (misal: termin pembayaran commitment fee, penambahan starter kit, atau tanggal mulai pengiriman booth).
            </p>

            <form onSubmit={handleRevisionSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Kategori Penyesuaian
                </label>
                <select
                  value={requestedAdjustment}
                  onChange={(e) => setRequestedAdjustment(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="Termin Pembayaran & Commitment Fee">Termin Pembayaran & Commitment Fee</option>
                  <option value="Penambahan Bahan Baku / Starter Kit">Penambahan Bahan Baku / Starter Kit</option>
                  <option value="Penyesuaian Jadwal Pengiriman Booth">Penyesuaian Jadwal Pengiriman Booth</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Catatan Rincian Negosiasi
                </label>
                <textarea
                  required
                  rows={4}
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="Contoh: Mohon izin agar commitment fee dapat dibayarkan dalam 2 kali termin, 50% di awal dan 50% setelah kepastian jadwal kirim booth..."
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRevisionModal(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Permintaan Revisi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Persetujuan */}
      {showApproveConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-stone-900">Konfirmasi Persetujuan Kemitraan</h3>
              <p className="text-xs text-stone-600">
                Dengan menyetujui proposal ini, Anda dan TehKita secara resmi menyepakati nilai investasi, zonasi eksklusif, serta hak kepemilikan aset booth.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs text-stone-700 space-y-1">
              <div className="flex justify-between">
                <span>Paket Terpilih:</span>
                <strong>{currentDisplayedProposal.packageName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Investasi:</span>
                <strong className="text-emerald-700 font-mono">
                  Rp {currentDisplayedProposal.totalInvestment.toLocaleString('id-ID')}
                </strong>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowApproveConfirmModal(false)}
                className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg"
              >
                Kembali Tinjau
              </button>
              <button
                type="button"
                onClick={handleApproveConfirm}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2 rounded-lg flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ya, Setujui Kemitraan Ini</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tolak Proposal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-stone-900">Tolak Proposal Kemitraan</h3>
            <p className="text-xs text-stone-600">
              Mohon berikan alasan penolakan untuk arsip dokumentasi resmi kemitraan TehKita.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Alasan Penolakan
                </label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 text-xs bg-white focus:ring-1 focus:ring-red-500 focus:outline-none"
                >
                  <option value="Kendala finansial di luar rencana">Kendala finansial di luar rencana</option>
                  <option value="Memilih jenis usaha kuliner lain">Memilih jenis usaha kuliner lain</option>
                  <option value="Lokasi usaha batal disewa/tidak tersedia">Lokasi usaha batal disewa/tidak tersedia</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-red-700 hover:bg-red-800 text-white font-semibold text-xs px-4 py-2 rounded-lg"
                >
                  Konfirmasi Tolak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
