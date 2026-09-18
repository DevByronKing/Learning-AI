import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Learning AI - O Copiloto Cognitivo para Concursos',
    short_name: 'Learning AI',
    description: 'Plataforma de alta performance com IA, psicometria de bancas, simulados cognitivos e repetição espaçada.',
    start_url: '/',
    display: 'standalone',
    background_color: '#080C14',
    theme_color: '#3B82F6',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
