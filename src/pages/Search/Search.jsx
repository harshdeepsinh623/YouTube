import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';
import './Search.css';

const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    const channelId = searchParams.get('channelId');
    
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [channelDetails, setChannelDetails] = useState(null);
    const [channelVideos, setChannelVideos] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showChannelSection, setShowChannelSection] = useState(true);

    useEffect(() => {
        if (query) {
            if (channelId) {
                // If channelId is provided (from suggestion click), fetch channel directly
                fetchChannelDetails(channelId);
                fetchSearchResults();
            } else {
                // Normal search flow
                fetchSearchResults();
            }
        }
    }, [query, channelId]);

    const fetchSearchResults = async () => {
        try {
            setLoading(true);
            const search_url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${query}&type=video,channel&key=${API_KEY}`;
            const response = await fetch(search_url);
            const data = await response.json();
            
            if (data.items) {
                setSearchResults(data.items);
                
                // Check if there are any channel results
                const channelResults = data.items.filter(item => item.id.kind === 'youtube#channel');
                if (channelResults.length > 0) {
                    const channelId = channelResults[0].id.channelId;
                    fetchChannelDetails(channelId);
                }
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchChannelDetails = async (channelId) => {
        try {
            // Fetch channel details
            const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${API_KEY}`;
            const response = await fetch(channelData_url);
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                setChannelDetails(data.items[0]);
                
                // Check subscription status
                const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
                setIsSubscribed(subscriptions.some(sub => sub.id === channelId));
                
                // Fetch channel videos
                fetchChannelVideos(channelId);
            }
        } catch (error) {
            console.error('Error fetching channel details:', error);
        }
    };

    const fetchChannelVideos = async (channelId) => {
        try {
            const channelVideos_url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=15&order=date&type=video&key=${API_KEY}`;
            const response = await fetch(channelVideos_url);
            const data = await response.json();
            
            if (data.items) {
                setChannelVideos(data.items);
            }
        } catch (error) {
            console.error('Error fetching channel videos:', error);
        }
    };

    const handleSubscribe = () => {
        if (!channelDetails) return;
        
        setIsSubscribed(!isSubscribed);
        const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
        
        if (!isSubscribed) {
            const newSubscription = {
                id: channelDetails.id,
                title: channelDetails.snippet.title,
                thumbnail: channelDetails.snippet.thumbnails.default.url
            };
            subscriptions.push(newSubscription);
            
            // Show notification
            const notification = document.createElement('div');
            notification.className = 'subscription-notification';
            notification.textContent = `Subscribed to ${newSubscription.title}`;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        } else {
            const index = subscriptions.findIndex(sub => sub.id === channelDetails.id);
            if (index !== -1) {
                subscriptions.splice(index, 1);
            }
        }
        
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
        window.dispatchEvent(new Event('storage'));
    };

    const handleVideoClick = (videoId) => {
        navigate(`/video/${videoId}`);
    };

    const handleChannelClick = (channelId) => {
        navigate(`/channel/${channelId}`);
    };

    const renderChannelSection = () => {
        if (!channelDetails) return null;
        
        if (!showChannelSection) {
            return (
                <div className="search-channel-collapsed">
                    <button 
                        className="toggle-channel-btn"
                        onClick={() => setShowChannelSection(true)}
                    >
                        Show Channel Information
                    </button>
                </div>
            );
        }
        
        return (
            <div className="search-channel-section">
                <div className="channel-header">
                    <div className="channel-info">
                        <img 
                            src={channelDetails.snippet.thumbnails.medium.url} 
                            alt={channelDetails.snippet.title} 
                            className="channel-avatar"
                            onClick={() => handleChannelClick(channelDetails.id)}
                        />
                        <div className="channel-details">
                            <h1 onClick={() => handleChannelClick(channelDetails.id)}>
                                {channelDetails.snippet.title}
                            </h1>
                            <div className="channel-stats">
                                <p>{value_converter(channelDetails.statistics.subscriberCount)} subscribers</p>
                                <p>{value_converter(channelDetails.statistics.videoCount)} videos</p>
                                <p>{value_converter(channelDetails.statistics.viewCount)} views</p>
                            </div>
                            <p className="channel-description">{channelDetails.snippet.description}</p>
                        </div>
                    </div>
                    <div className="channel-actions">
                        <button 
                            className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
                            onClick={handleSubscribe}
                        >
                            {isSubscribed ? 'Subscribed' : 'Subscribe'}
                        </button>
                        <button 
                            className="toggle-channel-btn"
                            onClick={() => setShowChannelSection(false)}
                        >
                            Hide Channel
                        </button>
                    </div>
                </div>

                <div className="channel-videos">
                    <h2>Latest Videos</h2>
                    <div className="videos-grid">
                        {channelVideos.map((video) => (
                            <div 
                                key={video.id.videoId} 
                                className="video-card"
                                onClick={() => handleVideoClick(video.id.videoId)}
                            >
                                <img 
                                    src={video.snippet.thumbnails.medium.url} 
                                    alt={video.snippet.title} 
                                />
                                <div className="video-info">
                                    <h3>{video.snippet.title}</h3>
                                    <p>{moment(video.snippet.publishedAt).fromNow()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderVideoResults = () => {
        const videoResults = searchResults.filter(item => item.id.kind === 'youtube#video');
        
        if (videoResults.length === 0) {
            return <div className="no-results">No video results found</div>;
        }
        
        return (
            <div className="search-videos">
                {videoResults.map((item) => (
                    <div 
                        key={item.id.videoId} 
                        className="search-video-item"
                        onClick={() => handleVideoClick(item.id.videoId)}
                    >
                        <img 
                            src={item.snippet.thumbnails.medium.url} 
                            alt={item.snippet.title} 
                        />
                        <div className="video-details">
                            <h3>{item.snippet.title}</h3>
                            <p className="channel-name" onClick={(e) => {
                                e.stopPropagation();
                                handleChannelClick(item.snippet.channelId);
                            }}>
                                {item.snippet.channelTitle}
                            </p>
                            <p className="video-description">{item.snippet.description}</p>
                            <p className="video-date">{moment(item.snippet.publishedAt).fromNow()}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="search-container">
            {loading ? (
                <div className="loading">Loading search results...</div>
            ) : (
                <>
                    <div className="search-tabs">
                        <button 
                            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            All
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'channels' ? 'active' : ''}`}
                            onClick={() => setActiveTab('channels')}
                        >
                            Channels
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
                            onClick={() => setActiveTab('videos')}
                        >
                            Videos
                        </button>
                    </div>
                    
                    {activeTab === 'all' && (
                        <>
                            {channelDetails && renderChannelSection()}
                            {renderVideoResults()}
                        </>
                    )}
                    
                    {activeTab === 'channels' && channelDetails && renderChannelSection()}
                    
                    {activeTab === 'videos' && renderVideoResults()}
                </>
            )}
        </div>
    );
};

export default Search;