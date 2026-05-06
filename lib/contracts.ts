import type { ContractType, ContractTypeMeta } from '@/types/contract'

export const CONTRACT_TYPES: ContractTypeMeta[] = [
  {
    id: 'gyomu-itaku',
    title: '業務委託契約',
    description: 'フリーランサー・外部業者への業務委託。成果物・報酬・著作権などを規定します。',
    icon: '📋',
    party1Label: '委託者（甲）',
    party2Label: '受託者（乙）',
  },
  {
    id: 'nda',
    title: 'NDA（秘密保持契約）',
    description: '他社・パートナーとの情報共有前に締結。一方向・相互の両方に対応します。',
    icon: '🔒',
    party1Label: '甲',
    party2Label: '乙',
  },
  {
    id: 'torihiki-kihon',
    title: '取引基本契約',
    description: '継続的な取引関係の基本条件を規定。個別発注はこの契約に基づいて行います。',
    icon: '🤝',
    party1Label: '甲',
    party2Label: '乙',
  },
]

export function getContractMeta(type: ContractType): ContractTypeMeta | undefined {
  return CONTRACT_TYPES.find((c) => c.id === type)
}
