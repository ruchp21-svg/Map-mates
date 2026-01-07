import React from 'react';
import '../styles/AISuggestions.css';

function CircularProgress({ percentage, size = 60, strokeWidth = 6 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="circular-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="circular-progress-svg">
        <circle
          className="circular-progress-bg"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="circular-progress-bar"
          stroke="#4F46E5"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray,
            strokeDashoffset,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 0.5s ease-in-out'
          }}
        />
      </svg>
      <div className="circular-progress-text">
        <span className="percentage">{percentage}%</span>
      </div>
    </div>
  );
}

function ModernAIComparison({ suggestions }) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="ai-comparison-empty">
        <div className="empty-icon">🤖</div>
        <h3>No AI suggestions available</h3>
        <p>Complete more trips to get personalized recommendations!</p>
      </div>
    );
  }

  return (
    <div className="modern-ai-comparison">
      <div className="comparison-header">
        <h2>🤖 AI-Powered Trip Comparison</h2>
        <p>Smart recommendations based on your travel patterns</p>
      </div>
      <div className="comparison-grid">
        {suggestions.slice(0, 3).map((suggestion, index) => (
          <div key={suggestion.id} className="comparison-card">
            <div className="card-rank">#{index + 1}</div>
            <div className="card-image" style={{ backgroundImage: `url(${suggestion.image})` }}>
              <div className="match-overlay">
                <CircularProgress percentage={suggestion.matchPercentage} size={50} />
              </div>
            </div>
            <div className="card-content">
              <h3 className="destination-name">{suggestion.name}</h3>
              <p className="destination-location">📍 {suggestion.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { CircularProgress, ModernAIComparison };