import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAll } from '../services/productService'
import ProductCard from '../components/products/ProductCard'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAll()
      .then(setProducts)
      .catch(() => setError('No fue posible cargar el catalogo en este momento.'))
      .finally(() => setLoading(false))
  }, [])

  const filteredProducts = products.filter((p) =>
    p.nombre?.toLowerCase().includes(filter.toLowerCase())
  )

  const highlights = [
    {
      title: 'Compra mas agil',
      text: 'Centraliza la adquisicion de uniformes SENA y reduce procesos manuales, demoras y errores.',
    },
    {
      title: 'Catalogo actualizado',
      text: 'Permite consultar dotaciones disponibles, precios, descripcion y stock desde cualquier dispositivo.',
    },
    {
      title: 'Trazabilidad de pedidos',
      text: 'Facilita el seguimiento de solicitudes desde el registro hasta la entrega del uniforme.',
    },
  ]

  const workflow = [
    'Registro e inicio de sesion',
    'Consulta del catalogo',
    'Seleccion de producto',
    'Confirmacion del pedido',
    'Gestion de inventario',
  ]

  const previewProducts = filteredProducts.slice(0, 3)
  const hasProducts = previewProducts.length > 0

  const renderCatalogContent = () => {
    if (loading) return <p className="catalog-message">Cargando catalogo...</p>
    if (error) return <p className="catalog-message catalog-message--error">{error}</p>
    if (!hasProducts) {
      return <p className="catalog-message">No hay productos que coincidan con la busqueda.</p>
    }

    return (
      <div className="home-product-grid">
        {previewProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    )
  }

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero__content">
          <span className="home-eyebrow">Proyecto EFORM | SENA ADSO 3067454</span>
          <h1>Uniformes SENA con compra digital, control y seguimiento.</h1>
          <p>
            EFORM es una plataforma de comercio electronico creada para modernizar la venta de
            dotaciones institucionales, mejorar la experiencia de los aprendices y dar mas control
            al proceso administrativo.
          </p>
          <div className="home-actions">
            <Link className="btn btn-primary btn-lg" to="/products">
              Ver catalogo
            </Link>
          </div>
        </div>

        <div className="home-hero__panel" aria-label="Resumen del proyecto EFORM">
          <div>
            <span className="panel-label">Objetivo</span>
            <strong>Optimizar la adquisicion de uniformes institucionales.</strong>
          </div>
          <div className="panel-metrics">
            <span>Pedidos</span>
            <strong>en linea</strong>
          </div>
          <div className="panel-metrics">
            <span>Inventario</span>
            <strong>controlado</strong>
          </div>
          <div className="panel-metrics">
            <span>Acceso</span>
            <strong>multidispositivo</strong>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <span className="home-eyebrow">Por que EFORM</span>
          <h2>Una solucion para reemplazar el proceso manual.</h2>
          <p>
            El documento del proyecto identifica retrasos, inconsistencias y baja trazabilidad en la
            compra de uniformes. Esta interfaz presenta la solucion de forma mas clara para usuarios
            y administradores.
          </p>
        </div>

        <div className="home-feature-grid">
          {highlights.map((item) => (
            <article className="home-feature" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-section--split">
        <div className="section-heading">
          <span className="home-eyebrow">Flujo principal</span>
          <h2>Del catalogo al pedido sin perder control.</h2>
          <p>
            La plataforma contempla registro de usuarios, catalogo, seleccion de productos,
            confirmacion de pedidos y gestion inicial de inventario.
          </p>
        </div>

        <ol className="workflow-list">
          {workflow.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="home-section home-catalog">
        <div className="section-heading section-heading--inline">
          <div>
            <span className="home-eyebrow">Catalogo</span>
            <h2>Explora uniformes disponibles.</h2>
          </div>
          <Link className="btn btn-outline-primary" to="/products">
            Ver todos
          </Link>
        </div>

        <input
          className="form-control home-search"
          placeholder="Buscar por nombre del producto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        {renderCatalogContent()}
      </section>
    </main>
  )
}
