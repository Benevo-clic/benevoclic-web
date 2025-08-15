module.exports = {
  root: true,
  extends: ['@nuxtjs/eslint-config-typescript'],
  ignorePatterns: [
    'node_modules/',
    '.nuxt/',
    '.output/',
    'coverage/',
    'public/',
    'lighthouse-reports/',
    'test/**'
  ],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['lodash'],
            importNames: ['isEqual', 'cloneDeep', 'merge', 'isEmpty', 'isNil', 'isUndefined'],
            message:
              "Utilisez \"import lodash from 'lodash'\" au lieu d'imports nommés pour éviter les problèmes de compatibilité CommonJS/ES Modules"
          }
        ]
      }
    ]
  }
}
