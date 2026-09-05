export interface SiteConfig {
  name: string;
  username: string;
  profilePictureUrl: string;
  announcementBadge: string;
  announcementText: string;
  whatsappPhone: string;
}

export interface SocialLink {
  id: string;
  title: string;
  link: string;
  icon: string;
  username?: string;
  color: string | { start: string; end: string };
  order: number;
}

export interface UsefulLink {
  id: string;
  title: string;
  link: string;
  isNew?: boolean;
  color: string | { start: string; end: string };
  icon?: string;
  order: number;
}

export interface Service {
  id: string;
  name: string;
  whatsappMessageTemplate: string;
  isActive: boolean;
  order: number;
}

export interface AffiliateProduct {
  id: string;
  name: string;
  imageUrl: string;
  affiliateLink: string;
  description?: string;
  isActive: boolean;
  order: number;
}

export interface SiteData {
  config: SiteConfig;
  socialLinks: SocialLink[];
  usefulLinks: UsefulLink[];
  services: Service[];
  products: AffiliateProduct[];
}