# Zirtually - Employee Experience Platform

Multi-industry employee lifecycle management platform for onboarding, performance reviews, learning, and team collaboration.

## Features

- 🎯 **Multi-Industry Support** - Healthcare, Technology, Finance, Retail, Manufacturing, Hospitality, Education, Professional Services
- 👥 **Employee Lifecycle** - Onboarding, Performance Reviews, Offboarding
- 📚 **Learning & Development** - Training modules, Certifications, Skill tracking
- 🎯 **Goals & OKRs** - Individual and team goal management
- 📊 **Analytics** - HR metrics, Team insights, Performance tracking
- 🤖 **AI Assistant** - Intelligent HR Q&A and recommendations
- 🔔 **Smart Notifications** - Task reminders, Training alerts
- 🌓 **Dark Mode** - Full theme support
- ♿ **Accessible** - WCAG 2.1 compliant with skip links and screen reader support

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Add your Gemini API key to .env.local
GEMINI_API_KEY=your-api-key-here
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:5173
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── ErrorBoundary.tsx
│   └── [Feature].tsx   # Feature components
├── constants.ts        # Mock data and configurations
├── types.ts           # TypeScript type definitions
├── App.tsx            # Main application component
├── index.tsx          # Application entry point
└── index.css          # Global styles with Tailwind
```

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3 (PostCSS)
- **Charts**: Recharts
- **AI**: Google Gemini API
- **Icons**: Custom SVG icons

## Mock Data

⚠️ **Important**: This application currently uses mock data for demonstration purposes.

See [`MOCK_DATA.md`](./MOCK_DATA.md) for:

- Complete list of mock data constants
- Migration strategy to real API
- Production readiness checklist

## Configuration

### Industry Selection

The platform supports 8 industries with customized terminology and features. Configure in the settings panel.

### Theme

Toggle between light and dark modes in the header.

### Notifications

Enable browser notifications for task and training reminders in Settings.

## Accessibility

- ✅ Keyboard navigation support
- ✅ Skip to main content link
- ✅ Screen reader compatible
- ✅ ARIA labels and landmarks
- ✅ Focus visible indicators
- ✅ Semantic HTML structure

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Contributing

This is a demonstration project. For production use:

1. Review [`MOCK_DATA.md`](./MOCK_DATA.md) for API integration
2. Implement backend services
3. Add proper authentication
4. Set up error monitoring
5. Configure CI/CD pipeline

## License

MIT

## Credits

Built with [Vite](https://vitejs.dev/), [React](https://react.dev/), and [Tailwind CSS](https://tailwindcss.com/)
