import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser } from '../services/authServices'
import { getAll } from '../services/productService'
import ProductCard from '../components/products/ProductCard'

export default function HomePage() {
  const user = getCurrentUser()
  const isAuthenticated = Boolean(user)
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    getAll()
      .then(setProducts)
      .catch(() => setError('No fue posible cargar los productos en este momento.'))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const filteredProducts = products.filter((product) =>
    product.nombre?.toLowerCase().includes(filter.toLowerCase())
  )

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
  const verseIndex = Math.floor(Date.now() / 86400000) % dailyVerses.length
  const dailyVerse = dailyVerses[verseIndex]

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
            <Link className="btn btn-primary btn-lg" to={isAuthenticated ? '/products' : '/login'}>
              {isAuthenticated ? 'Ver Productos' : 'Iniciar Sesion'}
            </Link>
            <Link className="btn btn-outline-light btn-lg" to={isAuthenticated ? '/cart' : '/register'}>
              {isAuthenticated ? 'Ver Carrito' : 'Registrarme'}
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

      {!isAuthenticated ? (
        <section className="home-section home-public-note">
          <div className="section-heading">
            <h2>Bienvenido a EFORM</h2>
            <p>
              Para ver productos, agregar al carrito y pagar tu pedido, inicia sesion o crea tu cuenta.
            </p>
          </div>
          <div className="hero-cta-buttons">
            <Link className="btn btn-primary" to="/login">
              Iniciar Sesion
            </Link>
            <Link className="btn btn-outline-primary" to="/register">
              Registrarme
            </Link>
          </div>
        </section>
      ) : (
        <>
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

      <section className="home-section home-why-eform">
        <div className="section-heading">
          <h2>Por que Comprar en EFORM</h2>
          <p>
            EFORM concentra la compra de uniformes institucionales en una experiencia sencilla,
            organizada y facil de consultar.
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

      <section className="home-section home-featured-catalog">
        <div className="section-heading-featured">
          <div>
            <h2>Uniformes Destacados</h2>
            <p>Productos recomendados para revisar rapidamente disponibilidad, tallas y precio.</p>
          </div>
          <Link className="btn btn-primary" to="/products">
            Ver Todos los Productos
          </Link>
        </div>

        <div className="search-filter-box">
          <input
            className="form-control home-search-enhanced"
            placeholder="Busca tu uniforme SENA por nombre o descripcion..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
        </div>

        {loading && <p className="catalog-message">Cargando uniformes disponibles...</p>}
        {error && <p className="catalog-message catalog-message--error">{error}</p>}
        {!loading && !error && filteredProducts.length === 0 && (
          <p className="catalog-message">
            No encontramos uniformes con ese nombre. Intenta con otro termino de busqueda.
          </p>
        )}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="home-product-grid-enhanced">
            {filteredProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
        </>
      )}
    </main>
  )
}
