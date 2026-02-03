# KejaMatch - Real Estate Platform

A modern, full-featured real estate platform for Kenya, built with React and Vite. KejaMatch connects property buyers, renters, and BNB guests with agents and property owners across Kenya.

**Live Site:** [https://kejamatch.com](https://kejamatch.com)

## Features

### Property Listings
- Browse properties for sale and rent across Kenya
- Advanced filtering by location, price, bedrooms, bathrooms, and property type
- Split-screen view with interactive Google Maps integration
- Property cards with image galleries and detailed information
- Responsive grid and list view options

### BNB & Short-Term Rentals
- Discover vacation rentals and short stays
- Filter by price, property type, ratings, and amenities
- Instant booking support
- Host profiles with verification badges
- Interactive map with property markers

### Google Maps Integration
- Interactive maps with custom markers
- Property location visualization
- Click-to-highlight synchronization between map and listings
- Fullscreen map mode
- Zoom and navigation controls

### User Authentication
- Client registration and login
- Agent/Admin authentication
- Role-based access control
- Protected dashboard routes

### SEO Optimized
- Dynamic meta tags with React Helmet
- Structured data (JSON-LD) for properties, BNBs, and articles
- Open Graph and Twitter Card support
- Sitemap and robots.txt configuration

## Tech Stack

- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Routing:** React Router v6
- **Maps:** Google Maps JavaScript API with Places Library
- **Icons:** Lucide React
- **SEO:** React Helmet Async
- **HTTP Client:** Axios

## Project Structure

```
src/
├── assets/              # Static assets (logos, images)
├── components/
│   ├── auth/            # Authentication components & context
│   ├── bnbs/            # BNB-specific components
│   ├── common/          # Shared components (GoogleMaps, SEO, LazyImage)
│   ├── home/            # Homepage components
│   ├── layout/          # Navbar, Footer
│   └── properties/      # Property components (PropertyCard, etc.)
├── contexts/            # React contexts
├── data/                # Static data (BNB listings)
├── pages/               # Page components
│   ├── Properties.jsx   # Property listings with split-screen map
│   ├── BNBs.jsx         # BNB listings
│   ├── PropertyDetails.jsx
│   └── ...
├── services/            # API service modules
├── utils/               # Utility functions (googleMapsLoader)
└── App.jsx              # Main app component with routing
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Maps API key with Places library enabled

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/kejamatch-real-estate.git
cd kejamatch-real-estate
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_KEY=your_google_maps_api_key
```

5. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
| `VITE_GOOGLE_MAPS_KEY` | Google Maps JavaScript API key |

## Google Maps Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Add the key to your `.env` file

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run generate:favicons` | Generate favicon sizes from logo |

## Key Components

### GoogleMaps Component
Reusable map component with:
- Custom marker icons
- Info windows on click
- Marker selection synchronization
- Fullscreen toggle
- Fit bounds for multiple markers

### SEO Component
Comprehensive SEO with:
- Dynamic title and meta tags
- Open Graph / Twitter Cards
- JSON-LD structured data (RealEstateListing, LodgingBusiness, Article, FAQ)
- Breadcrumb schema

### Navbar
Responsive navigation with:
- Transparent/solid mode based on page type
- Scroll-aware styling
- Mobile drawer menu
- Authentication dropdowns

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, search, featured properties |
| `/properties` | Property listings with filters and map |
| `/properties/:id` | Property detail page |
| `/bnbs` | BNB listings with filters and map |
| `/about` | About page |
| `/blogs` | Blog listing |
| `/contact` | Contact form |
| `/client/login` | Client login |
| `/client/register` | Client registration |
| `/client/portal` | Client dashboard |
| `/login` | Agent/Admin login |
| `/agent/dashboard` | Agent dashboard |
| `/admin/dashboard` | Admin dashboard |

## Backend Integration

This frontend connects to the KejaMatch backend API. See the [kejamatch-backend](../kejamatch-backend) repository for:
- RESTful API endpoints
- MongoDB database
- User authentication (JWT)
- Property and lead management
- Odoo CRM integration

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software for KejaMatch.

## Contact

- Website: [https://kejamatch.com](https://kejamatch.com)
- Twitter: [@KejaMatch](https://x.com/KejaMatch)
- Instagram: [@kejamatch](https://www.instagram.com/kejamatch/)
