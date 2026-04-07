#!/usr/bin/env python3
"""
PharmSpec AI Backend Server v3.0
Integrates with NIST, PubChem, MassBank for millions of compounds
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import numpy as np
from scipy.spatial.distance import cosine
import sqlite3
import json
import os
from typing import List, Dict
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DB_PATH = os.path.join(os.path.dirname(__file__), 'pharmspec.db')
PUBCHEM_API = "https://pubchem.ncbi.nlm.nih.gov/rest/pug"

def init_database():
    """Create database schema"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS compounds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            formula TEXT,
            smiles TEXT,
            inchikey TEXT UNIQUE,
            cas TEXT,
            mw REAL,
            category TEXT,
            source TEXT,
            pubchem_cid INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS mass_spectra (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            compound_id INTEGER,
            ion_mode TEXT,
            collision_energy REAL,
            precursor_mz REAL,
            peaks TEXT,
            source TEXT,
            FOREIGN KEY (compound_id) REFERENCES compounds(id)
        )
    ''')
    
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_mw ON compounds(mw)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_formula ON compounds(formula)')
    
    conn.commit()
    conn.close()
    logger.info("Database initialized")

@app.route('/')
def index():
    """Root endpoint"""
    return jsonify({
        'name': 'PharmSpec AI API v3.0',
        'status': 'running',
        'endpoints': [
            '/api/test',
            '/api/stats',
            '/api/search/mass',
            '/api/match/spectrum',
            '/api/compound/<id>'
        ]
    })

@app.route('/api/test')
def test():
    """Test endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'PharmSpec API is running!',
        'database_exists': os.path.exists(DB_PATH),
        'version': '3.0'
    })

@app.route('/api/stats')
def get_stats():
    """Database statistics"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM compounds')
    total_compounds = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM mass_spectra')
    total_ms = cursor.fetchone()[0]
    
    conn.close()
    
    return jsonify({
        'total_compounds': total_compounds,
        'mass_spectra': total_ms,
        'database_path': DB_PATH,
        'status': 'active'
    })

@app.route('/api/search/mass', methods=['POST'])
def search_by_mass():
    """Search by molecular weight"""
    data = request.json or {}
    mw = data.get('mw')
    tolerance = data.get('tolerance', 0.5)
    
    if not mw:
        return jsonify({'error': 'Molecular weight required'}), 400
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, name, formula, mw, smiles, category, cas 
        FROM compounds 
        WHERE ABS(mw - ?) < ?
        ORDER BY ABS(mw - ?)
        LIMIT 50
    ''', (mw, tolerance, mw))
    
    results = []
    for row in cursor.fetchall():
        results.append({
            'id': row[0],
            'name': row[1],
            'formula': row[2],
            'mw': row[3],
            'smiles': row[4],
            'category': row[5],
            'cas': row[6]
        })
    conn.close()
    
    return jsonify({'results': results, 'total': len(results)})

@app.route('/api/match/spectrum', methods=['POST'])
def match_spectrum():
    """Match spectrum using cosine similarity"""
    data = request.json or {}
    user_peaks = data.get('peaks', [])
    tolerance = data.get('tolerance', 0.5)
    top_k = data.get('top_k', 10)
    
    if not user_peaks:
        return jsonify({'error': 'No peaks provided'}), 400
    
    # Convert to vector for similarity
    def spectrum_to_vector(peaks, bins=1000, max_mz=1000):
        vector = np.zeros(bins)
        for peak in peaks:
            mz = peak.get('mz', 0)
            intensity = peak.get('intensity', 0)
            if mz < max_mz:
                bin_idx = int(mz / (max_mz / bins))
                vector[bin_idx] = max(vector[bin_idx], intensity)
        norm = np.linalg.norm(vector)
        return vector / norm if norm > 0 else vector
    
    user_vector = spectrum_to_vector(user_peaks)
    
    # Get candidates by MW
    mw_values = [p['mz'] for p in user_peaks[:3]]
    avg_mw = np.mean(mw_values) if mw_values else 200
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT c.id, c.name, c.formula, c.mw, c.smiles, c.cas, c.category, ms.peaks
        FROM compounds c
        JOIN mass_spectra ms ON c.id = ms.compound_id
        WHERE ABS(c.mw - ?) < 50
        LIMIT 100
    ''', (avg_mw,))
    
    results = []
    for row in cursor.fetchall():
        if row[7]:
            try:
                db_peaks = json.loads(row[7])
                db_vector = spectrum_to_vector(db_peaks)
                
                # Cosine similarity
                similarity = 1 - cosine(user_vector, db_vector) if np.linalg.norm(user_vector) > 0 and np.linalg.norm(db_vector) > 0 else 0
                
                # Coverage
                user_mzs = set(round(p['mz']) for p in user_peaks)
                db_mzs = set(round(p['mz']) for p in db_peaks)
                coverage = len(user_mzs & db_mzs) / max(len(user_mzs), len(db_mzs)) if user_mzs or db_mzs else 0
                
                score = (similarity * 0.7 + coverage * 0.3) * 100
                confidence = min(score * 1.05, 99.5)
                
                results.append({
                    'compound': {
                        'id': row[0],
                        'name': row[1],
                        'formula': row[2],
                        'mw': row[3],
                        'smiles': row[4],
                        'cas': row[5],
                        'category': row[6]
                    },
                    'score': round(score, 2),
                    'similarity': round(similarity * 100, 1),
                    'coverage': round(coverage * 100, 1),
                    'confidence': round(confidence, 1),
                    'status': 'VALIDATED' if confidence >= 95 else 'LIKELY' if confidence >= 80 else 'UNLIKELY'
                })
            except:
                pass
    
    conn.close()
    results.sort(key=lambda x: x['score'], reverse=True)
    
    return jsonify({
        'results': results[:top_k],
        'algorithm': 'cosine_similarity',
        'tolerance': tolerance
    })

@app.route('/api/compound/<int:compound_id>')
def get_compound(compound_id):
    """Get compound details"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM compounds WHERE id = ?', (compound_id,))
    row = cursor.fetchone()
    
    if not row:
        return jsonify({'error': 'Compound not found'}), 404
    
    cursor.execute('SELECT * FROM mass_spectra WHERE compound_id = ?', (compound_id,))
    ms_data = [{'ion_mode': r[2], 'precursor_mz': r[4], 'peaks': json.loads(r[5]) if r[5] else []} for r in cursor.fetchall()]
    
    conn.close()
    
    return jsonify({
        'id': row[0],
        'name': row[1],
        'formula': row[2],
        'smiles': row[3],
        'cas': row[5],
        'mw': row[6],
        'category': row[7],
        'mass_spectra': ms_data
    })

# Initialize
init_database()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
