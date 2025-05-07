<script setup lang="ts">
import {ChevronDown,Earth,MapPin} from "lucide-vue-next";
import { ref } from 'vue'

const currentCity = ref('Rio, Brazil')
const showCityMenu = ref(false)
const showLanguageMenu = ref(false)

const cities = ['Rio, Brazil', 'Paris, France', 'London, UK', 'New York, USA']

function selectCity(city:string) {
  currentCity.value = city
  showCityMenu.value = false
}

function changeLanguage(locale: string) {
  console.log("Langue choisie :", locale)
  showLanguageMenu.value = false
}

</script>

<template>
  <div class="location-language-switcher">
    <div class="switcher-controls">
      <MapPin />
      <button @click="showCityMenu = (!showCityMenu && !showLanguageMenu)" class="city-button">
        <span>{{ currentCity }}</span>
        <ChevronDown
            v-if="showCityMenu && !showLanguageMenu"
            class="chevron rotate"
        />
        <ChevronDown v-else class="chevron" />
      </button>

      <div v-if="showCityMenu && !showLanguageMenu" class="dropdown city-dropdown">
        <ul class="dropdown-list">
          <li v-for="city in cities" :key="city">
            <button @click="selectCity(city)" class="dropdown-item">
              {{ city }}
            </button>
          </li>
        </ul>
      </div>

      <button
          @click="showLanguageMenu = (!showLanguageMenu && !showCityMenu)"
          :class="['language-button', { active: showLanguageMenu }]"
      >
        <Earth />
      </button>
    </div>

    <div v-if="showLanguageMenu" class="dropdown language-dropdown">
      <ul class="dropdown-list">
        <li>
          <button @click="changeLanguage('fr')" class="dropdown-item">
            🇫🇷 Français
          </button>
        </li>
        <li>
          <button @click="changeLanguage('en')" class="dropdown-item">
            🇬🇧 English
          </button>
        </li>
        <li>
          <button @click="changeLanguage('es')" class="dropdown-item">
            🇪🇸 Español
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.location-language-switcher {
  position: relative;

  .switcher-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .city-button {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    background: none;
    border: none;
    cursor: pointer;
  }

  .chevron {
    width: 1rem;
    height: 1rem;
    transition: transform 0.2s ease;

    &.rotate {
      transform: rotate(180deg);
    }
  }

  .language-button {
    padding: 0.5rem;
    border-radius: 0.375rem;
    background-color: #f3f4f6;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &.active {
      background-color: #dbeafe;
    }
  }

  .dropdown {
    position: absolute;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 50;

    &.city-dropdown {
      top: 100%;
      left: 2rem;
      margin-top: 0.5rem;
      width: 12rem;
    }

    &.language-dropdown {
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      width: 10rem;
    }

    .dropdown-list {
      display: flex;
      flex-direction: column;
      font-size: 0.875rem;
    }

    .dropdown-item {
      width: 100%;
      text-align: left;
      padding: 0.5rem 1rem;
      background: none;
      border: none;
      cursor: pointer;

      &:hover {
        background-color: #f9fafb;
      }
    }
  }
}

</style>