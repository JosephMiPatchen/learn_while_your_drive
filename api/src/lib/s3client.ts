// api/src/lib/s3Client.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  endpoint: `https://s3.us-east-1.amazonaws.com`,
  forcePathStyle: false, // Use virtual hosted-style URLs
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'dnl-media';

export const uploadAudioToS3 = async (audioBuffer: Buffer, fileName: string): Promise<string> => {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `audio/${fileName}`,
      Body: audioBuffer,
      ContentType: 'audio/mpeg',
    });

    await s3Client.send(command);

    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `audio/${fileName}`,
    });

    const signedUrl = await getSignedUrl(s3Client, getCommand, {
      expiresIn: 3600,
    });

    return signedUrl;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};