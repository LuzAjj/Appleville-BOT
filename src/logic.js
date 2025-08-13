import { api } from './api.js';
import config from './config.js';
import { SEEDS, BOOSTERS, AP_EXCHANGES } from './constants.js';
import { log, fmtSeed } from './utils/logger.js';
import { countdown } from './utils/time.js';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const pickSeedByStrategy = (coins, ap, level) => {
  // 1) Prefer the configured seed if affordable & level ok
  const pref = SEEDS.find(s => s.key === config.preferredSeedKey);
  if (pref && level >= pref.level) {
    const affordable =
      (pref.coinCost ? coins >= pref.coinCost : true) &&
      (pref.apCost   ? ap    >= pref.apCost   : true);
    if (affordable) return pref;
  }

  // 2) Otherwise pick the best ROI you can afford (coins/min or ap/min)
  const candidates = SEEDS.filter(s => level >= s.level).filter(s => {
    const okCoin = s.coinCost ? coins >= s.coinCost : true;
    const okAp   = s.apCost   ? ap    >= s.apCost   : true;
    return okCoin && okAp;
  });

  if (!candidates.length) return null;

  // scoring: favor AP seeds if your AP bankroll is healthy, otherwise coins
  const score = (s) => {
    const perMinCoin = (s.reward.coin || 0) / (s.timeSec / 60);
    const perMinAp   = (s.reward.ap   || 0) / (s.timeSec / 60);
    // slightly favor AP/min because user’s goal is AP
    return perMinCoin + perMinAp * 1.2;
  };

  return candidates.sort((a,b)=>score(b)-score(a))[0];
};

const maybeBuyAP = async (coins, level) => {
  if (!config.autoApExchange) return false;

  const tier = AP_EXCHANGES
    .filter(t => !t.minLevel || level >= t.minLevel)
    .sort((a,b)=>b.apReward-a.apReward)    // buy the biggest within level
    .find(t => coins >= t.coinCost);

  if (!tier) return false;

  try {
    await api.buyApExchange(tier.key, 1);
    log.act(`AP Exchange: bought ${tier.key} (+${tier.apReward} AP) for ${tier.coinCost} coins`);
    await sleep(config.coolDownMs);
    return true;
  } catch (e) {
    log.warn(`AP exchange failed: ${e.message}`);
    return false;
  }
};

const maybeBuyBooster = async () => {
  if (!config.autoUseBooster) return;

  const booster = BOOSTERS.find(b => b.key === 'fertiliser'); // the safest default
  if (!booster) return;

  try {
    await api.buyItem(booster.key, 'MODIFIER', 1);
    log.act(`Bought booster: ${booster.name}`);
    await sleep(config.coolDownMs);
    return booster.key;
  } catch (e) {
    log.warn(`Couldn’t buy booster: ${e.message}`);
    return null;
  }
};

const tryPlant = async (slotIndex, seed) => {
  try {
    // Some builds require buying before planting; we attempt to plant anyway (if inventory has seeds)
    await api.plantSeed(slotIndex, seed?.key);
    log.act(`Planted ${fmtSeed(seed)} in slot #${slotIndex}`);
    await sleep(config.coolDownMs);
    return true;
  } catch {
    // If planting failed because bag empty, try to buy then plant
    if (!config.autoBuySeeds || !seed) throw new Error('No seed to plant and autoBuySeeds disabled.');
    try {
      await api.buyItem(seed.key, 'SEED', 1);
      log.act(`Bought 1x ${fmtSeed(seed)}`);
      await sleep(config.coolDownMs);
      await api.plantSeed(slotIndex, seed.key);
      log.act(`Planted ${fmtSeed(seed)} in slot #${slotIndex}`);
      await sleep(config.coolDownMs);
      return true;
    } catch (e2) {
      throw new Error(`Buy/Plant failed for ${seed.key} on slot #${slotIndex}: ${e2.message}`);
    }
  }
};

export const runOnce = async () => {
  // 1) Get state
  const stateRaw = await api.getState().catch(e => {
    throw new Error(`getState failed: ${e.message}`);
  });

  // The app returns array results; unwrap tRPC batch shape safely:
  const envelope = Array.isArray(stateRaw) ? stateRaw[0] : stateRaw;
  const data = envelope?.result?.data?.json || envelope?.result?.data || envelope;
  if (!data) throw new Error('Unexpected getState response');

  const { coins = 0, ap = 0, level = 1, plots = [] } = data;

  // Show header
  log.info(`Coins: ${coins.toLocaleString()} | AP: ${ap.toLocaleString()} | Level: ${level} | Plots: ${plots.length}`);

  // 2) Manage each plot
  const limit = config.maxPlots ? Math.min(config.maxPlots, plots.length) : plots.length;

  for (let i = 0; i < limit; i++) {
    const p = plots[i]; // Expect fields: status: 'EMPTY'|'GROWING'|'READY', finishAt (ms), seedKey
    const idx = p.slotIndex ?? i;

    if (p.status === 'READY' && config.autoHarvest) {
      try {
        await api.harvest(idx);
        log.good(`Harvested slot #${idx} (${p.seedKey || 'seed'})`);
        await sleep(config.coolDownMs);
      } catch (e) {
        log.warn(`Harvest failed at slot #${idx}: ${e.message}`);
      }
      continue;
    }

    if (p.status === 'GROWING') {
      const eta = p.finishAt ? countdown(p.finishAt) : '…';
      log.info(`Slot #${idx} growing ${p.seedKey || 'seed'} | ready in ${eta}`);
      continue;
    }

    if (p.status === 'EMPTY' && config.autoPlant) {
      // optional AP buy if we’re too low
      if (ap < config.minApBeforeExchange) {
        const exchanged = await maybeBuyAP(coins, level);
        if (exchanged) return; // after exchange, next loop will re-evaluate
      }

      const seed = pickSeedByStrategy(coins, ap, level);
      if (!seed) {
        log.warn(`No affordable seeds for slot #${idx} (coins=${coins}, ap=${ap}, level=${level})`);
        continue;
      }

      try {
        await tryPlant(idx, seed);
      } catch (e) {
        log.warn(e.message);
      }

      // (Optional) apply booster once planted
      if (config.autoUseBooster) {
        const key = await maybeBuyBooster();
        if (key) {
          try {
            await api.applyModifier(idx, key);
            log.act(`Applied booster ${key} to slot #${idx}`);
            await sleep(config.coolDownMs);
          } catch (e) {
            log.warn(`Apply booster failed at slot #${idx}: ${e.message}`);
          }
        }
      }
      continue;
    }

    // Unknown state fallback
    log.info(`Slot #${idx}: ${p.status || 'UNKNOWN'}`);
  }
};
