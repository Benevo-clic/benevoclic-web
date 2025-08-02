<script setup lang="ts">
import { definePageMeta, useHead, useAnnouncement,useVolunteerAuth,useAssociationAuth, navigateTo } from "#imports";
import { onMounted, ref, onUnmounted } from 'vue';
import { Users, HeartHandshake, ArrowRight, Search, Award, Clock, Shield, ChevronDown } from 'lucide-vue-next';
import NoConnectedAnnouncementCard from "~/components/event/noConnected/NoConnectedAnnouncementCard.vue";
import type { Announcement } from "~/common/interface/event.interface";
import type { FilterAnnouncement } from "~/common/interface/filter.interface";



definePageMeta({
  middleware: ['auth'],
  layout: 'header'
})

useHead({
  title: 'Benevoclic - Espace Bénévole | Participez à des événements solidaires',
  meta: [
    {
      name: 'description',
      content: 'Découvrez des événements et missions adaptés à vos compétences et disponibilités. Rejoignez la communauté Benevoclic, aidez les associations et participez à des actions solidaires.'
    },
    {
      name: 'keywords',
      content: 'bénévolat, missions, événements, volontariat, engagement citoyen, aide, solidarité, compétences, personnes dans le besoin'
    }
  ]
})

const announcement = useAnnouncement();
const associations = useAssociationAuth()
const volunteers = useVolunteerAuth()
const featuredEvents = ref<Announcement[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const currentSlideIndex = ref(0);
let countAssociation = ref(0)
const countVolunteer = ref(0);

const totalEvents = ref(0);
const totalAssociations = ref(0);
const totalVolunteerSlots = ref(0);

// Animation variables
const isVisible = ref<{ [key: string]: boolean }>({
  hero: true,
  search: false,
  stats: false,
  events: false,
  benefits: false,
  howItWorks: false,
  cta: false
});
const animatedStats = ref<{ [key: string]: number }>({
  events: 0,
  associations: 0,
  volunteers: 0
});
const statsAnimationStarted = ref(false);

// Scroll observer
let observers: IntersectionObserver[] = [];

const searchType = ref<string>("");
const searchLocation = ref<string>("");
const searchDate = ref<string>("");

async function fetchFeaturedEvents() {
  isLoading.value = true;
  try {
    const filters: FilterAnnouncement = {
      page: 1,
      limit: 5,
      sort: "dateEvent_asc"
    };

    const response = await announcement.filterAnnouncement(filters);
    if (response && response.annonces) {
      featuredEvents.value = response.annonces;

      totalEvents.value = response.meta.total || 0;

      const uniqueAssociations = new Set();
      let volunteerSlots = 0;

      response.annonces.forEach(event => {
        if (event.associationId) {
          uniqueAssociations.add(event.associationId);
        }
        volunteerSlots += (event.maxVolunteers || 0) - (event.nbVolunteers || 0);
      });

      totalAssociations.value = uniqueAssociations.size;
      totalVolunteerSlots.value = volunteerSlots;
    }

    countAssociation.value = await associations.getNumberOfAssociations()
    countVolunteer.value = await volunteers.getNumberOfVolunteers()
  } catch (err: any) {
    error.value = err?.message || "Erreur lors de la récupération des événements";
    console.error("Erreur lors de la récupération des événements:", err);
  } finally {
    isLoading.value = false;
  }
}

// Fonction pour rediriger vers la page des événements avec les filtres
function searchEvents() {
  const filters: Partial<FilterAnnouncement> = {};

  if (searchType.value) {
    filters.tags = [searchType.value];
  }

  if (searchLocation.value) {
    // Utiliser cityCoordinates pour la localisation
    filters.cityCoordinates = [{
      lat: 0, // Ces valeurs seront remplacées par le backend
      lon: 0, // Ces valeurs seront remplacées par le backend
      name: searchLocation.value
    }];
  }

  if (searchDate.value) {
    // Utiliser dateEventFrom et dateEventTo pour la date
    filters.dateEventFrom = searchDate.value;
    filters.dateEventTo = searchDate.value;
  }

  // Mettre à jour le filtre courant
  announcement.patchCurrentFilter(filters);

  // Rediriger vers la page des événements
  navigateTo('/volunteer/events');
}

// Function to navigate the carousel
function navigateCarousel(direction: 'prev' | 'next') {
  if (featuredEvents.value.length === 0) return;

  if (direction === 'prev') {
    currentSlideIndex.value = currentSlideIndex.value === 0
        ? featuredEvents.value.length - 1
        : currentSlideIndex.value - 1;
  } else {
    currentSlideIndex.value = currentSlideIndex.value === featuredEvents.value.length - 1
        ? 0
        : currentSlideIndex.value + 1;
  }

  // Navigate to the slide
  window.location.hash = `event-slide-${currentSlideIndex.value}`;
}

// Function to animate counting up for statistics
function animateCounters() {
  if (statsAnimationStarted.value) return;
  statsAnimationStarted.value = true;

  const duration = 2000; // 2 seconds
  const steps = 60;
  const interval = duration / steps;

  let step = 0;
  const timer = setInterval(() => {
    step++;
    const progress = step / steps;

    // Easing function for smoother animation
    const easeOutQuad = (t: number) => t * (2 - t);
    const easedProgress = easeOutQuad(progress);

    animatedStats.value.events = Math.round(easedProgress * totalEvents.value);
    animatedStats.value.associations = Math.round(easedProgress * countAssociation.value);
    animatedStats.value.volunteers = Math.round(easedProgress * countVolunteer.value);

    if (step >= steps) {
      clearInterval(timer);
      animatedStats.value.events = totalEvents.value;
      animatedStats.value.associations = countAssociation.value;
      animatedStats.value.volunteers = countVolunteer.value;
    }
  }, interval);
}

// Function to setup intersection observers for scroll animations
function setupScrollObservers() {
  const sections = [
    { id: 'search-section', key: 'search' },
    { id: 'stats-section', key: 'stats' },
    { id: 'events-section', key: 'events' },
    { id: 'benefits-section', key: 'benefits' },
    { id: 'how-it-works-section', key: 'howItWorks' },
    { id: 'cta-section', key: 'cta' }
  ];

  sections.forEach(section => {
    const element = document.getElementById(section.id);
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible.value[section.key] = true;

          // Start counter animation when stats section becomes visible
          if (section.key === 'stats' && !statsAnimationStarted.value) {
            animateCounters();
          }
        }
      });
    }, { threshold: 0.2 }); // Trigger when 20% of the element is visible

    observer.observe(element);
    observers.push(observer);
  });
}

