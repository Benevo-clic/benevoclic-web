// Mock des composants Nuxt courants
export const NuxtLink = {
  name: 'NuxtLink',
  template: '<a><slot /></a>',
  props: ['to', 'href', 'target', 'rel']
}

export const ClientOnly = {
  name: 'ClientOnly',
  template: '<div><slot /></div>'
}

export const NuxtPage = {
  name: 'NuxtPage',
  template: '<div><slot /></div>'
}

export const NuxtLayout = {
  name: 'NuxtLayout',
  template: '<div><slot /></div>'
}

export default {
  NuxtLink,
  ClientOnly,
  NuxtPage,
  NuxtLayout
}
