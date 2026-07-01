import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductCard from '../components/products/ProductCard'
import { getCurrentUser } from '../services/authServices'
import { addToCart } from '../services/cartService'
import { getAll } from '../services/productService'
import { getApiErrorMessage } from '../utils/apiError'
import { isAdmin } from '../utils/roles'

// Página de inicio optimizada

const dailyVerses = [
  {
    text: 'Todo lo puedo en Cristo que me fortalece.',
    reference: 'Filipenses 4:13',
  },
  {
    text: 'El Señor es mi pastor; nada me faltará.',
    reference: 'Salmo 23:1',
  },
  {
    text: 'Encomienda al Señor tus obras, y tus pensamientos serán afirmados.',
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
  const navigate = useNavigate()
  const user = getCurrentUser()
  const isAuthenticated = Boolean(user)
  const canManageProducts = isAdmin(user)
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [productsError, setProductsError] = useState('')
  const [productsSuccess, setProductsSuccess] = useState('')

  const highlights = [
    {
      icon: '01',
      title: 'Compra rápida y segura',
      text: 'Selecciona tus uniformes, revisa disponibilidad y continúa tu compra en pocos pasos.',
    },
    {
      icon: '02',
      title: 'Productos completos',
      text: 'Consulta prendas institucionales SENA con descripción, tallas, precios y stock actualizado.',
    },
    {
      icon: '03',
      title: 'Trazabilidad total',
      text: 'Ten claridad sobre tu pedido desde la selección hasta la entrega.',
    },
    {
      icon: '04',
      title: 'Soporte dedicado',
      text: 'Recibe orientación sobre tallas, disponibilidad y detalles de cada uniforme.',
    },
  ]

  const benefits = [
    { number: '500+', label: 'Uniformes disponibles', description: 'Variedad de productos SENA' },
    { number: '24/7', label: 'Plataforma disponible', description: 'Compra en cualquier momento' },
    { number: '2-5', label: 'Días de entrega', description: 'Envío para pedidos confirmados' },
    { number: '100%', label: 'Compra confiable', description: 'Información clara de cada producto' },
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

  useEffect(() => {
    getAll()
      .then(setProducts)
      .catch((apiError) => setProductsError(getApiErrorMessage(apiError, 'No fue posible cargar los productos.')))
      .finally(() => setLoadingProducts(false))
  }, [])

  const handleProductAction = (product) => {
    setProductsSuccess('')
    setProductsError('')

    if (canManageProducts) {
      navigate('/products')
      return
    }

    const result = addToCart(product)
    setProductsSuccess(result.added ? result.message : '')
    setProductsError(result.added ? '' : result.message)
    if (result.added) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, stock: Math.max(0, Number(item.stock || 0) - 1) } : item
        )
      )
    }
  }

  return (
    <main className="home-page">
      <section className="home-hero-banner">
        <div className="home-hero-banner__content">
          <div className="hero-badge">UNIFORMES SENA | TIENDA OFICIAL ONLINE</div>
          <h1 className="hero-title">Uniformes SENA con confianza y calidad</h1>
          <p className="hero-subtitle">
            Compra tus uniformes institucionales en una plataforma clara, segura y pensada para aprendices SENA.
          </p>
        </div>
        <div className="home-hero-banner__visual">
          <div className="daily-verse-card">
            <span>Frase bíblica del día</span>
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

        <div className="home-public-products">
          <div className="section-heading-featured">
            <div>
              <h2>Productos disponibles por el momento</h2>
              <p>
                Puedes revisar los uniformes antes de registrarte. Para comprar, crea tu cuenta o inicia sesion.
              </p>
            </div>
          </div>

          {productsError && <div className="catalog-message catalog-message--error">{productsError}</div>}
          {productsSuccess && <div className="alert alert-success">{productsSuccess}</div>}
          {loadingProducts && <div className="catalog-message">Cargando productos...</div>}
          {!loadingProducts && !productsError && products.length === 0 && (
            <div className="catalog-message">Todavia no hay productos registrados.</div>
          )}
          {!loadingProducts && products.length > 0 && (
            <div className="home-product-grid-enhanced">
              {products.map((product) => (
                <ProductCard
                  actionLabel="Agregar"
                  isAdmin={canManageProducts}
                  key={product.id}
                  onAddToCart={handleProductAction}
                  product={product}
                />
              ))}
            </div>
          )}
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
      ) : null}
    </main>
  )
}
