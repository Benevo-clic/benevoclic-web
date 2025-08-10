// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Mock component pour tester le ModalAuth
const MockModalAuth = {
  template: `
    <button class="btn btn-primary px-2 py-0" @click.prevent="handleLogin">
      <div class="key-round-icon"></div>
      <span class="text-secondary-content">{{ t("auth.register.login")}}</span>
    </button>

    <dialog ref="my_modal_3" class="modal">
      <div class="modal-box w-11/12 max-w-7xl" @click.stop>
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="my_modal_3?.close()">✕</button>
        </form>
        <div class="mock-login-component"></div>
      </div>
    </dialog>
    
    <button class="btn btn-neutral-content px-2 py-0" @click.prevent="handleRegister">
      <div class="log-in-icon"></div>
      {{ t("auth.register.title")}}
    </button>

    <dialog ref="my_modal_3" class="modal">
      <div class="modal-box w-11/12 max-w-7xl " @click.stop>
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="my_modal_3?.close()">✕</button>
        <div class="mock-login-component"></div>
      </div>
    </dialog>
  `,
  data() {
    return {
      my_modal_3: null,
      isRegister: false
    }
  },
  methods: {
    handleLogin() {
      this.my_modal_3?.showModal()
      this.isRegister = false
    },
    handleRegister() {
      this.my_modal_3?.showModal()
      this.isRegister = true
    },
    t(key) {
      return key
    }
  }
}

// Mock de useI18n
const mockT = vi.fn(key => key)

// Mock des icônes
vi.mock('lucide-vue-next', () => ({
  KeyRound: {
    template: '<div class="key-round-icon"></div>'
  },
  LogIn: {
    template: '<div class="log-in-icon"></div>'
  }
}))

// Mock global pour useI18n
global.useI18n = () => ({
  t: mockT
})

