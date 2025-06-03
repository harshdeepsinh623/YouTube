import React, { useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Video from './pages/Video/Video'
import Channel from './Components/Channel/Channel'
import Login from './Components/Auth/Login'
import Profile from './pages/Profile/Profile'
import ProtectedRoute from './Components/Auth/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'

const App = () => {
  const [sidebar, setSidebar] = useState(true);
  
  return (
    <AuthProvider>
      <div>
        <Navbar setSidebar={setSidebar} />
        <Routes>
          <Route path='/' element={<Home sidebar={sidebar} />} />
          <Route path='/video/:categoryId/:videoId' element={<Video />} />
          <Route path='/channel/:channelId' element={<Channel />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App