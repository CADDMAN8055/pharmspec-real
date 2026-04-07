// PharmSpec AI - Real Spectral Database Matcher
// Performs actual database matching with cosine similarity scoring

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const newAnalysisBtn = document.getElementById('newAnalysisBtn');
    const exportBtn = document.getElementById('exportBtn');
    
    const inputSection = document.getElementById('inputSection');
    const processingSection = document.getElementById('processingSection');
    const resultsSection = document.getElementById('resultsSection');
    
    // Update database count
    document.getElementById('dbCount').textContent = spectralDatabase.length;
    
    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab + 'Tab').classList.add('active');
        });
    });
    
    // Analyze button
    analyzeBtn.addEventListener('click', performAnalysis);
    newAnalysisBtn.addEventListener('click', resetAnalysis);
    exportBtn.addEventListener('click', exportReport);
    
    // Display database compounds
    displayDatabase();
});

function performAnalysis() {
    // Get active tab
    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    
    let msPeaks = [];
    let nmrPeaks = [];
    
    // Parse input based on tab
    if (activeTab === 'ms') {
        const msInput = document.getElementById('msInput').value.trim();
        if (!msInput) {
            alert('Please enter MS data');
            return;
        }
        msPeaks = parseMSInput(msInput);
    } else if (activeTab === 'nmr1h') {
        const nmrInput = document.getElementById('nmrInput').value.trim();
        if (!nmrInput) {
            alert('Please enter NMR data');
            return;
        }
        nmrPeaks = parseNMRInput(nmrInput);
    } else if (activeTab === 'combined') {
        const msInput = document.getElementById('msCombined').value.trim();
        const nmrInput = document.getElementById('nmrCombined').value.trim();
        
        if (msInput) msPeaks = parseMSInput(msInput);
        if (nmrInput) nmrPeaks = parseNMRInput(nmrInput);
        
        if (msPeaks.length === 0 && nmrPeaks.length === 0) {
            alert('Please enter at least MS or NMR data');
            return;
        }
    }
    
    // Show processing
    showProcessing();
    
    // Perform matching (with delay for visual effect)
    setTimeout(() => {
        const results = performMatching(msPeaks, nmrPeaks);
        showResults(results, msPeaks, nmrPeaks);
    }, 1500);
}

function parseMSInput(input) {
    const peaks = [];
    const entries = input.split(/[,;\n]/).map(e => e.trim()).filter(e => e);
    
    for (const entry of entries) {
        // Match patterns: 180(100), 180 (100), 180:100, 180
        const match = entry.match(/([\d.]+)\s*[\(:]\s*(\d+)?\s*[\)]?/);
        if (match) {
            peaks.push({
                mz: parseFloat(match[1]),
                intensity: match[2] ? parseInt(match[2]) : 50
            });
        }
    }
    
    return peaks;
}

function parseNMRInput(input) {
    const peaks = [];
    const lines = input.split(/[,;\n]/).map(e => e.trim()).filter(e => e);
    
    for (const line of lines) {
        // Match: 7.2 (d, 2H) or 7.2 d 2H or 7.2
        const match = line.match(/([\d.]+)\s*\(?\s*([sdtqmbrsh]+)?\s*,?\s*(\d+)?\s*H?\)?/i);
        if (match) {
            peaks.push({
                ppm: parseFloat(match[1]),
                mult: (match[2] || 's').toLowerCase(),
                int: parseInt(match[3]) || 1
            });
        }
    }
    
    return peaks;
}