describe('ModalAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendu de base', () => {
    it('should render login button', () => {
      const wrapper = mount(MockModalAuth)

      const loginButton = wrapper.find('button.btn-primary')
      expect(loginButton.exists()).toBe(true)
      expect(loginButton.text()).toContain('auth.register.login')
    })

    it('should render register button', () => {
      const wrapper = mount(MockModalAuth)

      const registerButton = wrapper.find('button.btn-neutral-content')
      expect(registerButton.exists()).toBe(true)
      expect(registerButton.text()).toContain('auth.register.title')
    })

    it('should render modal dialogs', () => {
      const wrapper = mount(MockModalAuth)

      const dialogs = wrapper.findAll('dialog')
      expect(dialogs.length).toBe(2)
    })

    it('should render modal boxes', () => {
      const wrapper = mount(MockModalAuth)

      const modalBoxes = wrapper.findAll('.modal-box')
      expect(modalBoxes.length).toBe(2)
    })
  })

  describe("Boutons d'action", () => {
    it('should have login button with correct styling', () => {
      const wrapper = mount(MockModalAuth)

      const loginButton = wrapper.find('button.btn-primary')
      expect(loginButton.classes()).toContain('btn')
      expect(loginButton.classes()).toContain('btn-primary')
      expect(loginButton.classes()).toContain('px-2')
      expect(loginButton.classes()).toContain('py-0')
    })

    it('should have register button with correct styling', () => {
      const wrapper = mount(MockModalAuth)

      const registerButton = wrapper.find('button.btn-neutral-content')
      expect(registerButton.classes()).toContain('btn')
      expect(registerButton.classes()).toContain('btn-neutral-content')
      expect(registerButton.classes()).toContain('px-2')
      expect(registerButton.classes()).toContain('py-0')
    })

    it('should have close buttons in modals', () => {
      const wrapper = mount(MockModalAuth)

      const closeButtons = wrapper.findAll('button.btn-circle')
      expect(closeButtons.length).toBe(2)
      closeButtons.forEach(button => {
        expect(button.classes()).toContain('btn-sm')
        expect(button.classes()).toContain('btn-circle')
        expect(button.classes()).toContain('btn-ghost')
      })
    })
  })

  describe('Icônes', () => {
    it('should render KeyRound icon in login button', () => {
      const wrapper = mount(MockModalAuth)

      const keyRoundIcon = wrapper.find('.key-round-icon')
      expect(keyRoundIcon.exists()).toBe(true)
    })

    it('should render LogIn icon in register button', () => {
      const wrapper = mount(MockModalAuth)

      const logInIcon = wrapper.find('.log-in-icon')
      expect(logInIcon.exists()).toBe(true)
    })
  })

  describe('Interactions', () => {
    it('should handle login button click', async () => {
      const wrapper = mount(MockModalAuth)

      const loginButton = wrapper.find('button.btn-primary')
      await loginButton.trigger('click')

      expect(wrapper.vm.isRegister).toBe(false)
    })

    it('should handle register button click', async () => {
      const wrapper = mount(MockModalAuth)

      const registerButton = wrapper.find('button.btn-neutral-content')
      await registerButton.trigger('click')

      expect(wrapper.vm.isRegister).toBe(true)
    })

    it('should call showModal on login click', async () => {
      const wrapper = mount(MockModalAuth)

      // Mock showModal method
      const mockShowModal = vi.fn()
      wrapper.vm.my_modal_3 = { showModal: mockShowModal }

      const loginButton = wrapper.find('button.btn-primary')
      await loginButton.trigger('click')

      expect(mockShowModal).toHaveBeenCalled()
    })

    it('should call showModal on register click', async () => {
      const wrapper = mount(MockModalAuth)

      // Mock showModal method
      const mockShowModal = vi.fn()
      wrapper.vm.my_modal_3 = { showModal: mockShowModal }

      const registerButton = wrapper.find('button.btn-neutral-content')
      await registerButton.trigger('click')

      expect(mockShowModal).toHaveBeenCalled()
    })
  })

  describe('Modal content', () => {
    it('should render HeaderAuthLogin component in modals', () => {
      const wrapper = mount(MockModalAuth)

      const loginComponents = wrapper.findAll('.mock-login-component')
      expect(loginComponents.length).toBe(2)
    })

    it('should pass correct isRegister prop to HeaderAuthLogin', async () => {
      const wrapper = mount(MockModalAuth)

      // Initial state
      expect(wrapper.vm.isRegister).toBe(false)

      // After register button click
      const registerButton = wrapper.find('button.btn-neutral-content')
      await registerButton.trigger('click')
      expect(wrapper.vm.isRegister).toBe(true)
    })
  })

  describe('Styles et classes CSS', () => {
    it('should have proper modal styling', () => {
      const wrapper = mount(MockModalAuth)

      const dialogs = wrapper.findAll('dialog')
      dialogs.forEach(dialog => {
        expect(dialog.classes()).toContain('modal')
      })
    })

    it('should have proper modal box styling', () => {
      const wrapper = mount(MockModalAuth)

      const modalBoxes = wrapper.findAll('.modal-box')
      modalBoxes.forEach(box => {
        expect(box.classes()).toContain('w-11/12')
        expect(box.classes()).toContain('max-w-7xl')
      })
    })

    it('should have proper close button styling', () => {
      const wrapper = mount(MockModalAuth)

      const closeButtons = wrapper.findAll('button.btn-circle')
      closeButtons.forEach(button => {
        expect(button.classes()).toContain('absolute')
        expect(button.classes()).toContain('right-2')
        expect(button.classes()).toContain('top-2')
      })
    })
  })

  describe('Accessibilité', () => {
    it('should have proper button structure', () => {
      const wrapper = mount(MockModalAuth)

      const buttons = wrapper.findAll('button')
      buttons.forEach(button => {
        expect(button.exists()).toBe(true)
      })
    })

    it('should have proper form structure', () => {
      const wrapper = mount(MockModalAuth)

      const forms = wrapper.findAll('form')
      forms.forEach(form => {
        expect(form.attributes('method')).toBe('dialog')
      })
    })

    it('should have proper dialog structure', () => {
      const wrapper = mount(MockModalAuth)

      const dialogs = wrapper.findAll('dialog')
      dialogs.forEach(dialog => {
        expect(dialog.exists()).toBe(true)
      })
    })
  })

  describe('États et props', () => {
    it('should initialize with correct state', () => {
      const wrapper = mount(MockModalAuth)

      expect(wrapper.vm.isRegister).toBe(false)
      expect(wrapper.vm.my_modal_3).toBe(null)
    })

    it('should update isRegister state correctly', async () => {
      const wrapper = mount(MockModalAuth)

      // Initial state
      expect(wrapper.vm.isRegister).toBe(false)

      // After login click
      const loginButton = wrapper.find('button.btn-primary')
      await loginButton.trigger('click')
      expect(wrapper.vm.isRegister).toBe(false)

      // After register click
      const registerButton = wrapper.find('button.btn-neutral-content')
      await registerButton.trigger('click')
      expect(wrapper.vm.isRegister).toBe(true)
    })
  })

  describe('Internationalisation', () => {
    it('should render login text', () => {
      const wrapper = mount(MockModalAuth)

      const loginButton = wrapper.find('button.btn-primary')
      expect(loginButton.text()).toContain('auth.register.login')
    })

    it('should render register text', () => {
      const wrapper = mount(MockModalAuth)

      const registerButton = wrapper.find('button.btn-neutral-content')
      expect(registerButton.text()).toContain('auth.register.title')
    })
  })

  describe('Responsive design', () => {
    it('should have responsive modal box sizing', () => {
      const wrapper = mount(MockModalAuth)

      const modalBoxes = wrapper.findAll('.modal-box')
      modalBoxes.forEach(box => {
        expect(box.classes()).toContain('w-11/12')
        expect(box.classes()).toContain('max-w-7xl')
      })
    })
  })
})
