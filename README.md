
# Appleville Bot (Node.js)

Zero-browser bot that calls the Appleville tRPC API to auto-harvest, auto-plant, and auto-buy seeds.  
Optional: auto-use boosters and auto AP exchange. Color logs with timestamps + per-plot countdowns.

## Where do I get cookie values?
Open the game in Chrome → DevTools → Application → Storage → Cookies → https://app.appleville.xyz/.
Copy the value of session-token into SESSION_TOKEN in .env.
If you also see __Host-authjs.csrf-token, copy its value into CSRF_TOKEN.
If your cookie names differ, paste the full cookie string into RAW_COOKIE and leave the others empty.

## The bot never stores or shares your cookies; it only uses them as an HTTP header.
Configure behavior
Edit src/config.js:
preferredSeedKey: your go-to seed.
Toggle autoUseBooster, autoApExchange, etc.
loopIntervalMs: how often to act.
minApBeforeExchange: AP threshold to auto-buy exchanges.

## What shows in the console?
Timestamps for every action.
Green text when a plot is harvested.
Countdown until each growing plot is ready.
Clear logs when buying seeds, applying boosters, and exchanging AP.

DO WITH YOUR OWN RISK

## Setup

```bash
git clone https://github.com/LuzAjj/Appleville-BOT.git appleville-bot
cd appleville-bot
cp .env.example .env
# open .env and paste your session cookie(s) from browser DevTools
npm install
npm start
