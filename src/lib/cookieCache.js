// Cookie Caching Utilities for HandToHand Loans Platform
// Reduces initial load time & page transition delays to < 40ms

export function setCookie(name, value, days = 7) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${isSecure}`;
}

export function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function eraseCookie(name) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

// User Profile & Credential Caching Helpers
export function cacheUserProfile(profile) {
  if (!profile) return;
  try {
    const summary = {
      id: profile.id,
      full_name: profile.full_name,
      email: profile.email,
      phone: profile.phone,
      role: profile.role || 'client',
      agent_code: profile.agent_code || '',
      profile_completed: profile.profile_completed || false,
      profile_locked: profile.profile_locked || false,
      avatar: profile.avatar || '',
      selfie: profile.selfie || ''
    };
    
    setCookie('h2h_user_role', summary.role, 7);
    setCookie('h2h_agent_code', summary.agent_code, 7);
    setCookie('h2h_profile_summary', JSON.stringify(summary), 7);
    
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('h2h_cached_profile', JSON.stringify(profile));
    }
  } catch (err) {
    console.warn('Cookie cache error:', err);
  }
}

export function getCachedUserProfile() {
  if (typeof window === 'undefined') return null;
  try {
    const local = localStorage.getItem('h2h_cached_profile');
    if (local) return JSON.parse(local);

    const cookieStr = getCookie('h2h_profile_summary');
    if (cookieStr) return JSON.parse(cookieStr);
  } catch (err) {
    console.warn('Failed to parse cached profile:', err);
  }
  return null;
}

export function getCachedUserRole() {
  return getCookie('h2h_user_role') || 'client';
}

export function clearUserCache() {
  eraseCookie('h2h_user_role');
  eraseCookie('h2h_agent_code');
  eraseCookie('h2h_profile_summary');
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('h2h_cached_profile');
  }
}

export const THEME_PALETTES = {
  light: {
    '--bg-base': '#FAF7EC',
    '--bg-surface': '#ffffff',
    '--bg-subtle': '#f3efe0',
    '--color-primary': '#0B3C11',
    '--color-primary-hover': '#17521e',
    '--color-primary-light': 'rgba(11, 60, 17, 0.08)',
    '--color-btn-primary-bg': '#0B3C11',
    '--color-btn-primary-text': '#FAF7EC',
    '--text-primary': '#0a240c',
    '--text-secondary': '#2e4831',
    '--text-muted': '#526e55',
    '--border-default': '#e2dac2',
    '--color-bg-primary': '#FAF7EC',
    '--color-bg-secondary': '#ffffff',
    '--color-bg-tertiary': '#f3efe0',
    '--color-bg-card': '#ffffff',
    '--color-text-primary': '#0a240c',
    '--color-text-secondary': '#2e4831',
  },
  dark: {
    '--bg-base': '#061508',
    '--bg-surface': '#0a200d',
    '--bg-subtle': '#112e15',
    '--color-primary': '#1cb239',
    '--color-primary-hover': '#159c31',
    '--color-primary-light': 'rgba(28, 178, 57, 0.12)',
    '--color-btn-primary-bg': '#1cb239',
    '--color-btn-primary-text': '#061508',
    '--text-primary': '#f4f8f4',
    '--text-secondary': '#a3c4a7',
    '--text-muted': '#6d9472',
    '--border-default': '#1a421e',
    '--color-bg-primary': '#061508',
    '--color-bg-secondary': '#0a200d',
    '--color-bg-tertiary': '#112e15',
    '--color-bg-card': '#0a200d',
    '--color-text-primary': '#f4f8f4',
    '--color-text-secondary': '#a3c4a7',
  },
  navy: {
    '--bg-base': '#070f1e',
    '--bg-surface': '#0e1c36',
    '--bg-subtle': '#172a4d',
    '--color-primary': '#2563eb',
    '--color-primary-hover': '#1d4ed8',
    '--color-primary-light': 'rgba(37, 99, 235, 0.15)',
    '--color-btn-primary-bg': '#2563eb',
    '--color-btn-primary-text': '#ffffff',
    '--text-primary': '#f8fafc',
    '--text-secondary': '#94a3b8',
    '--text-muted': '#64748b',
    '--border-default': '#1e3a8a',
    '--color-bg-primary': '#070f1e',
    '--color-bg-secondary': '#0e1c36',
    '--color-bg-tertiary': '#172a4d',
    '--color-bg-card': '#0e1c36',
    '--color-text-primary': '#f8fafc',
    '--color-text-secondary': '#94a3b8',
  },
  cyber: {
    '--bg-base': '#080c14',
    '--bg-surface': '#0e1626',
    '--bg-subtle': '#162238',
    '--color-primary': '#06b6d4',
    '--color-primary-hover': '#0891b2',
    '--color-primary-light': 'rgba(6, 182, 212, 0.15)',
    '--color-btn-primary-bg': '#06b6d4',
    '--color-btn-primary-text': '#080c14',
    '--text-primary': '#ecfeff',
    '--text-secondary': '#a5f3fc',
    '--text-muted': '#67e8f9',
    '--border-default': '#164e63',
    '--color-bg-primary': '#080c14',
    '--color-bg-secondary': '#0e1626',
    '--color-bg-tertiary': '#162238',
    '--color-bg-card': '#0e1626',
    '--color-text-primary': '#ecfeff',
    '--color-text-secondary': '#a5f3fc',
  },
  rose: {
    '--bg-base': '#18091e',
    '--bg-surface': '#261130',
    '--bg-subtle': '#381a45',
    '--color-primary': '#fb7185',
    '--color-primary-hover': '#f43f5e',
    '--color-primary-light': 'rgba(251, 113, 133, 0.15)',
    '--color-btn-primary-bg': '#e11d48',
    '--color-btn-primary-text': '#ffffff',
    '--text-primary': '#fff1f2',
    '--text-secondary': '#fecdd3',
    '--text-muted': '#fda4af',
    '--border-default': '#881337',
    '--color-bg-primary': '#18091e',
    '--color-bg-secondary': '#261130',
    '--color-bg-tertiary': '#381a45',
    '--color-bg-card': '#261130',
    '--color-text-primary': '#fff1f2',
    '--color-text-secondary': '#fecdd3',
  },
  slate: {
    '--bg-base': '#0f172a',
    '--bg-surface': '#1e293b',
    '--bg-subtle': '#334155',
    '--color-primary': '#3b82f6',
    '--color-primary-hover': '#2563eb',
    '--color-primary-light': 'rgba(59, 130, 246, 0.15)',
    '--color-btn-primary-bg': '#3b82f6',
    '--color-btn-primary-text': '#ffffff',
    '--text-primary': '#f8fafc',
    '--text-secondary': '#cbd5e1',
    '--text-muted': '#94a3b8',
    '--border-default': '#334155',
    '--color-bg-primary': '#0f172a',
    '--color-bg-secondary': '#1e293b',
    '--color-bg-tertiary': '#334155',
    '--color-bg-card': '#1e293b',
    '--color-text-primary': '#f8fafc',
    '--color-text-secondary': '#cbd5e1',
  },
  'emerald-gold': {
    '--bg-base': '#022c22',
    '--bg-surface': '#064e3b',
    '--bg-subtle': '#047857',
    '--color-primary': '#eab308',
    '--color-primary-hover': '#ca8a04',
    '--color-primary-light': 'rgba(234, 179, 8, 0.15)',
    '--color-btn-primary-bg': '#eab308',
    '--color-btn-primary-text': '#022c22',
    '--text-primary': '#fefce8',
    '--text-secondary': '#fef08a',
    '--text-muted': '#fde047',
    '--border-default': '#115e59',
    '--color-bg-primary': '#022c22',
    '--color-bg-secondary': '#064e3b',
    '--color-bg-tertiary': '#047857',
    '--color-bg-card': '#064e3b',
    '--color-text-primary': '#fefce8',
    '--color-text-secondary': '#fef08a',
  },
  sunset: {
    '--bg-base': '#1c100b',
    '--bg-surface': '#2e1a12',
    '--bg-subtle': '#45271b',
    '--color-primary': '#ea580c',
    '--color-primary-hover': '#c2410c',
    '--color-primary-light': 'rgba(234, 88, 12, 0.15)',
    '--color-btn-primary-bg': '#ea580c',
    '--color-btn-primary-text': '#ffffff',
    '--text-primary': '#fff7ed',
    '--text-secondary': '#ffedd5',
    '--text-muted': '#fed7aa',
    '--border-default': '#7c2d12',
    '--color-bg-primary': '#1c100b',
    '--color-bg-secondary': '#2e1a12',
    '--color-bg-tertiary': '#45271b',
    '--color-bg-card': '#2e1a12',
    '--color-text-primary': '#fff7ed',
    '--color-text-secondary': '#ffedd5',
  }
};

export function applyThemeCSS(themeId) {
  if (typeof document === 'undefined') return;
  const validThemes = ['light', 'dark', 'navy', 'cyber', 'rose', 'slate', 'emerald-gold', 'sunset'];
  const safeTheme = validThemes.includes(themeId) ? themeId : 'light';
  
  // Clear any inline style property overrides so globals.css data-theme rules take 100% effect cleanly
  const style = document.documentElement.style;
  const keysToRemove = [
    '--bg-base', '--bg-surface', '--bg-subtle', '--color-primary', '--color-primary-hover',
    '--color-primary-light', '--color-btn-primary-bg', '--color-btn-primary-text', '--text-primary',
    '--text-secondary', '--text-muted', '--border-default', '--color-bg-primary', '--color-bg-secondary',
    '--color-bg-tertiary', '--color-bg-card', '--color-text-primary', '--color-text-secondary'
  ];
  keysToRemove.forEach((key) => style.removeProperty(key));

  document.documentElement.setAttribute('data-theme', safeTheme);
}

// User Theme & Font Preference Caching Helpers
export function cacheUserPreferences(theme, font) {
  if (typeof document === 'undefined') return;
  if (theme) {
    applyThemeCSS(theme);
    setCookie('h2h_theme', theme, 365);
    if (typeof localStorage !== 'undefined') localStorage.setItem('theme', theme);
  }
  if (font) {
    setCookie('h2h_user_font', font, 365);
    if (typeof localStorage !== 'undefined') localStorage.setItem('user-font', font);
  }
}

export function getCachedUserTheme() {
  if (typeof window === 'undefined') return 'light';
  return (typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null) || getCookie('h2h_theme') || 'light';
}

export function getCachedUserFont() {
  if (typeof window === 'undefined') return 'Jakarta';
  return (typeof localStorage !== 'undefined' ? localStorage.getItem('user-font') : null) || getCookie('h2h_user_font') || 'Jakarta';
}
