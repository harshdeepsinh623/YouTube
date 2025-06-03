import React, { useState, useEffect, useRef, useCallback } from 'react'
import './Feed.css'
import { Link } from 'react-router-dom'
import { API_KEY, value_converter } from '../../data'
import moment from 'moment/moment'

const Feed = ({category}) => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [nextPageToken, setNextPageToken] = useState('')
    const [hasMore, setHasMore] = useState(true)
    const observer = useRef()
    
    // Function to fetch data with pagination
    const fetchData = async (pageToken = '') => {
        try {
            setLoading(true)
            const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=12&regionCode=US&videoCategoryId=${category}&pageToken=${pageToken}&key=${API_KEY}`;
            const response = await fetch(videoList_url)
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Received non-JSON response");
            }
            
            const result = await response.json()
            
            if (result.items && result.items.length > 0) {
                if (pageToken === '') {
                    // If it's the first page, replace the data
                    setData(result.items)
                } else {
                    // If it's not the first page, append the data
                    setData(prevData => [...prevData, ...result.items])
                }
                
                // Save the next page token if it exists
                if (result.nextPageToken) {
                    setNextPageToken(result.nextPageToken)
                    setHasMore(true)
                } else {
                    setHasMore(false)
                }
            } else {
                setHasMore(false)
            }
        } catch (error) {
            console.error('Error fetching videos:', error)
            setHasMore(false)
        } finally {
            setLoading(false)
        }
    }
    
    // Reset data when category changes
    useEffect(() => {
        setData([])
        setNextPageToken('')
        setHasMore(true)
        fetchData('')
    }, [category])
    
    // Setup intersection observer for infinite scrolling
    const lastVideoElementRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                fetchData(nextPageToken)
            }
        })
        
        if (node) observer.current.observe(node)
    }, [loading, hasMore, nextPageToken])

    // Cleanup observer on unmount
    useEffect(() => {
        return () => {
            if (observer.current) {
                observer.current.disconnect()
            }
        }
    }, [])

    return (
        <div className="feed">
            {data.map((item, index) => {
                // Add ref to the last element for infinite scrolling
                if (data.length === index + 1) {
                    return (
                        <Link 
                            ref={lastVideoElementRef}
                            to={`video/${item.snippet.categoryId}/${item.id}`} 
                            className='card' 
                            key={index}
                        >
                            <img src={item.snippet.thumbnails.medium.url} alt="Thumbnail" />
                            <h2>{item.snippet.title}</h2>
                            <h3>{item.snippet.channelTitle}</h3>
                            <p>{value_converter(item.statistics.viewCount)} views &bull; {moment(item.snippet.publishedAt).fromNow()}</p>
                        </Link>
                    )
                } else {
                    return (
                        <Link 
                            to={`video/${item.snippet.categoryId}/${item.id}`} 
                            className='card' 
                            key={index}
                        >
                            <img src={item.snippet.thumbnails.medium.url} alt="Thumbnail" />
                            <h2>{item.snippet.title}</h2>
                            <h3>{item.snippet.channelTitle}</h3>
                            <p>{value_converter(item.statistics.viewCount)} views &bull; {moment(item.snippet.publishedAt).fromNow()}</p>
                        </Link>
                    )
                }
            })}
            
            {loading && <div className="loading">Loading more videos...</div>}
            {!hasMore && data.length > 0 && <div className="end-message">No more videos to load</div>}
        </div>
    )
}

export default Feed