# PharmSpec AI v3.0
## Pharmaceutical Spectral Analysis with Million-Compound Database

### 🔬 Real Scientific Database Integration

PharmSpec AI now connects to **millions of compounds** via:
- **PubChem** - 110+ million compounds
- **NIST Chemistry WebBook** - Standard reference spectra
- **MassBank Europe** - High-quality MS data

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│  Flask API      │────▶│  SQLite DB      │
│  (HTML/JS)      │◄────│  (Python)       │◄────│ (Millions of    │
│                 │     │                 │     │   compounds)    │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
              ┌────────┐   ┌────────┐   ┌────────┐
              │PubChem │   │  NIST  │   │MassBank│
              │  API   │   │WebBook │   │ Europe │
              └────────┘   └────────┘   └────────┘
```

### Cosine Similarity Algorithm
```
1. Vector Normalization: Spectra → 1000-bin vectors
2. Cosine Similarity: sim = (A·B) / (||A|| × ||B||)
3. Coverage Score: Matched peaks / Total peaks
4. Final Score: 70% Cosine + 30% Coverage
```

---

## 🚀 Quick Start

### 1. Install Python Backend
```bash
# Install dependencies
pip install flask flask-cors requests numpy scipy

# Start API server
python api-server.py
```

### 2. Load Database (Millions of Compounds)
```bash
# Import from PubChem (takes 1-2 hours for 100K+ compounds)
python import_pubchem.py

# Or import smaller test set (10K compounds, ~10 minutes)
python import_pubchem.py --limit 10000
```

### 3. Launch Frontend
```bash
# Open in browser
python -m http.server 8000
# Go to: http://localhost:8000
```

---

## 📊 Database Sources

| Source | Compounds | Spectra | Update Frequency |
|--------|-----------|---------|------------------|
| PubChem | 110M+ | Structure only | Weekly |
| NIST MS | 300K+ | MS/MS spectra | Yearly |
| MassBank | 100K+ | MS/MS with metadata | Monthly |
| Local | 50+ | Full MS + NMR | Manual |

---

## 🔍 API Endpoints

### Search by Spectrum
```bash
POST /api/match/spectrum
{
  "peaks": [{"mz": 180.04, "intensity": 100}, ...],
  "type": "ms",
  "tolerance": 0.5,
  "top_k": 10
}
```

### Search by Mass
```bash
POST /api/search/mass
{
  "mw": 180.16,
  "tolerance": 0.5
}
```

### Get Statistics
```bash
GET /api/stats
```

---

## 🎯 100% Accuracy Requirements

| Criterion | Threshold | Validation |
|-----------|-----------|------------|
| Cosine Similarity | > 95% | Statistical |
| Peak Coverage | > 90% | Experimental |
| MW Deviation | < 0.1 Da | Calculated |
| Multi-spectral | MS + NMR | Cross-check |
| Expert Review | Required | Human |

---

## 📁 Project Structure

```
pharmspec-real/
├── index.html              # Frontend UI
├── app.js                  # Frontend logic (API client)
├── database.js             # Local fallback database (50 compounds)
├── styles.css              # Styling
├── api-server.py           # Flask backend
├── import_pubchem.py       # Bulk import script
├── pharmspec.db            # SQLite database (created on run)
└── README.md               # This file
```

---

## 🔧 Configuration

### Environment Variables
```bash
export FLASK_ENV=production
export PHARMSPEC_DB_PATH=/path/to/database.db
export PUBCHEM_API_KEY=your_key_here  # Optional
```

### Offline Mode
Set in `app.js`:
```javascript
const USE_API = false;  // Use local database only
```

---

## 🌐 Production Deployment

### With Backend
```bash
# Using Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 api-server:app

# Nginx reverse proxy
location /api {
    proxy_pass http://localhost:5000;
}
```

### Frontend Only (GitHub Pages)
```bash
# Frontend works without backend (uses local 50-compound DB)
# Limited to demo/testing - no millions of compounds
```

---

## 📝 Citation

If you use PharmSpec AI in research:

```
PharmSpec AI v3.0 - Pharmaceutical Spectral Database Matcher
Algorithm: Cosine Similarity
Database Sources: PubChem, NIST, MassBank
Tolerance: ±0.5 m/z
```

---

## ⚠️ Disclaimer

This is a **scientific tool prototype**. For production use:
- Validate against certified reference standards
- Follow ICH Q2(R1) guidelines for analytical validation
- Expert review required for regulatory submissions

---

## 🤝 Contributing

To add more compounds:
1. Run `python import_pubchem.py` to bulk import
2. Or edit `database.js` for local additions
3. Submit PR with spectral data sources

---

**Version**: 3.0 | **Database**: Millions of compounds | **Algorithm**: Cosine Similarity
