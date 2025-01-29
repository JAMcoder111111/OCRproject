import React, { useState, useRef } from 'react';
import { 
    Container, 
    Card,
    CardBody,
    Button,
    Alert
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setUploadStatus(null); // Clear previous status
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({
        type: 'error',
        message: 'Please select a file first!'
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadStatus({
        type: 'info',
        message: 'Uploading file...'
      });

      // Add your AWS upload logic here
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'PUT',
        headers: {
          'Content-Type': selectedFile.type,
          // Add any other required headers
        },
        body: selectedFile
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      // Success
      setUploadStatus({
        type: 'success',
        message: 'File uploaded successfully!'
      });
      
      // Reset form
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        type: 'error',
        message: `Upload failed: ${error.message}`
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <div>
      <Container>
        <Card>
          <CardBody>
            <h4 className="mb-4">File Upload</h4>
            
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                onChange={handleFileSelect}
                ref={fileInputRef}
                disabled={isUploading}
              />
            </div>

            {/* Status Alert */}
            {uploadStatus && (
              <Alert 
                color={getAlertColor(uploadStatus.type)}
                className="mb-3"
              >
                {uploadStatus.message}
              </Alert>
            )}

            {/* Selected file info */}
            {selectedFile && (
              <div className="mb-3">
                <strong>Selected file: </strong>
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </div>
            )}

            <Button 
              color="primary" 
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              <FontAwesomeIcon icon={faUpload} className="me-2" />
              {isUploading ? 'Uploading...' : 
                selectedFile ? `Upload ${selectedFile.name}` : 'Select a file'}
            </Button>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default FileUploader;
