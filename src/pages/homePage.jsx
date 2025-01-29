import React from 'react';
import { FileList } from '../features/s3/s3components/FileList';
import FileUploader from '../features/components/FileUploader';
import { Container, Row, Col } from 'reactstrap';

const HomePage = () => {
  return (
    <div>
          <h2>Upload Your Documents</h2>
          <h3>By uploading your documents you will be storing them in an S3 bucket</h3>
      <Container fluid>
        <Row className="g-4">  
          <Col md="6">
            <div className="p-3">  
              <FileUploader />
            </div>
          </Col>

          <Col md="6">
            <div className="p-3">
              <FileList />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
