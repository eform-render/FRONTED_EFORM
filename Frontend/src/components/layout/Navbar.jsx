import { NavLink, useNavigate } from 'react-router-dom'
import { isAdmin } from '../../utils/roles'

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const admin = isAdmin(user)
  const navItems = admin
    ? [
        { label: 'Panel', to: '/dashboard' },
        { label: 'Inventario', to: '/products' },
        { label: 'Sets', to: '/sets' },
      ]
    : [
        { label: 'Catalogo', to: '/products' },
        { label: 'Carrito', to: '/cart' },
      ]

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <nav className="site-navbar">
      <div className="site-navbar__inner">
        <NavLink className="site-brand" to="/">
          <img className="site-brand__logo" src="/logo.jpeg" alt="Logo EFORM" />
          <span>EFORM</span>
        </NavLink>

        <div className="site-menu" aria-label="Menu principal">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) => (isActive ? 'site-menu__link is-active' : 'site-menu__link')}
              end={item.to === '/'}
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
          {user && (
            <>
              <span className="site-menu__user">
                Bienvenido, {user.username || user.email}
              </span>
              <button className="site-menu__button" onClick={handleLogout} type="button">
                Salir
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
