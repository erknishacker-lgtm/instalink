import { SiteData } from './types';
import { createDefaultSocialLinks } from './socials';

// Dados iniciais gravados no banco na primeira leitura, quando ainda não existe nada.
// Tudo aqui é placeholder e deve ser trocado pelo painel /admin.
export function initialData(): SiteData {
  return {
    config: {
      name: 'Seu Nome',
      username: '@seunome',
      bio: 'Esteticista · Embaixadora Kyeomi',
      profilePictureUrl: '',
      backgroundImageUrl: '',
      announcementBadge: 'Novidade',
      announcementText: 'Agenda aberta para este mês. Escolha um tratamento abaixo.',
      whatsappPhone: '5511999999999',
    },
    socialLinks: createDefaultSocialLinks(),
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
        name: 'Limpeza de Pele',
        whatsappMessageTemplate: 'Oi, tudo bem? Gostaria de agendar uma limpeza de pele.',
        isActive: true,
        order: 1,
      },
      {
        id: crypto.randomUUID(),
        name: 'Massagem Relaxante',
        whatsappMessageTemplate: 'Oi, tudo bem? Gostaria de agendar uma massagem relaxante.',
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
        imageUrl: '',
        affiliateLink: 'https://shopee.com.br/exemplo',
        description: 'Hidratação profunda para todos os tipos de pele',
        isActive: true,
        order: 1,
      },
      {
        id: crypto.randomUUID(),
        name: 'Kit Skincare Noturno',
        imageUrl: '',
        affiliateLink: 'https://shopee.com.br/exemplo2',
        description: 'Rotina completa de skincare para a noite',
        isActive: true,
        order: 2,
      },
    ],
    partners: [
      {
        id: crypto.randomUUID(),
        name: 'Kyeomi',
        role: 'Embaixadora oficial',
        link: 'https://kyeomi.com.br',
        logoUrl: '/brand/kyeomi-mark.png',
        isActive: true,
        order: 1,
      },
    ],
  };
}
