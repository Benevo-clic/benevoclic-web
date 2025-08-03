import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'

// Composant de test simple avec Composition API
const TestComponent = defineComponent({
  template: `
    <div>
      <h1>{{ title }}</h1>
      <p>{{ message }}</p>
      <button @click="increment">{{ count }}</button>
    </div>
  `,
  props: {
    title: {
      type: String,
      default: 'Test Title'
    },
    message: {
      type: String,
      default: 'Test Message'
    }
  },
  setup(props, { emit }) {
    const count = ref(0)
    
    const increment = () => {
      count.value++
      emit('incremented', count.value)
    }
    
    return {
      count,
      increment
    }
  }
})

describe('Basic Component Test', () => {
  it('should render component with default props', () => {
    const wrapper = mount(TestComponent)
    
    expect(wrapper.text()).toContain('Test Title')
    expect(wrapper.text()).toContain('Test Message')
    expect(wrapper.text()).toContain('0')
  })

  it('should render component with custom props', () => {
    const wrapper = mount(TestComponent, {
      props: {
        title: 'Custom Title',
        message: 'Custom Message'
      }
    })
    
    expect(wrapper.text()).toContain('Custom Title')
    expect(wrapper.text()).toContain('Custom Message')
  })

  it('should increment counter when button is clicked', async () => {
    const wrapper = mount(TestComponent)
    
    const button = wrapper.find('button')
    await button.trigger('click')
    
    expect(wrapper.text()).toContain('1')
  })

  it('should emit incremented event when button is clicked', async () => {
    const wrapper = mount(TestComponent)
    
    const button = wrapper.find('button')
    await button.trigger('click')
    
    const emitted = wrapper.emitted('incremented')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]).toEqual([1])
  })

  it('should have proper button accessibility', () => {
    const wrapper = mount(TestComponent)
    
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.isVisible()).toBe(true)
  })
}) 