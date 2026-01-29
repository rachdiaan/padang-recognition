import React from 'react';
import { Trophy, Clock, MapPin, Flame, Target, Zap } from 'lucide-react';
import { PredictionResult } from '../types/food';

interface PredictionResultsProps {
  predictions: PredictionResult[];
  isLoading: boolean;
}

export const PredictionResults: React.FC<PredictionResultsProps> = ({ predictions, isLoading }) => {
  if (isLoading) {
    return (
      <div className="card border-0 shadow-sm bg-light">
        <div className="card-body p-5 text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="fw-bold text-dark">🔍 Analyzing Image...</h4>
          <p className="text-muted">Advanced computer vision processing</p>
        </div>
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="card border-0 shadow-sm bg-dark text-white text-center">
        <div className="card-body p-5">
          <div className="mb-4">
            <Target className="text-secondary opacity-50 mx-auto" size={64} />
          </div>
          <h3 className="fw-bold mb-2">🎯 Ready for Analysis</h3>
          <p className="text-white-50 mb-4">Capture a photo to identify Padang dishes</p>

          <div className="alert alert-info bg-opacity-10 border-info text-info text-start d-inline-block">
            <div className="d-flex align-items-center mb-2 fw-bold">
              <Zap size={18} className="me-2" />
              Pro Tips
            </div>
            <ul className="mb-0 small ps-3">
              <li>Use good lighting for best results</li>
              <li>Center the dish in the frame</li>
              <li>Avoid shadows and reflections</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // NON-FOOD DETECTION CHECK
  // If the top prediction is below 45% confidence, we assume it's not a known Padang food.
  const topConfidence = predictions[0]?.confidence || 0;
  if (topConfidence < 0.45) { // Using hardcoded value to avoid import cycles if not carefully managed, or imports can be added.
    return (
      <div className="card border-0 shadow bg-danger bg-opacity-10">
        <div className="card-body p-5 text-center">
          <div className="mb-3 text-danger">
            <Flame size={64} />
          </div>
          <h3 className="fw-bold text-danger mb-2">MOHON UPLOAD FOTO MAKANAN!</h3>
          <p className="text-dark opacity-75 mb-0">
            Kami tidak dapat mengenali gambar ini sebagai Masakan Padang.<br />
            Pastikan foto jelas, tidak blur, dan menampakkan makanan.
          </p>
        </div>
      </div>
    );
  }

  const getSpiceLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'mild': return 'text-success';
      case 'medium': return 'text-warning';
      case 'hot': return 'text-danger';
      case 'very-hot': return 'text-danger fw-bold';
      default: return 'text-secondary';
    }
  };

  const getSpiceLevelIcon = (level: string) => {
    const count = level.toLowerCase() === 'mild' ? 1 :
      level.toLowerCase() === 'medium' ? 2 :
        level.toLowerCase() === 'hot' ? 3 : 4;
    return Array(count).fill(0).map((_, i) => (
      <Flame key={i} className={`me-1 ${getSpiceLevelColor(level)}`} size={14} />
    ));
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex align-items-center mb-2">
        <Trophy className="text-warning me-2" size={24} />
        <h3 className="fw-bold mb-0">Results</h3>
      </div>

      {predictions.map((prediction, index) => (
        <div
          key={index}
          className="card-premium overflow-hidden hover-shadow transition-all"
        >
          <div className="card-body p-3 p-md-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h2 className="card-title fw-bold mb-1 h3 text-primary">{prediction.food.name}</h2>
                <h5 className="text-secondary fw-light">{prediction.food.nameEn}</h5>
              </div>
              <div className="text-end">
                <span className="badge bg-danger rounded-pill fs-6 px-3 py-2 shadow-sm mb-1">
                  {Math.round(prediction.confidence * 100)}% Match
                </span>
                <div className="small text-muted">Score: {(prediction.matchScore * 100).toFixed(1)}</div>
              </div>
            </div>

            <p className="card-text text-dark opacity-75 lead fs-6">{prediction.food.description}</p>

            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-4">
                <div className="d-flex align-items-center text-muted small">
                  <MapPin className="me-1" size={14} />
                  {prediction.food.region}
                </div>
              </div>
              <div className="col-6 col-sm-4">
                <div className="d-flex align-items-center text-muted small">
                  <Clock className="me-1" size={14} />
                  {prediction.food.cookingTime}
                </div>
              </div>
              <div className="col-6 col-sm-4">
                <div className="d-flex align-items-center small">
                  <span className="text-muted me-2">Spice:</span>
                  {getSpiceLevelIcon(prediction.food.spiceLevel)}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h6 className="fw-bold text-dark mb-2">Main Ingredients:</h6>
              <div className="d-flex flex-wrap gap-2">
                {prediction.food.ingredients.slice(0, 6).map((ingredient, i) => (
                  <span key={i} className="badge bg-light text-dark border fw-normal px-3 py-2 rounded-pill">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            <div className="card bg-white border border-light shadow-sm rounded-4">
              <div className="card-body py-3">
                <h6 className="fw-bold mb-3 small text-uppercase text-secondary">Nutrition (per serving)</h6>
                <div className="row text-center g-2">
                  <div className="col-3 col-md-3 border-end">
                    <div className="fw-bold h5 mb-0 text-primary">{prediction.food.nutritionalInfo.calories}</div>
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>KCAL</small>
                  </div>
                  <div className="col-3 col-md-3 border-end">
                    <div className="fw-bold h5 mb-0 text-primary">{prediction.food.nutritionalInfo.protein}g</div>
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>PROT</small>
                  </div>
                  <div className="col-3 col-md-3 border-end">
                    <div className="fw-bold h5 mb-0 text-primary">{prediction.food.nutritionalInfo.carbs}g</div>
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>CARB</small>
                  </div>
                  <div className="col-3 col-md-3">
                    <div className="fw-bold h5 mb-0 text-primary">{prediction.food.nutritionalInfo.fat}g</div>
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>FAT</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="alert alert-primary d-flex align-items-center" role="alert">
        <Trophy className="me-3 text-primary" size={24} />
        <div>
          <div className="fw-bold">Pro Tip:</div>
          <span className="small">Take photos from a slight angle above the dish for best recognition accuracy!</span>
        </div>
      </div>
    </div>
  );
};