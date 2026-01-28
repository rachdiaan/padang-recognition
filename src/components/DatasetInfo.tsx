import React, { useState } from 'react';
import { Database, Utensils, MapPin, Clock, Flame, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { padangFoodDataset } from '../data/padangFoodDataset';

export const DatasetInfo: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const categories = [...new Set(padangFoodDataset.map(food => food.category))];
  // Total unique ingredients across all dishes
  const regions = [...new Set(padangFoodDataset.map(food => food.region))];
  const spiceLevels = [...new Set(padangFoodDataset.map(food => food.spiceLevel))];

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="d-flex flex-column gap-5">
      {/* Dataset Overview */}
      <div className="card-premium overflow-hidden">
        <div className="card-header bg-success text-white p-5 border-0">
          <h1 className="display-5 fw-bold mb-2">🗄️ Dataset Information</h1>
          <p className="lead mb-0 opacity-75">Comprehensive Padang Food Recognition Database</p>
        </div>

        <div className="card-body p-5">
          <div className="row g-4 mb-4">
            <div className="col-md-3 col-6">
              <div className="p-4 bg-light rounded-4 text-center border h-100">
                <Database className="mx-auto text-success mb-3" size={32} />
                <div className="h2 fw-bold">{padangFoodDataset.length}</div>
                <div className="small text-secondary fw-bold">Food Items</div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="p-4 bg-light rounded-4 text-center border h-100">
                <Utensils className="mx-auto text-warning mb-3" size={32} />
                <div className="h2 fw-bold">{categories.length}</div>
                <div className="small text-secondary fw-bold">Categories</div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="p-4 bg-light rounded-4 text-center border h-100">
                <MapPin className="mx-auto text-primary mb-3" size={32} />
                <div className="h2 fw-bold text-dark">{regions.length}</div>
                <div className="small text-muted fw-bold">Regions</div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="p-4 bg-light rounded-4 text-center border h-100">
                <Flame className="mx-auto text-danger mb-3" size={32} />
                <div className="h2 fw-bold text-dark">{spiceLevels.length}</div>
                <div className="small text-muted fw-bold">Spice Levels</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Food Items Grid */}
      <div className="card border-0 shadow-lg">
        <div className="card-body p-5">
          <h2 className="fw-bold mb-4 d-flex align-items-center">
            <Info className="text-primary me-2" size={28} />
            Available Dishes
          </h2>

          <div className="row g-4">
            {padangFoodDataset.map((food) => {
              const isExpanded = expandedItems.has(food.id);

              return (
                <div key={food.id} className="col-lg-6">
                  <div className="card h-100 border-0 shadow-sm hover-shadow transition-all bg-light">
                    <div className="card-body p-4 d-flex gap-4">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="rounded-3 object-cover shadow-sm bg-secondary"
                        style={{ width: '80px', height: '80px' }}
                      />
                      <div className="flex-grow-1 min-w-0">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h5 className="fw-bold mb-1 text-dark">{food.name}</h5>
                            <p className="small text-muted mb-0">{food.nameEn}</p>
                          </div>
                          <button
                            onClick={() => toggleExpanded(food.id)}
                            className="btn btn-sm btn-link text-secondary p-0"
                          >
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                        </div>

                        <div className="d-flex flex-wrap gap-2 mb-3">
                          <span className="badge bg-primary bg-opacity-10 text-primary fw-normal border border-primary border-opacity-25 rounded-pill px-3">
                            {food.category}
                          </span>
                          <span className={`badge rounded-pill fw-normal border px-3 ${food.spiceLevel === 'mild' ? 'bg-success bg-opacity-10 text-success border-success border-opacity-25' :
                            food.spiceLevel === 'medium' ? 'bg-warning bg-opacity-10 text-warning border-warning border-opacity-25' :
                              'bg-danger bg-opacity-10 text-danger border-danger border-opacity-25'
                            }`}>
                            {food.spiceLevel}
                          </span>
                          <span className="badge bg-secondary bg-opacity-10 text-secondary fw-normal border border-secondary border-opacity-25 rounded-pill px-3 d-flex align-items-center">
                            <Clock size={12} className="me-1" />
                            {food.cookingTime}
                          </span>
                        </div>

                        {isExpanded && (
                          <div className="pt-3 border-top mt-3">
                            <p className="small text-secondary mb-3">
                              {food.description}
                            </p>

                            <div className="mb-3">
                              <h6 className="fw-bold fs-7 text-dark mb-2">Ingredients:</h6>
                              <div className="d-flex flex-wrap gap-1">
                                {food.ingredients.map((ingredient) => (
                                  <span
                                    key={ingredient}
                                    className="badge bg-white text-dark border fw-normal"
                                  >
                                    {ingredient}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="row g-2 text-center pt-2">
                              <div className="col-3">
                                <div className="fw-bold text-dark">{food.nutritionalInfo.calories}</div>
                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>CALS</div>
                              </div>
                              <div className="col-3">
                                <div className="fw-bold text-dark">{food.nutritionalInfo.protein}g</div>
                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>PROT</div>
                              </div>
                              <div className="col-3">
                                <div className="fw-bold text-dark">{food.nutritionalInfo.carbs}g</div>
                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>CARBS</div>
                              </div>
                              <div className="col-3">
                                <div className="fw-bold text-dark">{food.nutritionalInfo.fat}g</div>
                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>FAT</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};