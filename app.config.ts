import { ConfigContext, ExpoConfig } from '@expo/config';
import 'dotenv/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: config.name || 'hw_mobile',
    slug: config.slug || 'hw_mobile',
    extra: {
      ...config.extra,
      PLUGGY_CRYPT_SECRET: process.env.PLUGGY_CRYPT_SECRET,
    },
  };
};