'use strict';
var assert = require('assert');
var P = require('../physical-ai-charts.js');

assert.ok(P, 'PhysicalAICharts must be exported');
assert.ok(P._resolveFamily, '_resolveFamily must be exported');

assert.strictEqual(P._resolveFamily('nvidia/gr00t-n1.7').key, 'gr00t');
assert.strictEqual(P._resolveFamily('physical-intelligence/pi-zero').key, 'pi');
assert.strictEqual(P._resolveFamily('openvla/openvla-7b').key, 'openvla');
assert.strictEqual(P._resolveFamily('octo/octo-base').key, 'octo');
assert.strictEqual(P._resolveFamily('google-deepmind/gemini-robotics-er-1.6').key, 'gemini-robotics');
assert.strictEqual(P._resolveFamily('figure-ai/helix').key, 'industrial-humanoid');
assert.strictEqual(P._resolveFamily('foxconn/foxbrain-70b').key, 'industrial-fm');
assert.strictEqual(P._resolveFamily('meta/sapiens2-5b').key, 'human-vision');
assert.strictEqual(P._resolveFamily('').key, 'other');
assert.strictEqual(P._resolveFamily('random/unknown').key, 'other');

console.log('Task 1 _resolveFamily OK');
