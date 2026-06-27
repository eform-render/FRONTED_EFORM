import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { getCart } from '../../services/cartService'
import { isAdmin } from '../../utils/roles'

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const admin = isAdmin(user)
  const [hidden, setHidden] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [cartQuantity, setCartQuantity] = useState(() =>
    getCart().reduce((sum, item) => sum + Number(item.quantity || 1), 0)
  )
  const navItems = [
    ...(!admin ? [{ label: 'Inicio', to: '/home' }] : []),
    { label: 'Productos', to: '/products' },
    ...(!admin ? [{ label: 'Carrito', to: '/cart' }] : []),
    ...(admin ? [{ label: 'Pagos', to: '/payments' }, { label: 'Panel', to: '/dashboard' }] : []),
  ]

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      // Only show navbar completely when at top (scrollY === 0)
      // Hide when scrolling down from any position below 60px
      setHidden(currentScrollY > lastScrollY && currentScrollY > 60 && lastScrollY > 60)
      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <nav className={hidden ? 'site-navbar site-navbar--hidden' : 'site-navbar'}>
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
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          {user ? (
            <button className="site-menu__button" onClick={handleLogout} type="button">
              Salir
            </button>
          ) : (
            <NavLink className="site-menu__button" to="/login">
              Iniciar sesión
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
