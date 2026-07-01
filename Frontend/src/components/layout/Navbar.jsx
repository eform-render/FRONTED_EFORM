import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { getCart } from '../../services/cartService'
import { isAdmin } from '../../utils/roles'

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const admin = isAdmin(user)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [cartQuantity, setCartQuantity] = useState(() =>
    getCart().reduce((sum, item) => sum + Number(item.quantity || 1), 0)
  )
  const navItems = [
    ...(!admin ? [{ label: 'Inicio', to: '/home' }] : []),
    ...(user ? [{ label: 'Productos', to: '/products' }] : []),
    ...(!admin && user ? [{ label: 'Mis Pedidos', to: '/orders' }] : []),
    ...(!admin ? [{ label: 'Carrito', to: '/cart' }] : []),
    ...(admin ? [{ label: 'Pagos', to: '/payments' }, { label: 'Panel', to: '/dashboard' }] : []),
  ]

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const handleCartUpdate = (event) => {
      const cart = event?.detail?.cart || getCart()
      setCartQuantity(cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0))
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [])

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <nav className="site-navbar">
      <div className="site-navbar__inner">
        <div className="navbar-brand-section">
          <NavLink className="site-brand" to={admin ? '/dashboard' : '/home'}>
            <img className="site-brand__logo" src="/logo.jpeg" alt="Logo EFORM" />
            <div className="brand-info">
              <span className="brand-name">EFORM</span>
              <span className="brand-subtitle">
                Plataforma para la compra y gestion de uniformes institucionales SENA.
              </span>
            </div>
          </NavLink>
        </div>

        <div className="site-menu" aria-label="Menu principal">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) => (isActive ? 'site-menu__link is-active' : 'site-menu__link')}
              end={item.to === '/home'}
              key={item.to}
              to={item.to}
            >
              {item.label}
              {item.to === '/cart' && cartQuantity > 0 && (
                <span className="cart-button-count">{cartQuantity}</span>
              )}
            </NavLink>
          ))}
          <button
            aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            className="theme-toggle-button"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Tema claro' : 'Tema oscuro'}
            type="button"
          >
            <span className="theme-toggle-button__track" aria-hidden="true">
              <span className="theme-toggle-button__thumb" />
            </span>
            <span className="theme-toggle-button__label">{theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
          </button>
          {user ? (
            <button className="site-menu__button site-menu__button--logout" onClick={handleLogout} type="button">
              Salir
            </button>
          ) : (
            <>
              <NavLink className="site-menu__button site-menu__button--login" to="/login">
                Iniciar sesión
              </NavLink>
              <NavLink className="site-menu__button site-menu__button--register" to="/register">
                Registrarme
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
