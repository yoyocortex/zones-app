# Zones App

Ovo je moj web app za crtanje i upravljanje geografskim zonama na interaktivnoj mapi.

Projekat je live i funkcionalan - možeš crtati zone, mijenjati im boje, editirati ih, i sve se automatski sprema u browser.

---

## Što app radi?

Ukratko - pregled mape, alat za crtanje (poligon, pravokutnik, ili krug), zone, imena i boje. Sve zone se čuvaju u browseru i mogu se kasnije editirati ili obrisati.

### Main featuri:
- **Crtanje zona** - polygon, rectangle, circle
- **Overlap detekcija** - ne može se nacrtati zona preko druge (validacija u real-time)
- **Geolokacija** - prikaži gdje si na mapi
- **Color coding** - svaka zona može imati svoju boju (red, blue, green, yellow, purple)
- **Auto-save** - sve se sprema automatski u localStorage
- **Metrics** - app sam računa površinu i centar svake zone

---

## Tech Stack i zašto?

Evo detaljnog pregleda tehnologija koje sam koristio i **zašto baš njih**:

### **Core Framework**
```json
"react": "^18.3.1"
"vite": "^6.0.1"
```
**Zašto React?**
- Component-based architecture - lakše održavanje
- Virtual DOM - brži re-renders
- Ogromna ekosistema biblioteka
- Najbolji developer experience

**Zašto Vite?**
- Ultra-brz development server
- Optimizovan build
- Out-of-the-box TypeScript i JSX podrška
- Moderan replacement za Create React App (CRA je ded)

---

### **Mapping & Geolocation**
```json
"leaflet": "^1.9.4"
"react-leaflet": "^4.2.1"
"leaflet-draw": "^1.0.4"
"react-leaflet-draw": "^0.20.4"
```

**Zašto Leaflet?**
- Open-source alternativa Google Maps API
- Lightweight
- Mobile-friendly out of the box
- Ogromna plugin ekosistema
- Jednostavan API za custom markere i shapes

**Zašto React-Leaflet?**
- React wrapper oko Leaflet-a
- Hooks za lifecycle management
- Lakša integracija sa React state-om

**Zašto Leaflet-Draw?**
- Skoro najbolji plugin za interaktivno crtanje
- Podrška za polygon, rectangle, circle, polyline
- Built-in edit i delete mode
- Customizable toolbar

---

### **Geometric Calculations**
```json
"@turf/turf": "^7.1.0"
```

**Zašto Turf.js?**
- Industry-standard za geospatial operacije
- Računa overlap između zona (booleanOverlap, booleanIntersects)
- Podržava GeoJSON standard
- Funkcije za area, centroid, buffer, union, itd.
- Radi u browseru (nema potrebe za backend)

**Konkretno koristim:**
- `turf.booleanOverlap()` - provjerava overlap
- `turf.booleanIntersects()` - provjerava presjecanja
- `turf.circle()` - konvertira radius u polygon (za validaciju)
- `turf.polygon()` - kreira GeoJSON geometrije

---

### **Styling**
```json
"tailwindcss": "^3.4.17"
"autoprefixer": "^10.4.20"
"postcss": "^8.4.49"
```

**Zašto Tailwind CSS?**
- Utility-first approach - brže razvijanje
- Nema global CSS konflikata
- Built-in responsive design (`md:`, `lg:`)
- PurgeCSS automatski briše nekorištene stilove (mali bundle)
- Konzistentan design system (spacing, colors, typography)

---

### **Routing**
```json
"react-router": "^7.1.1"
```

**Zašto React Router v7?**
- Client-side routing (SPA feel)
- Nested routes podrška
- Search params i history management
- Najnovija verzija sa boljim performansama

---

### **Notifications**
```json
"sonner": "^1.7.1"
```

**Zašto Sonner?**
- Najmodernija toast biblioteka
- Lightweight (~3KB)
- Beautiful animacije out of the box
- Accessible (keyboard navigation, screen readers)
- Jednostavan API: `toast.success("Zona spremljena!")`

**Alternative koje NISAM koristio:**
- `react-toastify` - starija, teža (~15KB)
- `react-hot-toast` - ok, ali manje featuri

---

### **UUID Generation**
```json
"uuid": "^11.0.3"
```

**Zašto UUID?**
- Generiram unique ID-jeve za svaku zonu
- RFC4122 compliant (industry standard)
- Collision probability praktički nula
- Radi offline (nema potrebe za backend counter)

---

## Arhitektura

```
src/
├── components/       # UI komponente
├── hooks/           # Custom React hooks
├── utils/           # Helper funkcije
├── constants/       # Konstante (boje, config)
├── pages/           # Route komponente
└── assets/          # Ikone, slike
```

### Key Design Decisions:

**1. Custom Hooks za logiku**
```jsx
useZones()        // CRUD operacije + localStorage
useGeolocation()  // Geolocation API wrapper
```
Zašto? Separation of concerns - logika odvojena od UI-a.

**2. localStorage za persistenciju**
Zašto ne backend? App je offline-first, nema registracije, sve radi u browseru.

**3. Turf.js za validaciju**
Provjeravam overlap **prije** nego što dopustim spremanje zone.

---

## Quick Start

```bash
# Clone repo
git clone https://github.com/yoyocortex/zones-app.git
cd zones-app

# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Kako koristiti?

### 1. Crtanje zone
- Klikni alat (Polygon, Rectangle, Circle)
- Crtaj na mapi
- Unesi ime i odaberi boju
- Klikni "Spremi"

### 2. Editiranje zone
- Klikni na zonu
- Klikni "Uredi"
- Promijeni ime ili boju
- Spremi

### 3. Brisanje zone
- Klikni "Obriši"
- Potvrdi brisanje

### 4. Filtriranje
- Klikni "Filtriraj po boji"
- Odaberi boju
- Prikazat će se samo zone te boje

---

## 🔮 Future Features

- [ ] Export/Import zona (JSON, GeoJSON, KML)
- [ ] Zone grouping (organizacija po kategorijama)
- [ ] Backend sync (optional Firebase integration)
- [ ] Undo/Redo potpuna funkcionalnost
- [ ] Zone statistike (najveća/najmanja zona, ukupna površina)

---

## License

MIT License - radi što hoćeš s kodom.

---

## Author

**yoyocortex**  
GitHub: [@yoyocortex](https://github.com/yoyocortex)

---

Built with ☕ and 🎵.