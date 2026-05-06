import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { SYSTEM_PROMPT, buildPrompt } from '@/lib/prompts'
import type { ContractFormData } from '@/types/contract'

export async function POST(request: Request) {
  const data: ContractFormData = await request.json()

  const result = streamText({
    model: anthropic('claude-haiku-4-5-20251001'),
    system: SYSTEM_PROMPT,
    prompt: buildPrompt(data),
  })

  return result.toTextStreamResponse()
}
