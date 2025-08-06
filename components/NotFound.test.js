import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import NotFoundPage from './NotFound.vue'



describe('NotFound', () => {
  // Тест 1: Проверка статического контента
  it('отображает корректный текст и элементы', () => {
    const wrapper = mount(NotFoundPage)
    
    expect(wrapper.find('.title').text()).toBe('404')
    expect(wrapper.find('.subtitle').text()).toBe('Страница не найдена 😞')
    expect(wrapper.find('.description').text()).toBe('Возможно, она была удалена или перенесена на другой адрес')
    expect(wrapper.find('.btn').text()).toBe('Вернуться на главную')
  })

  // Тест 2: Проверка структуры DOM
  it('имеет правильную структуру', () => {
    const wrapper = mount(NotFoundPage)
    
    expect(wrapper.find('.container').exists()).toBe(true)
    expect(wrapper.findAll('h1').length).toBe(1)
    expect(wrapper.findAll('p').length).toBe(2)
    expect(wrapper.findAll('button').length).toBe(1)
  })
})