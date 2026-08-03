'use client';

import { useState, useEffect, useRef } from 'react';

const THEMES = [
  { id: 'light',        name: 'Warm Cream',    desc: 'Ivory & Forest Emerald', accent: '#0B3C11', bg: '#FAF7EC' },
  { id: 'dark',         name: 'Deep Forest',   desc: 'Dark Night Emerald',     accent: '#1cb239', bg: '#061508' },
  { id: 'navy',         name: 'Royal Navy',    desc: 'Corporate Blue & Gold',  accent: '#f59e0b', bg: '#070f1e' },
  { id: 'cyber',        name: 'Cyberpunk',     desc: 'Midnight & Neon Cyan',   accent: '#06b6d4', bg: '#080c14' },
  { id: 'rose',         name: 'Rose Luxury',   desc: 'Deep Velvet & Blush',    accent: '#fb7185', bg: '#18091e' },
  { id: 'slate',        name: 'Nordic Slate',  desc: 'Steel Slate & Sapphire', accent: '#3b82f6', bg: '#0f172a' },
  { id: 'emerald-gold', name: 'Royal Gold',    desc: 'Emerald & Metallic Gold',accent: '#eab308', bg: '#022c22' },
  { id: 'sunset',       name: 'Terracotta',    desc: 'Warm Earth & Sand',      accent: '#ea580c', bg: '#1c100b' },
];

const FONTS = [
  { id: 'Jakarta',     name: 'Plus Jakarta Sans',  preview: 'Modern & Clean'        },
  { id: 'Inter',       name: 'Inter',              preview: 'Minimalist & Crisp'    },
  { id: 'Poppins',     name: 'Poppins',            preview: 'Friendly & Rounded'    },
  { id: 'Outfit',      name: 'Outfit',             preview: 'Bold & Geometric'      },
  { id: 'Roboto',      name: 'Roboto',             preview: 'Corporate & Universal'  },
  { id: 'Raleway',     name: 'Raleway',            preview: 'Elegant & Ultra-Modern' },
  { id: 'Montserrat',  name: 'Montserrat',         preview: 'Premium Geometric'     },
  { id: 'Lora',        name: 'Lora',               preview: 'Classic Serif'         },
  { id: 'Playfair',    name: 'Playfair Display',   preview: 'Luxury Serif'          },
  { id: 'Merriweather',name: 'Merriweather',       preview: 'Editorial Serif'       },
  { id: 'JetBrains',   name: 'JetBrains Mono',     preview: 'Technical Code'        },
  { id: 'SpaceMono',   name: 'Space Mono',         preview: 'Futuristic Tech'       },
];

const FONT_MAP = {
  Inter:        'Inter, sans-serif',
  Poppins:      'Poppins, sans-serif',
  Outfit:       'Outfit, sans-serif',
  Lora:         'Lora, serif',
  Playfair:     '"Playfair Display", serif',
  JetBrains:    '"JetBrains Mono", monospace',
  Roboto:       'Roboto, sans-serif',
  Raleway:      'Raleway, sans-serif',
  Montserrat:   'Montserrat, sans-serif',
  Merriweather: 'Merriweather, serif',
  SpaceMono:    '"Space Mono", monospace',
};

const VALID_THEMES = ['light', 'dark', 'navy', 'cyber', 'rose', 'slate', 'emerald-gold', 'sunset'];

function getSavedTheme() {
  try {
    const t = localStorage.getItem('h2h-theme');
    return VALID_THEMES.includes(t) ? t : 'light';
  } catch { return 'light'; }
}

function getSavedFont() {
  try { return localStorage.getItem('h2h-font') || 'Jakarta'; } catch { return 'Jakarta'; }
}

