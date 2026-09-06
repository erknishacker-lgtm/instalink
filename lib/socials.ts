import type { SocialLink } from './types';

export const SUPPORTED_SOCIALS = [
  {
    key: 'instagram',
    title: 'Instagram',
    icon: 'FaInstagram',
    baseUrl: 'https://www.instagram.com/',
    domains: ['instagram.com'],
  },
  {
    key: 'tiktok',
    title: 'TikTok',
    icon: 'FaTiktok',
    baseUrl: 'https://www.tiktok.com/@',
    domains: ['tiktok.com'],
  },
  {
    key: 'facebook',
    title: 'Facebook',
    icon: 'FaFacebook',
    baseUrl: 'https://www.facebook.com/',
    domains: ['facebook.com', 'fb.com'],
  },
  {
    key: 'youtube',
    title: 'YouTube',
    icon: 'FaYoutube',
    baseUrl: 'https://www.youtube.com/@',
    domains: ['youtube.com', 'youtu.be'],
  },
  {
    key: 'x',
    title: 'X',
    icon: 'FaTwitter',
    baseUrl: 'https://x.com/',
    domains: ['x.com', 'twitter.com'],
  },
  {
    key: 'pinterest',
    title: 'Pinterest',
    icon: 'FaPinterest',
    baseUrl: 'https://www.pinterest.com/',
    domains: ['pinterest.com', 'pin.it'],
  },
] as const;

type SupportedSocial = (typeof SUPPORTED_SOCIALS)[number];

export function getSocialPlatform(icon: string): SupportedSocial {
  const platform = SUPPORTED_SOCIALS.find((social) => social.icon === icon);
  if (!platform) throw new Error('Rede social não permitida.');
  return platform;
}

function matchesDomain(hostname: string, domains: readonly string[]) {
  const normalized = hostname.toLowerCase().replace(/^www\./, '');
  return domains.some((domain) => normalized === domain || normalized.endsWith(`.${domain}`));
}

export function normalizeSocialInput(icon: string, input: string) {
  const platform = getSocialPlatform(icon);
  const value = input.trim();

  if (!value) return { link: '', username: '' };

  if (/^https?:\/\//i.test(value)) {
    const url = new URL(value);
    if (!matchesDomain(url.hostname, platform.domains)) {
      throw new Error(`Use um link válido do ${platform.title}.`);
    }
    url.protocol = 'https:';
    return { link: url.toString().replace(/\/$/, ''), username: '' };
  }

  const handle = value.replace(/^@+/, '').trim();
  if (!/^[A-Za-z0-9._-]+$/.test(handle)) {
    throw new Error(`Digite o @ ou um link válido do ${platform.title}.`);
  }

  return {
    link: `${platform.baseUrl}${handle}`,
    username: `@${handle}`,
  };
}

export function getSocialInputValue(link: Pick<SocialLink, 'link' | 'username'>) {
  return link.username || link.link;
}

export function createDefaultSocialLinks(): SocialLink[] {
  return SUPPORTED_SOCIALS.map((social, index) => ({
    id: `social-${social.key}`,
    title: social.title,
    link: '',
    icon: social.icon,
    username: '',
    color: { start: '#F9A8D4', end: '#DB2777' },
    order: index + 1,
    isActive: false,
  }));
}
