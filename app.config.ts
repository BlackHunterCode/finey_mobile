import { ConfigContext, ExpoConfig } from '@expo/config';
import 'dotenv/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: config.name || 'Finey',
    slug: config.slug || 'finey',
    extra: {
      ...config.extra,
      PLUGGY_CRYPT_SECRET: process.env.PLUGGY_CRYPT_SECRET,
      LAN_HOST: process.env.LAN_HOST
    },
  };
};