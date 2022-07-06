import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sse.ruskdata.ionicinv',
  appName: 'PhotoItems',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    url:'http://0.0.0.0:4200',
    cleartext: true
  }
};

export default config;
