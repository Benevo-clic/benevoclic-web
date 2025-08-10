<template>
  <div v-if="isOpen" class="modal modal-open">
    <div class="modal-box max-w-2xl">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-base-content">
          {{
            isAnnouncementReport
              ? translate('help.report.announcement_title', 'Signaler une annonce')
              : translate('help.report.title', 'Signaler un problème')
          }}
        </h3>
        <button
          class="btn btn-sm btn-circle btn-ghost"
          aria-label="Fermer le modal"
          @click="closeModal"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <form class="space-y-6" @submit.prevent="submitReport">
        <!-- Type de signalement -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{
              translate('help.report.type_label', 'Type de signalement')
            }}</span>
          </label>
          <select
            v-model="reportForm.type"
            class="select select-bordered w-full"
            required
            @change="onTypeChange"
          >
            <option value="">
              {{ translate('help.report.types.select', 'Sélectionner un type') }}
            </option>
            <option value="ANNOUNCEMENT">
              {{ translate('help.report.types.announcement', 'Annonce') }}
            </option>
            <option value="TECHNICAL">
              {{ translate('help.report.types.technical', 'Problème technique') }}
            </option>
            <option value="USER_FEEDBACK">
              {{ translate('help.report.types.user_feedback', 'Feedback utilisateur') }}
            </option>
            <option value="OTHER">
              {{ translate('help.report.types.other', 'Autre') }}
            </option>
          </select>
        </div>

        <!-- Catégorie -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{
              translate('help.report.category_label', 'Catégorie')
            }}</span>
          </label>
          <select v-model="reportForm.category" class="select select-bordered w-full" required>
            <option value="">
              {{ translate('help.report.categories.select', 'Sélectionner une catégorie') }}
            </option>

            <!-- Catégories pour les annonces -->
            <optgroup
              v-if="reportForm.type === 'ANNOUNCEMENT'"
              :label="translate('help.report.types.announcement', 'Annonce')"
            >
              <option value="INAPPROPRIATE_CONTENT">
                {{
                  translate(
                    'help.report.categories.announcement.inappropriate_content',
                    'Contenu inapproprié'
                  )
                }}
              </option>
              <option value="OUTDATED_INFO">
                {{
                  translate(
                    'help.report.categories.announcement.outdated_info',
                    'Informations obsolètes'
                  )
                }}
              </option>
              <option value="WRONG_ADDRESS">
                {{
                  translate(
                    'help.report.categories.announcement.wrong_address',
                    'Adresse incorrecte'
                  )
                }}
              </option>
              <option value="WRONG_DATE_TIME">
                {{
                  translate(
                    'help.report.categories.announcement.wrong_date_time',
                    'Date/heure incorrecte'
                  )
                }}
              </option>
              <option value="WRONG_CAPACITY">
                {{
                  translate(
                    'help.report.categories.announcement.wrong_capacity',
                    'Capacité incorrecte'
                  )
                }}
              </option>
              <option value="INAPPROPRIATE_TAGS">
                {{
                  translate(
                    'help.report.categories.announcement.inappropriate_tags',
                    'Tags inappropriés'
                  )
                }}
              </option>
              <option value="OTHER">
                {{ translate('help.report.categories.announcement.other', 'Autre') }}
              </option>
            </optgroup>

            <!-- Catégories pour les problèmes techniques -->
            <optgroup
              v-if="reportForm.type === 'TECHNICAL'"
              :label="translate('help.report.types.technical', 'Problème technique')"
            >
              <option value="CONNECTION_ISSUE">
                {{
                  translate(
                    'help.report.categories.technical.connection_issue',
                    'Problème de connexion'
                  )
                }}
              </option>
              <option value="IMAGE_NOT_LOADING">
                {{
                  translate(
                    'help.report.categories.technical.image_not_loading',
                    'Images qui ne se chargent pas'
                  )
                }}
              </option>
              <option value="RESPONSIVE_ISSUE">
                {{
                  translate(
                    'help.report.categories.technical.responsive_issue',
                    "Problème d'affichage mobile"
                  )
                }}
              </option>
              <option value="SEARCH_PROBLEM">
                {{
                  translate(
                    'help.report.categories.technical.search_problem',
                    'Problème de recherche'
                  )
                }}
              </option>
              <option value="FORM_NOT_WORKING">
                {{
                  translate(
                    'help.report.categories.technical.form_not_working',
                    'Formulaire qui ne fonctionne pas'
                  )
                }}
              </option>
              <option value="SLOW_PERFORMANCE">
                {{
                  translate(
                    'help.report.categories.technical.slow_performance',
                    'Performance lente'
                  )
                }}
              </option>
              <option value="OTHER">
                {{ translate('help.report.categories.technical.other', 'Autre') }}
              </option>
            </optgroup>

            <!-- Catégories pour le feedback utilisateur -->
            <optgroup
              v-if="reportForm.type === 'USER_FEEDBACK'"
              :label="translate('help.report.types.user_feedback', 'Feedback utilisateur')"
            >
              <option value="FEATURE_REQUEST">
                {{
                  translate(
                    'help.report.categories.user_feedback.feature_request',
                    'Demande de fonctionnalité'
                  )
                }}
              </option>
              <option value="BUG_REPORT">
                {{
                  translate('help.report.categories.user_feedback.bug_report', 'Signalement de bug')
                }}
              </option>
              <option value="USABILITY_ISSUE">
                {{
                  translate(
                    'help.report.categories.user_feedback.usability_issue',
                    "Problème d'ergonomie"
                  )
                }}
              </option>
              <option value="CONTENT_SUGGESTION">
                {{
                  translate(
                    'help.report.categories.user_feedback.content_suggestion',
                    'Suggestion de contenu'
                  )
                }}
              </option>
              <option value="GENERAL_FEEDBACK">
                {{
                  translate(
                    'help.report.categories.user_feedback.general_feedback',
                    'Feedback général'
                  )
                }}
              </option>
              <option value="OTHER">
                {{ translate('help.report.categories.user_feedback.other', 'Autre') }}
              </option>
            </optgroup>

            <!-- Catégories pour autres -->
            <optgroup
              v-if="reportForm.type === 'OTHER'"
              :label="translate('help.report.types.other', 'Autre')"
            >
              <option value="GENERAL_INQUIRY">
                {{ translate('help.report.categories.other.general_inquiry', 'Question générale') }}
              </option>
              <option value="ACCOUNT_ISSUE">
                {{ translate('help.report.categories.other.account_issue', 'Problème de compte') }}
              </option>
              <option value="BILLING_QUESTION">
                {{
                  translate(
                    'help.report.categories.other.billing_question',
                    'Question de facturation'
                  )
                }}
              </option>
              <option value="PARTNERSHIP_REQUEST">
                {{
                  translate(
                    'help.report.categories.other.partnership_request',
                    'Demande de partenariat'
                  )
                }}
              </option>
              <option value="PRESS_INQUIRY">
                {{ translate('help.report.categories.other.press_inquiry', 'Demande de presse') }}
              </option>
              <option value="OTHER">
                {{ translate('help.report.categories.other.other', 'Autre') }}
              </option>
            </optgroup>
          </select>
        </div>

        <!-- Description -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{
              translate('help.report.description_label', 'Description détaillée')
            }}</span>
          </label>
          <textarea
            v-model="reportForm.description"
            class="textarea textarea-bordered h-32"
            :placeholder="
              translate('help.report.description_placeholder', 'Décrivez le problème en détail...')
            "
            required
          />
        </div>

        <!-- Informations supplémentaires -->
        <div class="bg-base-200 rounded-lg p-4">
          <h4 class="font-medium mb-3">
            {{ translate('help.report.auto_info', 'Informations automatiques') }}
          </h4>
          <div class="text-sm text-base-content/70 space-y-2">
            <div v-if="reportForm.pageUrl">
              <strong>{{ translate('help.report.page', 'Page') }}:</strong>
              {{ reportForm.pageUrl }}
            </div>
            <div v-if="reportForm.userEmail">
              <strong>{{ translate('help.report.email', 'Email') }}:</strong>
              {{ reportForm.userEmail }}
            </div>
            <div v-if="reportForm.announcementId">
              <strong>{{ translate('help.report.announcement_id', 'Annonce ID') }}:</strong>
              {{ reportForm.announcementId }}
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="modal-action">
          <button type="button" class="btn btn-ghost" :disabled="submitting" @click="closeModal">
            {{ translate('help.report.cancel', 'Annuler') }}
          </button>
          <button type="submit" class="btn btn-primary" :disabled="submitting || !isFormValid">
            <span v-if="submitting" class="loading loading-spinner loading-sm" />
            {{
              submitting
                ? translate('help.report.submitting', 'Envoi en cours...')
                : translate('help.report.submit', 'Envoyer le signalement')
            }}
          </button>
        </div>
      </form>
    </div>

    <!-- Overlay pour fermer le modal -->
    <div class="modal-backdrop" @click="closeModal" />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { X } from 'lucide-vue-next'

  interface ReportForm {
    type: string
    category: string
    description: string
    announcementId?: string
    userEmail?: string
    pageUrl?: string
    userAgent?: string
    browserInfo?: string
    deviceInfo?: string
  }

  interface Props {
    isOpen: boolean
    announcementId?: string
    announcementTitle?: string
    userEmail?: string
  }

  const props = defineProps<Props>()
  const emit = defineEmits<{
    close: []
    submitted: [success: boolean]
  }>()

  const { t } = useI18n()
  const submitting = ref(false)

  // Fonction de traduction avec fallback
  function translate(key: string, fallback: string = key): string {
    try {
      const translation = t(key)
      return translation !== key ? translation : fallback
    } catch (error) {
      console.warn(`Translation key not found: ${key}`, error)
      return fallback
    }
  }

  const reportForm = ref<ReportForm>({
    type: '',
    category: '',
    description: '',
    announcementId: props.announcementId,
    userEmail: props.userEmail,
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
    browserInfo:
      typeof window !== 'undefined' ? `${navigator.appName} ${navigator.appVersion}` : '',
    deviceInfo: typeof window !== 'undefined' ? `${navigator.platform}` : ''
  })

  const isAnnouncementReport = computed(() => reportForm.value.type === 'ANNOUNCEMENT')

  const isFormValid = computed(() => {
    return (
      reportForm.value.type &&
      reportForm.value.category &&
      reportForm.value.description.trim().length > 0
    )
  })

  function onTypeChange() {
    // Reset category when type changes
    reportForm.value.category = ''
  }

  function closeModal() {
    if (!submitting.value) {
      emit('close')
    }
  }

  async function submitReport() {
    if (!isFormValid.value) {
      return
    }

    submitting.value = true

    try {
      // Nettoyer les données avant l'envoi
      const reportData = { ...reportForm.value }

      // Ne pas envoyer l'email s'il est vide
      if (!reportData.userEmail || reportData.userEmail.trim() === '') {
        delete reportData.userEmail
      }

      // Ne pas envoyer l'ID d'annonce pour les signalements non-annonce
      if (reportData.type !== 'ANNOUNCEMENT' && reportData.announcementId) {
        delete reportData.announcementId
      }

      const response = await $fetch('/api/support/reports', {
        method: 'POST',
        body: reportData
      })

      console.log('Report submitted successfully:', response)

      // Reset form
      reportForm.value = {
        type: '',
        category: '',
        description: '',
        announcementId: props.announcementId,
        userEmail: props.userEmail,
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
        browserInfo:
          typeof window !== 'undefined' ? `${navigator.appName} ${navigator.appVersion}` : '',
        deviceInfo: typeof window !== 'undefined' ? `${navigator.platform}` : ''
      }

      emit('submitted', true)
      closeModal()
    } catch (error) {
      console.error('Error submitting report:', error)
      emit('submitted', false)
    } finally {
      submitting.value = false
    }
  }

  // Watch for prop changes to update form
  watch(
    () => props.announcementId,
    newId => {
      reportForm.value.announcementId = newId
    }
  )

  watch(
    () => props.userEmail,
    newEmail => {
      reportForm.value.userEmail = newEmail
    }
  )
</script>

<style scoped>
  .modal-backdrop {
    @apply fixed inset-0 bg-black bg-opacity-50;
  }

  .modal {
    @apply fixed inset-0 z-50 flex items-center justify-center;
  }

  .modal-box {
    @apply bg-base-100 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto;
  }
</style>
