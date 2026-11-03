<template>
  <NDropdown trigger="click" :options="options" :value="mode" :disabled="disabled" @select="selectMode">
    <button class="focus-mode-select" type="button" aria-label="切换模式" :title="`当前模式：${mode === 'system' ? '角色设定' : '日常指令'}`" :disabled="disabled">
      <component :is="mode === 'system' ? UserRound : MessageCircle" :size="15" />
      <span>切换模式</span><ChevronDown :size="14" />
    </button>
  </NDropdown>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { NDropdown } from 'naive-ui'
import { ChevronDown, MessageCircle, UserRound } from '@lucide/vue'
import { router } from '../../router'

defineProps<{ disabled?: boolean }>()
const mode = computed(() => router.currentRoute.value.path.endsWith('/system') ? 'system' : 'user')
const options = computed(() => [
  { key: 'user', label: '日常指令', icon: () => h(MessageCircle, { size: 16 }) },
  { key: 'system', label: '角色设定', icon: () => h(UserRound, { size: 16 }) },
])
const selectMode = (value: string) => {
  if (value !== 'user' && value !== 'system') return
  if (value !== mode.value) void router.push(`/basic/${value}`)
}
</script>
