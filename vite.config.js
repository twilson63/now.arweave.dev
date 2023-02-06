import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import tailwindConfig from './tailwind.config.js'

const [schema, host] = process.env.GITPOD_WORKSPACE_URL ? process.env.GITPOD_WORKSPACE_URL.split('://') : [null, null]
const publicUrl = `3000-${host}`

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [svelte()],
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
    __STAMP_CONTRACT__: '"61vg8n54MGSC9ZHfSVAtQp4WjNb20TaThu6bkQ86pPI"',
    __BAR_CONTRACT__: '"VFr3Bk-uM-motpNNkkFg4lNW1BMmSfzqsVO551Ho4hA"'

  },
  server: {
    hmr: {
      clientPort: host ? 443 : 3000,
      host: host
        ? publicUrl
        : "localhost",
    }
  },
  css: {
    postcss: {
      plugins: [tailwind(tailwindConfig), autoprefixer],
    }

  },
  test: {
    deps: {
      inline: [
        'warp-contracts'
      ]
    }
  }
})
