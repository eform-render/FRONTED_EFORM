import { Link } from 'react-router-dom'
import { getCurrentUser } from '../services/authServices'
import { isAdmin } from '../utils/roles'

const dailyVerses = [
  {
    text: 'Todo lo puedo en Cristo que me fortalece.',
    reference: 'Filipenses 4:13',
  },
  {
    text: 'El Senor es mi pastor; nada me faltara.',
    reference: 'Salmo 23:1',
  },
  {
    text: 'Encomienda al Senor tus obras, y tus pensamientos seran afirmados.',
    reference: 'Proverbios 16:3',
  },
  {
    text: 'Esfuerzate y se valiente; no temas ni desmayes.',
    reference: 'Josue 1:9',
  },
  {
    text: 'Por la manana hazme saber de tu gran amor, porque en ti he puesto mi confianza.',
    reference: 'Salmo 143:8',
  },
  {
    text: 'La paz os dejo, mi paz os doy.',
    reference: 'Juan 14:27',
  },
  {
    text: 'Mas buscad primeramente el reino de Dios y su justicia.',
    reference: 'Mateo 6:33',
  },
]

const initialVerseIndex = Math.floor(Date.now() / 86400000) % dailyVerses.length
const initialDailyVerse = dailyVerses[initialVerseIndex]