function performMatching(msPeaks, nmrPeaks) {
    const results = [];
    
    for (const compound of spectralDatabase) {
        let totalScore = 0;
        let weights = 0;
        let details = [];
        let matchData = {
            ms: null,
            nmr: null
        };
        
        // MS Matching
        if (msPeaks.length > 0 && compound.ms && compound.ms.fragments) {
            const msScore = calculateMSSimilarity(msPeaks, compound.ms.fragments);
            matchData.ms = msScore;
            
            if (msScore.overall > 0) {
                totalScore += msScore.overall * 0.6;
                weights += 0.6;
                details.push(`MS: ${msScore.overall.toFixed(1)}% similarity`);
            }
        }
        
        // NMR Matching
        if (nmrPeaks.length > 0 && compound.nmr1h) {
            const nmrScore = calculateNMRSimilarity(nmrPeaks, compound.nmr1h);
            matchData.nmr = nmrScore;
            
            if (nmrScore.overall > 0) {
                totalScore += nmrScore.overall * 0.4;
                weights += 0.4;
                details.push(`¹H NMR: ${nmrScore.overall.toFixed(1)}% match`);
            }
        }
        
        // Normalize score
        if (weights > 0) {
            totalScore /= weights;
        }
        
        // Calculate confidence
        const confidence = Math.min(totalScore * (weights > 1 ? 1.05 : 1), 99.5);
        
        results.push({
            compound: compound,
            totalScore: totalScore,
            confidence: confidence,
            details: details,
            matchData: matchData,
            inputPeaks: { ms: msPeaks, nmr: nmrPeaks }
        });
    }
    
    return results.sort((a, b) => b.totalScore - a.totalScore);
}

function calculateMSSimilarity(userPeaks, dbPeaks, tolerance = 0.5) {
    if (userPeaks.length === 0 || dbPeaks.length === 0) {
        return { overall: 0, matched: 0, total: 0, cosine: 0 };
    }
    
    // Cosine similarity calculation
    let dotProduct = 0;
    let userNorm = 0;
    let dbNorm = 0;
    let matched = 0;
    
    // Normalize intensities
    const userMax = Math.max(...userPeaks.map(p => p.intensity));
    const dbMax = Math.max(...dbPeaks.map(p => p.intensity));
    
    const normUserPeaks = userPeaks.map(p => ({
        mz: p.mz,
        intensity: (p.intensity / userMax) * 100
    }));
    
    const normDbPeaks = dbPeaks.map(p => ({
        mz: p.mz,
        intensity: (p.intensity / dbMax) * 100
    }));
    
    // Find matches
    const usedDbPeaks = new Set();
    
    for (const uPeak of normUserPeaks) {
        let bestMatch = null;
        let bestScore = 0;
        
        for (let i = 0; i < normDbPeaks.length; i++) {
            if (usedDbPeaks.has(i)) continue;
            
            const dPeak = normDbPeaks[i];
            const mzDiff = Math.abs(uPeak.mz - dPeak.mz);
            
            if (mzDiff <= tolerance) {
                const intensityMatch = Math.min(uPeak.intensity, dPeak.intensity) / 
                                      Math.max(uPeak.intensity, dPeak.intensity);
                const mzScore = 1 - (mzDiff / tolerance);
                const score = (intensityMatch * 0.7) + (mzScore * 0.3);
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = { index: i, peak: dPeak, score: score };
                }
            }
        }
        
        if (bestMatch) {
            dotProduct += uPeak.intensity * bestMatch.peak.intensity;
            usedDbPeaks.add(bestMatch.index);
            matched++;
        }
        
        userNorm += uPeak.intensity * uPeak.intensity;
    }
    
    for (const dPeak of normDbPeaks) {
        dbNorm += dPeak.intensity * dPeak.intensity;
    }
    
    const cosine = (userNorm > 0 && dbNorm > 0) ? 
        (dotProduct / (Math.sqrt(userNorm) * Math.sqrt(dbNorm))) * 100 : 0;
    
    // Calculate coverage score
    const coverage = (matched / Math.max(userPeaks.length, dbPeaks.length)) * 100;
    
    // Overall score
    const overall = (cosine * 0.7) + (coverage * 0.3);
    
    return {
        overall: overall,
        cosine: cosine,
        coverage: coverage,
        matched: matched,
        total: Math.max(userPeaks.length, dbPeaks.length)
    };
}

