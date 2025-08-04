import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NavbarComponent from './NavbarComponent.vue'

const NuxtImg = {
  template: '<img />',
  props: ['src', 'alt', 'placeholder', 'loading', 'format', 'quality']
}
describe('NavBarComponent', () => {
  let wrapper
  
  beforeEach(() => {
    wrapper = mount(NavbarComponent, {
      global: {
        components: {
          NuxtImg
        }
      }
    })
  })

  it('управляет видимостью меню по клику на бургер', async () => {
    const burger = wrapper.find('.burger')
    
    // Первый клик - открытие
    await burger.trigger('click')
    expect(wrapper.find('.menu').isVisible()).toBe(true)
    
    // Второй клик - закрытие
    await burger.trigger('click')
    expect(wrapper.find('.menu').exists()).toBe(false)
  })

  it('содержит корректные пункты меню', async () => {
    await wrapper.find('.burger').trigger('click')
    
    const links = wrapper.findAll('.menu__link')
    const expectedLinks = [
      { text: 'Главное', href: '/' },
      { text: 'Мой плейлист', href: '#' },
      { text: 'Войти', href: '/SignIn' }
    ]
    
    links.forEach((link, index) => {
      expect(link.text()).toBe(expectedLinks[index].text)
      expect(link.attributes('href')).toBe(expectedLinks[index].href)
    })
  })
})