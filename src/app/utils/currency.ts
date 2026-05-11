import type { Language } from '@/app/App';

export type Region =
  // East Africa (Swahili/English)
  | 'TZ' | 'KE' | 'UG' | 'RW' | 'BI' | 'CD'
  // West/Central Africa (French)
  | 'SN' | 'CI' | 'CM' | 'ML' | 'BF' | 'GN' | 'GA' | 'TG' | 'BJ' | 'CG' | 'CF' | 'NE' | 'TD' | 'MG'
  // North Africa (Arabic)
  | 'EG' | 'MA' | 'DZ' | 'TN' | 'LY' | 'SD' | 'MR'
  // Southern/West Africa (English)
  | 'NG' | 'GH' | 'ZA' | 'ZM' | 'ZW' | 'MW' | 'BW' | 'NA'
  // Lusophone Africa (Portuguese)
  | 'AO' | 'MZ' | 'CV' | 'GW' | 'ST';

interface RegionConfig {
  locale: string;
  currency: string;
  symbol: string;
  flag: string;
  nameEn: string;
  nameSw: string;
  nameFr?: string;
  nameAr?: string;
  namePt?: string;
  dailyWarnThreshold: number;
  maxTransactionAmount: number;
  quickAmounts: [number[], number[], number[], number[]];
  goalDefaults: {
    schoolFees: number;
    bills: number;
    emergencyFund: number;
    data: number;
    travel: number;
  };
}

