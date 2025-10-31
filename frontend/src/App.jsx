import { Routes, Route } from 'react-router'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import Home from './pages/Home'
import About from './pages/About'
import LikedMemes from './pages/LikedMemes';
import DislikedMemes from './pages/DislikedMemes';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddMeme from './pages/AddMeme';
import Profile from './pages/Profile';
import MyMemes from './pages/MyMemes';
import EditMeme from './pages/EditMeme';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Navbar />

        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />

          {/* Protected routes */}
          <Route index element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="about" element={
            <ProtectedRoute>
              <About />
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
          <Route path="/add" element={
            <ProtectedRoute>
              <AddMeme />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/my-memes" element={
            <ProtectedRoute>
              <MyMemes />
            </ProtectedRoute>
          } />
          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <EditMeme />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
