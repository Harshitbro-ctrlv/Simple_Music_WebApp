import { ImageKit, toFile } from "@imagekit/nodejs";

const ImageKitClient = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export async function uploadFile(buffer, originalName) {
  const fileName = `${Date.now()}_${originalName || "music"}`;
  const result = await ImageKitClient.files.upload({
    file: await toFile(buffer, fileName),
    fileName,
    folder: "yt-complete-backend/music",
  });

  return result;
}
