<template>
  <NModal :show="show" preset="card" title="提示词库" class="studio-library-modal" :style="{ width: 'min(960px, 94vw)', maxHeight: '90dvh' }" @update:show="emit('update:show', $event)">
    <div class="studio-library-heading"><p>从一个好起点，写出适合你的提示词。</p><span>{{ library.items.length }} 个精选模板</span></div>
    <NInput v-model:value="query" placeholder="搜索用途、名称或关键词…" aria-label="搜索提示词" clearable><template #prefix><Search :size="16" /></template></NInput>
    <div class="studio-library-categories" role="group" aria-label="提示词分类"><button v-for="name in categories" :key="name" type="button" :aria-pressed="category === name" :class="{ selected: category === name }" @click="category = name">{{ name }}</button></div>
    <div class="studio-library-body">
      <div class="studio-library-list" aria-label="模板列表"><button v-for="item in matches" :key="item.id" type="button" :class="{ selected: selected?.id === item.id }" @click="selectedId = item.id"><span>{{ item.title }}</span><small>{{ item.description }}</small><span class="studio-library-category">{{ item.category }}</span></button><p v-if="!matches.length" class="studio-library-empty">没有找到相关模板，换个关键词试试。</p></div>
      <article v-if="selected" class="studio-library-detail"><div><span class="studio-library-overline">{{ selected.category }}</span><h3>{{ selected.title }}</h3><p>{{ selected.originalTitle }} · 英文原始模板</p></div><pre>{{ selected.content }}</pre><div class="studio-library-detail-footer"><a :href="library.sourceData" target="_blank" rel="noopener noreferrer">来源 prompts.chat · CC0</a><NButton type="primary" :disabled="disabled" @click="emit('select', selected.content)">使用此提示词<template #icon><ArrowUpRight :size="16" /></template></NButton></div></article>
    </div>
  </NModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NButton, NInput } from 'naive-ui'
import NModal from '../common/AdaptiveModal.vue'
import { Search, ArrowUpRight } from '@lucide/vue'
import library from '../../data/prompt-library.json'

defineProps<{ show: boolean; disabled?: boolean }>()
const emit = defineEmits<{ 'update:show': [value: boolean]; select: [content: string] }>()
const query = ref('')
const category = ref('全部')
const selectedId = ref(library.items[0]?.id || '')
const categories = ['全部', ...new Set(library.items.map(item => item.category))]
const matches = computed(() => {
  const needle = query.value.trim().toLocaleLowerCase()
  return library.items.filter(item => (category.value === '全部' || item.category === category.value) && (!needle || [item.title, item.originalTitle, item.description, item.category].some(value => value.toLocaleLowerCase().includes(needle))))
})
const selected = computed(() => matches.value.find(item => item.id === selectedId.value) || matches.value[0])
watch(matches, items => { if (!items.some(item => item.id === selectedId.value)) selectedId.value = items[0]?.id || '' })
</script>

<style>
.studio-library-modal { border-radius: 20px !important; }
.studio-library-heading { display: flex; gap: 12px; align-items: center; justify-content: space-between; margin: -8px 0 20px; color: #8b8b83; font-size: 12px; }
.studio-library-heading p { margin: 0; }
.studio-library-heading > span { white-space: nowrap; }
.studio-library-categories { display: flex; gap: 6px; overflow-x: auto; padding: 17px 0; }
.studio-library-categories button { flex: none; background: transparent; color: #898981; border: 0; border-radius: 8px; padding: 7px 12px; font: inherit; font-size: 12px; cursor: pointer; }
.studio-library-categories button.selected { color: #272725; background: #efefec; }
.studio-library-body { display: grid; grid-template-columns: 245px minmax(0, 1fr); gap: 24px; height: min(500px, 61dvh); min-height: 240px; }
.studio-library-list { min-width: 0; overflow: auto; padding-right: 6px; }
.studio-library-list > button { display: flex; flex-direction: column; gap: 5px; width: 100%; border: 1px solid transparent; border-radius: 12px; background: transparent; padding: 13px; font: inherit; text-align: left; cursor: pointer; margin-bottom: 4px; }
.studio-library-list > button:hover { background: #fafaf8; }
.studio-library-list > button.selected { background: #f5f5f2; border-color: #e8e8e2; }
.studio-library-list > button > span:first-child { font-size: 13px; color: #343431; font-weight: 550; }
.studio-library-list small { color: #93938a; font-size: 11px; }
.studio-library-category { color: #aaa99f; font-size: 10px; }
.studio-library-detail { min-width: 0; min-height: 0; display: flex; flex-direction: column; border-left: 1px solid #eeeee9; padding-left: 24px; }
.studio-library-overline { font-size: 10px; color: #99998f; }
.studio-library-detail h3 { font-size: 20px; font-weight: 550; margin: 9px 0 4px; }
.studio-library-detail > div > p { color: #9a9a90; font-size: 11px; margin: 0 0 18px; }
.studio-library-detail pre { flex: 1; min-height: 0; overflow: auto; white-space: pre-wrap; word-break: break-word; font: 13px/1.9 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #5b5b54; padding-right: 12px; margin: 0; }
.studio-library-detail-footer { display: flex; gap: 12px; flex-wrap: wrap; justify-content: space-between; align-items: center; padding-top: 20px; }
.studio-library-detail-footer a { font-size: 10px; color: #a0a096; text-decoration: none; }
.studio-library-empty { color: #99998e; font-size: 12px; padding: 20px 12px; }
@media (max-width: 650px) {
  .studio-library-heading { align-items: start; font-size: 11px; }
  .studio-library-body { grid-template-columns: 1fr; height: min(600px, 66dvh); gap: 16px; }
  .studio-library-list { display: flex; gap: 7px; overflow-x: auto; overflow-y: hidden; min-height: 94px; max-height: 94px; }
  .studio-library-list > button { min-width: 178px; width: 178px; padding: 10px; }
  .studio-library-detail { border-left: 0; border-top: 1px solid #eeeee9; padding: 16px 0 0; }
  .studio-library-categories button { padding: 7px 10px; }
  .studio-library-detail-footer { padding-top: 13px; }
}
</style>
