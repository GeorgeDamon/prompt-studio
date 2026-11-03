import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PromptLibraryDialog from '../../../src/components/app-layout/PromptLibraryDialog.vue'
import library from '../../../src/data/prompt-library.json'
const create = () => mount(PromptLibraryDialog, { props: { show: true }, global: { stubs: { NModal: { template: '<div><slot /></div>' } } } })
describe('curated prompt library', () => {
  it('finds a Chinese-labelled source prompt and emits its unchanged body', async () => {
    const wrapper = create()
    await wrapper.get('input').setValue('代码审查')
    expect(wrapper.findAll('.studio-library-list > button')).toHaveLength(1)
    const source = library.items.find(item => item.originalTitle === 'Code Reviewer')!
    expect(wrapper.get('.studio-library-detail pre').text()).toBe(source.content)
    await wrapper.get('.studio-library-detail-footer button').trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual([source.content])
    wrapper.unmount()
  })
  it('filters categories and explains empty results without showing a stale template', async () => {
    const wrapper = create()
    await wrapper.findAll('.studio-library-categories button').find(button => button.text() === '学习研究')!.trigger('click')
    expect(wrapper.findAll('.studio-library-list > button')).toHaveLength(library.items.filter(item => item.category === '学习研究').length)
    await wrapper.get('input').setValue('not-a-real-prompt-739421')
    expect(wrapper.find('.studio-library-empty').exists()).toBe(true)
    expect(wrapper.find('.studio-library-detail').exists()).toBe(false)
    wrapper.unmount()
  })
})
