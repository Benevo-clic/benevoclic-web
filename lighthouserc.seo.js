module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local:',
      numberOfRuns: 1,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        preset: 'desktop',
        onlyCategories: ['seo'],
        skipAudits: [
          'structured-data',
          'robots-txt',
          'sitemap'
        ]
      }
    },
    assert: {
      assertions: {
        'categories:seo': ['error', { minScore: 0.9 }],
        'seo/meta-description': ['error', { minScore: 1 }],
        'seo/link-text': ['error', { minScore: 1 }],
        'seo/crawlable-anchors': ['error', { minScore: 1 }],
        'seo/is-crawlable': ['error', { minScore: 1 }],
        'seo/robots-txt': 'off',
        'seo/sitemap': 'off',
        'seo/structured-data': 'off',
        'seo/tap-targets': ['error', { minScore: 1 }],
        'seo/hreflang': ['warn', { minScore: 0.8 }],
        'seo/plugins': ['warn', { minScore: 0.8 }],
        'seo/canonical': ['error', { minScore: 1 }],
        'seo/font-size': ['error', { minScore: 1 }],
        'seo/heading-order': ['error', { minScore: 1 }],
        'seo/image-alt': ['error', { minScore: 1 }],
        'seo/label': ['error', { minScore: 1 }],
        'seo/link-name': ['error', { minScore: 1 }],
        'seo/list': ['error', { minScore: 1 }],
        'seo/listitem': ['error', { minScore: 1 }],
        'seo/meta-refresh': ['error', { minScore: 1 }],
        'seo/meta-viewport': ['error', { minScore: 1 }],
        'seo/object-alt': ['error', { minScore: 1 }],
        'seo/tap-targets': ['error', { minScore: 1 }],
        'seo/td-headers-attr': ['error', { minScore: 1 }],
        'seo/th-has-data-cells': ['error', { minScore: 1 }],
        'seo/valid-lang': ['error', { minScore: 1 }],
        'seo/video-caption': ['error', { minScore: 1 }],
        'seo/video-description': ['error', { minScore: 1 }],
        'seo/logical-tab-order': ['error', { minScore: 1 }],
        'seo/focusable-controls': ['error', { minScore: 1 }],
        'seo/interactive-element-affordance': ['error', { minScore: 1 }],
        'seo/input-image-alt': ['error', { minScore: 1 }],
        'seo/select-name': ['error', { minScore: 1 }],
        'seo/color-contrast': ['warn', { minScore: 0.8 }],
        'seo/definition-list': ['error', { minScore: 1 }],
        'seo/dlitem': ['error', { minScore: 1 }],
        'seo/frame-title': ['error', { minScore: 1 }],
        'seo/html-has-lang': ['error', { minScore: 1 }],
        'seo/html-lang-valid': ['error', { minScore: 1 }],
        'seo/duplicate-id-active': ['error', { minScore: 1 }],
        'seo/duplicate-id-aria': ['error', { minScore: 1 }],
        'seo/form-field-multiple-labels': ['error', { minScore: 1 }],
        'seo/meta-viewport-large': ['error', { minScore: 1 }],
        'seo/scrollable-region-focusable': ['error', { minScore: 1 }],
        'seo/skip-link': ['error', { minScore: 1 }]
      }
    },
    upload: {
      target: 'temporary-public-storage',
      outputDir: './lighthouse-reports/seo'
    }
  }
} 