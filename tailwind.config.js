import daisyui from 'daisyui'
import typography from '@tailwindcss/typography'

export default {
  content: ['./index.html', './src/**/*.{svelte,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins']
      },
    },
  },
  plugins: [typography, daisyui],
  daisyui: {
    themes: [
      {
        now: {
          primary: "#7189FF",
          "primary-content": "#ffffff",
          secondary: "#f000b8",
          "secondary-content": "#ffffff",
          accent: "#37cdbe",
          "accent-content": "#163835",
          neutral: "#3d4451",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#F2F2F2",
          "base-300": "#E5E6E6",
          "base-content": "#1f2937",
        },
      }
    ],
  }
}
