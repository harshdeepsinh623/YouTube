import React from 'react'
import './Video.css'
import PlayVideo from '../../Components/playVideo/playVideo'
import Recommended from '../../Components/Recommended/Recommended'
import { useParams } from 'react-router-dom'

const Video = () => {

  const { videoId, categoryId } = useParams();

  return (
    <div className='play-container'>      <PlayVideo videoId={videoId} />
      <Recommended videoId={videoId} />
    </div>
  )
}

export default Video