import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import './MyTripsMap.css';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '16px'
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629 // India center
};

// Sample coordinates for demo locations
const locationCoordinates = {
  'goa': { lat: 15.2993, lng: 74.1240 },
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'delhi': { lat: 28.6139, lng: 77.2090 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'chennai': { lat: 13.0827, lng: 80.2707 },
  'kolkata': { lat: 22.5726, lng: 88.3639 },
  'hyderabad': { lat: 17.3850, lng: 78.4867 },
  'jaipur': { lat: 26.9124, lng: 75.7873 },
  'kerala': { lat: 10.8505, lng: 76.2711 },
  'manali': { lat: 32.2396, lng: 77.1887 },
  'shimla': { lat: 31.1048, lng: 77.1734 },
  'rishikesh': { lat: 30.0869, lng: 78.2676 },
  'udaipur': { lat: 24.5854, lng: 73.7125 },
  'varanasi': { lat: 25.3176, lng: 82.9739 },
  'agra': { lat: 27.1767, lng: 78.0081 },
  'pune': { lat: 18.5204, lng: 73.8567 },
  'darjeeling': { lat: 27.0410, lng: 88.2663 },
  'ooty': { lat: 11.4102, lng: 76.6950 },
  'andaman': { lat: 11.7401, lng: 92.6586 },
  'ladakh': { lat: 34.1526, lng: 77.5771 },
  'paris': { lat: 48.8566, lng: 2.3522 },
  'london': { lat: 51.5074, lng: -0.1278 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  'tokyo': { lat: 35.6762, lng: 139.6503 },
  'dubai': { lat: 25.2048, lng: 55.2708 },
  'singapore': { lat: 1.3521, lng: 103.8198 },
  'bali': { lat: -8.3405, lng: 115.0920 },
  'thailand': { lat: 15.8700, lng: 100.9925 },
  'maldives': { lat: 3.2028, lng: 73.2207 },
  'switzerland': { lat: 46.8182, lng: 8.2275 }
};

function getCoordinatesFromLocation(location) {
  if (!location) return null;
  
  const loc = location.toLowerCase();
  
  // Check if location matches any known place
  for (const [place, coords] of Object.entries(locationCoordinates)) {
    if (loc.includes(place)) {
      // Add small random offset so markers don't overlap perfectly
      return {
        lat: coords.lat + (Math.random() - 0.5) * 0.02,
        lng: coords.lng + (Math.random() - 0.5) * 0.02
      };
    }
  }
  
  // Return random location in India if not found
  return {
    lat: 20 + Math.random() * 10,
    lng: 75 + Math.random() * 10
  };
}

function MyTripsMap({ currentUser }) {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyAogHSZ0_rCy07a2SUw5nnwfdJ-1Q8RlXA'
  });

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(loc);
          setMapCenter(loc);
        },
        (error) => {
          console.log('Location error:', error);
        }
      );
    }
  }, []);

  // Load joined trips
  useEffect(() => {
    const loadTrips = async () => {
      try {
        // Try to get from Firestore first
        if (currentUser?.uid) {
          const q = query(collection(db, 'trips'));
          const snapshot = await getDocs(q);
          const allTrips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // Filter trips where user is host or participant
          const userTrips = allTrips.filter(trip => 
            trip.hostId === currentUser.uid || 
            (trip.participants && trip.participants.includes(currentUser.uid))
          );
          
          // Add coordinates to each trip
          const tripsWithCoords = userTrips.map(trip => ({
            ...trip,
            coordinates: getCoordinatesFromLocation(trip.location)
          }));
          
          setTrips(tripsWithCoords);
          
          // Center map on first trip if available
          if (tripsWithCoords.length > 0 && tripsWithCoords[0].coordinates) {
            setMapCenter(tripsWithCoords[0].coordinates);
          }
        }
        
        // Also check localStorage
        const storedTrips = JSON.parse(localStorage.getItem('mapmates_trips')) || [];
        const localUserTrips = storedTrips.filter(trip => 
          trip.hostId === currentUser?.uid || 
          (trip.participants && trip.participants.includes(currentUser?.uid || 'demo-user'))
        );
        
        if (localUserTrips.length > 0) {
          const localTripsWithCoords = localUserTrips.map(trip => ({
            ...trip,
            coordinates: getCoordinatesFromLocation(trip.location)
          }));
          
          setTrips(prev => {
            const combined = [...prev];
            localTripsWithCoords.forEach(lt => {
              if (!combined.find(t => t.id === lt.id)) {
                combined.push(lt);
              }
            });
            return combined;
          });
        }
        
      } catch (error) {
        console.error('Error loading trips:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, [currentUser]);

  const onLoad = useCallback((map) => {
    // Fit bounds to show all markers
    if (trips.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      trips.forEach(trip => {
        if (trip.coordinates) {
          bounds.extend(trip.coordinates);
        }
      });
      map.fitBounds(bounds);
    }
  }, [trips]);

  const markerColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

  if (loading) {
    return (
      <div className="my-trips-map-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your trips map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-trips-map-container">
      <div className="map-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="header-content">
          <h1>🗺️ My Trips Map</h1>
          <p className="subtitle">View all your joined trips on one map</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="map-stats">
        <div className="stat-item">
          <span className="stat-icon">📍</span>
          <span className="stat-value">{trips.length}</span>
          <span className="stat-label">Trips</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🌍</span>
          <span className="stat-value">{new Set(trips.map(t => t.location)).size}</span>
          <span className="stat-label">Locations</span>
        </div>
        {userLocation && (
          <div className="stat-item">
            <span className="stat-icon">📡</span>
            <span className="stat-value">Live</span>
            <span className="stat-label">Your Location</span>
          </div>
        )}
      </div>

      {/* Google Map */}
      <div className="map-wrapper">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={5}
            onLoad={onLoad}
            options={{
              mapTypeControl: true,
              streetViewControl: false,
              fullscreenControl: true,
              zoomControl: true,
              styles: [
                {
                  featureType: 'poi',
                  elementType: 'labels',
                  stylers: [{ visibility: 'off' }]
                }
              ]
            }}
          >
            {/* User Location Marker */}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: '#4285F4',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 3
                }}
                title="Your Location"
              />
            )}

            {/* Trip Markers */}
            {trips.map((trip, index) => (
              trip.coordinates && (
                <Marker
                  key={trip.id}
                  position={trip.coordinates}
                  onClick={() => setSelectedTrip(trip)}
                  icon={{
                    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                    fillColor: markerColors[index % markerColors.length],
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                    scale: 2,
                    anchor: new window.google.maps.Point(12, 24)
                  }}
                  animation={window.google.maps.Animation.DROP}
                />
              )
            ))}

            {/* Info Window for Selected Trip */}
            {selectedTrip && selectedTrip.coordinates && (
              <InfoWindow
                position={selectedTrip.coordinates}
                onCloseClick={() => setSelectedTrip(null)}
              >
                <div className="info-window-content">
                  <h3>{selectedTrip.title}</h3>
                  <p className="info-location">📍 {selectedTrip.location}</p>
                  <p className="info-description">{selectedTrip.description}</p>
                  
                  <div className="trip-details-grid">
                    <div className="detail-cell">
                      <span className="label">Host</span>
                      <span className="value">{selectedTrip.hostName}</span>
                    </div>
                    <div className="detail-cell">
                      <span className="label">Date</span>
                      <span className="value">{new Date(selectedTrip.date).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-cell">
                      <span className="label">Time</span>
                      <span className="value">{selectedTrip.time || 'TBD'}</span>
                    </div>
                    <div className="detail-cell">
                      <span className="label">Category</span>
                      <span className="value">{selectedTrip.category || 'Trip'}</span>
                    </div>
                    <div className="detail-cell">
                      <span className="label">Joined</span>
                      <span className="value">{selectedTrip.participants?.length || 0}{selectedTrip.maxCount ? `/${selectedTrip.maxCount}` : ''}</span>
                    </div>
                    <div className="detail-cell">
                      <span className="label">Budget</span>
                      <span className="value">₹{selectedTrip.budget || '-'}</span>
                    </div>
                  </div>
                  
                  <button 
                    className="info-close-btn"
                    onClick={() => setSelectedTrip(null)}
                  >
                    Close
                  </button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div className="map-loading">Loading Google Maps...</div>
        )}
      </div>

      {/* Trip List */}
      <div className="trips-list-section">
        <h2>📋 Your Trips</h2>
        {trips.length === 0 ? (
          <div className="no-trips">
            <p>🌍 You haven't joined any trips yet!</p>
            <button className="explore-btn" onClick={() => navigate('/explore')}>
              Explore Trips
            </button>
          </div>
        ) : (
          <div className="trips-list">
            {trips.map((trip, index) => (
              <div 
                key={trip.id} 
                className="trip-list-item"
                onClick={() => {
                  setSelectedTrip(trip);
                  if (trip.coordinates) {
                    setMapCenter(trip.coordinates);
                  }
                }}
                style={{ borderLeftColor: markerColors[index % markerColors.length] }}
              >
                <div className="trip-marker-indicator" style={{ backgroundColor: markerColors[index % markerColors.length] }}>
                  {index + 1}
                </div>
                <div className="trip-info">
                  <h4>{trip.title}</h4>
                  <p>📍 {trip.location}</p>
                </div>
                <span className="trip-arrow">→</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTripsMap;
