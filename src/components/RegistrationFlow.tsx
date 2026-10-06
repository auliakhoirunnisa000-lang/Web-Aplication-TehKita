import React, { useState } from 'react';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Building2,
  MapPin,
  Coffee,
  X
} from 'lucide-react';
import { Applicant, FranchisePackageId, LocationType, RegistrationDraft } from '../types';
import { FRANCHISE_PACKAGES } from '../data/mockData';
import { calculateLocationScore } from '../utils/locationScorer';

interface RegistrationFlowProps {
  onComplete: (newApplicantData: Partial<Applicant>) => void;
  onCancel: () => void;
  onSaveDraftAndExit: (draftData: RegistrationDraft) => void;
  initialDraft?: RegistrationDraft | null;
  existingApplicant?: Applicant;
  isRevisionMode?: boolean;
  revisionDocId?: string;
}

export const RegistrationFlow: React.FC<RegistrationFlowProps> = ({
  onComplete,
  onCancel,
  onSaveDraftAndExit,
  initialDraft,
  existingApplicant,
  isRevisionMode = false,
  revisionDocId,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(
    isRevisionMode ? 4 : (initialDraft?.step || 1)
  );
  const [saveDraftToast, setSaveDraftToast] = useState(false);

  // Form State initialized from initialDraft or existingApplicant
  const [fullName, setFullName] = useState(
    initialDraft?.fullName || existingApplicant?.fullName || 'Aulia Khoirunnisa'
  );
  const [phone, setPhone] = useState(
    initialDraft?.phone || existingApplicant?.phone || '0812-9988-7766'
  );
  const [email, setEmail] = useState(
    initialDraft?.email || existingApplicant?.email || 'aulia.khoirunn@gmail.com'
  );
  const [city, setCity] = useState(
    initialDraft?.city || existingApplicant?.city || 'Jakarta Selatan'
  );
  const [occupation, setOccupation] = useState(
    initialDraft?.occupation || existingApplicant?.occupation || 'Karyawan Swasta'
  );

  // Step 2 State
  const [selectedPackageId, setSelectedPackageId] = useState<FranchisePackageId>(
    initialDraft?.selectedPackageId || existingApplicant?.selectedPackageId || 'booth_kontainer'
  );
  const [allocatedBudget, setAllocatedBudget] = useState<number>(
    initialDraft?.allocatedBudget ?? existingApplicant?.allocatedBudget ?? 15000000
  );
  const [hasFnbExperience, setHasFnbExperience] = useState<boolean>(
    initialDraft?.hasFnbExperience ?? existingApplicant?.hasFnbExperience ?? false
  );
  const [fnbExperienceDetail, setFnbExperienceDetail] = useState<string>(
    initialDraft?.fnbExperienceDetail || existingApplicant?.fnbExperienceDetail || ''
  );

  // Step 3 State: Location
  const [hasLocation, setHasLocation] = useState<boolean>(
    initialDraft?.hasLocation ?? existingApplicant?.location?.hasLocation ?? true
  );
  const [locationAddress, setLocationAddress] = useState(
    initialDraft?.locationAddress || existingApplicant?.location?.address || 'Jl. RS Fatmawati Raya No. 18'
  );
  const [locationDistrict, setLocationDistrict] = useState(
    initialDraft?.locationDistrict || existingApplicant?.location?.district || 'Cilandak'
  );
  const [locationType, setLocationType] = useState<LocationType>(
    initialDraft?.locationType || existingApplicant?.location?.locationType || 'depan_minimarket'
  );
  const [pedestrianTraffic, setPedestrianTraffic] = useState<'tinggi' | 'sedang' | 'rendah'>(
    initialDraft?.pedestrianTraffic || existingApplicant?.location?.pedestrianTraffic || 'tinggi'
  );
  const [vehicleTraffic, setVehicleTraffic] = useState<'tinggi' | 'sedang' | 'rendah'>(
    initialDraft?.vehicleTraffic || existingApplicant?.location?.vehicleTraffic || 'tinggi'
  );
  const [hasParkingMotor, setHasParkingMotor] = useState(
    initialDraft?.hasParkingMotor ?? existingApplicant?.location?.hasParkingMotor ?? true
  );
  const [hasParkingMobil, setHasParkingMobil] = useState(
    initialDraft?.hasParkingMobil ?? existingApplicant?.location?.hasParkingMobil ?? true
  );
  const [nearestTehKitaDistanceKm, setNearestTehKitaDistanceKm] = useState(
    initialDraft?.nearestTehKitaDistanceKm ?? existingApplicant?.location?.nearestTehKitaDistanceKm ?? 2.6
  );
  const [electricityPowerVa, setElectricityPowerVa] = useState(
    initialDraft?.electricityPowerVa ?? existingApplicant?.location?.electricityPowerVa ?? 1300
  );
  const [hasCleanWater, setHasCleanWater] = useState(
    initialDraft?.hasCleanWater ?? existingApplicant?.location?.hasCleanWater ?? true
  );

  // Step 4 State: Documents
  const [ktpFileName, setKtpFileName] = useState(
    initialDraft?.ktpFileName || (isRevisionMode ? 'KTP_Baru_Jelas_2026.jpg' : 'KTP_eKTP_Aulia_Khoirunnisa.jpg')
  );
  const [danaFileName, setDanaFileName] = useState(
    initialDraft?.danaFileName || 'Rekening_Koran_BCA_3Bulan.pdf'
  );
  const [lokasiFileName, setLokasiFileName] = useState(
    initialDraft?.lokasiFileName || 'Foto_Titik_Fatmawati.jpg'
  );

  // Live Location Score
  const liveScore = calculateLocationScore({
    locationType,
    pedestrianTraffic,
    vehicleTraffic,
    hasParkingMotor,
    hasParkingMobil,
    nearestTehKitaDistanceKm,
    electricityPowerVa,
    hasCleanWater,
  });

  const handleSaveDraft = () => {
    const draftData: RegistrationDraft = {
      step: currentStep,
      lastSavedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      fullName,
      phone,
      email,
      city,
      occupation,
      selectedPackageId,
      allocatedBudget,
      hasFnbExperience,
      fnbExperienceDetail,
      hasLocation,
      locationAddress,
      locationDistrict,
      locationType,
      pedestrianTraffic,
      vehicleTraffic,
      hasParkingMotor,
      hasParkingMobil,
      nearestTehKitaDistanceKm,
      electricityPowerVa,
      hasCleanWater,
      ktpFileName,
      danaFileName,
      lokasiFileName,
    };

    setSaveDraftToast(true);
    setTimeout(() => {
      onSaveDraftAndExit(draftData);
    }, 600);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData: Partial<Applicant> = {
      fullName,
      phone,
      email,
      city,
      occupation,
      selectedPackageId,
      allocatedBudget,
      hasFnbExperience,
      fnbExperienceDetail,
      location: hasLocation
        ? {
            hasLocation: true,
            address: locationAddress,
            city,
            district: locationDistrict,
            locationType,
            pedestrianTraffic,
            vehicleTraffic,
            hasParkingMotor,
            hasParkingMobil,
            nearestTehKitaDistanceKm,
            electricityPowerVa,
            hasCleanWater,
            score: liveScore.score,
            scoreDetails: liveScore,
          }
        : {
            hasLocation: false,
          },
      documents: [
        {
          id: 'doc-ktp-new',
          title: 'Foto / Scan KTP Asli',
          fileName: ktpFileName,
          fileSize: '1.5 MB',
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'valid',
        },
        {
          id: 'doc-dana-new',
          title: 'Bukti Kesiapan Dana',
          fileName: danaFileName,
          fileSize: '2.1 MB',
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'valid',
        },
      ],
      stage: hasLocation ? 'evaluasi_lokasi' : 'menunggu_lokasi',
    };

    onComplete(submissionData);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Draft Save Toast Notification */}
      {saveDraftToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-lg border border-stone-700 flex items-center gap-2 text-xs animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Draft berhasil disimpan di Langkah {currentStep}. Mengalihkan ke Beranda...</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                {isRevisionMode ? 'Mode Perbaikan Data' : 'Formulir Kemitraan Bertahap'}
              </span>
              <span className="text-xs text-stone-400">·</span>
              <span className="text-xs text-stone-500">Scope 2 PRD</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 mt-1">
              {isRevisionMode
                ? 'Perbaiki Dokumen yang Diminta Tim TehKita'
                : 'Pendaftaran Kemitraan Franchise TehKita'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-stone-600" />
              <span>Simpan & Lanjutkan Nanti</span>
            </button>
            <button
              onClick={onCancel}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Indicators */}
        {!isRevisionMode && (
          <div className="grid grid-cols-4 gap-2 pt-4">
            {[
              { num: 1, title: 'Data Calon Mitra' },
              { num: 2, title: 'Paket & Modal' },
              { num: 3, title: 'Kandidat Lokasi' },
              { num: 4, title: 'Unggah Dokumen' },
            ].map((step) => (
              <button
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                className={`text-left p-2 rounded-xl transition-all cursor-pointer ${
                  currentStep === step.num
                    ? 'bg-emerald-50 border border-emerald-300'
                    : currentStep > step.num
                    ? 'bg-stone-50 border border-stone-200'
                    : 'opacity-50 border border-transparent'
                }`}
              >
                <span className="text-[10px] font-bold block text-emerald-800">
                  Langkah {step.num} {currentStep > step.num && '✓'}
                </span>
                <span className="text-xs font-semibold text-stone-800 truncate block">
                  {step.title}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Step Content */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        {/* STEP 1: Personal Profile */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-stone-900">Langkah 1: Identitas & Kontak Calon Mitra</h3>
              <p className="text-xs text-stone-500 mt-1">
                Data ini digunakan untuk verifikasi administrasi dan pengiriman proposal kemitraan resmi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nama Lengkap (Sesuai KTP) *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  No. WhatsApp Aktif *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 0812-3456-7890"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Notifikasi pembaruan status akan dikirimkan otomatis ke WhatsApp ini.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Alamat Email Aktif *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email.anda@gmail.com"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Kota / Kabupaten Domisili *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Contoh: Jakarta Selatan, Surabaya, Bandung"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Pekerjaan / Aktivitas Saat Ini
                </label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="Contoh: Karyawan Swasta / Wirausaha Kuliner"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Lanjut ke Pemilihan Paket</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Package Selection & Budget */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-stone-900">Langkah 2: Paket Kemitraan & Kesiapan Modal</h3>
              <p className="text-xs text-stone-500 mt-1">
                Pilih paket franchise TehKita yang sesuai dengan target lokasi dan kesiapan modal Anda.
              </p>
            </div>

            {/* Packages Selection Radio Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {FRANCHISE_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`border-2 rounded-2xl p-4 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedPackageId === pkg.id
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {pkg.popular ? 'Terfavorit' : 'Siap Jualan'}
                      </span>
                      {selectedPackageId === pkg.id && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-stone-900">{pkg.name}</h4>
                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{pkg.description}</p>

                    <div className="mt-3">
                      <span className="text-lg font-black text-emerald-800 font-mono">
                        Rp {pkg.price.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-stone-500 block">Tanpa Royalty Bulanan</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-stone-200/80 space-y-1 text-[11px] text-stone-600">
                      <div>• Bahan Baku: <strong>{pkg.initialIngredientsCount} Cup</strong></div>
                      <div>• Estimasi BEP: <strong>{pkg.estimatedRoiMonths}</strong></div>
                      <div>• Dimensi: {pkg.boothDimensions}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Budget & F&B Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Alokasi Dana yang Disiapkan (Rp)
                </label>
                <input
                  type="number"
                  step="500000"
                  value={allocatedBudget}
                  onChange={(e) => setAllocatedBudget(parseInt(e.target.value) || 0)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Apakah Pernah Memiliki Pengalaman Bisnis F&B?
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="experience"
                      checked={hasFnbExperience}
                      onChange={() => setHasFnbExperience(true)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Ya, Pernah</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="experience"
                      checked={!hasFnbExperience}
                      onChange={() => setHasFnbExperience(false)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Belum Pernah (Pemula)</span>
                  </label>
                </div>
              </div>

              {hasFnbExperience && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Ceritakan Pengalaman Usaha F&B Anda Sebelumnya
                  </label>
                  <input
                    type="text"
                    value={fnbExperienceDetail}
                    onChange={(e) => setFnbExperienceDetail(e.target.value)}
                    placeholder="Contoh: Pernah membuka kedai jus buah atau warung kopi selama 1 tahun..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Lanjut ke Penentuan Lokasi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Location Determination (PRD Scope 3) */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-stone-900">Langkah 3: Status & Penilaian Lokasi Usaha</h3>
              <p className="text-xs text-stone-500 mt-1">
                Apakah Anda sudah memiliki kepastian lokasi atau ingin mendaftar terlebih dahulu sambil mencari lokasi ideal?
              </p>
            </div>

            {/* Toggle Has Location vs No Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setHasLocation(true)}
                className={`border-2 rounded-2xl p-4 transition-all cursor-pointer ${
                  hasLocation
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                      Sudah Memiliki Titik Lokasi
                    </h4>
                    <span className="text-[11px] text-stone-500">
                      Sistem akan langsung menghitung skor kecocokan
                    </span>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setHasLocation(false)}
                className={`border-2 rounded-2xl p-4 transition-all cursor-pointer ${
                  !hasLocation
                    ? 'border-amber-600 bg-amber-50/60 shadow-sm'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                      Belum Memiliki Lokasi
                    </h4>
                    <span className="text-[11px] text-stone-500">
                      Status Menunggu Lokasi & dapatkan Panduan Kriteria
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* If NO Location: Special PRD Callout */}
            {!hasLocation ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs space-y-3 text-amber-900">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span>Pengajuan Tetap Dapat Diproses (Status: Menunggu Lokasi)</span>
                </div>
                <p className="leading-relaxed text-amber-800">
                  Berdasarkan SOP TehKita, calon mitra yang belum memiliki lokasi tetap dapat menyelesaikan pendaftaran dan verifikasi berkas terlebih dahulu. Setelah berkas Anda dinyatakan lengkap, tim kami akan memberikan <strong>Buku Panduan Kriteria Lokasi Ideal</strong> dan Anda dapat mengajukan usulan titik lokasi kapan saja tanpa mengulang formulir.
                </p>
                <div className="bg-white/80 p-3 rounded-xl border border-amber-200 flex items-center justify-between text-[11px]">
                  <span>Radius proteksi minimum gerai: <strong>1.5 KM antar outlet</strong></span>
                  <span className="text-amber-800 font-semibold">Bebas kanibalisasi</span>
                </div>
              </div>
            ) : (
              /* If HAS Location: Detailed Inputs & Realtime Scoring */
              <div className="space-y-4">
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-xs space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Alamat Lengkap Lokasi Usaha *
                      </label>
                      <input
                        type="text"
                        required
                        value={locationAddress}
                        onChange={(e) => setLocationAddress(e.target.value)}
                        placeholder="Contoh: Jl. RS Fatmawati Raya No. 18"
                        className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Kecamatan / Kelurahan *
                      </label>
                      <input
                        type="text"
                        required
                        value={locationDistrict}
                        onChange={(e) => setLocationDistrict(e.target.value)}
                        placeholder="Contoh: Cilandak"
                        className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Tipe Titik Lokasi
                      </label>
                      <select
                        value={locationType}
                        onChange={(e) => setLocationType(e.target.value as LocationType)}
                        className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                      >
                        <option value="depan_minimarket">Depan Minimarket (Indomaret/Alfamart)</option>
                        <option value="area_kampus_sekolah">Dekat Kampus / Sekolah</option>
                        <option value="foodcourt_mall">Foodcourt Mall</option>
                        <option value="ruko">Ruko / Rukan</option>
                        <option value="pinggir_jalan_raya">Pinggir Jalan Raya</option>
                        <option value="lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Trafik Pejalan Kaki
                      </label>
                      <select
                        value={pedestrianTraffic}
                        onChange={(e) => setPedestrianTraffic(e.target.value as any)}
                        className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                      >
                        <option value="tinggi">Tinggi (&gt;100 orang/jam)</option>
                        <option value="sedang">Sedang (50 - 100 orang/jam)</option>
                        <option value="rendah">Rendah (&lt;50 orang/jam)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Jarak ke Gerai TehKita Terdekat (KM)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={nearestTehKitaDistanceKm}
                        onChange={(e) => setNearestTehKitaDistanceKm(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-200">
                    <label className="flex items-center gap-2 cursor-pointer text-[11px] text-stone-700">
                      <input
                        type="checkbox"
                        checked={hasParkingMotor}
                        onChange={(e) => setHasParkingMotor(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Parkir Motor Tersedia</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[11px] text-stone-700">
                      <input
                        type="checkbox"
                        checked={hasParkingMobil}
                        onChange={(e) => setHasParkingMobil(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Parkir Mobil Tersedia</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[11px] text-stone-700">
                      <input
                        type="checkbox"
                        checked={electricityPowerVa >= 1300}
                        onChange={(e) => setElectricityPowerVa(e.target.checked ? 1300 : 900)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Daya Listrik $\ge$1300W</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[11px] text-stone-700">
                      <input
                        type="checkbox"
                        checked={hasCleanWater}
                        onChange={(e) => setHasCleanWater(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Akses Air Bersih</span>
                    </label>
                  </div>
                </div>

                {/* Live Scoring Result Widget */}
                <div className="bg-emerald-950 text-white rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-xs uppercase tracking-wider text-emerald-200">
                        Indikasi Awal Skor Kecocokan Lokasi
                      </span>
                    </div>
                    <span className="text-xl font-bold font-mono text-emerald-300">
                      {liveScore.score} / 100
                    </span>
                  </div>

                  <div className="text-xs text-emerald-100 flex items-center justify-between">
                    <span>Hasil Evaluasi Algoritma: <strong>{liveScore.verdict}</strong></span>
                    <span className="text-[10px] text-emerald-300">
                      Zonasi: {nearestTehKitaDistanceKm >= 1.5 ? 'Aman (≥1.5 KM)' : 'Beresiko (<1.5 KM)'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Lanjut ke Unggah Dokumen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Document Upload & Revision (PRD Scope 2) */}
        {currentStep === 4 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {isRevisionMode ? 'Unggah Ulang Dokumen Perbaikan' : 'Langkah 4: Unggah Dokumen Pendukung'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {isRevisionMode
                  ? 'Perbaiki dokumen yang ditandai oleh Tim Administrasi TehKita agar verifikasi dapat disetujui.'
                  : 'Unggah foto/scan identitas e-KTP dan bukti kesiapan dana untuk verifikasi resmi.'}
              </p>
            </div>

            {/* Active Revision Alert if revision mode */}
            {isRevisionMode && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Catatan dari Tim TehKita:</strong>
                    <span>Foto KTP sebelumnya buram dan NIK tidak terbaca jelas. Mohon unggah foto e-KTP baru dengan pencahayaan terang dan tegak lurus.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Document 1: KTP */}
            <div className={`border-2 rounded-2xl p-4 text-xs ${
              isRevisionMode ? 'border-amber-400 bg-amber-50/30' : 'border-stone-200 bg-stone-50/50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-stone-900">Foto / Scan e-KTP Asli *</span>
                </div>
                <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-medium">
                  Wajib
                </span>
              </div>

              <div className="bg-white border border-stone-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-800 block">{ktpFileName}</span>
                  <span className="text-[10px] text-stone-400">Ukuran: 1.4 MB · Format: JPG/PNG/PDF</span>
                </div>

                <label className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold px-3 py-1.5 rounded-lg text-xs cursor-pointer flex items-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Ganti File</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setKtpFileName(e.target.files[0].name);
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Document 2: Bukti Kesiapan Dana */}
            <div className="border border-stone-200 bg-stone-50/50 rounded-2xl p-4 text-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-stone-900">
                    Bukti Kesiapan Dana / Rekening Koran / Screenshot Saldo
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 bg-stone-200 px-2 py-0.5 rounded font-medium">
                  Pendukung
                </span>
              </div>

              <div className="bg-white border border-stone-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-800 block">{danaFileName}</span>
                  <span className="text-[10px] text-stone-400">Ukuran: 2.1 MB · Format: PDF/JPG</span>
                </div>

                <label className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold px-3 py-1.5 rounded-lg text-xs cursor-pointer flex items-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Ganti File</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setDanaFileName(e.target.files[0].name);
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Submission Declaration */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-[11px] text-stone-600 leading-relaxed">
              Saya menyatakan bahwa data yang saya masukkan adalah benar dan bersedia mematuhi SOP kemitraan TehKita. Setelah formulir dikirimkan, notifikasi pembaruan status akan dikirimkan otomatis via WhatsApp & Email.
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between pt-4 border-t border-stone-100">
              {!isRevisionMode && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
              )}

              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 px-8 rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer ml-auto"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isRevisionMode ? 'Kirim Ulang Dokumen Perbaikan' : 'Kirim Pengajuan Kemitraan Sekarang'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