function calculateNMRSimilarity(userPeaks, dbPeaks, tolerance = 0.2) {
    if (userPeaks.length === 0 || dbPeaks.length === 0) {
        return { overall: 0, matched: 0 };
    }
    
    let matched = 0;
    let totalShiftDiff = 0;
    const usedDbPeaks = new Set();
    
    for (const uPeak of userPeaks) {
        let bestMatch = null;
        let minDiff = Infinity;
        
        for (let i = 0; i < dbPeaks.length; i++) {
            if (usedDbPeaks.has(i)) continue;
            
            const dPeak = dbPeaks[i];
            const diff = Math.abs(uPeak.ppm - dPeak.ppm);
            
            if (diff <= tolerance && diff < minDiff) {
                minDiff = diff;
                bestMatch = { index: i, peak: dPeak };
            }
        }
        
        if (bestMatch) {
            matched++;
            totalShiftDiff += minDiff;
            usedDbPeaks.add(bestMatch.index);
        }
    }
    
    const coverage = (matched / Math.max(userPeaks.length, dbPeaks.length)) * 100;
    const accuracy = matched > 0 ? (1 - (totalShiftDiff / (matched * tolerance))) * 100 : 0;
    const overall = (coverage * 0.6) + (accuracy * 0.4);
    
    return {
        overall: overall,
        coverage: coverage,
        accuracy: accuracy,
        matched: matched,
        total: Math.max(userPeaks.length, dbPeaks.length)
    };
}

function showProcessing() {
    inputSection.classList.add('hidden');
    processingSection.classList.remove('hidden');
    
    // Animate progress
    const progressFill = document.getElementById('progressFill');
    const steps = [
        document.getElementById('procStep1'),
        document.getElementById('procStep2'),
        document.getElementById('procStep3')
    ];
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        progressFill.style.width = progress + '%';
        
        if (progress > 30) {
            steps[0].classList.remove('active');
            steps[1].classList.add('active');
        }
        if (progress > 70) {
            steps[1].classList.remove('active');
            steps[2].classList.add('active');
        }
        
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 75);
}

