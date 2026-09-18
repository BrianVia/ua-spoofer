// ponytail: one global rule for every request; per-site rules if that ever matters.
const RULE_ID = 1;
const TYPES = ['main_frame', 'sub_frame', 'xmlhttprequest', 'script', 'stylesheet', 'image', 'font', 'other'];

async function loadBots() {
  const txt = await (await fetch(chrome.runtime.getURL('bots.txt'))).text();
  return txt.split('\n').filter((l) => l && !l.startsWith('#')).map((l) => {
    const [name, ua, description] = l.split('|');
    return { name, ua, description };
  });
}

async function apply(bot) {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
    addRules: bot ? [{
      id: RULE_ID, priority: 1,
      action: { type: 'modifyHeaders', requestHeaders: [{ header: 'User-Agent', operation: 'set', value: bot.ua }] },
      condition: { urlFilter: '*', resourceTypes: TYPES },
    }] : [],
  });
  await chrome.storage.local.set({ active: bot?.name ?? null });
  await chrome.action.setBadgeText({ text: bot ? bot.name.slice(0, 4) : '' });
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) chrome.tabs.reload(tab.id);
  window.close();
}

(async () => {
  const bots = await loadBots();
  const { active } = await chrome.storage.local.get('active');
  const list = document.getElementById('list');
  const row = (label, sub, bot) => {
    const b = document.createElement('button');
    b.innerHTML = `${label}<small>${sub}</small>`;
    b.className = (bot?.name ?? null) === active ? 'on' : '';
    b.onclick = () => apply(bot);
    list.append(b);
  };
  row('off', 'real browser UA, reload', null);
  for (const bot of bots) row(bot.name, bot.description, bot);
})();
