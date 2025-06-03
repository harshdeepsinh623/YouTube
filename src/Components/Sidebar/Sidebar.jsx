import React, { useState, useEffect } from 'react'
import './Sidebar.css'
import homeIcon from '../../assets/home.png'
import game_icon from '../../assets/game_icon.png'
import automobile from '../../assets/automobiles.png'
import sports from '../../assets/sports.png'
import entainment from '../../assets/entertainment.png'
import tech from '../../assets/tech.png'
import music from '../../assets/music.png'
import blog from '../../assets/blogs.png'
import news from '../../assets/news.png'
import user_profile from '../../assets/user_profile.jpg'

const Sidebar = ({sidebar, category, setCategory}) => { 
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(() => {
        // Load subscriptions from localStorage
        const loadSubscriptions = () => {
            const savedSubscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
            setSubscriptions(savedSubscriptions);
        };

        loadSubscriptions();
        // Listen for storage changes
        window.addEventListener('storage', loadSubscriptions);
        
        return () => {
            window.removeEventListener('storage', loadSubscriptions);
        };
    }, []);
  return (
    <div className={`sidebar ${sidebar ? "" : "small-sidebar"}`}>
        <div className="shortcut-links">
          <div className={`side-links ${category===0?"active":""}`} onClick={() => setCategory(0)}>
            <img src={homeIcon} alt="Home" /><p>Home</p>
          </div>
          <div className={`side-links ${category===20?"active":""}`} onClick={() => setCategory(20)}>
            <img src={game_icon} alt="Games" /><p>Gaming</p>
          </div>
          <div className={`side-links ${category===2?"active":""}`} onClick={() => setCategory(2)}>
            <img src={automobile} alt="Automobile" /><p>Automobiles</p>
          </div>
          <div className={`side-links ${category===17?"active":""}`} onClick={() => setCategory(17)}>
            <img src={sports} alt="Sports" /><p>Sports</p>
          </div>
          <div className={`side-links ${category===24?"active":""}`} onClick={() => setCategory(24)}>
            <img src={entainment} alt="Entertainment" /><p>Entertainment</p>
          </div>
          <div className={`side-links ${category===28?"active":""}`} onClick={() => setCategory(28)}>
            <img src={tech} alt="Tech" /><p>Technology</p>
          </div>
          <div className={`side-links ${category===10?"active":""}`} onClick={() => setCategory(10)}>
            <img src={music} alt="Music" /><p>Music</p>
          </div>
          <div className={`side-links ${category===22?"active":""}`} onClick={() => setCategory(22)}>
            <img src={blog} alt="Blog" /><p>Blog</p>
          </div>
          <div className={`side-links ${category===25?"active":""}`} onClick={() => setCategory(25)}>
            <img src={news} alt="News" /><p>News</p>
          </div>
          <hr />
        </div>        <div className="subscribed-list">
          <h3>Subscribed Channels</h3>
          {subscriptions.length > 0 ? (
            subscriptions.map((channel, index) => (
              <div className="side-links" key={channel.id}>
                <img 
                  src={channel.thumbnail || user_profile} 
                  alt={channel.title}
                />
                <p>{channel.title}</p>
              </div>
            ))
          ) : (
            <p className="no-subs">No subscriptions yet</p>
          )}
        </div>
      </div>
  )
}

export default Sidebar