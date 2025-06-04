import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { currentUser, logOut } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Load subscriptions from localStorage
    const savedSubscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    setSubscriptions(savedSubscriptions);

    // Load liked videos from localStorage
    const savedLikedVideos = JSON.parse(localStorage.getItem(`likedVideos_${currentUser.uid}`) || '[]');
    setLikedVideos(savedLikedVideos);
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <img 
            src={currentUser.photoURL || '/src/assets/user_profile.jpg'} 
            alt="Profile" 
            className="profile-avatar"
          />
          <div className="profile-details">
            <p>{currentUser.email}</p>
            <p>{subscriptions.length} Subscriptions</p>
            <p>{likedVideos.length} Liked Videos</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>Your Subscriptions</h3>
          {subscriptions.length > 0 ? (
            <div className="subscriptions-grid">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="subscription-item" onClick={() => navigate(`/channel/${sub.id}`)}>
                  <img 
                    src={sub.thumbnail || '/src/assets/user_profile.jpg'} 
                    alt={`Channel thumbnail for ${sub.title}`} 
                  />
                  <p>{sub.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">You haven't subscribed to any channels yet.</p>
          )}
        </div>

        <div className="profile-section">

          <h3>Liked Videos</h3>
          {likedVideos.length > 0 ? (
            <div className="liked-videos-grid">
              {likedVideos.map((video) => (
                <div key={video.id} className="video-item" onClick={() => navigate(`/video/${video.categoryId}/${video.id}`)}>
                  <img src={video.thumbnail} alt={`Thumbnail for video: ${video.title}`} />
                  <div className="video-info">
                    <p className="video-title">{video.title}</p>
                    <p className="video-channel">{video.channelTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">You haven't liked any videos yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;