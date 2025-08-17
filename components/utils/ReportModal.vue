<template>
  <div v-if="isOpen" class="modal modal-open">
    <div class="modal-box max-w-2xl w-full mx-4 sm:mx-6 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4 sm:mb-6">
        <h3 class="text-lg sm:text-xl font-bold text-base-content pr-2">
          {{
            isAnnouncementReport
              ? t('help.contact.report.announcement_title')
              : t('help.contact.report.title')
          }}
        </h3>
        <button
          class="btn btn-sm btn-circle btn-ghost flex-shrink-0"
          :aria-label="t('common.close')"
          @click="closeModal"
        >
          <X class="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <form class="space-y-4 sm:space-y-6" @submit.prevent="submitReport">
        <!-- Type de signalement -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium text-sm sm:text-base">{{
              t('help.contact.report.type_label')
            }}</span>
          </label>
          <select
            v-model="reportForm.type"
            class="select select-bordered w-full text-sm sm:text-base"
            required
            @change="onTypeChange"
          >
            <option value="">
              {{ t('help.contact.report.types.select') }}
            </option>
            <option value="ANNOUNCEMENT">
              {{ t('help.contact.report.types.announcement') }}
            </option>
            <option value="TECHNICAL">
              {{ t('help.contact.report.types.technical') }}
            </option>
            <option value="USER_FEEDBACK">
              {{ t('help.contact.report.types.user_feedback') }}
            </option>
            <option value="OTHER">
              {{ t('help.contact.report.types.other') }}
            </option>
          </select>
        </div>

        <!-- Catégorie -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium text-sm sm:text-base">{{
              t('help.contact.report.category_label')
            }}</span>
          </label>
          <select
            v-model="reportForm.category"
            class="select select-bordered w-full text-sm sm:text-base"
            required
          >
            <option value="">
              {{ t('help.contact.report.categories.select') }}
            </option>

            <!-- Catégories pour les annonces -->
            <optgroup
              v-if="reportForm.type === 'ANNOUNCEMENT'"
              :label="t('help.contact.report.types.announcement')"
            >
              <option value="INAPPROPRIATE_CONTENT">
                {{ t('help.contact.report.categories.announcement.inappropriate_content') }}
              </option>
              <option value="OUTDATED_INFO">
                {{ t('help.contact.report.categories.announcement.outdated_info') }}
              </option>
              <option value="WRONG_ADDRESS">
                {{ t('help.contact.report.categories.announcement.wrong_address') }}
              </option>
              <option value="WRONG_DATE_TIME">
                {{ t('help.contact.report.categories.announcement.wrong_date_time') }}
              </option>
              <option value="WRONG_CAPACITY">
                {{ t('help.contact.report.categories.announcement.wrong_capacity') }}
              </option>
              <option value="INAPPROPRIATE_TAGS">
                {{ t('help.contact.report.categories.announcement.inappropriate_tags') }}
              </option>
              <option value="OTHER">
                {{ t('help.contact.report.categories.announcement.other') }}
              </option>
            </optgroup>

            <!-- Catégories pour les problèmes techniques -->
            <optgroup
              v-if="reportForm.type === 'TECHNICAL'"
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
              v-if="reportForm.type === 'USER_FEEDBACK'"
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
              v-if="reportForm.type === 'OTHER'"
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

        <!-- Description -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium text-sm sm:text-base">{{
              t('help.contact.report.description_label')
            }}</span>
          </label>
          <textarea
            v-model="reportForm.description"
            class="textarea textarea-bordered h-24 sm:h-32 text-sm sm:text-base resize-none"
            :placeholder="t('help.contact.report.description_placeholder')"
            required
          />
        </div>

        <!-- Informations supplémentaires -->
        <div class="bg-base-200 rounded-lg p-3 sm:p-4">
          <h4 class="font-medium mb-2 sm:mb-3 text-sm sm:text-base">
            {{ t('help.contact.report.auto_info') }}
          </h4>
          <div class="text-xs sm:text-sm text-base-content/70 space-y-1 sm:space-y-2">
            <div v-if="reportForm.pageUrl" class="break-all">
              <strong>{{ t('help.contact.report.page') }}:</strong>
              <span class="truncate block">{{ reportForm.pageUrl }}</span>
            </div>
            <div v-if="reportForm.userEmail" class="break-all">
              <strong>{{ t('help.contact.report.email') }}:</strong>
              <span class="truncate block">{{ reportForm.userEmail }}</span>
            </div>
            <div v-if="reportForm.announcementId" class="break-all">
              <strong>{{ t('help.contact.report.announcement_id') }}:</strong>
              <span class="truncate block">{{ reportForm.announcementId }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="modal-action flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            type="button"
            class="btn btn-ghost btn-sm sm:btn-md w-full sm:w-auto"
            :disabled="submitting"
            @click="closeModal"
          >
            {{ t('help.contact.report.cancel') }}
          </button>
          <button
            type="submit"
            class="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
            :disabled="submitting || !isFormValid"
          >
            <span v-if="submitting" class="loading loading-spinner loading-sm" />
            <span class="truncate">
              {{
                submitting ? t('help.contact.report.submitting') : t('help.contact.report.submit')
              }}
            </span>
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

  const { t } = useI18n()

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

  const submitting = ref(false)

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

      process.env.NODE_ENV !== 'production' &&
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
      process.env.NODE_ENV !== 'production' && console.error('Error submitting report:', error)
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
    @apply fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4;
  }

  .modal-box {
    @apply bg-base-100 rounded-lg shadow-xl w-full max-w-2xl;
  }

  /* Amélioration de la responsivité pour les petits écrans */
  @media (max-width: 640px) {
    .modal-box {
      @apply mx-2;
    }
  }

  /* Optimisation pour les très petits écrans */
  @media (max-width: 480px) {
    .modal-box {
      @apply mx-1;
    }
  }
</style>
