import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  Container, 
  Navbar, 
  NavbarBrand, 
  Nav, 
  NavItem, 
  NavLink,
  Card,
  CardBody,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FileList } from './features/s3/s3components/FileList';

function App() {
  return (
    <div>
      <Navbar color="dark" dark expand="md" className="mb-4">
        <Container>
          <NavbarBrand href="/">S3 File Manager</NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/upload">
                <FontAwesomeIcon icon={faUpload} className="me-2" />
                Upload
              </NavLink>
            </NavItem>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <Card className="shadow-sm">
          <CardBody>
            <FileList />
          </CardBody>
        </Card>

        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/upload" element={<div>Upload Page</div>} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
