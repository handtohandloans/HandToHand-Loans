'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { cacheUserPreferences, getCachedUserTheme, getCachedUserFont } from '@/lib/cookieCache';

const THEMES = [
  { id: 'light', name: 'Warm Cream', desc: 'Ivory & Forest Emerald', accent: '#0B3C11', bg: '#FAF7EC' },
  { id: 'dark', name: 'Deep Forest', desc: 'Dark Night Emerald', accent: '#1cb239', bg: '#061508' },
  { id: 'navy', name: 'Royal Navy', desc: 'Corporate Blue & Gold', accent: '#f59e0b', bg: '#0a192f' },
  { id: 'cyber', name: 'Cyberpunk', desc: 'Midnight & Neon Cyan', accent: '#06b6d4', bg: '#080c14' },
  { id: 'rose', name: 'Rose Luxury', desc: 'Deep Velvet & Blush', accent: '#fb7185', bg: '#18091e' },
  { id: 'slate', name: 'Nordic Slate', desc: 'Steel Slate & Sapphire', accent: '#3b82f6', bg: '#0f172a' },
  { id: 'emerald-gold', name: 'Royal Gold', desc: 'Emerald & Metallic Gold', accent: '#eab308', bg: '#022c22' },
  { id: 'sunset', name: 'Terracotta', desc: 'Warm Earth & Sand', accent: '#ea580c', bg: '#1c100b' },
];

const FONTS = [
  { id: 'Jakarta', name: 'Plus Jakarta Sans', fontClass: 'font-jakarta', preview: 'Modern & Clean' },
  { id: 'Inter', name: 'Inter', fontClass: 'font-inter', preview: 'Minimalist & Crisp' },
  { id: 'Poppins', name: 'Poppins', fontClass: 'font-poppins', preview: 'Friendly & Rounded' },
  { id: 'Outfit', name: 'Outfit', fontClass: 'font-outfit', preview: 'Bold & Geometric' },
  { id: 'Roboto', name: 'Roboto', fontClass: 'font-roboto', preview: 'Corporate & Universal' },
  { id: 'Raleway', name: 'Raleway', fontClass: 'font-raleway', preview: 'Elegant & Ultra-Modern' },
  { id: 'Montserrat', name: 'Montserrat', fontClass: 'font-montserrat', preview: 'Premium Geometric' },
  { id: 'Lora', name: 'Lora', fontClass: 'font-lora', preview: 'Classic Serif' },
  { id: 'Playfair', name: 'Playfair Display', fontClass: 'font-playfair', preview: 'Luxury Serif' },
  { id: 'Merriweather', name: 'Merriweather', fontClass: 'font-merriweather', preview: 'Editorial Serif' },
  { id: 'JetBrains', name: 'JetBrains Mono', fontClass: 'font-jetbrains', preview: 'Technical Code' },
  { id: 'SpaceMono', name: 'Space Mono', fontClass: 'font-spacemono', preview: 'Futuristic Tech' },
];

export default function FloatingThemeWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [activeFont, setActiveFont] = useState('Jakarta');
  const [mounted, setMounted] = useState(false);
  const widgetRef = useRef(null);

  // Sync theme and font on route changes and component mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = getCachedUserTheme();
    const savedFont = getCachedUserFont();
    setTheme(savedTheme);
    setActiveFont(savedFont);
    document.documentElement.setAttribute('data-theme', savedTheme);
    applyFont(savedFont);
  }, [pathname]);

  // Global event listener & MutationObserver for real-time synchronization
  useEffect(() => {
    const handleSync = () => {
      const savedTheme = getCachedUserTheme();
      const savedFont = getCachedUserFont();
      setTheme(savedTheme);
      setActiveFont(savedFont);
      document.documentElement.setAttribute('data-theme', savedTheme);
      applyFont(savedFont);
    };

    window.addEventListener('h2h-theme-change', handleSync);

    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('h2h-theme-change', handleSync);
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
    } else if (fontId === 'Roboto') {
      fontBody = 'Roboto, sans-serif';
      fontHeading = 'Roboto, sans-serif';
    } else if (fontId === 'Raleway') {
      fontBody = 'Raleway, sans-serif';
      fontHeading = 'Raleway, sans-serif';
    } else if (fontId === 'Montserrat') {
      fontBody = 'Montserrat, sans-serif';
      fontHeading = 'Montserrat, sans-serif';
    } else if (fontId === 'Merriweather') {
      fontBody = 'Merriweather, serif';
      fontHeading = 'Merriweather, serif';
    } else if (fontId === 'SpaceMono') {
      fontBody = '"Space Mono", monospace';
      fontHeading = '"Space Mono", monospace';
    } else {
      fontBody = 'var(--font-inter), "Plus Jakarta Sans", sans-serif';
      fontHeading = 'var(--font-plus-jakarta), "Plus Jakarta Sans", sans-serif';
    }

    document.documentElement.style.setProperty('--font-body', fontBody);
    document.documentElement.style.setProperty('--font-heading', fontHeading);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    cacheUserPreferences(newTheme, activeFont);
    document.documentElement.setAttribute('data-theme', newTheme);
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('h2h-theme-change'));
  };

  const handleFontChange = (fontId) => {
    setActiveFont(fontId);
    cacheUserPreferences(theme, fontId);
    applyFont(fontId);
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('h2h-theme-change'));
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
              <label className="floating-section-label">Website Theme (8 Palettes)</label>
              <div className="theme-options-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleThemeChange(t.id)}
                    className={`theme-option-card ${theme === t.id ? 'active' : ''}`}
                    style={{ position: 'relative', overflow: 'hidden' }}
                  >
                    <div className="theme-preview-swatch" style={{ background: t.bg, border: '1px solid rgba(255,255,255,0.1)' }}>
                      <span className="swatch-accent" style={{ background: t.accent }}></span>
                      <span className="swatch-bg" style={{ background: t.bg }}></span>
                    </div>
                    <div className="theme-option-info">
                      <span className="theme-option-title">{t.name}</span>
                      <span className="theme-option-desc">{t.desc}</span>
                    </div>
                    {theme === t.id && (
                      <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 2: Font Switcher */}
            <div className="floating-section">
              <label className="floating-section-label">Typography Style (12 Fonts)</label>
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

      {/* Floating Bottom-Left Trigger Button */}
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
