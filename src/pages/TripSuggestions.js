import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './TripSuggestions.css';
import AIRecommendationEngine from '../utils/aiRecommendationEngine';
import DESTINATION_DATASET from '../utils/destinationDataset';
import { generateEmbedding } from '../utils/embeddingUtils';
import { subscribeToTrips } from '../firebaseUtils';

// Seasonal trip suggestions data
const SEASONAL_TRIPS = {
  Winter: {
    icon: '❄️',
    months: 'December - February',
    color: '#a8d5e5',
    destinations: [
      { name: 'Manali', location: 'Himachal Pradesh, India', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400', reason: 'Snow-capped mountains & skiing', activities: ['Skiing', 'Snow trekking', 'Hot springs'] },
      { name: 'Gulmarg', location: 'Kashmir, India', image: 'https://images.unsplash.com/photo-1579616043990-a9c0c0e63e5f?w=400', reason: 'Best ski resort in Asia', activities: ['Skiing', 'Gondola rides', 'Snow photography'] },
      { name: 'Auli', location: 'Uttarakhand, India', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400', reason: 'Scenic snow trails', activities: ['Skiing', 'Cable car', 'Himalayan views'] },
      { name: 'Shimla', location: 'Himachal Pradesh, India', image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=400', reason: 'Colonial charm in snow', activities: ['Mall Road walk', 'Ice skating', 'Heritage tours'] },
      { name: 'Ladakh', location: 'Jammu & Kashmir, India', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', reason: 'Frozen lakes & monasteries', activities: ['Chadar Trek', 'Monastery visits', 'Stargazing'] }
    ]
  },
  Spring: {
    icon: '🌸',
    months: 'March - May',
    color: '#f8c8dc',
    destinations: [
      { name: 'Valley of Flowers', location: 'Uttarakhand, India', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400', reason: 'Blooming alpine flowers', activities: ['Trekking', 'Photography', 'Nature walks'] },
      { name: 'Srinagar', location: 'Kashmir, India', image: 'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?w=400', reason: 'Tulip gardens & houseboats', activities: ['Tulip festival', 'Shikara rides', 'Mughal gardens'] },
      { name: 'Munnar', location: 'Kerala, India', image: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=400', reason: 'Lush tea plantations', activities: ['Tea tasting', 'Trekking', 'Wildlife spotting'] },
      { name: 'Darjeeling', location: 'West Bengal, India', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400', reason: 'Tea gardens & toy train', activities: ['Tea tours', 'Toy train ride', 'Tiger Hill sunrise'] },
      { name: 'Coorg', location: 'Karnataka, India', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', reason: 'Coffee plantations bloom', activities: ['Coffee tours', 'Waterfall visits', 'Trekking'] }
    ]
  },
  Summer: {
    icon: '☀️',
    months: 'June - August',
    color: '#ffd700',
    destinations: [
      { name: 'Leh-Ladakh', location: 'Jammu & Kashmir, India', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', reason: 'Best time for road trips', activities: ['Bike trips', 'Pangong Lake', 'Monastery hopping'] },
      { name: 'Spiti Valley', location: 'Himachal Pradesh, India', image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=400', reason: 'High altitude desert beauty', activities: ['Road trip', 'Stargazing', 'Key Monastery'] },
      { name: 'Nainital', location: 'Uttarakhand, India', image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=400', reason: 'Escape the heat', activities: ['Boating', 'Cable car', 'Mall Road shopping'] },
      { name: 'Ooty', location: 'Tamil Nadu, India', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400', reason: 'Pleasant hill station weather', activities: ['Botanical gardens', 'Toy train', 'Tea estates'] },
      { name: 'Kashmir', location: 'Jammu & Kashmir, India', image: 'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?w=400', reason: 'Paradise on Earth in summer', activities: ['Houseboat stay', 'Gulmarg meadows', 'Pahalgam'] }
    ]
  },
  Monsoon: {
    icon: '🌧️',
    months: 'July - September',
    color: '#90EE90',
    destinations: [
      { name: 'Cherrapunji', location: 'Meghalaya, India', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400', reason: 'Wettest place on Earth', activities: ['Living root bridges', 'Waterfall visits', 'Caving'] },
      { name: 'Coorg', location: 'Karnataka, India', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', reason: 'Misty coffee estates', activities: ['Monsoon trekking', 'Waterfall rappelling', 'Plantation walks'] },
      { name: 'Udaipur', location: 'Rajasthan, India', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400', reason: 'Lakes fill up beautifully', activities: ['Lake Pichola', 'Palace visits', 'Cultural shows'] },
      { name: 'Lonavala', location: 'Maharashtra, India', image: 'https://images.unsplash.com/photo-1545308175-0e5c3f6a2c4d?w=400', reason: 'Waterfalls & greenery', activities: ['Waterfall trekking', 'Valley views', 'Bhaja caves'] },
      { name: 'Wayanad', location: 'Kerala, India', image: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=400', reason: 'Lush green paradise', activities: ['Wildlife safari', 'Tree house stay', 'Bamboo rafting'] }
    ]
  },
  Autumn: {
    icon: '🍂',
    months: 'October - November',
    color: '#d2691e',
    destinations: [
      { name: 'Rajasthan', location: 'India', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400', reason: 'Perfect weather for forts', activities: ['Desert safari', 'Fort visits', 'Cultural festivals'] },
      { name: 'Goa', location: 'India', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400', reason: 'Beach season begins', activities: ['Beach parties', 'Water sports', 'Nightlife'] },
      { name: 'Rishikesh', location: 'Uttarakhand, India', image: 'https://images.unsplash.com/photo-1545126178-862cdb469409?w=400', reason: 'Adventure sports season', activities: ['River rafting', 'Bungee jumping', 'Yoga retreats'] },
      { name: 'Hampi', location: 'Karnataka, India', image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400', reason: 'Best weather for ruins', activities: ['Temple exploration', 'Boulder climbing', 'Sunset views'] },
      { name: 'Rann of Kutch', location: 'Gujarat, India', image: 'https://images.unsplash.com/photo-1545126178-862cdb469409?w=400', reason: 'Rann Utsav festival', activities: ['White desert views', 'Cultural performances', 'Handicraft shopping'] }
    ]
  }
};

// Get current season
const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'Spring';
  if (month >= 6 && month <= 8) return 'Summer';
  if (month >= 7 && month <= 9) return 'Monsoon';
  if (month >= 10 && month <= 11) return 'Autumn';
  return 'Winter';
};

function TripSuggestions({ currentUser }) {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [aiEngine] = useState(new AIRecommendationEngine(DESTINATION_DATASET));
  const [travelPersona, setTravelPersona] = useState('Explorer');
  const [noResults, setNoResults] = useState(false);
  const [userInsights, setUserInsights] = useState(null);
  const [showAdvancedInsights, setShowAdvancedInsights] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(getCurrentSeason());
  const [showSeasonalSuggestions, setShowSeasonalSuggestions] = useState(true);

  // Extract region from location
  const extractRegion = useCallback((location) => {
    const parts = location.split(',');
    return parts[parts.length - 1]?.trim() || location;
  }, []);

  // Analyze user preferences from their trip history (both created and joined)
  const analyzeUserPreferences = useCallback((allTrips, userId) => {
    // Include both trips the user created AND trips they joined
    const userTrips = allTrips.filter(trip => 
      (trip.createdBy === userId) || (trip.participants && trip.participants.includes(userId))
    );

    const preferences = {
      favoriteCategories: [],
      favoriteRegions: [],
      budgetRange: { min: 0, max: 5000 },
      avgGroupSize: 3,
      preferredDuration: 'medium',
      categories: {},
      locations: {}
    };

    if (userTrips.length > 0) {
      const categoryCount = {};
      const locationCount = {};
      
      userTrips.forEach(trip => {
        if (trip.category) {
          categoryCount[trip.category] = (categoryCount[trip.category] || 0) + 1;
        }
        if (trip.location) {
          const region = extractRegion(trip.location);
          locationCount[region] = (locationCount[region] || 0) + 1;
        }
      });

      preferences.favoriteCategories = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([cat]) => cat);
      
      preferences.favoriteRegions = Object.entries(locationCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([region]) => region);

      preferences.categories = categoryCount;
      preferences.locations = locationCount;

      const avgSize = userTrips.reduce((sum, t) => sum + (t.participants?.length || 1), 0) / userTrips.length;
      preferences.avgGroupSize = Math.round(avgSize) || 3;
    }

    return preferences;
  }, [extractRegion]);

  // Generate AI suggestions using advanced engine
  const generateAISuggestionsWithEngine = useCallback((userProfile, filters, userTrips, engine) => {
    const tripsWithEmbeddings = userTrips.map(trip => ({
      ...trip,
      embedding: generateEmbedding(trip.category + ' ' + trip.location + ' ' + (trip.description || ''))
    }));

    const recs = engine.generateRecommendations(userProfile, filters, tripsWithEmbeddings);
    
    if (recs.length === 0) {
      setNoResults(true);
      setSuggestions([]);
    } else {
      setNoResults(false);
      setSuggestions(recs);
    }

    recs.forEach(rec => {
      engine.trackInteraction(rec.id, 'view');
    });
  }, []);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  useEffect(() => {
    if (!currentUser) {
      return;
    }

    // Subscribe to Firebase trips instead of using localStorage
    const unsubscribe = subscribeToTrips((firebaseTrips) => {
      try {
        const storedTrips = firebaseTrips || [];
        
        const analyzedPreferences = analyzeUserPreferences(storedTrips, currentUser?.id);
        
        const userProfileEmbedding = generateEmbedding(
          (analyzedPreferences.favoriteCategories || []).join(' ') + ' ' +
          (analyzedPreferences.favoriteRegions || []).join(' ')
        );
        
        const enhancedUserProfile = {
          ...analyzedPreferences,
          embedding: userProfileEmbedding,
          id: currentUser?.id
        };
        
        setUserPreferences(enhancedUserProfile);
        
        generateAISuggestionsWithEngine(
          enhancedUserProfile, 
          selectedInterests, 
          storedTrips,
          aiEngine
        );
        
        const persona = aiEngine.generateTravelPersona(enhancedUserProfile, storedTrips);
        setTravelPersona(persona);
        // Generate comprehensive user insights
        const insights = aiEngine.generateUserInsights(enhancedUserProfile, storedTrips);
        setUserInsights(insights);

        // Chat groups and messages are now in Firebase
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading suggestions:', err);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [currentUser, selectedInterests, aiEngine, analyzeUserPreferences, generateAISuggestionsWithEngine]);

  // Handle interest selection
  const handleInterestToggle = (category) => {
    setSelectedInterests(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Get message info for a destination
  const getDestinationMessageInfo = (destination) => {
    // Messages are now in Firebase
    return { count: 0, latestMessage: null, groupId: null };
  };

  if (loading) {
    return (
      <div className="container">
        <h1>🤖 AI Trip Suggestions</h1>
        <div style={{ padding: '40px', textAlign: 'center' }}>Loading AI suggestions...</div>
      </div>
    );
  }

  return (
    <div className="container suggestions-container">
      <div className="suggestions-header">
        <div>
          <h1>🤖 AI Trip Suggestions</h1>
          <p className="header-subtitle">Personalized recommendations based on your travel preferences</p>
          {travelPersona && <p className="travel-persona">Your travel style: <strong>{travelPersona}</strong></p>}
        </div>
      </div>

      {/* NEW: Advanced AI Insights Toggle */}
      {userInsights && (
        <div style={{ marginBottom: '15px' }}>
          <button 
            onClick={() => setShowAdvancedInsights(!showAdvancedInsights)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9em'
            }}
          >
            🧠 {showAdvancedInsights ? 'Hide' : 'Show'} Advanced AI Insights
          </button>
        </div>
      )}

      {/* NEW: Advanced AI Insights Display */}
      {showAdvancedInsights && userInsights && (
        <div className="advanced-insights-section">
          <h2>🧠 Advanced AI Insights</h2>
          <div className="insights-grid">
            {/* Budget Analysis */}
            {userInsights.budgetAnalysis && (
              <div className="insight-card">
                <h3>💰 Budget Pattern</h3>
                <p><strong>Category:</strong> {userInsights.budgetAnalysis.budgetCategory}</p>
                <p><strong>Average Budget:</strong> ₹{userInsights.budgetAnalysis.avgBudget}</p>
                <p><strong>Range:</strong> ₹{userInsights.budgetAnalysis.budgetRange.min} - ₹{userInsights.budgetAnalysis.budgetRange.max}</p>
                <p><strong>Trend:</strong> {userInsights.budgetAnalysis.budgetTrend}</p>
              </div>
            )}

            {/* Seasonal Trends */}
            {userInsights.seasonalTrends && userInsights.seasonalTrends.preferredSeasons.length > 0 && (
              <div className="insight-card">
                <h3>🌤️ Seasonal Preferences</h3>
                <p><strong>Peak Month:</strong> {userInsights.seasonalTrends.peakMonth}</p>
                <p><strong>Preferred Seasons:</strong> {userInsights.seasonalTrends.preferredSeasons.join(', ')}</p>
                <p><strong>Travel Frequency:</strong> {userInsights.seasonalTrends.travelFrequency}</p>
              </div>
            )}

            {/* Travel Frequency */}
            {userInsights.travelFrequency && (
              <div className="insight-card">
                <h3>📅 Travel Frequency</h3>
                <p><strong>Pattern:</strong> {userInsights.travelFrequency.frequency}</p>
                <p><strong>Days Between Trips:</strong> ~{userInsights.travelFrequency.daysAverageBetweenTrips} days</p>
                <p><strong>Trend:</strong> {userInsights.travelFrequency.trend}</p>
              </div>
            )}

            {/* Anomalies */}
            {userInsights.anomalies && userInsights.anomalies.totalAnomalyCount > 0 && (
              <div className="insight-card" style={{ backgroundColor: '#fff3cd' }}>
                <h3>⚠️ Unusual Patterns Detected</h3>
                <p><strong>Count:</strong> {userInsights.anomalies.totalAnomalyCount} anomal{userInsights.anomalies.totalAnomalyCount > 1 ? 'ies' : 'y'}</p>
                {userInsights.anomalies.anomalies.slice(0, 2).map((anomaly, idx) => (
                  <p key={idx} style={{ fontSize: '0.85em', marginTop: '5px' }}>
                    • {anomaly.tripName}: {anomaly.issues[0]?.description}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Preferences Display */}
      {userPreferences && (
        <div className="preferences-section">
          <h2>Your Travel Profile</h2>
          <div className="preferences-grid">
            {userPreferences.favoriteCategories && userPreferences.favoriteCategories.length > 0 && (
              <div className="preference-card">
                <h3>🏷️ Favorite Categories</h3>
                <div className="category-list">
                  {userPreferences.favoriteCategories.map((category) => (
                    <span key={category} className="category-tag">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {userPreferences.favoriteRegions && userPreferences.favoriteRegions.length > 0 && (
              <div className="preference-card">
                <h3>📍 Favorite Regions</h3>
                <div className="region-list">
                  {userPreferences.favoriteRegions.map((region) => (
                    <span key={region} className="region-tag">
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="preference-card">
              <h3>👥 Group Size</h3>
              <p className="preference-value">
                {userPreferences.avgGroupSize > 0 
                  ? `Average: ${userPreferences.avgGroupSize} members`
                  : 'No trips yet - Start exploring!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 🌤️ SEASONAL TRIP SUGGESTIONS */}
      <div className="seasonal-section">
        <div className="seasonal-header">
          <h2>{SEASONAL_TRIPS[selectedSeason].icon} Seasonal Trip Suggestions</h2>
          <button 
            className="toggle-seasonal-btn"
            onClick={() => setShowSeasonalSuggestions(!showSeasonalSuggestions)}
          >
            {showSeasonalSuggestions ? 'Hide' : 'Show'}
          </button>
        </div>
        
        {showSeasonalSuggestions && (
          <>
            {/* Season Selector */}
            <div className="season-tabs">
              {Object.entries(SEASONAL_TRIPS).map(([season, data]) => (
                <button
                  key={season}
                  className={`season-tab ${selectedSeason === season ? 'active' : ''}`}
                  onClick={() => setSelectedSeason(season)}
                  style={{ 
                    borderColor: selectedSeason === season ? data.color : 'transparent',
                    backgroundColor: selectedSeason === season ? `${data.color}20` : 'transparent'
                  }}
                >
                  <span className="season-icon">{data.icon}</span>
                  <span className="season-name">{season}</span>
                  <span className="season-months">{data.months}</span>
                </button>
              ))}
            </div>

            {/* Current Season Badge */}
            <div className="current-season-badge">
              <span>📅 Current Season: <strong>{getCurrentSeason()}</strong></span>
              {selectedSeason === getCurrentSeason() && (
                <span className="best-time-badge">✨ Best time to travel!</span>
              )}
            </div>

            {/* Seasonal Destinations */}
            <div className="seasonal-destinations-grid">
              {SEASONAL_TRIPS[selectedSeason].destinations.map((dest, idx) => (
                <div key={idx} className="seasonal-card">
                  <div 
                    className="seasonal-card-image"
                    style={{ backgroundImage: `url(${dest.image})` }}
                  >
                    <div className="seasonal-card-overlay">
                      <span className="seasonal-rank">#{idx + 1}</span>
                    </div>
                  </div>
                  <div className="seasonal-card-content">
                    <h4>{dest.name}</h4>
                    <p className="seasonal-location">📍 {dest.location}</p>
                    <p className="seasonal-reason">{SEASONAL_TRIPS[selectedSeason].icon} {dest.reason}</p>
                    <div className="seasonal-activities">
                      {dest.activities.map((activity, i) => (
                        <span key={i} className="activity-tag">{activity}</span>
                      ))}
                    </div>
                    <button 
                      className="btn-explore-seasonal"
                      onClick={() => {
                        const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(dest.name + ' ' + dest.location)}`;
                        window.open(mapsUrl, '_blank');
                      }}
                    >
                      🗺️ Explore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Interest Filter */}
      <div className="filter-section">
        <h2>Filter by Interest (Real-time AI Re-ranking)</h2>
        <div className="interest-buttons">
          {['Beach', 'Mountain', 'City', 'Adventure', 'Culture', 'Sports'].map(interest => (
            <button
              key={interest}
              className={`interest-btn ${selectedInterests.includes(interest) ? 'active' : ''}`}
              onClick={() => handleInterestToggle(interest)}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Suggestions Grid */}
      <div className="suggestions-section">
        <h2>
          {suggestions.length > 0 
            ? `🎯 ${suggestions.length} AI-Powered Recommendations`
            : noResults ? '❌ No suggestions found' : '📍 Loading recommendations...'}
        </h2>

        {suggestions.length > 0 ? (
          <div className="suggestions-grid">
            {suggestions.map((destination, index) => (
              <div key={destination.id} className="suggestion-card">
                {/* AI Match Badge */}
                <div className="ai-score-badge">
                  <span className="score-label">AI Match</span>
                  <span className="score-value">{destination.matchPercentage}%</span>
                </div>

                {/* Destination Image */}
                <div 
                  className="suggestion-image"
                  style={{ backgroundImage: `url('${destination.image}')` }}
                >
                  <div className="trip-rank">#{index + 1}</div>
                </div>

                {/* Destination Details */}
                <div className="suggestion-details">
                  <h3>{destination.name}</h3>
                  <p className="trip-category">
                    {destination.categories.join(', ')}
                  </p>
                  <p className="trip-location">📍 {destination.location}</p>
                  
                  <p className="trip-description">{destination.description}</p>

                  {/* AI Scoring Breakdown */}
                  <div className="ai-scores-breakdown">
                    <div className="score-item">
                      <span>Preference Match:</span>
                      <span className="score-num">{destination.aiScores.preferenceMatch.toFixed(1)}/40</span>
                    </div>
                    <div className="score-item">
                      <span>Group Size:</span>
                      <span className="score-num">{destination.aiScores.groupSizeCompatibility.toFixed(1)}/20</span>
                    </div>
                    <div className="score-item">
                      <span>Popularity:</span>
                      <span className="score-num">{destination.aiScores.popularity.toFixed(1)}/20</span>
                    </div>
                    <div className="score-item">
                      <span>Travel Style:</span>
                      <span className="score-num">{destination.aiScores.embeddingSimilarity.toFixed(1)}/20</span>
                    </div>
                    {/* NEW: Advanced ML Scores */}
                    {destination.aiScores.seasonalBoost !== undefined && (
                      <div className="score-item advanced-score">
                        <span>Seasonal Match:</span>
                        <span className="score-num">{destination.aiScores.seasonalBoost.toFixed(1)}</span>
                      </div>
                    )}
                    {destination.aiScores.budgetMatch !== undefined && (
                      <div className="score-item advanced-score">
                        <span>Budget Fit:</span>
                        <span className="score-num">{destination.aiScores.budgetMatch.toFixed(1)}</span>
                      </div>
                    )}
                    {destination.aiScores.sentimentAlignment !== undefined && (
                      <div className="score-item advanced-score">
                        <span>Vibe Match:</span>
                        <span className="score-num">{(destination.aiScores.sentimentAlignment * 10).toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {/* NEW: Engagement Prediction */}
                  {destination.advancedInsights && destination.advancedInsights.engagementPrediction && (
                    <div className="engagement-prediction">
                      <p className="engagement-label">📊 Engagement Likelihood:</p>
                      <p className="engagement-value">{destination.advancedInsights.engagementPrediction.label}</p>
                      <div style={{ fontSize: '0.75em', marginTop: '4px', opacity: 0.9 }}>
                        {destination.advancedInsights.engagementPrediction.factors.slice(0, 2).map((factor, idx) => (
                          <div key={idx}>{factor.factor}: {factor.status}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Why Recommended */}
                  <div className="ai-reasons">
                    <p className="reasons-label">💡 Why recommended:</p>
                    <ul>
                      {destination.explanation.slice(0, 2).map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Trip Info Cards */}
                  <div className="trip-info-cards">
                    <div className="info-card">
                      <span className="info-label">Budget</span>
                      <span className="info-value">₹{destination.estimatedBudget.min}-{destination.estimatedBudget.max}</span>
                    </div>
                    <div className="info-card">
                      <span className="info-label">Best Time</span>
                      <span className="info-value">{destination.bestTimeToVisit}</span>
                    </div>
                    <div className="info-card">
                      <span className="info-label">Duration</span>
                      <span className="info-value">{destination.recommendedTripLength}</span>
                    </div>
                    <div className="info-card">
                      <span className="info-label">Ideal Group</span>
                      <span className="info-value">{destination.idealGroupSize} people</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="highlights">
                    <p className="highlights-label">Highlights:</p>
                    <div className="highlights-tags">
                      {destination.highlights.slice(0, 3).map((highlight, idx) => (
                        <span key={idx} className="highlight-tag">{highlight}</span>
                      ))}
                    </div>
                  </div>

                  {/* Trip Stats */}
                  <div className="trip-stats">
                    <span>⭐ {destination.averageRating}/5</span>
                    <span>•</span>
                    <span>👥 ~{destination.monthlyVisitors.toLocaleString()} visitors/month</span>
                  </div>

                  {/* Messages Preview */}
                  {getDestinationMessageInfo(destination).count > 0 && (
                    <div className="messages-preview">
                      <div className="preview-header">💬 Discussion ({getDestinationMessageInfo(destination).count})</div>
                      {getDestinationMessageInfo(destination).latestMessage && (
                        <div className="preview-message">
                          <strong>{getDestinationMessageInfo(destination).latestMessage.username}:</strong>
                          <p>{getDestinationMessageInfo(destination).latestMessage.message.substring(0, 60)}...</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Navigation Button */}
                  <div className="suggestion-actions">
                    <button 
                      className="btn-navigate"
                      onClick={() => {
                        const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(destination.location)}`;
                        window.open(mapsUrl, '_blank');
                      }}
                    >
                      📍 View Location
                    </button>
                    {(() => {
                      const messageInfo = getDestinationMessageInfo(destination);
                      return (
                        <button 
                          className="btn-chat"
                          onClick={() => {
                            let virtualGroupId = messageInfo.groupId;
                            
                            // If no existing group, create one
                            if (!virtualGroupId) {
                              virtualGroupId = `destination_${destination.id}_${Date.now()}`;
                              const virtualGroup = {
                                id: virtualGroupId,
                                name: `${destination.name} Discussion`,
                                description: `Real-time discussion about ${destination.name}`,
                                destination: destination.name,
                                location: destination.location,
                                category: destination.categories[0],
                                createdBy: currentUser?.id || currentUser?.uid,
                                participants: [currentUser?.id || currentUser?.uid],
                                createdAt: new Date().toISOString(),
                                isVirtualDestinationChat: true
                              };
                              
                              // Virtual groups are now handled in Firebase
                              // No need to store in localStorage anymore
                              console.log('Virtual group created:', virtualGroup);
                            }
                            
                            // Navigate to the group chat with the virtual group info
                            navigate(`/destination-chat/${virtualGroupId}`);
                          }}
                        >
                          💬 Chat {messageInfo.count > 0 ? `(${messageInfo.count})` : ''}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : noResults ? (
          <div className="no-suggestions">
            <div style={{textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px'}}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>🤖</div>
              <h3>No AI suggestions found</h3>
              <p>Try adjusting your filters or explore other categories to get personalized recommendations!</p>
              <button onClick={() => setSelectedInterests([])} style={{marginTop: '16px', padding: '12px 24px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
                Reset Filters
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* AI Info */}
      <div className="ai-info-section">
        <h3>🤖 How AI Suggestions Work</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-icon">📊</span>
            <p>Analyzes your trip history and preferences</p>
          </div>
          <div className="info-item">
            <span className="info-icon">🎯</span>
            <p>Matches similar categories and locations</p>
          </div>
          <div className="info-item">
            <span className="info-icon">👥</span>
            <p>Considers group size compatibility</p>
          </div>
          <div className="info-item">
            <span className="info-icon">⭐</span>
            <p>Scores trips based on popularity</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripSuggestions;
