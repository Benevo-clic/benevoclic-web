<template>
  <div v-if="isOpen" class="modal modal-open">
    <div
      class="modal-box w-11/12 sm:max-w-2xl bg-gradient-to-br from-base-100 to-base-200 shadow-2xl border border-base-300 max-h-[85dvh] overflow-y-auto p-4 sm:p-6"
    >
      <!-- Header avec bouton fermer -->
      <div
        class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-base-300"
      >
        <div class="min-w-0">
          <h3
            class="font-bold text-lg sm:text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            Détails du profil
          </h3>
          <p class="text-xs sm:text-sm text-gray-500 mt-1 break-words">
            Informations complètes de l'utilisateur
          </p>
        </div>
        <button
          @click="closeModal"
          aria-label="Fermer"
          class="btn btn-sm btn-circle btn-ghost self-end sm:self-auto hover:bg-base-300 transition-all duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Contenu du modal -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <!-- Message si le profil est privé -->
      <div v-else-if="isProfilePrivate" class="flex justify-center items-center py-8">
        <div class="text-center">
          <div class="text-6xl mb-4"></div>
          <h3 class="text-lg font-semibold mb-2">Profil privé</h3>
          <p class="text-gray-600">Ce profil n'est pas visible publiquement.</p>
        </div>
      </div>

      <div
        v-else-if="!volunteerDetails && !associationDetails"
        class="flex justify-center items-center py-8"
      >
        <div class="text-center">
          <div class="text-6xl mb-4"></div>
          <h3 class="text-lg font-semibold mb-2">Utilisateur non trouvé</h3>
          <p class="text-gray-600">Impossible de charger les détails de cet utilisateur.</p>
        </div>
      </div>

      <!-- Affichage pour un volontaire -->
      <div v-else-if="volunteerDetails" class="space-y-6">
        <!-- Section Avatar et Informations de base -->
        <div class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div v-if="props.profileImageUrl" class="avatar">
              <div
                class="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-4 ring-primary ring-offset-2 ring-offset-base-100 shadow-lg transition-all duration-300"
              >
                <img
                  :src="props.profileImageUrl"
                  :alt="`Photo de ${volunteerDetails.firstName} ${volunteerDetails.lastName}`"
                  class="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              </div>
            </div>
            <div v-else class="avatar placeholder">
              <div
                class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-primary ring-4 ring-primary ring-offset-2 ring-offset-base-100 flex items-center justify-center shadow-lg transition-all duration-300"
              >
                <span class="text-2xl sm:text-3xl font-bold">
                  {{ volunteerDetails.firstName?.charAt(0)?.toUpperCase() || '?' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Informations de base -->
          <div class="flex-1 min-w-0">
            <h2 class="text-xl sm:text-2xl font-bold mb-2 truncate">
              {{ volunteerDetails.firstName || '' }} {{ volunteerDetails.lastName || '' }}
            </h2>

            <!-- Badge Volontaire -->
            <div
              class="badge badge-primary mb-3 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Volontaire
            </div>

            <!-- Informations de contact (conditionnelles) -->
            <div v-if="volunteerSettings?.profileVisibility" class="space-y-2 text-sm break-words">
              <div v-if="volunteerDetails.email" class="flex items-center gap-2 min-w-0">
                <svg
                  class="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span class="truncate">{{ volunteerDetails.email }}</span>
              </div>

              <div v-if="volunteerDetails.phone" class="flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span class="break-words">{{ volunteerDetails.phone }}</span>
              </div>

              <div v-if="volunteerDetails.birthDate" class="flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>{{ formatDate(volunteerDetails.birthDate) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Bio (conditionnelle) -->
        <div
          v-if="volunteerDetails.bio && volunteerSettings?.profileVisibility"
          class="border-t pt-4"
        >
          <h4 class="font-semibold mb-2">À propos</h4>
          <p class="text-gray-700 leading-relaxed break-words">{{ volunteerDetails.bio }}</p>
        </div>

        <!-- Section Localisation (conditionnelle) -->
        <div
          v-if="
            (volunteerDetails.city || volunteerDetails.country) &&
            volunteerSettings?.profileVisibility
          "
          class="border-t pt-4"
        >
          <h4 class="font-semibold mb-2">Localisation</h4>
          <div class="flex items-start gap-2">
            <svg
              class="w-4 h-4 text-gray-500 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span class="text-gray-700 break-words">
              {{ [volunteerDetails.city, volunteerDetails.country].filter(Boolean).join(', ') }}
              {{ volunteerDetails.postalCode ? `(${volunteerDetails.postalCode})` : '' }}
            </span>
          </div>
        </div>

        <!-- Section Statistiques (conditionnelle) -->
        <div v-if="volunteerSettings?.profileVisibility" class="border-t pt-4">
          <h4 class="font-semibold mb-3">Statistiques</h4>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div
              class="stat bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-3 sm:p-4 border border-primary/20"
            >
              <div class="stat-figure text-primary">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="stat-title text-xs sm:text-sm font-medium text-gray-600">
                Participations
              </div>
              <div class="stat-value text-xl sm:text-2xl font-bold text-primary">
                {{ volunteerDetails.nbParticipations || 0 }}
              </div>
            </div>

            <div
              class="stat bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-3 sm:p-4 border border-secondary/20"
            >
              <div class="stat-figure text-secondary">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div class="stat-title text-xs sm:text-sm font-medium text-gray-600">Missions</div>
              <div class="stat-value text-xl sm:text-2xl font-bold text-secondary">
                {{ volunteerDetails.nbVolunteers || 0 }}
              </div>
            </div>

            <div
              class="stat bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-3 sm:p-4 border border-accent/20"
            >
              <div class="stat-figure text-accent">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div class="stat-title text-xs sm:text-sm font-medium text-gray-600">
                Associations
              </div>
              <div class="stat-value text-xl sm:text-2xl font-bold text-accent">
                {{ volunteerDetails.nbAssociations || 0 }}
              </div>
            </div>
          </div>
        </div>

        <!-- Section Statut (conditionnelle) -->
        <div v-if="volunteerSettings?.profileVisibility" class="border-t pt-4">
          <h4 class="font-semibold mb-3">Statut</h4>
          <div class="flex flex-wrap gap-2 sm:gap-3">
            <span
              v-if="volunteerDetails.isOnline"
              class="badge badge-success shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              En ligne
            </span>
            <span
              v-else
              class="badge badge-neutral shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                />
              </svg>
              Hors ligne
            </span>
            <span
              v-if="volunteerDetails.isVerified"
              class="badge badge-info shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Vérifié
            </span>
            <span
              v-if="volunteerDetails.disabled"
              class="badge badge-error shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                />
              </svg>
              Désactivé
            </span>
          </div>
        </div>

        <!-- Section Informations système (conditionnelle) -->
        <div v-if="volunteerSettings?.profileVisibility" class="border-t pt-4">
          <h4 class="font-semibold mb-2">Informations système</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
            <div>
              <span class="font-medium">Créé le:</span>
              <p class="text-gray-600">{{ formatDate(volunteerDetails.createdAt || '') }}</p>
            </div>
            <div>
              <span class="font-medium">Mis à jour le:</span>
              <p class="text-gray-600">{{ formatDate(volunteerDetails.updatedAt || '') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Affichage pour une association -->
      <div v-else-if="associationDetails" class="space-y-6">
        <!-- Section Avatar et Informations de base -->
        <div class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div v-if="props.profileImageUrl" class="avatar">
              <div
                class="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-4 ring-primary ring-offset-2 ring-offset-base-100 shadow-lg transition-all duration-300"
              >
                <img
                  :src="props.profileImageUrl"
                  :alt="`Photo de ${associationDetails.associationName}`"
                  class="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              </div>
            </div>
            <div v-else class="avatar placeholder">
              <div
                class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 text-secondary ring-4 ring-secondary ring-offset-2 ring-offset-base-100 flex items-center justify-center shadow-lg transition-all duration-300"
              >
                <span class="text-2xl sm:text-3xl font-bold">
                  {{ associationDetails.associationName?.charAt(0)?.toUpperCase() || '?' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Informations de base -->
          <div class="flex-1 min-w-0">
            <h2 class="text-xl sm:text-2xl font-bold mb-2 truncate">
              {{ associationDetails.associationName || '' }}
            </h2>

            <!-- Badge Association -->
            <div
              class="badge badge-secondary mb-3 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Association
            </div>

            <!-- Type d'association -->
            <div
              v-if="associationDetails.type"
              class="badge badge-outline mb-3 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {{ associationDetails.type }}
            </div>

            <!-- Informations de contact (conditionnelles) -->
            <div
              v-if="associationSettings?.contactInfoVisibility"
              class="space-y-2 text-sm break-words"
            >
              <div v-if="associationDetails.email" class="flex items-center gap-2 min-w-0">
                <svg
                  class="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span class="truncate">{{ associationDetails.email }}</span>
              </div>

              <div v-if="associationDetails.phone" class="flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span class="break-words">{{ associationDetails.phone }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Bio (conditionnelle) -->
        <div
          v-if="associationDetails.bio && associationSettings?.profileVisibility"
          class="border-t pt-4"
        >
          <h4 class="font-semibold mb-2">À propos</h4>
          <p class="text-gray-700 leading-relaxed break-words">{{ associationDetails.bio }}</p>
        </div>

        <!-- Section Localisation (conditionnelle) -->
        <div
          v-if="
            (associationDetails.city || associationDetails.country) &&
            associationSettings?.profileVisibility
          "
          class="border-t pt-4"
        >
          <h4 class="font-semibold mb-2">Localisation</h4>
          <div class="flex items-start gap-2">
            <svg
              class="w-4 h-4 text-gray-500 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span class="text-gray-700 break-words">
              {{ [associationDetails.city, associationDetails.country].filter(Boolean).join(', ') }}
              {{ associationDetails.postalCode ? `(${associationDetails.postalCode})` : '' }}
            </span>
          </div>
        </div>

        <!-- Section Statistiques (conditionnelles) -->
        <div v-if="associationSettings?.profileVisibility" class="border-t pt-4">
          <h4 class="font-semibold mb-3">Statistiques</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div
              v-if="associationSettings?.volunteerListVisibility"
              class="stat bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-3 sm:p-4 border border-primary/20"
            >
              <div class="stat-figure text-primary">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div class="stat-title text-xs sm:text-sm font-medium text-gray-600">Volontaires</div>
              <div class="stat-value text-xl sm:text-2xl font-bold text-primary">
                {{ associationDetails.volunteers || 0 }}
              </div>
            </div>

            <div
              class="stat bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-3 sm:p-4 border border-secondary/20"
            >
              <div class="stat-figure text-secondary">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div class="stat-title text-xs sm:text-sm font-medium text-gray-600">Annonces</div>
              <div class="stat-value text-xl sm:text-2xl font-bold text-secondary">
                {{ associationDetails.announcements || 0 }}
              </div>
            </div>
          </div>
        </div>

        <!-- Section Statut (conditionnelle) -->
        <div v-if="associationSettings?.profileVisibility" class="border-t pt-4">
          <h4 class="font-semibold mb-3">Statut</h4>
          <div class="flex flex-wrap gap-2 sm:gap-3">
            <span
              v-if="associationDetails.isOnline"
              class="badge badge-success shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              En ligne
            </span>
            <span
              v-else
              class="badge badge-neutral shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                />
              </svg>
              Hors ligne
            </span>
            <span
              v-if="associationDetails.isVerified"
              class="badge badge-info shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Vérifié
            </span>
            <span
              v-if="associationDetails.disabled"
              class="badge badge-error shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                />
              </svg>
              Désactivé
            </span>
          </div>
        </div>

        <!-- Section Informations système (conditionnelle) -->
        <div v-if="associationSettings?.profileVisibility" class="border-t pt-4">
          <h4 class="font-semibold mb-2">Informations système</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
            <div>
              <span class="font-medium">Créé le:</span>
              <p class="text-gray-600">{{ formatDate(associationDetails.createdAt || '') }}</p>
            </div>
            <div>
              <span class="font-medium">Mis à jour le:</span>
              <p class="text-gray-600">{{ formatDate(associationDetails.updatedAt || '') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-action pt-4 sm:pt-6 border-t border-base-300">
        <div class="flex flex-wrap gap-2">
          <button
            @click="closeModal"
            class="btn btn-primary w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Fermer
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay pour fermer le modal -->
    <div @click="closeModal" class="modal-backdrop"></div>
  </div>
</template>

<script setup lang="ts">
  import { useUser } from '~/composables/auth/useUser'
  import { useAssociationAuth, useSettingsStore, useVolunteerAuth } from '#imports'

  export interface VolunteerDetails {
    volunteerId: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    avatarFileKey?: string
    country?: string
    city?: string
    nbParticipations?: number
    nbVolunteers?: number
    nbAssociations?: number
    postalCode?: string
    birthDate?: string
    bio?: string
    isOnline: boolean
    isVerified: boolean
    disabled: boolean
    createdAt: string
    updatedAt: string
  }

  interface AssociationDetails {
    associationId: string
    associationName: string
    email: string
    phone?: string
    avatarFileKey?: string
    country: string
    city: string
    postalCode?: string
    bio?: string
    volunteers?: number
    announcements?: number
    type?: string
    isOnline: boolean
    isVerified: boolean
    disabled: boolean
    createdAt: string
    updatedAt: string
  }

  export interface AssociationSettings {
    profileVisibility: boolean
    contactInfoVisibility: boolean
    volunteerListVisibility: boolean
  }

  export interface VolunteerSettings {
    profileVisibility: boolean
  }

  interface Props {
    isOpen: boolean
    userId?: string
    userType?: 'volunteer' | 'association'
    profileImageUrl?: string
  }

  interface Emits {
    (e: 'close'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const user = useUser()
  const volunteer = useVolunteerAuth()
  const association = useAssociationAuth()
  const settings = useSettingsStore()

  const loading = ref(false)
  const volunteerDetails = ref<VolunteerDetails | null>(null)
  const associationDetails = ref<AssociationDetails | null>(null)
  const associationSettings = ref<AssociationSettings | null>(null)
  const volunteerSettings = ref<VolunteerSettings | null>(null)
  const profileImageUrl = ref('')

  // Computed pour vérifier si le profil est privé
  const isProfilePrivate = computed(() => {
    if (volunteerDetails.value && volunteerSettings.value) {
      return !volunteerSettings.value.profileVisibility
    }
    if (associationDetails.value && associationSettings.value) {
      return !associationSettings.value.profileVisibility
    }
    return false
  })

  // Computed pour l'URL de l'image de profil
  const computedProfileImageUrl = computed(() => {
    const avatarKey =
      volunteerDetails.value?.avatarFileKey || associationDetails.value?.avatarFileKey
    if (avatarKey) {
      return `https://benevoclic-storage.s3.amazonaws.com/${avatarKey}`
    }
    return ''
  })

  // Fonction pour formater les dates
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non disponible'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const closeModal = () => {
    emit('close')
  }

  const loadUserDetails = async () => {
    if (!props.userId) return

    loading.value = true
    try {
      // Réinitialiser les données
      volunteerDetails.value = null
      associationDetails.value = null
      volunteerSettings.value = null
      associationSettings.value = null

      // Récupérer les informations de base de l'utilisateur
      const userInfo = await user.getUserById(props.userId)

      console.log('User info:', userInfo)
      console.log('role', userInfo.role)

      if (!userInfo) {
        console.error('User not found')
        return
      }

      if (userInfo.role === 'VOLUNTEER') {
        const detailsVolunteer = await volunteer.getVolunteerInfoById(props.userId)
        const setting = await settings.getVolunteerSettings(props.userId)
        volunteerSettings.value = {
          profileVisibility: setting?.profileVisibility || false
        }

        // Chargement des statistiques avec gestion d'erreur
        let nbParticipations = 0
        let nbVolunteers = 0
        let nbAssociations = 0

        try {
          const volunteers = await volunteer.getVolunteerAnnouncements(props.userId)
          const associationsFollowing = await volunteer.getAllAssociationsFollowingList(
            props.userId
          )

          nbVolunteers =
            volunteers.filter(a => a.volunteers?.some(p => p.id === props.userId)).length || 0

          nbParticipations =
            volunteers.filter(a => a.participants?.some(p => p.id === props.userId)).length || 0

          nbAssociations = associationsFollowing.length || 0
        } catch (error) {
          console.warn('Erreur lors du chargement des statistiques:', error)
          // Les valeurs restent à 0 par défaut
        }

        volunteerDetails.value = {
          volunteerId: userInfo.userId,
          firstName: detailsVolunteer.firstName || '',
          lastName: userInfo.lastName || '',
          email: userInfo.email || '',
          phone: detailsVolunteer.phone || '',
          avatarFileKey: userInfo.avatarFileKey,
          country: detailsVolunteer.country,
          city: detailsVolunteer.city,
          nbParticipations,
          nbVolunteers,
          nbAssociations,
          postalCode: detailsVolunteer.postalCode,
          birthDate: detailsVolunteer.birthDate,
          bio: detailsVolunteer.bio,
          isOnline: userInfo.isOnline || false,
          isVerified: userInfo.isVerified || false,
          disabled: userInfo.disabled || false,
          createdAt: userInfo.createdAt || '',
          updatedAt: userInfo.updatedAt || ''
        }
      } else if (userInfo.role === 'ASSOCIATION') {
        const detailsAssociation = await association.getAssociationById(props.userId)
        const setting = await settings.getAssociationSettings(props.userId)
        associationSettings.value = {
          profileVisibility: setting?.profileVisibility || false,
          contactInfoVisibility: setting?.contactInfoVisibility || false,
          volunteerListVisibility: setting?.volunteerListVisibility || false
        }

        let nbAnnouncements = 0

        try {
          // Import dynamique pour réduire la charge initiale
          const { useAnnouncement } = await import('#imports')
          const announcementStore = useAnnouncement()

          const announcements = await announcementStore.fetchAnnouncements(props.userId)
          nbAnnouncements = announcements?.length || 0
        } catch (error) {
          console.warn('Erreur lors du chargement des annonces:', error)
        }

        associationDetails.value = {
          associationId: userInfo.userId,
          associationName: detailsAssociation.associationName || '',
          email: userInfo.email || '',
          phone: detailsAssociation.phone || '',
          avatarFileKey: userInfo.avatarFileKey,
          country: detailsAssociation.country || '',
          city: detailsAssociation.city || '',
          postalCode: detailsAssociation.postalCode || '',
          bio: detailsAssociation.bio || '',
          volunteers: detailsAssociation.volunteers?.length || 0,
          announcements: nbAnnouncements,
          type: association.association.value?.type || '',
          isOnline: userInfo.isOnline || false,
          isVerified: userInfo.isVerified || false,
          disabled: userInfo.disabled || false,
          createdAt: userInfo.createdAt || '',
          updatedAt: userInfo.updatedAt || ''
        }
      } else {
        console.log('Unknown user role:', userInfo.role)
      }

      profileImageUrl.value = computedProfileImageUrl.value
    } catch (error) {
      console.error('Erreur lors du chargement des détails utilisateur:', error)
    } finally {
      loading.value = false
    }
  }

  // Watcher pour charger les détails quand le modal s'ouvre
  watch(
    () => props.isOpen,
    newValue => {
      if (newValue && props.userId) {
        loadUserDetails()
      }
    }
  )

  // Charger les détails au montage si le modal est déjà ouvert
  onMounted(() => {
    if (props.isOpen && props.userId) {
      loadUserDetails()
    }
  })
</script>

<style scoped>
  .modal-backdrop {
    @apply fixed inset-0 bg-black bg-opacity-50;
  }
  /* (optionnel) Mitigation iOS pour la hauteur du viewport */
  :root {
    height: 100%;
  }
</style>
