import * as s3API from '../features/s3/s3API';

export class S3Service {
  async listObjects() {
    try {
      const response = await s3API.listObjects();
      return response.Contents || [];
    } catch (error) {
      console.error('Error in S3Service.listObjects:', error);
      throw error;
    }
  }

  async uploadFile(file) {
    try {
      const key = s3API.generateUniqueFileKey(file.name);
      const signedUrl = await s3API.getUploadUrl(key, file.type);
      await s3API.uploadFileWithSignedUrl(signedUrl, file, (progress) => {
        console.log(`Upload progress: ${progress}%`);
      });
      return key;
    } catch (error) {
      console.error('Error in S3Service.uploadFile:', error);
      throw error;
    }
  }

  async deleteFile(key) {
    try {
      return await s3API.deleteObject(key);
    } catch (error) {
      console.error('Error in S3Service.deleteFile:', error);
      throw error;
    }
  }

  async getDownloadUrl(key) {
    try {
      return await s3API.getDownloadUrl(key);
    } catch (error) {
      console.error('Error in S3Service.getDownloadUrl:', error);
      throw error;
    }
  }
}

export const s3Service = new S3Service();
