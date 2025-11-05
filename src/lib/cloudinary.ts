import { v2 as cloudinary } from 'cloudinary'

// Allow fallback to NEXT_PUBLIC_* if only public vars are set locally
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
})

export { cloudinary }
