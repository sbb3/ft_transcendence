
// import { v2 as cloudinary } from 'cloudinary';

// export const CloudinaryProvider = {
//   provide: 'CLOUDINARY',
//   useFactory: () => {
//     return cloudinary.config({
//         cloud_name: process.env.CLOUDINARY_NAME,
//         api_key: process.env.CLOUDINARY_API_KEY,
//         api_secret: process.env.CLOUDINARY_API_SECRET,
//     });
//   },
// };

import { v2 } from 'cloudinary';
// import { CLOUDINARY } from './constants';
export const CloudinaryProvider = {
  provide: "CLOUDINARY",
   useFactory: ()=> {
    return v2.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  },
};