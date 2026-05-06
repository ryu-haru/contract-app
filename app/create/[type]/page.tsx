import { notFound } from 'next/navigation'
import { getContractMeta } from '@/lib/contracts'
import { ContractForm } from './ContractForm'
import type { ContractType } from '@/types/contract'

export default async function CreatePage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params
  const meta = getContractMeta(type as ContractType)
  if (!meta) notFound()

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <a href="/" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← 契約タイプ選択に戻る
          </a>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <span>{meta.icon}</span> {meta.title}
          </h1>
        </div>
        <ContractForm meta={meta} />
      </div>
    </main>
  )
}
