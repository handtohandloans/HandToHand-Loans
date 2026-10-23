'use client';

import React, { useEffect, useRef } from 'react';

export default function PhoneEmailSignInBtn({ onSuccess, disabled = false, prefillPhone = '' }) {
  const containerRef = useRef(null);
  const isProcessedRef = useRef(false);

  useEffect(() => {
    isProcessedRef.current = false;

    // Define the global listener function expected by phone.email widget
    window.phoneEmailListener = function (userObj) {
      if (isProcessedRef.current) return;

      const url = typeof userObj === 'string' ? userObj : userObj?.user_json_url;
      if (url) {
        isProcessedRef.current = true;
        if (typeof onSuccess === 'function') {
          onSuccess(url);
        }
      }
    };

    // Remove any previously injected phone.email script to allow fresh initialization
    const oldScript = document.querySelector('script[src*="phone.email/sign_in_button_v1.js"]');
    if (oldScript && oldScript.parentNode) {
      oldScript.parentNode.removeChild(oldScript);
    }

    // Create and inject a new script tag
    const script = document.createElement('script');
    script.src = 'https://www.phone.email/sign_in_button_v1.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      window.phoneEmailListener = null;
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [onSuccess]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 8px',
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      {/* Optional hidden or prefilled phone input for phone.email widget */}
      {prefillPhone && (
        <input
          type="hidden"
          className="pe_phone_number"
          value={prefillPhone}
          readOnly
        />
      )}

      <div
        ref={containerRef}
        className="pe_signin_button"
        data-client-id={process.env.NEXT_PUBLIC_PHONE_EMAIL_CLIENT_ID || '15695407177920574360'}
        style={{
          display: 'flex',
          justifyContent: 'center',
          minHeight: '48px',
          width: '100%',
        }}
      ></div>
    </div>
  );
}
