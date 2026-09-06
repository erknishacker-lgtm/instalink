import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';
import { initialData } from './seed';
import { createDefaultSocialLinks } from './socials';
import { SiteData, SiteConfig, SocialLink, UsefulLink, Service, AffiliateProduct, Partner } from './types';

const KEY = 'site:data';

// A integração Upstash da Vercel expõe as chaves como KV_REST_API_*;
// o painel do próprio Upstash usa UPSTASH_REDIS_REST_*. Aceitamos as duas.
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

// Sem credenciais (dev local), cai para o arquivo JSON de antes. Em produção isso
// não serve: o filesystem da Vercel é efêmero e as edições se perderiam em silêncio.
function requireRedisInProduction() {
  if (!redis && process.env.NODE_ENV === 'production') {
    throw new Error(
      'Redis não configurado. Defina KV_REST_API_URL e KV_REST_API_TOKEN nas variáveis de ambiente.'
    );
  }
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'site.json');

// Registros gravados antes de existirem campos novos ganham os defaults aqui.
function migrate(data: SiteData): SiteData {
  if (!Array.isArray(data.partners)) data.partners = [];
  if (!Array.isArray(data.socialLinks)) data.socialLinks = [];
  if (data.config.bio === undefined) data.config.bio = '';
  if (data.config.backgroundImageUrl === undefined) data.config.backgroundImageUrl = '';

  data.socialLinks = data.socialLinks.map((link) => {
    const isOldPlaceholder = link.username === '@seunome';
    return {
      ...link,
      link: isOldPlaceholder ? '' : link.link,
      username: isOldPlaceholder ? '' : link.username,
      // Links antigos nunca foram escolhidos no painel. Começam ocultos.
      isActive: typeof link.isActive === 'boolean' ? link.isActive : false,
    };
  });

  for (const defaultLink of createDefaultSocialLinks()) {
    if (!data.socialLinks.some((link) => link.icon === defaultLink.icon)) {
      data.socialLinks.push(defaultLink);
    }
  }
  return data;
}

async function readData(): Promise<SiteData> {
  requireRedisInProduction();
  if (redis) {
    const data = await redis.get<SiteData>(KEY);
    if (data) return migrate(data);
    const seeded = initialData();
    await redis.set(KEY, seeded);
    return seeded;
  }

  if (!fs.existsSync(DATA_FILE)) {
    const seeded = initialData();
    await writeData(seeded);
    return seeded;
  }
  return migrate(JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as SiteData);
}

async function writeData(data: SiteData): Promise<void> {
  requireRedisInProduction();
  if (redis) {
    await redis.set(KEY, data);
    return;
  }

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmp, DATA_FILE);
}

// Site Config
export async function getSiteConfig(): Promise<SiteConfig> {
  return (await readData()).config;
}

export async function updateSiteConfig(config: Partial<SiteConfig>): Promise<SiteConfig> {
  const data = await readData();
  data.config = { ...data.config, ...config };
  await writeData(data);
  return data.config;
}

// Social Links
export async function getSocialLinks(): Promise<SocialLink[]> {
  return (await readData()).socialLinks.sort((a, b) => a.order - b.order);
}

export async function addSocialLink(link: Omit<SocialLink, 'id'>): Promise<SocialLink> {
  const data = await readData();
  const newLink: SocialLink = { ...link, id: crypto.randomUUID() };
  data.socialLinks.push(newLink);
  await writeData(data);
  return newLink;
}

export async function updateSocialLink(id: string, updates: Partial<SocialLink>): Promise<SocialLink | null> {
  const data = await readData();
  const idx = data.socialLinks.findIndex(l => l.id === id);
  if (idx === -1) return null;
  data.socialLinks[idx] = { ...data.socialLinks[idx], ...updates, id };
  await writeData(data);
  return data.socialLinks[idx];
}

export async function updateSocialLinks(
  updates: Array<{ id: string; updates: Partial<SocialLink> }>,
): Promise<SocialLink[]> {
  const data = await readData();
  const updated: SocialLink[] = [];

  for (const item of updates) {
    const idx = data.socialLinks.findIndex((link) => link.id === item.id);
    if (idx === -1) throw new Error('Link não encontrado.');
    data.socialLinks[idx] = { ...data.socialLinks[idx], ...item.updates, id: item.id };
    updated.push(data.socialLinks[idx]);
  }

  await writeData(data);
  return updated;
}

export async function deleteSocialLink(id: string): Promise<boolean> {
  const data = await readData();
  const before = data.socialLinks.length;
  data.socialLinks = data.socialLinks.filter(l => l.id !== id);
  if (data.socialLinks.length === before) return false;
  await writeData(data);
  return true;
}

// Useful Links
export async function getUsefulLinks(): Promise<UsefulLink[]> {
  return (await readData()).usefulLinks.sort((a, b) => a.order - b.order);
}

