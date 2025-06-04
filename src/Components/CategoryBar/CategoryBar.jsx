import React from 'react';
import './CategoryBar.css';
import homeIcon from '../../assets/home.png';
import game_icon from '../../assets/game_icon.png';
import automobile from '../../assets/automobiles.png';
import sports from '../../assets/sports.png';
import entainment from '../../assets/entertainment.png';
import tech from '../../assets/tech.png';
import music from '../../assets/music.png';
import blog from '../../assets/blogs.png';
import news from '../../assets/news.png';

const CategoryBar = ({ category, setCategory }) => {
  return (
    <div className="category-bar">
      <div className="category-container">
        <div 
          className={`category-item ${category === 0 ? "active" : ""}`} 
          onClick={() => setCategory(0)}
        >
          <img src={homeIcon} alt="Home" />
          <p>Home</p>
        </div>
        <div 
          className={`category-item ${category === 20 ? "active" : ""}`} 
          onClick={() => setCategory(20)}
        >
          <img src={game_icon} alt="Games" />
          <p>Gaming</p>
        </div>
        <div 
          className={`category-item ${category === 2 ? "active" : ""}`} 
          onClick={() => setCategory(2)}
        >
          <img src={automobile} alt="Automobile" />
          <p>Automobiles</p>
        </div>
        <div 
          className={`category-item ${category === 17 ? "active" : ""}`} 
          onClick={() => setCategory(17)}
        >
          <img src={sports} alt="Sports" />
          <p>Sports</p>
        </div>
        <div 
          className={`category-item ${category === 24 ? "active" : ""}`} 
          onClick={() => setCategory(24)}
        >
          <img src={entainment} alt="Entertainment" />
          <p>Entertainment</p>
        </div>
        <div 
          className={`category-item ${category === 28 ? "active" : ""}`} 
          onClick={() => setCategory(28)}
        >
          <img src={tech} alt="Tech" />
          <p>Technology</p>
        </div>
        <div 
          className={`category-item ${category === 10 ? "active" : ""}`} 
          onClick={() => setCategory(10)}
        >
          <img src={music} alt="Music" />
          <p>Music</p>
        </div>
        <div 
          className={`category-item ${category === 22 ? "active" : ""}`} 
          onClick={() => setCategory(22)}
        >
          <img src={blog} alt="Blog" />
          <p>Blog</p>
        </div>
        <div 
          className={`category-item ${category === 25 ? "active" : ""}`} 
          onClick={() => setCategory(25)}
        >
          <img src={news} alt="News" />
          <p>News</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;