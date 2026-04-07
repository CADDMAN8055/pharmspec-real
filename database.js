// PharmSpec Database - Pharmaceutical Spectral Reference Library
const spectralDatabase = [
    {
        id: "ASP001",
        name: "Aspirin",
        formula: "C9H8O4",
        mw: 180.16,
        smiles: "CC(=O)Oc1ccccc1C(=O)O",
        iupac: "2-acetoxybenzoic acid",
        cas: "50-78-2",
        category: "NSAID",
        ms: {
            molecularIon: 180.04,
            fragments: [
                { mz: 180.04, intensity: 100, assignment: "M+" },
                { mz: 138.03, intensity: 35, assignment: "[M-CH2CO]+" },
                { mz: 120.02, intensity: 45, assignment: "[M-CH3COOH]+" },
                { mz: 92.03, intensity: 25, assignment: "C7H8+" },
                { mz: 65.04, intensity: 15, assignment: "C5H5+" }
            ]
        },
        nmr1h: [
            { ppm: 11.0, mult: "s", int: 1, assignment: "COOH" },
            { ppm: 7.9, mult: "dd", int: 1, assignment: "H-6" },
            { ppm: 7.6, mult: "dt", int: 1, assignment: "H-4" },
            { ppm: 7.3, mult: "dt", int: 1, assignment: "H-5" },
            { ppm: 7.1, mult: "dd", int: 1, assignment: "H-3" },
            { ppm: 2.3, mult: "s", int: 3, assignment: "CH3" }
        ],
        nmr13c: [
            { ppm: 170.2, type: "C", assignment: "C=O (acid)" },
            { ppm: 169.4, type: "C", assignment: "C=O (ester)" },
            { ppm: 150.9, type: "C", assignment: "C-1" },
            { ppm: 134.8, type: "CH", assignment: "C-4" },
            { ppm: 130.2, type: "CH", assignment: "C-6" },
            { ppm: 126.5, type: "CH", assignment: "C-5" },
            { ppm: 123.4, type: "CH", assignment: "C-3" },
            { ppm: 122.1, type: "C", assignment: "C-2" },
            { ppm: 21.2, type: "CH3", assignment: "CH3" }
        ]
    },
    {
        id: "PAR001",
        name: "Paracetamol",
        formula: "C8H9NO2",
        mw: 151.16,
        smiles: "CC(=O)Nc1ccc(O)cc1",
        iupac: "N-(4-hydroxyphenyl)acetamide",
        cas: "103-90-2",
        category: "Analgesic",
        ms: {
            molecularIon: 151.06,
            fragments: [
                { mz: 151.06, intensity: 100, assignment: "M+" },
                { mz: 109.05, intensity: 65, assignment: "[M-CH2CO]+" },
                { mz: 93.03, intensity: 25, assignment: "[M-CH3CONH]+" },
                { mz: 65.04, intensity: 20, assignment: "C5H5+" },
                { mz: 43.02, intensity: 45, assignment: "CH3CO+" }
            ]
        },
        nmr1h: [
            { ppm: 9.7, mult: "s", int: 1, assignment: "OH" },
            { ppm: 9.2, mult: "s", int: 1, assignment: "NH" },
            { ppm: 7.3, mult: "d", int: 2, assignment: "H-2,6" },
            { ppm: 6.6, mult: "d", int: 2, assignment: "H-3,5" },
            { ppm: 2.0, mult: "s", int: 3, assignment: "CH3" }
        ],
        nmr13c: [
            { ppm: 168.5, type: "C", assignment: "C=O" },
            { ppm: 153.2, type: "C", assignment: "C-4" },
            { ppm: 130.8, type: "C", assignment: "C-1" },
            { ppm: 121.5, type: "CH", assignment: "C-2,6" },
            { ppm: 115.4, type: "CH", assignment: "C-3,5" },
            { ppm: 24.2, type: "CH3", assignment: "CH3" }
        ]
    },
    {
        id: "IBU001",
        name: "Ibuprofen",
        formula: "C13H18O2",
        mw: 206.28,
        smiles: "CC(C)Cc1ccc(C(C)C(=O)O)cc1",
        iupac: "2-(4-isobutylphenyl)propanoic acid",
        cas: "15687-27-1",
        category: "NSAID",
        ms: {
            molecularIon: 206.13,
            fragments: [
                { mz: 206.13, intensity: 15, assignment: "M+" },
                { mz: 161.10, intensity: 100, assignment: "[M-COOH]+" },
                { mz: 119.09, intensity: 35, assignment: "[M-C4H9]+" },
                { mz: 105.07, intensity: 20, assignment: "C8H9+" },
                { mz: 91.05, intensity: 25, assignment: "C7H7+" }
            ]
        },
        nmr1h: [
            { ppm: 11.5, mult: "br s", int: 1, assignment: "COOH" },
            { ppm: 7.2, mult: "d", int: 2, assignment: "H-2,6" },
            { ppm: 7.1, mult: "d", int: 2, assignment: "H-3,5" },
            { ppm: 3.7, mult: "q", int: 1, assignment: "CH" },
            { ppm: 2.4, mult: "d", int: 2, assignment: "CH2" },
            { ppm: 1.9, mult: "m", int: 1, assignment: "CH" },
            { ppm: 1.5, mult: "d", int: 3, assignment: "CH3" },
            { ppm: 0.9, mult: "d", int: 6, assignment: "2x CH3" }
        ],
        nmr13c: [
            { ppm: 180.5, type: "C", assignment: "C=O" },
            { ppm: 140.8, type: "C", assignment: "C-1" },
            { ppm: 137.4, type: "C", assignment: "C-4" },
            { ppm: 129.4, type: "CH", assignment: "C-2,6" },
            { ppm: 127.2, type: "CH", assignment: "C-3,5" },
            { ppm: 45.2, type: "CH", assignment: "CH" },
            { ppm: 45.0, type: "CH2", assignment: "CH2" },
            { ppm: 30.3, type: "CH", assignment: "CH" },
            { ppm: 22.4, type: "CH3", assignment: "CH3" },
            { ppm: 22.3, type: "CH3", assignment: "2x CH3" }
        ]
    },
    {
        id: "DAP001",
        name: "Dapagliflozin",
        formula: "C21H25ClO6",
        mw: 408.87,
        smiles: "CCOC1=CC=C(C=C1)C2=CC(=O)C3=C(O2)C(=C(C=C3O)O)C(=O)O",
        iupac: "(2S,3R,4R,5S,6R)-2-[4-chloro-3-[(4-ethoxyphenyl)methyl]phenyl]-6-(hydroxymethyl)oxane-3,4,5-triol",
        cas: "461432-26-8",
        category: "SGLT2 Inhibitor",
        ms: {
            molecularIon: 408.12,
            fragments: [
                { mz: 408.12, intensity: 45, assignment: "M+" },
                { mz: 391.09, intensity: 100, assignment: "[M-OH]+" },
                { mz: 373.08, intensity: 35, assignment: "[M-H2O-OH]+" },
                { mz: 327.08, intensity: 25, assignment: "[M-C6H11O5]+" },
                { mz: 291.05, intensity: 40, assignment: "Aglycone+" }
            ]
        },
        nmr1h: [
            { ppm: 7.4, mult: "d", int: 1, assignment: "H-arom" },
            { ppm: 7.3, mult: "d", int: 1, assignment: "H-arom" },
            { ppm: 7.2, mult: "s", int: 1, assignment: "H-arom" },
            { ppm: 7.1, mult: "d", int: 2, assignment: "H-arom" },
            { ppm: 6.8, mult: "d", int: 2, assignment: "H-arom" },
            { ppm: 4.9, mult: "d", int: 1, assignment: "H-1" },
            { ppm: 4.0, mult: "q", int: 2, assignment: "OCH2" },
            { ppm: 3.9, mult: "m", int: 1, assignment: "H-5" },
            { ppm: 3.7, mult: "m", int: 1, assignment: "H-3" },
            { ppm: 3.5, mult: "m", int: 1, assignment: "H-4" },
            { ppm: 3.4, mult: "m", int: 1, assignment: "H-2" },
            { ppm: 3.3, mult: "m", int: 2, assignment: "CH2OH" },
            { ppm: 1.3, mult: "t", int: 3, assignment: "CH3" }
        ],
        nmr13c: [
            { ppm: 157.2, type: "C", assignment: "C-arom" },
            { ppm: 140.5, type: "C", assignment: "C-arom" },
            { ppm: 133.8, type: "CH", assignment: "C-arom" },
            { ppm: 130.2, type: "CH", assignment: "C-arom" },
            { ppm: 129.5, type: "C", assignment: "C-arom" },
            { ppm: 128.4, type: "CH", assignment: "C-arom" },
            { ppm: 114.8, type: "CH", assignment: "C-arom" },
            { ppm: 98.5, type: "CH", assignment: "C-1" },
            { ppm: 82.3, type: "CH", assignment: "C-5" },
            { ppm: 78.5, type: "CH", assignment: "C-3" },
            { ppm: 75.2, type: "CH", assignment: "C-2" },
            { ppm: 71.4, type: "CH", assignment: "C-4" },
            { ppm: 63.2, type: "CH2", assignment: "CH2OH" },
            { ppm: 63.0, type: "CH2", assignment: "OCH2" },
            { ppm: 14.8, type: "CH3", assignment: "CH3" }
        ]
    },
    {
        id: "MET001",
        name: "Metformin",
        formula: "C4H11N5",
        mw: 129.16,
        smiles: "CN(C)C(=N)NC(=N)N",
        iupac: "N,N-dimethylimidodicarbonimidic diamide",
        cas: "657-24-9",
        category: "Antidiabetic",
        ms: {
            molecularIon: 129.10,
            fragments: [
                { mz: 130.10, intensity: 100, assignment: "[M+H]+" },
                { mz: 113.08, intensity: 25, assignment: "[M-NH3]+" },
                { mz: 85.05, intensity: 35, assignment: "[M-(CH3)2NH]+" },
                { mz: 71.04, intensity: 45, assignment: "C2H5N3+" },
                { mz: 60.06, intensity: 30, assignment: "C2H6N3+" }
            ]
        },
        nmr1h: [
            { ppm: 8.5, mult: "br s", int: 2, assignment: "NH2" },
            { ppm: 7.2, mult: "br s", int: 2, assignment: "NH2" },
            { ppm: 3.0, mult: "s", int: 6, assignment: "N(CH3)2" }
        ],
        nmr13c: [
            { ppm: 159.2, type: "C", assignment: "C=NH" },
            { ppm: 158.8, type: "C", assignment: "C=NH" },
            { ppm: 37.5, type: "CH3", assignment: "2x CH3" }
        ]
    }
];

