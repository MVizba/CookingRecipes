import flowbitePlugin from 'flowbite/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",

    // .. for monorepo
    '../node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}',
    '../node_modules/flowbite/**/*.{js,jsx,ts,tsx}'
  ],
  plugins: [
    flowbitePlugin,
  ],
  theme: {
    fontFamily: {
      body: ['"Inter var"', '"Inter"', '"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      mono: ['"Fira Code"', 'monospace'],
    },
  },
}