import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import basicSsl from '@vitejs/plugin-basic-ssl'
import Unfonts from 'unplugin-fonts/vite'

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    basicSsl(),
    Unfonts({
      google: {
        families: ['Roboto Condensed'],
      },
    }),
  ],
})
