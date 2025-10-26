import { Routes, Route } from 'react-router'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import LikedMemes from './pages/LikedMemes';
import DislikedMemes from './pages/DislikedMemes';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-black">
          <Navbar />
          
          {/* Add padding for fixed navbar */}
          <div >
            <Routes>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Signup />} />
              
              {/* protected routes - require authentication */}
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/liked" element={
                <ProtectedRoute>
                  <LikedMemes />
                </ProtectedRoute>
              } />
              <Route path="/disliked" element={
                <ProtectedRoute>
                  <DislikedMemes />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
