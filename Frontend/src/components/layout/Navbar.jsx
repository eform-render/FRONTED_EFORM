import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const navItems = [
    { label: 'Inicio', to: '/home' },
    { label: 'Productos', to: '/products' },
    { label: 'Panel', to: '/dashboard' },
  ]

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <nav className="site-navbar">
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
