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
          surface: '#0d0e11',
          surfaceContainerLow: '#14161a',
          surfaceContainer: '#1a1d22',
          surfaceContainerHigh: '#22262d',
          surfaceContainerHighest: '#2c313a',
          surfaceBright: '#363d48',
          
          primary: '#fbbf24',           // Warm Vivid Gold / Amber (Zero Blue!)
          onPrimary: '#1c1917',
          primaryContainer: '#451a03',   // Deep Gold/Amber Container
          onPrimaryContainer: '#fef3c7',
          
          secondary: '#34d399',          // Crisp Emerald / Mint Accent
          onSecondary: '#064e3b',
          secondaryContainer: '#064e3b', // Deep Emerald Container
          onSecondaryContainer: '#a7f3d0',

          tertiary: '#f87171',           // Coral Red Accent
          onTertiary: '#450a0a',
          tertiaryContainer: '#7f1d1d',
          onTertiaryContainer: '#fee2e2',

          error: '#ef4444',
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
