'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Helper: Convert Data URI to Uint8Array for pdf-lib
function dataUriToBytes(dataUri) {
  const base64 = dataUri.includes(',') ? dataUri.split(',')[1] : dataUri;
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// Helper: Safe Image Loader
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
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
  });
}

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

function IdCardStudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoPrint = searchParams.get('print') === 'true';

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [agreement, setAgreement] = useState(null);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('both'); // 'both' | 'flip'
  const [isFlipped, setIsFlipped] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [photoUrl, setPhotoUrl] = useState('');
  const [logoImg, setLogoImg] = useState(null);
  const [photoImg, setPhotoImg] = useState(null);
  const [signatureImg, setSignatureImg] = useState(null);
  const [canvasReady, setCanvasReady] = useState(false);

  const frontCanvasRef = useRef(null);
  const backCanvasRef = useRef(null);

  // Authentication and Data Fetch
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login?redirect=/agent-id-card');
          return;
        }

        // Fetch Profile
        const { data: prof, error: profErr } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone, role, approved, agent_code, created_at, dob, avatar, selfie')
          .eq('id', session.user.id)
          .single();

        if (profErr || !prof) {
          if (isMounted) {
            setError('Could not load your agent profile.');
            setLoading(false);
          }
          return;
        }

        // Fetch Agreement
        const { data: agr } = await supabase
          .from('agent_agreements')
          .select('*')
          .eq('agent_id', session.user.id)
          .maybeSingle();

        if (isMounted) {
          setProfile(prof);
          setAgreement(agr);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'An unexpected error occurred.');
          setLoading(false);
        }
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [router]);

  // Derive Fields
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

  // Resolve Photo
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
    if (profile) resolvePhoto();
    return () => { isMounted = false; };
  }, [profile]);

  // Load Image Assets
  useEffect(() => {
    let isMounted = true;
    async function loadAssets() {
      const logo = await loadSafeImage('/images/brand_logo.png?v=3');
      if (isMounted) setLogoImg(logo);

      if (photoUrl) {
        const photo = await loadSafeImage(photoUrl);
        if (isMounted) setPhotoImg(photo);
      } else {
        if (isMounted) setPhotoImg(null);
      }

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

    if (profile) loadAssets();
    return () => { isMounted = false; };
  }, [profile, photoUrl, agreement]);

  // Canvas Renders
  const renderFrontCard = useCallback((canvas) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 650;
    const H = 1040;
    canvas.width = W;
    canvas.height = H;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#061a40';
    ctx.fillRect(0, 0, W, 20);
    ctx.fillStyle = '#087f3b';
    ctx.fillRect(0, 20, W, 8);

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

    const cx = W / 2;
    const cy = 222;
    const radius = 86;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#087f3b';
    ctx.lineWidth = 8;
    ctx.stroke();

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
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AGENT PHOTO', cx, cy + 5);
    }
    ctx.restore();

    const boxX = 42;
    const boxY = 338;
    const boxW = W - 84;
    const boxH = 88;
    ctx.fillStyle = '#07183d';
    drawRoundRect(ctx, boxX, boxY, boxW, boxH, 18);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '1px';
    ctx.fillText(agentName, W / 2, boxY + 40);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 13.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '2.5px';
    ctx.fillText('RELATIONSHIP MANAGER', W / 2, boxY + 68);

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

      ctx.fillStyle = '#07183d';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'left';
      ctx.letterSpacing = '0.5px';
      ctx.fillText(item.label, leftMargin, curY + 28);

      ctx.fillStyle = '#07183d';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'right';
      ctx.letterSpacing = '0.2px';
      ctx.fillText(item.value, rightMargin, curY + 28);

      ctx.beginPath();
      ctx.moveTo(leftMargin, curY + 48);
      ctx.lineTo(rightMargin, curY + 48);
      ctx.strokeStyle = '#dbeafe';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    ctx.fillStyle = '#087f3b';
    ctx.fillRect(0, H - 28, W, 8);
    ctx.fillStyle = '#061a40';
    ctx.fillRect(0, H - 20, W, 20);
  }, [logoImg, photoImg, agentName, dsaCode, phone, email, dob, joiningDate]);

  const renderBackCard = useCallback((canvas) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 650;
    const H = 1040;
    canvas.width = W;
    canvas.height = H;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#061a40';
    ctx.fillRect(0, 0, W, 20);
    ctx.fillStyle = '#087f3b';
    ctx.fillRect(0, 20, W, 8);

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

    ctx.fillStyle = '#07183d';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '1px';
    ctx.fillText('TERMS & CONDITIONS', W / 2, 134);

    ctx.fillStyle = '#087f3b';
    ctx.fillRect(W / 2 - 40, 148, 80, 4.5);

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
    const maxTextW = W - 118;
    const lineHeight = 21;

    terms.forEach((term, idx) => {
      ctx.fillStyle = '#087f3b';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${idx + 1}.`, numX, curY);

      ctx.fillStyle = '#0f172a';
      ctx.font = '500 14.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const textHeight = wrapText(ctx, term, textX, curY, maxTextW, lineHeight);
      curY += textHeight + 14;
    });

    const lineY = H - 120;
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

    ctx.beginPath();
    ctx.moveTo(leftLineStart, lineY);
    ctx.lineTo(leftLineEnd, lineY);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '0.5px';
    ctx.fillText('AGENT SIGNATURE', leftCenter, lineY + 20);

    const rightLineStart = 345;
    const rightLineEnd = W - 45;
    const rightCenter = (rightLineStart + rightLineEnd) / 2;

    ctx.save();
    const sealCx = rightCenter;
    const sealCy = lineY - 36;
    const sealRadius = 28;

    ctx.beginPath();
    ctx.arc(sealCx, sealCy, sealRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#087f3b';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([3, 2]);
    ctx.arc(sealCx, sealCy, sealRadius - 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#087f3b';
    ctx.font = 'bold 7px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HANDTOHAND LOANS', sealCx, sealCy - 8);
    ctx.font = 'bold 6px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('OFFICIAL SEAL', sealCx, sealCy + 2);
    ctx.fillText('VERIFIED & APPROVED', sealCx, sealCy + 11);

    ctx.beginPath();
    ctx.moveTo(sealCx - 36, sealCy + 6);
    ctx.bezierCurveTo(sealCx - 10, sealCy - 20, sealCx + 10, sealCy + 15, sealCx + 38, sealCy - 6);
    ctx.strokeStyle = '#07183d';
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(rightLineStart, lineY);
    ctx.lineTo(rightLineEnd, lineY);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '0.4px';
    ctx.fillText('COMPANY SEAL & AUTHORIZED SIGNATURE', rightCenter, lineY + 20);

    ctx.fillStyle = '#087f3b';
    ctx.fillRect(0, H - 28, W, 8);
    ctx.fillStyle = '#061a40';
    ctx.fillRect(0, H - 20, W, 20);
  }, [logoImg, signatureImg]);

  useEffect(() => {
    if (canvasReady) {
      if (frontCanvasRef.current) renderFrontCard(frontCanvasRef.current);
      if (backCanvasRef.current) renderBackCard(backCanvasRef.current);
      if (autoPrint) {
        setTimeout(() => window.print(), 600);
      }
    }
  }, [canvasReady, autoPrint, renderFrontCard, renderBackCard]);

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

  const handleDownloadCombinedPng = () => {
    if (!frontCanvasRef.current || !backCanvasRef.current) return;
    const comboCanvas = document.createElement('canvas');
    const W = 650;
    const H = 1040;
    comboCanvas.width = W * 2 + 40;
    comboCanvas.height = H;
    const ctx = comboCanvas.getContext('2d');

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

  const handleDownloadPdf = async () => {
    if (!frontCanvasRef.current || !backCanvasRef.current) return;
    setDownloading(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();

      const frontDataUrl = frontCanvasRef.current.toDataURL('image/png', 1.0);
      const frontBytes = dataUriToBytes(frontDataUrl);
      const frontPng = await pdfDoc.embedPng(frontBytes);

      const backDataUrl = backCanvasRef.current.toDataURL('image/png', 1.0);
      const backBytes = dataUriToBytes(backDataUrl);
      const backPng = await pdfDoc.embedPng(backBytes);

      const cardWidth = 243;
      const cardHeight = 388;

      const page1 = pdfDoc.addPage([cardWidth, cardHeight]);
      page1.drawImage(frontPng, { x: 0, y: 0, width: cardWidth, height: cardHeight });

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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-base, #0b1120)' }}>
        <Header />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
            <p style={{ color: 'var(--color-text-secondary, #94a3b8)', fontSize: '15px' }}>
              Loading your Digital Agent ID Card...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !agreement) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-base, #0b1120)' }}>
        <Header />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
          <div
            style={{
              maxWidth: '540px',
              width: '100%',
              background: 'var(--color-bg-card, #111827)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '32px 24px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              {error ? 'Unable to Load ID Card' : 'Agreement Not Yet Generated'}
            </h2>
            <p style={{ color: 'var(--color-text-secondary, #94a3b8)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              {error || 'Your Digital ID Card is automatically generated once you have signed and submitted your DSA Partner Agreement on your agent dashboard.'}
            </p>
            <Link
              href="/dashboard"
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
            >
              ← Go to Agent Dashboard
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-base, #0b1120)' }}>
      {/* Print-only CSS to isolate the ID cards on print page */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-id-card-area, #print-id-card-area * {
            visibility: visible;
          }
          #print-id-card-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            gap: 20px !important;
            margin: 0 !important;
            padding: 20px 0 !important;
            background: #ffffff !important;
          }
          canvas {
            box-shadow: none !important;
            border: 1px solid #cbd5e1 !important;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <Header />

      <main style={{ flex: 1, padding: '32px 20px 60px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          {/* Breadcrumb & Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                href="/dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--color-text-secondary, #94a3b8)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                ← Back to Dashboard
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
              <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600 }}>Digital ID Card</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                DSA CODE: {dsaCode}
              </span>
            </div>
          </div>

          {/* Title Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '0 0 6px' }}>
                🪪 Digital Relationship Manager ID Card
              </h1>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary, #94a3b8)', maxWidth: '620px', lineHeight: 1.5 }}>
                Official HandToHand Loans identity credential for {profile?.full_name}. Valid for client onboarding, bank meetings, and DSA representation.
              </p>
            </div>

            {/* View Switcher Controls */}
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '10px' }}>
              <button
                onClick={() => setViewMode('both')}
                style={{
                  background: viewMode === 'both' ? 'var(--color-primary, #3b82f6)' : 'transparent',
                  color: viewMode === 'both' ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Side-by-Side (🪟)
              </button>
              <button
                onClick={() => setViewMode('flip')}
                style={{
                  background: viewMode === 'flip' ? 'var(--color-primary, #3b82f6)' : 'transparent',
                  color: viewMode === 'flip' ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                3D Flip View (🔄)
              </button>
            </div>
          </div>

          {/* ID Card Display Container */}
          <div
            id="print-id-card-area"
            style={{
              background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '36px 20px',
              marginBottom: '28px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {viewMode === 'both' ? (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '32px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                {/* Front Side */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', letterSpacing: '1px' }}>
                      FRONT SIDE
                    </span>
                  </div>
                  <canvas
                    ref={frontCanvasRef}
                    style={{
                      width: '320px',
                      height: '512px',
                      borderRadius: '16px',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255,255,255,0.1)',
                      background: '#fff',
                    }}
                  />
                  <button
                    onClick={handleDownloadFrontPng}
                    style={{
                      marginTop: '6px',
                      padding: '6px 14px',
                      background: 'rgba(255,255,255,0.06)',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    🖼️ Download Front PNG
                  </button>
                </div>

                {/* Back Side */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }}></span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', letterSpacing: '1px' }}>
                      BACK SIDE
                    </span>
                  </div>
                  <canvas
                    ref={backCanvasRef}
                    style={{
                      width: '320px',
                      height: '512px',
                      borderRadius: '16px',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255,255,255,0.1)',
                      background: '#fff',
                    }}
                  />
                  <button
                    onClick={handleDownloadBackPng}
                    style={{
                      marginTop: '6px',
                      padding: '6px 14px',
                      background: 'rgba(255,255,255,0.06)',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    🖼️ Download Back PNG
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  🔄 Click to Flip ({isFlipped ? 'Showing Back' : 'Showing Front'})
                </button>

                <div
                  style={{
                    perspective: '1200px',
                    width: '340px',
                    height: '544px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setIsFlipped(!isFlipped)}
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
                    {/* Front */}
                    <div
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                      }}
                    >
                      <canvas
                        ref={frontCanvasRef}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '16px',
                          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255,255,255,0.1)',
                          background: '#fff',
                        }}
                      />
                    </div>

                    {/* Back */}
                    <div
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <canvas
                        ref={backCanvasRef}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '16px',
                          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255,255,255,0.1)',
                          background: '#fff',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Download Strip */}
          <div
            style={{
              background: 'var(--color-bg-card, #111827)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                  Download & Export Options
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary, #94a3b8)' }}>
                  Print-ready vector PDF and high-definition PNG formats for physical ID cards or mobile wallet.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: downloading ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  📄 {downloading ? 'Building PDF...' : 'Download ID Card (PDF)'}
                </button>

                <button
                  onClick={handleDownloadCombinedPng}
                  style={{
                    padding: '12px 20px',
                    background: 'rgba(59, 130, 246, 0.15)',
                    color: '#60a5fa',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🖼️ Download Complete (PNG)
                </button>

                <button
                  onClick={() => window.print()}
                  style={{
                    padding: '12px 20px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🖨️ Print Direct
                </button>
              </div>
            </div>

            {/* Sub-buttons for individual sides */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: '14px',
              }}
            >
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Individual Side Images:</span>
              <button
                onClick={handleDownloadFrontPng}
                style={{
                  padding: '7px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Front Side Only (PNG)
              </button>
              <button
                onClick={handleDownloadBackPng}
                style={{
                  padding: '7px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Back Side Only (PNG)
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AgentIdCardPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b1120' }}>
          <div className="spinner"></div>
        </div>
      }
    >
      <IdCardStudioContent />
    </Suspense>
  );
}
