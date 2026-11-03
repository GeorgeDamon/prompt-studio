import { describe, expect, it } from 'vitest'
import { validatePromptFile, normalizeImportedText, appendImportedDocument, DOCUMENT_LIMITS } from '../../../src/services/document-import'
describe('local document import', () => {
  it('rejects unsupported, empty and oversized files before parsing', () => {
    expect(() => validatePromptFile({ name: 'old.doc', size: 200 })).toThrow('支持 PDF')
    expect(() => validatePromptFile({ name: 'empty.pdf', size: 0 })).toThrow('空的')
    expect(() => validatePromptFile({ name: 'huge.docx', size: DOCUMENT_LIMITS.bytes + 1 })).toThrow('10 MB')
    expect(validatePromptFile({ name: 'NOTES.PDF', size: 200 })).toBe('pdf')
  })
  it('preserves document content while normalizing line endings and rejects silent truncation', () => {
    expect(normalizeImportedText('\uFEFF第一段\r\n第二段\u0000')).toBe('第一段\n第二段')
    expect(() => normalizeImportedText('   ')).toThrow('OCR')
    expect(() => normalizeImportedText('a'.repeat(DOCUMENT_LIMITS.characters + 1))).toThrow('60,000')
  })
  it('appends reference material without overwriting the user request', () => {
    expect(appendImportedDocument('请总结重点。', 'notes.docx', '参考原文')).toBe('请总结重点。\n\n【参考材料：notes.docx】\n参考原文')
    expect(appendImportedDocument('', 'bad\nname.txt', '正文')).toBe('【参考材料：bad name.txt】\n正文')
    expect(() => appendImportedDocument('a'.repeat(80000), 'n.txt', 'b')).toThrow('内容过长')
  })
})
