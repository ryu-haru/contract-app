'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getContractMeta } from '@/lib/contracts'
import type { ContractFormData } from '@/types/contract'

type State =
  | { status: 'loading' }
  | { status: 'streaming' }
  | { status: 'error'; message: string }
  | { status: 'done'; text: string }

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[2]) parts.push(<strong key={m.index}>{m[2]}</strong>)
    else if (m[3]) parts.push(<em key={m.index}>{m[3]}</em>)
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts
}

export function PreviewContent() {
  const router = useRouter()
  const [state, setState] = useState<State>({ status: 'loading' })
  const [editedText, setEditedText] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('contractFormData')
    if (!raw) {
      router.push('/')
      return
    }

    const formData: ContractFormData = JSON.parse(raw)

    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`生成に失敗しました (${res.status})`)
        if (!res.body) throw new Error('レスポンスが空です')

        setState({ status: 'streaming' })
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let accumulated = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          accumulated += decoder.decode(value, { stream: true })
          setEditedText(accumulated)
        }

        setState({ status: 'done', text: accumulated })
      })
      .catch((err: Error) => {
        setState({ status: 'error', message: err.message })
      })
  }, [router])

  function handlePrint() {
    window.print()
  }

  async function handleExportWord() {
    const { exportToWord } = await import('@/lib/export-word')
    const fileName = meta ? meta.title : '契約書'
    await exportToWord(editedText, fileName)
  }

  function handleBack() {
    router.push('/')
  }

  const formData: ContractFormData | null =
    typeof window !== 'undefined'
      ? (() => {
          try {
            const raw = localStorage.getItem('contractFormData')
            return raw ? JSON.parse(raw) : null
          } catch {
            return null
          }
        })()
      : null

  const meta = formData ? getContractMeta(formData.type) : null

  return (
    <>
      {/* 画面用ヘッダー（印刷時は非表示） */}
      <div className="no-print mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={handleBack}
            className="text-sm text-muted-foreground hover:text-foreground mb-2 block"
          >
            ← 最初から作り直す
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              {meta ? `${meta.icon} ${meta.title}` : '契約書ドラフト'}
            </h1>
            {state.status === 'done' && (
              <Badge variant="secondary">AI生成済み</Badge>
            )}
            {state.status === 'streaming' && (
              <Badge variant="outline" className="animate-pulse">生成中...</Badge>
            )}
          </div>
        </div>
        {(state.status === 'done' || (state.status === 'streaming' && editedText)) && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)} disabled={state.status === 'streaming'}>
              {isEditing ? '編集終了' : '編集する'}
            </Button>
            <Button onClick={handlePrint} disabled={state.status === 'streaming'}>印刷 / PDF保存</Button>
          </div>
        )}
      </div>

      <Separator className="no-print mb-6" />

      {/* コンテンツ */}
      {(state.status === 'loading' || state.status === 'streaming') && editedText === '' && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground text-sm">AIが契約書を生成しています...</p>
        </div>
      )}

      {state.status === 'error' && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium mb-2">エラーが発生しました</p>
          <p className="text-sm text-muted-foreground mb-4">{state.message}</p>
          <Button variant="outline" onClick={handleBack}>トップに戻る</Button>
        </div>
      )}

      {(state.status === 'done' || (state.status === 'streaming' && editedText)) && (
        <>
          {isEditing ? (
            <Textarea
              className="no-print min-h-[70vh] font-mono text-sm"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
          ) : (
            <div className="contract-body prose prose-sm dark:prose-invert max-w-none">
              {editedText.split('\n').map((line, i) => {
                if (line.startsWith('# ')) {
                  return <h1 key={i} className="text-xl font-bold mt-6 mb-4">{renderInline(line.slice(2))}</h1>
                }
                if (line.startsWith('## ')) {
                  return <h2 key={i} className="text-lg font-semibold mt-5 mb-3">{renderInline(line.slice(3))}</h2>
                }
                if (line.startsWith('### ')) {
                  return <h3 key={i} className="text-base font-semibold mt-4 mb-2">{renderInline(line.slice(4))}</h3>
                }
                if (line.startsWith('- ') || line.startsWith('* ')) {
                  return <li key={i} className="ml-4 list-disc">{renderInline(line.slice(2))}</li>
                }
                if (/^\d+\.\s/.test(line)) {
                  return <li key={i} className="ml-4 list-decimal">{renderInline(line.replace(/^\d+\.\s/, ''))}</li>
                }
                if (line.trim() === '') {
                  return <br key={i} />
                }
                return <p key={i} className="mb-1 leading-relaxed">{renderInline(line)}</p>
              })}
            </div>
          )}

          <div className="no-print mt-8 rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">
              ⚠️ このドキュメントはAIが生成したたたき台です。実際の締結前に専門家（弁護士）への確認を推奨します。
            </p>
          </div>
        </>
      )}

      {/* 印刷用スタイル */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .contract-body { color: black; }
          .contract-body h1, .contract-body h2, .contract-body h3 { color: black; }
        }
      `}</style>
    </>
  )
}
