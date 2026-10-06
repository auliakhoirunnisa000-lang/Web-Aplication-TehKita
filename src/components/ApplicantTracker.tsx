import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  MapPin, 
  ArrowRight, 
  Download, 
  Eye, 
  Sparkles, 
  Building2,
  Calendar,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { Applicant, ApplicationStage } from '../types';
import { FRANCHISE_PACKAGES } from '../data/mockData';

interface ApplicantTrackerProps {
  applicant: Applicant;
  onOpenProposal: () => void;
  onOpenLocationGuide: (isSubmissionMode?: boolean) => void;
  onStartRevisionForm: (documentId?: string) => void;
  onOpenAiChat: () => void;
}

export const ApplicantTracker: React.FC<ApplicantTrackerProps> = ({
  applicant,
  onOpenProposal,
  onOpenLocationGuide,
  onStartRevisionForm,
  onOpenAiChat,
}) => {
  const selectedPkg = FRANCHISE_PACKAGES.find((p) => p.id === applicant.selectedPackageId);

  // Define 5 formal customer-facing stages
  const trackerStages: {
    id: ApplicationStage;
    number: number;
    title: string;
    description: string;
    eta: string;
  }[] = [
    {
      id: 'pengajuan_baru',
      number: 1,
      title: 'Pendaftaran Akun & Dokumen',
      description: 'Pengisian formulir multi-tahap dan pengunggahan berkas KTP serta bukti dana.',
      eta: 'Selesai',
    },
    {
      id: 'verifikasi_dokumen',
      number: 2,
      title: 'Verifikasi Dokumen & Identitas',
      description: 'Pemeriksaan keabsahan dokumen identitas & kesiapan modal oleh Tim Administrasi TehKita.',
      eta: '1 x 24 Jam Kerja',
    },
    {
      id: 'evaluasi_lokasi',
      number: 3,
      title: 'Evaluasi Kelayakan & Lokasi Usaha',
      description: 'Analisis skor trafik pejalan kaki, aksesibilitas, dan proteksi radius zonasi 1.5 KM.',
      eta: '1 - 2 Hari Kerja',
    },
    {
      id: 'negosiasi_proposal',
      number: 4,
      title: 'Penerbitan & Tinjauan Proposal',
      description: 'Penyusunan draft proposal resmi, peninjauan klausul, dan negosiasi dua arah.',
      eta: '2 - 3 Hari Kerja',
    },
    {
      id: 'disetujui',
      number: 5,
      title: 'Kemitraan Resmi Disetujui',
      description: 'Penandatanganan digital kedua pihak, pembayaran commitment fee, dan perakitan booth.',
      eta: 'Tahap Akhir',
    },
  ];

  // Stage mapping helper
  const getStageStatus = (stageId: ApplicationStage, currentStage: ApplicationStage) => {
    const stageOrder: Record<ApplicationStage, number> = {
      pengajuan_baru: 1,
      verifikasi_dokumen: 2,
      menunggu_lokasi: 3,
      evaluasi_lokasi: 3,
      penyusunan_proposal: 4,
      negosiasi_proposal: 4,
      disetujui: 5,
      ditolak: 99,
    };

    const currentOrder = stageOrder[currentStage] || 1;
    const targetOrder = stageOrder[stageId] || 1;

    if (currentStage === 'ditolak') {
      if (stageId === 'pengajuan_baru') return 'completed';
      return 'rejected';
    }

    if (targetOrder < currentOrder) return 'completed';
    if (targetOrder === currentOrder) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header Profile & Overview */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Portal Pelacakan Kemitraan Calon Mitra
              </span>
              <span className="text-xs text-stone-400">·</span>
              <span className="text-xs text-stone-500 font-mono">
                No. Registrasi: <strong>{applicant.registrationNumber}</strong>
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Halo, {applicant.fullName}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Diajukan pada {new Date(applicant.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })} · Kota {applicant.city}
            </p>
          </div>

          <div className="flex sm:flex-col sm:items-end gap-2">
            <span className="text-xs text-stone-500">Paket yang Dipilih:</span>
            <span className="text-sm font-bold text-emerald-800 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl">
              {selectedPkg?.name || 'Paket Franchise TehKita'}
            </span>
          </div>
        </div>

        {/* Action Needed Callout Banner (Scope 6: Tindakan yang Diminta) */}
        {applicant.requestedAction && applicant.stage !== 'ditolak' && (
          <div className="mt-6 bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-amber-800">
                  Tindakan Yang Diminta Saat Ini
                </span>
                <h3 className="font-bold text-sm text-stone-900 mt-0.5">
                  {applicant.requestedAction.title}
                </h3>
                <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                  {applicant.requestedAction.instruction}
                </p>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              {applicant.requestedAction.type === 'review_proposal' && (
                <button
                  onClick={onOpenProposal}
                  className="w-full md:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs py-2.5 px-5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Buka & Tinjau Proposal Resmi</span>
                </button>
              )}

              {applicant.requestedAction.type === 'revisi_dokumen' && (
                <button
                  onClick={() => onStartRevisionForm('doc-ktp-siti')}
                  className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs py-2.5 px-5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Perbaiki Dokumen Sekarang</span>
                </button>
              )}

              {applicant.requestedAction.type === 'ajukan_lokasi' && (
                <button
                  onClick={() => onOpenLocationGuide(true)}
                  className="w-full md:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs py-2.5 px-5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Kirim Usulan Titik Lokasi</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* If stage is Ditolak */}
        {applicant.stage === 'ditolak' && applicant.rejectionInfo && (
          <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-2xl p-5 text-xs text-red-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-800">
              <AlertCircle className="w-4 h-4" />
              <span>Status Pengajuan: Tidak Lolos Seleksi Kemitraan</span>
            </div>
            <p className="leading-relaxed">
              <strong>Kategori Alasan:</strong> {applicant.rejectionInfo.reasonCategory}
            </p>
            <p className="text-stone-700 leading-relaxed bg-white/80 p-3 rounded-lg border border-red-100">
              {applicant.rejectionInfo.details}
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenLocationGuide(true)}
                className="bg-stone-900 text-white font-semibold py-2 px-4 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Ajukan Titik Lokasi Alternatif Lain
              </button>
            </div>
          </div>
        )}

        {/* If stage is Disetujui */}
        {applicant.stage === 'disetujui' && (
          <div className="mt-6 bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  Kemitraan Resmi Disetujui
                </span>
                <h4 className="font-bold text-sm text-emerald-950 mt-0.5">
                  Selamat Datang di Jaringan Waralaba TehKita!
                </h4>
                <p className="text-xs text-emerald-800">
                  Proposal kemitraan telah disahkan oleh kedua belah pihak. Anda dapat melihat arsip proposal dan surat kemitraan.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenProposal}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs py-2.5 px-5 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Lihat Dokumen Kontrak & Bukti Kesepakatan</span>
            </button>
          </div>
        )}
      </div>

      {/* Scope 6: Timeline of Stages from Initial to Approval */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Tahapan Alur Pengajuan Kemitraan
            </h2>
            <p className="text-xs text-stone-500">
              Posisi terkini pengajuan Anda dipantau secara transparan tanpa perlu chat berulang
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Real-time Tracker
          </span>
        </div>

        <div className="space-y-4">
          {trackerStages.map((stageItem) => {
            const status = getStageStatus(stageItem.id, applicant.stage);

            return (
              <div
                key={stageItem.id}
                className={`border rounded-xl p-4 transition-all ${
                  status === 'current'
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                    : status === 'completed'
                    ? 'border-stone-200 bg-white'
                    : status === 'rejected'
                    ? 'border-red-200 bg-red-50/20'
                    : 'border-stone-100 bg-stone-50/50 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Step indicator */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        status === 'completed'
                          ? 'bg-emerald-600 text-white'
                          : status === 'current'
                          ? 'bg-emerald-700 text-white ring-4 ring-emerald-100'
                          : status === 'rejected'
                          ? 'bg-red-500 text-white'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        stageItem.number
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                          {stageItem.title}
                        </h4>
                        {status === 'current' && (
                          <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                            Sedang Berjalan
                          </span>
                        )}
                        {status === 'completed' && (
                          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            Selesai
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {stageItem.description}
                      </p>

                      {/* Special context for Location stage if Waiting for Location */}
                      {stageItem.id === 'evaluasi_lokasi' && !applicant.location.hasLocation && (
                        <div className="mt-2 text-xs bg-amber-50 text-amber-900 border border-amber-200 rounded-lg p-2.5 flex items-center justify-between">
                          <span>Status: Menunggu Usulan Titik Lokasi dari Calon Mitra</span>
                          <button
                            onClick={() => onOpenLocationGuide(true)}
                            className="font-semibold text-emerald-800 hover:underline cursor-pointer"
                          >
                            Kirim Usulan Lokasi →
                          </button>
                        </div>
                      )}

                      {/* Subtle notice & trigger for Stage 4 if Proposal is issued */}
                      {stageItem.id === 'negosiasi_proposal' && applicant.proposals && applicant.proposals.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-stone-200/70 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] text-stone-600 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                            <span>
                              Proposal <strong>Versi {applicant.proposals[applicant.proposals.length - 1].version}</strong> telah diterbitkan.
                            </span>
                          </span>
                          <button
                            onClick={onOpenProposal}
                            className="text-emerald-700 hover:text-emerald-800 text-[11px] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Lihat rincian proposal</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono text-stone-400 block">
                      Estimasi:
                    </span>
                    <span className="text-xs font-semibold text-stone-700">
                      {stageItem.eta}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scope 6: Perkiraan Langkah Berikutnya & Dokumen Pendukung Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Steps Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Clock className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-sm text-stone-900">Perkiraan Langkah Berikutnya</h3>
          </div>

          <div className="text-xs text-stone-700 space-y-3">
            {applicant.stage === 'verifikasi_dokumen' && (
              <p className="leading-relaxed">
                Tim Administrasi TehKita sedang memeriksa keabsahan e-KTP dan kesiapan modal awal. Setelah dokumen dinyatakan valid, status akan otomatis berpindah ke tahap <strong>Evaluasi Kelayakan Lokasi</strong>.
              </p>
            )}

            {applicant.stage === 'menunggu_lokasi' && (
              <p className="leading-relaxed">
                Kami menunggu Anda menentukan titik lokasi usaha. Gunakan panduan kriteria radius 1.5 KM dan trafik minimarket kami agar pengajuan Anda segera disetujui.
              </p>
            )}

            {applicant.stage === 'evaluasi_lokasi' && (
              <p className="leading-relaxed">
                Tim ekspansi sedang mencocokkan data lokasi dengan peta gerai aktif TehKita. Hasil skor kecocokan akan diinformasikan lewat WhatsApp dan dokumen proposal akan diterbitkan.
              </p>
            )}

            {applicant.stage === 'negosiasi_proposal' && (
              <p className="leading-relaxed">
                Proposal resmi telah diterbitkan. Setelah Anda menyetujui rincian investasi dan SOP bahan baku, tim kami akan menjadwalkan perakitan booth serta pengiriman starter kit.
              </p>
            )}

            {applicant.stage === 'disetujui' && (
              <p className="leading-relaxed">
                Tahap pendaftaran dan proposal telah selesai! PIC operasional TehKita akan menghubungi Anda dalam 1x24 jam untuk konfirmasi pengiriman mesin dan jadwal training barista.
              </p>
            )}

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center justify-between text-[11px]">
              <span className="text-stone-500">Ada pertanyaan seputar alur?</span>
              <button
                onClick={onOpenAiChat}
                className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Konsultasi AI TehKita</span>
              </button>
            </div>
          </div>
        </div>

        {/* Documents Status Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-sm text-stone-900">Dokumen Pendukung Anda</h3>
            </div>
            <span className="text-xs text-stone-500">
              {applicant.documents.length} Berkas
            </span>
          </div>

          <div className="space-y-2.5">
            {applicant.documents.length === 0 ? (
              <div className="text-xs text-stone-500 py-4 text-center">
                Belum ada dokumen yang diunggah.
              </div>
            ) : (
              applicant.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-stone-900 block">{doc.title}</span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {doc.fileName} · {doc.fileSize}
                    </span>
                    {doc.revisionNote && (
                      <span className="text-[11px] text-amber-800 block mt-1 bg-amber-100/60 p-1.5 rounded">
                        Catatan Admin: {doc.revisionNote}
                      </span>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {doc.status === 'valid' ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Valid ✓
                      </span>
                    ) : doc.status === 'perlu_perbaikan' ? (
                      <button
                        onClick={() => onStartRevisionForm(doc.id)}
                        className="text-[10px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded transition-colors cursor-pointer"
                      >
                        Perbaiki ↻
                      </button>
                    ) : (
                      <span className="text-[10px] text-stone-500 bg-stone-200 px-2 py-0.5 rounded">
                        Menunggu Cek
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
