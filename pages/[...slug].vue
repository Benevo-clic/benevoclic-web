<template>
  <div>
    <!-- This template is intentionally empty as we'll redirect immediately -->
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import {useUser} from "~/composables/auth/useUser";


// Define page metadata with auth middleware
definePageMeta({
  middleware: ['auth'],
  layout: 'header'
});

// Get the user store
const auth = useUser()


// Redirect based on user role
onMounted(async () => {
  await auth.fetchUser()

  const userRole = auth.userRole



  // Redirect based on role
  if (userRole.value === 'VOLUNTEER') {
    navigateTo('/volunteer/dashboard');
  } else if (userRole.value === 'ASSOCIATION') {
    navigateTo('/association/dashboard');
  } else {
    console.log('Unknown user role, redirecting to dashboard', userRole);
    navigateTo('/dashboard');
  }
});
</script>
