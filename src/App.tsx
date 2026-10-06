import React, { useState } from 'react';
import { CheckCircle2, X, ArrowRight } from 'lucide-react';
import { 
  Applicant, 
  FranchisePackageId, 
  LocationData, 
  NotificationItem, 
  ProposalData,
  RegistrationDraft
} from './types';
import { 
  INITIAL_APPLICANTS, 
  INITIAL_NOTIFICATIONS, 
  FRANCHISE_PACKAGES 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { ScenarioBar } from './components/ScenarioBar';
import { LandingPage } from './components/LandingPage';
import { RegistrationFlow } from './components/RegistrationFlow';
import { ApplicantTracker } from './components/ApplicantTracker';
import { ProposalViewer } from './components/ProposalViewer';
import { LocationGuideModal } from './components/LocationGuideModal';
import { AIChatbotModal } from './components/AIChatbotModal';
import { NotificationModal } from './components/NotificationModal';
import { FranchisorDashboard } from './components/FranchisorDashboard';

export default function App() {
  // App Core State
  const [currentRole, setCurrentRole] = useState<'candidate' | 'franchisor'>('candidate');
  const [currentView, setCurrentView] = useState<string>('landing');
  const [applicants, setApplicants] = useState<Applicant[]>(INITIAL_APPLICANTS);
  const [activeApplicantId, setActiveApplicantId] = useState<string>('app-001');
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modals & Panels
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isLocationGuideOpen, setIsLocationGuideOpen] = useState(false);
  const [isLocationSubmissionMode, setIsLocationSubmissionMode] = useState(false);

  // Form Revision Mode State
  const [isRevisionMode, setIsRevisionMode] = useState(false);
  const [revisionDocId, setRevisionDocId] = useState<string | undefined>(undefined);

  // Registration Status for Active Calon Mitra (only show Lacak Pengajuan once registered)
  const [hasRegistered, setHasRegistered] = useState<boolean>(false);

  // Unsubmitted Draft State for "Simpan dan Lanjutkan Nanti"
  const [registrationDraft, setRegistrationDraft] = useState<RegistrationDraft | null>(null);

  // Success Toast after submitting application
  const [submissionSuccessToast, setSubmissionSuccessToast] = useState<{
    isOpen: boolean;
    registrationNumber: string;
    applicantName: string;
    isRevision?: boolean;
  } | null>(null);

  // Success Toast after candidate approves proposal
  const [approvalSuccessToast, setApprovalSuccessToast] = useState<{
    isOpen: boolean;
    message: string;
  } | null>(null);

  // Active Applicant Getter
  const activeApplicant =
    applicants.find((a) => a.id === activeApplicantId) || applicants[0];

  // Helper to append a push notification simulation
  const addSimulatedNotification = (
    channel: 'whatsapp' | 'email',
    title: string,
    content: string,
    linkText?: string,
    targetView?: 'tracker' | 'form' | 'proposal' | 'location_guide',
    applicantName?: string
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      timestamp: 'Baru saja',
      channel,
      title,
      content,
      linkText,
      targetView,
      applicantName: applicantName || activeApplicant.fullName,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // 1. Reset Demo Data
  const handleResetData = () => {
    setApplicants(INITIAL_APPLICANTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveApplicantId('app-001');
    setHasRegistered(false);
    setRegistrationDraft(null);
    setSubmissionSuccessToast(null);
    setApprovalSuccessToast(null);
    setCurrentView('landing');
    setCurrentRole('candidate');
    setIsRevisionMode(false);
  };

  // 2. Scenario Picker
  const handleSelectApplicant = (selected: Applicant) => {
    setActiveApplicantId(selected.id);
    setHasRegistered(true);
    if (currentRole === 'candidate') {
      setCurrentView('tracker');
    }
  };

  // Select Guest Mode (Unregistered visitor)
  const handleSelectGuestMode = () => {
    setHasRegistered(false);
    if (currentRole === 'candidate') {
      setCurrentView('landing');
    }
  };

  // Draft handlers for "Simpan & Lanjutkan Nanti"
  const handleSaveDraftAndExit = (draftData: RegistrationDraft) => {
    setRegistrationDraft(draftData);
    setCurrentView('landing');
  };

  const handleResumeDraft = () => {
    setIsRevisionMode(false);
    setCurrentView('register');
  };

  const handleDiscardDraft = () => {
    setRegistrationDraft(null);
  };

  // 3. Complete Registration Flow (New Submission or Edit)
  const handleCompleteRegistration = (formData: Partial<Applicant>) => {
    if (isRevisionMode) {
      // Revision flow for existing applicant
      setApplicants((prev) =>
        prev.map((app) => {
          if (app.id === activeApplicantId) {
            return {
              ...app,
              documents: app.documents.map((d) => ({
                ...d,
                status: 'valid',
                revisionNote: undefined,
              })),
              requestedAction: undefined,
              stage: 'evaluasi_lokasi',
              stageHistory: [
                ...app.stageHistory,
                {
                  stage: 'evaluasi_lokasi',
                  timestamp: new Date().toISOString(),
                  note: 'Dokumen perbaikan telah diunggah ulang dan terverifikasi valid.',
                },
              ],
            };
          }
          return app;
        })
      );

      addSimulatedNotification(
        'whatsapp',
        'Dokumen Perbaikan Terverifikasi',
        `Halo ${activeApplicant.fullName}, dokumen e-KTP perbaikan Anda telah kami terima dan dinyatakan valid. Tim kemitraan TehKita sedang melanjutkan evaluasi titik lokasi.`,
        'Lihat Status Pengajuan',
        'tracker'
      );

      setIsRevisionMode(false);
      setCurrentView('landing');
      window.scrollTo({ top: 0, behavior: 'instant' });
      setSubmissionSuccessToast({
        isOpen: true,
        registrationNumber: activeApplicant.registrationNumber,
        applicantName: activeApplicant.fullName,
        isRevision: true,
      });
      setTimeout(() => {
        setSubmissionSuccessToast((prev) => (prev ? { ...prev, isOpen: false } : null));
      }, 4500);
      return;
    }

    // New Applicant Registration
    const newId = `app-${Date.now().toString().slice(-4)}`;
    const newRegNum = `TK-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newApplicant: Applicant = {
      id: newId,
      registrationNumber: newRegNum,
      fullName: formData.fullName || 'Calon Mitra Baru',
      phone: formData.phone || '0812-0000-0000',
      email: formData.email || 'calon.mitra@gmail.com',
      city: formData.city || 'Jakarta',
      occupation: formData.occupation || 'Wirausaha',
      createdAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      selectedPackageId: formData.selectedPackageId || 'booth_kontainer',
      allocatedBudget: formData.allocatedBudget || 12500000,
      hasFnbExperience: formData.hasFnbExperience || false,
      fnbExperienceDetail: formData.fnbExperienceDetail,
      location: formData.location || { hasLocation: false },
      documents: formData.documents || [],
      stage: formData.location?.hasLocation ? 'evaluasi_lokasi' : 'menunggu_lokasi',
      stageHistory: [
        {
          stage: 'pengajuan_baru',
          timestamp: new Date().toISOString(),
          note: 'Pendaftaran kemitraan mandiri melalui portal resmi TehKita.',
        },
        {
          stage: formData.location?.hasLocation ? 'evaluasi_lokasi' : 'menunggu_lokasi',
          timestamp: new Date().toISOString(),
          note: formData.location?.hasLocation
            ? 'Dokumen awal diserahkan dan evaluasi skor lokasi sedang berjalan.'
            : 'Dokumen lengkap. Menunggu calon mitra mengajukan kandidat titik lokasi usaha.',
        },
      ],
      requestedAction: !formData.location?.hasLocation
        ? {
            type: 'ajukan_lokasi',
            title: 'Kirim Usulan Titik Lokasi Usaha',
            instruction: 'Pelajari Panduan Kriteria Lokasi TehKita dan kirimkan alamat titik usaha saat Anda telah menemukan lokasi yang cocok.',
          }
        : undefined,
      proposals: [],
    };

    setApplicants((prev) => [newApplicant, ...prev]);
    setActiveApplicantId(newId);

    // Trigger WhatsApp & Email Notification for submission
    addSimulatedNotification(
      'whatsapp',
      'Pengajuan Kemitraan TehKita Berhasil Diterima',
      `Halo Kak ${newApplicant.fullName}! Pendaftaran kemitraan TehKita Anda (${newRegNum}) telah berhasil masuk ke sistem kami. Tim kemitraan akan segera memverifikasi berkas dan kelayakan lokasi Anda.`,
      'Buka Pelacak Pengajuan',
      'tracker',
      newApplicant.fullName
    );

    addSimulatedNotification(
      'email',
      `[TehKita] Konfirmasi Pendaftaran Kemitraan - ${newRegNum}`,
      `Terima kasih telah mendaftar kemitraan franchise TehKita. Status dan tahapan selanjutnya dapat dipantau langsung melalui portal digital kami.`,
      'Pantau Posisi Pengajuan',
      'tracker',
      newApplicant.fullName
    );

    setHasRegistered(true);
    setRegistrationDraft(null);
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'instant' });
    setSubmissionSuccessToast({
      isOpen: true,
      registrationNumber: newRegNum,
      applicantName: newApplicant.fullName,
      isRevision: false,
    });
    setTimeout(() => {
      setSubmissionSuccessToast((prev) => (prev ? { ...prev, isOpen: false } : null));
    }, 4500);
  };

  // 4. Proposed Location Submission from Guide Modal
  const handleSubmitProposedLocation = (locData: LocationData) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id === activeApplicantId) {
          return {
            ...app,
            location: locData,
            stage: 'evaluasi_lokasi',
            requestedAction: undefined,
            stageHistory: [
              ...app.stageHistory,
              {
                stage: 'evaluasi_lokasi',
                timestamp: new Date().toISOString(),
                note: `Usulan titik lokasi diajukan: ${locData.address} (Skor Otomatis: ${locData.score}/100 - ${locData.scoreDetails?.verdict}).`,
              },
            ],
          };
        }
        return app;
      })
    );

    addSimulatedNotification(
      'whatsapp',
      'Usulan Lokasi Berhasil Dihitung',
      `Halo ${activeApplicant.fullName}, usulan lokasi Anda di ${locData.address} telah kami terima dengan skor kelayakan awal ${locData.score}/100 (${locData.scoreDetails?.verdict}). Tim franchisor TehKita sedang menyusun draft proposal kemitraan.`,
      'Cek Status Lokasi',
      'tracker'
    );
  };

  // 5. Candidate Approves Proposal (Mutual Agreement - End Flow)
  const handleApproveProposal = (proposalId: string) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id === activeApplicantId) {
          return {
            ...app,
            stage: 'disetujui',
            requestedAction: undefined,
            proposals: app.proposals.map((p) =>
              p.id === proposalId ? { ...p, status: 'disetujui' } : p
            ),
            stageHistory: [
              ...app.stageHistory,
              {
                stage: 'disetujui',
                timestamp: new Date().toISOString(),
                note: 'Proposal kemitraan resmi disetujui bersama oleh Calon Mitra dan Franchisor TehKita.',
              },
            ],
          };
        }
        return app;
      })
    );

    addSimulatedNotification(
      'whatsapp',
      'Kemitraan Resmi Disetujui (Kedua Pihak)',
      `Selamat Kak ${activeApplicant.fullName}! Anda telah resmi menjadi mitra franchise TehKita. Surat perjanjian kerja sama telah diterbitkan. Tim operasional akan menjadwalkan perakitan booth dan training barista.`,
      'Lihat Bukti Kesepakatan',
      'proposal'
    );

    addSimulatedNotification(
      'email',
      `[Resmi] Surat Keputusan Kemitraan TehKita - ${activeApplicant.registrationNumber}`,
      `Selamat datang di keluarga besar TehKita. Dokumen kemitraan resmi telah disahkan oleh kedua belah pihak.`,
      'Unduh Kontrak Resmi',
      'proposal'
    );

    // Langsung kembalikan ke halaman lacak pengajuan dengan toast berhasil diproses
    setHasRegistered(true);
    setCurrentView('tracker');
    window.scrollTo({ top: 0, behavior: 'instant' });
    setApprovalSuccessToast({
      isOpen: true,
      message: 'Proposal kemitraan berhasil disetujui & diproses! Selamat bergabung bersama TehKita.',
    });
    setTimeout(() => {
      setApprovalSuccessToast((prev) => (prev ? { ...prev, isOpen: false } : null));
    }, 4500);
  };

  // 6. Candidate Requests Revision on Proposal
  const handleRequestProposalRevision = (
    proposalId: string,
    notes: string,
    requestedAdjustment: string
  ) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id === activeApplicantId) {
          return {
            ...app,
            stage: 'negosiasi_proposal',
            requestedAction: {
              type: 'tunggu_evaluasi',
              title: 'Revisi Sedang Ditinjau Tim TehKita',
              instruction: `Permintaan revisi Anda ("${notes}") sedang diproses oleh Tim Franchisor TehKita untuk penerbitan proposal versi baru.`,
            },
            proposals: app.proposals.map((p) =>
              p.id === proposalId
                ? {
                    ...p,
                    status: 'revisi_diminta',
                    candidateRevisionRequest: {
                      date: new Date().toISOString().split('T')[0],
                      notes,
                      requestedAdjustment,
                    },
                  }
                : p
            ),
            stageHistory: [
              ...app.stageHistory,
              {
                stage: 'negosiasi_proposal',
                timestamp: new Date().toISOString(),
                note: `Calon mitra mengajukan permohonan revisi proposal: ${notes}.`,
              },
            ],
          };
        }
        return app;
      })
    );

    addSimulatedNotification(
      'whatsapp',
      'Permintaan Revisi Proposal Diteruskan',
      `Halo Kak ${activeApplicant.fullName}, catatan revisi proposal Anda telah kami teruskan ke Tim Manajemen TehKita. Kami akan meninjau dan menerbitkan versi proposal penyesuaian (Versi 2).`,
      'Pantau Status Proposal',
      'tracker'
    );
  };

  // 7. Candidate Rejects Proposal
  const handleRejectProposal = (proposalId: string, reason: string) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id === activeApplicantId) {
          return {
            ...app,
            stage: 'ditolak',
            proposals: app.proposals.map((p) =>
              p.id === proposalId
                ? {
                    ...p,
                    status: 'ditolak',
                    rejectionReason: reason,
                  }
                : p
            ),
            rejectionInfo: {
              date: new Date().toISOString().split('T')[0],
              reasonCategory: 'Penolakan Mandiri oleh Calon Mitra',
              details: `Calon mitra memutuskan untuk tidak melanjutkan proposal dengan alasan: ${reason}.`,
            },
            stageHistory: [
              ...app.stageHistory,
              {
                stage: 'ditolak',
                timestamp: new Date().toISOString(),
                note: `Calon mitra menolak proposal kemitraan: ${reason}.`,
              },
            ],
          };
        }
        return app;
      })
    );
  };

  // 8. Franchisor Issues Proposal
  const handleFranchisorIssueProposal = (applicantId: string, newProposal: ProposalData) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id === applicantId) {
          return {
            ...app,
            stage: 'negosiasi_proposal',
            currentProposalId: newProposal.id,
            proposals: [...app.proposals, newProposal],
            requestedAction: {
              type: 'review_proposal',
              title: `Tinjau Proposal Kemitraan Resmi (Versi ${newProposal.version})`,
              instruction: `Tim Franchisor TehKita telah menerbitkan Dokumen Proposal Kemitraan Versi ${newProposal.version}. Silakan periksa rincian investasi dan klausul kesepakatan.`,
            },
            stageHistory: [
              ...app.stageHistory,
              {
                stage: 'negosiasi_proposal',
                timestamp: new Date().toISOString(),
                note: `Tim franchisor menerbitkan Dokumen Proposal Kemitraan Versi ${newProposal.version}.`,
              },
            ],
          };
        }
        return app;
      })
    );

    const targetApp = applicants.find((a) => a.id === applicantId);
    if (targetApp) {
      addSimulatedNotification(
        'whatsapp',
        `Proposal Kemitraan (Versi ${newProposal.version}) Diterbitkan`,
        `Halo Kak ${targetApp.fullName}! Tim TehKita telah menerbitkan Dokumen Proposal Kemitraan Resmi untuk gerai Anda. Silakan buka dokumen di portal untuk menyetujui atau mengajukan revisi.`,
        'Buka & Tinjau Proposal',
        'proposal',
        targetApp.fullName
      );
    }
  };

  // 9. Franchisor Requests Doc Revision
  const handleFranchisorRequestDocRevision = (
    applicantId: string,
    docId: string,
    note: string
  ) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id === applicantId) {
          return {
            ...app,
            stage: 'verifikasi_dokumen',
            documents: app.documents.map((d) =>
              d.id === docId
                ? { ...d, status: 'perlu_perbaikan', revisionNote: note }
                : d
            ),
            requestedAction: {
              type: 'revisi_dokumen',
              title: 'Perbaikan Dokumen Diperlukan',
              instruction: note,
            },
            stageHistory: [
              ...app.stageHistory,
              {
                stage: 'verifikasi_dokumen',
                timestamp: new Date().toISOString(),
                note: `Tim administrasi meminta perbaikan dokumen: ${note}`,
              },
            ],
          };
        }
        return app;
      })
    );

    const targetApp = applicants.find((a) => a.id === applicantId);
    if (targetApp) {
      addSimulatedNotification(
        'whatsapp',
        'Perbaikan Dokumen Diperlukan',
        `Halo Kak ${targetApp.fullName}, tim administrasi TehKita mendapati bahwa dokumen pendaftaran Anda memerlukan perbaikan: "${note}". Silakan unggah perbaikan melalui portal.`,
        'Perbaiki Dokumen Sekarang',
        'tracker',
        targetApp.fullName
      );
    }
  };

  // 10. Franchisor Rejects Applicant
  const handleFranchisorReject = (
    applicantId: string,
    reasonCategory: string,
    details: string
  ) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id === applicantId) {
          return {
            ...app,
            stage: 'ditolak',
            requestedAction: undefined,
            rejectionInfo: {
              date: new Date().toISOString().split('T')[0],
              reasonCategory,
              details,
            },
            stageHistory: [
              ...app.stageHistory,
              {
                stage: 'ditolak',
                timestamp: new Date().toISOString(),
                note: `Pengajuan tidak lolos seleksi: ${reasonCategory} (${details}).`,
              },
            ],
          };
        }
        return app;
      })
    );

    const targetApp = applicants.find((a) => a.id === applicantId);
    if (targetApp) {
      addSimulatedNotification(
        'whatsapp',
        'Pembaruan Status Seleksi Kemitraan',
        `Yth. ${targetApp.fullName}, terima kasih atas ketertarikan Anda. Berdasarkan evaluasi standar zonasi dan seleksi TehKita, saat ini pengajuan titik lokasi Anda belum dapat kami setujui (${reasonCategory}). Anda dapat mengajukan titik lokasi alternatif lain.`,
        'Lihat Penjelasan Detail',
        'tracker',
        targetApp.fullName
      );
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* 1. Global Scenario Testing Ribbon */}
      <ScenarioBar
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          if (role === 'franchisor') {
            setCurrentView('franchisor_dashboard');
          } else {
            setCurrentView(!hasRegistered || activeApplicant.stage === 'pengajuan_baru' ? 'landing' : 'tracker');
          }
        }}
        activeApplicant={activeApplicant}
        hasRegistered={hasRegistered}
        allApplicants={applicants}
        onSelectApplicant={handleSelectApplicant}
        onSelectGuestMode={handleSelectGuestMode}
        onResetData={handleResetData}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        unreadNotifsCount={notifications.filter((n) => !n.read).length}
        onOpenAiChat={() => setIsAiChatOpen(true)}
      />

      {/* 2. Top Bar Navigation (3-Zone Top Bar Contract) */}
      <Navbar
        currentRole={currentRole}
        currentView={currentView}
        activeApplicant={activeApplicant}
        hasRegistered={hasRegistered}
        registrationDraft={registrationDraft}
        onResumeDraft={handleResumeDraft}
        onNavigate={(view, sectionId) => {
          if (sectionId) {
            if (currentView !== 'landing') {
              setCurrentView('landing');
            }
            setTimeout(() => {
              const el = document.getElementById(sectionId);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 60);
            return;
          }

          if (view === 'packages' || view === 'location_calc') {
            const targetId = view === 'packages' ? 'paket-kemitraan' : 'skor-lokasi';
            if (currentView !== 'landing') {
              setCurrentView('landing');
            }
            setTimeout(() => {
              const el = document.getElementById(targetId);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 60);
            return;
          }

          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAiChat={() => setIsAiChatOpen(true)}
      />

      {/* Simple & Clean Toast Notifikasi Berhasil Dikirim */}
      {submissionSuccessToast?.isOpen && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 bg-stone-900/95 backdrop-blur-sm text-white px-3.5 py-2 rounded-xl shadow-lg border border-emerald-500/60 flex items-center gap-2.5 text-xs animate-in slide-in-from-top-2 max-w-sm">
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <span className="font-semibold text-white">
              {submissionSuccessToast.isRevision ? 'Dokumen berhasil dikirim!' : 'Pengajuan berhasil dikirim!'}
            </span>
            <span className="text-[11px] text-emerald-300 font-mono ml-1.5 font-bold">
              ({submissionSuccessToast.registrationNumber})
            </span>
          </div>
          <button
            onClick={() => setSubmissionSuccessToast(null)}
            className="text-stone-400 hover:text-white transition-colors cursor-pointer p-0.5 -mr-1"
            title="Tutup"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Simple & Clean Toast Notifikasi Proposal Berhasil Disetujui */}
      {approvalSuccessToast?.isOpen && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 bg-stone-900/95 backdrop-blur-sm text-white px-3.5 py-2.5 rounded-xl shadow-lg border border-emerald-500/70 flex items-center gap-2.5 text-xs animate-in slide-in-from-top-2 max-w-sm">
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <span className="font-semibold text-white block">
              Proposal Berhasil Disetujui!
            </span>
            <span className="text-[11px] text-emerald-300">
              Kemitraan berhasil diproses ke tahap akhir.
            </span>
          </div>
          <button
            onClick={() => setApprovalSuccessToast(null)}
            className="text-stone-400 hover:text-white transition-colors cursor-pointer p-0.5 -mr-1"
            title="Tutup"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Main Dynamic Content Views */}
      <main className="flex-1">
        {currentRole === 'franchisor' ? (
          <FranchisorDashboard
            applicants={applicants}
            onSelectApplicant={handleSelectApplicant}
            onUpdateApplicant={(up) => {
              setApplicants((prev) => prev.map((a) => (a.id === up.id ? up : a)));
            }}
            onIssueProposal={handleFranchisorIssueProposal}
            onRequestDocRevision={handleFranchisorRequestDocRevision}
            onRejectApplicant={handleFranchisorReject}
            onApproveLocation={(id) => {
              setApplicants((prev) =>
                prev.map((a) => (a.id === id ? { ...a, stage: 'penyusunan_proposal' } : a))
              );
            }}
          />
        ) : (
          <>
            {currentView === 'landing' && (
              <LandingPage
                activeApplicant={activeApplicant}
                hasRegistered={hasRegistered}
                registrationDraft={registrationDraft}
                onResumeDraft={handleResumeDraft}
                onDiscardDraft={handleDiscardDraft}
                onStartRegistration={() => {
                  setIsRevisionMode(false);
                  setCurrentView('register');
                }}
                onOpenAiChat={() => setIsAiChatOpen(true)}
                onOpenLocationGuide={() => {
                  setIsLocationSubmissionMode(false);
                  setIsLocationGuideOpen(true);
                }}
                onViewTracker={() => setCurrentView('tracker')}
              />
            )}

            {currentView === 'register' && (
              <RegistrationFlow
                isRevisionMode={isRevisionMode}
                revisionDocId={revisionDocId}
                existingApplicant={isRevisionMode ? activeApplicant : undefined}
                initialDraft={registrationDraft}
                onSaveDraftAndExit={handleSaveDraftAndExit}
                onComplete={handleCompleteRegistration}
                onCancel={() => {
                  setIsRevisionMode(false);
                  setCurrentView('landing');
                }}
              />
            )}

            {currentView === 'tracker' && (
              <ApplicantTracker
                applicant={activeApplicant}
                onOpenProposal={() => setCurrentView('proposal')}
                onOpenLocationGuide={(isSubmitMode) => {
                  setIsLocationSubmissionMode(!!isSubmitMode);
                  setIsLocationGuideOpen(true);
                }}
                onStartRevisionForm={(docId) => {
                  setIsRevisionMode(true);
                  setRevisionDocId(docId);
                  setCurrentView('register');
                }}
                onOpenAiChat={() => setIsAiChatOpen(true)}
              />
            )}

            {currentView === 'proposal' && (
              <ProposalViewer
                applicant={activeApplicant}
                proposal={
                  activeApplicant.proposals[activeApplicant.proposals.length - 1] || {
                    id: 'prop-draft',
                    version: 1,
                    issuedDate: '2026-10-04',
                    packageId: activeApplicant.selectedPackageId,
                    packageName: 'Paket Kemitraan TehKita',
                    totalInvestment: 12500000,
                    paymentTerms: 'Commitment fee Rp 2.500.000 di awal, pelunasan sebelum kirim booth.',
                    exclusiveRadiusKm: 1.5,
                    rawMaterialSupplyTerm: 'Pasokan daun teh & cup resmi TehKita (0% royalty fee bulanan).',
                    royaltyFeeMonthly: 0,
                    estimatedDailyCups: 110,
                    estimatedNetProfitMonthly: 4950000,
                    estimatedBepMonths: 2.8,
                    clauses: [
                      {
                        title: '1. Hak Milik Peralatan',
                        description: 'Seluruh booth dan peralatan adalah 100% milik mitra.',
                      },
                      {
                        title: '2. Tanpa Royalty Fee',
                        description: '100% laba operasional menjadi milik mitra.',
                      },
                      {
                        title: '3. Radius Eksklusif',
                        description: 'Jaminan proteksi radius 1.5 KM.',
                      },
                    ],
                    status: 'menunggu_review_calon',
                  }
                }
                onApproveProposal={handleApproveProposal}
                onRequestRevision={handleRequestProposalRevision}
                onRejectProposal={handleRejectProposal}
                onBack={() => setCurrentView('tracker')}
              />
            )}
          </>
        )}
      </main>

      {/* 4. Global Modals */}
      {/* Scope 1: AI Chatbot Modal */}
      <AIChatbotModal
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        onNavigateToForm={() => {
          setIsRevisionMode(false);
          setCurrentView('register');
        }}
        onNavigateToLocation={() => {
          setIsLocationSubmissionMode(false);
          setIsLocationGuideOpen(true);
        }}
      />

      {/* Scope 7: WhatsApp & Email Notifications Simulator */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
        onSelectAction={(targetView) => {
          if (targetView === 'proposal') setCurrentView('proposal');
          else if (targetView === 'tracker') setCurrentView('tracker');
          else if (targetView === 'form') {
            setIsRevisionMode(true);
            setCurrentView('register');
          } else if (targetView === 'location_guide') {
            setIsLocationSubmissionMode(true);
            setIsLocationGuideOpen(true);
          }
        }}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
      />

      {/* Scope 3: Location Guide & Proposed Location Modal */}
      <LocationGuideModal
        isOpen={isLocationGuideOpen}
        isSubmissionMode={isLocationSubmissionMode}
        onClose={() => setIsLocationGuideOpen(false)}
        onSubmitProposedLocation={handleSubmitProposedLocation}
      />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-8 px-4 border-t border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
              TK
            </span>
            <span className="font-bold text-stone-200">TehKita Indonesia</span>
            <span>·</span>
            <span>Sistem Kemitraan Waralaba Digital F&B</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>350 Mitra Aktif</span>
            <span>·</span>
            <span>0% Royalty Fee</span>
            <span>·</span>
            <span>Proteksi Radius 1.5 KM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
