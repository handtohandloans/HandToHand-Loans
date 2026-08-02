'use client';

import { useState, useEffect, useRef } from 'react';

const FONTS = [
  { id: 'Jakarta', name: 'Plus Jakarta Sans', fontClass: 'font-jakarta', preview: 'Modern & Clean' },
  { id: 'Inter', name: 'Inter', fontClass: 'font-inter', preview: 'Minimalist & Crisp' },
  { id: 'Poppins', name: 'Poppins', fontClass: 'font-poppins', preview: 'Friendly & Rounded' },
  { id: 'Outfit', name: 'Outfit', fontClass: 'font-outfit', preview: 'Bold & Geometric' },
  { id: 'Lora', name: 'Lora', fontClass: 'font-lora', preview: 'Classic Serif' },
  { id: 'Playfair', name: 'Playfair Display', fontClass: 'font-playfair', preview: 'Luxury Serif' },
  { id: 'JetBrains', name: 'JetBrains Mono', fontClass: 'font-jetbrains', preview: 'Technical Code' },
];

export default function FloatingThemeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [activeFont, setActiveFont] = useState('Jakarta');
  const [mounted, setMounted] = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedFont = localStorage.getItem('user-font') || 'Jakarta';
    setTheme(savedTheme);
    setActiveFont(savedFont);

    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const applyFont = (fontId) => {
    let fontBody = '';
    let fontHeading = '';
    if (fontId === 'Inter') {
      fontBody = 'Inter, sans-serif';
      fontHeading = 'Inter, sans-serif';
    } else if (fontId === 'Poppins') {
      fontBody = 'Poppins, sans-serif';
      fontHeading = 'Poppins, sans-serif';
    } else if (fontId === 'Outfit') {
      fontBody = 'Outfit, sans-serif';
      fontHeading = 'Outfit, sans-serif';
    } else if (fontId === 'Lora') {
      fontBody = 'Lora, serif';
      fontHeading = 'Lora, serif';
    } else if (fontId === 'Playfair') {
      fontBody = '"Playfair Display", serif';
      fontHeading = '"Playfair Display", serif';
    } else if (fontId === 'JetBrains') {
      fontBody = '"JetBrains Mono", monospace';
      fontHeading = '"JetBrains Mono", monospace';
    } else {
      fontBody = 'var(--font-inter), "Plus Jakarta Sans", sans-serif';
      fontHeading = 'var(--font-plus-jakarta), "Plus Jakarta Sans", sans-serif';
    }

    document.documentElement.style.setProperty('--font-body', fontBody);
    document.documentElement.style.setProperty('--font-heading', fontHeading);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleFontChange = (fontId) => {
    setActiveFont(fontId);
    localStorage.setItem('user-font', fontId);
    applyFont(fontId);
  };

  if (!mounted) return null;

  return (
    <div className="floating-widget-wrapper" ref={widgetRef}>
      {/* Floating Panel Drawer */}
      {isOpen && (
        <div className="floating-theme-panel" role="dialog" aria-label="Theme and Font Customization">
          <div className="floating-panel-header">
            <div className="floating-panel-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
                <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
                <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
                <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.72 1.7-1.61 0-.43-.17-.83-.44-1.13-.27-.3-.43-.7-.43-1.13 0-.89.72-1.61 1.61-1.61h1.9c3.09 0 5.66-2.57 5.66-5.66 0-4.97-4.26-8.87-9.5-8.87z"></path>
              </svg>
              <span>Appearance & Typography</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="floating-panel-close-btn"
              aria-label="Close panel"
            >
              &times;
            </button>
          </div>

          <div className="floating-panel-body">
            {/* Section 1: Theme Switcher */}
            <div className="floating-section">
              <label className="floating-section-label">Website Theme</label>
              <div className="theme-options-grid">
                <button
                  type="button"
                  onClick={() => handleThemeChange('light')}
                  className={`theme-option-card ${theme === 'light' ? 'active' : ''}`}
                >
                  <div className="theme-preview-swatch light-swatch">
                    <span className="swatch-accent"></span>
                    <span className="swatch-bg"></span>
                  </div>
                  <div className="theme-option-info">
                    <span className="theme-option-title">Warm Cream</span>
                    <span className="theme-option-desc">Ivory & Forest Green</span>
                  </div>
                  {theme === 'light' && (
                    <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleThemeChange('dark')}
                  className={`theme-option-card ${theme === 'dark' ? 'active' : ''}`}
                >
                  <div className="theme-preview-swatch dark-swatch">
                    <span className="swatch-accent"></span>
                    <span className="swatch-bg"></span>
                  </div>
                  <div className="theme-option-info">
                    <span className="theme-option-title">Deep Forest</span>
                    <span className="theme-option-desc">Dark Night Emerald</span>
                  </div>
                  {theme === 'dark' && (
                    <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Section 2: Font Switcher */}
            <div className="floating-section">
              <label className="floating-section-label">Font Family</label>
              <div className="font-options-list">
                {FONTS.map((font) => (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => handleFontChange(font.id)}
                    className={`font-option-item ${activeFont === font.id ? 'active' : ''}`}
                  >
                    <div className="font-item-text">
                      <span className={`font-name ${font.fontClass}`}>{font.name}</span>
                      <span className="font-preview-tag">{font.preview}</span>
                    </div>
                    {activeFont === font.id && (
                      <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom-Left Trigger Button (Small Round) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`floating-theme-trigger ${isOpen ? 'open' : ''}`}
        aria-label="Customize Theme & Font"
        title="Customize Theme & Font"
      >
        <div className="trigger-icons">
          <svg className="palette-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.72 1.7-1.61 0-.43-.17-.83-.44-1.13-.27-.3-.43-.7-.43-1.13 0-.89.72-1.61 1.61-1.61h1.9c3.09 0 5.66-2.57 5.66-5.66 0-4.97-4.26-8.87-9.5-8.87z"></path>
          </svg>
        </div>
      </button>
    </div>
  );
}
