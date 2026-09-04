import { ImageKit } from '@imagekit/nodejs'

const IMAGEKIT_PRIVATE_KEY =
  process.env.IMAGEKIT_PRIVATE_KEY || 'private_0pbpYiVZFg1+SLLYjEvJLo6AMUU='

const imagekit = new ImageKit({
  privateKey: IMAGEKIT_PRIVATE_KEY,
})

// Generate auth params for client-side upload
export function getImageKitAuthParams(): {
  token: string
  expire: number
  signature: string
  publicKey: string
} {
  const params = imagekit.helper.getAuthenticationParameters()
  const publicKey =
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
    'public_SwUJt+vXf8Vmk3+Hzz05edUB57Y='
  return {
    ...params,
    publicKey,
  }
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
