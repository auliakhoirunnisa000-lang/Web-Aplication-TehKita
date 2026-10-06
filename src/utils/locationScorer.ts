import { LocationData } from '../types';

export function calculateLocationScore(loc: Partial<LocationData>): {
  score: number;
  trafficScore: number;
  accessibilityScore: number;
  zonasiScore: number;
  facilityScore: number;
  verdict: 'Sangat Direkomendasikan' | 'Layak Bersyarat' | 'Beresiko / Perlu Lokasi Lain';
  notes: string[];
} {
  let traffic = 0;
  let accessibility = 0;
  let zonasi = 0;
  let facility = 0;
  const notes: string[] = [];

  // 1. Traffic calculation (max 35)
  if (loc.pedestrianTraffic === 'tinggi') traffic += 25;
  else if (loc.pedestrianTraffic === 'sedang') traffic += 18;
  else traffic += 8;

  if (loc.vehicleTraffic === 'tinggi') traffic += 10;
  else if (loc.vehicleTraffic === 'sedang') traffic += 7;
  else traffic += 3;

  // 2. Type & Accessibility (max 30)
  if (loc.locationType === 'depan_minimarket') {
    accessibility += 15;
    notes.push('Lokasi depan minimarket memiliki arus konsumen impulse buying harian sangat baik.');
  } else if (loc.locationType === 'area_kampus_sekolah') {
    accessibility += 15;
    notes.push('Lokasi area edukasi/kampus sangat sesuai dengan demografi konsumen TehKita.');
  } else if (loc.locationType === 'foodcourt_mall') {
    accessibility += 13;
    notes.push('Trafik mall stabil dengan daya beli memadai.');
  } else if (loc.locationType === 'ruko') {
    accessibility += 10;
    notes.push('Ruko memberikan ruang display luas namun butuh strategi visibilitas etalase.');
  } else {
    accessibility += 8;
  }

  if (loc.hasParkingMotor) {
    accessibility += 10;
  } else {
    notes.push('Perhatian: Tidak adanya parkir motor dapat mengurangi pembelian take-away ojek online.');
  }
  if (loc.hasParkingMobil) accessibility += 5;

  // 3. Zonasi / Perlindungan Wilayah (max 25, penalty if clash)
  const dist = loc.nearestTehKitaDistanceKm ?? 3.0;
  if (dist >= 2.5) {
    zonasi += 25;
    notes.push(`Zonasi aman: Jarak ${dist.toFixed(1)} km jauh dari batas proteksi (min. 1.5 km).`);
  } else if (dist >= 1.5) {
    zonasi += 20;
    notes.push(`Zonasi memenuhi syarat proteksi wilayah TehKita (${dist.toFixed(1)} km).`);
  } else if (dist >= 1.0) {
    zonasi += 5;
    notes.push(`Peringatan Zonasi: Jarak ${dist.toFixed(1)} km mendekati batas mitra eksisting (min 1.5 km).`);
  } else {
    zonasi -= 15;
    notes.push(`Konflik Zonasi: Jarak ${dist.toFixed(1)} km melanggar radius perlindungan eksklusif mitra aktif.`);
  }

  // 4. Fasilitas Listrik & Air (max 10)
  const power = loc.electricityPowerVa ?? 900;
  if (power >= 1300) {
    facility += 5;
  } else if (power >= 900) {
    facility += 3;
    notes.push('Daya 900W mencukupi untuk mesin cup sealer dan chiller mini, disarankan tambah daya ke 1300W.');
  } else {
    notes.push('Daya listrik di bawah 900W berisiko kelebihan beban saat operasional chiller & sealer.');
  }

  if (loc.hasCleanWater) {
    facility += 5;
  } else {
    notes.push('Perhatian: Sumber air bersih mutlak disiapkan untuk proses seduh dan sanitasi.');
  }

  const rawScore = traffic + accessibility + zonasi + facility;
  const score = Math.max(10, Math.min(98, rawScore));

  let verdict: 'Sangat Direkomendasikan' | 'Layak Bersyarat' | 'Beresiko / Perlu Lokasi Lain';
  if (score >= 75 && (loc.nearestTehKitaDistanceKm ?? 3) >= 1.5) {
    verdict = 'Sangat Direkomendasikan';
  } else if (score >= 55) {
    verdict = 'Layak Bersyarat';
  } else {
    verdict = 'Beresiko / Perlu Lokasi Lain';
  }

  return {
    score,
    trafficScore: Math.min(35, traffic),
    accessibilityScore: Math.min(30, accessibility),
    zonasiScore: Math.max(0, Math.min(25, zonasi)),
    facilityScore: Math.min(10, facility),
    verdict,
    notes,
  };
}
