import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductFormPage from './pages/ProductFormPage'
import SetsPage from './pages/SetsPage'
import CartPage from './pages/CartPage'
import { clearSession, getCurrentUser } from './services/authServices'
import { isAdmin } from './utils/roles'

function App() {
  const [user, setUser] = useState(() => getCurrentUser())
  const isAuthenticated = Boolean(user)
  const canManageProducts = isAdmin(user)

  const handleLogin = (nextUser) => {
    setUser(nextUser)
  }

  const handleLogout = () => {
    clearSession()
    setUser(null)
  }

  return (
    <>
      {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
      <div className="app-content">
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage onLogin={handleLogin} />}
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />}
          />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/products" replace /> : <RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <DashboardPage onLogout={handleLogout} /> : <Navigate to="/" replace />}
          />
          <Route path="/products" element={isAuthenticated ? <ProductsPage user={user} /> : <Navigate to="/" replace />} />
          <Route
            path="/products/new"
            element={canManageProducts ? <ProductFormPage /> : <Navigate to="/products" replace />}
          />
          <Route
            path="/products/:id"
            element={isAuthenticated ? <ProductDetailPage user={user} /> : <Navigate to="/" replace />}
          />
          <Route
            path="/products/:id/edit"
            element={canManageProducts ? <ProductFormPage /> : <Navigate to="/products" replace />}
          />
          <Route
            path="/cart"
            element={!canManageProducts && isAuthenticated ? <CartPage /> : <Navigate to="/products" replace />}
          />
          <Route path="/sets" element={canManageProducts ? <SetsPage /> : <Navigate to="/products" replace />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />} />
        </Routes>
      </div>
      {isAuthenticated && <Footer />}
    </>
  )
}

export default App
