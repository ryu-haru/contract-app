import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CONTRACT_TYPES } from '@/lib/contracts'

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">契約書作成ツール</h1>
          <p className="text-muted-foreground">
            作成したい契約書の種類を選んでください。条件を入力するとAIがドラフトを生成します。
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {CONTRACT_TYPES.map((contract) => (
            <Link key={contract.id} href={`/create/${contract.id}`}>
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <span className="text-2xl">{contract.icon}</span>
                    {contract.title}
                  </CardTitle>
                  <CardDescription>{contract.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-xs text-muted-foreground text-center">
          ⚠️ このツールで生成される契約書はたたき台です。実際の締結前に専門家（弁護士）への確認を推奨します。
        </p>
      </div>
    </main>
  )
}
