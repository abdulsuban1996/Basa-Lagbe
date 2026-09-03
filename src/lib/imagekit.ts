import { ImageKit } from '@imagekit/nodejs'

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
})

// Generate auth params for client-side upload
export function getImageKitAuthParams(): {
  token: string
  expire: number
  signature: string
} {
  return imagekit.helper.getAuthenticationParameters()
}

// Upload a base64 string to ImageKit (server-side)
export async function uploadToImageKit(
  base64File: string,
  fileName: string,
  folder: string = '/basa-lagbe'
): Promise<string> {
  const response = await imagekit.files.upload({
    file: base64File,
    fileName,
    folder,
    useUniqueFileName: true,
  })
  return (response as unknown as { url: string }).url
}
