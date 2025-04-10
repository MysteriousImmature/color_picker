document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const colorInput = document.getElementById('colorInput');
    const colorCode = document.getElementById('colorCode');
    const copyBtn = document.getElementById('copyBtn');
    const colorHistory = document.getElementById('colorHistory');
    const notification = document.getElementById('notification');
    const formatBtns = document.querySelectorAll('.format-btn');
    const presetColors = document.querySelectorAll('.preset-color');
    const eyedropperBtn = document.getElementById('eyedropperBtn');
    const randomBtn = document.getElementById('randomBtn');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const complementaryScheme = document.getElementById('complementary');
    const analogousScheme = document.getElementById('analogous');
    const triadicScheme = document.getElementById('triadic');
    const gradientPreview = document.getElementById('gradientPreview');
    const copyGradientBtn = document.getElementById('copyGradientBtn');

    // Variables
    let currentFormat = 'hex';
    let currentColor = '#ff0000';
    let colorHistoryArray = [];
    const maxHistoryItems = 8;

    // Load color history from storage
    loadColorHistory();

    // Check if EyeDropper API is available
    const eyeDropperAvailable = 'EyeDropper' in window;
    if (!eyeDropperAvailable) {
        eyedropperBtn.disabled = true;
        eyedropperBtn.title = 'EyeDropper not supported in this browser';
        eyedropperBtn.style.opacity = '0.5';
    }

    // Function to convert HEX to RGB
    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Function to convert RGB values to HEX
    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // Function to convert HEX to HSL
    function hexToHsl(hex) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);

        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    // Function to convert HEX to HSV
    function hexToHsv(hex) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const d = max - min;
        
        let h, s, v = max;
        
        s = max === 0 ? 0 : d / max;
        
        if (max === min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return { h, s, v };
    }

    // Function to convert HSV to HEX
    function hsvToHex(h, s, v) {
        let r, g, b;
        
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
        
        return rgbToHex(
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255)
        );
    }

    // Function to generate complementary color
    function generateComplementaryColor(hex) {
        const hsv = hexToHsv(hex);
        const h = (hsv.h + 0.5) % 1;
        return hsvToHex(h, hsv.s, hsv.v);
    }

    // Function to generate analogous colors
    function generateAnalogousColors(hex) {
        const hsv = hexToHsv(hex);
        const h1 = (hsv.h + 0.0833) % 1; // 30 degrees
        const h2 = (hsv.h - 0.0833 + 1) % 1; // -30 degrees
        return [
            hsvToHex(h1, hsv.s, hsv.v),
            hsvToHex(h2, hsv.s, hsv.v)
        ];
    }

    // Function to generate triadic colors
    function generateTriadicColors(hex) {
        const hsv = hexToHsv(hex);
        const h1 = (hsv.h + 0.3333) % 1; // 120 degrees
        const h2 = (hsv.h + 0.6667) % 1; // 240 degrees
        return [
            hsvToHex(h1, hsv.s, hsv.v),
            hsvToHex(h2, hsv.s, hsv.v)
        ];
    }

    // Update color display based on current format
    function updateColorDisplay(color) {
        currentColor = color;
        colorInput.value = color;
        
        switch(currentFormat) {
            case 'hex':
                colorCode.textContent = color;
                break;
            case 'rgb':
                colorCode.textContent = hexToRgb(color);
                break;
            case 'hsl':
                colorCode.textContent = hexToHsl(color);
                break;
        }

        // Update color schemes
        updateColorSchemes(color);

        // Update gradient preview
        updateGradientPreview();
    }

    // Update color schemes
    function updateColorSchemes(color) {
        // Clear previous schemes
        complementaryScheme.innerHTML = '';
        analogousScheme.innerHTML = '';
        triadicScheme.innerHTML = '';

        // Generate schemes
        const compColor = generateComplementaryColor(color);
        const analogColors = generateAnalogousColors(color);
        const triadColors = generateTriadicColors(color);

        // Create color elements
        const compEl = document.createElement('div');
        compEl.className = 'scheme-color';
        compEl.style.backgroundColor = compColor;
        compEl.setAttribute('data-color', compColor);
        compEl.title = compColor;
        compEl.addEventListener('click', function() {
            updateColorDisplay(compColor);
            addToHistory(compColor);
        });
        complementaryScheme.appendChild(compEl);

        // Add analogous colors
        analogColors.forEach(analogColor => {
            const colorEl = document.createElement('div');
            colorEl.className = 'scheme-color';
            colorEl.style.backgroundColor = analogColor;
            colorEl.setAttribute('data-color', analogColor);
            colorEl.title = analogColor;
            colorEl.addEventListener('click', function() {
                updateColorDisplay(analogColor);
                addToHistory(analogColor);
            });
            analogousScheme.appendChild(colorEl);
        });

        // Add triadic colors
        triadColors.forEach(triadColor => {
            const colorEl = document.createElement('div');
            colorEl.className = 'scheme-color';
            colorEl.style.backgroundColor = triadColor;
            colorEl.setAttribute('data-color', triadColor);
            colorEl.title = triadColor;
            colorEl.addEventListener('click', function() {
                updateColorDisplay(triadColor);
                addToHistory(triadColor);
            });
            triadicScheme.appendChild(colorEl);
        });
    }

    // Update gradient preview
    function updateGradientPreview() {
        const compColor = generateComplementaryColor(currentColor);
        gradientPreview.style.background = `linear-gradient(to right, ${currentColor}, ${compColor})`;
    }

    // Add color to history
    function addToHistory(color) {
        // Don't add if it's already the most recent color
        if (colorHistoryArray.length > 0 && colorHistoryArray[0] === color) {
            return;
        }
        
        // Add to beginning of array
        colorHistoryArray.unshift(color);
        
        // Trim array if it exceeds max length
        if (colorHistoryArray.length > maxHistoryItems) {
            colorHistoryArray.pop();
        }
        
        // Save to storage
        saveColorHistory();
        
        // Update UI
        updateColorHistoryUI();
    }

    // Update color history UI
    function updateColorHistoryUI() {
        colorHistory.innerHTML = '';
        
        colorHistoryArray.forEach(color => {
            const colorEl = document.createElement('div');
            colorEl.className = 'history-color';
            colorEl.style.backgroundColor = color;
            colorEl.setAttribute('data-color', color);
            colorEl.title = color;
            
            colorEl.addEventListener('click', function() {
                updateColorDisplay(color);
            });
            
            colorHistory.appendChild(colorEl);
        });
    }

    // Save color history to local storage
    function saveColorHistory() {
        localStorage.setItem('colorHistory', JSON.stringify(colorHistoryArray));
    }

    // Load color history from local storage
    function loadColorHistory() {
        const savedHistory = localStorage.getItem('colorHistory');
        if (savedHistory) {
            colorHistoryArray = JSON.parse(savedHistory);
            updateColorHistoryUI();
        }
    }

    // Generate random color
    function generateRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Switch tabs
    function switchTab(tabId) {
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        document.querySelector(`.tab[data-tab="${tabId}"]`).classList.add('active');
        document.querySelector(`.tab-content[data-content="${tabId}"]`).classList.add('active');
    }

    // Show notification
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }

    // Event: Color input change
    colorInput.addEventListener('input', function () {
        const color = colorInput.value;
        updateColorDisplay(color);
        addToHistory(color);
    });

    // Event: Format button click
    formatBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            formatBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentFormat = btn.getAttribute('data-format');
            updateColorDisplay(currentColor);
        });
    });

    // Event: Tab click
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = tab.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Event: Eyedropper button click
    eyedropperBtn.addEventListener('click', function() {
        if (eyeDropperAvailable) {
            const eyeDropper = new EyeDropper();
            eyeDropper.open()
                .then(result => {
                    updateColorDisplay(result.sRGBHex);
                    addToHistory(result.sRGBHex);
                    showNotification('Color picked from screen!');
                })
                .catch(err => {
                    console.error('EyeDropper error:', err);
                });
        } else {
            showNotification('EyeDropper not supported in this browser');
        }
    });

    // Event: Random color button click
    randomBtn.addEventListener('click', function() {
        const randomColor = generateRandomColor();
        updateColorDisplay(randomColor);
        addToHistory(randomColor);
        showNotification('Random color generated!');
    });

    // Event: Copy button click
    copyBtn.addEventListener('click', function () {
        navigator.clipboard.writeText(colorCode.textContent)
            .then(() => {
                showNotification('Color copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy color code: ', err);
                showNotification('Failed to copy. Try again.');
            });
    });

    // Event: Copy gradient button click
    copyGradientBtn.addEventListener('click', function() {
        const compColor = generateComplementaryColor(currentColor);
        const gradientCSS = `background: linear-gradient(to right, ${currentColor}, ${compColor});`;
        
        navigator.clipboard.writeText(gradientCSS)
            .then(() => {
                showNotification('Gradient CSS copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy gradient CSS: ', err);
                showNotification('Failed to copy. Try again.');
            });
    });

    // Event: Preset color click
    presetColors.forEach(color => {
        color.addEventListener('click', function() {
            const hexColor = rgbStrToHex(color.style.backgroundColor);
            updateColorDisplay(hexColor);
            addToHistory(hexColor);
        });
    });

    // Helper: Convert RGB string to HEX
    function rgbStrToHex(rgb) {
        // Handle rgb(r, g, b) format
        const match = rgb.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
        if (match) {
            return '#' + 
                ('0' + parseInt(match[1], 10).toString(16)).slice(-2) +
                ('0' + parseInt(match[2], 10).toString(16)).slice(-2) +
                ('0' + parseInt(match[3], 10).toString(16)).slice(-2);
        }
        return rgb;
    }

    // Initialize with default color
    updateColorDisplay(colorInput.value);
});
