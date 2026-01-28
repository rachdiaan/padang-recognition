import React from 'react';
import {
  Brain,
  Camera,
  Database,
  Zap,
  Shield,
  Smartphone,
  Code,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

export const Documentation: React.FC = () => {
  return (
    <div className="d-flex flex-column gap-5">
      {/* Hero Section */}
      <div className="card-premium bg-gradient-primary-info text-white overflow-hidden">
        <div className="card-body p-4 p-md-5 text-center">
          <h1 className="display-4 fw-bold mb-3">📚 Documentation</h1>
          <p className="lead mb-0 text-white-50">
            Complete guide to using the Padang Food Recognition System
          </p>
        </div>
      </div>

      {/* Overview */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-5">
          <h2 className="fw-bold mb-4 d-flex align-items-center">
            <Info className="text-primary me-2" size={28} />
            Overview
          </h2>
          <p className="lead mb-5 text-secondary">
            The Padang Food Recognition System is an advanced AI-powered application that uses computer vision
            and machine learning to identify traditional Padang dishes from images captured through your device's camera.
          </p>

          <div className="row g-4">
            <div className="col-md-3">
              <div className="p-4 bg-light rounded-4 text-center border h-100">
                <Brain className="mx-auto text-warning mb-3" size={32} />
                <h5 className="fw-bold mb-2">AI-Powered</h5>
                <p className="small text-muted mb-0">Advanced neural networks for accurate food recognition</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4 bg-light rounded-4 text-center border h-100">
                <Camera className="mx-auto text-primary mb-3" size={32} />
                <h5 className="fw-bold mb-2">Real-time</h5>
                <p className="small text-muted mb-0">Instant image capture and processing capabilities</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4 bg-light rounded-4 text-center border h-100">
                <Database className="mx-auto text-success mb-3" size={32} />
                <h5 className="fw-bold mb-2">Rich Dataset</h5>
                <p className="small text-muted mb-0">Comprehensive Padang food database with detailed information</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-4 bg-light rounded-4 text-center border h-100">
                <Smartphone className="mx-auto text-dark mb-3" size={32} />
                <h5 className="fw-bold mb-2">Mobile-First</h5>
                <p className="small text-muted mb-0">Optimized for mobile devices with responsive design</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-5">
          <h2 className="fw-bold mb-5 d-flex align-items-center">
            <Zap className="text-warning me-2" size={28} />
            How to Use
          </h2>

          <div className="d-flex flex-column gap-5">
            <div className="d-flex gap-4">
              <div className="flex-shrink-0 bg-primary text-white rounded-3 d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: '60px', height: '60px' }}>
                1
              </div>
              <div>
                <h4 className="fw-bold mb-3">Access Camera</h4>
                <p className="text-muted mb-3">
                  Click the "Start Camera" button to enable your device's camera. The application will request
                  camera permissions if not already granted.
                </p>
                <div className="alert alert-primary d-flex align-items-start border-0 bg-primary bg-opacity-10 text-dark">
                  <AlertCircle className="text-primary me-2 mt-1" size={20} />
                  <div>
                    <span className="fw-bold text-primary">Note:</span>
                    <span className="d-block mt-1 small">
                      Ensure good lighting conditions for optimal recognition accuracy.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-4">
              <div className="flex-shrink-0 bg-primary text-white rounded-3 d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: '60px', height: '60px' }}>
                2
              </div>
              <div>
                <h4 className="fw-bold mb-3">Capture Image</h4>
                <p className="text-muted mb-3">
                  Position your Padang dish within the camera frame and click the "Capture" button.
                  The system works best with clear, well-lit images of individual dishes.
                </p>
                <div className="alert alert-success d-flex align-items-start border-0 bg-success bg-opacity-10 text-dark">
                  <CheckCircle className="text-success me-2 mt-1" size={20} />
                  <div>
                    <span className="fw-bold text-success">Tips:</span>
                    <ul className="mb-0 mt-1 small ps-3">
                      <li>Center the dish in the frame</li>
                      <li>Avoid shadows and reflections</li>
                      <li>Capture from a slight angle for better recognition</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-4">
              <div className="flex-shrink-0 bg-primary text-white rounded-3 d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: '60px', height: '60px' }}>
                3
              </div>
              <div>
                <h4 className="fw-bold mb-3">View Results</h4>
                <p className="text-muted mb-3">
                  The AI system will analyze your image and provide predictions with confidence scores.
                  Results include dish names, descriptions, ingredients, and cultural information.
                </p>
                <div className="alert alert-info d-flex align-items-start border-0 bg-info bg-opacity-10 text-dark">
                  <TrendingUp className="text-info me-2 mt-1" size={20} />
                  <div>
                    <span className="fw-bold text-info">Understanding Results:</span>
                    <span className="d-block mt-1 small">
                      Higher confidence scores indicate more accurate predictions. Multiple results are ranked by confidence.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-5">
          <h2 className="fw-bold mb-4 d-flex align-items-center">
            <Code className="text-secondary me-2" size={28} />
            Technical Specifications
          </h2>

          <div className="row g-5">
            <div className="col-lg-6">
              <h4 className="fw-bold mb-3 text-primary">Frontend Technologies</h4>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                <li className="d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill p-1 me-2"> </span>
                  React 18 with TypeScript
                </li>
                <li className="d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill p-1 me-2"> </span>
                  Bootstrap 5 for styling
                </li>
                <li className="d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill p-1 me-2"> </span>
                  Vite for build optimization
                </li>
                <li className="d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill p-1 me-2"> </span>
                  Lucide React for icons
                </li>
              </ul>
            </div>

            <div className="col-lg-6">
              <h4 className="fw-bold mb-3 text-success">AI & Machine Learning</h4>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                <li className="d-flex align-items-center">
                  <span className="badge bg-success rounded-pill p-1 me-2"> </span>
                  TensorFlow.js with MobileNet
                </li>
                <li className="d-flex align-items-center">
                  <span className="badge bg-success rounded-pill p-1 me-2"> </span>
                  Feature extraction & visual matching
                </li>
                <li className="d-flex align-items-center">
                  <span className="badge bg-success rounded-pill p-1 me-2"> </span>
                  Color & texture analysis
                </li>
                <li className="d-flex align-items-center">
                  <span className="badge bg-success rounded-pill p-1 me-2"> </span>
                  Client-side WebGL inference
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Browser Support */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-5">
          <h2 className="fw-bold mb-4 d-flex align-items-center">
            <Shield className="text-success me-2" size={28} />
            Browser Support & Requirements
          </h2>

          <div className="row g-5">
            <div className="col-md-6">
              <h4 className="fw-bold mb-3">Supported Browsers</h4>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-center p-3 border rounded-3 bg-light">
                  <span>Chrome 90+</span>
                  <CheckCircle className="text-success" size={20} />
                </div>
                <div className="d-flex justify-content-between align-items-center p-3 border rounded-3 bg-light">
                  <span>Firefox 88+</span>
                  <CheckCircle className="text-success" size={20} />
                </div>
                <div className="d-flex justify-content-between align-items-center p-3 border rounded-3 bg-light">
                  <span>Safari 14+</span>
                  <CheckCircle className="text-success" size={20} />
                </div>
                <div className="d-flex justify-content-between align-items-center p-3 border rounded-3 bg-light">
                  <span>Edge 90+</span>
                  <CheckCircle className="text-success" size={20} />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <h4 className="fw-bold mb-3">System Requirements</h4>
              <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                <li className="d-flex align-items-center text-muted">
                  <CheckCircle className="text-success me-2" size={20} />
                  Camera access permission (for live capture)
                </li>
                <li className="d-flex align-items-center text-muted">
                  <CheckCircle className="text-success me-2" size={20} />
                  File system access (for image upload)
                </li>
                <li className="d-flex align-items-center text-muted">
                  <CheckCircle className="text-success me-2" size={20} />
                  JavaScript enabled
                </li>
                <li className="d-flex align-items-center text-muted">
                  <CheckCircle className="text-success me-2" size={20} />
                  Minimum 2GB RAM
                </li>
                <li className="d-flex align-items-center text-muted">
                  <CheckCircle className="text-success me-2" size={20} />
                  Stable internet connection
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};