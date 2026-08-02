/**
 * GET /api/commodity-price?ticker=xau  (or xag)
 *
 * Server-side proxy for fawazahmed0/currency-api.
 * Fetches on the SERVER so no CORS / CSP browser restrictions apply.
 * Returns: { ticker, inr, perGram, date }
 */

export const runtime = 'nodejs';
export const revalidate = 300;

const TROY_OZ_GRAMS = 31.1035;

function getEndpoints(ticker) {
  const today = new Date().toISOString().slice(0, 10);
  return [
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/' + ticker + '.json',
    'https://latest.currency-api.pages.dev/v1/currencies/' + ticker + '.json',
    'https://raw.githubusercontent.com/fawazahmed0/currency-api/1/' + today + '/currencies/' + ticker + '.json',
  ];
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ticker = (searchParams.get('ticker') || 'xau').toLowerCase();

  if (!['xau', 'xag'].includes(ticker)) {
    return Response.json({ error: 'Invalid ticker. Use xau or xag.' }, { status: 400 });
  }

  let lastError = null;

  for (const url of getEndpoints(ticker)) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 300 },
        headers: { 'User-Agent': 'NextJS-server/1.0' },
      });

      if (!res.ok) {
        lastError = 'HTTP ' + res.status + ' from ' + url;
        continue;
      }

      const data = await res.json();
      const inrPerTroyOz = data[ticker] && data[ticker].inr;

      if (!inrPerTroyOz || typeof inrPerTroyOz !== 'number') {
        lastError = 'Missing INR rate from ' + url;
        continue;
      }

      const perGram = Math.round((inrPerTroyOz / TROY_OZ_GRAMS) * 100) / 100;

      return Response.json(
        { ticker: ticker, inr: inrPerTroyOz, perGram: perGram, date: data.date || new Date().toISOString().slice(0, 10) },
        { status: 200, headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' } }
      );
    } catch (err) {
      lastError = err.message;
      continue;
    }
  }

  console.error('[commodity-price] All endpoints failed:', lastError);
  return Response.json({ error: 'Live feed temporarily unavailable', detail: lastError }, { status: 503 });
}
