import { cleanEnv, str } from 'envalid';
import { v2 } from 'cloudinary';

const env = cleanEnv(process.env, {
  CLOUDINARY_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
});

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {

    return v2.config({
      cloud_name: env.CLOUDINARY_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  },
};
