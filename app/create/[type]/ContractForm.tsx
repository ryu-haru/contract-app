'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { ContractTypeMeta } from '@/types/contract'
import type { CommonFields, GyomuItakuFields, NdaFields, TorihikiKihonFields, GyomuTeikeiFields, BaibaiFields } from '@/types/contract'

interface Props {
  meta: ContractTypeMeta
}

export function ContractForm({ meta }: Props) {
  const router = useRouter()

  const [common, setCommon] = useState<CommonFields>({
    party1Name: '',
    party1Rep: '',
    party2Name: '',
    party2Rep: '',
    startDate: '',
    endDate: '',
    autoRenew: false,
    renewalNotice: '1',
    jurisdiction: '東京',
    signDate: new Date().toISOString().split('T')[0],
  })

  const [gyomuItaku, setGyomuItaku] = useState<GyomuItakuFields>({
    workDescription: '',
    feeType: 'fixed',
    feeFixed: '',
    feePercentage: '',
    feeBase: '',
    feeNote: '',
    paymentCycle: '月末締め翌月末払い',
    copyrightOwner: 'party1',
    includeNda: true,
    ndaYears: '3',
    includeNonCompete: false,
    nonCompeteMonths: '6',
  })

  const [nda, setNda] = useState<NdaFields>({
    ndaType: 'one-way',
    secretScope: '',
    purpose: '',
    survivalYears: '3',
  })

  const [torihikiKihon, setTorihikiKihon] = useState<TorihikiKihonFields>({
    tradeDescription: '',
    inspectionDays: '5',
    paymentTerms: '月末締め翌月末払い',
  })

  const [gyomuTeikei, setGyomuTeikei] = useState<GyomuTeikeiFields>({
    partnershipPurpose: '',
    cooperationScope: '',
    exclusivity: false,
    revenueShare: '',
  })

  const [baibai, setBaibai] = useState<BaibaiFields>({
    productDescription: '',
    price: '',
    deliveryDate: '',
    deliveryMethod: '現物引渡',
    warrantyPeriod: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData = {
      type: meta.id,
      common,
      ...(meta.id === 'gyomu-itaku' && { gyomuItaku }),
      ...(meta.id === 'nda' && { nda }),
      ...(meta.id === 'torihiki-kihon' && { torihikiKihon }),
      ...(meta.id === 'gyomu-teikei' && { gyomuTeikei }),
      ...(meta.id === 'baibai' && { baibai }),
    }
    localStorage.setItem('contractFormData', JSON.stringify(formData))
    router.push('/preview')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 共通項目 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">当事者情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{meta.party1Label} 名称</Label>
              <Input
                required
                value={common.party1Name}
                onChange={(e) => setCommon({ ...common, party1Name: e.target.value })}
                placeholder="株式会社〇〇"
              />
            </div>
            <div className="space-y-2">
              <Label>{meta.party1Label} 代表者</Label>
              <Input
                required
                value={common.party1Rep}
                onChange={(e) => setCommon({ ...common, party1Rep: e.target.value })}
                placeholder="代表取締役 山田 太郎"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{meta.party2Label} 名称</Label>
              <Input
                required
                value={common.party2Name}
                onChange={(e) => setCommon({ ...common, party2Name: e.target.value })}
                placeholder="山田 花子"
              />
            </div>
            <div className="space-y-2">
              <Label>{meta.party2Label} 代表者・氏名</Label>
              <Input
                required
                value={common.party2Rep}
                onChange={(e) => setCommon({ ...common, party2Rep: e.target.value })}
                placeholder="山田 花子"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 期間・基本条件 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">契約期間・基本条件</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>開始日</Label>
              <Input
                type="date"
                required
                value={common.startDate}
                onChange={(e) => setCommon({ ...common, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>終了日</Label>
              <Input
                type="date"
                required
                value={common.endDate}
                onChange={(e) => setCommon({ ...common, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoRenew"
                checked={common.autoRenew}
                onChange={(e) => setCommon({ ...common, autoRenew: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="autoRenew">自動更新あり</Label>
            </div>
            {common.autoRenew && (
              <div className="flex items-center gap-2">
                <Label>更新通知期間</Label>
                <Input
                  className="w-20"
                  value={common.renewalNotice}
                  onChange={(e) => setCommon({ ...common, renewalNotice: e.target.value })}
                />
                <span className="text-sm text-muted-foreground">ヶ月前</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>管轄裁判所</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={common.jurisdiction}
                  onChange={(e) => setCommon({ ...common, jurisdiction: e.target.value })}
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">地方裁判所</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>署名日</Label>
              <Input
                type="date"
                value={common.signDate}
                onChange={(e) => setCommon({ ...common, signDate: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* 業務委託固有 */}
      {meta.id === 'gyomu-itaku' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">業務委託の詳細</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>委託業務の内容</Label>
              <Textarea
                required
                rows={3}
                value={gyomuItaku.workDescription}
                onChange={(e) => setGyomuItaku({ ...gyomuItaku, workDescription: e.target.value })}
                placeholder="例: Webアプリケーションのフロントエンド開発業務"
              />
            </div>
            {/* 報酬タイプ */}
            <div className="space-y-3">
              <Label>報酬形態</Label>
              <div className="flex gap-4">
                {(['fixed', 'percentage', 'mixed'] as const).map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="feeType"
                      value={t}
                      checked={gyomuItaku.feeType === t}
                      onChange={() => setGyomuItaku({ ...gyomuItaku, feeType: t })}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">
                      {t === 'fixed' ? '固定金額' : t === 'percentage' ? '成果報酬（%）' : '固定＋成果報酬'}
                    </span>
                  </label>
                ))}
              </div>

              {/* 固定金額 */}
              {(gyomuItaku.feeType === 'fixed' || gyomuItaku.feeType === 'mixed') && (
                <div className="flex items-center gap-2">
                  <Label className="w-28 shrink-0">
                    {gyomuItaku.feeType === 'mixed' ? '固定部分' : '金額'}（税別）
                  </Label>
                  <Input
                    required={gyomuItaku.feeType === 'fixed'}
                    value={gyomuItaku.feeFixed}
                    onChange={(e) => setGyomuItaku({ ...gyomuItaku, feeFixed: e.target.value })}
                    placeholder="500,000"
                    className="w-40"
                  />
                  <span className="text-sm text-muted-foreground">円</span>
                </div>
              )}

              {/* 成果報酬 */}
              {(gyomuItaku.feeType === 'percentage' || gyomuItaku.feeType === 'mixed') && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="w-28 shrink-0">成果報酬</Label>
                    <Input
                      required
                      value={gyomuItaku.feeBase}
                      onChange={(e) => setGyomuItaku({ ...gyomuItaku, feeBase: e.target.value })}
                      placeholder="例: 売上、受注金額、利益"
                      className="w-44"
                    />
                    <span className="text-sm text-muted-foreground">の</span>
                    <Input
                      required
                      value={gyomuItaku.feePercentage}
                      onChange={(e) => setGyomuItaku({ ...gyomuItaku, feePercentage: e.target.value })}
                      placeholder="10"
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-28 shrink-0">補足・条件</Label>
                    <Input
                      value={gyomuItaku.feeNote}
                      onChange={(e) => setGyomuItaku({ ...gyomuItaku, feeNote: e.target.value })}
                      placeholder="例: 月10万円を上限とする、成約から30日以内"
                      className="flex-1"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>支払いサイクル</Label>
              <Select
                value={gyomuItaku.paymentCycle}
                onValueChange={(v) => setGyomuItaku({ ...gyomuItaku, paymentCycle: v ?? gyomuItaku.paymentCycle })}
              >
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="月末締め翌月末払い">月末締め翌月末払い</SelectItem>
                  <SelectItem value="月末締め翌々月末払い">月末締め翌々月末払い</SelectItem>
                  <SelectItem value="成果物納品後30日以内">成果物納品後30日以内</SelectItem>
                  <SelectItem value="成果確認後30日以内">成果確認後30日以内</SelectItem>
                  <SelectItem value="前払い">前払い</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>著作権・知的財産権の帰属</Label>
              <Select
                value={gyomuItaku.copyrightOwner}
                onValueChange={(v) => setGyomuItaku({ ...gyomuItaku, copyrightOwner: v as GyomuItakuFields['copyrightOwner'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="party1">甲（委託者）に帰属</SelectItem>
                  <SelectItem value="party2">乙（受託者）に帰属</SelectItem>
                  <SelectItem value="shared">甲乙共有</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="includeNda"
                    checked={gyomuItaku.includeNda}
                    onChange={(e) => setGyomuItaku({ ...gyomuItaku, includeNda: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="includeNda">秘密保持条項を含める</Label>
                </div>
                {gyomuItaku.includeNda && (
                  <div className="flex items-center gap-2">
                    <Label>存続期間</Label>
                    <Input
                      className="w-16"
                      value={gyomuItaku.ndaYears}
                      onChange={(e) => setGyomuItaku({ ...gyomuItaku, ndaYears: e.target.value })}
                    />
                    <span className="text-sm text-muted-foreground">年</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="includeNonCompete"
                    checked={gyomuItaku.includeNonCompete}
                    onChange={(e) => setGyomuItaku({ ...gyomuItaku, includeNonCompete: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="includeNonCompete">競業避止条項を含める</Label>
                </div>
                {gyomuItaku.includeNonCompete && (
                  <div className="flex items-center gap-2">
                    <Label>期間</Label>
                    <Input
                      className="w-16"
                      value={gyomuItaku.nonCompeteMonths}
                      onChange={(e) => setGyomuItaku({ ...gyomuItaku, nonCompeteMonths: e.target.value })}
                    />
                    <span className="text-sm text-muted-foreground">ヶ月</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* NDA固有 */}
      {meta.id === 'nda' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">NDAの詳細</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>種類</Label>
              <Select
                value={nda.ndaType}
                onValueChange={(v) => setNda({ ...nda, ndaType: v as NdaFields['ndaType'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-way">一方的NDA（甲→乙への開示）</SelectItem>
                  <SelectItem value="mutual">相互NDA（双方向）</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>秘密情報の範囲</Label>
              <Textarea
                required
                rows={2}
                value={nda.secretScope}
                onChange={(e) => setNda({ ...nda, secretScope: e.target.value })}
                placeholder="例: 事業計画、財務情報、技術仕様書、顧客情報など"
              />
            </div>
            <div className="space-y-2">
              <Label>利用目的</Label>
              <Input
                required
                value={nda.purpose}
                onChange={(e) => setNda({ ...nda, purpose: e.target.value })}
                placeholder="例: 業務提携の可否検討"
              />
            </div>
            <div className="space-y-2">
              <Label>秘密保持義務の存続期間（契約終了後）</Label>
              <div className="flex items-center gap-2">
                <Input
                  className="w-20"
                  value={nda.survivalYears}
                  onChange={(e) => setNda({ ...nda, survivalYears: e.target.value })}
                />
                <span className="text-sm text-muted-foreground">年間</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 取引基本契約固有 */}
      {meta.id === 'torihiki-kihon' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">取引の詳細</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>取引品目・サービス概要</Label>
              <Textarea
                required
                rows={2}
                value={torihikiKihon.tradeDescription}
                onChange={(e) => setTorihikiKihon({ ...torihikiKihon, tradeDescription: e.target.value })}
                placeholder="例: ソフトウェア開発およびシステム保守サービス"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>検収期間</Label>
                <div className="flex items-center gap-2">
                  <Input
                    className="w-20"
                    value={torihikiKihon.inspectionDays}
                    onChange={(e) => setTorihikiKihon({ ...torihikiKihon, inspectionDays: e.target.value })}
                  />
                  <span className="text-sm text-muted-foreground">営業日</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>支払い条件</Label>
                <Select
                  value={torihikiKihon.paymentTerms}
                  onValueChange={(v) => setTorihikiKihon({ ...torihikiKihon, paymentTerms: v ?? torihikiKihon.paymentTerms })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="月末締め翌月末払い">月末締め翌月末払い</SelectItem>
                    <SelectItem value="月末締め翌々月末払い">月末締め翌々月末払い</SelectItem>
                    <SelectItem value="20日締め翌月末払い">20日締め翌月末払い</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 業務提携固有 */}
      {meta.id === 'gyomu-teikei' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">提携の詳細</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>提携の目的</Label>
              <Input
                required
                value={gyomuTeikei.partnershipPurpose}
                onChange={(e) => setGyomuTeikei({ ...gyomuTeikei, partnershipPurpose: e.target.value })}
                placeholder="例: 共同マーケティングによる顧客獲得の拡大"
              />
            </div>
            <div className="space-y-2">
              <Label>協業内容・範囲</Label>
              <Textarea
                required
                rows={3}
                value={gyomuTeikei.cooperationScope}
                onChange={(e) => setGyomuTeikei({ ...gyomuTeikei, cooperationScope: e.target.value })}
                placeholder="例: 共同セミナーの開催、見込み顧客の相互紹介、共同プロモーション活動"
              />
            </div>
            <div className="space-y-2">
              <Label>収益配分（任意）</Label>
              <Input
                value={gyomuTeikei.revenueShare}
                onChange={(e) => setGyomuTeikei({ ...gyomuTeikei, revenueShare: e.target.value })}
                placeholder="例: 紹介成約時に紹介元へ成約金額の10%を支払う"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="exclusivity"
                checked={gyomuTeikei.exclusivity}
                onChange={(e) => setGyomuTeikei({ ...gyomuTeikei, exclusivity: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="exclusivity">独占的提携（競合他社との類似提携を制限）</Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 売買契約固有 */}
      {meta.id === 'baibai' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">売買の詳細</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>売買対象の商品・サービス</Label>
              <Textarea
                required
                rows={2}
                value={baibai.productDescription}
                onChange={(e) => setBaibai({ ...baibai, productDescription: e.target.value })}
                placeholder="例: 社内業務管理システム（ソフトウェア一式）"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>売買代金（税別）</Label>
                <div className="flex items-center gap-2">
                  <Input
                    required
                    value={baibai.price}
                    onChange={(e) => setBaibai({ ...baibai, price: e.target.value })}
                    placeholder="1,000,000"
                  />
                  <span className="text-sm text-muted-foreground">円</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>引渡日</Label>
                <Input
                  type="date"
                  required
                  value={baibai.deliveryDate}
                  onChange={(e) => setBaibai({ ...baibai, deliveryDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>引渡方法</Label>
                <Select
                  value={baibai.deliveryMethod}
                  onValueChange={(v) => setBaibai({ ...baibai, deliveryMethod: v ?? baibai.deliveryMethod })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="現物引渡">現物引渡</SelectItem>
                    <SelectItem value="電磁的方法（データ納品）">電磁的方法（データ納品）</SelectItem>
                    <SelectItem value="持込引渡">持込引渡</SelectItem>
                    <SelectItem value="宅配便による発送">宅配便による発送</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>品質保証期間（任意）</Label>
                <Input
                  value={baibai.warrantyPeriod}
                  onChange={(e) => setBaibai({ ...baibai, warrantyPeriod: e.target.value })}
                  placeholder="例: 12ヶ月"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button type="submit" className="w-full" size="lg">
        AIでドラフトを生成する →
      </Button>
    </form>
  )
}
