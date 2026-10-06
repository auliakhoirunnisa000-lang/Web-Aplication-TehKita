import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  ShieldAlert, 
  Zap, 
  Droplet, 
  Users, 
  Car, 
  CheckCircle, 
  Send,
  Building2,
  Sparkles
} from 'lucide-react';
import { LocationData, LocationType } from '../types';
import { calculateLocationScore } from '../utils/locationScorer';

interface LocationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitProposedLocation?: (location: LocationData) => void;
  isSubmissionMode?: boolean;
}

export const LocationGuideModal: React.FC<LocationGuideModalProps> = ({
  isOpen,
  onClose,
  onSubmitProposedLocation,
  isSubmissionMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'criteria' | 'propose'>(
    isSubmissionMode ? 'propose' : 'criteria'
  );

  // Proposed location form state
  const [address, setAddress] = useState('Jl. Manyar Kertoarjo No. 55');
  const [city, setCity] = useState('Surabaya');
  const [district, setDistrict] = useState('Sukolilo');
  const [locationType, setLocationType] = useState<LocationType>('depan_minimarket');
  const [pedestrianTraffic, setPedestrianTraffic] = useState<'tinggi' | 'sedang' | 'rendah'>('tinggi');
  const [vehicleTraffic, setVehicleTraffic] = useState<'tinggi' | 'sedang' | 'rendah'>('tinggi');
  const [hasParkingMotor, setHasParkingMotor] = useState(true);
  const [hasParkingMobil, setHasParkingMobil] = useState(true);
  const [distanceKm, setDistanceKm] = useState(2.3);
  const [electricityPowerVa, setElectricityPowerVa] = useState(1300);
  const [hasCleanWater, setHasCleanWater] = useState(true);

  if (!isOpen) return null;

  // Real-time calculation
  const previewScore = calculateLocationScore({
    locationType,
    pedestrianTraffic,
    vehicleTraffic,
    hasParkingMotor,
    hasParkingMobil,
    nearestTehKitaDistanceKm: distanceKm,
    electricityPowerVa,
    hasCleanWater,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmitProposedLocation) return;

    const locData: LocationData = {
      hasLocation: true,
      address,
      city,
      district,
      locationType,
      pedestrianTraffic,
      vehicleTraffic,
      hasParkingMotor,
      hasParkingMobil,
      nearestTehKitaDistanceKm: distanceKm,
      electricityPowerVa,
      hasCleanWater,
      score: previewScore.score,
      scoreDetails: previewScore,
    };

    onSubmitProposedLocation(locData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base tracking-tight">
                Panduan & Evaluasi Lokasi TehKita
              </h3>
              <span className="text-[10px] bg-emerald-700 text-emerald-100 px-2 py-0.5 rounded font-medium">
                Scope 3 PRD
              </span>
            </div>
            <p className="text-xs text-emerald-200">
              Standar kelayakan lokasi terukur & simulasi skor berbasis aturan
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-100 p-2 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('criteria')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'criteria'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Kriteria Lokasi Ideal (SOP)</span>
          </button>
          <button
            onClick={() => setActiveTab('propose')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'propose'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Kirim Usulan & Hitung Skor</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'criteria' ? (
            <div className="space-y-6 text-xs text-stone-700">
              {/* Introduction Card */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="font-bold text-sm text-emerald-900 mb-1">
                  Mengapa Evaluasi Lokasi TehKita Terstandarisasi?
                </h4>
                <p className="leading-relaxed text-emerald-800">
                  Untuk menghindari kegagalan operasional dan survei manual tanpa kepastian, TehKita menetapkan 4 pilar kelayakan yang wajib dipenuhi sebelum gerai dibuka.
                </p>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/60">
                  <div className="flex items-center gap-2 font-bold text-stone-900 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <Users className="w-4 h-4" />
                    </div>
                    <span>1. Kepadatan Trafik Pelanggan</span>
                  </div>
                  <ul className="space-y-1.5 text-stone-600 pl-2">
                    <li>• Arus pejalan kaki minimal 100 orang per jam pada jam sibuk.</li>
                    <li>• Sangat disarankan pelataran minimarket (Indomaret/Alfamart) atau area kampus.</li>
                    <li>• Visibilitas pandangan dari jalan tanpa tertutup pohon/tiang.</li>
                  </ul>
                </div>

                <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/60">
                  <div className="flex items-center gap-2 font-bold text-stone-900 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                      <Car className="w-4 h-4" />
                    </div>
                    <span>2. Aksesibilitas & Parkir</span>
                  </div>
                  <ul className="space-y-1.5 text-stone-600 pl-2">
                    <li>• Wajib memiliki area parkir motor yang aman untuk konsumen drive-in & ojek online.</li>
                    <li>• Kemudahan akses keluar-masuk tanpa memicu kemacetan parah.</li>
                  </ul>
                </div>

                <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/60">
                  <div className="flex items-center gap-2 font-bold text-stone-900 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <span>3. Proteksi Zonasi Wilayah (Radius 1.5 KM)</span>
                  </div>
                  <ul className="space-y-1.5 text-stone-600 pl-2">
                    <li>• Jarak minimal 1.5 km dari gerai TehKita aktif terdekat.</li>
                    <li>• Melindungi potensi omzet setiap mitra agar tidak terjadi kanibalisasi pasar internal.</li>
                  </ul>
                </div>

                <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/60">
                  <div className="flex items-center gap-2 font-bold text-stone-900 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span>4. Utilitas Listrik & Sanitasi Air</span>
                  </div>
                  <ul className="space-y-1.5 text-stone-600 pl-2">
                    <li>• Daya listrik minimal 900 Watt (disarankan 1.300 Watt) untuk operasional mesin cup sealer dan cooler.</li>
                    <li>• Sumber air bersih atau galon sanitasi yang higienis.</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveTab('propose')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 px-5 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Saya Sudah Punya Kandidat Lokasi (Hitung Skor)</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Proposal Form with Live Rule-Based Scoring Engine */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs space-y-4">
                <h4 className="font-bold text-stone-900 text-sm">
                  Masukkan Data Kandidat Lokasi Anda
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Alamat / Nama Jalan
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Contoh: Jl. Manyar Kertoarjo No. 55"
                      className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Kota & Kecamatan
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Kota"
                        className="bg-white border border-stone-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        required
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="Kecamatan"
                        className="bg-white border border-stone-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Tipe Titik Lokasi
                    </label>
                    <select
                      value={locationType}
                      onChange={(e) => setLocationType(e.target.value as LocationType)}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                    >
                      <option value="depan_minimarket">Depan Minimarket (Indomaret/Alfamart)</option>
                      <option value="area_kampus_sekolah">Dekat Kampus / Sekolah</option>
                      <option value="foodcourt_mall">Foodcourt / Mall</option>
                      <option value="ruko">Ruko / Rukan Komersial</option>
                      <option value="pinggir_jalan_raya">Tepi Jalan Raya</option>
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
                      className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                    >
                      <option value="tinggi">Tinggi (&gt;100 orang/jam)</option>
                      <option value="sedang">Sedang (50 - 100 orang/jam)</option>
                      <option value="rendah">Rendah (&lt;50 orang/jam)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Perkiraan Jarak ke Outlet TehKita (KM)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="20"
                      value={distanceKm}
                      onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-stone-200">
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

              {/* Real-time Rule-Based Scoring Engine Preview Result */}
              <div className="bg-white border-2 border-emerald-600/30 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">
                      Hasil Simulasi Skor Kecocokan Lokasi:
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        previewScore.verdict === 'Sangat Direkomendasikan'
                          ? 'bg-emerald-100 text-emerald-800'
                          : previewScore.verdict === 'Layak Bersyarat'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {previewScore.verdict}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-700 font-mono">
                      {previewScore.score}
                    </span>
                    <span className="text-xs text-stone-400"> / 100</span>
                  </div>
                </div>

                {/* Breakdown sub-scores */}
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-stone-600 pt-2 border-t border-stone-100">
                  <div className="bg-stone-50 p-2 rounded">
                    <div className="font-bold text-stone-800">{previewScore.trafficScore}/35</div>
                    <div>Trafik Pelanggan</div>
                  </div>
                  <div className="bg-stone-50 p-2 rounded">
                    <div className="font-bold text-stone-800">{previewScore.accessibilityScore}/30</div>
                    <div>Akses & Parkir</div>
                  </div>
                  <div className="bg-stone-50 p-2 rounded">
                    <div className="font-bold text-stone-800">{previewScore.zonasiScore}/25</div>
                    <div>Zonasi Radius</div>
                  </div>
                  <div className="bg-stone-50 p-2 rounded">
                    <div className="font-bold text-stone-800">{previewScore.facilityScore}/10</div>
                    <div>Utilitas Listrik/Air</div>
                  </div>
                </div>

                {/* Rule Analysis Notes */}
                {previewScore.notes.length > 0 && (
                  <div className="bg-stone-50 p-2.5 rounded-lg text-[11px] text-stone-700 space-y-1">
                    {previewScore.notes.map((n, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{n}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xl cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2 px-5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Usulan Lokasi ke Tim TehKita</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
