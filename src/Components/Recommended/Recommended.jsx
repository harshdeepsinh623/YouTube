import React, { useState, useEffect, useRef, useCallback } from 'react'
import './Recommended.css'
import { API_KEY, value_converter } from '../../data'
import { Link } from 'react-router-dom'

const Recommended = ({videoId}) => {

     const [apiData, setApiData] = useState([]);
     const [videoStats, setVideoStats] = useState({});
     const [loading, setLoading] = useState(true);
     const [nextPageToken, setNextPageToken] = useState('');
     const [hasMore, setHasMore] = useState(true);
     const observer = useRef();

    const fetchData = async (pageToken = '') => {
        try {
            setLoading(true);
            // First get the video details to get its title and tags
            const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`;
            const videoResponse = await fetch(videoDetails_url);
            const videoData = await videoResponse.json();
            
            if (videoData.items && videoData.items[0]?.snippet) {
                const videoSnippet = videoData.items[0].snippet;
                // Use video title and tags for search query
                const searchQuery = `${videoSnippet.title} ${(videoSnippet.tags || []).join(' ')}`;
                
                // Search for related videos with pagination
                const searchUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&type=video&q=${encodeURIComponent(searchQuery)}&pageToken=${pageToken}&key=${API_KEY}`;
                const searchResponse = await fetch(searchUrl);
                const searchData = await searchResponse.json();
                
                if (searchData.items) {
                    // Filter out the current video
                    const filteredItems = searchData.items.filter(item => item.id.videoId !== videoId);
                    
                    if (pageToken === '') {
                        setApiData(filteredItems);
                    } else {
                        setApiData(prevData => [...prevData, ...filteredItems]);
                    }
                    
                    // Get video statistics for each recommended video
                    const videoIds = filteredItems.map(item => item.id.videoId).join(',');
                    if (videoIds) {
                        const statsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${API_KEY}`;
                        const statsResponse = await fetch(statsUrl);
                        const statsData = await statsResponse.json();
                        
                        if (statsData.items) {
                            const statsMap = {...videoStats};
                            statsData.items.forEach(item => {
                                statsMap[item.id] = item.statistics;
                            });
                            setVideoStats(statsMap);
                        }
                    }
                    
                    // Handle pagination
                    if (searchData.nextPageToken) {
                        setNextPageToken(searchData.nextPageToken);
                        setHasMore(true);
                    } else {
                        setHasMore(false);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching recommended videos:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (videoId) {
            setApiData([]);
            setVideoStats({});
            setNextPageToken('');
            setHasMore(true);
            fetchData('');
        }
    }, [videoId])
    
    // Setup intersection observer for infinite scrolling
    const lastVideoElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                fetchData(nextPageToken);
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loading, hasMore, nextPageToken]);  

  return (
    <div className='recommended'>
        {apiData.map((item, index) => {
            // Add ref to the last element for infinite scrolling
            if (apiData.length === index + 1) {
                return (
                    <Link 
                        ref={lastVideoElementRef}
                        to={`/video/${item.snippet.categoryId || 0}/${item.id.videoId}`} 
                        className="side-video-list" 
                        key={index}
                    >
                        <img src={item.snippet.thumbnails?.medium?.url || ''} alt="" />
                        <div className="vid-info">
                            <h4>{item.snippet.title}</h4>
                            <p>{item.snippet.channelTitle}</p>
                            <p>{value_converter(videoStats[item.id.videoId]?.viewCount || 0)} Views</p>
                        </div>
                    </Link>
                );
            } else {
                return (
                    <Link
                        to={`/video/${item.snippet.categoryId || 0}/${item.id.videoId}`}
                        className="side-video-list" 
                        key={index}
                    >
                        <img src={item.snippet.thumbnails?.medium?.url || ''} alt="" />
                        <div className="vid-info">
                            <h4>{item.snippet.title}</h4>
                            <p>{item.snippet.channelTitle}</p>
                            <p>{value_converter(videoStats[item.id.videoId]?.viewCount || 0)} Views</p>
                        </div>
                    </Link>
                );
            }
        })}
        
        {loading && <div className="loading">Loading more videos...</div>}
        {!hasMore && apiData.length > 0 && <div className="end-message">No more videos to load</div>}
    </div>
  )
}

export default Recommended