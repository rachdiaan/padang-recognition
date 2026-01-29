import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface ImagePreviewProps {
  imageDataUrl: string;
  onClose: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageDataUrl, onClose }) => {
  return (
    <div className="card shadow-lg border-0 overflow-hidden">
      <div className="card-header bg-primary text-white p-4 border-0 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="mb-1 fw-bold">📷 Captured Image</h2>
          <p className="mb-0 text-white-50">Ready for AI analysis</p>
        </div>
        <button
          onClick={onClose}
          className="btn btn-primary bg-white bg-opacity-10 rounded-3 p-2 border-0 hover-opacity"
        >
          <X size={28} />
        </button>
      </div>

      <div className="card-body p-4">
        <div className="rounded-3 overflow-hidden shadow mb-4">
          <img
            src={imageDataUrl}
            alt="Captured food"
            className="w-100 h-auto d-block"
            style={{ maxHeight: '80vh', objectFit: 'contain' }}
            onError={(e) => {
              console.error('Failed to display captured image');
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success d-flex align-items-center rounded-3 p-3">
          <Sparkles className="me-3 flex-shrink-0" size={20} />
          <div className="fw-medium">
            Image captured successfully! AI analysis will begin automatically.
          </div>
        </div>
      </div>
    </div>
  );
};