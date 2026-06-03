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
            <a href="https://www.facebook.com/EFORMoficial" target="_blank" rel="noreferrer">📘 Facebook</a>
            <a href="https://wa.me/573123456789" target="_blank" rel="noreferrer">💬 WhatsApp</a>
            <a href="https://www.instagram.com/EFORM_SENA" target="_blank" rel="noreferrer">📸 Instagram</a>
            <a href="mailto:contacto@eform.com" target="_blank" rel="noreferrer">✉ Correo</a>
          </div>
          <div className="site-footer__meta">
            <span>Tel: +57 312 345 6789</span>
            <span>Horario: Lun-Vie 8:00-18:00</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
