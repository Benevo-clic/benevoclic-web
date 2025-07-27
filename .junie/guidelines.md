# Benevoclic Web Development Guidelines

This document provides guidelines and instructions for developing and maintaining the Benevoclic web application.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Build and Configuration](#build-and-configuration)
3. [Testing](#testing)
4. [Development Guidelines](#development-guidelines)
5. [GDPR Compliance](#gdpr-compliance)

## Project Overview

Benevoclic is a Nuxt.js (v3) application that connects associations with volunteers. The application uses:

- Vue.js for the UI framework
- Tailwind CSS and DaisyUI for styling
- Firebase for authentication and data storage
- i18n for internationalization (French, English, Spanish)
- Pinia for state management

## Build and Configuration

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- npm or yarn

### Environment Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the `.env.example` or `.env.production` file with your environment-specific values:
   ```
   API_BASE_URL=your_api_url
   API_SIRENE_URL=your_sirene_api_url
   API_SIRENE_KEY=your_sirene_api_key
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   FIREBASE_APP_ID=your_firebase_app_id
   FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   ```

### Development Server

Start the development server on port 5482:

```bash
npm run start
```

### Building for Production

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Docker Deployment

The project includes a Dockerfile for containerized deployment:

```bash
# Build the Docker image
docker build -t benevoclic-web .

# Run the container
docker run -p 3000:3000 benevoclic-web
```

## Testing

### Test Framework

The project uses Vitest for testing with the following setup:

- Test files are located in the `test` directory
- Vue Test Utils is used for component testing
- Happy DOM is used as the test environment

### Running Tests

Run all tests:

```bash
npm test
```

Run a specific test file:

```bash
npm test -- --testNamePattern="YourTestName"
```

### Writing Tests

#### Component Tests

Here's an example of a component test for a language selector component:

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LanguageComponent from '../../components/header/utils/components/LanguageComponent.vue'

describe('LanguageComponent', () => {
  it('should not render when showLanguageMenu is false', () => {
    const wrapper = mount(LanguageComponent, {
      props: {
        showLanguageMenu: false
      }
    })

    expect(wrapper.find('.dropdown-content').exists()).toBe(false)
  })

  it('should render when showLanguageMenu is true', () => {
    const wrapper = mount(LanguageComponent, {
      props: {
        showLanguageMenu: true
      }
    })

    expect(wrapper.find('.dropdown-content').exists()).toBe(true)
    expect(wrapper.findAll('li').length).toBe(3) // 3 languages
  })

  it('should emit changeLanguage event when a language is selected', async () => {
    const wrapper = mount(LanguageComponent, {
      props: {
        showLanguageMenu: true
      }
    })

    // Click on the French language option
    await wrapper.findAll('button')[0].trigger('click')

    // Check that the changeLanguage event was emitted with the correct parameters
    expect(wrapper.emitted('changeLanguage')).toBeTruthy()
    expect(wrapper.emitted('changeLanguage')![0]).toEqual(['fr', '🇫🇷'])
  })
})
```

#### Test Setup

Global test setup can be added to `test/setup.ts`:

```typescript
import { beforeAll } from 'vitest'

beforeAll(() => {
  // Global setup like mocking fetch, localStorage, etc.
})
```

## Development Guidelines

### Code Structure

- **components/**: Vue components organized by feature
- **pages/**: Vue components that represent pages/routes
- **layouts/**: Vue components used as layouts
- **composables/**: Vue composables for reusable logic
- **stores/**: Pinia stores for state management
- **middleware/**: Nuxt middleware for route guards
- **plugins/**: Nuxt plugins
- **public/**: Static assets
- **assets/**: Assets that need processing (SCSS, images, etc.)
- **i18n/**: Internationalization files

### Performance Optimizations

The project includes several performance optimizations:

- Component islands for optimized component loading
- Payload extraction for faster page loads
- Tree-shaking for client-only components
- Compression of public assets
- Minification of JavaScript and CSS

See `PERFORMANCE_OPTIMIZATIONS.md` for more details.

### Internationalization

The application supports three languages:

- French (default)
- English
- Spanish

Language files are located in the `locales` directory. To add a new language:

1. Create a new JSON file in the `locales` directory
2. Add the language to the `i18n.locales` array in `nuxt.config.ts`

### Adding New Features

When adding new features:

1. Create components in the appropriate directory
2. Add routes in the `pages` directory
3. Add translations for all supported languages
4. Write tests for new components and functionality
5. Update documentation if necessary

### Debugging

For debugging:

1. Use Vue DevTools for component inspection
2. Check the browser console for errors
3. Use the Nuxt DevTools (enabled in development)
4. Add console.log statements with clear prefixes for traceability

## GDPR Compliance

This section outlines the GDPR compliance measures implemented in the Benevoclic application.

### Table of Contents

1. [Overview](#gdpr-overview)
2. [Legal Pages](#legal-pages)
3. [Cookie Consent](#cookie-consent)
4. [Security Headers](#security-headers)
5. [GDPR Testing](#gdpr-testing)
6. [Future Considerations](#future-considerations)

## GDPR Overview

Benevoclic collects and processes personal data from users, including:
- Email addresses
- Names
- Location data
- Usage statistics

To comply with GDPR regulations, we've implemented several measures to ensure user data is protected and users have control over their data.

## Legal Pages

### Mentions Légales (Legal Notices)

Located at `/mentions-legales`, this page contains:
- Project name and responsible party
- Hosting information
- Contact details
- Intellectual property information
- Legal jurisdiction

### Politique de Confidentialité (Privacy Policy)

Located at `/confidentialite`, this page details:
- What data we collect
- Why we collect it
- Where it's stored
- How long we keep it
- User rights regarding their data
- How to exercise these rights
- Information about cookies

## Cookie Consent

### Implementation

The cookie consent system is implemented using a custom Vue component located at `components/CookieConsent.vue`. This component:

1. Displays a banner at the bottom of the page when a user first visits the site
2. Allows users to accept all cookies, reject non-essential cookies, or customize their preferences
3. Stores user preferences in localStorage
4. Blocks non-essential scripts until consent is given
5. Provides a modal for detailed cookie preferences

### Usage

The component is integrated into the application in `app.vue`:

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
    <Footer />
    <CookieConsent />
  </NuxtLayout>
</template>
```

### Cookie Categories

The component manages four categories of cookies:

1. **Essential cookies**: Always enabled, necessary for the site to function
2. **Analytics cookies**: Used by Firebase Analytics for anonymous statistics
3. **Personalization cookies**: Used to remember user preferences
4. **Third-party cookies**: Used by services like Google Fonts

### Accessing Cookie Settings

Users can access cookie settings at any time via a link in the footer. This is implemented in `layouts/footer.vue`:

```vue
<a href="#" @click.prevent="openCookieSettings" class="link link-hover">Paramètres des cookies</a>
```

## Security Headers

Security headers have been implemented in `nuxt.config.ts` to enhance security and privacy. The following headers are included:

- **X-Frame-Options**: Set to 'SAMEORIGIN' to prevent clickjacking attacks
- **X-Content-Type-Options**: Set to 'nosniff' to prevent MIME type sniffing
- **X-XSS-Protection**: Set to '1; mode=block' to provide protection against XSS attacks
- **Content-Security-Policy**: Restricts which resources can be loaded and executed
- **Referrer-Policy**: Controls how much referrer information is included with requests
- **Permissions-Policy**: Controls which browser features can be used by the page

These headers provide protection against various security vulnerabilities, including:
- Clickjacking attacks
- MIME type sniffing
- Cross-site scripting (XSS)
- Unauthorized resource loading
- Excessive referrer information
- Unwanted browser feature usage

## GDPR Testing

To test the GDPR compliance features:

1. **Cookie Consent Banner**:
   - Clear your browser's localStorage or use incognito mode
   - Visit the site and verify the banner appears
   - Test each option (accept all, reject non-essential, customize)
   - Verify preferences are saved by refreshing the page

2. **Legal Pages**:
   - Visit `/mentions-legales` and `/confidentialite`
   - Verify all required information is present and readable

3. **Footer Links**:
   - Verify links to legal pages are present in the footer
   - Test the "Paramètres des cookies" link opens the cookie settings modal

4. **Security Headers**:
   - Use a tool like [Security Headers](https://securityheaders.com) to verify headers are correctly set

## Future Considerations

For ongoing GDPR compliance, consider:

1. **Regular audits**: Review data collection practices and update legal pages accordingly
2. **Data export functionality**: Implement a feature allowing users to export their data
3. **Automated data deletion**: Set up processes to automatically delete inactive user data after 5 years
4. **Consent records**: Maintain records of user consent for audit purposes
5. **Third-party processors**: Regularly review and update agreements with third-party data processors
6. **Staff training**: Ensure team members understand GDPR requirements and data handling procedures

---

For any questions regarding GDPR implementation, contact the development team or the Data Protection Officer at dpo@benevoclic.app.
