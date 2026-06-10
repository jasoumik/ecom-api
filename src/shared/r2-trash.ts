import { S3Client, DeleteObjectCommand, CopyObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'

function getS3Client() {
  return new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  })
}

const BUCKET = () => process.env.R2_BUCKET!
const PUBLIC_URL = () => process.env.R2_PUBLIC_URL!.replace(/\/$/, '')

export async function listTrash() {
  const s3 = getS3Client()
  const res = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET(), Prefix: 'trash/' }))

  return (res.Contents ?? []).map((obj) => {
    const key = obj.Key ?? ''
    const withoutPrefix = key.replace(/^trash\//, '')
    const slashIdx = withoutPrefix.indexOf('/')
    const trashedAt = slashIdx > -1 ? decodeURIComponent(withoutPrefix.substring(0, slashIdx)) : ''
    const originalKey = slashIdx > -1 ? withoutPrefix.substring(slashIdx + 1) : withoutPrefix
    return {
      key,
      trashedAt,
      originalKey,
      size: obj.Size ?? 0,
      url: `${PUBLIC_URL()}/${key}`,
    }
  })
}

export async function permanentlyDelete(trashKey: string) {
  const s3 = getS3Client()
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET(), Key: trashKey }))
}

export async function restoreFromTrash(trashKey: string): Promise<string> {
  const s3 = getS3Client()
  const withoutPrefix = trashKey.replace(/^trash\//, '')
  const slashIdx = withoutPrefix.indexOf('/')
  const originalKey = slashIdx > -1 ? withoutPrefix.substring(slashIdx + 1) : withoutPrefix

  await s3.send(new CopyObjectCommand({
    Bucket: BUCKET(),
    CopySource: `${BUCKET()}/${trashKey}`,
    Key: originalKey,
  }))
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET(), Key: trashKey }))
  return `${PUBLIC_URL()}/${originalKey}`
}
