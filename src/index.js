import config from './config.js';
import { runOnce } from './logic.js';
import { log } from './utils/logger.js';

const banner = () => {
  log.info('Appleville Bot started.');
  log.info(`Loop: every ${Math.round(config.loopIntervalMs/1000)}s | autoPlant=${config.autoPlant} autoHarvest=${config.autoHarvest} autoBuySeeds=${config.autoBuySeeds} booster=${config.autoUseBooster} apExchange=${config.autoApExchange}`);
};

const tick = async () => {
  try {
    await runOnce();
  } catch (e) {
    log.bad(e.message);
  }
};

const main = async () => {
  banner();
  await tick();
  setInterval(tick, config.loopIntervalMs);
};

main();
