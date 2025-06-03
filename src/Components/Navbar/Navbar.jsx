import React, { useState, useEffect, useRef } from 'react'
import './Navbar.css'
import menu_icon from '../../assets/menu.png'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search.png'
import upload_icon from '../../assets/upload.png'
import more_icon from '../../assets/more.png'
import notification_icon from '../../assets/notification.png'
import profile_icon from '../../assets/user_profile.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { API_KEY } from '../../data'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = ({setSidebar}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.trim() === '') {
                setSuggestions([]);
                return;
            }

            try {
                const response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${searchQuery}&type=channel&key=${API_KEY}`);
                const data = await response.json();
                if (data.items) {
                    setSuggestions(data.items);
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchSuggestions();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleProfileClick = () => {
        if (currentUser) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    };

    return (
        <nav className="flex-div">
            <div className="nav-left flex-div">
                <button className="menu-button" onClick={()=>setSidebar(prev=>!prev)}>
                    <img src={menu_icon} alt="Menu" />
                </button>
                <Link to="/">
                    <img src={logo} alt="Logo" className="logo" />
                </Link>
            </div>

            <div className="nav-middle flex-div" ref={searchRef}>
                <div className="search-box flex-div">
                    <input 
                        type="text" 
                        placeholder="Search" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                    />
                    <button><img src={search_icon} alt="Search" /></button>
                </div>
                {showSuggestions && suggestions.length > 0 && (
                    <div className="search-suggestions">
                        {suggestions.map((item) => (
                            <div 
                                key={item.id.channelId} 
                                className="suggestion-item flex-div"
                                onClick={() => {
                                    navigate(`/channel/${item.id.channelId}`);
                                    setShowSuggestions(false);
                                    setSearchQuery('');
                                }}
                            >
                                <img 
                                    src={item.snippet.thumbnails.default.url} 
                                    alt={item.snippet.title} 
                                />
                                <span>{item.snippet.title}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="nav-right flex-div">
                <div className="user-icon" onClick={handleProfileClick}>
                    {currentUser && currentUser.photoURL ? (
                        <img 
                            src={currentUser.photoURL} 
                            alt="User" 
                            className="user-profile"
                        />
                    ) : (
                        <img 
                            src={profile_icon} 
                            alt="User" 
                            className="user-profile"
                        />
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar