import { Metadata, Viewport } from 'next';
import { MetadataRoute } from 'next';

const BASE_URL = 'https://locadoradaconstrucao.com.br'; // example domain

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        }
    ];
}
