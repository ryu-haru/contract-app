import type { ContractFormData } from '@/types/contract'


export const SYSTEM_PROMPT = `あなたは日本の法律に精通した契約書作成の専門家です。
入力された条件をもとに、実用的で明確な日本語の契約書を作成してください。

ルール：
- 法的に有効な、一般的な日本の契約書の形式に従う
- 丁寧で格調ある文体を使う（〜する、〜とする）
- 各条項は明確な見出しと番号を付ける
- ⚠️ 注記を必ず末尾に含める：「このドキュメントはAIが生成したたたき台です。実際の締結前に専門家（弁護士）への確認を推奨します。」
- Markdown形式で出力する（見出し・箇条書き可）`

export function buildPrompt(data: ContractFormData): string {
  const { common, type } = data

  const commonInfo = `
## 基本情報
- 甲（第一当事者）: ${common.party1Name}（代表者: ${common.party1Rep}）
- 乙（第二当事者）: ${common.party2Name}（代表者: ${common.party2Rep}）
- 契約期間: ${common.startDate} 〜 ${common.endDate}
- 自動更新: ${common.autoRenew ? `あり（${common.renewalNotice}ヶ月前通知）` : 'なし'}
- 管轄裁判所: ${common.jurisdiction}地方裁判所
- 署名日: ${common.signDate}
`

  if (type === 'gyomu-itaku' && data.gyomuItaku) {
    const g = data.gyomuItaku
    const copyrightMap = { party1: '甲（委託者）', party2: '乙（受託者）', shared: '甲乙共有' }
    const feeDescription =
      g.feeType === 'fixed'
        ? `${g.feeFixed}円（税別・固定報酬）`
        : g.feeType === 'percentage'
        ? `${g.feeBase}の${g.feePercentage}%（成果報酬）${g.feeNote ? `／補足: ${g.feeNote}` : ''}`
        : `固定報酬${g.feeFixed}円（税別）＋${g.feeBase}の${g.feePercentage}%（成果報酬）${g.feeNote ? `／補足: ${g.feeNote}` : ''}`
    return `以下の条件で業務委託契約書を作成してください。

${commonInfo}

## 業務委託の詳細
- 委託業務の内容: ${g.workDescription}
- 委託料: ${feeDescription}
- 支払いサイクル: ${g.paymentCycle}
- 著作権・知的財産権の帰属: ${copyrightMap[g.copyrightOwner]}
- 秘密保持条項: ${g.includeNda ? `含める（契約終了後${g.ndaYears}年間存続）` : '含めない'}
- 競業避止条項: ${g.includeNonCompete ? `含める（契約終了後${g.nonCompeteMonths}ヶ月間）` : '含めない'}

第1条（委託業務）、第2条（委託期間）、第3条（委託料）、第4条（成果物・納入・検収）、第5条（著作権）${g.includeNda ? '、第6条（秘密保持）' : ''}${g.includeNonCompete ? '、第7条（競業避止）' : ''}、契約解除条項、損害賠償条項、反社会的勢力排除条項、管轄裁判所条項を含めてください。`
  }

  if (type === 'nda' && data.nda) {
    const n = data.nda
    return `以下の条件で秘密保持契約書（NDA）を作成してください。

${commonInfo}

## NDAの詳細
- 種類: ${n.ndaType === 'one-way' ? '一方的NDA（甲→乙への開示）' : '相互NDA'}
- 秘密情報の範囲: ${n.secretScope}
- 利用目的: ${n.purpose}
- 秘密保持義務の存続期間（契約終了後）: ${n.survivalYears}年間

第1条（秘密情報の定義）、第2条（秘密保持義務）、第3条（有効期間・存続条項）、第4条（秘密情報の返還・廃棄）、第5条（損害賠償）、管轄裁判所条項を含めてください。`
  }

  if (type === 'torihiki-kihon' && data.torihikiKihon) {
    const t = data.torihikiKihon
    return `以下の条件で取引基本契約書を作成してください。

${commonInfo}

## 取引の詳細
- 取引品目・サービス概要: ${t.tradeDescription}
- 検収期間: ${t.inspectionDays}営業日
- 支払い条件: ${t.paymentTerms}

第1条（目的）、第2条（個別契約）、第3条（発注・受注）、第4条（納入・検収）、第5条（代金・支払い）、第6条（所有権・危険負担）、第7条（知的財産権）、第8条（秘密保持）、第9条（反社会的勢力の排除）、第10条（契約解除）、第11条（損害賠償）、第12条（有効期間）、管轄裁判所条項を含めてください。`
  }

  if (type === 'gyomu-teikei' && data.gyomuTeikei) {
    const g = data.gyomuTeikei
    return `以下の条件で業務提携契約書を作成してください。

${commonInfo}

## 提携の詳細
- 提携の目的: ${g.partnershipPurpose}
- 協業内容・範囲: ${g.cooperationScope}
- 独占的提携: ${g.exclusivity ? 'あり（競合他社との類似提携を制限）' : 'なし（非独占的提携）'}
${g.revenueShare ? `- 収益配分: ${g.revenueShare}` : ''}

第1条（目的）、第2条（協業内容）、第3条（役割分担）、第4条（費用負担）${g.revenueShare ? '、第5条（収益配分）' : ''}、知的財産権条項、秘密保持条項${g.exclusivity ? '、独占的提携条項' : ''}、契約解除条項、損害賠償条項、反社会的勢力排除条項、管轄裁判所条項を含めてください。`
  }

  if (type === 'baibai' && data.baibai) {
    const b = data.baibai
    return `以下の条件で売買契約書を作成してください。

${commonInfo}

## 売買の詳細
- 売買対象の商品・サービス: ${b.productDescription}
- 売買代金: ${b.price}円（税別）
- 引渡日: ${b.deliveryDate}
- 引渡方法: ${b.deliveryMethod}
${b.warrantyPeriod ? `- 品質保証期間: 引渡後${b.warrantyPeriod}` : ''}

第1条（売買の目的物）、第2条（代金・支払い）、第3条（引渡）、第4条（所有権移転）、第5条（危険負担）${b.warrantyPeriod ? '、第6条（品質保証）' : ''}、第7条（契約不適合責任）、第8条（解除）、第9条（損害賠償）、反社会的勢力排除条項、管轄裁判所条項を含めてください。`
  }

  return '契約書を作成してください。'
}