// Spectral matching algorithms
const SpectralMatcher = {
    // Calculate cosine similarity between two spectra
    cosineSimilarity(peaks1, peaks2, tolerance = 0.5) {
        let matches = 0;
        let totalIntensity1 = 0;
        let totalIntensity2 = 0;
        
        for (const p1 of peaks1) {
            totalIntensity1 += p1.intensity * p1.intensity;
            for (const p2 of peaks2) {
                if (Math.abs(p1.mz - p2.mz) <= tolerance) {
                    matches += p1.intensity * p2.intensity;
                }
            }
        }
        
        for (const p2 of peaks2) {
            totalIntensity2 += p2.intensity * p2.intensity;
        }
        
        if (totalIntensity1 === 0 || totalIntensity2 === 0) return 0;
        return (matches / (Math.sqrt(totalIntensity1) * Math.sqrt(totalIntensity2))) * 100;
    },
    
    // Match MS spectrum against database
    matchMS(extractedPeaks, tolerance = 0.5) {
        const results = [];
        
        for (const compound of spectralDatabase) {
            const dbPeaks = compound.ms.fragments;
            const similarity = this.cosineSimilarity(extractedPeaks, dbPeaks, tolerance);
            
            // Calculate molecular weight match
            const userMW = extractedPeaks.length > 0 ? Math.max(...extractedPeaks.map(p => p.mz)) : 0;
            const mwDiff = Math.abs(userMW - compound.mw);
            const mwScore = Math.max(0, 100 - (mwDiff * 2)); // Penalize MW difference
            
            // Weighted combination
            const finalScore = (similarity * 0.7) + (mwScore * 0.3);
            
            results.push({
                compound: compound,
                msScore: similarity,
                mwScore: mwScore,
                totalScore: finalScore,
                matchedPeaks: this.countMatchedPeaks(extractedPeaks, dbPeaks, tolerance)
            });
        }
        
        return results.sort((a, b) => b.totalScore - a.totalScore);
    },
    
    // Count matched peaks
    countMatchedPeaks(peaks1, peaks2, tolerance) {
        let count = 0;
        for (const p1 of peaks1) {
            for (const p2 of peaks2) {
                if (Math.abs(p1.mz - p2.mz) <= tolerance) {
                    count++;
                    break;
                }
            }
        }
        return count;
    },
    
    // Match 1H NMR
    matchNMR1H(extractedPeaks, tolerance = 0.1) {
        const results = [];
        
        for (const compound of spectralDatabase) {
            const dbPeaks = compound.nmr1h;
            let matches = 0;
            let totalShiftDiff = 0;
            
            for (const userPeak of extractedPeaks) {
                let bestMatch = null;
                let minDiff = Infinity;
                
                for (const dbPeak of dbPeaks) {
                    const diff = Math.abs(userPeak.ppm - dbPeak.ppm);
                    if (diff < minDiff && diff <= tolerance) {
                        minDiff = diff;
                        bestMatch = dbPeak;
                    }
                }
                
                if (bestMatch) {
                    matches++;
                    totalShiftDiff += minDiff;
                }
            }
            
            const coverageScore = (matches / Math.max(extractedPeaks.length, dbPeaks.length)) * 100;
            const accuracyScore = matches > 0 ? (1 - (totalShiftDiff / matches)) * 100 : 0;
            const finalScore = (coverageScore * 0.6) + (accuracyScore * 0.4);
            
            results.push({
                compound: compound,
                coverageScore: coverageScore,
                accuracyScore: accuracyScore,
                totalScore: finalScore,
                matchedPeaks: matches
            });
        }
        
        return results.sort((a, b) => b.totalScore - a.totalScore);
    },
    
    // Combined multi-spectral match
    combinedMatch(msPeaks = [], nmr1hPeaks = [], nmr13cPeaks = []) {
        const msResults = msPeaks.length > 0 ? this.matchMS(msPeaks) : [];
        const nmrResults = nmr1hPeaks.length > 0 ? this.matchNMR1H(nmr1hPeaks) : [];
        
        const combined = [];
        
        for (const compound of spectralDatabase) {
            const msMatch = msResults.find(r => r.compound.id === compound.id);
            const nmrMatch = nmrResults.find(r => r.compound.id === compound.id);
            
            let totalScore = 0;
            let weights = 0;
            let details = [];
            
            if (msMatch) {
                totalScore += msMatch.totalScore * 0.5;
                weights += 0.5;
                details.push(`MS: ${msMatch.msScore.toFixed(1)}% match, ${msMatch.matchedPeaks} peaks`);
            }
            
            if (nmrMatch) {
                totalScore += nmrMatch.totalScore * 0.5;
                weights += 0.5;
                details.push(`¹H NMR: ${nmrMatch.coverageScore.toFixed(1)}% coverage`);
            }
            
            if (weights > 0) {
                totalScore /= weights;
            }
            
            combined.push({
                compound: compound,
                totalScore: totalScore,
                confidence: this.calculateConfidence(totalScore, msMatch, nmrMatch),
                details: details,
                msData: msMatch,
                nmrData: nmrMatch
            });
        }
        
        return combined.sort((a, b) => b.totalScore - a.totalScore);
    },
    
    // Calculate confidence based on score and evidence
    calculateConfidence(score, msMatch, nmrMatch) {
        let confidence = score;
        
        // Boost confidence if both MS and NMR agree
        if (msMatch && nmrMatch) {
            confidence += 5;
        }
        
        // Cap at 99.5% (never claim 100% without human verification)
        return Math.min(confidence, 99.5);
    }
};

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { spectralDatabase, SpectralMatcher };
}
