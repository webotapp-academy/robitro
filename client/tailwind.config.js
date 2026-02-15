module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Robitro Brand Colors - Matching the playful logo
        primary: {
          blue: '#2563EB',      // Bright blue (from logo's "o" letters)
          navy: '#1E3A8A',      // Deep blue (headers, accents)
          teal: '#06B6D4',      // Cyan/teal (tech sections)
          yellow: '#FCD34D',    // Bright yellow (logo text color)
          red: '#DC2626',       // Robot red (mascot)
          orange: '#F97316',    // Orange blocks (accents)
          white: '#FFFFFF',     // Pure white (backgrounds)
          gray: '#6B7280',      // Neutral gray (body text)
        },
        // Direct color access - Brighter, playful palette
        'robitro-blue': '#2563EB',
        'robitro-navy': '#1E3A8A',
        'robitro-teal': '#06B6D4',
        'robitro-yellow': '#FCD34D',
        'robitro-red': '#DC2626',
        'robitro-orange': '#F97316',
        'robitro-white': '#FFFFFF',
        'robitro-gray': '#6B7280',
        'robitro-light': '#F0F9FF', // Light blue tint for backgrounds
      },
      fontFamily: {
        // Fun, kid-friendly typography
        heading: ['Poppins', 'Baloo 2', 'system-ui', 'sans-serif'],
        body: ['Inter', 'Nunito', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'Nunito', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
      borderRadius: {
        'soft': '12px',
        'rounded': '16px',
        'extra': '20px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'lift': '0 8px 24px rgba(37, 99, 235, 0.15)',
        'glow': '0 0 20px rgba(252, 211, 77, 0.3)',
      },
    },
  },
  plugins: [],
};
