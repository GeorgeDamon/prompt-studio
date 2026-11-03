export const DOCUMENT_LIMITS = { bytes: 10 * 1024 * 1024, pages: 80, characters: 60000 } as const
export interface ImportedDocument { text: string; pages?: number }

export function validatePromptFile(file: Pick<File, 'name' | 'size'>) {
  const extension = file.name.toLowerCase().split('.').pop() || ''
  if (!['pdf', 'docx', 'txt', 'md'].includes(extension)) throw new Error('支持 PDF、Word（.docx）、TXT 和 Markdown 文件。')
  if (!file.size) throw new Error('这个文件是空的，请选择其他文件。')
  if (file.size > DOCUMENT_LIMITS.bytes) throw new Error('文件超过 10 MB，请先缩小文件或拆分后导入。')
  return extension
}

export function normalizeImportedText(text: string) {
  const normalized = text.replace(/^\uFEFF/, '').split(String.fromCharCode(0)).join('').replace(/\r\n?/g, '\n').trim()
  if (!normalized) throw new Error('没有读取到可用文字。扫描版 PDF 请先完成文字识别（OCR）。')
  if (normalized.length > DOCUMENT_LIMITS.characters) throw new Error('文档文字超过 60,000 字符，请拆分后导入。')
  return normalized
}

export function appendImportedDocument(current: string, name: string, text: string) {
  const safeName = Array.from(name, character => character.charCodeAt(0) < 32 ? ' ' : character).join('').slice(0, 160)
  const result = `${current.trimEnd()}${current.trim() ? '\n\n' : ''}【参考材料：${safeName}】\n${text}`
  if (result.length > 80000) throw new Error('与当前输入合并后内容过长，请先整理现有文字。')
  return result
}

export async function readPromptFile(file: File): Promise<ImportedDocument> {
  const extension = validatePromptFile(file)
  if (extension === 'txt' || extension === 'md') return { text: normalizeImportedText(await file.text()) }
  const buffer = await file.arrayBuffer()
  if (extension === 'docx') {
    const mammoth = await import('mammoth/mammoth.browser')
    const result = await mammoth.extractRawText({ arrayBuffer: buffer })
    return { text: normalizeImportedText(result.value) }
  }
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const { default: workerUrl } = await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url')
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
  const task = pdfjs.getDocument({ data: new Uint8Array(buffer), disableFontFace: true, useSystemFonts: true, stopAtErrors: true })
  try {
    const pdf = await task.promise
    if (pdf.numPages > DOCUMENT_LIMITS.pages) throw new Error('PDF 超过 80 页，请拆分后导入。')
    const pages: string[] = []
    let length = 0
    for (let number = 1; number <= pdf.numPages; number++) {
      const page = await pdf.getPage(number)
      const content = await page.getTextContent()
      const text = content.items.map(item => 'str' in item ? item.str + (item.hasEOL ? '\n' : ' ') : '').join('').trim()
      length += text.length
      if (length > DOCUMENT_LIMITS.characters) throw new Error('文档文字超过 60,000 字符，请拆分后导入。')
      if (text) pages.push(text)
      page.cleanup()
    }
    return { text: normalizeImportedText(pages.join('\n\n')), pages: pdf.numPages }
  } catch (error) {
    if (error instanceof Error && error.name === 'PasswordException') throw new Error('这个 PDF 有密码保护，请先解锁后导入。', { cause: error })
    throw error
  } finally { await task.destroy() }
}
