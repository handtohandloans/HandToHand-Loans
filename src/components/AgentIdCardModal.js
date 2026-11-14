'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// Helper: Convert Data URI to Uint8Array for pdf-lib
function dataUriToBytes(dataUri) {
  const base64 = dataUri.includes(',') ? dataUri.split(',')[1] : dataUri;
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// Helper: Safe Image Loader (converts external/signed URLs to Data URIs to avoid tainted canvas)
async function loadSafeImage(src) {
  if (!src) return null;
  return new Promise((resolve) => {
    if (src.startsWith('data:')) {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
      return;
    }
    fetch(src, { mode: 'cors' })
      .then((res) => {
        if (!res.ok) throw new Error('Fetch failed');
        return res.blob();
      })
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = reader.result;
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {
        // Fallback: load directly with anonymous crossOrigin
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
  });
}

// Canvas rounded rect helper
function drawRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Canvas text wrapping helper
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let curY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, curY);
  return curY - y + lineHeight;
}

export default function AgentIdCardModal({ isOpen, onClose, profile, agreement }) {
  const [activeSide, setActiveSide] = useState('front'); // 'front' | 'back' | 'both'
  const [isFlipped, setIsFlipped] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [logoImg, setLogoImg] = useState(null);
  const [photoImg, setPhotoImg] = useState(null);
  const [signatureImg, setSignatureImg] = useState(null);
  const [canvasReady, setCanvasReady] = useState(false);

  const frontCanvasRef = useRef(null);
  const backCanvasRef = useRef(null);

  // Derive agent details
  const agentName = (profile?.full_name || 'DSA AGENT').toUpperCase();
  const rawCode = profile?.agent_code || '';
  const dsaCode = rawCode
    ? (rawCode.startsWith('H2H') ? rawCode : `H2H-DSA-${rawCode}`)
    : (agreement?.agreement_no || 'H2H-DSA-PENDING');
  const safeDsaCode = dsaCode.replace(/[^a-zA-Z0-9_-]/g, '');
  const phone = profile?.phone || 'N/A';
  const email = profile?.email || 'N/A';
  const website = 'www.handtohandloans.com';

  const dob = profile?.dob
    ? new Date(profile.dob).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : 'N/A';

  const rawJoiningDate = agreement?.signed_at || profile?.created_at || new Date().toISOString();
  const joiningDate = new Date(rawJoiningDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Resolve photo URL (avatar or signed selfie URL)
  useEffect(() => {
    let isMounted = true;
    async function resolvePhoto() {
      if (profile?.avatar && (profile.avatar.startsWith('data:') || profile.avatar.startsWith('http'))) {
        if (isMounted) setPhotoUrl(profile.avatar);
        return;
      }
      if (profile?.selfie) {
        if (profile.selfie.startsWith('data:') || profile.selfie.startsWith('http')) {
          if (isMounted) setPhotoUrl(profile.selfie);
          return;
        }
        try {
          const { data } = await supabase.storage.from('agent-documents').createSignedUrl(profile.selfie, 3600);
          if (isMounted && data?.signedUrl) setPhotoUrl(data.signedUrl);
        } catch (e) {
          console.warn('Error fetching signed selfie:', e);
        }
      }
    }
    if (isOpen) resolvePhoto();
    return () => { isMounted = false; };
  }, [isOpen, profile]);

  // Preload logo, photo, and signature images
  useEffect(() => {
    let isMounted = true;
    async function loadAssets() {
      // 1. Logo
      const logo = await loadSafeImage('/images/brand_logo.png?v=3');
      if (isMounted) setLogoImg(logo);

      // 2. Photo
      if (photoUrl) {
        const photo = await loadSafeImage(photoUrl);
        if (isMounted) setPhotoImg(photo);
      } else {
        if (isMounted) setPhotoImg(null);
      }

      // 3. Signature
      const sigData = agreement?.signature_base64;
      if (sigData) {
        const sigSrc = sigData.startsWith('data:') || sigData.startsWith('http')
          ? sigData
          : `data:image/png;base64,${sigData}`;
        const sig = await loadSafeImage(sigSrc);
        if (isMounted) setSignatureImg(sig);
      } else {
        if (isMounted) setSignatureImg(null);
      }

      if (isMounted) setCanvasReady(true);
    }

    if (isOpen) loadAssets();
    return () => { isMounted = false; };
  }, [isOpen, photoUrl, agreement]);

  // Render Front Card onto Canvas
  const renderFrontCard = useCallback((canvas) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 650;
    const H = 1040;
    canvas.width = W;
    canvas.height = H;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // Top Header Bars (Deep Navy + Forest Green)
    ctx.fillStyle = '#061a40';
    ctx.fillRect(0, 0, W, 20);
    ctx.fillStyle = '#087f3b';
    ctx.fillRect(0, 20, W, 8);

    // Brand Logo
    if (logoImg) {
      const logoW = 270;
      const logoH = (logoImg.height / logoImg.width) * logoW;
      const logoX = (W - logoW) / 2;
      const logoY = 46;
      ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
    } else {
      ctx.fillStyle = '#061a40';
      ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('HandToHand LOANS', W / 2, 75);
    }

    // Agent Photo (Circle with thick green ring)
    const cx = W / 2;
    const cy = 222;
    const radius = 86;

    // Green Ring Border
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#087f3b';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Photo Clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 4, 0, Math.PI * 2);
    ctx.clip();

    if (photoImg) {
      const imgW = photoImg.width;
      const imgH = photoImg.height;
      const scale = Math.max((radius * 2) / imgW, (radius * 2) / imgH);
      const dw = imgW * scale;
      const dh = imgH * scale;
      const dx = cx - dw / 2;
      const dy = cy - dh / 2;
      ctx.drawImage(photoImg, dx, dy, dw, dh);
    } else {
      // Placeholder background
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AGENT PHOTO', cx, cy + 5);
    }
    ctx.restore();

    // Agent Name & Role Box (Navy Blue Pill)
    const boxX = 42;
    const boxY = 338;
    const boxW = W - 84; // 566px
    const boxH = 88;
    ctx.fillStyle = '#07183d';
    drawRoundRect(ctx, boxX, boxY, boxW, boxH, 18);
    ctx.fill();

    // Name text (bold white uppercase)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '1px';
    ctx.fillText(agentName, W / 2, boxY + 40);

    // Role text (emerald green bold uppercase)
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 13.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '2.5px';
    ctx.fillText('RELATIONSHIP MANAGER', W / 2, boxY + 68);

    // Details List Table
    const details = [
      { label: 'DSA CODE', value: dsaCode },
      { label: 'PHONE', value: phone },
      { label: 'EMAIL', value: email },
      { label: 'WEBSITE', value: website },
      { label: 'DOB', value: dob },
      { label: 'JOINING DATE', value: joiningDate },
    ];

    const startY = 465;
    const rowGap = 74;
    const leftMargin = 45;
    const rightMargin = W - 45;

    details.forEach((item, index) => {
      const curY = startY + index * rowGap;

      // Label (Dark Navy bold)
      ctx.fillStyle = '#07183d';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'left';
      ctx.letterSpacing = '0.5px';
      ctx.fillText(item.label, leftMargin, curY + 28);

      // Value
      ctx.fillStyle = '#07183d';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'right';
      ctx.letterSpacing = '0.2px';
      ctx.fillText(item.value, rightMargin, curY + 28);

      // Divider Underline
      ctx.beginPath();
      ctx.moveTo(leftMargin, curY + 48);
      ctx.lineTo(rightMargin, curY + 48);
      ctx.strokeStyle = '#dbeafe';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Bottom Footer Bars (Forest Green + Deep Navy)
    ctx.fillStyle = '#087f3b';
    ctx.fillRect(0, H - 28, W, 8);
    ctx.fillStyle = '#061a40';
    ctx.fillRect(0, H - 20, W, 20);
  }, [logoImg, photoImg, agentName, dsaCode, phone, email, dob, joiningDate]);

  // Render Back Card onto Canvas
  const renderBackCard = useCallback((canvas) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 650;
    const H = 1040;
    canvas.width = W;
    canvas.height = H;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // Top Header Bars (Deep Navy + Forest Green)
    ctx.fillStyle = '#061a40';
    ctx.fillRect(0, 0, W, 20);
    ctx.fillStyle = '#087f3b';
    ctx.fillRect(0, 20, W, 8);

    // Brand Logo
    if (logoImg) {
      const logoW = 250;
      const logoH = (logoImg.height / logoImg.width) * logoW;
      const logoX = (W - logoW) / 2;
      const logoY = 46;
      ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
    } else {
      ctx.fillStyle = '#061a40';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('HandToHand LOANS', W / 2, 75);
    }

    // TERMS & CONDITIONS Title
    ctx.fillStyle = '#07183d';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '1px';
    ctx.fillText('TERMS & CONDITIONS', W / 2, 134);

    // Short Green Accent Underline Bar
    ctx.fillStyle = '#087f3b';
    ctx.fillRect(W / 2 - 40, 148, 80, 4.5);

    // 7 Numbered Points
    const terms = [
      'This ID card is the property of HandToHand Loans.',
      'This card is non-transferable and must be carried at all times while on duty.',
      'Loss or damage of this card must be reported immediately to the HR Department.',
      'If found, please return to the head office.',
      'Any misuse of this ID card or involvement in activities that harm the reputation, operations, or interests of HandToHand Loans is strictly prohibited.',
      'If you engage in any fraud, misrepresentation, or unauthorized use of the company name or identity, legal action including police action will be taken against you.',
      'This ID card is issued officially by HandToHand Loans and is valid only for authorized company purposes.',
    ];

    let curY = 192;
    const numX = 45;
    const textX = 74;
    const maxTextW = W - 118; // 532px
    const lineHeight = 21;

    terms.forEach((term, idx) => {
      // Point number in bold green
      ctx.fillStyle = '#087f3b';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${idx + 1}.`, numX, curY);

      // Text in dark charcoal / navy
      ctx.fillStyle = '#0f172a';
      ctx.font = '500 14.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const textHeight = wrapText(ctx, term, textX, curY, maxTextW, lineHeight);
      curY += textHeight + 14;
    });

    // Signatures Section (Bottom)
    const lineY = H - 120;

    // Left Column: Agent Signature
    const leftLineStart = 45;
    const leftLineEnd = 305;
    const leftCenter = (leftLineStart + leftLineEnd) / 2;

    if (signatureImg) {
      const maxSigW = 160;
      const maxSigH = 50;
      const scale = Math.min(maxSigW / signatureImg.width, maxSigH / signatureImg.height, 1);
      const sw = signatureImg.width * scale;
      const sh = signatureImg.height * scale;
      const sx = leftCenter - sw / 2;
      const sy = lineY - sh - 6;
      ctx.drawImage(signatureImg, sx, sy, sw, sh);
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'italic 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('[Digital Signature]', leftCenter, lineY - 14);
    }

    // Left horizontal line
    ctx.beginPath();
    ctx.moveTo(leftLineStart, lineY);
    ctx.lineTo(leftLineEnd, lineY);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Left label
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '0.5px';
    ctx.fillText('AGENT SIGNATURE', leftCenter, lineY + 20);

    // Right Column: Company Seal & Authorized Signature
    const rightLineStart = 345;
    const rightLineEnd = W - 45;
    const rightCenter = (rightLineStart + rightLineEnd) / 2;

    // Draw Official Company Seal Stamp
    ctx.save();
    const sealCx = rightCenter;
    const sealCy = lineY - 36;
    const sealRadius = 28;

    // Outer circle
    ctx.beginPath();
    ctx.arc(sealCx, sealCy, sealRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#087f3b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner dashed circle
    ctx.beginPath();
    ctx.setLineDash([3, 2]);
    ctx.arc(sealCx, sealCy, sealRadius - 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Stamp text
    ctx.fillStyle = '#087f3b';
    ctx.font = 'bold 7px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HANDTOHAND LOANS', sealCx, sealCy - 8);
    ctx.font = 'bold 6px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('OFFICIAL SEAL', sealCx, sealCy + 2);
    ctx.fillText('VERIFIED & APPROVED', sealCx, sealCy + 11);

    // Authorized signature flourish line
    ctx.beginPath();
    ctx.moveTo(sealCx - 36, sealCy + 6);
    ctx.bezierCurveTo(sealCx - 10, sealCy - 20, sealCx + 10, sealCy + 15, sealCx + 38, sealCy - 6);
    ctx.strokeStyle = '#07183d';
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.restore();

    // Right horizontal line
    ctx.beginPath();
    ctx.moveTo(rightLineStart, lineY);
    ctx.lineTo(rightLineEnd, lineY);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Right label
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '0.4px';
    ctx.fillText('COMPANY SEAL & AUTHORIZED SIGNATURE', rightCenter, lineY + 20);

    // Bottom Footer Bars (Forest Green + Deep Navy)
    ctx.fillStyle = '#087f3b';
    ctx.fillRect(0, H - 28, W, 8);
    ctx.fillStyle = '#061a40';
    ctx.fillRect(0, H - 20, W, 20);
  }, [logoImg, signatureImg]);

  // Re-render canvases when ready
  useEffect(() => {
    if (canvasReady && isOpen) {
      if (frontCanvasRef.current) renderFrontCard(frontCanvasRef.current);
      if (backCanvasRef.current) renderBackCard(backCanvasRef.current);
    }
  }, [canvasReady, isOpen, renderFrontCard, renderBackCard]);

  // Download Front PNG
  const handleDownloadFrontPng = () => {
    if (!frontCanvasRef.current) return;
    const url = frontCanvasRef.current.toDataURL('image/png', 1.0);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HandToHand_ID_Card_Front_${safeDsaCode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download Back PNG
  const handleDownloadBackPng = () => {
    if (!backCanvasRef.current) return;
    const url = backCanvasRef.current.toDataURL('image/png', 1.0);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HandToHand_ID_Card_Back_${safeDsaCode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download Both Sides Combined (Side-by-Side PNG)
  const handleDownloadCombinedPng = () => {
    if (!frontCanvasRef.current || !backCanvasRef.current) return;
    const comboCanvas = document.createElement('canvas');
    const W = 650;
    const H = 1040;
    comboCanvas.width = W * 2 + 40;
    comboCanvas.height = H;
    const ctx = comboCanvas.getContext('2d');

    // Transparent / crisp background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, comboCanvas.width, comboCanvas.height);

    ctx.drawImage(frontCanvasRef.current, 0, 0);
    ctx.drawImage(backCanvasRef.current, W + 40, 0);

    const url = comboCanvas.toDataURL('image/png', 1.0);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HandToHand_ID_Card_Complete_${safeDsaCode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download PDF via pdf-lib (2-Page Standard CR80 Card Dimensions)
  const handleDownloadPdf = async () => {
    if (!frontCanvasRef.current || !backCanvasRef.current) return;
    setDownloading(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();

      // Front Image
      const frontDataUrl = frontCanvasRef.current.toDataURL('image/png', 1.0);
      const frontBytes = dataUriToBytes(frontDataUrl);
      const frontPng = await pdfDoc.embedPng(frontBytes);

      // Back Image
      const backDataUrl = backCanvasRef.current.toDataURL('image/png', 1.0);
      const backBytes = dataUriToBytes(backDataUrl);
      const backPng = await pdfDoc.embedPng(backBytes);

      // Standard ID Card Dimensions in Points (approx 243 x 388 pt)
      const cardWidth = 243;
      const cardHeight = 388;

      // Page 1: Front
      const page1 = pdfDoc.addPage([cardWidth, cardHeight]);
      page1.drawImage(frontPng, { x: 0, y: 0, width: cardWidth, height: cardHeight });

      // Page 2: Back
      const page2 = pdfDoc.addPage([cardWidth, cardHeight]);
      page2.drawImage(backPng, { x: 0, y: 0, width: cardWidth, height: cardHeight });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HandToHand_ID_Card_${safeDsaCode}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate ID card PDF:', err);
      alert('Could not generate PDF: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  // Direct Print
  const handlePrint = () => {
    window.open(`/agent-id-card?print=true`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(5, 10, 24, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: 'var(--color-bg-card, #111827)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: activeSide === 'both' ? '920px' : '540px',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          transition: 'max-width 0.3s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🪪</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                Digital Relationship Manager ID Card
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--color-text-secondary, #94a3b8)' }}>
                Official HandToHand Loans DSA Agent Credential
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '18px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* View Controls Toolbar */}
        <div
          style={{
            padding: '10px 20px',
            background: 'rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Side Selector Tabs */}
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '3px', borderRadius: '8px' }}>
            <button
              onClick={() => { setActiveSide('front'); setIsFlipped(false); }}
              style={{
                background: activeSide === 'front' ? 'var(--color-primary, #3b82f6)' : 'transparent',
                color: activeSide === 'front' ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Front Side
            </button>
            <button
              onClick={() => { setActiveSide('back'); setIsFlipped(true); }}
              style={{
                background: activeSide === 'back' ? 'var(--color-primary, #3b82f6)' : 'transparent',
                color: activeSide === 'back' ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Back Side
            </button>
            <button
              onClick={() => setActiveSide('both')}
              style={{
                background: activeSide === 'both' ? 'var(--color-primary, #3b82f6)' : 'transparent',
                color: activeSide === 'both' ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Both Sides (🪟)
            </button>
          </div>

          {/* Quick Flip Button */}
          {activeSide !== 'both' && (
            <button
              onClick={() => {
                const nextFlipped = !isFlipped;
                setIsFlipped(nextFlipped);
                setActiveSide(nextFlipped ? 'back' : 'front');
              }}
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              🔄 Flip to {isFlipped ? 'Front' : 'Back'}
            </button>
          )}
        </div>

        {/* Card Preview Body */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '380px',
            background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)',
          }}
        >
          {activeSide === 'both' ? (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {/* Front Side Canvas */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', letterSpacing: '1px' }}>
                  FRONT VIEW
                </span>
                <canvas
                  ref={frontCanvasRef}
                  style={{
                    width: '300px',
                    height: '480px',
                    borderRadius: '16px',
                    boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255,255,255,0.1)',
                    background: '#fff',
                  }}
                />
              </div>

              {/* Back Side Canvas */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', letterSpacing: '1px' }}>
                  BACK VIEW
                </span>
                <canvas
                  ref={backCanvasRef}
                  style={{
                    width: '300px',
                    height: '480px',
                    borderRadius: '16px',
                    boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255,255,255,0.1)',
                    background: '#fff',
                  }}
                />
              </div>
            </div>
          ) : (
            <div
              style={{
                perspective: '1000px',
                width: '320px',
                height: '512px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)',
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front Canvas (Front Face) */}
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <canvas
                    ref={frontCanvasRef}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '16px',
                      boxShadow: '0 25px 40px -12px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255,255,255,0.1)',
                      background: '#fff',
                    }}
                  />
                </div>

                {/* Back Canvas (Back Face) */}
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <canvas
                    ref={backCanvasRef}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '16px',
                      boxShadow: '0 25px 40px -12px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255,255,255,0.1)',
                      background: '#fff',
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Main Download Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            {/* PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              style={{
                flex: '1 1 200px',
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: downloading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
              }}
            >
              📄 {downloading ? 'Building PDF...' : 'Download ID Card (PDF)'}
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              style={{
                padding: '12px 18px',
                background: 'rgba(59, 130, 246, 0.12)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              🖨️ Print
            </button>

            {/* Open Full Studio Page */}
            <button
              onClick={() => window.open('/agent-id-card', '_blank')}
              style={{
                padding: '12px 18px',
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'var(--color-text-secondary, #cbd5e1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              🔗 Full Page Studio
            </button>
          </div>

          {/* Image Downloads Sub-row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              paddingTop: '10px',
            }}
          >
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginRight: '4px' }}>
              Download Image (PNG):
            </span>
            <button
              onClick={handleDownloadFrontPng}
              style={{
                padding: '6px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              🖼️ Front Side PNG
            </button>
            <button
              onClick={handleDownloadBackPng}
              style={{
                padding: '6px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              🖼️ Back Side PNG
            </button>
            <button
              onClick={handleDownloadCombinedPng}
              style={{
                padding: '6px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              🖼️ Both Sides (Full PNG)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
