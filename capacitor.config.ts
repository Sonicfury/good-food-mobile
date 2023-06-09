import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.goodfood.app',
  appName: 'mobile-poc',
  webDir: 'dist/mobile-poc',
  server: {
    androidScheme: 'https'
  }
};

export default config;
