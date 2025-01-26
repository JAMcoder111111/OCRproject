import axios from 'axios';
import { 
  ListObjectsCommand, 
  PutObjectCommand, 
  DeleteObjectCommand,
  GetObjectCommand 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../../utils/s3Client';

const BUCKET_NAME = process.env.REACT_APP_S3_BUCKET;

// List all objects in bucket
export const listObjects = async () => {
  try {
    const command = new ListObjectsCommand({
      Bucket: BUCKET_NAME
    });
    return await s3Client.send(command);
  } catch (error) {
    throw new Error(`Failed to list objects: ${error.message}`);
  }
};

// Get signed URL for downloading a file
export const getDownloadUrl = async (key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
  } catch (error) {
    throw new Error(`Failed to generate download URL: ${error.message}`);
  }
};

// Get signed URL for uploading a file
export const getUploadUrl = async (key, contentType) => {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (error) {
    throw new Error(`Failed to generate upload URL: ${error.message}`);
  }
};

// Upload file directly to S3
export const uploadFile = async (file, key) => {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: file.type
    });
    return await s3Client.send(command);
  } catch (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

// Upload file using pre-signed URL
export const uploadFileWithSignedUrl = async (signedUrl, file, onProgress) => {
  try {
    await axios.put(signedUrl, file, {
      headers: {
        'Content-Type': file.type
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (onProgress) {
          onProgress(percentCompleted);
        }
      }
    });
  } catch (error) {
    throw new Error(`Failed to upload file with signed URL: ${error.message}`);
  }
};

// Delete file from S3
export const deleteObject = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });
    return await s3Client.send(command);
  } catch (error) {
    throw new Error(`Failed to delete object: ${error.message}`);
  }
};

// Check if file exists in S3
export const checkFileExists = async (key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });
    await s3Client.send(command);
    return true;
  } catch (error) {
    if (error.name === 'NoSuchKey') {
      return false;
    }
    throw error;
  }
};

// Get file metadata
export const getFileMetadata = async (key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });
    const response = await s3Client.send(command);
    return {
      contentType: response.ContentType,
      lastModified: response.LastModified,
      contentLength: response.ContentLength,
      metadata: response.Metadata
    };
  } catch (error) {
    throw new Error(`Failed to get file metadata: ${error.message}`);
  }
};

// Batch delete multiple files
export const batchDeleteObjects = async (keys) => {
  if (!Array.isArray(keys) || keys.length === 0) {
    throw new Error('Keys must be a non-empty array');
  }

  try {
    const deletePromises = keys.map(key => deleteObject(key));
    return await Promise.all(deletePromises);
  } catch (error) {
    throw new Error(`Failed to delete objects: ${error.message}`);
  }
};

// Helper function to generate a unique file key
export const generateUniqueFileKey = (fileName) => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = fileName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
};
