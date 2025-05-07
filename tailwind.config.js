/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          'color-scheme': 'light',
          'base-100': 'oklch(100% 0 0)',
          'base-200': 'oklch(98% 0 0)',
          'base-300': 'oklch(95% 0 0)',
          'base-content': 'oklch(21% 0.006 285.885)',
          'primary': '#eb5577',
          'primary-content': 'oklch(93% 0.034 272.788)',
          'secondary': 'oklch(0.928 0.006 264.531)',
          'secondary-content': 'oklch(0.921 0.003 17.217)',
          'accent': 'oklch(77% 0.152 181.912)',
          'accent-content': 'oklch(38% 0.063 188.416)',
          'neutral': 'oklch(14% 0.005 285.823)',
          'neutral-content': 'oklch(92% 0.004 286.32)',
          'info': 'oklch(74% 0.16 232.661)',
          'info-content': 'oklch(29% 0.066 243.157)',
          'success': 'oklch(76% 0.177 163.223)',
          'success-content': 'oklch(37% 0.077 168.94)',
          'warning': 'oklch(82% 0.189 84.429)',
          'warning-content': 'oklch(41% 0.112 45.904)',
          'error': 'oklch(71% 0.194 13.428)',
          'error-content': 'oklch(27% 0.105 12.094)',
          '--radius-selector': '0.5rem',
          '--radius-field': '0.25rem',
          '--radius-box': '0.5rem',
          '--size-selector': '0.25rem',
          '--size-field': '0.25rem',
          '--border': '1px',
          '--depth': '1',
          '--noise': '0',
        }
      }
    ],
    themesConfig: {
      defaultTheme: "light"
    }
  }
} 