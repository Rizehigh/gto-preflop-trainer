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
          surface: '#0d0e12',
          surfaceContainerLow: '#14161d',
          surfaceContainer: '#1a1d26',
          surfaceContainerHigh: '#212530',
          surfaceContainerHighest: '#2a2f3d',
          surfaceBright: '#343a4b',
          
          primary: '#60a5fa',           // Crisp Soft Blue
          onPrimary: '#0f172a',
          primaryContainer: '#1e3a8a',   // Deep Blue Container
          onPrimaryContainer: '#dbeafe',
          
          secondary: '#38bdf8',
          onSecondary: '#0c4a6e',
          secondaryContainer: '#1e293b', // Crisp Dark Slate
          onSecondaryContainer: '#f1f5f9',

          tertiary: '#fbbf24',          // Gold Accent
          onTertiary: '#451a03',
          tertiaryContainer: '#78350f',
          onTertiaryContainer: '#fef3c7',

          error: '#f87171',
          onError: '#450a0a',
          errorContainer: '#7f1d1d',
          onErrorContainer: '#fee2e2',

          outline: '#4b5563',
          outlineVariant: '#374151',
          onSurface: '#f3f4f6',
          onSurfaceVariant: '#9ca3af',

          pokerRaise: '#ef4444',
          pokerRaiseContainer: '#7f1d1d',
          pokerCall: '#10b981',
          pokerCallContainer: '#064e3b',
          pokerFold: '#3f3f46',
          pokerFoldContainer: '#18181b',
        }
      },
      borderRadius: {
        'm3-xs': '2px',
        'm3-sm': '4px',
        'm3-md': '6px',
        'm3-lg': '8px',
        'm3-xl': '10px',
        'm3-full': '9999px',
      }
    },
  },
  plugins: [],
}
