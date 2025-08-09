<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-8 text-center">
      Mentions Légales
    </h1>

    <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6">
      <h2 class="text-2xl font-semibold mb-4">
        Informations générales
      </h2>

      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-medium">
            Nom du projet
          </h3>
          <p>Benevoclic</p>
        </div>

        <div>
          <h3 class="text-lg font-medium">
            Responsable de publication
          </h3>
          <p>Aboubakar Diakité</p>
        </div>

        <div>
          <h3 class="text-lg font-medium">
            Contact
          </h3>
          <p>
            <a
              href="mailto:contact@www.benevoclic.fr"
              class="text-primary hover:underline"
            >contact@www.benevoclic.fr</a>
          </p>
        </div>

        <div>
          <h3 class="text-lg font-medium">
            Type de structure
          </h3>
          <p>Application web pour la gestion de missions associatives</p>
        </div>
      </div>
    </div>

    <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6">
      <h2 class="text-2xl font-semibold mb-4">
        Hébergement
      </h2>

      <div class="space-y-2">
        <p><strong>OVHcloud</strong></p>
        <p>2 rue Kellermann</p>
        <p>59100 Roubaix</p>
        <p>France</p>
      </div>
    </div>

    <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6">
      <h2 class="text-2xl font-semibold mb-4">
        Propriété intellectuelle
      </h2>

      <p class="mb-4">
        L'ensemble du contenu du site Benevoclic (images, textes, vidéos, etc.)
        est protégé par les lois relatives à la propriété intellectuelle. Toute
        reproduction, représentation, modification, publication, adaptation de
        tout ou partie des éléments du site, quel que soit le moyen ou le
        procédé utilisé, est interdite, sauf autorisation écrite préalable.
      </p>

      <p>
        Toute exploitation non autorisée du site ou de l'un quelconque des
        éléments qu'il contient sera considérée comme constitutive d'une
        contrefaçon et poursuivie conformément aux dispositions des articles
        L.335-2 et suivants du Code de Propriété Intellectuelle.
      </p>
    </div>

    <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6">
      <h2 class="text-2xl font-semibold mb-4">
        Liens hypertextes
      </h2>

      <p class="mb-4">
        Le site Benevoclic peut contenir des liens hypertextes vers d'autres
        sites internet ou applications. Benevoclic n'exerce aucun contrôle sur
        ces sites et applications et décline toute responsabilité quant à leur
        contenu.
      </p>
    </div>

    <div class="bg-base-100 rounded-xl shadow-lg p-6">
      <h2 class="text-2xl font-semibold mb-4">
        Droit applicable et juridiction compétente
      </h2>

      <p class="mb-4">
        Les présentes mentions légales sont régies par le droit français. En cas
        de litige, les tribunaux français seront seuls compétents.
      </p>

      <p>
        Pour toute question relative à l'application des présentes mentions
        légales, vous pouvez nous contacter à l'adresse email suivante :
        <a
          href="mailto:contact@www.benevoclic.fr"
          class="text-primary hover:underline"
        >contact@www.benevoclic.fr</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'header'
})

useHead({
  title: 'Mentions Légales - Benevoclic',
  meta: [
    {
      name: 'description',
      content:
        'Mentions légales de Benevoclic, application de mise en relation entre associations et bénévoles.'
    }
  ]
})
</script>
