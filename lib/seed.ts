import { SiteData } from './types';

// Dados iniciais gravados no banco na primeira leitura, quando ainda não existe nada.
export function initialData(): SiteData {
  return {
    config: {
      name: 'Seu Nome',
      username: '@seunome',
      profilePictureUrl: 'https://via.placeholder.com/150',
      announcementBadge: 'Novidade!',
      announcementText: 'Bem-vindo ao meu link na bio!',
      whatsappPhone: '5511999999999',
    },
    socialLinks: [
      {
        id: crypto.randomUUID(),
        title: 'Instagram',
        link: 'https://instagram.com/',
        icon: 'FaInstagram',
        username: '@seunome',
        color: { start: '#F9A8D4', end: '#EC4899' },
        order: 1,
      },
      {
        id: crypto.randomUUID(),
        title: 'TikTok',
        link: 'https://tiktok.com/@',
        icon: 'FaTiktok',
        username: '@seunome',
        color: { start: '#F9A8D4', end: '#DB2777' },
        order: 2,
      },
    ],
    usefulLinks: [
      {
        id: crypto.randomUUID(),
        title: 'Meu Portfólio',
        link: 'https://exemplo.com',
        isNew: true,
        color: { start: '#FBCFE8', end: '#F472B6' },
        order: 1,
      },
    ],
    services: [
      {
        id: crypto.randomUUID(),
        name: 'Massagem Relaxante',
        whatsappMessageTemplate: 'Oi, tudo bem? Gostaria de agendar uma massagem relaxante.',
        isActive: true,
        order: 1,
      },
      {
        id: crypto.randomUUID(),
        name: 'Limpeza de Pele',
        whatsappMessageTemplate: 'Oi, tudo bem? Gostaria de agendar uma limpeza de pele.',
        isActive: true,
        order: 2,
      },
      {
        id: crypto.randomUUID(),
        name: 'Manicure e Pedicure',
        whatsappMessageTemplate: 'Oi, tudo bem? Gostaria de agendar manicure e pedicure.',
        isActive: true,
        order: 3,
      },
    ],
    products: [
      {
        id: crypto.randomUUID(),
        name: 'Creme Hidratante Facial',
        imageUrl: 'https://via.placeholder.com/300x300',
        affiliateLink: 'https://shopee.com.br/exemplo',
        description: 'Hidratação profunda para todos os tipos de pele',
        isActive: true,
        order: 1,
      },
      {
        id: crypto.randomUUID(),
        name: 'Kit Skincare Noturno',
        imageUrl: 'https://via.placeholder.com/300x300',
        affiliateLink: 'https://shopee.com.br/exemplo2',
        description: 'Rotina completa de skincare para a noite',
        isActive: true,
        order: 2,
      },
    ],
  };
}
