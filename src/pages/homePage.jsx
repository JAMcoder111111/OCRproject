// src/pages/homePage.jsx
import React from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import DocumentUploader from '../components/DocumentUploader';

const HomePage = () => {
  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Card className="shadow-sm">
            <CardBody>
              <h2 className="mb-3">Upload Your Documents</h2>
              <h5 className="text-muted mb-4">
                By uploading your documents you will be storing them in an S3 bucket
              </h5>
              <div className="mt-4">
                <DocumentUploader />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
