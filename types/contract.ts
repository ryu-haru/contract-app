export type ContractType = 'gyomu-itaku' | 'nda' | 'torihiki-kihon' | 'gyomu-teikei' | 'baibai'

export interface ContractTypeMeta {
  id: ContractType
  title: string
  description: string
  icon: string
  party1Label: string
  party2Label: string
}

export interface CommonFields {
  party1Name: string
  party1Rep: string
  party2Name: string
  party2Rep: string
  startDate: string
  endDate: string
  autoRenew: boolean
  renewalNotice: string
  jurisdiction: string
  signDate: string
}

export type FeeType = 'fixed' | 'percentage' | 'mixed'

export interface GyomuItakuFields {
  workDescription: string
  feeType: FeeType
  feeFixed: string          // 固定金額（円）
  feePercentage: string     // 成果報酬（%）
  feeBase: string           // 成果報酬の基準（例: 売上、利益）
  feeNote: string           // 補足（混合の場合など）
  paymentCycle: string
  copyrightOwner: 'party1' | 'party2' | 'shared'
  includeNda: boolean
  ndaYears: string
  includeNonCompete: boolean
  nonCompeteMonths: string
}

export interface NdaFields {
  ndaType: 'one-way' | 'mutual'
  secretScope: string
  purpose: string
  survivalYears: string
}

export interface TorihikiKihonFields {
  tradeDescription: string
  inspectionDays: string
  paymentTerms: string
}

export interface GyomuTeikeiFields {
  partnershipPurpose: string
  cooperationScope: string
  exclusivity: boolean
  revenueShare: string
}

export interface BaibaiFields {
  productDescription: string
  price: string
  deliveryDate: string
  deliveryMethod: string
  warrantyPeriod: string
}

export interface ContractFormData {
  type: ContractType
  common: CommonFields
  gyomuItaku?: GyomuItakuFields
  nda?: NdaFields
  torihikiKihon?: TorihikiKihonFields
  gyomuTeikei?: GyomuTeikeiFields
  baibai?: BaibaiFields
}