// Function to scroll to the next section
function scrollToNextSection() {
  const searchSection = document.getElementById('search-section');
  if (searchSection) {
    searchSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Charger les données au montage du composant
onMounted(async () => {
  await fetchFeaturedEvents();

  // Initialize carousel to first slide
  if (featuredEvents.value.length > 0) {
    currentSlideIndex.value = 0;
    // Use setTimeout to ensure DOM is updated
    setTimeout(() => {
      window.location.hash = `event-slide-0`;
    }, 100);
  }

  // Setup scroll observers after a short delay to ensure DOM is ready
  setTimeout(() => {
    setupScrollObservers();
  }, 200);
});

// Clean up observers when component is unmounted
onUnmounted(() => {
  observers.forEach(observer => observer.disconnect());
  observers = [];
});
</script>

<template>
  <div class="volunteer-home">
    <!-- Skip link pour l'accessibilité -->
    <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Passer au contenu principal"
    >
      Passer au contenu principal
    </a>

    <!-- Contenu principal -->
    <main id="main-content" class="volunteer-content" role="main" aria-label="Page d'accueil Bénévole">
      <!-- Section Hero -->
      <section class="hero min-h-[90vh] bg-gradient-to-br from-primary/10 to-secondary/10 py-16 px-4 flex items-center relative">
        <div class="max-w-6xl mx-auto w-full">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div class="space-y-6 slide-in-left visible">
              <h1 class="text-4xl md:text-5xl font-bold text-base-content">
                Faites la différence avec <span class="text-primary">Benevoclic</span>
              </h1>
              <p class="text-lg text-base-content/80 max-w-xl">
                Découvrez des événements et missions qui correspondent à vos compétences,
                vos centres d'intérêt et vos disponibilités. Que vous soyez bénévole ou
                personne dans le besoin, rejoignez une communauté engagée et participez
                à des projets solidaires.
              </p>
              <div class="flex flex-wrap gap-4">
                <NuxtLink to="/volunteer/events" class="btn btn-primary group">
                  Découvrir les événements
                  <ArrowRight class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </NuxtLink>
                <button class="btn btn-outline hover:scale-105 transition-transform duration-300">
                  En savoir plus
                </button>
              </div>
            </div>
            <div class="relative slide-in-right visible delay-400">
              <img
                  src="/images/volunteer-info.png"
                  alt="Bénévoles en action"
                  class="w-full h-auto rounded-xl shadow-xl transform hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
              />
              <div class="absolute -bottom-6 -left-6 bg-base-100 p-4 rounded-xl shadow-lg hidden md:flex items-center gap-4 slide-in-up visible delay-800">
                <div class="avatar-group -space-x-4 rtl:space-x-reverse">
                  <div class="avatar">
                    <div class="w-12">
                      <img src="/images/volunteer-info.png" alt="Avatar bénévole" loading="lazy" />
                    </div>
                  </div>
                  <div class="avatar">
                    <div class="w-12">
                      <img src="/images/volunteer-info.png" alt="Avatar bénévole" loading="lazy" />
                    </div>
                  </div>
                  <div class="avatar">
                    <div class="w-12">
                      <img src="/images/volunteer-info.png" alt="Avatar bénévole" loading="lazy" />
                    </div>
                  </div>
                  <div class="avatar placeholder">
                    <div class="w-12 bg-primary text-white">
                      <span>+99</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p class="font-bold">Rejoignez la communauté</p>
                  <p class="text-sm text-base-content/70">Des milliers de bénévoles actifs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Scroll indicator -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" @click="scrollToNextSection">
          <div class="flex flex-col items-center">
            <span class="text-sm text-base-content/70 mb-2">Découvrir</span>
            <ChevronDown class="w-6 h-6 text-primary" />
          </div>
        </div>
      </section>

      <!-- Section Recherche Rapide -->
      <section class="py-12 px-4 bg-base-100">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-10">
            <h2 class="text-3xl font-bold mb-4">Trouvez l'événement qui vous correspond</h2>
            <p class="text-base-content/70 max-w-2xl mx-auto">
              Utilisez notre moteur de recherche avancé pour trouver des événements
              qui correspondent à vos besoins, que vous souhaitiez aider ou participer.
            </p>
          </div>

          <div class="bg-base-200 p-6 rounded-xl shadow-md">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Type d'événement</span>
                </label>
                <select v-model="searchType" class="select select-bordered w-full">
                  <option value="" disabled selected>Sélectionnez un type</option>
                  <option value="Humanitaire">Humanitaire</option>
                  <option value="Environnement">Environnement</option>
                  <option value="Sport">Sport</option>
                  <option value="Culture">Culture</option>
                  <option value="Éducation">Éducation</option>
                  <option value="Santé">Santé</option>
                  <option value="Aide alimentaire">Aide alimentaire</option>
                  <option value="Soutien social">Soutien social</option>
                </select>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Localisation</span>
                </label>
                <div class="input-group">
                  <input
                      v-model="searchLocation"
                      type="text"
                      placeholder="Ville ou code postal"
                      class="input input-bordered w-full"
                  />
                </div>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Date</span>
                </label>
                <input
                    v-model="searchDate"
                    type="date"
                    class="input input-bordered w-full"
                />
              </div>
            </div>

            <div class="mt-6 flex justify-center">
              <button @click="searchEvents" class="btn btn-primary px-8">
                <Search class="w-4 h-4 mr-2" />
                Trouver des événements
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Statistiques -->
      <section class="py-16 px-4 bg-base-200">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-4">Benevoclic en chiffres</h2>
            <p class="text-base-content/70 max-w-2xl mx-auto">
              Rejoignez notre communauté grandissante et participez à des événements qui font la différence.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-base-100 p-8 rounded-xl shadow-md text-center">
              <div class="text-4xl font-bold text-primary mb-2">{{ totalEvents }}</div>
              <div class="text-xl font-semibold mb-2">Événements</div>
              <p class="text-base-content/70">
                Événements disponibles sur notre plateforme pour vous engager et faire la différence.
              </p>
            </div>

            <div class="bg-base-100 p-8 rounded-xl shadow-md text-center">
              <div class="text-4xl font-bold text-secondary mb-2">{{ countAssociation }}</div>
              <div class="text-xl font-semibold mb-2">Associations</div>
              <p class="text-base-content/70">
                Associations actives qui proposent des missions et événements variés.
              </p>
            </div>

            <div class="bg-base-100 p-8 rounded-xl shadow-md text-center">
              <div class="text-4xl font-bold text-accent mb-2">{{ countVolunteer }}</div>
              <div class="text-xl font-semibold mb-2">
                Bénévole<span v-if="countVolunteer > 1">s</span>
                &
                participant<span v-if="countVolunteer > 1">s</span>
              </div>
              <p class="text-base-content/70">
                Nombre de bénévoles et participants engagés dans des actions solidaires.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Événements à venir -->
      <section class="py-16 px-4 bg-base-100">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-4">Événements à venir</h2>
            <p class="text-base-content/70 max-w-2xl mx-auto">
              Découvrez les prochains événements et rejoignez-les en tant que bénévole ou participant.
            </p>
          </div>

          <div v-if="isLoading" class="flex justify-center items-center h-64">
            <div class="loading loading-spinner loading-lg"></div>
          </div>

          <div v-else-if="error" class="alert alert-error shadow-lg">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{{ error }}</span>
            </div>
          </div>

          <div v-else-if="featuredEvents.length === 0" class="text-center py-12">
            <img
                src="/images/no_data.png"
                alt="Aucun événement trouvé"
                class="w-full max-w-md mx-auto mb-4"
            />
            <p class="text-lg text-base-content/70">Aucun événement à venir pour le moment.</p>
          </div>

          <div v-else class="w-full">
            <div class="carousel w-full rounded-box relative">
              <div
                  v-for="(event, index) in featuredEvents"
                  :key="event._id"
                  :id="`event-slide-${index}`"
                  class="carousel-item relative w-full md:w-1/2 lg:w-1/3 px-2"
              >
                <NoConnectedAnnouncementCard
                    :announcement="event"
                    class="w-full h-full"
                />
              </div>
            </div>

          </div>

          <div class="text-center mt-8">
            <NuxtLink to="/volunteer/events" class="btn btn-outline btn-primary">
              Voir tous les événements
              <ArrowRight class="w-4 h-4 ml-2" />
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Section Avantages -->
      <section class="py-16 px-4 bg-base-200">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-4">Pourquoi rejoindre Benevoclic ?</h2>
            <p class="text-base-content/70 max-w-2xl mx-auto">
              Notre plateforme permet aux associations de promouvoir leurs événements
              et de connecter à la fois les bénévoles et les personnes dans le besoin
              avec des actions solidaires qui leur correspondent.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Carte 1 -->
            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div class="card-body">
                <div class="flex items-center gap-4 mb-4">
                  <div class="p-3 rounded-lg bg-primary/20">
                    <Search class="h-6 w-6 text-primary" />
                  </div>
                  <h3 class="card-title text-xl">Trouvez facilement</h3>
                </div>
                <p class="text-base-content/70">
                  Accédez à des milliers d'événements et de missions filtrés selon vos
                  besoins, préférences et votre localisation, que vous cherchiez à aider
                  ou à participer.
                </p>
              </div>
            </div>

            <!-- Carte 2 -->
            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div class="card-body">
                <div class="flex items-center gap-4 mb-4">
                  <div class="p-3 rounded-lg bg-secondary/20">
                    <Clock class="h-6 w-6 text-secondary" />
                  </div>
                  <h3 class="card-title text-xl">Gérez votre temps</h3>
                </div>
                <p class="text-base-content/70">
                  Choisissez des missions adaptées à vos disponibilités,
                  qu'il s'agisse d'un engagement ponctuel ou régulier.
                </p>
              </div>
            </div>

            <!-- Carte 3 -->
            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div class="card-body">
                <div class="flex items-center gap-4 mb-4">
                  <div class="p-3 rounded-lg bg-accent/20">
                    <Award class="h-6 w-6 text-accent" />
                  </div>
                  <h3 class="card-title text-xl">Développez vos compétences</h3>
                </div>
                <p class="text-base-content/70">
                  Mettez en pratique vos talents ou acquérez de nouvelles
                  compétences valorisables dans votre parcours.
                </p>
              </div>
            </div>

            <!-- Carte 4 -->
            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div class="card-body">
                <div class="flex items-center gap-4 mb-4">
                  <div class="p-3 rounded-lg bg-primary/20">
                    <Users class="h-6 w-6 text-primary" />
                  </div>
                  <h3 class="card-title text-xl">Rejoignez une communauté</h3>
                </div>
                <p class="text-base-content/70">
                  Connectez-vous avec d'autres bénévoles partageant vos valeurs
                  et élargissez votre réseau.
                </p>
              </div>
            </div>

            <!-- Carte 5 -->
            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div class="card-body">
                <div class="flex items-center gap-4 mb-4">
                  <div class="p-3 rounded-lg bg-secondary/20">
                    <HeartHandshake class="h-6 w-6 text-secondary" />
                  </div>
                  <h3 class="card-title text-xl">Faites la différence</h3>
                </div>
                <p class="text-base-content/70">
                  Contribuez concrètement à des causes qui vous tiennent à cœur
                  et ayez un impact positif sur la société.
                </p>
              </div>
            </div>

            <!-- Carte 6 -->
            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div class="card-body">
                <div class="flex items-center gap-4 mb-4">
                  <div class="p-3 rounded-lg bg-accent/20">
                    <Shield class="h-6 w-6 text-accent" />
                  </div>
                  <h3 class="card-title text-xl">Sécurité garantie</h3>
                </div>
                <p class="text-base-content/70">
                  Toutes les associations sont vérifiées et les missions sont
                  encadrées pour assurer votre sécurité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Comment ça marche -->
      <section class="py-16 px-4 bg-base-100">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-4">Comment ça marche ?</h2>
            <p class="text-base-content/70 max-w-2xl mx-auto">
              Participer à un événement ou rejoindre une mission n'a jamais été aussi simple.
              Suivez ces étapes pour trouver l'événement qui vous correspond, que vous soyez
              bénévole ou personne à la recherche d'aide.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Étape 1 -->
            <div class="flex flex-col items-center text-center">
              <div class="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-6">
                1
              </div>
              <h3 class="text-xl font-bold mb-3">Trouvez un événement</h3>
              <p class="text-base-content/70">
                Parcourez les annonces ou utilisez les filtres pour trouver
                un événement qui correspond à vos besoins ou compétences.
              </p>
            </div>

            <!-- Étape 2 -->
            <div class="flex flex-col items-center text-center">
              <div class="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-white text-2xl font-bold mb-6">
                2
              </div>
              <h3 class="text-xl font-bold mb-3">Inscrivez-vous en quelques clics</h3>
              <p class="text-base-content/70">
                Inscrivez-vous à l'événement directement via la plateforme.
                Vous pouvez préciser votre rôle (bénévole ou participant) et ajouter un message.
              </p>
            </div>

            <!-- Étape 3 -->
            <div class="flex flex-col items-center text-center">
              <div class="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-white text-2xl font-bold mb-6">
                3
              </div>
              <h3 class="text-xl font-bold mb-3">Participez</h3>
              <p class="text-base-content/70">
                Une fois votre inscription confirmée, vous recevrez tous les détails
                pour participer à l'événement, que ce soit en tant que bénévole ou bénéficiaire.
              </p>
            </div>
          </div>
        </div>
      </section>


      <!-- Section CTA -->
      <section class="py-16 px-4 bg-base-100">
        <div class="max-w-4xl mx-auto bg-primary/10 rounded-xl p-8 md:p-12 text-center">
          <h2 class="text-3xl font-bold mb-4">Prêt à participer ?</h2>
          <p class="text-base-content/80 max-w-2xl mx-auto mb-8">
            Des centaines d'associations proposent des événements pour tous. Trouvez dès maintenant
            un événement qui vous correspond, que vous souhaitiez aider comme bénévole
            ou participer comme bénéficiaire.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink to="/volunteer/events" class="btn btn-primary btn-lg">
              Découvrir les événements
              <ArrowRight class="w-5 h-5 ml-2" />
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Amélioration de l'accessibilité pour les éléments interactifs */
.btn:focus-visible {
  outline: 2px solid #eb5577;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Amélioration du contraste pour les utilisateurs en mode high-contrast */
@media (prefers-contrast: more) {
  .btn {
    border-width: 2px;
  }
}

/* Respect des préférences de réduction de mouvement */
@media (prefers-reduced-motion: reduce) {
  .transition-all,
  .transition-shadow,
  .transition-transform,
  .transition-colors {
    transition: none !important;
  }

  html {
    scroll-behavior: auto;
  }

  .animate-bounce {
    animation: none !important;
  }

  .fade-in, .slide-in-left, .slide-in-right, .slide-in-up, .slide-in-down {
    opacity: 1 !important;
    transform: none !important;
  }
}

/* Amélioration du focus pour le skip link */
a:focus-visible {
  outline: 2px solid #eb5577;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Custom animations */
.fade-in {
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
}

.fade-in.visible {
  opacity: 1;
}

.slide-in-left {
  opacity: 0;
  transform: translateX(-50px);
  transition: all 0.8s ease-out;
}

.slide-in-right {
  opacity: 0;
  transform: translateX(50px);
  transition: all 0.8s ease-out;
}

.slide-in-up {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease-out;
}

.slide-in-down {
  opacity: 0;
  transform: translateY(-50px);
  transition: all 0.8s ease-out;
}

.slide-in-left.visible,
.slide-in-right.visible,
.slide-in-up.visible,
.slide-in-down.visible {
  opacity: 1;
  transform: translate(0);
}

/* Delay classes */
.delay-200 {
  transition-delay: 200ms;
}

.delay-300 {
  transition-delay: 300ms;
}

.delay-400 {
  transition-delay: 400ms;
}

.delay-600 {
  transition-delay: 600ms;
}

.delay-800 {
  transition-delay: 800ms;
}

/* Counter animation */
@keyframes countUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.counter-animate {
  animation: countUp 0.5s ease-out forwards;
}
</style>