export const REGION_CONFIG: Record<Region, RegionConfig> = {
  // ── East Africa ────────────────────────────────────────────────────────────
  TZ: {
    locale: 'sw-TZ', currency: 'TZS', symbol: 'TSh', flag: '🇹🇿',
    nameEn: 'Tanzania', nameSw: 'Tanzania', nameFr: 'Tanzanie',
    dailyWarnThreshold: 30000, maxTransactionAmount: 99_999_999,
    quickAmounts: [[2000,3000,5000,10000],[3000,5000,8000,15000],[5000,10000,20000,30000],[2000,5000,10000,20000]],
    goalDefaults: { schoolFees: 500000, bills: 200000, emergencyFund: 300000, data: 50000, travel: 1000000 },
  },
  KE: {
    locale: 'en-KE', currency: 'KES', symbol: 'KSh', flag: '🇰🇪',
    nameEn: 'Kenya', nameSw: 'Kenya', nameFr: 'Kenya',
    dailyWarnThreshold: 3000, maxTransactionAmount: 9_999_999,
    quickAmounts: [[50,200,500,1000],[200,500,1000,2000],[500,1000,2000,5000],[200,500,1000,3000]],
    goalDefaults: { schoolFees: 50000, bills: 20000, emergencyFund: 30000, data: 5000, travel: 100000 },
  },
  UG: {
    locale: 'en-UG', currency: 'UGX', symbol: 'USh', flag: '🇺🇬',
    nameEn: 'Uganda', nameSw: 'Uganda', nameFr: 'Ouganda',
    dailyWarnThreshold: 80000, maxTransactionAmount: 999_999_999,
    quickAmounts: [[3000,8000,15000,30000],[5000,10000,20000,50000],[10000,20000,50000,100000],[5000,10000,20000,50000]],
    goalDefaults: { schoolFees: 2000000, bills: 800000, emergencyFund: 1000000, data: 200000, travel: 4000000 },
  },
  RW: {
    locale: 'en-RW', currency: 'RWF', symbol: 'Fr', flag: '🇷🇼',
    nameEn: 'Rwanda', nameSw: 'Rwanda', nameFr: 'Rwanda',
    dailyWarnThreshold: 15000, maxTransactionAmount: 99_999_999,
    quickAmounts: [[500,1000,2000,5000],[1000,2000,5000,10000],[2000,5000,10000,20000],[1000,2000,5000,10000]],
    goalDefaults: { schoolFees: 200000, bills: 80000, emergencyFund: 120000, data: 20000, travel: 400000 },
  },
  BI: {
    locale: 'sw-BI', currency: 'BIF', symbol: 'Fr', flag: '🇧🇮',
    nameEn: 'Burundi', nameSw: 'Burundi', nameFr: 'Burundi',
    dailyWarnThreshold: 50000, maxTransactionAmount: 999_999_999,
    quickAmounts: [[1000,2000,5000,10000],[2000,5000,10000,20000],[5000,10000,20000,50000],[2000,5000,10000,20000]],
    goalDefaults: { schoolFees: 100000, bills: 40000, emergencyFund: 60000, data: 10000, travel: 200000 },
  },
  CD: {
    locale: 'fr-CD', currency: 'CDF', symbol: 'FC', flag: '🇨🇩',
    nameEn: 'DR Congo', nameSw: 'Kongo ya Kidemokrasia', nameFr: 'Congo (RDC)',
    dailyWarnThreshold: 50000, maxTransactionAmount: 999_999_999,
    quickAmounts: [[1000,2000,5000,10000],[2000,5000,10000,20000],[5000,10000,20000,50000],[2000,5000,10000,20000]],
    goalDefaults: { schoolFees: 500000, bills: 200000, emergencyFund: 300000, data: 50000, travel: 1000000 },
  },

  // ── French-speaking West & Central Africa ──────────────────────────────────
  SN: {
    locale: 'fr-SN', currency: 'XOF', symbol: 'CFA', flag: '🇸🇳',
    nameEn: 'Senegal', nameSw: 'Senegali', nameFr: 'Sénégal',
    dailyWarnThreshold: 5000, maxTransactionAmount: 99_999_999,
    quickAmounts: [[500,1000,2000,5000],[1000,2000,5000,10000],[2000,5000,10000,20000],[1000,2000,5000,10000]],
    goalDefaults: { schoolFees: 200000, bills: 80000, emergencyFund: 120000, data: 15000, travel: 400000 },
  },
  CI: {
    locale: 'fr-CI', currency: 'XOF', symbol: 'CFA', flag: '🇨🇮',
    nameEn: "Côte d'Ivoire", nameSw: "Pwani ya Pembe", nameFr: "Côte d'Ivoire",
    dailyWarnThreshold: 5000, maxTransactionAmount: 99_999_999,
    quickAmounts: [[500,1000,2000,5000],[1000,2000,5000,10000],[2000,5000,10000,20000],[1000,2000,5000,10000]],
    goalDefaults: { schoolFees: 200000, bills: 80000, emergencyFund: 120000, data: 15000, travel: 400000 },
  },
  CM: {
    locale: 'fr-CM', currency: 'XAF', symbol: 'FCFA', flag: '🇨🇲',
    nameEn: 'Cameroon', nameSw: 'Kameruni', nameFr: 'Cameroun',
    dailyWarnThreshold: 5000, maxTransactionAmount: 99_999_999,
    quickAmounts: [[500,1000,2000,5000],[1000,2000,5000,10000],[2000,5000,10000,20000],[1000,2000,5000,10000]],
    goalDefaults: { schoolFees: 200000, bills: 80000, emergencyFund: 120000, data: 15000, travel: 400000 },
  },
  ML: {
    locale: 'fr-ML', currency: 'XOF', symbol: 'CFA', flag: '🇲🇱',
    nameEn: 'Mali', nameSw: 'Mali', nameFr: 'Mali',
    dailyWarnThreshold: 5000, maxTransactionAmount: 99_999_999,
    quickAmounts: [[500,1000,2000,5000],[1000,2000,5000,10000],[2000,5000,10000,20000],[1000,2000,5000,10000]],
    goalDefaults: { schoolFees: 150000, bills: 60000, emergencyFund: 90000, data: 12000, travel: 300000 },
  },
  BF: {
    locale: 'fr-BF', currency: 'XOF', symbol: 'CFA', flag: '🇧🇫',
    nameEn: 'Burkina Faso', nameSw: 'Burkina Faso', nameFr: 'Burkina Faso',
    dailyWarnThreshold: 5000, maxTransactionAmount: 99_999_999,
    quickAmounts: [[500,1000,2000,5000],[1000,2000,5000,10000],[2000,5000,10000,20000],[1000,2000,5000,10000]],
    goalDefaults: { schoolFees: 150000, bills: 60000, emergencyFund: 90000, data: 12000, travel: 300000 },
  },
  GN: {
    locale: 'fr-GN', currency: 'GNF', symbol: 'FG', flag: '🇬🇳',
    nameEn: 'Guinea', nameSw: 'Gine', nameFr: 'Guinée',
    dailyWarnThreshold: 50000, maxTransactionAmount: 999_999_999,
    quickAmounts: [[2000,5000,10000,20000],[5000,10000,20000,50000],[10000,20000,50000,100000],[5000,10000,20000,50000]],
    goalDefaults: { schoolFees: 2000000, bills: 800000, emergencyFund: 1200000, data: 150000, travel: 4000000 },
  },
  GA: {
    locale: 'fr-GA', currency: 'XAF', symbol: 'FCFA', flag: '🇬🇦',
    nameEn: 'Gabon', nameSw: 'Gabon', nameFr: 'Gabon',
    dailyWarnThreshold: 10000, maxTransactionAmount: 99_999_999,
    quickAmounts: [[1000,2000,5000,10000],[2000,5000,10000,20000],[5000,10000,20000,50000],[2000,5000,10000,20000]],
    goalDefaults: { schoolFees: 300000, bills: 120000, emergencyFund: 180000, data: 20000, travel: 600000 },
  },
  TG: {
    locale: 'fr-TG', currency: 'XOF', symbol: 'CFA', flag: '🇹🇬',
    nameEn: 'Togo', nameSw: 'Togo', nameFr: 'Togo',
    dailyWarnThreshold: 5000, maxTransactionAmount: 99_999_999,
    quickAmounts: [[500,1000,2000,5000],[1000,2000,5000,10000],[2000,5000,10000,20000],[1000,2000,5000,10000]],
    goalDefaults: { schoolFees: 150000, bills: 60000, emergencyFund: 90000, data: 12000, travel: 300000 },
  },
  BJ: {
    locale: 'fr-BJ', currency: 'XOF', symbol: 'CFA', flag: '🇧🇯',
    nameEn: 'Benin', nameSw: 'Benin', nameFr: 'Bénin',
    dailyWarnThreshold: 5000, maxTransactionAmount: 99_999_999,
    quickAmounts: [[500,1000,2000,5000],[1000,2000,5000,10000],[2000,5000,10000,20000],[1000,2000,5000,10000]],
    goalDefaults: { schoolFees: 150000, bills: 60000, emergencyFund: 90000, data: 12000, travel: 300000 },
  },
  CG: {
    locale: 'fr-CG', currency: 'XAF', symbol: 'FCFA', flag: '🇨🇬',
    nameEn: 'Republic of Congo', nameSw: 'Kongo', nameFr: 'Congo',
    dailyWarnThreshold: 10000, maxTransactionAmount: 99_999_999,
    quickAmounts: [[1000,2000,5000,10000],[2000,5000,10000,20000],[5000,10000,20000,50000],[2000,5000,10000,20000]],
    goalDefaults: { schoolFees: 200000, bills: 80000, emergencyFund: 120000, data: 15000, travel: 400000 },
  },
  CF: {
    locale: 'fr-CF', currency: 'XAF', symbol: 'FCFA', flag: '🇨🇫',
    nameEn: 'Central African Republic', nameSw: 'Afrika ya Kati', nameFr: 'RCA',
    dailyWarnThreshold: 10000, maxTransactionAmount: 99_999_999,
    quickAmounts: [[1000,2000,5000,10000],[2000,5000,10000,20000],[5000,10000,20000,50000],[2000,5000,10000,20000]],
    goalDefaults: { schoolFees: 150000, bills: 60000, emergencyFund: 90000, data: 12000, travel: 300000 },
  },
  NE: {
    locale: 'fr-NE', currency: 'XOF', symbol: 'CFA', flag: '🇳🇪',
    nameEn: 'Niger', nameSw: 'Nijeri', nameFr: 'Niger',
    dailyWarnThreshold: 5000, maxTransactionAmount: 99_999_999,
    quickAmounts: [[500,1000,2000,5000],[1000,2000,5000,10000],[2000,5000,10000,20000],[1000,2000,5000,10000]],
    goalDefaults: { schoolFees: 150000, bills: 60000, emergencyFund: 90000, data: 12000, travel: 300000 },
  },
  TD: {
    locale: 'fr-TD', currency: 'XAF', symbol: 'FCFA', flag: '🇹🇩',
    nameEn: 'Chad', nameSw: 'Chad', nameFr: 'Tchad',
    dailyWarnThreshold: 10000, maxTransactionAmount: 99_999_999,
    quickAmounts: [[1000,2000,5000,10000],[2000,5000,10000,20000],[5000,10000,20000,50000],[2000,5000,10000,20000]],
    goalDefaults: { schoolFees: 150000, bills: 60000, emergencyFund: 90000, data: 12000, travel: 300000 },
  },
  MG: {
    locale: 'fr-MG', currency: 'MGA', symbol: 'Ar', flag: '🇲🇬',
    nameEn: 'Madagascar', nameSw: 'Madagaska', nameFr: 'Madagascar',
    dailyWarnThreshold: 100000, maxTransactionAmount: 999_999_999,
    quickAmounts: [[5000,10000,20000,50000],[10000,20000,50000,100000],[20000,50000,100000,200000],[10000,20000,50000,100000]],
    goalDefaults: { schoolFees: 1000000, bills: 400000, emergencyFund: 600000, data: 80000, travel: 2000000 },
  },

  // ── North Africa (Arabic-speaking) ─────────────────────────────────────────
  EG: {
    locale: 'ar-EG', currency: 'EGP', symbol: 'E£', flag: '🇪🇬',
    nameEn: 'Egypt', nameSw: 'Misri', nameFr: 'Égypte', nameAr: 'مصر',
    dailyWarnThreshold: 500, maxTransactionAmount: 9_999_999,
    quickAmounts: [[20,50,100,200],[50,100,200,500],[100,200,500,1000],[50,100,200,500]],
    goalDefaults: { schoolFees: 5000, bills: 2000, emergencyFund: 3000, data: 500, travel: 10000 },
  },
  MA: {
    locale: 'ar-MA', currency: 'MAD', symbol: 'MAD', flag: '🇲🇦',
    nameEn: 'Morocco', nameSw: 'Moroko', nameFr: 'Maroc', nameAr: 'المغرب',
    dailyWarnThreshold: 300, maxTransactionAmount: 9_999_999,
    quickAmounts: [[10,20,50,100],[20,50,100,200],[50,100,200,500],[20,50,100,200]],
    goalDefaults: { schoolFees: 3000, bills: 1200, emergencyFund: 1800, data: 200, travel: 6000 },
  },
  DZ: {
    locale: 'ar-DZ', currency: 'DZD', symbol: 'DA', flag: '🇩🇿',
    nameEn: 'Algeria', nameSw: 'Aljeria', nameFr: 'Algérie', nameAr: 'الجزائر',
    dailyWarnThreshold: 1000, maxTransactionAmount: 9_999_999,
    quickAmounts: [[100,200,500,1000],[200,500,1000,2000],[500,1000,2000,5000],[200,500,1000,2000]],
    goalDefaults: { schoolFees: 30000, bills: 12000, emergencyFund: 18000, data: 2000, travel: 60000 },
  },
  TN: {
    locale: 'ar-TN', currency: 'TND', symbol: 'DT', flag: '🇹🇳',
    nameEn: 'Tunisia', nameSw: 'Tunisia', nameFr: 'Tunisie', nameAr: 'تونس',
    dailyWarnThreshold: 100, maxTransactionAmount: 999_999,
    quickAmounts: [[5,10,20,50],[10,20,50,100],[20,50,100,200],[10,20,50,100]],
    goalDefaults: { schoolFees: 1500, bills: 600, emergencyFund: 900, data: 100, travel: 3000 },
  },
  LY: {
    locale: 'ar-LY', currency: 'LYD', symbol: 'LD', flag: '🇱🇾',
    nameEn: 'Libya', nameSw: 'Libya', nameFr: 'Libye', nameAr: 'ليبيا',
    dailyWarnThreshold: 100, maxTransactionAmount: 999_999,
    quickAmounts: [[5,10,20,50],[10,20,50,100],[20,50,100,200],[10,20,50,100]],
    goalDefaults: { schoolFees: 1000, bills: 400, emergencyFund: 600, data: 80, travel: 2000 },
  },
  SD: {
    locale: 'ar-SD', currency: 'SDG', symbol: 'SDG', flag: '🇸🇩',
    nameEn: 'Sudan', nameSw: 'Sudan', nameFr: 'Soudan', nameAr: 'السودان',
    dailyWarnThreshold: 50000, maxTransactionAmount: 999_999_999,
    quickAmounts: [[2000,5000,10000,20000],[5000,10000,20000,50000],[10000,20000,50000,100000],[5000,10000,20000,50000]],
    goalDefaults: { schoolFees: 500000, bills: 200000, emergencyFund: 300000, data: 40000, travel: 1000000 },
  },
  MR: {
    locale: 'ar-MR', currency: 'MRU', symbol: 'UM', flag: '🇲🇷',
    nameEn: 'Mauritania', nameSw: 'Muritania', nameFr: 'Mauritanie', nameAr: 'موريتانيا',
    dailyWarnThreshold: 5000, maxTransactionAmount: 99_999_999,
    quickAmounts: [[200,500,1000,2000],[500,1000,2000,5000],[1000,2000,5000,10000],[500,1000,2000,5000]],
    goalDefaults: { schoolFees: 100000, bills: 40000, emergencyFund: 60000, data: 8000, travel: 200000 },
  },

  // ── English-speaking (non-East Africa) ─────────────────────────────────────
  NG: {
    locale: 'en-NG', currency: 'NGN', symbol: '₦', flag: '🇳🇬',
    nameEn: 'Nigeria', nameSw: 'Nigeria', nameFr: 'Nigéria',
    dailyWarnThreshold: 20000, maxTransactionAmount: 999_999_999,
    quickAmounts: [[500,1000,2000,5000],[1000,2000,5000,10000],[2000,5000,10000,20000],[1000,2000,5000,10000]],
    goalDefaults: { schoolFees: 500000, bills: 200000, emergencyFund: 300000, data: 30000, travel: 1000000 },
  },
  GH: {
    locale: 'en-GH', currency: 'GHS', symbol: 'GH₵', flag: '🇬🇭',
    nameEn: 'Ghana', nameSw: 'Ghana', nameFr: 'Ghana',
    dailyWarnThreshold: 200, maxTransactionAmount: 9_999_999,
    quickAmounts: [[10,20,50,100],[20,50,100,200],[50,100,200,500],[20,50,100,200]],
    goalDefaults: { schoolFees: 3000, bills: 1200, emergencyFund: 1800, data: 200, travel: 6000 },
  },
  ZA: {
    locale: 'en-ZA', currency: 'ZAR', symbol: 'R', flag: '🇿🇦',
    nameEn: 'South Africa', nameSw: 'Afrika Kusini', nameFr: 'Afrique du Sud',
    dailyWarnThreshold: 500, maxTransactionAmount: 9_999_999,
    quickAmounts: [[20,50,100,200],[50,100,200,500],[100,200,500,1000],[50,100,200,500]],
    goalDefaults: { schoolFees: 10000, bills: 4000, emergencyFund: 6000, data: 600, travel: 20000 },
  },
  ZM: {
    locale: 'en-ZM', currency: 'ZMW', symbol: 'ZK', flag: '🇿🇲',
    nameEn: 'Zambia', nameSw: 'Zambia', nameFr: 'Zambie',
    dailyWarnThreshold: 1000, maxTransactionAmount: 9_999_999,
    quickAmounts: [[50,100,200,500],[100,200,500,1000],[200,500,1000,2000],[100,200,500,1000]],
    goalDefaults: { schoolFees: 10000, bills: 4000, emergencyFund: 6000, data: 800, travel: 20000 },
  },
  ZW: {
    locale: 'en-ZW', currency: 'ZWL', symbol: 'Z$', flag: '🇿🇼',
    nameEn: 'Zimbabwe', nameSw: 'Zimbabwe', nameFr: 'Zimbabwe',
    dailyWarnThreshold: 500, maxTransactionAmount: 9_999_999,
    quickAmounts: [[20,50,100,200],[50,100,200,500],[100,200,500,1000],[50,100,200,500]],
    goalDefaults: { schoolFees: 5000, bills: 2000, emergencyFund: 3000, data: 400, travel: 10000 },
  },
  MW: {
    locale: 'en-MW', currency: 'MWK', symbol: 'MK', flag: '🇲🇼',
    nameEn: 'Malawi', nameSw: 'Malawi', nameFr: 'Malawi',
    dailyWarnThreshold: 20000, maxTransactionAmount: 999_999_999,
    quickAmounts: [[500,1000,2000,5000],[1000,2000,5000,10000],[2000,5000,10000,20000],[1000,2000,5000,10000]],
    goalDefaults: { schoolFees: 300000, bills: 120000, emergencyFund: 180000, data: 20000, travel: 600000 },
  },
  BW: {
    locale: 'en-BW', currency: 'BWP', symbol: 'P', flag: '🇧🇼',
    nameEn: 'Botswana', nameSw: 'Botswana', nameFr: 'Botswana',
    dailyWarnThreshold: 200, maxTransactionAmount: 9_999_999,
    quickAmounts: [[10,20,50,100],[20,50,100,200],[50,100,200,500],[20,50,100,200]],
    goalDefaults: { schoolFees: 5000, bills: 2000, emergencyFund: 3000, data: 300, travel: 10000 },
  },
  NA: {
    locale: 'en-NA', currency: 'NAD', symbol: 'N$', flag: '🇳🇦',
    nameEn: 'Namibia', nameSw: 'Namibia', nameFr: 'Namibie',
    dailyWarnThreshold: 300, maxTransactionAmount: 9_999_999,
    quickAmounts: [[10,30,50,100],[30,50,100,200],[50,100,200,500],[30,50,100,200]],
    goalDefaults: { schoolFees: 6000, bills: 2400, emergencyFund: 3600, data: 400, travel: 12000 },
  },

  // ── Lusophone Africa (Portuguese) ──────────────────────────────────────────
  AO: {
    locale: 'pt-AO', currency: 'AOA', symbol: 'Kz', flag: '🇦🇴',
    nameEn: 'Angola', nameSw: 'Angola', nameFr: 'Angola', namePt: 'Angola',
    dailyWarnThreshold: 50000, maxTransactionAmount: 999_999_999,
    quickAmounts: [[1000,2000,5000,10000],[2000,5000,10000,20000],[5000,10000,20000,50000],[2000,5000,10000,20000]],
    goalDefaults: { schoolFees: 500000, bills: 200000, emergencyFund: 300000, data: 40000, travel: 1000000 },
  },
  MZ: {
    locale: 'pt-MZ', currency: 'MZN', symbol: 'MT', flag: '🇲🇿',
    nameEn: 'Mozambique', nameSw: 'Msumbiji', nameFr: 'Mozambique', namePt: 'Moçambique',
    dailyWarnThreshold: 5000, maxTransactionAmount: 99_999_999,
    quickAmounts: [[200,500,1000,2000],[500,1000,2000,5000],[1000,2000,5000,10000],[500,1000,2000,5000]],
    goalDefaults: { schoolFees: 100000, bills: 40000, emergencyFund: 60000, data: 8000, travel: 200000 },
  },
  CV: {
    locale: 'pt-CV', currency: 'CVE', symbol: '$', flag: '🇨🇻',
    nameEn: 'Cape Verde', nameSw: 'Kepuvede', nameFr: 'Cap-Vert', namePt: 'Cabo Verde',
    dailyWarnThreshold: 2000, maxTransactionAmount: 9_999_999,
    quickAmounts: [[100,200,500,1000],[200,500,1000,2000],[500,1000,2000,5000],[200,500,1000,2000]],
    goalDefaults: { schoolFees: 30000, bills: 12000, emergencyFund: 18000, data: 2000, travel: 60000 },
  },
  GW: {
    locale: 'pt-GW', currency: 'XOF', symbol: 'CFA', flag: '🇬🇼',
    nameEn: 'Guinea-Bissau', nameSw: 'Gine-Bisau', nameFr: 'Guinée-Bissau', namePt: 'Guiné-Bissau',
    dailyWarnThreshold: 5000, maxTransactionAmount: 99_999_999,
    quickAmounts: [[500,1000,2000,5000],[1000,2000,5000,10000],[2000,5000,10000,20000],[1000,2000,5000,10000]],
    goalDefaults: { schoolFees: 150000, bills: 60000, emergencyFund: 90000, data: 12000, travel: 300000 },
  },
  ST: {
    locale: 'pt-ST', currency: 'STN', symbol: 'Db', flag: '🇸🇹',
    nameEn: 'São Tomé & Príncipe', nameSw: 'Sao Tome na Principe', nameFr: 'São Tomé-et-Príncipe', namePt: 'São Tomé e Príncipe',
    dailyWarnThreshold: 5000, maxTransactionAmount: 99_999_999,
    quickAmounts: [[200,500,1000,2000],[500,1000,2000,5000],[1000,2000,5000,10000],[500,1000,2000,5000]],
    goalDefaults: { schoolFees: 100000, bills: 40000, emergencyFund: 60000, data: 8000, travel: 200000 },
  },
};

