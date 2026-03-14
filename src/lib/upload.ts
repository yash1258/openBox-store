import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
  url: string
  publicId: string
  width?: number
  height?: number
  format?: string
  bytes?: number
}

export interface UploadOptions {
  folder?: string
  transformation?: Record<string, unknown>
}

/**
 * Upload an image to Cloudinary
 * @param file - Base64 encoded image or file path
 * @param options - Upload options
 * @returns Upload result with URL and metadata
 */
export async function uploadImage(
  file: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  // In development without Cloudinary config, return mock result
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.log('[Upload] Cloudinary not configured, returning mock URL')
    return {
      url: file.startsWith('data:') ? 'https://via.placeholder.com/400x400' : file,
      publicId: 'mock-id',
    }
  }

  try {
    const uploadOptions: Record<string, unknown> = {
      folder: options.folder || 'openbox/products',
      resource_type: 'image',
      ...(options.transformation && { transformation: options.transformation }),
    }

    const result = await cloudinary.uploader.upload(file, uploadOptions)

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    }
  } catch (error) {
    console.error('Image upload failed:', error)
    throw new Error('Failed to upload image')
  }
}

/**
 * Upload multiple images to Cloudinary
 * @param files - Array of base64 encoded images or file paths
 * @param options - Upload options
 * @returns Array of upload results
 */
export async function uploadMultipleImages(
  files: string[],
  options: UploadOptions = {}
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) => uploadImage(file, options))
  return Promise.all(uploadPromises)
}

/**
 * Delete an image from Cloudinary
 * @param publicId - Cloudinary public ID of the image
 */
export async function deleteImage(publicId: string): Promise<void> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.log('[Upload] Cloudinary not configured, skipping delete')
    return
  }

  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Image delete failed:', error)
    throw new Error('Failed to delete image')
  }
}

/**
 * Generate optimized image URL with transformations
 * @param url - Original image URL
 * @param options - Transformation options
 * @returns Optimized URL
 */
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number
    height?: number
    quality?: number | string
    format?: 'auto' | 'webp' | 'jpg' | 'png'
  } = {}
): string {
  if (!url.includes('cloudinary.com')) {
    // Not a Cloudinary URL, return as-is
    return url
  }

  const { width, height, quality = 'auto', format = 'auto' } = options

  // Parse URL to add transformations
  const urlObj = new URL(url)
  const pathParts = urlObj.pathname.split('/')

  // Find the upload folder index
  const uploadIndex = pathParts.findIndex((part) => part === 'upload')
  if (uploadIndex === -1) return url

  // Build transformation string
  const transformations: string[] = []
  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  if (quality) transformations.push(`q_${quality}`)
  if (format && format !== 'auto') transformations.push(`f_${format}`)

  if (transformations.length > 0) {
    pathParts.splice(uploadIndex + 1, 0, transformations.join(','))
  }

  urlObj.pathname = pathParts.join('/')
  return urlObj.toString()
}

export { cloudinary }
