import { readFileSync } from 'node:fs';

const rows = readFileSync(new URL('./bots.txt', import.meta.url), 'utf8')
  .split('\n')
  .filter((l) => l && !l.startsWith('#'));

/** @type {Record<string, {ua: string, description: string}>} */
export const bots = Object.fromEntries(
  rows.map((l) => {
    const [name, ua, description] = l.split('|');
    return [name, { ua, description }];
  }),
);

export const DEFAULT_BOT = 'claude-user';

export function userAgent(bot = DEFAULT_BOT) {
  const b = bots[bot];
  if (!b) throw new Error(`ua-spoofer: unknown bot '${bot}' (have: ${Object.keys(bots).join(', ')})`);
  return b.ua;
}

/** fetch(), but wearing someone else's User-Agent. */
export function fetchAs(bot, url, init = {}) {
  const headers = new Headers(init.headers);
  headers.set('User-Agent', userAgent(bot));
  return fetch(url, { ...init, headers });
}
