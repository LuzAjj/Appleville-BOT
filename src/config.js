import 'dotenv/config';

export default {
  // Which seed to prefer when auto-buying (fallback heuristic will pick best by ROI if not enough coins)
  preferredSeedKey: 'lettuce', // 'wheat' | 'lettuce' | 'carrot' | 'tomato' | 'onion' | 'golden-apple' | ...

  // General behavior toggles
  autoPlant: true,
  autoHarvest: true,
  autoBuySeeds: true,
  autoUseBooster: false,         // set true to use 'fertiliser' (see constants.js)
  autoApExchange: false,         // buy AP when low using basic tier

  // What counts as "low AP" (Apple Points/energy)
  minApBeforeExchange: 30,

  // How often to check (ms)
  loopIntervalMs: 3000,

  // How long to wait after any buy/plant/harvest (debounce server, ms)
  coolDownMs: 600,

  // Optional: max plots to manage (null = manage all)
  maxPlots: null,

  // == AUTH / SESSION ==
  // If RAW_COOKIE is provided in .env we’ll send it verbatim.
  // Otherwise we’ll build a Cookie header from SESSION_TOKEN / NEXTAUTH_SESSION_TOKEN / CSRF_TOKEN.
  cookieFromEnv: process.env.RAW_COOKIE || null,
  sessionToken: process.env.SESSION_TOKEN || process.env.NEXTAUTH_SESSION_TOKEN || '',
  csrfToken: process.env.CSRF_TOKEN || '',

  // API base
  baseUrl: 'https://app.appleville.xyz/api/trpc'
};
