import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { bots, userAgent, DEFAULT_BOT } from './index.js';

test('bots.txt parses and every row is complete', () => {
  assert.ok(Object.keys(bots).length >= 8);
  for (const [name, b] of Object.entries(bots)) {
    assert.ok(b.ua && b.description, `row '${name}' missing ua or description`);
  }
  assert.match(userAgent(DEFAULT_BOT), /Claude-User/);
  assert.throws(() => userAgent('nope'), /unknown bot/);
});

test('uacurl reads the same list', () => {
  const names = execFileSync('./uacurl', ['--bots'], { encoding: 'utf8' }).trim().split('\n');
  assert.deepEqual(names, Object.keys(bots));
});
