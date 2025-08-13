export const secToHms = (s) => {
  s = Math.max(0, Math.floor(s));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const pad = (n) => String(n).padStart(2, '0');
  if (h) return `${h}:${pad(m)}:${pad(ss)}`;
  return `${m}:${pad(ss)}`;
};

// given now + growSeconds -> nice countdown string
export const countdown = (finishTsMs) => {
  const left = Math.ceil((finishTsMs - Date.now()) / 1000);
  return secToHms(left);
};
