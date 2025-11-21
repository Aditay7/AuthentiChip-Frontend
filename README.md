# AuthentiChip Frontend

High-performance Industrial HMI (Human-Machine Interface) frontend for IC authenticity verification system.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - HTTP client
- **Lucide React** - Icon library

## Features

- 🏭 **Industrial HMI Design** - Dark mode, high-contrast, monospace typography
- 📸 **Kiosk Mode** - Distraction-free inspection interface
- 📊 **Worker Dashboard** - Collapsible sidebar with shift stats
- 🎨 **Smooth Animations** - Flash effects, transitions, and loading states
- ⌨️ **Keyboard Shortcuts** - Spacebar to scan, Enter for next scan
- 🎭 **Demo Mode** - Toggle for presentations without hardware
- 📱 **Responsive Design** - Works on various screen sizes

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
# Build for production
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Sidebar.jsx     # Worker dashboard sidebar
│   ├── StatusCard.jsx  # Pass/Fail status display
│   ├── ScanButton.jsx  # Main scan trigger button
│   └── ProcessingLoader.jsx
├── pages/              # Page components
│   ├── InspectionView.jsx  # Main kiosk mode
│   ├── GalleryView.jsx     # Scan history gallery
│   └── ReportView.jsx      # End-of-shift report
├── store/              # State management
│   └── useAppStore.js  # Zustand store
├── utils/              # Utilities
│   └── api.js          # API client functions
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Usage

### Inspection Flow

1. **Ready State**: Place IC in jig, press "SCAN IC" or Spacebar
2. **Flash Sequence**: Screen flashes white (simulating camera flash)
3. **Processing**: Shows scanning animation while analyzing
4. **Result**: Displays pass/fail status with confidence score
5. **Next Scan**: Press "NEXT SCAN" or Enter to continue

### Demo Mode

Toggle "Demo Mode" in the top-right corner to test the UI without hardware. It will simulate random genuine/fake results.

### Keyboard Shortcuts

- `Spacebar` - Trigger scan (when in ready state)
- `Enter` - Next scan (when result is displayed)

## API Integration

The frontend expects a FastAPI backend with the following endpoints:

- `POST /api/scan` - Upload image and get verification result
- `GET /api/scans?limit=N` - Get scan history
- `POST /api/reports` - Submit daily report
- `POST /api/issues` - Report equipment issues

## Color Scheme

- **Background**: `#1e293b` (Dark slate grey)
- **Pass/Genuine**: `#10b981` (Emerald green)
- **Fail/Counterfeit**: `#f43f5e` (Rose red)
- **Primary Actions**: `#3b82f6` (Blue)

## Typography

- **Monospace Font**: JetBrains Mono / Roboto Mono
- Used for all technical data (part numbers, confidence scores, etc.)

## License

MIT

