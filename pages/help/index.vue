<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <!-- Sidebar menu (visible only on desktop) -->
    <div class="hidden md:block">
      <NotificationsMenu />
    </div>

    <!-- Main content -->
    <div class="md:col-span-3">
      <div class="bg-base-100 rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold mb-6 text-base-content">{{ t('drawer-content.notifications_support.help') }}</h1>

        <!-- Search bar -->
        <div class="mb-8">
          <div class="form-control">
            <div class="input-group">
              <input type="text" v-model="searchQuery" placeholder="Search for help..." class="input input-bordered w-full" />
              <button class="btn btn-square">
                <Search class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- FAQs section -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4 text-base-content">Frequently Asked Questions</h2>

          <div class="space-y-4">
            <div v-for="(faq, index) in filteredFaqs" :key="index" class="collapse collapse-arrow bg-base-200">
              <input type="checkbox" /> 
              <div class="collapse-title font-medium">
                {{ faq.question }}
              </div>
              <div class="collapse-content"> 
                <p>{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact support section -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4 text-base-content">Contact Support</h2>

          <div class="bg-base-200 p-6 rounded-lg">
            <p class="mb-4">Can't find what you're looking for? Our support team is here to help.</p>

            <form @submit.prevent="submitSupportRequest" class="space-y-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Subject</span>
                </label>
                <input type="text" v-model="supportForm.subject" placeholder="What do you need help with?" class="input input-bordered" required />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Message</span>
                </label>
                <textarea v-model="supportForm.message" class="textarea textarea-bordered h-24" placeholder="Please describe your issue in detail" required></textarea>
              </div>

              <div class="form-control">
                <button type="submit" class="btn btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Help resources section -->
        <div>
          <h2 class="text-xl font-semibold mb-4 text-base-content">Help Resources</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="card bg-base-200">
              <div class="card-body">
                <h3 class="card-title">
                  <BookOpen class="w-5 h-5 mr-2" />
                  User Guide
                </h3>
                <p>Comprehensive guide to using the platform</p>
                <div class="card-actions justify-end mt-2">
                  <button class="btn btn-sm btn-primary">View Guide</button>
                </div>
              </div>
            </div>

            <div class="card bg-base-200">
              <div class="card-body">
                <h3 class="card-title">
                  <Video class="w-5 h-5 mr-2" />
                  Video Tutorials
                </h3>
                <p>Step-by-step video guides for common tasks</p>
                <div class="card-actions justify-end mt-2">
                  <button class="btn btn-sm btn-primary">Watch Videos</button>
                </div>
              </div>
            </div>

            <div class="card bg-base-200">
              <div class="card-body">
                <h3 class="card-title">
                  <Users class="w-5 h-5 mr-2" />
                  Community Forum
                </h3>
                <p>Connect with other users and share experiences</p>
                <div class="card-actions justify-end mt-2">
                  <button class="btn btn-sm btn-primary">Join Forum</button>
                </div>
              </div>
            </div>

            <div class="card bg-base-200">
              <div class="card-body">
                <h3 class="card-title">
                  <FileText class="w-5 h-5 mr-2" />
                  Release Notes
                </h3>
                <p>Latest updates and feature releases</p>
                <div class="card-actions justify-end mt-2">
                  <button class="btn btn-sm btn-primary">View Updates</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, BookOpen, Video, Users, FileText } from 'lucide-vue-next'
import NotificationsMenu from '~/components/notifications/NotificationsMenu.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})

const { t } = useI18n()

// Search functionality
const searchQuery = ref('')

// FAQ data
const faqs = ref([
  {
    question: 'How do I sign up for volunteer opportunities?',
    answer: 'You can browse available opportunities on the main dashboard and click "Sign Up" on any mission that interests you. You\'ll receive a confirmation once your application is accepted.'
  },
  {
    question: 'Can I cancel my participation in a mission?',
    answer: 'Yes, you can cancel your participation up to 48 hours before the mission start time. Go to "My Participations" in the Activity section and click "Cancel Participation".'
  },
  {
    question: 'How do I track my volunteer hours?',
    answer: 'Your volunteer hours are automatically tracked for each mission you complete. You can view your total hours and history in the "Activity History" section.'
  },
  {
    question: 'How do I update my profile information?',
    answer: 'Go to "Account" > "Edit Profile" to update your personal information, skills, and preferences.'
  },
  {
    question: 'Can I create my own volunteer opportunities?',
    answer: 'Yes, if you have organization privileges. Go to "Create Mission" and fill out the required information. Your mission will be reviewed before being published.'
  }
])

// Filter FAQs based on search query
const filteredFaqs = computed(() => {
  if (!searchQuery.value) return faqs.value

  const query = searchQuery.value.toLowerCase()
  return faqs.value.filter(faq => 
    faq.question.toLowerCase().includes(query) || 
    faq.answer.toLowerCase().includes(query)
  )
})

// Support form
const supportForm = ref({
  subject: '',
  message: ''
})

// Submit support request
function submitSupportRequest() {
  // In a real app, this would make an API call to submit the support request
  console.log('Support request submitted:', supportForm.value)

  // Reset form
  supportForm.value = {
    subject: '',
    message: ''
  }

  // Show success message (in a real app)
  alert('Your support request has been submitted. We\'ll get back to you soon!')
}
</script>
