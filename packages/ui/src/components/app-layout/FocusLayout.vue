<template>
  <ToastUI>
    <div class="focus-app" @keydown.esc="sidebarOpen = false" :class="{ 'focus-sidebar-open': sidebarOpen }">
      <button v-if="sidebarOpen" class="focus-scrim" aria-label="关闭侧栏" @click="sidebarOpen = false" />
      <aside class="focus-sidebar" aria-label="主导航" :inert="isMobile && !sidebarOpen || undefined" :aria-hidden="isMobile && !sidebarOpen || undefined">
        <div class="focus-brand"><span class="focus-brand-mark"><img :src="studioMark" width="30" height="30" alt="" aria-hidden="true" /></span><span>Prompt<span class="focus-brand-secondary">Studio</span></span>
          <button class="focus-mobile-close focus-icon-button" aria-label="关闭侧栏" @click="sidebarOpen = false"><PanelLeftClose :size="18" /></button>
        </div>
        <button :disabled="busy" class="focus-new" @click="sendCommand('')"><SquarePlus :size="18" />新建提示词</button>
        <nav class="focus-nav">
          <button :class="{ active: !favorites }" @click="goWorkspace"><TextQuote :size="18" />提示词优化</button>
          <button @click="openLibrary"><Library :size="18" />提示词库</button>
          <button @click="action('history')"><Clock3 :size="18" />历史记录</button>
          <button :class="{ active: favorites }" @click="action('favorites')"><Star :size="18" />我的收藏</button>
        </nav>
        <div class="focus-sidebar-note"><span class="focus-section-label">少一点复杂，多一点专注</span><p>从一句想法开始，<br />写出更清晰的提示词。</p></div>
        <div class="focus-sidebar-bottom">
          <button @click="action('models')"><Settings2 :size="18" />模型设置<ChevronRight :size="14" class="focus-trailing" /></button>
          <button @click="action('data')"><Archive :size="18" />数据备份</button>
          <a href="https://github.com/linshenkx/prompt-optimizer" target="_blank" rel="noopener noreferrer" class="focus-source">基于 Prompt Optimizer <ArrowUpRight :size="12" /></a>
          <a :href="sourceArchiveUrl" download="PromptStudio-source.zip" class="focus-source focus-source-download">修改版源码<ArrowUpRight :size="12" /></a>
        </div>
      </aside>
      <PromptLibraryDialog :disabled="busy" v-model:show="showLibrary" @select="useLibraryPrompt" />
      <div class="focus-main" :inert="isMobile && sidebarOpen || undefined">
        <header class="focus-topbar">
          <div class="focus-topbar-left"><button class="focus-menu focus-icon-button" aria-label="打开侧栏" @click="sidebarOpen = true"><PanelLeft :size="20" /></button><span>{{ favorites ? '我的收藏' : '提示词优化' }}</span></div>
          <div class="focus-model-picker"><slot name="model-selector" /></div>
        </header>
        <main class="focus-content" :class="{ 'focus-content--favorites': favorites }">
          <template v-if="!favorites">
            <div class="focus-intro"><span class="focus-eyebrow">PROMPT STUDIO</span><h1>把想法，表达得更好。</h1><p>写下你的需求，让好提示词更进一步。</p></div>
          </template>
          <div class="focus-workspace"><slot name="main" /></div>
          <div v-if="!favorites" class="focus-starters" aria-label="灵感示例"><span>试试这些</span><button :disabled="busy" v-for="item in starters" :key="item.title" @click="sendCommand(item.text)"><component :is="item.icon" :size="15" />{{ item.title }}<ArrowUpRight :size="13" /></button></div>
          <footer v-if="!favorites" class="focus-footer">清晰的表达，是好结果的开始。</footer>
        </main>
      </div>
    </div>
  </ToastUI>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, ref, watch } from 'vue'
import { SquarePlus, TextQuote, Clock3, Star, Settings2, ChevronRight, ArrowUpRight, Feather, CodeXml, BookOpen, Archive, PanelLeft, PanelLeftClose, Library } from '@lucide/vue'
import { router } from '../../router'
import { useMediaQuery } from '@vueuse/core'
import { focusCommandKey, focusBusyKey } from './focus-context'
import ToastUI from '../Toast.vue'
import PromptLibraryDialog from './PromptLibraryDialog.vue'
import studioMark from '../../assets/studio-mark.svg'
import '../../styles/focus-workspace.css'

const sourceArchiveUrl = typeof document === 'undefined' ? './source.zip' : new URL('source.zip', document.baseURI).href

const emit = defineEmits<{ action: [action: string] }>()
const command = inject(focusCommandKey)!
const busy = inject(focusBusyKey, ref(false))
const sidebarOpen = ref(false)
const showLibrary = ref(false)
const openLibrary = () => { sidebarOpen.value = false; showLibrary.value = true }
const isMobile = useMediaQuery('(max-width: 760px)')
watch(sidebarOpen, async (open) => {
  if (!isMobile.value) return
  await nextTick()
  document.querySelector<HTMLButtonElement>(open ? '.focus-mobile-close' : '.focus-menu')?.focus()
})
const favorites = computed(() => router.currentRoute.value.path === '/favorites')
const mode = computed(() => router.currentRoute.value.path.endsWith('/system') ? 'system' : 'user')
const navigate = (value: string) => { void router.push(`/basic/${value}`); sidebarOpen.value = false }
const goWorkspace = () => navigate(mode.value)
const action = (value: string) => { emit('action', value); sidebarOpen.value = false }
let commandId = 0
const sendCommand = async (text: string) => {
  if (favorites.value) {
    await router.push('/basic/user')
    await nextTick()
  }
  command.value = { id: ++commandId, text }
  sidebarOpen.value = false
}
const useLibraryPrompt = async (text: string) => { await sendCommand(text); showLibrary.value = false }

const starters = [
  { title: '写作表达', icon: Feather, text: '帮我把一段零散的想法写成一篇逻辑清晰、语言自然的文章。先确认读者、主题和用途，再给出提纲与正文。' },
  { title: '编程开发', icon: CodeXml, text: '帮我排查代码中的问题。先根据报错和代码定位原因，再给出最小修改方案，并说明如何验证修复有效。' },
  { title: '学习新知', icon: BookOpen, text: '我想从零学习一个新领域。请先了解我的基础和目标，用通俗的例子讲解核心概念，再安排循序渐进的练习。' },
]
</script>
