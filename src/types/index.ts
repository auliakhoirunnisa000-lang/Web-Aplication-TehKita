export type FranchisePackageId = 'booth_reguler' | 'booth_kontainer' | 'cafe_mini';

export interface FranchisePackage {
  id: FranchisePackageId;
  name: string;
  tagline: string;
  price: number;
  popular?: boolean;
  boothDimensions: string;
  equipment: string[];
  initialIngredientsCount: number; // e.g. 500 cups
  estimatedRoiMonths: string;
  recommendedDailySales: number;
  description: string;
}

export type ApplicationStage = 
  | 'pengajuan_baru' 
  | 'verifikasi_dokumen' 
  | 'evaluasi_lokasi' 
  | 'menunggu_lokasi' 
  | 'penyusunan_proposal' 
  | 'negosiasi_proposal' 
  | 'disetujui' 
  | 'ditolak';

export type LocationType = 
  | 'ruko' 
  | 'depan_minimarket' 
  | 'foodcourt_mall' 
  | 'area_kampus_sekolah' 
  | 'pinggir_jalan_raya' 
  | 'lainnya';

export interface LocationData {
  hasLocation: boolean;
  address?: string;
  city?: string;
  district?: string;
  locationType?: LocationType;
  pedestrianTraffic?: 'tinggi' | 'sedang' | 'rendah';
  vehicleTraffic?: 'tinggi' | 'sedang' | 'rendah';
  hasParkingMotor?: boolean;
  hasParkingMobil?: boolean;
  nearestTehKitaDistanceKm?: number; // e.g. 2.4 km
  electricityPowerVa?: number; // e.g. 1300
  hasCleanWater?: boolean;
  photoUrl?: string;
  score?: number; // 0 - 100
  scoreDetails?: {
    trafficScore: number;
    accessibilityScore: number;
    zonasiScore: number;
    facilityScore: number;
    verdict: 'Sangat Direkomendasikan' | 'Layak Bersyarat' | 'Beresiko / Perlu Lokasi Lain';
    notes: string[];
  };
}

export interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: 'valid' | 'perlu_perbaikan' | 'menunggu_verifikasi';
  revisionNote?: string;
  fileUrl?: string;
}

export interface ProposalClause {
  title: string;
  description: string;
}

export interface ProposalData {
  id: string;
  version: number;
  issuedDate: string;
  packageId: FranchisePackageId;
  packageName: string;
  totalInvestment: number;
  paymentTerms: string;
  exclusiveRadiusKm: number;
  rawMaterialSupplyTerm: string;
  royaltyFeeMonthly: number; // 0
  estimatedDailyCups: number;
  estimatedNetProfitMonthly: number;
  estimatedBepMonths: number;
  clauses: ProposalClause[];
  status: 'draft' | 'menunggu_review_calon' | 'revisi_diminta' | 'disetujui' | 'ditolak';
  franchisorNotes?: string;
  candidateRevisionRequest?: {
    date: string;
    notes: string;
    requestedAdjustment: string;
  };
  rejectionReason?: string;
}

export interface Applicant {
  id: string;
  registrationNumber: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  occupation: string;
  createdAt: string;
  lastUpdatedAt: string;
  selectedPackageId: FranchisePackageId;
  allocatedBudget: number;
  hasFnbExperience: boolean;
  fnbExperienceDetail?: string;
  location: LocationData;
  documents: DocumentItem[];
  stage: ApplicationStage;
  stageHistory: {
    stage: ApplicationStage;
    timestamp: string;
    note: string;
  }[];
  requestedAction?: {
    type: 'revisi_dokumen' | 'ajukan_lokasi' | 'review_proposal' | 'tunggu_evaluasi';
    title: string;
    instruction: string;
    targetDeadline?: string;
  };
  rejectionInfo?: {
    date: string;
    reasonCategory: string;
    details: string;
  };
  proposals: ProposalData[];
  currentProposalId?: string;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  channel: 'whatsapp' | 'email';
  title: string;
  content: string;
  linkText?: string;
  targetView?: 'tracker' | 'form' | 'proposal' | 'location_guide';
  applicantName: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  actionChips?: {
    label: string;
    action: string;
  }[];
}

export interface RegistrationDraft {
  step: number;
  lastSavedAt: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  occupation: string;
  selectedPackageId: FranchisePackageId;
  allocatedBudget: number;
  hasFnbExperience: boolean;
  fnbExperienceDetail?: string;
  hasLocation: boolean;
  locationAddress: string;
  locationDistrict: string;
  locationType: LocationType;
  pedestrianTraffic: 'tinggi' | 'sedang' | 'rendah';
  vehicleTraffic: 'tinggi' | 'sedang' | 'rendah';
  hasParkingMotor: boolean;
  hasParkingMobil: boolean;
  nearestTehKitaDistanceKm: number;
  electricityPowerVa: number;
  hasCleanWater: boolean;
  ktpFileName: string;
  danaFileName: string;
  lokasiFileName: string;
}
