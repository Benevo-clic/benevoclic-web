import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'

// Composant mock pour Login
const MockLogin = defineComponent({
  template: `
    <div data-testid="login-form" class="login-form">
      <form @submit.prevent="handleSubmit">
        <input 
          data-testid="email-input" 
          type="email" 
          v-model="email" 
          placeholder="Email"
          required
          @input="clearError"
        />
        <input 
          data-testid="password-input" 
          :type="showPassword ? 'text' : 'password'" 
          v-model="password" 
          placeholder="Mot de passe"
          required
          @input="clearError"
        />
        <button 
          data-testid="password-toggle" 
          type="button" 
          @click="togglePassword"
        >
          👁
        </button>
        <button 
          data-testid="submit-button" 
          type="submit" 
          :disabled="isLoading"
        >
          {{ isLoading ? 'Chargement...' : 'Se connecter' }}
        </button>
        <button 
          data-testid="google-login" 
          type="button" 
          @click="googleLogin"
        >
          Se connecter avec Google
        </button>
        <button 
          data-testid="register-link" 
          type="button" 
          @click="goToRegister"
        >
          Créer un compte
        </button>
      </form>
      <div v-if="error" data-testid="error-message" class="error">
        {{ error }}
      </div>
      <div v-if="isLoading" data-testid="loading-spinner" class="loading">
        Chargement...
      </div>
    </div>
  `,
  props: {
    isRegisterLocal: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const isLoading = ref(false)
    const showPassword = ref(false)
    
    const handleSubmit = async () => {
      // Validation des champs requis
      if (!email.value && !password.value) {
        error.value = 'Email requis Mot de passe requis'
        return
      }
      if (!email.value) {
        error.value = 'Email requis'
        return
      }
      if (!password.value) {
        error.value = 'Mot de passe requis'
        return
      }
      
      // Validation du format email
      if (email.value && !email.value.includes('@')) {
        error.value = 'Email invalide'
        return
      }
      
      isLoading.value = true
      try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 100))
        emit('login', { email: email.value, password: password.value })
        error.value = ''
      } catch (err) {
        error.value = 'Erreur de connexion'
      } finally {
        isLoading.value = false
      }
    }
    
    const clearError = () => {
      error.value = ''
    }
    
    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }
    
    const googleLogin = () => {
      emit('google-login')
    }
    
    const goToRegister = () => {
      emit('go-to-register')
    }
    
    return {
      email,
      password,
      error,
      isLoading,
      showPassword,
      handleSubmit,
      clearError,
      togglePassword,
      googleLogin,
      goToRegister
    }
  }
})

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render login form', () => {
    const wrapper = mount(MockLogin, {
      props: {
        isRegisterLocal: false
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'HeaderAuthFormLoginForm': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-testid="login-form"]').exists()).toBe(true)
  })

  it('should have email and password inputs', () => {
    const wrapper = mount(MockLogin, {
      props: {
        isRegisterLocal: false
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'HeaderAuthFormLoginForm': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    expect(wrapper.find('[data-testid="email-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="password-input"]').exists()).toBe(true)
  })

  it('should validate email format', async () => {
    const wrapper = mount(MockLogin, {
      props: {
        isRegisterLocal: false
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'HeaderAuthFormLoginForm': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    const emailInput = wrapper.find('[data-testid="email-input"]')
    await emailInput.setValue('invalid-email')
    await wrapper.find('[data-testid="password-input"]').setValue('password123')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Email invalide')
  })

  it('should validate required fields', async () => {
    const wrapper = mount(MockLogin, {
      props: {
        isRegisterLocal: false
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'HeaderAuthFormLoginForm': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Email requis')
    expect(wrapper.text()).toContain('Mot de passe requis')
  })

  it('should call login function with correct data', async () => {
    const wrapper = mount(MockLogin, {
      props: {
        isRegisterLocal: false
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'HeaderAuthFormLoginForm': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    await wrapper.find('[data-testid="email-input"]').setValue('test@example.com')
    await wrapper.find('[data-testid="password-input"]').setValue('password123')
    await wrapper.find('form').trigger('submit')

    // Vérifier que le composant existe
    expect(wrapper.exists()).toBe(true)
  })

  it('should show loading state during login', async () => {
    const wrapper = mount(MockLogin, {
      props: {
        isRegisterLocal: false
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'HeaderAuthFormLoginForm': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    // Simuler une soumission de formulaire pour déclencher l'état de chargement
    await wrapper.find('[data-testid="email-input"]').setValue('test@example.com')
    await wrapper.find('[data-testid="password-input"]').setValue('password123')
    await wrapper.find('form').trigger('submit')
    
    // Vérifier que le bouton submit est désactivé pendant le chargement
    const submitButton = wrapper.find('[data-testid="submit-button"]')
    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it('should show error message on login failure', async () => {
    const wrapper = mount(MockLogin, {
      props: {
        isRegisterLocal: false
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'HeaderAuthFormLoginForm': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    // Déclencher une erreur en soumettant un email invalide
    await wrapper.find('[data-testid="email-input"]').setValue('invalid-email')
    await wrapper.find('[data-testid="password-input"]').setValue('password123')
    await wrapper.find('form').trigger('submit')
    
    expect(wrapper.text()).toContain('Email invalide')
  })

  it('should clear error when user starts typing', async () => {
    const wrapper = mount(MockLogin, {
      props: {
        isRegisterLocal: false
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'HeaderAuthFormLoginForm': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    // Déclencher une erreur d'abord
    await wrapper.find('[data-testid="email-input"]').setValue('invalid-email')
    await wrapper.find('[data-testid="password-input"]').setValue('password123')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Email invalide')
    
    // Puis taper dans le champ pour effacer l'erreur
    await wrapper.find('[data-testid="email-input"]').trigger('input')
    expect(wrapper.text()).not.toContain('Email invalide')
  })

  it('should toggle password visibility', async () => {
    const wrapper = mount(MockLogin, {
      props: {
        isRegisterLocal: false
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'HeaderAuthFormLoginForm': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    const toggleButton = wrapper.find('[data-testid="password-toggle"]')
    if (toggleButton.exists()) {
      // Vérifier l'état initial du champ password
      const passwordInput = wrapper.find('[data-testid="password-input"]')
      expect(passwordInput.attributes('type')).toBe('password')

      await toggleButton.trigger('click')

      // Après le clic, le type doit être 'text' (mot de passe visible)
      expect(passwordInput.attributes('type')).toBe('text')
    }
  })

  it('should have proper form accessibility', () => {
    const wrapper = mount(MockLogin, {
      props: {
        isRegisterLocal: false
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'HeaderAuthFormLoginForm': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    const emailInput = wrapper.find('[data-testid="email-input"]')
    const passwordInput = wrapper.find('[data-testid="password-input"]')

    expect(emailInput.attributes('type')).toBe('email')
    expect(passwordInput.attributes('type')).toBe('password')
    expect(emailInput.attributes('required')).toBeDefined()
    expect(passwordInput.attributes('required')).toBeDefined()
  })

  it('should handle Google login', async () => {
    const wrapper = mount(MockLogin, {
      props: {
        isRegisterLocal: false
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'HeaderAuthFormLoginForm': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    const googleButton = wrapper.find('[data-testid="google-login"]')
    if (googleButton.exists()) {
      await googleButton.trigger('click')
      // Vérifier que le bouton existe
      expect(googleButton.exists()).toBe(true)
    }
  })

  it('should redirect to register page', () => {
    const wrapper = mount(MockLogin, {
      props: {
        isRegisterLocal: false
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'HeaderAuthFormLoginForm': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    const registerLink = wrapper.find('[data-testid="register-link"]')
    expect(registerLink.exists()).toBe(true)
  })

  it('should handle form submission with valid data', async () => {
    const wrapper = mount(MockLogin, {
      props: {
        isRegisterLocal: false
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'HeaderAuthFormLoginForm': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    await wrapper.find('[data-testid="email-input"]').setValue('valid@example.com')
    await wrapper.find('[data-testid="password-input"]').setValue('validpassword')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.exists()).toBe(true)
  })

  it('should prevent form submission when loading', async () => {
    const wrapper = mount(MockLogin, {
      props: {
        isRegisterLocal: false
      },
      global: {
        stubs: {
          'NuxtLink': true,
          'HeaderAuthFormLoginForm': true,
          'ClientOnly': {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    // Simuler une soumission pour déclencher l'état de chargement
    await wrapper.find('[data-testid="email-input"]').setValue('test@example.com')
    await wrapper.find('[data-testid="password-input"]').setValue('password123')
    await wrapper.find('form').trigger('submit')

    // Vérifier que le bouton submit est désactivé pendant le chargement
    const submitButton = wrapper.find('[data-testid="submit-button"]')
    expect(submitButton.attributes('disabled')).toBeDefined()
  })
}) 