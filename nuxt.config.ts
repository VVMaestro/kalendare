import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', 'shadcn-nuxt'],

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },

  colorMode: {
    classSuffix: '',
    preference: 'dark'
  },

  devtools: {
    enabled: true
  },

  watch: ['components/*', 'pages/*', 'layouts/*', 'middleware/*', 'lib/*']
});
