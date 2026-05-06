import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  PageOrientation,
} from 'docx'
import { saveAs } from 'file-saver'

function parseMarkdownToDocx(markdown: string): Paragraph[] {
  const lines = markdown.split('\n')
  const paragraphs: Paragraph[] = []

  for (const line of lines) {
    if (line.startsWith('# ')) {
      paragraphs.push(
        new Paragraph({
          text: line.slice(2),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        })
      )
    } else if (line.startsWith('## ')) {
      paragraphs.push(
        new Paragraph({
          text: line.slice(3),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 },
        })
      )
    } else if (line.startsWith('### ')) {
      paragraphs.push(
        new Paragraph({
          text: line.slice(4),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
        })
      )
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: line.slice(2), size: 22 })],
          bullet: { level: 0 },
          spacing: { after: 80 },
        })
      )
    } else if (line.startsWith('**') && line.endsWith('**')) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: line.slice(2, -2), bold: true, size: 22 })],
          spacing: { after: 100 },
        })
      )
    } else if (line.trim() === '' || line.trim() === '---') {
      paragraphs.push(new Paragraph({ text: '', spacing: { after: 100 } }))
    } else {
      // Inline bold: **text**
      const parts = line.split(/(\*\*[^*]+\*\*)/)
      const runs: TextRun[] = parts.map((part) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return new TextRun({ text: part.slice(2, -2), bold: true, size: 22 })
        }
        return new TextRun({ text: part, size: 22 })
      })
      paragraphs.push(
        new Paragraph({
          children: runs,
          spacing: { after: 100 },
        })
      )
    }
  }

  return paragraphs
}

export async function exportToWord(contractText: string, fileName: string) {
  const contentParagraphs = parseMarkdownToDocx(contractText)

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'MS Mincho',
            size: 22, // 11pt
          },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          run: { bold: true, size: 28, font: 'MS Gothic' },
          paragraph: { alignment: AlignmentType.CENTER },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          run: { bold: true, size: 24, font: 'MS Gothic' },
        },
        {
          id: 'Heading3',
          name: 'Heading 3',
          run: { bold: true, size: 22, font: 'MS Gothic' },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1800, bottom: 1800, left: 1800, right: 1800 },
          },
        },
        children: [
          // 警告文
          new Paragraph({
            children: [
              new TextRun({
                text: '⚠️ このドキュメントはAIが生成したたたき台です。実際の締結前に専門家（弁護士）への確認を推奨します。',
                size: 18,
                color: '888888',
              }),
            ],
            spacing: { after: 400 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            },
          }),
          ...contentParagraphs,
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, `${fileName}.docx`)
}
