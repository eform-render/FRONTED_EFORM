import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../services/authServices'
import { getAll } from '../services/productService'
import { isAdmin } from '../utils/roles'

export default function DashboardPage() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const admin = isAdmin(user)
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(admin)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [navigate, user])

  useEffect(() => {
    if (!admin) return

    getAll()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false))
  }, [admin])

  if (!user) {
    return <div className="loading">Cargando...</div>
  }

  const totalStock = products.reduce((sum, product) => sum + Number(product.stock || 0), 0)
  const lowStockProducts = products.filter(
    (product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5
  )
  const unavailableProducts = products.filter((product) => Number(product.stock || 0) === 0)
  const productTypes = products.reduce((groups, product) => {
    const type = product.tipoTela?.trim() || 'Sin tipo registrado'
    if (!groups[type]) groups[type] = { count: 0, stock: 0 }
    groups[type].count += 1
    groups[type].stock += Number(product.stock || 0)
    return groups
  }, {})

  return (
    <main className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-header__content">
          <div>
            <span className="dashboard-badge">{admin ? 'Panel administrativo' : 'Mi cuenta'}</span>
            <h1>Bienvenido, {user.username || user.email.split('@')[0]}</h1>
            <p>{admin ? 'Gestión centralizada de productos e inventario' : 'Explora productos y administra tu carrito'}</p>
          </div>
          {admin && (
            <div className="dashboard-header__visual" aria-hidden="true">
              <div className="dashboard-header__shape" />
            </div>
          )}
        </div>
      </div>

      {admin && (
        <>
          <nav className="dashboard-back-nav" aria-label="Opciones de revision del panel">
            <Link className="btn btn-primary" to="/products/new">
              + Crear producto
            </Link>
            <Link className="btn btn-outline-primary" to="/products">
              Ver inventario
            </Link>
          </nav>

          <section className="dashboard-summary">
            <article>
              <span>📦 Productos totales</span>
              <strong>{loadingProducts ? '...' : products.length}</strong>
            </article>
            <article>
              <span>📊 Unidades en stock</span>
              <strong>{loadingProducts ? '...' : totalStock}</strong>
            </article>
            <article>
              <span>⚠️ Stock bajo</span>
              <strong>{loadingProducts ? '...' : lowStockProducts.length}</strong>
            </article>
          </section>
        </>
      )}

      {admin && (
        <section className="dashboard-stock-review">
          <div className="dashboard-stock-review__header">
            <h2>📊 Inventario por tipo de tela</h2>
            <p>Resumem de productos y unidades disponibles clasificadas por tipo</p>
          </div>
          <div className="inventory-type-grid">
            {Object.entries(productTypes).map(([type, summary]) => (
              <Link className="inventory-type-card" key={type} to={`/products?tipo=${encodeURIComponent(type)}`}>
                <span>{type}</span>
                <strong>{summary.stock}</strong>
                <small>{summary.count} producto(s)</small>
              </Link>
            ))}
            {!loadingProducts && products.length === 0 && (
              <p className="catalog-message">Todavia no hay productos registrados.</p>
            )}
          </div>
        </section>
      )}

      <section className="dashboard-actions">
        <h2>{admin ? '⚡ Acciones rápidas' : '🛍️ Tu panel'}</h2>
        <div className="action-grid">
          {admin ? (
            <>
              <Link to="/products/new" className="action-card">
                <h3>➕ Crear producto</h3>
                <p>Agregar nuevas prendas al catálogo y al inventario.</p>
              </Link>

              <Link to="/products" className="action-card">
                <h3>📦 Gestionar productos</h3>
                <p>Editar información, precios, stock y características.</p>
              </Link>

              <Link to="/payments" className="action-card">
                <h3>💳 Historial de pagos</h3>
                <p>Ver pedidos confirmados y sus transacciones de pago.</p>
              </Link>

              <Link to="/users" className="action-card">
                <h3>👥 Gestionar usuarios</h3>
                <p>Administrar roles, permisos y usuarios del sistema.</p>
              </Link>
            </>
          ) : (
            <>
              <Link to="/products" className="action-card">
                <h3>🛒 Ver catálogo</h3>
                <p>Explorar todas las prendas disponibles con precios y tallas.</p>
              </Link>

              <Link to="/cart" className="action-card">
                <h3>🛍️ Mi carrito</h3>
                <p>Revisar productos seleccionados e ir al pago.</p>
              </Link>
            </>
          )}
        </div>
      </section>

      {admin && (
        <div className="dashboard-activity">
          <h2>⚠️ Alertas de inventario</h2>
          {lowStockProducts.length === 0 && unavailableProducts.length === 0 ? (
            <p>✅ No hay alertas. El inventario se ve estable y en buen estado.</p>
          ) : (
            <ul className="activity-list">
              {lowStockProducts.slice(0, 8).map((product) => (
                <li key={product.id}>
                  <strong>{product.nombre}:</strong> Solo quedan <strong>{product.stock}</strong> unidades.
                </li>
              ))}
              {unavailableProducts.slice(0, 8).map((product) => (
                <li key={product.id}>
                  <strong>{product.nombre}:</strong> Sin stock (0 unidades).
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  )
}
