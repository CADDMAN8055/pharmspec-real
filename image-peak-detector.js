/**
 * PharmSpec AI - Advanced Spectral Peak Detector
 * Detects ALL peaks from MS/NMR images including small peaks
 * Critical for sensitive drug analysis
 */

class SpectralPeakDetector {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        // SENSITIVE settings for drug analysis - detect ALL peaks
        this.minPeakHeight = 5;        // Very low threshold
        this.minPeakProminence = 3;    // Minimum prominence
        this.smoothingWindow = 3;      // Minimal smoothing
        this.noiseThreshold = 2;       // Noise filtering
        this.maxPeaks = 100;           // Detect up to 100 peaks
        this.minDistance = 3;          // Minimum pixels between peaks
    }

    /**
     * Extract ALL peaks from spectral image
     * @param {HTMLImageElement} img - The spectral image
     * @param {string} type - 'ms' or 'nmr'
     * @returns {Promise<Array>} All detected peaks sorted by position
     */
    async extractPeaks(img, type = 'nmr1h') {
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        
        this.ctx.drawImage(img, 0, 0);
        
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        
        // Extract spectral trace
        const trace = this.extractTrace(imageData, this.canvas.width, this.canvas.height);
        
        if (!trace || trace.length === 0) {
            console.warn('No spectral trace found');
            return [];
        }
        
        // Detect ALL peaks with high sensitivity
        const peaks = this.findAllPeaks(trace);
        
        // Map to chemical values
        const mappedPeaks = this.mapToChemicalValues(peaks, type, this.canvas.width);
        
        console.log(`Detected ${mappedPeaks.length} peaks`);
        return mappedPeaks;
    }

    /**
     * Extract spectral trace by finding the signal line
     */
    extractTrace(data, width, height) {
        const trace = [];
        
        // For each x column, find the spectral signal
        for (let x = 0; x < width; x += 1) {
            const columnValues = [];
            
            // Scan entire column
            for (let y = 0; y < height; y++) {
                const idx = (y * width + x) * 4;
                // Calculate darkness (spectral lines are dark)
                const darkness = 255 - ((data.data[idx] + data.data[idx+1] + data.data[idx+2]) / 3);
                columnValues.push({y, darkness});
            }
            
            // Find the baseline (average of bottom 20%)
            const sorted = [...columnValues].sort((a, b) => a.darkness - b.darkness);
            const baseline = sorted.slice(0, Math.floor(sorted.length * 0.2))
                .reduce((sum, v) => sum + v.darkness, 0) / Math.floor(sorted.length * 0.2);
            
            // Find all dark pixels above baseline
            const peaks = columnValues.filter(v => v.darkness > baseline + this.noiseThreshold);
            
            if (peaks.length > 0) {
                // Take the darkest point (highest peak)
                const darkest = peaks.reduce((max, v) => v.darkness > max.darkness ? v : max);
                trace.push({
                    x: x,
                    y: darkest.y,
                    intensity: darkest.darkness - baseline,
                    rawIntensity: darkest.darkness
                });
            } else {
                // No signal - use baseline
                trace.push({
                    x: x,
                    y: height - 1,
                    intensity: 0,
                    rawIntensity: baseline
                });
            }
        }
        
        return trace;
    }

    /**
     * Find ALL peaks using second derivative method
     */
    findAllPeaks(trace) {
        // Extract intensity profile
        const intensities = trace.map(t => t.intensity);
        
        // Smooth slightly to reduce noise
        const smoothed = this.smooth(intensities, this.smoothingWindow);
        
        // Calculate first derivative
        const firstDerivative = [];
        for (let i = 1; i < smoothed.length; i++) {
            firstDerivative.push(smoothed[i] - smoothed[i-1]);
        }
        
        // Calculate second derivative
        const secondDerivative = [];
        for (let i = 1; i < firstDerivative.length; i++) {
            secondDerivative.push(firstDerivative[i] - firstDerivative[i-1]);
        }
        
        // Find peaks: second derivative < 0 (concave down) AND first derivative crosses 0
        const peaks = [];
        for (let i = 2; i < secondDerivative.length - 2; i++) {
            const prevSlope = firstDerivative[i-1];
            const currSlope = firstDerivative[i];
            const curvature = secondDerivative[i];
            
            // Peak criteria:
            // 1. Slope changes from positive to negative (crosses zero)
            // 2. Negative curvature (concave down)
            // 3. Sufficient height
            if (prevSlope > 0 && currSlope <= 0 && curvature < -0.5) {
                const traceIdx = i + 2;
                const peakHeight = smoothed[traceIdx];
                
                // Check minimum height
                if (peakHeight > this.minPeakHeight) {
                    // Check prominence - how much above local baseline
                    const leftBaseline = this.findLocalMinimum(smoothed, traceIdx, -20);
                    const rightBaseline = this.findLocalMinimum(smoothed, traceIdx, 20);
                    const localBaseline = Math.max(leftBaseline, rightBaseline);
                    const prominence = peakHeight - localBaseline;
                    
                    if (prominence > this.minPeakProminence) {
                        // Check not too close to previous peak
                        const lastPeak = peaks[peaks.length - 1];
                        if (!lastPeak || (traceIdx - lastPeak.index) >= this.minDistance) {
                            peaks.push({
                                index: traceIdx,
                                x: trace[traceIdx].x,
                                y: trace[traceIdx].y,
                                intensity: Math.round((peakHeight / Math.max(...smoothed)) * 100),
                                prominence: prominence
                            });
                        }
                    }
                }
            }
        }
        
        // Sort by position (x-axis)
        return peaks.sort((a, b) => a.x - b.x);
    }

    /**
     * Find local minimum in smoothed data
     */
    findLocalMinimum(data, center, range) {
        const start = Math.max(0, center + range);
        const end = Math.min(data.length - 1, center + (range > 0 ? range : -range));
        
        let min = data[center];
        for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
            if (data[i] < min) min = data[i];
        }
        return min;
    }

    /**
     * Smooth data using Savitzky-Golay filter approximation
     */
    smooth(data, windowSize) {
        const smoothed = [];
        const halfWindow = Math.floor(windowSize / 2);
        
        for (let i = 0; i < data.length; i++) {
            let sum = 0;
            let weightSum = 0;
            
            for (let j = -halfWindow; j <= halfWindow; j++) {
                const idx = i + j;
                if (idx >= 0 && idx < data.length) {
                    // Gaussian weight
                    const weight = Math.exp(-(j * j) / (2 * halfWindow * halfWindow));
                    sum += data[idx] * weight;
                    weightSum += weight;
                }
            }
            
            smoothed.push(sum / weightSum);
        }
        
        return smoothed;
    }

    /**
     * Map pixel positions to chemical values (ppm or m/z)
     */
    mapToChemicalValues(peaks, type, imageWidth) {
        // Define axis ranges based on spectrum type
        let minVal, maxVal, isReversed;
        
        switch(type) {
            case 'nmr1h':
                minVal = 0;      // 0 ppm
                maxVal = 12;     // 12 ppm
                isReversed = true; // NMR goes right-to-left
                break;
            case 'nmr13c':
                minVal = 0;
                maxVal = 220;
                isReversed = true;
                break;
            case 'ms':
                minVal = 50;     // 50 m/z
                maxVal = 1000;   // 1000 m/z
                isReversed = false;
                break;
            default:
                minVal = 0;
                maxVal = 10;
                isReversed = false;
        }
        
        return peaks.map(peak => {
            const normalizedPos = peak.x / imageWidth;
            
            let value;
            if (isReversed) {
                // Right to left (NMR)
                value = maxVal - (normalizedPos * (maxVal - minVal));
            } else {
                // Left to right (MS)
                value = minVal + (normalizedPos * (maxVal - minVal));
            }
            
            return {
                x: peak.x,
                position: Math.round(value * 100) / 100,
                intensity: peak.intensity,
                type: type === 'ms' ? 'mz' : 'ppm'
            };
        }).slice(0, this.maxPeaks);
    }

    /**
     * Visualize detected peaks on the spectrum
     */
    visualizePeaks(img, peaks, type) {
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        
        // Draw original image
        this.ctx.drawImage(img, 0, 0);
        
        // Draw peak markers
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.fillStyle = '#ff0000';
        this.ctx.lineWidth = 2;
        this.ctx.font = 'bold 11px Arial';
        
        peaks.forEach((peak, i) => {
            const x = peak.x;
            const y = 30; // Draw markers at top
            
            // Draw circle at peak position (bottom of image)
            const bottomY = this.canvas.height - 20;
            this.ctx.beginPath();
            this.ctx.arc(x, bottomY, 4, 0, 2 * Math.PI);
            this.ctx.stroke();
            this.ctx.fill();
            
            // Draw vertical line
            this.ctx.beginPath();
            this.ctx.moveTo(x, bottomY - 10);
            this.ctx.lineTo(x, bottomY + 10);
            this.ctx.stroke();
            
            // Draw value label (alternate above/below to avoid overlap)
            const labelY = (i % 2 === 0) ? 25 : 45;
            const label = peak.position.toFixed(type === 'ms' ? 1 : 2);
            
            // White background for text
            const textWidth = this.ctx.measureText(label).width;
            this.ctx.fillStyle = 'rgba(255,255,255,0.9)';
            this.ctx.fillRect(x - textWidth/2 - 2, labelY - 10, textWidth + 4, 14);
            
            // Text
            this.ctx.fillStyle = '#ff0000';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(label, x, labelY);
        });
        
        // Add peak count
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.fillRect(10, 10, 150, 25);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'left';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.fillText(`Detected: ${peaks.length} peaks`, 15, 27);
        
        return this.canvas.toDataURL('image/jpeg', 0.9);
    }

    /**
     * Get peak list formatted for display
     */
    formatPeakList(peaks, type) {
        if (type === 'ms') {
            return peaks.map(p => `${p.position.toFixed(1)}(${p.intensity})`).join(', ');
        } else {
            // NMR - include multiplicity if we can detect it
            return peaks.map(p => `${p.position.toFixed(2)}`).join(', ');
        }
    }
}

// Export
window.SpectralPeakDetector = SpectralPeakDetector;
