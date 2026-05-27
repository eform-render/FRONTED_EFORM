import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { getCart } from '../../services/cartService'
import { isAdmin } from '../../utils/roles'

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const admin = isAdmin(user)
  const [hidden, setHidden] = useState(false)
  const [cartQuantity, setCartQuantity] = useState(() =>
    getCart().reduce((sum, item) => sum + Number(item.quantity || 1), 0)
  )
  const navItems = [
    { label: 'Inicio', to: '/home' },
    { label: 'Productos', to: '/products' },
    ...(!admin ? [{ label: 'Carrito', to: '/cart' }] : []),
    { label: 'Panel', to: '/dashboard' },
  ]

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setHidden(currentScrollY > lastScrollY && currentScrollY > 120)
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
    navigate('/login')
  }

  return (
    <nav className={hidden ? 'site-navbar site-navbar--hidden' : 'site-navbar'}>
      <div className="site-navbar__inner">
        <div className="navbar-brand-section">
          <NavLink className="site-brand" to="/home">
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
          {user && (
            <button className="site-menu__button" onClick={handleLogout} type="button">
              Salir
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
