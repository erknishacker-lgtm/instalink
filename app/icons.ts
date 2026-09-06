import type { ComponentType, SVGProps } from 'react';
import {
  FaInstagram, FaTiktok, FaFacebook, FaYoutube, FaPinterest, FaLinkedin,
  FaTwitter, FaWhatsapp, FaTelegram, FaSpotify, FaGithub, FaLink,
} from 'react-icons/fa';

export type IconType = ComponentType<SVGProps<SVGSVGElement>>;

// Ícones de marca das redes. O painel mostra essa lista num seletor.
export const icons: Record<string, IconType> = {
  FaInstagram, FaTiktok, FaFacebook, FaYoutube, FaPinterest, FaLinkedin,
  FaTwitter, FaWhatsapp, FaTelegram, FaSpotify, FaGithub, FaLink,
};

export const iconLabels: Record<string, string> = {
  FaInstagram: 'Instagram', FaTiktok: 'TikTok', FaFacebook: 'Facebook', FaYoutube: 'YouTube',
  FaPinterest: 'Pinterest', FaLinkedin: 'LinkedIn', FaTwitter: 'X / Twitter', FaWhatsapp: 'WhatsApp',
  FaTelegram: 'Telegram', FaSpotify: 'Spotify', FaGithub: 'GitHub', FaLink: 'Outro link',
};

export const iconMap = icons;