export default function HomePage() {
  const user = getCurrentUser()
  const isAuthenticated = Boolean(user)
  const canManageProducts = isAdmin(user)

  const highlights = [
    {
      icon: '01',
      title: 'Compra Rapida y Segura',
      text: 'Selecciona tus uniformes, revisa disponibilidad y continua tu compra en pocos pasos.',
    },
    {
      icon: '02',
      title: 'Productos Completos',
      text: 'Consulta prendas institucionales SENA con descripcion, tallas, precios y stock actualizado.',
    },
    {
      icon: '03',
      title: 'Trazabilidad Total',
      text: 'Ten claridad sobre tu pedido desde la seleccion hasta la entrega.',
    },
    {
      icon: '04',
      title: 'Soporte Dedicado',
      text: 'Recibe orientacion sobre tallas, disponibilidad y detalles de cada uniforme.',
    },
  ]

  const benefits = [
    { number: '500+', label: 'Uniformes Disponibles', description: 'Variedad de productos SENA' },
    { number: '24/7', label: 'Plataforma Disponible', description: 'Compra en cualquier momento' },
    { number: '2-5', label: 'Dias de Entrega', description: 'Envio para pedidos confirmados' },
    { number: '100%', label: 'Compra Confiable', description: 'Informacion clara de cada producto' },
  ]

  const workflow = [
    'Explora los productos',
    'Elige tu uniforme',
    'Selecciona la talla',
    'Revisa disponibilidad',
    'Agrega al carrito',
    'Confirma tu pedido',
  ]

  const values = [
    {
      title: 'Compromiso',
      description: 'Siempre con transparencia, calidad y atención cercana para cada aprendiz.',
    },
    {
      title: 'Rapidez',
      description: 'Proceso optimizado que reduce el tiempo de búsqueda y validación.',
    },
    {
      title: 'Seguridad',
      description: 'Pagos protegidos y datos resguardados en todo momento.',
    },
  ]

  const dailyVerse = initialDailyVerse

  return (
    <main className="home-page">
      <section className="home-hero-banner">
        <div className="home-hero-banner__content">
          <div className="hero-badge">UNIFORMES SENA | TIENDA OFICIAL ONLINE</div>
          <h1 className="hero-title">Uniformes SENA con Confianza y Calidad</h1>
          <p className="hero-subtitle">
            Compra tus uniformes institucionales en una plataforma clara, segura y pensada para aprendices SENA.
          </p>
          <div className="hero-cta-buttons">
            <Link className="btn btn-primary btn-lg" to={isAuthenticated ? (canManageProducts ? '/dashboard' : '/products') : '/login'}>
              {isAuthenticated ? (canManageProducts ? 'Ver Dashboard' : 'Ver Productos') : 'Iniciar Sesion'}
            </Link>
            <Link className="btn btn-outline-light btn-lg" to={isAuthenticated && !canManageProducts ? '/cart' : '/register'}>
              {isAuthenticated && !canManageProducts ? 'Ver Carrito' : 'Registrarme'}
            </Link>
          </div>
        </div>
        <div className="home-hero-banner__visual">
          <div className="daily-verse-card">
            <span>Frase biblica del dia</span>
            <blockquote>{dailyVerse.text}</blockquote>
            <strong>{dailyVerse.reference}</strong>
          </div>
        </div>
      </section>

      <section className="home-stats">
        <div className="stats-container">
          {benefits.map((benefit) => (
            <div key={benefit.label} className="stat-card">
              <div className="stat-number">{benefit.number}</div>
              <h3 className="stat-label">{benefit.label}</h3>
              <p className="stat-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section home-vision-mission">
        <div className="section-heading">
          <h2>Nuestra Visión y Misión</h2>
          <p>
            Brindamos una experiencia profesional para que el proceso de adquirir uniformes
            institucionales sea claro, práctico y formalmente respaldado.
          </p>
        </div>
        <div className="vision-mission-grid">
          <article className="mission-card mission-card--vision">
            <span className="mission-badge">Visión</span>
            <h3>Ser el referente oficial</h3>
            <p>
              Convertirnos en la plataforma de confianza para estudiantes SENA que buscan
              uniformes oficiales, con un servicio ágil y una experiencia digital moderna.
            </p>
          </article>
          <article className="mission-card mission-card--mission">
            <span className="mission-badge">Misión</span>
            <h3>Entregar uniformes con confianza</h3>
            <p>
              Simplificar la compra de uniformes institucionales al ofrecer productos claros,
              disponibilidad visible y soporte dedicado en cada paso de la transacción.
            </p>
          </article>
          <article className="mission-card mission-card--values">
            <span className="mission-badge">Valores</span>
            <div className="value-list">
              {values.map((item) => (
                <div key={item.title} className="value-item">
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="home-section home-why-eform">
        <div className="section-heading">
          <h2>Por qué Elegir EFORM</h2>
          <p>
            Una experiencia centrada en uniformes oficiales SENA, diseñada para brindar confianza,
            claridad y un proceso rápido en cada compra.
          </p>
        </div>
        <div className="features-grid-enhanced">
          {highlights.map((item) => (
            <article className="feature-card-enhanced" key={item.title}>
              <div className="feature-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-how-to-buy">
        <div className="section-heading">
          <h2>Como Comprar tus Uniformes</h2>
          <p>Un flujo corto para encontrar, revisar y pedir el uniforme que necesitas.</p>
        </div>
        <div className="steps-container">
          {workflow.map((step, index) => (
            <div key={step} className="step-item">
              <div className="step-number">{index + 1}</div>
              <p className="step-text">{step}</p>
              {index < workflow.length - 1 && <div className="step-arrow">-</div>}
            </div>
          ))}
        </div>
      </section>

      {isAuthenticated ? (
        <section className="home-section home-guest-cta">
          <div className="section-heading-featured">
            <div>
              <h2>{canManageProducts ? 'Gestiona tu inventario' : 'Explora el catalogo completo'}</h2>
              <p>
                {canManageProducts
                  ? 'Entra al panel administrativo para revisar productos, stock y ventas.'
                  : 'Los productos disponibles se consultan desde la seccion Productos.'}
              </p>
            </div>
            <Link className="btn btn-primary btn-lg" to={canManageProducts ? '/dashboard' : '/products'}>
              {canManageProducts ? 'Ir al Dashboard' : 'Ir a Productos'}
            </Link>
          </div>
        </section>
      ) : (
        <section className="home-section home-guest-cta">
          <div className="guest-cta-card">
            <h2>Empieza hoy mismo</h2>
            <p>
              Crea tu cuenta para acceder al catálogo completo de uniformes SENA, gestionar tu carrito y
              completar tu compra de forma segura.
            </p>
            <div className="hero-cta-buttons guest-buttons">
              <Link className="btn btn-primary btn-lg" to="/register">
                Registrarme
              </Link>
              <Link className="btn btn-outline-light btn-lg" to="/login">
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
