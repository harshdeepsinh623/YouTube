import React, { useState, useEffect, useRef } from 'react'
import './Navbar.css'
import menu_icon from '../../assets/menu.png'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search.png'
import profile_icon from '../../assets/user_profile.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { API_KEY } from '../../data'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = ({setSidebar}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const searchRef = useRef(null);
    const dropdownRef = useRef(null);
    const { currentUser, logOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
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
            setShowDropdown(!showDropdown);
        } else {
            navigate('/login');
        }
    };

    const handleDashboardClick = () => {
        navigate('/profile');
        setShowDropdown(false);
    };

    const handleSignOut = async () => {
        try {
            await logOut();
            navigate('/');
            setShowDropdown(false);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setShowSuggestions(false);
            setSearchQuery('');
            setShowMobileSearch(false);
        }
    };

    const toggleMobileSearch = () => {
        setShowMobileSearch(!showMobileSearch);
        if (!showMobileSearch) {
            // Focus the search input when showing the search bar
            setTimeout(() => {
                const searchInput = document.querySelector('.mobile-search-container input');
                if (searchInput) searchInput.focus();
            }, 100);
        }
    };

    return (
        <>
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
                    <form className="search-box flex-div" onSubmit={handleSearch}>
                        <input 
                            type="text" 
                            placeholder="Search" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                        />
                        <button type="submit"><img src={search_icon} alt="Search" /></button>
                    </form>
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="search-suggestions">
                            {suggestions.map((item) => (
                                <div 
                                    key={item.id.channelId} 
                                    className="suggestion-item flex-div"
                                    onClick={() => {
                                        navigate(`/search?q=${encodeURIComponent(item.snippet.title)}&channelId=${item.id.channelId}`);
                                        setShowSuggestions(false);
                                        setSearchQuery('');
                                    }}
                                >
                                    <img 
                                        src={item.snippet.thumbnails.default.url} 
                                        alt={item.snippet.title} 
                                        className="suggestion-thumbnail"
                                    />
                                    <div className="suggestion-text">
                                        <span className="suggestion-title">{item.snippet.title}</span>
                                        <span className="suggestion-type">Channel</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="nav-right flex-div">
                    <button className="mobile-search-btn" onClick={toggleMobileSearch}>
                        <img src={search_icon} alt="Search" />
                    </button>
                    
                    {currentUser ? (
                        <div className="user-profile-container" ref={dropdownRef}>
                            <div className="user-icon" onClick={handleProfileClick}>
                                {currentUser.photoURL ? (
                                    <img 
                                        src={currentUser.photoURL} 
                                        alt="User" 
                                        className="user-profile"
                                    />
                                ) : (
                                    <div className="user-initial">
                                        {currentUser.email.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-header">
                                        <div className="dropdown-user-info">
                                            {currentUser.photoURL ? (
                                                <img 
                                                    src={currentUser.photoURL} 
                                                    alt="User" 
                                                    className="dropdown-user-img"
                                                />
                                            ) : (
                                                <div className="dropdown-user-initial">
                                                    {currentUser.email.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="dropdown-user-details">
                                                <p className="dropdown-user-email">{currentUser.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <div className="dropdown-divider"></div>
                                    <div className="dropdown-section">
                                        <button className="dropdown-item" onClick={handleDashboardClick}>
                                            <span className="dropdown-item-icon">⚙️</span>
                                            <span>Your Dashboard</span>
                                        </button>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <div className="dropdown-section">
                                        <button className="dropdown-item" onClick={handleSignOut}>
                                            <span className="dropdown-item-icon">🚪</span>
                                            <span>Sign out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="sign-in-btn" onClick={() => navigate('/login')}>
                            Sign In
                        </button>
                    )}
                </div>
            </nav>

            {/* Mobile Search Container */}
            {showMobileSearch && (
                <div className="mobile-search-container" ref={searchRef}>
                    <form className="mobile-search-box flex-div" onSubmit={handleSearch}>
                        <input 
                            type="text" 
                            placeholder="Search" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                        />
                        <button type="submit"><img src={search_icon} alt="Search" /></button>
                        <button type="button" className="close-search-btn" onClick={toggleMobileSearch}>✕</button>
                    </form>
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="search-suggestions mobile-suggestions">
                            {suggestions.map((item) => (
                                <div 
                                    key={item.id.channelId} 
                                    className="suggestion-item flex-div"
                                    onClick={() => {
                                        navigate(`/search?q=${encodeURIComponent(item.snippet.title)}&channelId=${item.id.channelId}`);
                                        setShowSuggestions(false);
                                        setSearchQuery('');
                                        setShowMobileSearch(false);
                                    }}
                                >
                                    <img 
                                        src={item.snippet.thumbnails.default.url} 
                                        alt={item.snippet.title} 
                                        className="suggestion-thumbnail"
                                    />
                                    <div className="suggestion-text">
                                        <span className="suggestion-title">{item.snippet.title}</span>
                                        <span className="suggestion-type">Channel</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default Navbar