import { vi } from 'vitest'

export const useI18n = vi.fn(() => ({
  t: key => {
    // Retourner les vraies traductions françaises pour les tests
    const translations = {
      'announcementDetails.actions.edit': 'Modifier',
      'announcementDetails.location': 'Lieu :',
      'announcementDetails.status': 'Statut :',
      'announcementDetails.no_announcement': 'Aucune annonce sélectionnée.',
      'announcementDetails.tag_aria_label': 'Tag:',
      'eventFiltersDrawer.title': 'Filtres avancés',
      'eventFiltersDrawer.search.placeholder': 'Recherche...',
      'eventFiltersDrawer.tags.placeholder': 'Tags (virgules)',
      'eventFiltersDrawer.status.all_statuses': 'Tous statuts',
      'eventFiltersDrawer.status.pending': 'En attente',
      'eventFiltersDrawer.status.active': 'Active',
      'eventFiltersDrawer.status.completed': 'Complet',
      'eventFiltersDrawer.status.closed': 'Clôturée',
      'eventFiltersDrawer.city.placeholder': 'Ville',
      'eventFiltersDrawer.postal_code.placeholder': 'Code postal',
      'eventFiltersDrawer.association_type.all_types': "Tous types d'association",
      'eventFiltersDrawer.association_type.solidarity': 'Solidaire',
      'eventFiltersDrawer.association_type.sport': 'Sport',
      'eventFiltersDrawer.association_type.culture': 'Culture',
      'eventFiltersDrawer.dates.start_date': 'Date de début',
      'eventFiltersDrawer.dates.end_date': 'Date de fin',
      'eventFiltersDrawer.dates.start_time': 'Heure de début',
      'eventFiltersDrawer.dates.end_time': 'Heure de fin',
      'eventFiltersDrawer.actions.validate': 'Valider',
      'eventFiltersDrawer.actions.cancel': 'Annuler',
      'eventFiltersDrawer.search.aria_label': 'Champ de saisie',
      'eventFiltersDrawer.tags.aria_label': 'Champ de saisie',
      'requestItem.volunteer_avatar_alt': 'John Doe',
      'requestItem.event_context': "Pour l'événement :",
      'requestItem.association_context': "Demande d'adhésion à l'association",
      'requestItem.actions.accept': 'Accepter',
      'requestItem.actions.refuse': 'Refuser',
      'uploadCoverForm.upload_area.click_to_add': 'Cliquez pour ajouter une photo de couverture',
      'uploadCoverForm.upload_area.file_types': "JPG, PNG, GIF jusqu'à 10MB",
      'uploadCoverForm.file_input.aria_label': 'Champ de saisie',
      'presenceModal.title': 'Marquer la présence',
      'presenceModal.description': 'Souhaitez-vous marquer John Doe comme',
      'presenceModal.present': 'présent',
      'presenceModal.absent': 'absent',
      'presenceModal.confirm': 'Confirmer',
      'presenceModal.cancel': 'Annuler'
    }
    return translations[key] || key
  },
  locale: 'fr',
  locales: ['fr', 'en', 'es'],
  setLocale: vi.fn()
}))

export const useCookie = vi.fn(() => ({
  value: 'fr',
  set: vi.fn()
}))

export const useHead = vi.fn()
export const useSeoMeta = vi.fn()
export const useLazyFetch = vi.fn()
export const useFetch = vi.fn()
export const $fetch = vi.fn()
export const navigateTo = vi.fn()
export const useRoute = vi.fn(() => ({
  path: '/',
  query: {},
  params: {}
}))
export const useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn()
}))

export default {
  useI18n,
  useCookie,
  useHead,
  useSeoMeta,
  useLazyFetch,
  useFetch,
  $fetch,
  navigateTo,
  useRoute,
  useRouter
}
