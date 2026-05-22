import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <img className="site-footer__logo" src="/logo.jpeg" alt="Logo EFORM" />
          <div>
            <strong>EFORM</strong>
            <p>Plataforma para la compra y gestion de uniformes institucionales SENA.</p>
          </div>
        </div>
        <div className="site-footer__content">
          <div className="site-footer__links">
            <Link to="/home">Inicio</Link>
            <Link to="/products">Productos</Link>
            <Link to="/dashboard">Panel</Link>
          </div>
          <div className="site-footer__meta">
            <span>ADSO 3067454</span>
            <span>SENA Centro Comercio y Servicios</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
