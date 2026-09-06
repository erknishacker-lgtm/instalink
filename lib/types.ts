export interface SiteConfig {
  name: string;
  username: string;
  /** Uma linha abaixo do nome: "Esteticista · Embaixadora Kyeomi" */
  bio?: string;
  profilePictureUrl: string;
  /** Foto delicada de fundo da página pública. Vazio = textura padrão. */
  backgroundImageUrl?: string;
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
  isActive: boolean;
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

/** Marca da qual ela é embaixadora / parceira. */
export interface Partner {
  id: string;
  name: string;
  /** Ex.: "Embaixadora oficial" */
  role: string;
  link: string;
  logoUrl?: string;
  isActive: boolean;
  order: number;
}

export interface SiteData {
  config: SiteConfig;
  socialLinks: SocialLink[];
  usefulLinks: UsefulLink[];
  services: Service[];
  products: AffiliateProduct[];
  partners: Partner[];
}
