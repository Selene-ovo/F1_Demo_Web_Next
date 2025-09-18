# F1 Next.js Demo

A modern Formula 1 themed web application with emotion tracking capabilities built with Next.js and React.

## Features

- **Driver Profiles** - Comprehensive information about 2025 F1 drivers
- **Team Overview** - Detailed team statistics and current lineup
- **Circuit Guide** - Interactive track information and race calendar
- **Rules & Regulations** - F1 sporting regulations explained
- **Historical Data** - F1 championship history and memorable moments
- **Emotion Tracking** - AI-powered emotion detection and analysis
- **3D Visualization** - Interactive 3D graphics with Three.js

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Three.js** - 3D graphics and visualization
- **TensorFlow.js** - Machine learning in the browser
- **MediaPipe** - Real-time pose and hand detection
- **GSAP** - Professional animation library
- **Zustand** - Lightweight state management

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn or pnpm

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev

# Build for production
npm run build
# or
yarn build
# or
pnpm build

# Start production server
npm start
# or
yarn start
# or
pnpm start

# Run linter
npm run lint
# or
yarn lint
# or
pnpm lint
```

## Project Structure

```
src/
├── app/
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── not-found.tsx   # 404 page
├── components/
│   ├── pages/          # Page components
│   │   ├── 01_Home.tsx
│   │   ├── 02_Driver.tsx
│   │   ├── 03_Teams.tsx
│   │   ├── 04_Rule.tsx
│   │   ├── 05_History.tsx
│   │   ├── 06_With.tsx
│   │   └── 07_Circuit.tsx
│   ├── ui/             # Reusable UI components
│   └── layout/         # Layout components
├── assets/
│   ├── images/         # Static images
│   ├── css/            # Stylesheets
│   └── Music/          # Audio files
├── lib/                # Utilities and hooks
└── types/              # TypeScript type definitions
```

## Demo

Visit the live demo: https://gitea.ewcorp.co/JungHo/Web_Demo_Next

## Development Features

- Hot Reload - Instant updates during development
- TypeScript Support - Full type checking and IntelliSense
- Modern React - Latest React 19 features
- Responsive Design - Mobile-first approach
- Performance Optimized - Next.js automatic optimizations

## Contributing

This project is developed as a learning exercise for Next.js and emotion tracking technologies. Feedback and suggestions are welcome.

## License

Educational use only.