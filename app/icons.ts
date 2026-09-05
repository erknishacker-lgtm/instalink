import type { ComponentType, SVGProps } from 'react';
import { FaGithub, FaInstagram, FaFacebook, FaLinkedin, FaTwitter, FaTiktok } from 'react-icons/fa';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export const icons: { [key: string]: IconType } = {
    FaGithub,
    FaInstagram,
    FaFacebook,
    FaLinkedin,
    FaTwitter,
    FaTiktok,
};

export const iconMap = icons;
