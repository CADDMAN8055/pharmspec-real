/**
 * PharmSpec AI - Automatic Spectral Peak Detector
 * Extracts peaks from MS/NMR spectral images using HTML5 Canvas
 */

class SpectralPeakDetector {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.minPeakHeight = 20; // Minimum peak height in pixels
        this.smoothingWindow = 5; // Smoothing window size
    }

    /**
     * Load image and extract peaks
     * @param {HTMLImageElement} img - The spectral image
     * @param {string} type - 'ms' or 'nmr'
     * @returns {Promise<Array>} Array of detected peaks
     */
    async extractPeaks(img, type = 'ms') {
        // Set canvas size to match image
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        
        // Draw image on canvas
        this.ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        // Find the spectral line (assuming dark line on light background)
        const spectralLine = this.findSpectralLine(data, this.canvas.width, this.canvas.height);
        
        if (!spectralLine || spectralLine.length === 0) {
            console.warn('No spectral line detected');
            return [];
        }
        
        // Detect peaks in the spectral line
        const peaks = this.detectPeaksInLine(spectralLine);
        
        // Map to actual values (requires axis detection)
        const mappedPeaks = this.mapToValues(peaks, type, this.canvas.width);
        
        return mappedPeaks;
    }

    /**
     * Find the spectral line by scanning for dark pixels
     */
    findSpectralLine(data, width, height) {
        const line = [];
        
        // For each x position, find the lowest dark pixel (highest y value)
        for (let x = 0; x < width; x += 2) { // Skip every other pixel for speed
            let minY = height;
            let minBrightness = 255;
            
            // Scan vertical column
            for (let y = 0; y < height; y++) {
                const idx = (y * width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                
                // Calculate brightness (0-255)
                const brightness = (r + g + b) / 3;
                
                // Look for dark pixels (spectral line)
                if (brightness < 100 && brightness < minBrightness) {
                    minBrightness = brightness;
                    minY = y;
                }
            }
            
            // Invert y (higher on canvas = lower y value, but we want intensity)
            // Actually, spectral peaks point UP, so lower y = higher peak
            if (minY < height) {
                line.push({
                    x: x,
                    y: minY,
                    intensity: height - minY // Invert: top of image = high intensity
                });
            }
        }
        
        return line;
    }

    /**
     * Detect peaks by finding local maxima
     */
    detectPeaksInLine(line) {
        const peaks = [];
        const windowSize = 10; // Minimum distance between peaks
        
        // Smooth the line
        const smoothed = this.smoothLine(line.map(p => p.intensity), this.smoothingWindow);
        
        // Find local maxima
        for (let i = windowSize; i < smoothed.length - windowSize; i++) {
            let isMax = true;
            const currentValue = smoothed[i];
            
            // Check if this is a local maximum
            for (let j = i - windowSize; j <= i + windowSize; j++) {
                if (j !== i && smoothed[j] > currentValue) {
                    isMax = false;
                    break;
                }
            }
            
            // Check minimum peak height
            if (isMax && currentValue > this.minPeakHeight) {
                // Avoid duplicate peaks too close together
                const lastPeak = peaks[peaks.length - 1];
                if (!lastPeak || (i - lastPeak.index) > windowSize) {
                    peaks.push({
                        index: i,
                        x: line[i].x,
                        intensity: Math.round((currentValue / Math.max(...smoothed)) * 100)
                    });
                }
            }
        }
        
        return peaks;
    }

    /**
     * Smooth data using moving average
     */
    smoothLine(data, windowSize) {
        const smoothed = [];
        const halfWindow = Math.floor(windowSize / 2);
        
        for (let i = 0; i < data.length; i++) {
            let sum = 0;
            let count = 0;
            
            for (let j = Math.max(0, i - halfWindow); j <= Math.min(data.length - 1, i + halfWindow); j++) {
                sum += data[j];
                count++;
            }
            
            smoothed.push(sum / count);
        }
        
        return smoothed;
    }

    /**
     * Map pixel positions to actual m/z or ppm values
     * This is simplified - real implementation would need axis OCR
     */
    mapToValues(peaks, type, imageWidth) {
        // Simplified mapping assuming:
        // - MS: x-axis from 50 to 1000 m/z
        // - NMR: x-axis from 0 to 12 ppm
        
        const minX = 0;
        const maxX = imageWidth;
        
        let minValue, maxValue;
        
        if (type === 'ms') {
            minValue = 50;
            maxValue = 500;
        } else if (type === 'nmr1h') {
            minValue = 0;
            maxValue = 12;
        } else {
            minValue = 0;
            maxValue = 200;
        }
        
        return peaks.map(peak => {
            const normalizedX = (peak.x - minX) / (maxX - minX);
            // For NMR, x-axis typically goes right-to-left (high to low ppm)
            const value = type === 'nmr1h' 
                ? maxValue - (normalizedX * (maxValue - minValue))
                : minValue + (normalizedX * (maxValue - minValue));
            
            return {
                x: peak.x,
                [type === 'ms' ? 'mz' : 'ppm']: Math.round(value * 100) / 100,
                intensity: peak.intensity
            };
        });
    }

    /**
     * Visualize detected peaks on canvas
     */
    visualizePeaks(img, peaks, type) {
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.ctx.drawImage(img, 0, 0);
        
        // Draw red circles at peak positions
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        
        peaks.forEach(peak => {
            const x = peak.x;
            const y = this.canvas.height - (peak.intensity / 100 * this.canvas.height * 0.8);
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
            this.ctx.stroke();
            
            // Draw value label
            this.ctx.fillStyle = 'red';
            this.ctx.font = '12px Arial';
            const label = type === 'ms' 
                ? `${peak.mz.toFixed(1)}` 
                : `${peak.ppm.toFixed(1)}`;
            this.ctx.fillText(label, x - 10, y - 10);
        });
        
        return this.canvas.toDataURL();
    }
}

// Export for use in app.js
window.SpectralPeakDetector = SpectralPeakDetector;
