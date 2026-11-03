import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { ref } from 'vue'
import FocusLayout from '../../../src/components/app-layout/FocusLayout.vue'
import { focusCommandKey, type FocusCommand } from '../../../src/components/app-layout/focus-context'

vi.mock('../../../src/router', async () => {
  const { ref } = await import('vue')
  return { router: { currentRoute: ref({ path: '/basic/user' }), push: vi.fn().mockResolvedValue(undefined) } }
})
import { router } from '../../../src/router'

const createLayout = () => {
  const command = ref<FocusCommand | null>(null)
  const wrapper = mount(FocusLayout, {
    global: {
      provide: { [focusCommandKey as symbol]: command },
      stubs: { ToastUI: { template: '<div><slot /></div>' } },
    },
    slots: { main: '<textarea aria-label="Prompt" />' },
  })
  return { wrapper, command }
}

afterEach(() => {
  vi.clearAllMocks()
  router.currentRoute.value = { path: '/basic/user' } as typeof router.currentRoute.value
})

describe('text studio navigation', () => {
  it('fills an example without calling any model', async () => {
    const { wrapper, command } = createLayout()
    await wrapper.findAll('.focus-starters button')[0].trigger('click')
    expect(command.value?.text).toContain('提纲与正文')
    expect(router.push).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('starts a new prompt from the favorites page after returning to a workspace', async () => {
    router.currentRoute.value = { path: '/favorites' } as typeof router.currentRoute.value
    const { wrapper, command } = createLayout()
    await wrapper.get('.focus-new').trigger('click')
    await flushPromises()
    expect(router.push).toHaveBeenCalledWith('/basic/user')
    expect(command.value?.text).toBe('')
    wrapper.unmount()
  })

  it('opens and closes the mobile sidebar through navigation', async () => {
    const { wrapper } = createLayout()
    await wrapper.get('.focus-menu').trigger('click')
    expect(wrapper.get('.focus-app').classes()).toContain('focus-sidebar-open')
    await wrapper.findAll('.focus-nav button').find(button => button.text().includes('历史记录'))!.trigger('click')
    expect(wrapper.emitted('action')).toEqual([['history']])
    expect(wrapper.get('.focus-app').classes()).not.toContain('focus-sidebar-open')
    wrapper.unmount()
  })
})
