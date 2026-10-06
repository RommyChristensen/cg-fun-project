import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Plus, Home, Upload, X } from 'lucide-react';
import '../styles/MomentsScreen.css';

const MomentsScreen = () => {
  const { setCurrentScreen } = useContext(AppContext);
  const [moments, setMoments] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchMoments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/moments');
      if (!response.ok) {
        throw new Error('Failed to fetch moments');
      }
      const data = await response.json();
      console.log('Fetched moments:', data);
      setMoments(data);
    } catch (error) {
      console.error('Error fetching moments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoments();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      setShowUpload(false);
      fetchMoments();
    } catch (error) {
      setUploadError(`Failed to upload photo: ${error.message}`);
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleAddMoment = (e) => {
    e.preventDefault();
    if (photoUrl.trim()) {
      setPhotoUrl('');
      setShowUpload(false);
      fetchMoments();
    }
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <div>📸 CG FUN Moments</div>
      </div>

      <div className="screen-content moments-content">
        {!showUpload && (
          <div className="moments-grid">
            {loading ? (
              <div className="empty-state">
                <p>Loading moments...</p>
              </div>
            ) : moments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📷</div>
                <p>No moments yet!</p>
                <p className="empty-subtitle">Add your first CG FUN moment</p>
              </div>
            ) : (
              <div className="photos-collage">
                {moments.map((moment) => (
                  <div
                    key={moment.id}
                    className="photo-item"
                    onClick={() => setSelectedPhoto(moment)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={moment.photoUrl} alt="CG FUN Moment" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showUpload && (
          <div className="upload-form">
            <h3>Add a Photo</h3>

            <div className="upload-tabs">
              <button
                className="upload-tab-btn active"
                onClick={() => {}}
              >
                Upload from Device
              </button>
            </div>

            <div className="input-group">
              <label>Select Photo</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  id="photo-input"
                />
                <label htmlFor="photo-input" className="file-input-label">
                  {uploading ? 'Uploading...' : 'Choose Photo'}
                </label>
              </div>
            </div>

            {uploadError && <div className="error-message">{uploadError}</div>}

            <div className="form-buttons">
              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={() => {
                  setShowUpload(false);
                  setUploadError('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="screen-footer">
        {!showUpload && (
          <button className="btn btn-primary btn-small" onClick={() => setShowUpload(true)}>
            <Plus size={18} />
            Add Moment
          </button>
        )}
        <button
          className="btn btn-danger btn-small"
          onClick={() => setCurrentScreen('home')}
        >
          <Home size={18} />
          Home
        </button>
      </div>

      {selectedPhoto && (
        <div className="photo-modal-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="photo-modal-close"
              onClick={() => setSelectedPhoto(null)}
            >
              <X size={24} />
            </button>
            <img src={selectedPhoto.photoUrl} alt="Full screen" className="photo-modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MomentsScreen;
