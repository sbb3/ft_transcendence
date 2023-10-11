
// import { Injectable } from '@nestjs/common';
// import { v2 as cloudinary } from 'cloudinary';
// // import { Injectable } from '@nestjs/common';
// // import { CloudinaryResponse } from './cloudinary-response';
// const streamifier = require('streamifier');

// import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

// export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

// @Injectable()
// export class CloudinaryService {
 
//     async uploadImage(file: Express.Multer.File): Promise<string> {
//       console.log(`\n file.path : ${file.path} \n`);
//     const result = await cloudinary.uploader.upload(file.path);
//     console.log(`\n result.url : ${result.url} \n`);
//     return result.url;
//     }

//   // uploadImage(file: Express.Multer.File): Promise<CloudinaryResponse> {
//   //   return new Promise<CloudinaryResponse>((resolve, reject) => {
//   //     const uploadStream = cloudinary.uploader.upload_stream(
//   //       (error, result) => {
//   //         if (error) return reject(error);
//   //         resolve(result);
//   //       },
//   //     );

//   //     streamifier.createReadStream(file.buffer).pipe(uploadStream);
//   //   });
// // }
// }

import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream from 'buffer-to-stream';
@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      console.log(`\n file.   : `, JSON.stringify(file.mimetype), `\n`);
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }
}