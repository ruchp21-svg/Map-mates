import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { subscribeToTrips } from '../firebaseUtils';
import './HostProfile.css';

function HostProfile({ currentUser }) {
  const { hostId } = useParams();
  const navigate = useNavigate();
  const [host, setHost] = useState(null);
  const [hostTrips, setHostTrips] = useState([]);
  const [hostReviews, setHostReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const loadHostData = async () => {
      try {
        let hostUser = null;
        
        // Try to get host from Firebase users collection first
        try {
          const userDoc = await getDoc(doc(db, 'users', hostId));
          if (userDoc.exists()) {
            hostUser = { id: userDoc.id, ...userDoc.data() };
          }
        } catch (err) {
          console.log('Could not fetch from Firebase users:', err);
        }
        
        // If not found in Firebase, try localStorage
        if (!hostUser) {
          const users = JSON.parse(localStorage.getItem('users')) || [];
          hostUser = users.find(u => u.id === hostId);
        }
        
        // If still not found, get host info from trips
        if (!hostUser) {
          const unsubscribe = subscribeToTrips((firebaseTrips) => {
            const hostTrip = firebaseTrips.find(trip => trip.hostId === hostId);
            if (hostTrip && !host) {
              setHost({
                id: hostId,
                username: hostTrip.hostName || 'Trip Host',
                bio: 'This host has created trips on MapMates.',
                profileImage: null
              });
            }
            const trips = firebaseTrips.filter(trip => trip.hostId === hostId);
            setHostTrips(trips);
          });
          
          // Set a basic profile while we wait
          setHost({
            id: hostId,
            username: 'Loading...',
            bio: 'Loading host information...',
            profileImage: null
          });
          
          return () => unsubscribe && unsubscribe();
        } else {
          setHost(hostUser);
        }

        // Load host's trips
        const unsubscribe = subscribeToTrips((firebaseTrips) => {
          const trips = firebaseTrips.filter(trip => trip.hostId === hostId);
          setHostTrips(trips);
          
          // If we still don't have a proper username, get it from trips
          if (host?.username === 'Loading...' || !host?.username) {
            const hostTrip = trips[0];
            if (hostTrip?.hostName) {
              setHost(prev => ({
                ...prev,
                username: hostTrip.hostName,
                bio: 'This host has created trips on MapMates.'
              }));
            }
          }
        });

        // Load host reviews from Firebase
        try {
          const reviewsQuery = query(
            collection(db, 'reviews'),
            where('hostId', '==', hostId)
          );
          const querySnapshot = await getDocs(reviewsQuery);
          const reviews = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => b.timestamp - a.timestamp);
          setHostReviews(reviews);
          
          // Calculate average rating
          if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
            setAverageRating((totalRating / reviews.length).toFixed(1));
          }
        } catch (err) {
          console.log('Error fetching reviews:', err);
          // Try localStorage as fallback
          const tripReviews = JSON.parse(localStorage.getItem('tripReviews')) || {};
          const allReviews = Object.values(tripReviews).flat();
          const hostReviewsLocal = allReviews.filter(r => r.hostId === hostId);
          setHostReviews(hostReviewsLocal);
          
          if (hostReviewsLocal.length > 0) {
            const totalRating = hostReviewsLocal.reduce((sum, r) => sum + (r.rating || 0), 0);
            setAverageRating((totalRating / hostReviewsLocal.length).toFixed(1));
          }
        }

        setLoading(false);
        return () => unsubscribe && unsubscribe();
      } catch (err) {
        console.error('Error loading host data:', err);
        setLoading(false);
      }
    };

    loadHostData();
  }, [hostId, currentUser, navigate]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : 'empty'}`}>
          {i <= rating ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="host-profile-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading host profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="host-profile-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      {/* Host Header */}
      <div className="host-header">
        <div className="host-avatar-section">
          {host?.profileImage ? (
            <img src={host.profileImage} alt={host.username} className="host-avatar-large" />
          ) : (
            <div className="host-avatar-placeholder-large">
              {host?.username?.charAt(0).toUpperCase() || 'H'}
            </div>
          )}
        </div>
        <div className="host-info-section">
          <h1 className="host-name">{host?.username || 'Unknown Host'}</h1>
          {host?.gender && <p className="host-gender">Gender: {host.gender}</p>}
          <p className="host-bio">{host?.bio || 'No bio available'}</p>
          
          <div className="host-stats">
            <div className="stat-item">
              <span className="stat-value">{hostTrips.length}</span>
              <span className="stat-label">Trips Hosted</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{averageRating || 'N/A'}</span>
              <span className="stat-label">Avg Rating</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{hostReviews.length}</span>
              <span className="stat-label">Reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Host's Trips */}
      <div className="host-trips-section">
        <h2>Trips by {host?.username}</h2>
        {hostTrips.length === 0 ? (
          <p className="no-items">No trips hosted yet.</p>
        ) : (
          <div className="trips-grid">
            {hostTrips.map(trip => {
              const tripDate = new Date(trip.date);
              const isPast = tripDate < new Date();
              const participantCount = trip.participants?.length || 0;
              
              return (
                <div key={trip.id} className="trip-card-mini">
                  {trip.image && (
                    <div 
                      className="trip-image-mini"
                      style={{ backgroundImage: `url('${trip.image}')` }}
                    />
                  )}
                  <div className="trip-content-mini">
                    <span className={`trip-status ${isPast ? 'past' : 'upcoming'}`}>
                      {isPast ? 'Completed' : 'Upcoming'}
                    </span>
                    <h3>{trip.title}</h3>
                    <p className="trip-location-mini">📍 {trip.location}</p>
                    <p className="trip-date-mini">📅 {tripDate.toLocaleDateString()}</p>
                    <p className="trip-participants-mini">👥 {participantCount} participants</p>
                    <Link to={`/trip-review/${trip.id}`} className="view-trip-btn">
                      View Trip
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Host Reviews */}
      <div className="host-reviews-section">
        <h2>Reviews ({hostReviews.length})</h2>
        {hostReviews.length === 0 ? (
          <p className="no-items">No reviews yet.</p>
        ) : (
          <div className="reviews-list">
            {hostReviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    {review.reviewerAvatar ? (
                      <img src={review.reviewerAvatar} alt={review.reviewerName} className="reviewer-avatar" />
                    ) : (
                      <div className="reviewer-avatar-placeholder">
                        {review.reviewerName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div>
                      <p className="reviewer-name">{review.reviewerName || 'Anonymous'}</p>
                      <p className="review-date">
                        {new Date(review.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>
                {review.title && <h4 className="review-title">{review.title}</h4>}
                <p className="review-comment">{review.comment}</p>
                {review.tripTitle && (
                  <p className="review-trip">Trip: {review.tripTitle}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HostProfile;
