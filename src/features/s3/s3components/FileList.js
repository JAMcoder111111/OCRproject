import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Button, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faTrash } from '@fortawesome/free-solid-svg-icons';
import { fetchObjects, deleteFile } from '../s3Slice';

export function FileList() {
  const dispatch = useDispatch();
  const { objects, status, error } = useSelector((state) => state.s3);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchObjects());
    }
  }, [status, dispatch]);

  const handleDelete = (key) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      dispatch(deleteFile(key));
    }
  };

  if (status === 'loading') {
    return (
      <div className="text-center">
        <Spinner color="primary" />
      </div>
    );
  }

  if (status === 'failed') {
    return <div className="text-danger">Error: {error}</div>;
  }

  return (
    <Table hover responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Size</th>
          <th>Last Modified</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {objects.map((object) => (
          <tr key={object.Key}>
            <td>
              <FontAwesomeIcon icon={faFolder} className="me-2" />
              {object.Key}
            </td>
            <td>{(object.Size / 1024).toFixed(2)} KB</td>
            <td>{new Date(object.LastModified).toLocaleDateString()}</td>
            <td>
              <Button
                color="danger"
                size="sm"
                onClick={() => handleDelete(object.Key)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