function showResults(results, msPeaks, nmrPeaks) {
    processingSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    
    const topResult = results[0];
    
    // Show match quality
    const matchQuality = document.getElementById('matchQuality');
    const qualityClass = topResult.confidence >= 95 ? 'excellent' : 
                        topResult.confidence >= 80 ? 'good' : 'moderate';
    const qualityText = topResult.confidence >= 95 ? 'Excellent Match' : 
                       topResult.confidence >= 80 ? 'Good Match' : 'Moderate Match';
    
    matchQuality.innerHTML = `
        <div class="quality-badge ${qualityClass}">
            ${qualityText}
        </div>
        <div class="confidence-display">
            <span class="confidence-value">${topResult.confidence.toFixed(1)}%</span>
            <span class="confidence-label">Confidence</span>
        </div>
    `;
    
    // Show top match
    const topMatch = document.getElementById('topMatch');
    topMatch.innerHTML = `
        <div class="match-card">
            <div class="match-header">
                <h2>${topResult.compound.name}</h2>
                <span class="match-score">${topResult.totalScore.toFixed(1)}% Match</span>
            </div>
            
            <div class="match-details">
                <div class="detail-row">
                    <span class="label">Formula:</span>
                    <span class="value">${topResult.compound.formula}</span>
                </div>
                <div class="detail-row">
                    <span class="label">MW:</span>
                    <span class="value">${topResult.compound.mw} g/mol</span>
                </div>
                <div class="detail-row">
                    <span class="label">SMILES:</span>
                    <code class="smiles">${topResult.compound.smiles}</code>
                </div>
                <div class="detail-row">
                    <span class="label">IUPAC:</span>
                    <span class="value">${topResult.compound.iupac}</span>
                </div>
                <div class="detail-row">
                    <span class="label">CAS:</span>
                    <span class="value">${topResult.compound.cas}</span>
                </div>
            </div>
            
            <div class="match-evidence">
                <h4>📊 Matching Evidence:</h4>
                <ul>
                    ${topResult.details.map(d => `<li>${d}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    // Show all matches table
    const tableBody = document.getElementById('matchesTableBody');
    tableBody.innerHTML = results.slice(0, 5).map((r, i) => `
        <tr class="${i === 0 ? 'top-result' : ''}">
            <td>${i + 1}</td>
            <td><strong>${r.compound.name}</strong></td>
            <td>${r.compound.formula}</td>
            <td>${r.compound.mw}</td>
            <td>${r.totalScore.toFixed(1)}%</td>
            <td><span class="conf-badge ${r.confidence >= 95 ? 'high' : r.confidence >= 80 ? 'medium' : 'low'}">${r.confidence.toFixed(1)}%</span></td>
            <td>${r.details.join(', ')}</td>
        </tr>
    `).join('');
    
    // Show detailed analysis
    const detailedAnalysis = document.getElementById('detailedAnalysis');
    let analysisHTML = '';
    
    if (topResult.matchData.ms) {
        analysisHTML += `
            <div class="analysis-section">
                <h4>🔬 MS Analysis</h4>
                <div class="metric-grid">
                    <div class="metric">
                        <span class="metric-value">${topResult.matchData.ms.cosine.toFixed(1)}%</span>
                        <span class="metric-label">Cosine Similarity</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">${topResult.matchData.ms.coverage.toFixed(1)}%</span>
                        <span class="metric-label">Peak Coverage</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">${topResult.matchData.ms.matched}/${topResult.matchData.ms.total}</span>
                        <span class="metric-label">Peaks Matched</span>
                    </div>
                </div>
                
                <div class="peak-comparison">
                    <h5>Key Matching Peaks:</h5>
                    <table class="peak-table">
                        <thead>
                            <tr><th>m/z (Input)</th><th>m/z (DB)></th><th>Δ ppm</th><th>Assignment</th></tr>
                        </thead>
                        <tbody>
                            ${topResult.compound.ms.fragments.slice(0, 4).map(f => {
                                const userPeak = msPeaks.find(p => Math.abs(p.mz - f.mz) < 0.5);
                                return userPeak ? `
                                    <tr>
                                        <td>${userPeak.mz.toFixed(2)}</td>
                                        <td>${f.mz.toFixed(2)}</td>
                                        <td>${((userPeak.mz - f.mz) / f.mz * 1000000).toFixed(0)}</td>
                                        <td>${f.assignment}</td>
                                    </tr>
                                ` : '';
                            }).join('')}
                        </tbody>
                    </table฿
                </div>
            </div>
        `;
    }
    
    detailedAnalysis.innerHTML = analysisHTML;
}

function resetAnalysis() {
    resultsSection.classList.add('hidden');
    inputSection.classList.remove('hidden');
    
    // Clear inputs
    document.getElementById('msInput').value = '';
    document.getElementById('nmrInput').value = '';
    document.getElementById('msCombined').value = '';
    document.getElementById('nmrCombined').value = '';
}

function exportReport() {
    const topMatch = document.querySelector('.match-card h2');
    if (!topMatch) return;
    
    const compoundName = topMatch.textContent;
    const compound = spectralDatabase.find(c => c.name === compoundName);
    
    if (!compound) return;
    
    const report = {
        analysis_date: new Date().toISOString(),
        software: "PharmSpec AI - Database Matcher",
        version: "1.0",
        compound: compound,
        database_size: spectralDatabase.length,
        confidence_score: parseFloat(document.querySelector('.confidence-value').textContent),
        verified_by: ""
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PharmSpec_Report_${compound.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function displayDatabase() {
    const grid = document.getElementById('compoundGrid');
    grid.innerHTML = spectralDatabase.map(c => `
        <div class="compound-card">
            <h4>${c.name}</h4>
            <p class="formula">${c.formula}</p>
            <p class="mw">MW: ${c.mw} g/mol</p>
            <p class="category">${c.category}</p>
        </div>
    `).join('');
}
