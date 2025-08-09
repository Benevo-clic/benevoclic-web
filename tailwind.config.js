/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      screens: {
        custom774: '774px',
        xl1285: '1285px'
      },
      // Configuration des styles de focus pour l'accessibilité
      ringWidth: {
        DEFAULT: '2px',
        2: '2px',
        4: '4px'
      },
      ringOffsetWidth: {
        DEFAULT: '2px'
      },
      ringColor: {
        focus: '#eb5577', // Rose primaire, bon contraste sur clair et sombre
        'focus-contrast': '#3B82F6' // Bleu, pour high-contrast
      },
      outline: {
        focus: ['2px solid #eb5577', '2px']
      },
      // Ajout d'une palette high-contrast (optionnelle)
      colors: {
        'hc-bg': '#000',
        'hc-text': '#fff',
        'hc-accent': '#FFD600'
      },
      // Motion
      transitionProperty: {
        none: 'none'
      },
      animation: {
        none: 'none'
      }
    }
  },
  plugins: [
    require('daisyui'),
    // Plugin pour prefers-reduced-motion
    function ({ addBase }) {
      addBase({
        '@media (prefers-reduced-motion: reduce)': {
          '*': {
            animation: 'none !important',
            transition: 'none !important',
            scrollBehavior: 'auto !important'
          }
        },
        '@media (prefers-contrast: more)': {
          ':root': {
            '--tw-ring-color': '#FFD600', // Jaune high-contrast
            '--tw-text-opacity': '1',
            '--tw-bg-opacity': '1'
          },
          '.btn, .badge, .tag': {
            outline: '2px solid #FFD600',
            backgroundColor: '#000',
            color: '#fff'
          }
        }
      })
    }
  ],
  daisyui: {
    themes: [
      // light theme from your plugin definition
      {
        light: {
          'color-scheme': 'light',
          'base-100': 'oklch(100% 0 0)',
          'base-200': 'oklch(98% 0 0)',
          'base-300': 'oklch(95% 0 0)',
          'base-content': 'oklch(21% 0.006 285.885)',
          primary: '#eb5577', // Ratio AA sur base-100 (vérifié)
          'primary-content': 'oklch(93% 0.034 272.788)',
          secondary: 'oklch(65% 0.241 354.308)',
          'secondary-content': 'oklch(94% 0.028 342.258)',
          accent: 'oklch(77% 0.152 181.912)',
          'accent-content': 'oklch(38% 0.063 188.416)',
          neutral: 'oklch(14% 0.005 285.823)',
          'neutral-content': 'oklch(92% 0.004 286.32)',
          info: 'oklch(74% 0.16 232.661)',
          'info-content': 'oklch(29% 0.066 243.157)',
          success: 'oklch(76% 0.177 163.223)',
          'success-content': 'oklch(37% 0.077 168.94)',
          warning: 'oklch(82% 0.189 84.429)',
          'warning-content': 'oklch(41% 0.112 45.904)',
          error: 'oklch(71% 0.194 13.428)',
          'error-content': 'oklch(27% 0.105 12.094)',
          '--radius-selector': '0.5rem',
          '--radius-field': '0.25rem',
          '--radius-box': '0.5rem',
          '--size-selector': '0.25rem',
          '--size-field': '0.25rem',
          '--border': '1px',
          '--depth': '1',
          '--noise': '0'
        }
      },
      // dark theme from your plugin definition
      {
        dark: {
          'color-scheme': 'dark',
          'base-100': 'oklch(25.33% 0.016 252.42)',
          'base-200': 'oklch(23.26% 0.014 253.1)',
          'base-300': 'oklch(21.15% 0.012 254.09)',
          'base-content': 'oklch(97.807% 0.029 256.847)',
          primary: '#eb5577', // Ratio AA sur base-100 (vérifié)
          'primary-content': 'oklch(98% 0 0)',
          secondary: 'oklch(92% 0.004 286.32)',
          'secondary-content': 'oklch(12% 0.042 264.695)',
          accent: 'oklch(77% 0.152 181.912)',
          'accent-content': 'oklch(38% 0.063 188.416)',
          neutral: 'oklch(14% 0.005 285.823)',
          'neutral-content': 'oklch(92% 0.004 286.32)',
          info: 'oklch(74% 0.16 232.661)',
          'info-content': 'oklch(29% 0.066 243.157)',
          success: 'oklch(76% 0.177 163.223)',
          'success-content': 'oklch(37% 0.077 168.94)',
          warning: 'oklch(82% 0.189 84.429)',
          'warning-content': 'oklch(41% 0.112 45.904)',
          error: 'oklch(71% 0.194 13.428)',
          'error-content': 'oklch(27% 0.105 12.094)',
          '--radius-selector': '0.5rem',
          '--radius-field': '0.25rem',
          '--radius-box': '0.5rem',
          '--size-selector': '0.25rem',
          '--size-field': '0.25rem',
          '--border': '1px',
          '--depth': '1',
          '--noise': '0'
        }
      }
    ],
    themesConfig: {
      defaultTheme: 'light'
    }
  }
}
