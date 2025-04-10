# Color Picker Pro

Color Picker Pro is a versatile and user-friendly Firefox extension designed to help you choose, manage, and work with colors quickly. Whether you're a designer, developer, or simply need a handy tool for color selection, this extension offers multiple features to explore and apply color values in various formats.

## ✨ Features

- **Multiple Color Formats:** Easily switch between HEX, RGB, and HSL formats.
- **Color Input:** Use the built-in color input tool to select your desired color.
- **Eyedropper Tool:** Pick colors from anywhere on your screen.
- **Random Color Generator:** Get inspired with random color suggestions.
- **History & Presets:** Keep track of your recently used colors and choose from preset palettes.
- **Color Schemes & Gradients:** Generate complementary, analogous, and triadic color schemes, as well as CSS gradients.

## 📥 Get It on Firefox Add-ons

You can install Color Picker Pro directly from the official Firefox Add-ons Store:  
[Color Picker Pro on Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/color_picker/)

## 📁 File Structure

- **manifest.json:** Contains the extension metadata, version information, and Firefox-specific settings.
- **index.html:** Provides the user interface, including the color picker input and tool panels.
- **style.css:** Defines the styling rules that give the extension its clean and modern appearance.

## 🔧 Installation (For Local Development)

If you wish to install a local copy for development or testing purposes:

1. **Download or Clone the Repository:**  
   Get a local copy of the extension source code.

2. **Open Firefox and Access Add-ons Debugging:**
   - Type `about:debugging` in the address bar.
   - Click on **"This Firefox"** in the sidebar.

3. **Load Temporary Add-on:**
   - Click **"Load Temporary Add-on…"**.
   - Select the `manifest.json` file from the extension folder.

4. **Start Using the Extension:**
   - Once loaded, click the extension icon in the Firefox toolbar to open Color Picker Pro.

## 📜 Manifest Details

- **Manifest Version:** 3
- **Name:** Color Picker Pro
- **Version:** 2.0
- **Description:** A versatile color picker tool featuring multiple color formats, history, presets, color schemes, and gradient generation.
- **Firefox-Specific Settings:**  
  Uses `browser_specific_settings` under `gecko` (minimum version 58.0) to ensure full compatibility with Firefox.

## 🛠 Development Notes

- Built exclusively for the Firefox browser.
- All interactions, data storage, and clipboard operations are handled locally on the client-side.
- This extension does not use any third-party dependencies.

## 📄 License

All rights reserved.
