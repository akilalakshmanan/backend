import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import expressAsyncHandler from 'express-async-handler';
import streamifier from 'streamifier';
import { isAdmin, isAuth } from '../utils.js';
import upload from '../middleware/upload';

const upload = upload;
const uploadRouter = express.Router();

uploadRouter.post(
  '/uploadImage',
  isAuth,
  isAdmin,
  upload.single('file'),
  expressAsyncHandler(async (req,res) =>{
    if(req.file === undefined) return res.send({message : "you must select a file"});
    const imgUrl = `http://localhost:`
    const imageDetails = new ImageProduct({
      name : 'sample',
      productId : 'something',
      img:
      {
          data: req.file.buffer,
          contentType: 'image/jpeg'
      }
    })
  })
)

// uploadRouter.post(
//   '/',
//   isAuth,
//   isAdmin,
//   upload.single('file'),
//   async (req, res) => {
//     cloudinary.config({
//       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//       api_key: process.env.CLOUDINARY_API_KEY,
//       api_secret: process.env.CLOUDINARY_API_SECRET,
//     });
//     const streamUpload = (req) => {
//       return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream((error, result) => {
//           if (result) {
//             resolve(result);
//           } else {
//             reject(error);
//           }
//         });
//         streamifier.createReadStream(req.file.buffer).pipe(stream);
//       });
//     };
//     const result = await streamUpload(req);
//     res.send(result);
//   }
// );
export default uploadRouter;
