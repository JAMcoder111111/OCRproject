import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

const DocumentUploader = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus(null);
    }
  };

  const uploadDocument = async () => {
    if (!file) {
      setUploadStatus({
        type: 'error',
        message: 'Please select a file first'
      });
      return;
    }

    setIsLoading(true);
    setUploadStatus(null);

    try {
        const bucketName = process.env.REACT_APP_S3_BUCKET;
        const encodedFileName = encodeURIComponent(file.name);
        
        // Construct the API URL properly
        const apiUrl = `${process.env.REACT_APP_AWS_ACCESS_KEY_ID}/${bucketName}/${encodedFileName}`;
        
        // Log the constructed URL (for debugging)
        console.log('Upload URL:', apiUrl);
  
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', bucketName);
        formData.append('filename', file.name);

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'x-api-key': process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status: ${response.status}`);
      }

      const result = await response.json().catch(() => ({}));

      setUploadStatus({
        type: 'success',
        message: 'Document uploaded successfully!',
        data: {
          filename: file.name,
          bucket: bucketName,
          ...result
        }
      });

      // Reset file input
      setFile(null);
      const fileInput = document.getElementById('fileInput');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        type: 'error',
        message: `Upload failed: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add debug information component
  const DebugInfo = () => (
    <div className="mt-3 p-3 bg-light rounded">
      <h6>Debug Information:</h6>
      <pre style={{ fontSize: '12px' }}>
        {JSON.stringify({
          apiEndpoint: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
          bucket: process.env.REACT_APP_S3_BUCKET,
          stage: process.env.REACT_APP_API_STAGE
        }, null, 2)}
      </pre>
    </div>
  );

  return (
    <div className="document-uploader">
      <Form>
        <FormGroup>
          <Label for="fileInput">Select Document</Label>
          <Input
            type="file"
            id="fileInput"
            onChange={handleFileSelect}
            disabled={isLoading}
          />
        </FormGroup>

        <Button
          color="primary"
          onClick={uploadDocument}
          disabled={!file || isLoading}
          className="mt-3"
        >
          {isLoading ? 'Uploading...' : 'Upload Document'}
        </Button>

        {file && (
          <Alert color="info" className="mt-3">
            <strong>Selected File:</strong> {file.name} ({Math.round(file.size / 1024)} KB)
          </Alert>
        )}

        {uploadStatus && (
          <Alert
            color={uploadStatus.type === 'success' ? 'success' : 'danger'}
            className="mt-3"
          >
            {uploadStatus.message}
            {uploadStatus.data && (
              <pre className="mt-2 bg-light p-2 rounded">
                {JSON.stringify(uploadStatus.data, null, 2)}
              </pre>
            )}
          </Alert>
        )}

        {process.env.NODE_ENV === 'development' && <DebugInfo />}
      </Form>
    </div>
  );
};

export default DocumentUploader;
