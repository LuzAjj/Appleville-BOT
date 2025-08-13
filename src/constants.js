// Keys match the API payloads you captured.
export const SEEDS = [
  { key: 'wheat',           name: 'Wheat Seeds',          level: 1,  coinCost: 2,   timeSec: 5,    reward: { coin: 5,   ap: 0   } },
  { key: 'lettuce',         name: 'Lettuce Seeds',        level: 1,  coinCost: 8,   timeSec: 30,   reward: { coin: 15,  ap: 0   } },
  { key: 'golden-apple',    name: 'Golden Apple Seeds',   level: 4,  apCost: 10,    timeSec: 120,  reward: { coin: 0,   ap: 15  } },
  { key: 'carrot',          name: 'Carrot Seeds',         level: 3,  coinCost: 25,  timeSec: 180,  reward: { coin: 50,  ap: 0   } },
  { key: 'crystal-apple',   name: 'Crystal Apple Seeds',  level: 8,  apCost: 40,    timeSec: 600,  reward: { coin: 0,   ap: 70  } },
  { key: 'tomato',          name: 'Tomato Seeds',         level: 5,  coinCost: 80,  timeSec: 900,  reward: { coin: 180, ap: 0   } },
  { key: 'onion',           name: 'Onion Seeds',          level: 7,  coinCost: 200, timeSec: 3600, reward: { coin: 500, ap: 0   } },
  { key: 'diamond-apple',   name: 'Diamond Apple Seeds',  level: 12, apCost: 150,   timeSec: 3600, reward: { coin: 0,   ap: 300 } },
  { key: 'strawberry',      name: 'Strawberry Seeds',     level: 9,  coinCost: 600, timeSec: 14400,reward: { coin: 1500,ap: 0   } },
  { key: 'platinum-apple',  name: 'Platinum Apple Seeds', level: 15, apCost: 500,   timeSec: 14400,reward: { coin: 0,   ap: 1200} },
  { key: 'pumpkin',         name: 'Pumpkin Seeds',        level: 12, coinCost: 1500,timeSec: 43200,reward: { coin: 4000,ap: 0   } },
  { key: 'royal-apple',     name: 'Royal Apple Seeds',    level: 18, apCost: 1500,  timeSec: 43200,reward: { coin: 0,   ap: 4000} }
];

// Simple boosters
export const BOOSTERS = [
  { key: 'fertiliser',     name: 'Fertiliser',      coinCost: 10,  effect: '+43% growth for 12h' },
  { key: 'silver-tonic',   name: 'Silver Tonic',    coinCost: 15,  effect: '+25% yield for 12h' },
  { key: 'super-fertiliser', name: 'Super Fertiliser', apCost: 25, effect: '+100% growth for 12h' }
];

// AP exchanges (basic → master). We’ll call “core.buyApExchange” with key and quantity.
export const AP_EXCHANGES = [
  { key: 'ap-exchange-basic',   coinCost: 500,  apReward: 50,  dailyLimit: 4 },
  { key: 'ap-exchange-advanced',coinCost: 1000, apReward: 120, dailyLimit: 5, minLevel: 10 },
  { key: 'ap-exchange-expert',  coinCost: 2000, apReward: 300, dailyLimit: 4, minLevel: 15 },
  { key: 'ap-exchange-master',  coinCost: 5000, apReward: 800, dailyLimit: 2, minLevel: 18 }
];
