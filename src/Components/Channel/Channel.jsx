import React, { useState, useEffect } from 'react';
import './Channel.css';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';

const Channel = ({ channelId }) => {
    const [channelData, setChannelData] = useState(null);
    const [channelVideos, setChannelVideos] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const fetchChannelData = async () => {
            const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${API_KEY}`;
            const response = await fetch(channelData_url);
            const data = await response.json();
            setChannelData(data.items[0]);

            // Check subscription status
            const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
            setIsSubscribed(subscriptions.some(sub => sub.id === channelId));

            // Fetch channel videos
            const channelVideos_url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=25&order=date&type=video&key=${API_KEY}`;
            const videosResponse = await fetch(channelVideos_url);
            const videosData = await videosResponse.json();
            setChannelVideos(videosData.items);
        };

        if (channelId) {
            fetchChannelData();
        }
    }, [channelId]);

    const handleSubscribe = () => {
        setIsSubscribed(!isSubscribed);
        const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
        
        if (!isSubscribed && channelData) {
            const newSubscription = {
                id: channelId,
                title: channelData.snippet.title,
                thumbnail: channelData.snippet.thumbnails.default.url
            };
            subscriptions.push(newSubscription);
            
            // Show notification
            const notification = document.createElement('div');
            notification.className = 'subscription-notification';
            notification.textContent = `Subscribed to ${newSubscription.title}`;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        } else {
            const index = subscriptions.findIndex(sub => sub.id === channelId);
            if (index !== -1) {
                subscriptions.splice(index, 1);
            }
        }
        
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
        window.dispatchEvent(new Event('storage'));
    };

    if (!channelData) return <div>Loading...</div>;

    return (
        <div className="channel-container">
            <div className="channel-header">
                <div className="channel-info">
                    <img 
                        src={channelData.snippet.thumbnails.medium.url} 
                        alt={channelData.snippet.title} 
                        className="channel-avatar"
                    />
                    <div className="channel-details">
                        <h1>{channelData.snippet.title}</h1>
                        <p>{value_converter(channelData.statistics.subscriberCount)} subscribers</p>
                        <p>{value_converter(channelData.statistics.videoCount)} videos</p>
                        <p className="channel-description">{channelData.snippet.description}</p>
                    </div>
                </div>
                <button 
                    className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
                    onClick={handleSubscribe}
                >
                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
            </div>

            <div className="channel-videos">
                <h2>Latest Videos</h2>
                <div className="videos-grid">
                    {channelVideos.map((video) => (
                        <div 
                            key={video.id.videoId} 
                            className="video-card"
                            onClick={() => window.location.href = `/video/${video.id.videoId}`}
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

export default Channel;
