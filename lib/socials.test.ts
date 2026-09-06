import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createDefaultSocialLinks,
  getSocialInputValue,
  normalizeSocialInput,
  SUPPORTED_SOCIALS,
} from './socials.ts';

test('creates the correct public URL from an @ handle', () => {
  assert.deepEqual(normalizeSocialInput('FaInstagram', '@krisnavogtt'), {
    link: 'https://www.instagram.com/krisnavogtt',
    username: '@krisnavogtt',
  });
  assert.deepEqual(normalizeSocialInput('FaTiktok', 'krisnavogtt'), {
    link: 'https://www.tiktok.com/@krisnavogtt',
    username: '@krisnavogtt',
  });
});

test('keeps a valid full URL for the selected network', () => {
  assert.deepEqual(
    normalizeSocialInput('FaYoutube', 'https://youtube.com/channel/UC123'),
    { link: 'https://youtube.com/channel/UC123', username: '' },
  );
});

test('rejects unsafe or mismatched URLs', () => {
  assert.throws(() => normalizeSocialInput('FaInstagram', 'javascript:alert(1)'));
  assert.throws(() => normalizeSocialInput('FaInstagram', 'https://example.com/krisna'));
});

test('returns the original full URL to the admin field', () => {
  assert.equal(
    getSocialInputValue({
      link: 'https://youtube.com/channel/UC123',
      username: '',
    }),
    'https://youtube.com/channel/UC123',
  );
});

test('offers exactly the six approved networks', () => {
  assert.deepEqual(
    SUPPORTED_SOCIALS.map((social) => social.title),
    ['Instagram', 'TikTok', 'Facebook', 'YouTube', 'X', 'Pinterest'],
  );
  assert.ok(createDefaultSocialLinks().every((social) => !social.isActive && !social.link));
});