export async function addUsefulLink(link: Omit<UsefulLink, 'id'>): Promise<UsefulLink> {
  const data = await readData();
  const newLink: UsefulLink = { ...link, id: crypto.randomUUID() };
  data.usefulLinks.push(newLink);
  await writeData(data);
  return newLink;
}

export async function updateUsefulLink(id: string, updates: Partial<UsefulLink>): Promise<UsefulLink | null> {
  const data = await readData();
  const idx = data.usefulLinks.findIndex(l => l.id === id);
  if (idx === -1) return null;
  data.usefulLinks[idx] = { ...data.usefulLinks[idx], ...updates, id };
  await writeData(data);
  return data.usefulLinks[idx];
}

export async function deleteUsefulLink(id: string): Promise<boolean> {
  const data = await readData();
  const before = data.usefulLinks.length;
  data.usefulLinks = data.usefulLinks.filter(l => l.id !== id);
  if (data.usefulLinks.length === before) return false;
  await writeData(data);
  return true;
}

// Services
export async function getServices(): Promise<Service[]> {
  return (await readData()).services.filter(s => s.isActive).sort((a, b) => a.order - b.order);
}

export async function getAllServices(): Promise<Service[]> {
  return (await readData()).services.sort((a, b) => a.order - b.order);
}

export async function addService(service: Omit<Service, 'id'>): Promise<Service> {
  const data = await readData();
  const newService: Service = { ...service, id: crypto.randomUUID() };
  data.services.push(newService);
  await writeData(data);
  return newService;
}

export async function updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
  const data = await readData();
  const idx = data.services.findIndex(s => s.id === id);
  if (idx === -1) return null;
  data.services[idx] = { ...data.services[idx], ...updates, id };
  await writeData(data);
  return data.services[idx];
}

export async function deleteService(id: string): Promise<boolean> {
  const data = await readData();
  const before = data.services.length;
  data.services = data.services.filter(s => s.id !== id);
  if (data.services.length === before) return false;
  await writeData(data);
  return true;
}

// Products
export async function getProducts(): Promise<AffiliateProduct[]> {
  return (await readData()).products.filter(p => p.isActive).sort((a, b) => a.order - b.order);
}

export async function getAllProducts(): Promise<AffiliateProduct[]> {
  return (await readData()).products.sort((a, b) => a.order - b.order);
}

export async function addProduct(product: Omit<AffiliateProduct, 'id'>): Promise<AffiliateProduct> {
  const data = await readData();
  const newProduct: AffiliateProduct = { ...product, id: crypto.randomUUID() };
  data.products.push(newProduct);
  await writeData(data);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<AffiliateProduct>): Promise<AffiliateProduct | null> {
  const data = await readData();
  const idx = data.products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  data.products[idx] = { ...data.products[idx], ...updates, id };
  await writeData(data);
  return data.products[idx];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const data = await readData();
  const before = data.products.length;
  data.products = data.products.filter(p => p.id !== id);
  if (data.products.length === before) return false;
  await writeData(data);
  return true;
}

// Partners
export async function getPartners(): Promise<Partner[]> {
  return (await readData()).partners.filter(p => p.isActive).sort((a, b) => a.order - b.order);
}

export async function getAllPartners(): Promise<Partner[]> {
  return (await readData()).partners.sort((a, b) => a.order - b.order);
}

export async function addPartner(partner: Omit<Partner, 'id'>): Promise<Partner> {
  const data = await readData();
  const newPartner: Partner = { ...partner, id: crypto.randomUUID() };
  data.partners.push(newPartner);
  await writeData(data);
  return newPartner;
}

export async function updatePartner(id: string, updates: Partial<Partner>): Promise<Partner | null> {
  const data = await readData();
  const idx = data.partners.findIndex(p => p.id === id);
  if (idx === -1) return null;
  data.partners[idx] = { ...data.partners[idx], ...updates, id };
  await writeData(data);
  return data.partners[idx];
}

export async function deletePartner(id: string): Promise<boolean> {
  const data = await readData();
  const before = data.partners.length;
  data.partners = data.partners.filter(p => p.id !== id);
  if (data.partners.length === before) return false;
  await writeData(data);
  return true;
}

// Full data (for public page)
export async function getPublicData() {
  const data = await readData();
  return {
    config: data.config,
    socialLinks: data.socialLinks.filter(l => l.isActive && l.link).sort((a, b) => a.order - b.order),
    usefulLinks: data.usefulLinks.sort((a, b) => a.order - b.order),
    services: data.services.filter(s => s.isActive).sort((a, b) => a.order - b.order),
    products: data.products.filter(p => p.isActive).sort((a, b) => a.order - b.order),
    partners: data.partners.filter(p => p.isActive).sort((a, b) => a.order - b.order),
  };
}

export type PublicData = Awaited<ReturnType<typeof getPublicData>>;
