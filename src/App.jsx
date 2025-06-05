import React, { useState, useEffect } from 'react';
import './App.css';
import { MdLocationPin, MdDelete, MdCheckBox, MdPermContactCalendar, MdEvent, MdPayment } from 'react-icons/md';

const StepIndicator = () => {
  const steps = [
    { name: 'Postcode', icon: MdLocationPin },
    { name: 'Waste Type', icon: MdDelete },
    { name: 'Select Skip', icon: MdCheckBox },
    { name: 'Permit Check', icon: MdPermContactCalendar },
    { name: 'Choose Date', icon: MdEvent },
    { name: 'Payment', icon: MdPayment }
  ];

  return (
    <div className="step-indicator-container">
      {steps.map((step, index) => (
        <div key={step.name} className="step-item">
          <div className={`step-icon ${step.name === 'Select Skip' ? 'active' : index < 2 ? 'completed' : ''}`}>
            <step.icon className="w-6 h-6" />
          </div>
          {index < steps.length - 1 && <div className="step-connector"></div>}
          <span className={`step-label ${step.name === 'Select Skip' ? 'text-teal-400 font-semibold' : index < 2 ? 'text-white' : 'text-gray-500'}`}>
            {step.name}
          </span>
        </div>
      ))}
    </div>
  );
};

const SkipCard = ({ skip, onSelect, isSelected }) => {
  const totalPrice = skip.price_before_vat * (1 + skip.vat / 100);
  const skipImage = '/src/assets/skip.png';

  return (
    <div className={`skip-card ${isSelected ? 'selected' : ''}`}>
      <div className="skip-image-container">
        <img src={skipImage} alt={`${skip.size} Yard Skip`} className="skip-image" />
      </div>
      <div className="skip-badge">{skip.size} Yards</div>
      <h3 className="skip-title">{skip.size} Yard Skip</h3>
      <p className="skip-hire-period">{skip.hire_period_days} day hire period</p>
      <p className="skip-price">£{totalPrice.toFixed(0)}</p>
      <div className="skip-tags">
        <span className={`tag ${skip.allowed_on_road ? 'tag-success' : 'tag-error'}`}>
          {skip.allowed_on_road ? 'Road Permit OK' : 'No Road Permit'}
        </span>
        <span className={`tag ${skip.allows_heavy_waste ? 'tag-success' : 'tag-error'}`}>
          {skip.allows_heavy_waste ? 'Heavy Waste OK' : 'No Heavy Waste'}
        </span>
      </div>
      <button
        className={`skip-button ${isSelected ? 'selected-button' : ''}`}
        onClick={() => onSelect(skip)}
      >
        {isSelected ? 'Selected' : 'Select This Skip'}
      </button>
    </div>
  );
};

const SelectionMessage = ({ skip }) => {
  if (!skip) return null;
  const totalPrice = skip.price_before_vat * (1 + skip.vat / 100);
  return (
    <div className="selection-message">
      <div className="message-content">
        <p className="message-disclaimer">
          Imagery and information shown throughout this website may not reflect the exact shape or size specification, colours may vary, options and/or accessories may be featured at additional cost.
        </p>
        <div className="message-details">
          <span className="message-info">{skip.size} Yard Skip £{totalPrice.toFixed(0)} {skip.hire_period_days} day hire</span>
          <div className="message-actions">
            <button className="message-button message-button-secondary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <button className="message-button message-button-primary">
              Continue
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [skips, setSkips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkip, setSelectedSkip] = useState(null);

  useEffect(() => {
    const fetchSkips = async () => {
      try {
        const response = await fetch('https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft');
        if (!response.ok) {
          throw new Error('Failed to fetch skip data');
        }
        const data = await response.json();
        setSkips(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchSkips();
  }, []);

  const handleSelectSkip = (skip) => {
    if (selectedSkip && selectedSkip.id === skip.id) {
      setSelectedSkip(null);
    } else {
      setSelectedSkip(skip);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="app-container">
      <div className="main-content">
        <StepIndicator />
        <div className="header-container">
          <div className="header">
            <h1 className="page-title">Select Your Skip Size</h1>
            <p className="page-subtitle">Choose the perfect skip for your waste management needs</p>
          </div>
        </div>
        <div className="skip-grid">
          {skips.map(skip => (
            <SkipCard
              key={skip.id}
              skip={skip}
              onSelect={handleSelectSkip}
              isSelected={selectedSkip && selectedSkip.id === skip.id}
            />
          ))}
        </div>
      </div>
      <SelectionMessage skip={selectedSkip} />
    </div>
  );
};

export default App;