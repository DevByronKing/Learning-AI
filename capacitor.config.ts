import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.argus.app',
  appName: 'Argus',
  webDir: 'public',
  server: {
    // Modo de Desenvolvimento Local / Live Reload:
    // Descomente e insira o IP da sua máquina na rede local para ver alterações no celular em tempo real:
    // url: 'http://192.168.1.100:3000',
    // cleartext: true
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      overlaysWebView: true
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      resizeOnFullScreen: true
    }
  }
};

export default config;
