import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  FileText, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  Send, 
  Sparkles, 
  Building2,
  TrendingUp,
  History,
  Check,
  ChevronRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { Applicant, ApplicationStage, ProposalData } from '../types';
import { FRANCHISE_PACKAGES } from '../data/mockData';

interface FranchisorDashboardProps {
  applicants: Applicant[];
  onSelectApplicant: (applicant: Applicant) => void;
  onUpdateApplicant: (updated: Applicant) => void;
  onIssueProposal: (applicantId: string, newProposal: ProposalData) => void;
  onRequestDocRevision: (applicantId: string, docId: string, note: string) => void;
  onRejectApplicant: (applicantId: string, reasonCategory: string, details: string) => void;
  onApproveLocation: (applicantId: string) => void;
}

export const FranchisorDashboard: React.FC<FranchisorDashboardProps> = ({
  applicants,
  onSelectApplicant,
  onUpdateApplicant,
  onIssueProposal,
  onRequestDocRevision,
  onRejectApplicant,
  onApproveLocation,
}) => {
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDetailApplicant, setActiveDetailApplicant] = useState<Applicant | null>(null);

  // Modals for franchisor decisions
  const [showIssueProposalModal, setShowIssueProposalModal] = useState(false);
  const [showDocRevisionModal, setShowDocRevisionModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [franchisorActionToast, setFranchisorActionToast] = useState<string | null>(null);

  // Issue proposal form state
  const [proposalPackageId, setProposalPackageId] = useState<'booth_reguler' | 'booth_kontainer' | 'cafe_mini'>('booth_kontainer');
  const [proposalInvestment, setProposalInvestment] = useState(12500000);
  const [proposalCommitmentFee, setProposalCommitmentFee] = useState(2500000);
  const [proposalFranchisorNote, setProposalFranchisorNote] = useState('Lokasi sangat strategis. Kami tambahkan bonus 200 cup bahan baku awal.');

  // Doc revision form state
  const [revisionDocNote, setRevisionDocNote] = useState('Foto KTP buram, mohon unggah ulang foto e-KTP tegak lurus.');

  // Rejection form state
  const [rejectReasonCategory, setRejectReasonCategory] = useState('Benturan Zonasi Wilayah Proteksi');
  const [rejectDetails, setRejectDetails] = useState('Lokasi yang diajukan melanggar radius perlindungan 1.5 KM mitra aktif eksisting.');

  // Detail sub-tabs
  const [detailSubTab, setDetailSubTab] = useState<'profile' | 'documents' | 'location' | 'proposal'>('profile');

  // Filter logic
  const filteredApplicants = applicants.filter((app) => {
    const matchesStage = selectedStageFilter === 'all' || app.stage === selectedStageFilter;
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const handleOpenDetail = (app: Applicant) => {
    setActiveDetailApplicant(app);
    setDetailSubTab('profile');
    setProposalPackageId(app.selectedPackageId);
    const pkg = FRANCHISE_PACKAGES.find((p) => p.id === app.selectedPackageId);
    if (pkg) {
      setProposalInvestment(pkg.price);
    }
  };

  const handleIssueProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDetailApplicant) return;

    const pkg = FRANCHISE_PACKAGES.find((p) => p.id === proposalPackageId);
    const nextVersion = (activeDetailApplicant.proposals?.length || 0) + 1;

    const newProposal: ProposalData = {
      id: `prop-${activeDetailApplicant.id}-v${nextVersion}`,
      version: nextVersion,
      issuedDate: new Date().toISOString().split('T')[0],
      packageId: proposalPackageId,
      packageName: pkg ? pkg.name : 'Paket Kemitraan TehKita',
      totalInvestment: proposalInvestment,
      paymentTerms: `Commitment Fee Rp ${proposalCommitmentFee.toLocaleString('id-ID')} saat persetujuan, sisa pelunasan Rp ${(proposalInvestment - proposalCommitmentFee).toLocaleString('id-ID')} sebelum pengiriman booth.`,
      exclusiveRadiusKm: 1.5,
      rawMaterialSupplyTerm: 'Wajib memesan teh konsentrat melati & cup sablon eksklusif melalui portal resmi TehKita (tanpa royalty bulanan).',
      royaltyFeeMonthly: 0,
      estimatedDailyCups: pkg ? pkg.recommendedDailySales : 100,
      estimatedNetProfitMonthly: Math.round(proposalInvestment * 0.38),
      estimatedBepMonths: 2.8,
      clauses: [
        {
          title: '1. Kepemilikan Peralatan & Booth',
          description: 'Seluruh booth, mesin sealer, dan peralatan pendukung menjadi aset 100% milik mitra sejak pelunasan dilakukan.',
        },
        {
          title: '2. Tanpa Biaya Royalti (0% Royalty Fee)',
          description: 'TehKita tidak memungut pembagian omzet atau royalti bulanan. 100% laba bersih adalah hak mitra.',
        },
        {
          title: '3. Jaminan Perlindungan Wilayah (Zonasi)',
          description: 'TehKita menjamin tidak akan membuka gerai mitra lain dalam radius 1.5 KM dari lokasi mitra.',
        },
      ],
      status: 'menunggu_review_calon',
      franchisorNotes: proposalFranchisorNote,
    };

    const issuedToName = activeDetailApplicant.fullName;
    const issuedToReg = activeDetailApplicant.registrationNumber;

    onIssueProposal(activeDetailApplicant.id, newProposal);
    setShowIssueProposalModal(false);

    // Langsung arahkan ke halaman tabel list pipeline (tutup drawer detail)
    setActiveDetailApplicant(null);
    setFranchisorActionToast(
      `Proposal kemitraan resmi (Versi ${nextVersion}) berhasil diterbitkan dan dikirim ke ${issuedToName} (${issuedToReg})! Status di tabel pipeline telah diperbarui.`
    );
    setTimeout(() => {
      setFranchisorActionToast(null);
    }, 5000);
  };

  const handleDocRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDetailApplicant) return;

    onRequestDocRevision(activeDetailApplicant.id, 'doc-ktp', revisionDocNote);
    setShowDocRevisionModal(false);

    setActiveDetailApplicant((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        stage: 'verifikasi_dokumen',
        requestedAction: {
          type: 'revisi_dokumen',
          title: 'Perbaikan Dokumen Diperlukan',
          instruction: revisionDocNote,
        },
      };
    });
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDetailApplicant) return;

    onRejectApplicant(activeDetailApplicant.id, rejectReasonCategory, rejectDetails);
    setShowRejectModal(false);

    setActiveDetailApplicant((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        stage: 'ditolak',
        rejectionInfo: {
          date: new Date().toISOString().split('T')[0],
          reasonCategory: rejectReasonCategory,
          details: rejectDetails,
        },
      };
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Toast Notifikasi Aksi Franchisor */}
      {franchisorActionToast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 bg-stone-900/95 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl shadow-xl border border-amber-500/80 flex items-center gap-3 text-xs animate-in slide-in-from-top-2 max-w-lg">
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="flex-1 font-medium text-stone-200">
            {franchisorActionToast}
          </span>
          <button
            onClick={() => setFranchisorActionToast(null)}
            className="text-stone-400 hover:text-white transition-colors cursor-pointer p-0.5"
            title="Tutup"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded border border-amber-800">
                Dashboard Internal Franchisor
              </span>
              <span className="text-xs text-stone-400">·</span>
              <span className="text-xs text-stone-300">TehKita Central Management</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              Pemantauan & Evaluasi Kemitraan TehKita
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Sentralisasi data calon mitra, verifikasi berkas, penilaian kelayakan lokasi, serta penerbitan proposal resmi.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="bg-stone-800 border border-stone-700 px-3 py-2 rounded-xl text-stone-300">
              Total Mitra Aktif Nasional: <strong className="text-white font-mono">350 Outlet</strong>
            </span>
          </div>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 mt-6 border-t border-stone-800 text-xs">
          <div className="bg-stone-800/80 border border-stone-700 rounded-xl p-3.5">
            <span className="text-stone-400 block text-[11px]">Total Pengajuan</span>
            <span className="text-xl font-bold text-white font-mono mt-0.5 block">
              {applicants.length}
            </span>
            <span className="text-[10px] text-stone-400">Terdaftar di sistem</span>
          </div>

          <div className="bg-stone-800/80 border border-stone-700 rounded-xl p-3.5">
            <span className="text-stone-400 block text-[11px]">Butuh Verifikasi</span>
            <span className="text-xl font-bold text-amber-400 font-mono mt-0.5 block">
              {applicants.filter((a) => a.stage === 'verifikasi_dokumen' || a.stage === 'evaluasi_lokasi').length}
            </span>
            <span className="text-[10px] text-amber-400/80">Dokumen & Lokasi</span>
          </div>

          <div className="bg-stone-800/80 border border-stone-700 rounded-xl p-3.5">
            <span className="text-stone-400 block text-[11px]">Menunggu Lokasi</span>
            <span className="text-xl font-bold text-blue-400 font-mono mt-0.5 block">
              {applicants.filter((a) => a.stage === 'menunggu_lokasi').length}
            </span>
            <span className="text-[10px] text-blue-300/80">Panduan terkirim</span>
          </div>

          <div className="bg-stone-800/80 border border-stone-700 rounded-xl p-3.5">
            <span className="text-stone-400 block text-[11px]">Negosiasi Proposal</span>
            <span className="text-xl font-bold text-purple-400 font-mono mt-0.5 block">
              {applicants.filter((a) => a.stage === 'negosiasi_proposal').length}
            </span>
            <span className="text-[10px] text-purple-300/80">Review calon mitra</span>
          </div>

          <div className="bg-stone-800/80 border border-stone-700 rounded-xl p-3.5">
            <span className="text-stone-400 block text-[11px]">Kemitraan Disetujui</span>
            <span className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">
              {applicants.filter((a) => a.stage === 'disetujui').length}
            </span>
            <span className="text-[10px] text-emerald-300/80">Siap kirim booth</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Semua Tahap' },
            { id: 'verifikasi_dokumen', label: 'Verifikasi Dokumen' },
            { id: 'evaluasi_lokasi', label: 'Evaluasi Lokasi' },
            { id: 'menunggu_lokasi', label: 'Menunggu Lokasi' },
            { id: 'negosiasi_proposal', label: 'Proposal' },
            { id: 'disetujui', label: 'Disetujui' },
            { id: 'ditolak', label: 'Ditolak' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStageFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedStageFilter === tab.id
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, kota, no registrasi..."
            className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-8 pr-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Main Applicants Table (Scope 4) */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">No. Reg / Tanggal</th>
                <th className="py-3.5 px-4">Calon Mitra</th>
                <th className="py-3.5 px-4">Paket & Kota</th>
                <th className="py-3.5 px-4">Kelayakan Lokasi</th>
                <th className="py-3.5 px-4">Status Tahap</th>
                <th className="py-3.5 px-4 text-right">Aksi Penanganan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredApplicants.map((app) => (
                <tr key={app.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-stone-900 block">
                      {app.registrationNumber}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {new Date(app.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-stone-900 block">{app.fullName}</span>
                    <span className="text-[11px] text-stone-500">{app.phone}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-stone-800 block">
                      {FRANCHISE_PACKAGES.find((p) => p.id === app.selectedPackageId)?.name}
                    </span>
                    <span className="text-[11px] text-stone-500">{app.city}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    {app.location.hasLocation ? (
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono font-bold text-xs ${
                              (app.location.score || 0) >= 75
                                ? 'text-emerald-700'
                                : (app.location.score || 0) >= 55
                                ? 'text-amber-700'
                                : 'text-red-700'
                            }`}
                          >
                            Skor {app.location.score}/100
                          </span>
                          <span className="text-[10px] text-stone-400">
                            (Zonasi {app.location.nearestTehKitaDistanceKm} KM)
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-500 truncate max-w-[200px] block">
                          {app.location.address}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                        Menunggu Usulan Lokasi
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {app.stage === 'disetujui' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Disetujui Bersama
                      </span>
                    ) : app.stage === 'negosiasi_proposal' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                        <Clock className="w-3 h-3 text-purple-600" />
                        Review Proposal
                      </span>
                    ) : app.stage === 'verifikasi_dokumen' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        Cek Berkas
                      </span>
                    ) : app.stage === 'evaluasi_lokasi' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        Evaluasi Kelayakan
                      </span>
                    ) : app.stage === 'menunggu_lokasi' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                        Menunggu Lokasi
                      </span>
                    ) : app.stage === 'ditolak' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 text-red-600" />
                        Tidak Lolos
                      </span>
                    ) : (
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                        {app.stage}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenDetail(app)}
                      className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail & Keputusan</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL APPLICANT MODAL / SLIDE-OVER (Scope 4 & Scope 5) */}
      {activeDetailApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-stone-200">
            {/* Header */}
            <div className="bg-stone-900 text-white p-5 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-amber-400 font-bold">
                    {activeDetailApplicant.registrationNumber}
                  </span>
                  <span className="text-xs text-stone-400">·</span>
                  <h3 className="font-bold text-base text-white">
                    {activeDetailApplicant.fullName}
                  </h3>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Kota {activeDetailApplicant.city} · WhatsApp: {activeDetailApplicant.phone}
                </p>
              </div>

              <button
                onClick={() => setActiveDetailApplicant(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                Tutup ✕
              </button>
            </div>

            {/* Sub-Tabs */}
            <div className="flex border-b border-stone-200 bg-stone-100 p-2 gap-2 shrink-0 text-xs">
              <button
                onClick={() => setDetailSubTab('profile')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  detailSubTab === 'profile' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600'
                }`}
              >
                1. Profil & Finansial
              </button>
              <button
                onClick={() => setDetailSubTab('documents')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  detailSubTab === 'documents' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600'
                }`}
              >
                2. Berkas Dokumen ({activeDetailApplicant.documents.length})
              </button>
              <button
                onClick={() => setDetailSubTab('location')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  detailSubTab === 'location' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600'
                }`}
              >
                3. Analisis Skor Lokasi
              </button>
              <button
                onClick={() => setDetailSubTab('proposal')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  detailSubTab === 'proposal' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600'
                }`}
              >
                4. Dokumen Proposal ({activeDetailApplicant.proposals?.length || 0})
              </button>
            </div>

            {/* Sub-Tab Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-stone-800">
              {/* TAB 1: Profile */}
              {detailSubTab === 'profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <div>
                      <span className="text-stone-400 block text-[11px]">Paket Dipilih</span>
                      <strong className="text-stone-900 font-bold">
                        {FRANCHISE_PACKAGES.find((p) => p.id === activeDetailApplicant.selectedPackageId)?.name}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[11px]">Kesiapan Modal</span>
                      <strong className="text-emerald-700 font-bold font-mono">
                        Rp {activeDetailApplicant.allocatedBudget.toLocaleString('id-ID')}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[11px]">Pekerjaan</span>
                      <span className="text-stone-800">{activeDetailApplicant.occupation}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[11px]">Pengalaman F&B</span>
                      <span className="text-stone-800">
                        {activeDetailApplicant.hasFnbExperience
                          ? `Ada: ${activeDetailApplicant.fnbExperienceDetail || 'Ya'}`
                          : 'Pemula (Belum Pernah)'}
                      </span>
                    </div>
                  </div>

                  <div className="border border-stone-200 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-stone-900">Riwayat Perjalanan Pengajuan:</h4>
                    <div className="space-y-2 pl-2">
                      {activeDetailApplicant.stageHistory.map((hist, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px]">
                          <span className="text-amber-600 font-bold">•</span>
                          <div>
                            <span className="font-semibold text-stone-800">
                              {new Date(hist.timestamp).toLocaleDateString('id-ID')}:
                            </span>{' '}
                            <span className="text-stone-600">{hist.note}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Documents */}
              {detailSubTab === 'documents' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="font-bold text-stone-900">Pemeriksaan Berkas Calon Mitra</span>
                    <button
                      onClick={() => setShowDocRevisionModal(true)}
                      className="text-amber-800 hover:text-amber-900 font-bold bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1 rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Minta Perbaikan Dokumen</span>
                    </button>
                  </div>

                  {activeDetailApplicant.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-stone-900 block">{doc.title}</span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {doc.fileName} · {doc.fileSize}
                        </span>
                        {doc.revisionNote && (
                          <span className="text-[10px] text-amber-800 block mt-1 bg-amber-100 p-1 rounded">
                            Catatan Revisi: {doc.revisionNote}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {doc.status === 'valid' ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                            Valid ✓
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                            Perlu Perbaikan ↻
                          </span>
                        )}
                        <button
                          onClick={() => alert(`Membuka berkas ${doc.fileName}...`)}
                          className="bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 px-2 py-1 rounded text-[11px] cursor-pointer"
                        >
                          Lihat File
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: Location */}
              {detailSubTab === 'location' && (
                <div className="space-y-4">
                  {activeDetailApplicant.location.hasLocation ? (
                    <div className="space-y-3">
                      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-stone-900">Detail Alamat Lokasi</span>
                          <span className="font-mono text-sm font-bold text-emerald-700">
                            Skor: {activeDetailApplicant.location.score}/100
                          </span>
                        </div>
                        <p className="text-stone-700">{activeDetailApplicant.location.address}, {activeDetailApplicant.location.district}, {activeDetailApplicant.location.city}</p>
                        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-stone-200 text-[11px]">
                          <div>Tipe: <strong>{activeDetailApplicant.location.locationType}</strong></div>
                          <div>Trafik Pejalan: <strong>{activeDetailApplicant.location.pedestrianTraffic}</strong></div>
                          <div>Jarak Gerai TehKita: <strong>{activeDetailApplicant.location.nearestTehKitaDistanceKm} KM</strong></div>
                          <div>Listrik: <strong>{activeDetailApplicant.location.electricityPowerVa} VA</strong></div>
                        </div>
                      </div>

                      {/* Notes from Scorer */}
                      {activeDetailApplicant.location.scoreDetails?.notes && (
                        <div className="border border-stone-200 rounded-xl p-3.5 bg-white space-y-1">
                          <h5 className="font-bold text-stone-900 mb-1">Catatan Evaluasi Aturan TehKita:</h5>
                          {activeDetailApplicant.location.scoreDetails.notes.map((n, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-[11px] text-stone-600">
                              <span className="text-amber-600 font-bold">•</span>
                              <span>{n}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center text-amber-900">
                      <MapPin className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                      <h4 className="font-bold text-sm">Calon Mitra Belum Menentukan Lokasi</h4>
                      <p className="text-xs text-amber-800 mt-1 max-w-md mx-auto">
                        Status saat ini adalah "Menunggu Usulan Lokasi". Calon mitra telah diberikan panduan radius proteksi 1.5 KM dan SOP kriteria gerai.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Proposal */}
              {detailSubTab === 'proposal' && (
                <div className="space-y-4">
                  {activeDetailApplicant.proposals && activeDetailApplicant.proposals.length > 0 ? (
                    activeDetailApplicant.proposals.map((prop) => (
                      <div key={prop.id} className="border border-stone-200 rounded-xl p-4 bg-stone-50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900">Proposal Versi {prop.version}</span>
                          <span className="text-[10px] bg-stone-200 px-2 py-0.5 rounded font-mono">
                            {prop.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-600">
                          Total Investasi: <strong className="text-emerald-800 font-mono">Rp {prop.totalInvestment.toLocaleString('id-ID')}</strong> · BEP: {prop.estimatedBepMonths} Bulan
                        </div>

                        {prop.candidateRevisionRequest && (
                          <div className="bg-amber-100 p-2.5 rounded-lg text-amber-900 text-[11px]">
                            <strong>Permintaan Revisi dari Calon Mitra:</strong>
                            <p className="mt-0.5">{prop.candidateRevisionRequest.notes}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-stone-400 text-xs">
                      Belum ada proposal yang diterbitkan untuk calon mitra ini.
                    </div>
                  )}

                  <button
                    onClick={() => setShowIssueProposalModal(true)}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Terbitkan / Perbarui Proposal Kemitraan</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="bg-stone-100 p-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-300 rounded-xl transition-colors cursor-pointer"
              >
                Tolak Pengajuan (Tidak Lolos)
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDocRevisionModal(true)}
                  className="px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50 border border-amber-300 rounded-xl transition-colors cursor-pointer"
                >
                  Minta Perbaikan Berkas
                </button>

                <button
                  onClick={() => setShowIssueProposalModal(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Terbitkan Proposal Kemitraan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ISSUE PROPOSAL */}
      {showIssueProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-stone-900">
              Terbitkan Dokumen Proposal Kemitraan Resmi
            </h3>
            <p className="text-xs text-stone-600">
              Proposal akan langsung dikirimkan ke portal calon mitra dan memicu notifikasi instan via WhatsApp & Email.
            </p>

            <form onSubmit={handleIssueProposalSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Pilihan Paket Kemitraan</label>
                <select
                  value={proposalPackageId}
                  onChange={(e) => {
                    const id = e.target.value as any;
                    setProposalPackageId(id);
                    const p = FRANCHISE_PACKAGES.find((item) => item.id === id);
                    if (p) setProposalInvestment(p.price);
                  }}
                  className="w-full border border-stone-300 rounded-lg p-2 bg-white focus:outline-none"
                >
                  {FRANCHISE_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} - Rp {pkg.price.toLocaleString('id-ID')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nilai Investasi (Rp)</label>
                  <input
                    type="number"
                    value={proposalInvestment}
                    onChange={(e) => setProposalInvestment(parseInt(e.target.value) || 0)}
                    className="w-full border border-stone-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Commitment Fee (Rp)</label>
                  <input
                    type="number"
                    value={proposalCommitmentFee}
                    onChange={(e) => setProposalCommitmentFee(parseInt(e.target.value) || 0)}
                    className="w-full border border-stone-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Catatan Khusus untuk Calon</label>
                <textarea
                  rows={3}
                  value={proposalFranchisorNote}
                  onChange={(e) => setProposalFranchisorNote(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIssueProposalModal(false)}
                  className="px-4 py-2 text-stone-600 border border-stone-300 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Proposal ke Calon Mitra</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MINTA PERBAIKAN DOKUMEN */}
      {showDocRevisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-stone-900">Minta Perbaikan Dokumen</h3>
            <p className="text-xs text-stone-600">
              Instruksikan calon mitra bagian berkas apa yang perlu diperbaiki (contoh: KTP buram, rekening kurang jelas).
            </p>

            <form onSubmit={handleDocRevisionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Catatan Instruksi Perbaikan</label>
                <textarea
                  rows={4}
                  required
                  value={revisionDocNote}
                  onChange={(e) => setRevisionDocNote(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDocRevisionModal(false)}
                  className="px-4 py-2 text-stone-600 border border-stone-300 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-lg"
                >
                  Kirim Notifikasi Perbaikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TOLAK PENGAJUAN */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-red-900">Tolak Pengajuan Kemitraan</h3>
            <p className="text-xs text-stone-600">
              Pilih kriteria standar penolakan dan berikan alasan formal untuk arsip sistem TehKita.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Kategori Alasan Penolakan</label>
                <select
                  value={rejectReasonCategory}
                  onChange={(e) => setRejectReasonCategory(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                >
                  <option value="Benturan Zonasi Wilayah Proteksi">Benturan Zonasi Wilayah Proteksi (&lt;1.5 KM)</option>
                  <option value="Trafik Pejalan Kaki & Akses Tidak Memenuhi Syarat">Trafik Pejalan Kaki & Akses Tidak Memenuhi Syarat</option>
                  <option value="Kesiapan Modal Tidak Mencukupi Paket">Kesiapan Modal Tidak Mencukupi Paket</option>
                  <option value="Dokumen Identitas Tidak Valid">Dokumen Identitas Tidak Valid</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Rincian Penjelasan Formal</label>
                <textarea
                  rows={4}
                  required
                  value={rejectDetails}
                  onChange={(e) => setRejectDetails(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 text-stone-600 border border-stone-300 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-red-700 hover:bg-red-800 text-white font-bold px-4 py-2 rounded-lg"
                >
                  Konfirmasi Tolak Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
