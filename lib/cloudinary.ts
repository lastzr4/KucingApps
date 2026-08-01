import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload imej (data URI) ke Cloudinary, dalam folder "kucingapps".
 * Dipanggil dari API route (server-side sahaja - jangan expose API secret ke client).
 */
export async function uploadImageToCloudinary(
  dataUri: string,
  folder = "kucingapps"
): Promise<string> {
  const result = await cloudinary.uploader.upload(dataUri, { folder });
  return result.secure_url;
}

export default cloudinary;
