<script setup lang="ts">
</script>

<template>
  <div class="search-container">
    <input
        type="text"
        placeholder="Rechercher une mission, une association"
        class="search-input"
    />
  </div>
</template>

<style scoped>
.search-container {
  display: flex;
  justify-content: center;

  .search-input {
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    outline: none;
    width: 40rem;
    border-radius: 0.375rem;


    &:focus {
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
    }
  }
}
</style>
