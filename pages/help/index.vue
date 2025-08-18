<template>
  <div class="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
    <!-- Header Section -->
    <div class="bg-base-100 shadow-lg border-b border-base-300">
      <div class="container mx-auto px-4 py-8">
        <div class="text-center max-w-4xl mx-auto">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6"
          >
            <CircleHelp class="w-8 h-8 text-primary" />
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-base-content mb-4">
            {{ t('help.title') }}
          </h1>
          <p class="text-lg text-base-content/70 mb-8 max-w-2xl mx-auto">
            {{ t('help.description') }}
          </p>

          <!-- Search Bar -->
          <div class="max-w-md mx-auto">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="t('help.search_placeholder')"
                class="input input-bordered w-full pl-12 pr-4 py-4 text-lg"
                :aria-label="t('help.search_placeholder')"
              />
              <Search
                class="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div
          v-for="(action, index) in quickActions"
          :key="index"
          class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
          @click="scrollToSection(action.section)"
        >
          <div class="card-body text-center p-6">
            <div
              class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors"
            >
              <component :is="action.icon" class="w-6 h-6 text-primary" />
            </div>
            <h3 class="font-semibold text-base-content mb-2">
              {{ action.title }}
            </h3>
            <p class="text-sm text-base-content/70">
              {{ action.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- FAQ Sections -->
      <div class="space-y-12">
        <!-- Getting Started -->
        <section id="getting-started" class="scroll-mt-20">
          <div class="bg-base-100 rounded-2xl shadow-lg p-8">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <Rocket class="w-6 h-6 text-success" />
              </div>
              <h2 class="text-2xl font-bold text-base-content">
                {{ t('help.sections.getting_started.title') }}
              </h2>
            </div>

            <div class="space-y-4">
              <div
                v-for="(faq, index) in filteredFaqs.gettingStarted"
                :key="index"
                class="collapse collapse-arrow bg-base-200 hover:bg-base-300 transition-colors"
              >
                <input type="checkbox" :aria-label="faq.question" />
                <div class="collapse-title text-base font-medium text-base-content">
                  {{ faq.question }}
                </div>
                <div class="collapse-content text-base-content/80">
                  <p class="leading-relaxed">
                    {{ faq.answer }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Account & Profile -->
        <section id="account-profile" class="scroll-mt-20">
          <div class="bg-base-100 rounded-2xl shadow-lg p-8">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <UserRound class="w-6 h-6 text-primary" />
              </div>
              <h2 class="text-2xl font-bold text-base-content">
                {{ t('help.sections.account_profile.title') }}
              </h2>
            </div>

            <div class="space-y-4">
              <div
                v-for="(faq, index) in filteredFaqs.accountProfile"
                :key="index"
                class="collapse collapse-arrow bg-base-200 hover:bg-base-300 transition-colors"
              >
                <input type="checkbox" :aria-label="faq.question" />
                <div class="collapse-title text-base font-medium text-base-content">
                  {{ faq.question }}
                </div>
                <div class="collapse-content text-base-content/80">
                  <p class="leading-relaxed">
                    {{ faq.answer }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Volunteering -->
        <section id="volunteering" class="scroll-mt-20">
          <div class="bg-base-100 rounded-2xl shadow-lg p-8">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <Heart class="w-6 h-6 text-secondary" />
              </div>
              <h2 class="text-2xl font-bold text-base-content">
                {{ t('help.sections.volunteering.title') }}
              </h2>
            </div>

            <div class="space-y-4">
              <div
                v-for="(faq, index) in filteredFaqs.volunteering"
                :key="index"
                class="collapse collapse-arrow bg-base-200 hover:bg-base-300 transition-colors"
              >
                <input type="checkbox" :aria-label="faq.question" />
                <div class="collapse-title text-base font-medium text-base-content">
                  {{ faq.question }}
                </div>
                <div class="collapse-content text-base-content/80">
                  <p class="leading-relaxed">
                    {{ faq.answer }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Associations -->
        <section id="associations" class="scroll-mt-20">
          <div class="bg-base-100 rounded-2xl shadow-lg p-8">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Building2 class="w-6 h-6 text-accent" />
              </div>
              <h2 class="text-2xl font-bold text-base-content">
                {{ t('help.sections.associations.title') }}
              </h2>
            </div>

            <div class="space-y-4">
              <div
                v-for="(faq, index) in filteredFaqs.associations"
                :key="index"
                class="collapse collapse-arrow bg-base-200 hover:bg-base-300 transition-colors"
              >
                <input type="checkbox" :aria-label="faq.question" />
                <div class="collapse-title text-base font-medium text-base-content">
                  {{ faq.question }}
                </div>
                <div class="collapse-content text-base-content/80">
                  <p class="leading-relaxed">
                    {{ faq.answer }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Technical Support -->
        <section id="technical" class="scroll-mt-20">
          <div class="bg-base-100 rounded-2xl shadow-lg p-8">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Settings class="w-6 h-6 text-warning" />
              </div>
              <h2 class="text-2xl font-bold text-base-content">
                {{ t('help.sections.technical.title') }}
              </h2>
            </div>

            <div class="space-y-4">
              <div
                v-for="(faq, index) in filteredFaqs.technical"
                :key="index"
                class="collapse collapse-arrow bg-base-200 hover:bg-base-300 transition-colors"
              >
                <input type="checkbox" :aria-label="faq.question" />
                <div class="collapse-title text-base font-medium text-base-content">
                  {{ faq.question }}
                </div>
                <div class="collapse-content text-base-content/80">
                  <p class="leading-relaxed">
                    {{ faq.answer }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Contact & Support -->
        <section id="contact" class="scroll-mt-20">
          <div class="bg-base-100 rounded-2xl shadow-lg p-8">
            <div class="text-center">
              <div
                class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
              >
                <MessageCircle class="w-8 h-8 text-primary" />
              </div>
              <h2 class="text-2xl font-bold text-base-content mb-4">
                {{ t('help.contact.title') }}
              </h2>
              <p class="text-base-content/70 mb-8">
                {{ t('help.contact.description') }}
              </p>

              <!-- Support Form -->
              <form class="space-y-6 max-w-md mx-auto" @submit.prevent="submitSupportRequest">
                <!-- Type de signalement -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">{{
                      t('help.contact.report.type_label')
                    }}</span>
                  </label>
                  <select
                    v-model="supportForm.type"
                    class="select select-bordered w-full"
                    required
                    @change="onTypeChange"
                  >
                    <option value="">{{ t('help.contact.report.types.select') }}</option>
                    <option value="TECHNICAL">
                      {{ t('help.contact.report.types.technical') }}
                    </option>
                    <option value="USER_FEEDBACK">
                      {{ t('help.contact.report.types.user_feedback') }}
                    </option>
                    <option value="OTHER">{{ t('help.contact.report.types.other') }}</option>
                  </select>
                </div>

                <!-- Catégorie -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">{{
                      t('help.contact.report.category_label')
                    }}</span>
                  </label>
                  <select
                    v-model="supportForm.category"
                    class="select select-bordered w-full"
                    required
                  >
                    <option value="">{{ t('help.contact.report.categories.select') }}</option>

                    <!-- Catégories pour les problèmes techniques -->
                    <optgroup
                      v-if="supportForm.type === 'TECHNICAL'"
                      :label="t('help.contact.report.types.technical')"
                    >
                      <option value="CONNECTION_ISSUE">
                        {{ t('help.contact.report.categories.technical.connection_issue') }}
                      </option>
                      <option value="IMAGE_NOT_LOADING">
                        {{ t('help.contact.report.categories.technical.image_not_loading') }}
                      </option>
                      <option value="RESPONSIVE_ISSUE">
                        {{ t('help.contact.report.categories.technical.responsive_issue') }}
                      </option>
                      <option value="SEARCH_PROBLEM">
                        {{ t('help.contact.report.categories.technical.search_problem') }}
                      </option>
                      <option value="FORM_NOT_WORKING">
                        {{ t('help.contact.report.categories.technical.form_not_working') }}
                      </option>
                      <option value="SLOW_PERFORMANCE">
                        {{ t('help.contact.report.categories.technical.slow_performance') }}
                      </option>
                      <option value="OTHER">
                        {{ t('help.contact.report.categories.technical.other') }}
                      </option>
                    </optgroup>

                    <!-- Catégories pour le feedback utilisateur -->
                    <optgroup
                      v-if="supportForm.type === 'USER_FEEDBACK'"
                      :label="t('help.contact.report.types.user_feedback')"
                    >
                      <option value="FEATURE_REQUEST">
                        {{ t('help.contact.report.categories.user_feedback.feature_request') }}
                      </option>
                      <option value="BUG_REPORT">
                        {{ t('help.contact.report.categories.user_feedback.bug_report') }}
                      </option>
                      <option value="USABILITY_ISSUE">
                        {{ t('help.contact.report.categories.user_feedback.usability_issue') }}
                      </option>
                      <option value="CONTENT_SUGGESTION">
                        {{ t('help.contact.report.categories.user_feedback.content_suggestion') }}
                      </option>
                      <option value="GENERAL_FEEDBACK">
                        {{ t('help.contact.report.categories.user_feedback.general_feedback') }}
                      </option>
                      <option value="OTHER">
                        {{ t('help.contact.report.categories.user_feedback.other') }}
                      </option>
                    </optgroup>

                    <!-- Catégories pour autres -->
                    <optgroup
                      v-if="supportForm.type === 'OTHER'"
                      :label="t('help.contact.report.types.other')"
                    >
                      <option value="GENERAL_INQUIRY">
                        {{ t('help.contact.report.categories.other.general_inquiry') }}
                      </option>
                      <option value="ACCOUNT_ISSUE">
                        {{ t('help.contact.report.categories.other.account_issue') }}
                      </option>
                      <option value="BILLING_QUESTION">
                        {{ t('help.contact.report.categories.other.billing_question') }}
                      </option>
                      <option value="PARTNERSHIP_REQUEST">
                        {{ t('help.contact.report.categories.other.partnership_request') }}
                      </option>
                      <option value="PRESS_INQUIRY">
                        {{ t('help.contact.report.categories.other.press_inquiry') }}
                      </option>
                      <option value="OTHER">
                        {{ t('help.contact.report.categories.other.other') }}
                      </option>
                    </optgroup>
                  </select>
                </div>
                <!-- URL de la page concernée (optionnel) -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">{{
                      t('help.contact.report.page_url_label')
                    }}</span>
                  </label>
                  <input
                    v-model="supportForm.customPageUrl"
                    type="url"
                    class="input input-bordered w-full"
                    :placeholder="t('help.contact.report.page_url_placeholder')"
                  />
                  <label class="label">
                    <span class="label-text-alt text-base-content/60">{{
                      t('help.contact.report.page_url_help')
                    }}</span>
                  </label>
                </div>

                <!-- Description -->
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">{{
                      t('help.contact.report.description_label')
                    }}</span>
                  </label>
                  <textarea
                    v-model="supportForm.description"
                    class="textarea textarea-bordered h-32"
                    :placeholder="t('help.contact.report.description_placeholder')"
                    required
                  />
                </div>

                <button type="submit" class="btn btn-primary w-full" :disabled="submitting">
                  <span v-if="submitting" class="loading loading-spinner loading-sm" />
                  {{ submitting ? t('help.contact.sending') : t('help.contact.send') }}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import {
    Search,
    CircleHelp,
    Rocket,
    UserRound,
    Heart,
    Building2,
    Settings,
    MessageCircle
  } from 'lucide-vue-next'
  import { useUser } from '~/composables/auth/useUser'

  definePageMeta({
    layout: 'app'
  })

  const user = useUser()
  const email = ref<string | null>(null)

  onMounted(async () => {
    const current = await user.fetchUser()
    if (current) {
      email.value = current.email
      console.log('User email:', email.value)
    }
  })

  const { t } = useI18n()

  const searchQuery = ref('')

  const quickActions = [
    {
      title: t('help.quick_actions.getting_started.title'),
      description: t('help.quick_actions.getting_started.description'),
      icon: Rocket,
      section: 'getting-started'
    },
    {
      title: t('help.quick_actions.account.title'),
      description: t('help.quick_actions.account.description'),
      icon: UserRound,
      section: 'account-profile'
    },
    {
      title: t('help.quick_actions.volunteering.title'),
      description: t('help.quick_actions.volunteering.description'),
      icon: Heart,
      section: 'volunteering'
    },
    {
      title: t('help.quick_actions.associations.title'),
      description: t('help.quick_actions.associations.description'),
      icon: Building2,
      section: 'associations'
    }
  ]

  interface FAQ {
    question: string
    answer: string
  }

  interface FAQSections {
    gettingStarted: FAQ[]
    accountProfile: FAQ[]
    volunteering: FAQ[]
    associations: FAQ[]
    technical: FAQ[]
  }

  const faqs: FAQSections = {
    gettingStarted: [
      {
        question: t('help.faqs.getting_started.q1'),
        answer: t('help.faqs.getting_started.a1')
      },
      {
        question: t('help.faqs.getting_started.q2'),
        answer: t('help.faqs.getting_started.a2')
      },
      {
        question: t('help.faqs.getting_started.q3'),
        answer: t('help.faqs.getting_started.a3')
      },
      {
        question: t('help.faqs.getting_started.q4'),
        answer: t('help.faqs.getting_started.a4')
      }
    ],
    accountProfile: [
      {
        question: t('help.faqs.account.q1'),
        answer: t('help.faqs.account.a1')
      },
      {
        question: t('help.faqs.account.q2'),
        answer: t('help.faqs.account.a2')
      },
      {
        question: t('help.faqs.account.q3'),
        answer: t('help.faqs.account.a3')
      },
      {
        question: t('help.faqs.account.q4'),
        answer: t('help.faqs.account.a4')
      }
    ],
    volunteering: [
      {
        question: t('help.faqs.volunteering.q1'),
        answer: t('help.faqs.volunteering.a1')
      },
      {
        question: t('help.faqs.volunteering.q2'),
        answer: t('help.faqs.volunteering.a2')
      },
      {
        question: t('help.faqs.volunteering.q3'),
        answer: t('help.faqs.volunteering.a3')
      },
      {
        question: t('help.faqs.volunteering.q4'),
        answer: t('help.faqs.volunteering.a4')
      }
    ],
    associations: [
      {
        question: t('help.faqs.associations.q1'),
        answer: t('help.faqs.associations.a1')
      },
      {
        question: t('help.faqs.associations.q2'),
        answer: t('help.faqs.associations.a2')
      },
      {
        question: t('help.faqs.associations.q3'),
        answer: t('help.faqs.associations.a3')
      },
      {
        question: t('help.faqs.associations.q4'),
        answer: t('help.faqs.associations.a4')
      }
    ],
    technical: [
      {
        question: t('help.faqs.technical.q1'),
        answer: t('help.faqs.technical.a1')
      },
      {
        question: t('help.faqs.technical.q2'),
        answer: t('help.faqs.technical.a2')
      },
      {
        question: t('help.faqs.technical.q3'),
        answer: t('help.faqs.technical.a3')
      },
      {
        question: t('help.faqs.technical.q4'),
        answer: t('help.faqs.technical.a4')
      }
    ]
  }

  const filteredFaqs = computed(() => {
    if (!searchQuery.value) {
      return faqs
    }

    const query = searchQuery.value.toLowerCase()
    const filtered: Partial<FAQSections> = {}

    Object.keys(faqs).forEach(section => {
      const sectionKey = section as keyof FAQSections
      filtered[sectionKey] = faqs[sectionKey].filter(
        (faq: FAQ) =>
          faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query)
      )
    })

    return filtered
  })

  const supportForm = ref({
    type: '',
    category: '',
    description: '',
    customPageUrl: '',
    userEmail: email.value || '',
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
    browserInfo:
      typeof window !== 'undefined' ? `${navigator.appName} ${navigator.appVersion}` : '',
    deviceInfo: typeof window !== 'undefined' ? `${navigator.platform}` : ''
  })

  const submitting = ref(false)

  function onTypeChange() {
    supportForm.value.category = ''
  }

  async function testApiConnectivity() {
    try {
      const response = (await $fetch('/api/support/test')) as any
      process.env.NODE_ENV !== 'production' && console.log('API test response:', response)
      return response.status === 'success'
    } catch (error) {
      process.env.NODE_ENV !== 'production' && console.error('API test failed:', error)
      return false
    }
  }

  async function submitSupportRequest() {
    submitting.value = true

    try {
      if (
        !supportForm.value.type ||
        !supportForm.value.category ||
        !supportForm.value.description
      ) {
        const missingFields = []
        if (!supportForm.value.type) missingFields.push('Type')
        if (!supportForm.value.category) missingFields.push('Catégorie')
        if (!supportForm.value.description) missingFields.push('Description')

        alert(`Veuillez remplir tous les champs obligatoires : ${missingFields.join(', ')}`)
        return
      }

      if (supportForm.value.description.trim().length < 10) {
        alert('La description doit contenir au moins 10 caractères')
        return
      }

      if (process.env.NODE_ENV !== 'production') {
        const isApiConnected = await testApiConnectivity()
        if (!isApiConnected) {
          console.warn('API backend might not be available')
        }
      }

      const finalPageUrl = supportForm.value.customPageUrl.trim() || supportForm.value.pageUrl

      const requestData = {
        type: supportForm.value.type,
        category: supportForm.value.category,
        description: supportForm.value.description,
        pageUrl: finalPageUrl,
        userEmail: email.value || supportForm.value.userEmail,
        userAgent: supportForm.value.userAgent,
        browserInfo: supportForm.value.browserInfo,
        deviceInfo: supportForm.value.deviceInfo
      }

      process.env.NODE_ENV !== 'production' && console.log('Sending request data:', requestData)

      await $fetch('/api/support/reports', {
        method: 'POST',
        body: requestData
      })

      // Reset form
      supportForm.value = {
        type: '',
        category: '',
        description: '',
        customPageUrl: '',
        userEmail: '',
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
        browserInfo:
          typeof window !== 'undefined' ? `${navigator.appName} ${navigator.appVersion}` : '',
        deviceInfo: typeof window !== 'undefined' ? `${navigator.platform}` : ''
      }

      // Show success message
      alert(t('help.contact.success_message'))
    } catch (error: any) {
      process.env.NODE_ENV !== 'production' &&
        console.error('Error submitting support request:', error)

      // Afficher un message d'erreur plus détaillé
      let errorMessage = t('help.contact.error_message')
      if (error.data?.message) {
        errorMessage = error.data.message
      } else if (error.statusMessage) {
        errorMessage = error.statusMessage
      }

      alert(errorMessage)
    } finally {
      submitting.value = false
    }
  }

  // Scroll to section
  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
</script>

<style scoped>
  /* Custom scrollbar for better UX */
  .collapse-content::-webkit-scrollbar {
    width: 4px;
  }

  .collapse-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .collapse-content::-webkit-scrollbar-thumb {
    background: hsl(var(--bc) / 0.2);
    border-radius: 2px;
  }

  .collapse-content::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--bc) / 0.4);
  }

  /* Smooth transitions */
  .collapse {
    transition: all 0.3s ease;
  }

  .collapse-title {
    transition: all 0.3s ease;
  }

  .collapse-content {
    transition: all 0.3s ease;
  }

  /* Hover effects */
  .card:hover {
    transform: translateY(-2px);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .container {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
</style>
