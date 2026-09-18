# ua-spoofer

Fetch pages wearing an AI-crawler User-Agent (Claude-User, GPTBot, PerplexityBot, Googlebot...). Often unwalls pages. One bot list (`bots.txt`), three front ends.

## CLI

```sh
uacurl --as gptbot https://example.com   # any curl args after the flags
uacurl --list
```

## Node

```sh
npm install @brianvia/ua-spoofer   # GitHub Packages: needs @brianvia:registry=https://npm.pkg.github.com in .npmrc
```

```js
import { fetchAs, userAgent, bots } from '@brianvia/ua-spoofer';
const res = await fetchAs('claude-user', 'https://example.com');
```

## Chrome extension

`npm run build:ext`, then chrome://extensions → Load unpacked → `extension/`. Click the icon, pick a bot, the tab reloads with that User-Agent header. Pick "off" to go back. It rewrites the header only; `navigator.userAgent` in page JS is untouched.
