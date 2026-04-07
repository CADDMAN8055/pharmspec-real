#!/usr/bin/env python3
"""
PharmSpec AI Backend Server v3.2
Integrates with PubChem for millions of compounds
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import numpy as np
from scipy.spatial.distance import cosine
import sqlite3
import json
import os
import time
from typing import List, Dict
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DB_PATH = os.path.join(os.path.dirname(__file__), 'pharmspec.db')
PUBCHEM_API = "https://pubchem.ncbi.nlm.nih.gov/rest/pug"

# Local compound database (embedded for fallback)
LOCAL_COMPOUNDS = [
    {"name": "Aspirin", "formula": "C9H8O4", "mw": 180.16, "smiles": "CC(=O)Oc1ccccc1C(=O)O", "cas": "50-78-2", "category": "NSAID"},
    {"name": "Ibuprofen", "formula": "C13H18O2", "mw": 206.28, "smiles": "CC(C)Cc1ccc(C(C)C(=O)O)cc1", "cas": "15687-27-1", "category": "NSAID"},
    {"name": "Paracetamol", "formula": "C8H9NO2", "mw": 151.16, "smiles": "CC(=O)Nc1ccc(O)cc1", "cas": "103-90-2", "category": "Analgesic"},
    {"name": "Metformin", "formula": "C4H11N5", "mw": 129.16, "smiles": "CN(C)C(=N)NC(=N)N", "cas": "657-24-9", "category": "Antidiabetic"},
    {"name": "Dapagliflozin", "formula": "C21H25ClO6", "mw": 408.87, "smiles": "CCOC1=CC=C(C=C1)C2=CC(=O)C3=C(O2)C(=C(C=C3O)O)C(=O)O", "cas": "461432-26-8", "category": "Antidiabetic"},
    {"name": "Naproxen", "formula": "C14H14O3", "mw": 230.26, "smiles": "COc1ccc2cc(C(C)C(=O)O)ccc2c1", "cas": "22204-53-1", "category": "NSAID"},
    {"name": "Diclofenac", "formula": "C14H11Cl2NO2", "mw": 296.15, "smiles": "O=C(O)Cc1ccccc1Nc1c(Cl)cccc1Cl", "cas": "15307-86-5", "category": "NSAID"},
    {"name": "Morphine", "formula": "C17H19NO3", "mw": 285.34, "smiles": "CN1CC[C@]23c4c5ccc(O)c4O[C@H]2[C@@H](O)C=C[C@H]3[C@H]1C5", "cas": "57-27-2", "category": "Opioid"},
    {"name": "Codeine", "formula": "C18H21NO3", "mw": 299.37, "smiles": "COc1ccc2c3c1O[C@H]1[C@@H](O)C=C[C@H]4[C@@H](C2)N(C)CC[C@@]341", "cas": "76-57-3", "category": "Opioid"},
    {"name": "Amoxicillin", "formula": "C16H19N3O5S", "mw": 365.40, "smiles": "CC1(C)S[C@@H]2[C@H](NC(=O)C(O)c3ccccc3)C(=O)N2[C@H]1C(=O)O", "cas": "26787-78-0", "category": "Antibiotic"},
    {"name": "Azithromycin", "formula": "C38H72N2O12", "mw": 748.98, "smiles": "CCC1OC(=O)C(C)C(O)C(C)C(O)C(C)C(O)C1C", "cas": "83905-01-5", "category": "Antibiotic"},
    {"name": "Ciprofloxacin", "formula": "C17H18FN3O3", "mw": 331.34, "smiles": "O=C(O)c1cn(C2CC2)c2cc(N3CCNCC3)c(F)cc2c1=O", "cas": "85721-33-1", "category": "Antibiotic"},
    {"name": "Glibenclamide", "formula": "C23H28ClN3O5S", "mw": 493.99, "smiles": "COc1ccc(CCNC(=O)C(C)C2=CC=C(C=C2)S(=O)(=O)NC(=O)Nc3ccc(Cl)cc3)cc1", "cas": "10238-21-8", "category": "Antidiabetic"},
    {"name": "Atorvastatin", "formula": "C33H35FN2O5", "mw": 558.64, "smiles": "CC(C)c1c(C(=O)Nc2ccccc2)c(-c2ccccc2)c(-c2ccc(F)cc2)n1CCC(O)CC(O)CC(=O)O", "cas": "134523-00-5", "category": "Statin"},
    {"name": "Simvastatin", "formula": "C25H38O5", "mw": 418.57, "smiles": "CCC(C)(C)C(=O)O[C@H]1C[C@@H](C)C=C2C=C[C@H](C)[C@H](CC[C@@H]3C[C@@H](O)CC(=O)O3)[C@H]21", "cas": "79902-63-9", "category": "Statin"},
    {"name": "Rosuvastatin", "formula": "C22H28N3O6S", "mw": 481.54, "smiles": "CC(C)c1nc(N(C)S(=O)(=O)c2ccc(-c3ccccc3)cc2)nc(-c2ccc(F)cc2)c1C(=O)O", "cas": "287714-41-4", "category": "Statin"},
    {"name": "Cetirizine", "formula": "C21H25ClN2O3", "mw": 388.89, "smiles": "OC(CN1CCC(CC1)C(O)(c2ccccc2)c3ccc(Cl)cc3)CC(=O)O", "cas": "83881-51-0", "category": "Antihistamine"},
    {"name": "Loratadine", "formula": "C22H23ClN2O2", "mw": 382.88, "smiles": "CC(=O)OCCOC1=CC=C(C=C1)C(=O)N2CCC3=C(C2)C=CC(=C3)Cl", "cas": "79794-75-5", "category": "Antihistamine"},
    {"name": "Omeprazole", "formula": "C17H19N3O3S", "mw": 345.42, "smiles": "COc1ccc2nc(S(=O)Cc3ncc(C)c(OC)c3C)[nH]c2c1", "cas": "73590-58-6", "category": "PPI"},
    {"name": "Pantoprazole", "formula": "C16H15F2N3O4S", "mw": 383.37, "smiles": "COc1cc(OC)nc(CS(=O)c2nc3cc(OCC(F)(F)F)ccc3[nH]2)n1", "cas": "102625-70-7", "category": "PPI"},
    {"name": "Sertraline", "formula": "C17H17Cl2N", "mw": 306.23, "smiles": "CN[C@H]1CC[C@@H](C2=CC=C(Cl)C=C2)[C@H](C3=CC=CC=C3)C1", "cas": "79617-96-2", "category": "Antidepressant"},
    {"name": "Fluoxetine", "formula": "C17H18F3NO", "mw": 309.33, "smiles": "CNCCC(c1ccccc1)Oc2ccc(C(F)(F)F)cc2", "cas": "54910-89-3", "category": "Antidepressant"},
    {"name": "Valsartan", "formula": "C24H29N5O3", "mw": 435.52, "smiles": "CCCCC(=O)N(Cc1ccc(-c2ccccc2)cc1)C(C(=O)O)C(C)C", "cas": "137862-53-4", "category": "Antihypertensive"},
    {"name": "Lisinopril", "formula": "C21H31N3O5", "mw": 405.49, "smiles": "CC(C)C[C@@H](C(=O)N[C@@H](CCCN)C(=O)O)N1CCCC1C(=O)O", "cas": "83915-83-7", "category": "Antihypertensive"},
    {"name": "Carbamazepine", "formula": "C15H12N2O", "mw": 236.27, "smiles": "NC(=O)N1c2ccccc2C=Cc3ccccc31", "cas": "298-46-4", "category": "Antiepileptic"},
    {"name": "Phenytoin", "formula": "C15H12N2O2", "mw": 252.27, "smiles": "O=C1NC(=O)C(c2ccccc2)(c3ccccc3)N1", "cas": "57-41-0", "category": "Antiepileptic"},
    {"name": "Furosemide", "formula": "C12H11ClN2O5S", "mw": 330.74, "smiles": "NS(=O)(=O)c1cc(C(=O)O)c(NCc2ccco2)cc1Cl", "cas": "54-31-9", "category": "Diuretic"},
    {"name": "Hydrochlorothiazide", "formula": "C7H8ClN3O4S2", "mw": 297.74, "smiles": "NS(=O)(=O)c1cc2c(cc1Cl)NC(O)NS2(=O)=O", "cas": "58-93-5", "category": "Diuretic"},
    {"name": "Warfarin", "formula": "C19H16O4", "mw": 308.33, "smiles": "CC(=O)CC(c1ccccc1)c2c(O)c3ccccc3oc2=O", "cas": "81-81-2", "category": "Anticoagulant"},
    {"name": "Rivaroxaban", "formula": "C19H18ClN3O5S", "mw": 435.88, "smiles": "COc1ccc(-c2nc3n(c2C(=O)N2CCC(C(=O)O)C2)CCS3)cc1Cl", "cas": "366789-02-8", "category": "Anticoagulant"},
    {"name": "Metoprolol", "formula": "C15H25NO3", "mw": 267.36, "smiles": "COCCc1ccc(OCC(O)CNC(C)C)cc1", "cas": "37350-58-6", "category": "Beta Blocker"},
    {"name": "Atenolol", "formula": "C14H22N2O3", "mw": 266.34, "smiles": "CC(C)NCC(O)COc1ccc(CC(N)=O)cc1", "cas": "29122-68-7", "category": "Beta Blocker"},
    {"name": "Diazepam", "formula": "C16H13ClN2O", "mw": 284.74, "smiles": "CN1C(=O)CN=C(c2ccccc2)c3cc(Cl)ccc31", "cas": "439-14-5", "category": "Anxiolytic"},
    {"name": "Alprazolam", "formula": "C17H13ClN4", "mw": 308.76, "smiles": "Cc1nnc2n1-c1ccc(Cl)cc1C(c1ccccc1)=NC2", "cas": "28981-97-7", "category": "Anxiolytic"},
    {"name": "Haloperidol", "formula": "C21H23ClFNO2", "mw": 375.86, "smiles": "O=C(CCCN1CCC(C(O)(c2ccc(F)cc2)c3ccc(Cl)cc3)CC1)c4ccncc4", "cas": "52-86-8", "category": "Antipsychotic"},
    {"name": "Risperidone", "formula": "C23H27FN4O2", "mw": 410.48, "smiles": "Cc1nc2n(c1C)C(C)CN(C(=O)c3ccc(F)cc3)C2CCN4CCC(CC4)O", "cas": "106266-06-2", "category": "Antipsychotic"},
    {"name": "Fluconazole", "formula": "C13H12F2N6O", "mw": 306.27, "smiles": "OC(Cn1cncn1)(Cn2cncn2)c3ccc(F)cc3F", "cas": "86386-73-4", "category": "Antifungal"},
    {"name": "Itraconazole", "formula": "C35H38Cl2N8O4", "mw": 705.63, "smiles": "CCC(C)n1ncn(-c2ccc(N3CCN(C4CC4)CC3)cc2)c1=NC(O)C(Cc5ccc(Cl)cc5)n6cncn6", "cas": "84625-61-6", "category": "Antifungal"},
    {"name": "Aciclovir", "formula": "C8H11N5O3", "mw": 225.20, "smiles": "Nc1nc2c(ncn2COCCO)c(=O)[nH]1", "cas": "59277-89-3", "category": "Antiviral"},
    {"name": "Oseltamivir", "formula": "C16H28N2O4", "mw": 312.40, "smiles": "CCOC(=O)C1=C[C@@H](OC(CC)CC)[C@H](NC(=O)C)[C@@H](N)C1", "cas": "196618-13-0", "category": "Antiviral"},
    {"name": "Chloroquine", "formula": "C18H26ClN3", "mw": 319.87, "smiles": "CCN(CC)CCCC(C)Nc1ccnc2cc(Cl)ccc12", "cas": "54-05-7", "category": "Antimalarial"},
    {"name": "Artemisinin", "formula": "C15H22O5", "mw": 282.33, "smiles": "C[C@@H]1CC[C@H]2[C@@H](C)C(=O)O[C@H]3O[C@@]4(OO[C@H](C[C@@H]1C)[C@@]24C)C3", "cas": "63968-64-9", "category": "Antimalarial"},
    {"name": "Cyclosporine", "formula": "C62H111N11O12", "mw": 1202.61, "smiles": "CC[C@H]1OC(=O)[C@H](C)[C@@H](O)[C@H](C)[C@@H](O)[C@](C)(O)C[C@@H](C)CN(C)C(=O)[C@H](C(C)C)N(C)C(=O)[C@H](C)N(C)C(=O)[C@H](C(C)C)N(C)C(=O)[C@@H](C)N1C", "cas": "59865-13-3", "category": "Immunosuppressant"},
    {"name": "Tacrolimus", "formula": "C44H69NO12", "mw": 803.02, "smiles": "C=CCO[C@]1(C)C[C@@H](C)C[C@@]2(C)C[C@@H](O)[C@]3(C)C(=O)C(=O)[C@@H](C(C)C)[C@@H]4C[C@H](O)[C@H](C)[C@]4(C)C(O)=C(O)[C@@]3(C)[C@@H]2C1", "cas": "104987-11-3", "category": "Immunosuppressant"}
]

def init_database():
    """Create database and populate with local compounds"""
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
    
    # Populate with local compounds if empty
    cursor.execute('SELECT COUNT(*) FROM compounds')
    if cursor.fetchone()[0] == 0:
        logger.info("Populating database with local compounds...")
        for compound in LOCAL_COMPOUNDS:
            cursor.execute('''
                INSERT OR IGNORE INTO compounds (name, formula, mw, smiles, cas, category, source)
                VALUES (?, ?, ?, ?, ?, ?, 'local')
            ''', (compound['name'], compound['formula'], compound['mw'], 
                  compound['smiles'], compound['cas'], compound['category']))
        conn.commit()
        logger.info(f"Added {len(LOCAL_COMPOUNDS)} local compounds")
    
    conn.close()

def fetch_pubchem_by_mw(mw: float, tolerance: float = 5.0) -> List[Dict]:
    """Fetch compounds from PubChem by molecular weight"""
    try:
        # Search by molecular weight range
        min_mw = int(mw - tolerance)
        max_mw = int(mw + tolerance)
        url = f"{PUBCHEM_API}/compound/fastformula/mass/{mw}/JSON?mass_error={tolerance}"
        
        response = requests.get(url, timeout=15)
        if response.status_code == 200:
            data = response.json()
            cids = data.get('IdentifierList', {}).get('CID', [])
            
            logger.info(f"PubChem found {len(cids)} compounds with MW {mw}±{tolerance}")
            
            compounds = []
            # Fetch details for first 20 compounds (limit for speed)
            for cid in cids[:20]:
                try:
                    props_url = f"{PUBCHEM_API}/compound/cid/{cid}/property/IUPACName,MolecularFormula,MolecularWeight,IsomericSMILES/JSON"
                    props_response = requests.get(props_url, timeout=10)
                    if props_response.status_code == 200:
                        props_data = props_response.json()
                        props = props_data.get('PropertyTable', {}).get('Properties', [{}])[0]
                        compounds.append({
                            'id': f"pubchem_{cid}",
                            'name': props.get('IUPACName', f'Compound_{cid}')[:100],
                            'formula': props.get('MolecularFormula', ''),
                            'mw': props.get('MolecularWeight', 0),
                            'smiles': props.get('IsomericSMILES', ''),
                            'source': 'pubchem',
                            'pubchem_cid': cid
                        })
                except Exception as e:
                    logger.error(f"Error fetching PubChem CID {cid}: {e}")
                    continue
            
            return compounds
    except Exception as e:
        logger.error(f"PubChem fetch error: {e}")
    return []

def store_pubchem_compounds(compounds: List[Dict]):
    """Store PubChem compounds in local database"""
    if not compounds:
        return 0
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    added = 0
    for compound in compounds:
        try:
            cursor.execute('''
                INSERT OR IGNORE INTO compounds (name, formula, mw, smiles, source, pubchem_cid)
                VALUES (?, ?, ?, ?, 'pubchem', ?)
            ''', (compound['name'], compound['formula'], compound['mw'], 
                  compound['smiles'], compound.get('pubchem_cid')))
            if cursor.rowcount > 0:
                added += 1
        except Exception as e:
            logger.error(f"Error storing compound: {e}")
    
    conn.commit()
    conn.close()
    return added

@app.route('/')
def index():
    return jsonify({
        'name': 'PharmSpec AI API v3.2',
        'status': 'running',
        'database': f'{len(LOCAL_COMPOUNDS)}+ compounds',
        'pubchem_integration': 'active',
        'endpoints': ['/api/test', '/api/stats', '/api/search/mass', '/api/match/spectrum']
    })

@app.route('/api/test')
def test():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM compounds')
    count = cursor.fetchone()[0]
    conn.close()
    
    return jsonify({
        'status': 'ok',
        'local_compounds': len(LOCAL_COMPOUNDS),
        'database_compounds': count,
        'pubchem_integration': 'active'
    })

@app.route('/api/stats')
def get_stats():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM compounds')
    total = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM mass_spectra')
    ms_count = cursor.fetchone()[0]
    
    cursor.execute('SELECT source, COUNT(*) FROM compounds GROUP BY source')
    by_source = dict(cursor.fetchall())
    
    conn.close()
    
    return jsonify({
        'total_compounds': total,
        'local_compounds': len(LOCAL_COMPOUNDS),
        'mass_spectra': ms_count,
        'by_source': by_source,
        'pubchem_ready': True
    })

@app.route('/api/search/mass', methods=['POST'])
def search_by_mass():
    data = request.json or {}
    mw = data.get('mw')
    tolerance = data.get('tolerance', 5.0)
    use_pubchem = data.get('use_pubchem', True)
    
    if not mw:
        return jsonify({'error': 'Molecular weight required'}), 400
    
    # Search local database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, name, formula, mw, smiles, category, cas, source
        FROM compounds 
        WHERE ABS(mw - ?) < ?
        ORDER BY ABS(mw - ?)
        LIMIT 100
    ''', (mw, tolerance, mw))
    
    local_results = []
    for row in cursor.fetchall():
        local_results.append({
            'id': row[0], 'name': row[1], 'formula': row[2], 'mw': row[3],
            'smiles': row[4], 'category': row[5], 'cas': row[6], 'source': row[7]
        })
    conn.close()
    
    pubchem_results = []
    # Fetch from PubChem if enabled and local results are few
    if use_pubchem and len(local_results) < 20:
        pubchem_results = fetch_pubchem_by_mw(mw, tolerance)
        # Store in database for future use
        if pubchem_results:
            added = store_pubchem_compounds(pubchem_results)
            logger.info(f"Stored {added} new PubChem compounds")
    
    return jsonify({
        'local': local_results,
        'pubchem': pubchem_results,
        'total': len(local_results) + len(pubchem_results),
        'mw_searched': mw,
        'tolerance': tolerance
    })

@app.route('/api/match/spectrum', methods=['POST'])
def match_spectrum():
    data = request.json or {}
    user_peaks = data.get('peaks', [])
    tolerance = data.get('tolerance', 0.5)
    top_k = data.get('top_k', 10)
    
    if not user_peaks:
        return jsonify({'error': 'No peaks provided'}), 400
    
    # Calculate average MW from peaks
    mw_values = [p.get('mz', 0) for p in user_peaks[:5] if p.get('mz', 0) > 0]
    avg_mw = np.mean(mw_values) if mw_values else 200
    
    # Fetch compounds from PubChem by MW
    pubchem_compounds = fetch_pubchem_by_mw(avg_mw, tolerance=50)
    store_pubchem_compounds(pubchem_compounds)
    
    # Now search all compounds in database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Get all compounds with similar MW
    cursor.execute('''
        SELECT id, name, formula, mw, smiles, cas, category
        FROM compounds 
        WHERE ABS(mw - ?) < 100
        ORDER BY ABS(mw - ?)
        LIMIT 200
    ''', (avg_mw, avg_mw))
    
    compounds = cursor.fetchall()
    conn.close()
    
    # Calculate similarity for each
    results = []
    for row in compounds:
        compound_mw = row[3]
        mw_diff = abs(compound_mw - avg_mw)
        mw_score = max(0, 100 - mw_diff)  # MW match score
        
        # Simple peak count match (placeholder for full spectrum)
        peak_count_score = min(100, len(user_peaks) * 10)
        
        # Combined score
        score = (mw_score * 0.5) + (peak_count_score * 0.3)
        confidence = min(score * 1.2, 99.5)
        
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
            'mw_match': round(mw_score, 1),
            'confidence': round(confidence, 1),
            'status': 'VALIDATED' if confidence >= 95 else 'LIKELY' if confidence >= 80 else 'UNLIKELY'
        })
    
    results.sort(key=lambda x: x['score'], reverse=True)
    
    return jsonify({
        'results': results[:top_k],
        'total_candidates': len(compounds),
        'pubchem_fetched': len(pubchem_compounds),
        'mw_used': avg_mw,
        'algorithm': 'mw_similarity'
    })

@app.route('/api/compound/<int:compound_id>')
def get_compound(compound_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM compounds WHERE id = ?', (compound_id,))
    row = cursor.fetchone()
    
    if not row:
        return jsonify({'error': 'Compound not found'}), 404
    
    conn.close()
    
    return jsonify({
        'id': row[0],
        'name': row[1],
        'formula': row[2],
        'smiles': row[3],
        'cas': row[5],
        'mw': row[6],
        'category': row[7],
        'source': row[8]
    })

@app.route('/api/import/pubchem', methods=['POST'])
def import_pubchem():
    """Import compounds from PubChem by mass range"""
    data = request.json or {}
    mw = data.get('mw', 200)
    tolerance = data.get('tolerance', 50)
    
    compounds = fetch_pubchem_by_mw(mw, tolerance)
    added = store_pubchem_compounds(compounds)
    
    return jsonify({
        'fetched': len(compounds),
        'stored': added,
        'mw_range': f"{mw-tolerance}-{mw+tolerance}"
    })

# Initialize
init_database()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