/** Countries associated with each language (ordered by user population / relevance) */
export const LANGUAGE_REGIONS: Record<Language, Region[]> = {
  sw: ['TZ', 'KE', 'UG', 'RW', 'BI', 'CD'],
  en: ['NG', 'ZA', 'GH', 'KE', 'TZ', 'UG', 'RW', 'ZM', 'ZW', 'MW', 'BW', 'NA', 'BI'],
  fr: ['CD', 'CM', 'CI', 'SN', 'MG', 'BF', 'ML', 'GN', 'TG', 'NE', 'BJ', 'GA', 'CG', 'CF', 'TD', 'RW', 'BI'],
  ar: ['EG', 'DZ', 'MA', 'SD', 'TN', 'LY', 'MR'],
  pt: ['AO', 'MZ', 'CV', 'GW', 'ST'],
};

export function getRegionName(code: Region, lang: Language): string {
  const cfg = REGION_CONFIG[code];
  if (lang === 'fr' && cfg.nameFr) return cfg.nameFr;
  if (lang === 'ar' && cfg.nameAr) return cfg.nameAr;
  if (lang === 'pt' && cfg.namePt) return cfg.namePt;
  if (lang === 'sw') return cfg.nameSw;
  return cfg.nameEn;
}

export function formatCurrency(amount: number, region: Region): string {
  const cfg = REGION_CONFIG[region];
  try {
    return new Intl.NumberFormat(cfg.locale, {
      style: 'currency',
      currency: cfg.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${cfg.symbol} ${amount.toLocaleString()}`;
  }
}

export function formatCurrencyShort(amount: number, region: Region): string {
  const { symbol } = REGION_CONFIG[region];
  if (amount >= 1_000_000) return `${symbol} ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${symbol} ${(amount / 1_000).toFixed(0)}K`;
  return `${symbol} ${amount}`;
}
