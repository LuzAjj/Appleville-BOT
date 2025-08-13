import fetch from 'node-fetch';
import config from './config.js';
import { log } from './utils/logger.js';

// Build Cookie header from env if RAW_COOKIE not provided
const buildCookie = () => {
  if (config.cookieFromEnv) return config.cookieFromEnv.trim();

  const parts = [];
  if (config.sessionToken) parts.push(`session-token=${config.sessionToken}`);
  if (config.csrfToken) parts.push(`__Host-authjs.csrf-token=${encodeURIComponent(config.csrfToken)}`);
  return parts.join('; ');
};

// tRPC batch param encoder: input={"0":{"json":{...}}}
const encodeInput = (obj) =>
  encodeURIComponent(JSON.stringify({ '0': { json: obj } }));

const baseHeaders = () => {
  const headers = {
    'content-type': 'application/json',
    'accept': 'application/json',
    'cookie': buildCookie()
  };
  return headers;
};

const trpcGet = async (path, json = null) => {
  const u = `${config.baseUrl}/${path}?batch=1&input=${encodeInput(json)}`;
  const res = await fetch(u, { method: 'GET', headers: baseHeaders() });
  if (!res.ok) throw new Error(`${path} GET ${res.status}`);
  return res.json();
};

const trpcPost = async (path, json) => {
  // app uses GET or POST with same input format; POST is safer for mutations
  const u = `${config.baseUrl}/${path}?batch=1`;
  const body = JSON.stringify({ '0': { json } });
  const res = await fetch(u, { method: 'POST', headers: baseHeaders(), body });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`${path} POST ${res.status}: ${txt.slice(0, 200)}`);
  }
  return res.json();
};

export const api = {
  getState: () => trpcGet('core.getState', null),               // GET with null input
  harvest:  (slotIndex) => trpcPost('core.harvest', { slotIndex }),
  plantSeed:(slotIndex, seedKey) => {
    // Some builds accept only {slotIndex}, others accept {slotIndex, seedKey}
    const payload = { slotIndex };
    if (seedKey) payload.seedKey = seedKey;
    return trpcPost('core.plantSeed', payload);
  },
  buyItem:  (key, type, quantity = 1) =>
    trpcPost('core.buyItem', { key, type, quantity }),          // type: "SEED" | "MODIFIER"
  applyModifier: (slotIndex, modifierKey) =>
    trpcPost('core.applyModifier', { slotIndex, modifierKey }),
  buyApExchange: (key, quantity = 1) =>
    trpcPost('core.buyApExchange', { key, quantity }),
};
