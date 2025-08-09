<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main
      id="main-content"
      class="bg-base-200 flex-1 min-h-[calc(100vh-120px)]"
      role="main"
    >
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from '~/components/header/Header.vue'
import Footer from '~/layouts/footer.vue'
</script>
