
# Appleville Bot (Node.js)

Zero-browser bot that calls the Appleville tRPC API to auto-harvest, auto-plant, and auto-buy seeds.  
Optional: auto-use boosters and auto AP exchange. Color logs with timestamps + per-plot countdowns.

## Setup

```bash
git clone <your-repo-url> appleville-bot
cd appleville-bot
cp .env.example .env
# open .env and paste your session cookie(s) from browser DevTools
npm install
npm start
