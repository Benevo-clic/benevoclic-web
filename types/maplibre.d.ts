declare module '#app' {
  interface NuxtApp {
    $maplibregl: any
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $maplibregl: any
  }
}

export {}
