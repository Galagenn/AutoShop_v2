import { NextResponse } from 'next/server'
import { cloudinary } from '@/lib/cloudinary'
import { auth } from '@/auth'
import { Buffer } from 'node:buffer'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const contentType = req.headers.get('content-type') || ''
  try {
    // Helper: unsigned fallback via upload_preset
    const tryUnsignedUpload = async (blobOrDataUri: Blob | string, folder: string) => {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      if (!cloudName || !uploadPreset) return null
      const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      const fd = new FormData()
      fd.append('upload_preset', uploadPreset)
      if (folder) fd.append('folder', folder)
      // Both raw file and data URI are accepted by Cloudinary
      fd.append('file', blobOrDataUri as any)
      const resp = await fetch(endpoint, { method: 'POST', body: fd })
      if (!resp.ok) {
        const err = await resp.text().catch(() => '')
        throw new Error(err || `Cloudinary unsigned upload failed: ${resp.status}`)
      }
      const json = await resp.json()
      return { url: json.secure_url as string, publicId: json.public_id as string }
    }

    const hasServerCreds = Boolean(
      (process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) &&
      (process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY) &&
      process.env.CLOUDINARY_API_SECRET
    )
    if (contentType.includes('application/json')) {
      const { file, url, folder = 'autoshop' } = await req.json()
      let result
      if (file) {
        if (hasServerCreds) {
          result = await cloudinary.uploader.upload(file, { folder, resource_type: 'image', invalidate: true, overwrite: false })
          return NextResponse.json({ url: result.secure_url, publicId: result.public_id })
        }
        const unsigned = await tryUnsignedUpload(file, folder)
        if (!unsigned) return NextResponse.json({ error: 'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET (or server credentials).' }, { status: 500 })
        return NextResponse.json(unsigned)
      } else if (url) {
        if (hasServerCreds) {
          result = await cloudinary.uploader.upload(url, { folder, resource_type: 'image', invalidate: true, overwrite: false })
          return NextResponse.json({ url: result.secure_url, publicId: result.public_id })
        }
        const unsigned = await tryUnsignedUpload(url, folder)
        if (!unsigned) return NextResponse.json({ error: 'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET (or server credentials).' }, { status: 500 })
        return NextResponse.json(unsigned)
      } else {
        return NextResponse.json({ error: 'file (base64) or url required' }, { status: 400 })
      }
    }

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData()
      const file = form.get('file') as File | null
      const folder = (form.get('folder') as string) || 'autoshop'
      if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 })
      const arrayBuffer = await file.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      const mime = file.type && file.type.startsWith('image/') ? file.type : 'image/jpeg'
      const dataUri = `data:${mime};base64,${base64}`
      if (hasServerCreds) {
        const result = await cloudinary.uploader.upload(dataUri, {
          folder,
          resource_type: 'image',
          invalidate: true,
          overwrite: false,
          format: undefined,
        })
        return NextResponse.json({ url: result.secure_url, publicId: result.public_id })
      }
      const unsigned = await tryUnsignedUpload(file, folder)
      if (!unsigned) return NextResponse.json({ error: 'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET (or server credentials).' }, { status: 500 })
      return NextResponse.json(unsigned)
    }

    return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 })
  } catch (e: any) {
    const message = typeof e?.message === 'string' ? e.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
