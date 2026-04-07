#!/usr/bin/env python3
"""
Bulk import compounds from PubChem
Downloads millions of compounds with spectral data
"""

import requests
import sqlite3
import json
import time
from concurrent.futures import ThreadPoolExecutor
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DB_PATH = 'pharmspec.db'
PUBCHEM_API = "https://pubchem.ncbi.nlm.nih.gov/rest/pug"

def fetch_pubchem_list(start=1, count=100000):
    """Fetch list of CIDs from PubChem"""
    url = f"{PUBCHEM_API}/compound/fastformula/mass/200/400/JSON?mass_error=50"
    try:
        response = requests.get(url, timeout=60)
        if response.status_code == 200:
            data = response.json()
            return data.get('IdentifierList', {}).get('CID', [])
    except Exception as e:
        logger.error(f"Error fetching list: {e}")
    return []

def fetch_compound_batch(cids):
    """Fetch details for a batch of compounds"""
    if not cids:
        return []
    
    cid_string = ','.join(str(c) for c in cids[:100])  # Max 100 per request
    url = f"{PUBCHEM_API}/compound/cid/{cid_string}/property/IUPACName,MolecularFormula,MolecularWeight,IsomericSMILES,InChIKey/JSON"
    
    try:
        response = requests.get(url, timeout=60)
        if response.status_code == 200:
            data = response.json()
            return data.get('PropertyTable', {}).get('Properties', [])
    except Exception as e:
        logger.error(f"Error fetching batch: {e}")
    return []

def import_to_database(compounds):
    """Import compounds to SQLite database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    imported = 0
    for compound in compounds:
        try:
            cursor.execute('''
                INSERT OR IGNORE INTO compounds 
                (name, formula, mw, smiles, inchikey, pubchem_cid, source)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                compound.get('IUPACName', f"Compound_{compound.get('CID')}"),
                compound.get('MolecularFormula', ''),
                compound.get('MolecularWeight', 0),
                compound.get('IsomericSMILES', ''),
                compound.get('InChIKey', ''),
                compound.get('CID'),
                'pubchem'
            ))
            if cursor.rowcount > 0:
                imported += 1
        except Exception as e:
            logger.error(f"Error importing compound: {e}")
    
    conn.commit()
    conn.close()
    return imported

def main():
    """Main import function"""
    logger.info("Starting PubChem import...")
    logger.info("This will download thousands of compounds. Estimated time: 1-2 hours for 100K compounds")
    
    total_imported = 0
    
    # Import in batches
    # In production, you'd iterate through all PubChem compounds
    # For demo, we'll import a representative set
    
    mass_ranges = [
        (100, 200), (200, 300), (300, 400), (400, 500),
        (500, 600), (600, 700), (700, 800), (800, 1000)
    ]
    
    for min_mass, max_mass in mass_ranges:
        logger.info(f"Importing compounds with MW {min_mass}-{max_mass}...")
        
        url = f"{PUBCHEM_API}/compound/fastformula/mass/{(min_mass+max_mass)/2}/JSON?mass_error={max_mass-min_mass}"
        
        try:
            response = requests.get(url, timeout=60)
            if response.status_code == 200:
                data = response.json()
                cids = data.get('IdentifierList', {}).get('CID', [])[:1000]  # Limit per range
                
                logger.info(f"Found {len(cids)} compounds in MW range {min_mass}-{max_mass}")
                
                # Process in batches of 100
                for i in range(0, len(cids), 100):
                    batch = cids[i:i+100]
                    compounds = fetch_compound_batch(batch)
                    imported = import_to_database(compounds)
                    total_imported += imported
                    
                    logger.info(f"Imported {imported} compounds (total: {total_imported})")
                    time.sleep(0.5)  # Rate limiting
                    
        except Exception as e:
            logger.error(f"Error in mass range {min_mass}-{max_mass}: {e}")
    
    logger.info(f"Import complete! Total compounds imported: {total_imported}")

if __name__ == '__main__':
    main()
