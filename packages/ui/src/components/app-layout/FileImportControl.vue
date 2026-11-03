<template>
  <div class="studio-file-tools">
    <input ref="input" type="file" accept=".pdf,.docx,.txt,.md" aria-label="导入参考文件" class="studio-file-input" @change="importFile" />
    <button type="button" class="studio-import-button" :disabled="disabled || reading" @click="input?.click()"><LoaderCircle v-if="reading" :size="15" class="studio-file-spinner" /><Paperclip v-else :size="15" /><span>{{ reading ? '正在读取…' : '导入文件' }}</span></button>
    <span v-if="status" class="studio-file-status" role="status">{{ status }}</span><span v-else-if="!error" class="studio-file-hint">PDF / Word / TXT · 本地读取</span>
    <p v-if="error" class="studio-file-error" role="alert">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { Paperclip, LoaderCircle } from '@lucide/vue'
const props = defineProps<{ modelValue: string; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string]; reading: [value: boolean] }>()
const input = ref<HTMLInputElement>()
const reading = ref(false)
const status = ref('')
const error = ref('')
let operation = 0
onBeforeUnmount(() => { operation++ })
const importFile = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  target.value = ''
  if (!file || props.disabled || reading.value) return
  const current = ++operation
  reading.value = true; emit('reading', true); error.value = ''; status.value = ''
  try {
    const { readPromptFile, appendImportedDocument } = await import('../../services/document-import')
    const result = await readPromptFile(file)
    if (current !== operation || props.disabled) return
    emit('update:modelValue', appendImportedDocument(props.modelValue, file.name, result.text))
    status.value = `${file.name}${result.pages ? ` · ${result.pages} 页` : ''} · 已导入`
  } catch (cause) {
    if (current === operation) error.value = cause instanceof Error ? cause.message : '文件读取失败，请检查文件是否完整。'
  } finally { if (current === operation) { reading.value = false; emit('reading', false) } }
}
</script>

<style>
.studio-file-tools { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; min-height: 30px; }
.studio-file-input { position: absolute; width: 1px; height: 1px; clip-path: inset(100%); overflow: hidden; }
.studio-import-button { display: inline-flex; align-items: center; gap: 6px; border: 0; background: transparent; padding: 5px 0; color: #85857d; font: inherit; font-size: 11px !important; cursor: pointer; }
.studio-import-button:hover { color: #252522; }
.studio-import-button:disabled { cursor: not-allowed; opacity: .55; }
.studio-file-hint, .studio-file-status { font-size: 10px; color: #acaca2; overflow-wrap: anywhere; }
.studio-file-status { color: #6c7e65; }
.studio-file-error { width: 100%; font-size: 11px; color: #a84242; margin: 0 0 6px; }
.studio-file-spinner { animation: studio-file-rotate 1s linear infinite; }
@keyframes studio-file-rotate { to { transform: rotate(360deg); } }
@media (max-width: 600px) { .studio-file-hint { font-size: 9px; } }
@media (prefers-reduced-motion: reduce) { .studio-file-spinner { animation: none; } }
</style>