function applyTheme(themeId) {
  const t = VALID_THEMES.includes(themeId) ? themeId : 'light';
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem('h2h-theme', t); } catch {}
  try {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    document.cookie = `h2h_theme=${encodeURIComponent(t)}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
  } catch {}
}

function applyFont(fontId) {
  const fontVal = FONT_MAP[fontId] || 'var(--font-inter), "Plus Jakarta Sans", sans-serif';
  document.documentElement.style.setProperty('--font-body', fontVal);
  document.documentElement.style.setProperty('--font-heading', fontVal);
  try { localStorage.setItem('h2h-font', fontId); } catch {}
}

export default function FloatingThemeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [font, setFont] = useState('Jakarta');
  const [mounted, setMounted] = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    const savedTheme = getSavedTheme();
    const savedFont = getSavedFont();
    setTheme(savedTheme);
    setFont(savedFont);
    applyTheme(savedTheme);
    applyFont(savedFont);
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleThemeClick(themeId) {
    setTheme(themeId);
    applyTheme(themeId);
  }

  function handleFontClick(fontId) {
    setFont(fontId);
    applyFont(fontId);
  }

  if (!mounted) return null;

  return (
    <div ref={widgetRef} style={{ position: 'fixed', bottom: '24px', left: '24px', zIndex: 99999 }}>
      {/* Customization Panel */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '60px',
          left: 0,
          width: '320px',
          maxWidth: 'calc(100vw - 48px)',
          background: 'var(--color-bg-card, #1e293b)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 99999,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          animation: 'floatPanelSlideIn 0.25s cubic-bezier(0.16,1,0.3,1)',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary, #f8fafc)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
                <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
                <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
                <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.72 1.7-1.61 0-.43-.17-.83-.44-1.13-.27-.3-.43-.7-.43-1.13 0-.89.72-1.61 1.61-1.61h1.9c3.09 0 5.66-2.57 5.66-5.66 0-4.97-4.26-8.87-9.5-8.87z"/>
              </svg>
              Appearance &amp; Typography
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-tertiary, #94a3b8)', fontSize: '20px', cursor: 'pointer', padding: '4px', lineHeight: 1 }}
            >&times;</button>
          </div>

          {/* Themes Section */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary, #94a3b8)', marginBottom: '10px' }}>
              Website Theme (8 Palettes)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleThemeClick(t.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    padding: '10px',
                    borderRadius: '10px',
                    background: theme === t.id ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                    border: theme === t.id ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Swatch */}
                  <div style={{ height: '24px', borderRadius: '6px', overflow: 'hidden', display: 'flex', border: '1px solid rgba(0,0,0,0.1)' }}>
                    <span style={{ width: '35%', background: t.accent, display: 'block' }} />
                    <span style={{ width: '65%', background: t.bg, display: 'block' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-primary, #fff)' }}>{t.name}</span>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-tertiary, #94a3b8)' }}>{t.desc}</span>
                  </div>
                  {theme === t.id && (
                    <svg style={{ position: 'absolute', top: '8px', right: '8px', color: '#10b981' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Fonts Section */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary, #94a3b8)', marginBottom: '10px' }}>
              Typography Style (12 Fonts)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '180px', overflowY: 'auto' }}>
              {FONTS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleFontClick(f.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: font === f.id ? 'rgba(16,185,129,0.12)' : 'transparent',
                    border: font === f.id ? '1px solid #10b981' : '1px solid transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary, #fff)' }}>{f.name}</span>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-tertiary, #94a3b8)' }}>{f.preview}</span>
                  </div>
                  {font === f.id && (
                    <svg style={{ color: '#10b981', flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Customize Theme & Font"
        title="Customize Theme & Font"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'var(--gradient-primary, linear-gradient(135deg, #0B3C11 0%, #10b981 100%))',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          transform: isOpen ? 'scale(1.05) rotate(45deg)' : 'scale(1)',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.72 1.7-1.61 0-.43-.17-.83-.44-1.13-.27-.3-.43-.7-.43-1.13 0-.89.72-1.61 1.61-1.61h1.9c3.09 0 5.66-2.57 5.66-5.66 0-4.97-4.26-8.87-9.5-8.87z"/>
        </svg>
      </button>
    </div>
  );
}
