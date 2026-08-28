/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        m3: {
          surface: '#111413',
          surfaceDim: '#111413',
          surfaceBright: '#373a38',
          surfaceContainerLowest: '#0c0f0e',
          surfaceContainerLow: '#191c1b',
          surfaceContainer: '#1d201f',
          surfaceContainerHigh: '#282b29',
          surfaceContainerHighest: '#323634',
          onSurface: '#e1e3e0',
          onSurfaceVariant: '#c1c8c3',
          outline: '#8b938d',
          outlineVariant: '#414943',
          
          primary: '#71dcba',
          onPrimary: '#003828',
          primaryContainer: '#00513c',
          onPrimaryContainer: '#8ef9d5',

          secondary: '#b4ccbe',
          onSecondary: '#20352b',
          secondaryContainer: '#364b41',
          onSecondaryContainer: '#d0e8da',

          tertiary: '#a6cbe2',
          onTertiary: '#0a3446',
          tertiaryContainer: '#264b5e',
          onTertiaryContainer: '#c2e7ff',

          error: '#ffb4ab',
          onError: '#690005',
          errorContainer: '#93000a',
          onErrorContainer: '#ffdad6',

          pokerRaise: '#ff897d',
          pokerRaiseContainer: '#8c1d18',
          pokerCall: '#6cdbb6',
          pokerCallContainer: '#00513c',
          pokerFold: '#929c95',
          pokerFoldContainer: '#2d3731'
        }
      },
      borderRadius: {
        'm3-xs': '4px',
        'm3-sm': '8px',
        'm3-md': '12px',
        'm3-lg': '16px',
        'm3-xl': '28px',
        'm3-full': '9999px'
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
      }
    },
  },
  plugins: [],
}