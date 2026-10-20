import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Argus - O Copiloto Cognitivo para Concursos e OAB',
    short_name: 'Argus',
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
