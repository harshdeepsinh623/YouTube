import React, { useState, useEffect } from 'react'
import './playVideo.css'
import { useNavigate } from 'react-router-dom';
import video1 from '../../assets/video.mp4'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import jack from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'
import { API_KEY, value_converter } from '../../data'
import moment from 'moment'
import { useAuth } from '../../contexts/AuthContext'

const PlayVideo = ({videoId}) => {
    const navigate = useNavigate();
    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentsData, setCommentsData] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false); // Add this state for dislike button
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const { currentUser } = useAuth(); // Add this to get current user
    const [showChannelInfo, setShowChannelInfo] = useState(true);
    
    const handleLike = () => {
        if (!currentUser) {
            // Show notification to sign in
            const notification = document.createElement('div');
            notification.className = 'subscription-notification';
            notification.textContent = 'Please sign in to like videos';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
            return;
        }

        if (isDisliked) {
            setIsDisliked(false);
        }

        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        
        if (newLikedState) {
            setLikeCount(prev => prev + 1);
            // Save to liked videos in localStorage
            const likedVideos = JSON.parse(localStorage.getItem(`likedVideos_${currentUser.uid}`) || '[]');
            
            // Check if video is already in liked videos
            if (!likedVideos.some(video => video.id === videoId)) {
                const newLikedVideo = {
                    id: videoId,
                    title: apiData?.snippet?.title,
                    thumbnail: apiData?.snippet?.thumbnails?.medium?.url,
                    channelTitle: apiData?.snippet?.channelTitle,
                    categoryId: apiData?.snippet?.categoryId || '0'
                };
                likedVideos.push(newLikedVideo);
                localStorage.setItem(`likedVideos_${currentUser.uid}`, JSON.stringify(likedVideos));
                
                // Show notification
                const notification = document.createElement('div');
                notification.className = 'subscription-notification';
                notification.textContent = 'Video added to liked videos';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 3000);
            }
        } else {
            setLikeCount(prev => prev - 1);
            // Remove from liked videos in localStorage
            const likedVideos = JSON.parse(localStorage.getItem(`likedVideos_${currentUser.uid}`) || '[]');
            const updatedLikedVideos = likedVideos.filter(video => video.id !== videoId);
            localStorage.setItem(`likedVideos_${currentUser.uid}`, JSON.stringify(updatedLikedVideos));
        }
    };

    const handleDislike = () => {
        if (!currentUser) {
            // Show notification to sign in
            const notification = document.createElement('div');
            notification.className = 'subscription-notification';
            notification.textContent = 'Please sign in to dislike videos';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
            return;
        }

        if (isLiked) {
            setIsLiked(false);
            setLikeCount(prev => prev - 1);
            
            // Remove from liked videos in localStorage
            const likedVideos = JSON.parse(localStorage.getItem(`likedVideos_${currentUser.uid}`) || '[]');
            const updatedLikedVideos = likedVideos.filter(video => video.id !== videoId);
            localStorage.setItem(`likedVideos_${currentUser.uid}`, JSON.stringify(updatedLikedVideos));
        }
        
        setIsDisliked(!isDisliked);
    };    const handleSubscribe = () => {
        setIsSubscribed(!isSubscribed);
        const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
        const channelId = apiData?.snippet?.channelId;
        
        if (!isSubscribed && channelId) {
            const newSubscription = {
                id: channelId,
                title: apiData?.snippet?.channelTitle,
                thumbnail: channelData?.snippet?.thumbnails?.default?.url
            };
            subscriptions.push(newSubscription);
            
            // Show notification
            const notification = document.createElement('div');
            notification.className = 'subscription-notification';
            notification.textContent = `Subscribed to ${newSubscription.title}`;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        } else if (channelId) {
            const index = subscriptions.findIndex(sub => sub.id === channelId);
            if (index !== -1) {
                subscriptions.splice(index, 1);
            }
        }
        
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
        // Dispatch storage event to update sidebar
        window.dispatchEvent(new Event('storage'));
    };    const fetchVideoData = async () => {
        try {
            const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
            const response = await fetch(videoDetails_url);
            const data = await response.json();
            if (data?.items?.length > 0) {
                setApiData(data.items[0]);
            }
        } catch (error) {
            console.error('Error fetching video data:', error);
        }
    }

    const fetchOtherData = async () => {
        try {
            const channelId = apiData?.snippet?.channelId;
            if (!channelId) return;

            const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${API_KEY}`;
            const channelResponse = await fetch(channelData_url);
            const channelData = await channelResponse.json();
            if (channelData?.items?.length > 0) {
                setChannelData(channelData.items[0]);
            }

            const comments_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=500&videoId=${videoId}&key=${API_KEY}`;
            const commentsResponse = await fetch(comments_url);
            const commentsData = await commentsResponse.json();
            if (commentsData?.items) {
                setCommentsData(commentsData.items);
            }
        } catch (error) {
            console.error('Error fetching channel or comments data:', error);
        }
    }    
    useEffect(() => {
        fetchVideoData();
        setIsLiked(false);
        setIsDisliked(false);
        
        // Check if video is already liked
        if (currentUser) {
            const likedVideos = JSON.parse(localStorage.getItem(`likedVideos_${currentUser.uid}`) || '[]');
            const isVideoLiked = likedVideos.some(video => video.id === videoId);
            setIsLiked(isVideoLiked);
        }
        
        // Check if already subscribed
        const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
        const channelId = apiData?.snippet?.channelId;
        if (channelId) {
            setIsSubscribed(subscriptions.some(sub => sub.id === channelId));
        }
    }, [videoId, apiData]);

    useEffect(() => {
        if (apiData?.statistics?.likeCount) {
            setLikeCount(parseInt(apiData.statistics.likeCount));
        }
        
        // Check subscription status when video data loads
        const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
        const channelId = apiData?.snippet?.channelId;
        if (channelId) {
            setIsSubscribed(subscriptions.some(sub => sub.id === channelId));
        }
    }, [apiData]);    useEffect(() => {
        fetchOtherData();
    }, [apiData]);

    useEffect(() => {
        fetchOtherData();
    }, [channelData]);

    const handleChannelClick = () => {
        const channelId = apiData?.snippet?.channelId;
        if (channelId) {
            navigate(`/channel/${channelId}`);
        }
    };

    const toggleChannelInfo = (e) => {
        e.stopPropagation();
        setShowChannelInfo(!showChannelInfo);
    };

  return (
    <div className='play-video'>
        {/* <video src={video1} controls autoPlay muted></video> */}
        <iframe 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
        />        <div className="play-video-info">
            <h1 className="title">{apiData?.snippet?.title || "Title Here"}</h1>
            <div className="stats">
                <p>{apiData?.statistics ? value_converter(apiData.statistics.viewCount) : "16K"} Views</p>
                <p>&bull;</p>
                <p>{apiData?.snippet ? moment(apiData.snippet.publishedAt).fromNow() : ""}</p>
            </div>            <div className="action-buttons">
                <button 
                    className={`action-btn ${isLiked ? 'active' : ''}`} 
                    onClick={handleLike}
                    aria-label={isLiked ? "Unlike video" : "Like video"}
                >
                    <img src={like} alt="" />
                    {value_converter(likeCount)}
                </button>
                <button 
                    className={`action-btn ${isDisliked ? 'active' : ''}`} 
                    onClick={handleDislike}
                    aria-label="Dislike video"
                >
                    <img src={dislike} alt="" />
                </button>
                <button className="action-btn" aria-label="Share video">
                    <img src={share} alt="" />
                    Share
                </button>
                <button className="action-btn" aria-label="Save video">
                    <img src={save} alt="" />
                    Save
                </button>
            </div>
        </div>
        <hr />
        {showChannelInfo ? (
            <div className="publisher">
                {channelData?.snippet?.thumbnails?.default?.url ? (
                    <img 
                        src={channelData.snippet.thumbnails.default.url} 
                        alt="Channel" 
                        onClick={handleChannelClick}
                        style={{ cursor: 'pointer' }}
                    />
                ) : (
                    <img 
                        src={user_profile} 
                        alt="Default Channel" 
                        onClick={handleChannelClick}
                        style={{ cursor: 'pointer' }}
                    />
                )}
                <div onClick={handleChannelClick} style={{ cursor: 'pointer' }}>
                    <p>{apiData?.snippet?.channelTitle || "Channel Name"}</p>
                    <span>{channelData ? value_converter(channelData.statistics?.subscriberCount) : 0} Subscribers</span>
                </div>
                <div className="channel-actions">
                    <button 
                        className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSubscribe();
                        }}
                    >
                        {isSubscribed ? 'Subscribed' : 'Subscribe'}
                    </button>
                    <button 
                        className="toggle-channel-btn"
                        onClick={toggleChannelInfo}
                    >
                        Hide
                    </button>
                </div>
            </div>
        ) : (
            <div className="publisher-collapsed">
                <button 
                    className="toggle-channel-btn"
                    onClick={toggleChannelInfo}
                >
                    Show Channel Info
                </button>
            </div>
        )}
        <div className="vid-description">
           <p>{apiData ? apiData.snippet.description.slice(0, 250) : "Description Here"}</p>            <hr />
            <div className="comment-section">
                <div className="comments-header">
                    <h4>{apiData ? value_converter(apiData.statistics?.commentCount) : 0} Comments</h4>           <div className="comments-sort" role="button" aria-label="Sort comments">
                        <img src={like} alt="" style={{width: '24px', opacity: '0.7'}} />
                        Sort by
                    </div>
                </div>            {commentsData.map((item, index) => {
                    const comment = item.snippet.topLevelComment.snippet;
                    return (
                        <div className="comment" key={index}>
                            <img src={comment.authorProfileImageUrl} alt="" />
                            <div className="comment-right">
                                <h3>
                                    {comment.authorDisplayName}
                                    <span>{moment(comment.publishedAt).fromNow()}</span>
                                </h3>
                                <p>{comment.textDisplay}</p>
                                <div className="comment-action">
                                    <button className="action-item" aria-label={`Like comment. ${value_converter(comment.likeCount)} likes`}>
                                        <img src={like} alt="" />
                                        <span>{value_converter(comment.likeCount)}</span>
                                    </button>
                                    <button className="action-item" aria-label="Dislike comment">
                                        <img src={dislike} alt="" />
                                    </button>
                                    <button className="action-item" aria-label="Reply to comment">
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  )
}

export default PlayVideo