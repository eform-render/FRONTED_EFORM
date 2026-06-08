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
            <span className="dashboard-badge">Panel administrativo</span>
            <h1>Bienvenido, {user.username || user.email}</h1>
            <p>{admin ? 'Panel de control de gestion' : 'Explora productos y administra tu carrito'}</p>
          </div>
          {admin && (
            <div className="dashboard-header__visual" aria-hidden="true">
              <div className="dashboard-header__shape" />
            </div>
          )}
        </div>
      </div>

      {admin && (
        <nav className="dashboard-back-nav" aria-label="Opciones de revision del panel">
          <Link className="btn btn-outline-primary" to="/products">
            Revisar inventario completo
          </Link>
          <Link className="btn btn-outline-primary" to="/products/new">
            Crear producto
          </Link>
        </nav>
      )}

      {admin && (
        <section className="dashboard-summary">
          <article>
            <span>Productos totales</span>
            <strong>{loadingProducts ? '...' : products.length}</strong>
          </article>
          <article>
            <span>Unidades en stock</span>
            <strong>{loadingProducts ? '...' : totalStock}</strong>
          </article>
          <article>
            <span>Stock bajo</span>
            <strong>{loadingProducts ? '...' : lowStockProducts.length}</strong>
          </article>
        </section>
      )}

      {admin && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{loadingProducts ? '...' : products.length}</h3>
            <p>Total de productos</p>
            <p className="stat-note">Los productos activos se muestran a los clientes.</p>
            <Link to="/products/new" className="btn btn-primary">
              Agregar producto
            </Link>
          </div>

          <div className="stat-card">
            <h3>{loadingProducts ? '...' : totalStock}</h3>
            <p>Unidades disponibles</p>
            <Link to="/products" className="btn btn-outline-primary">
              Revisar inventario
            </Link>
          </div>

          <div className="stat-card">
            <h3>{loadingProducts ? '...' : lowStockProducts.length}</h3>
            <p>Productos con stock bajo</p>
            <Link to="/products" className="btn btn-outline-primary">
              Gestionar stock
            </Link>
          </div>
        </div>
      )}

      {admin && (
        <section className="dashboard-stock-review">
          <div className="dashboard-stock-review__header">
            <h2>Unidades en stock por tipo</h2>
            <p>Resumen para validar que productos existen y cuantas unidades hay registradas.</p>
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

      <div className="dashboard-actions">
        <h2>Acciones rapidas</h2>
        <div className="action-grid">
          {admin ? (
            <>
              <Link to="/products/new" className="action-card">
                <h3>Nuevo producto</h3>
                <p>Agregar una prenda nueva a productos.</p>
              </Link>

              <Link to="/products" className="action-card">
                <h3>Ver productos</h3>
                <p>Consultar, editar o eliminar productos existentes.</p>
              </Link>

              <Link to="/payments" className="action-card">
                <h3>Ver pagos</h3>
                <p>Revisar los pagos registrados y el historial de pedidos.</p>
              </Link>
            </>
          ) : (
            <>
              <Link to="/products" className="action-card">
                <h3>Ver productos</h3>
                <p>Consultar precios, stock, tallas y caracteristicas.</p>
              </Link>

              <Link to="/cart" className="action-card">
                <h3>Ver carrito</h3>
                <p>Revisar los productos seleccionados y continuar al pago.</p>
              </Link>
            </>
          )}
        </div>
      </div>

      {admin && (
        <div className="dashboard-activity">
          <h2>Alertas de inventario</h2>
          {lowStockProducts.length === 0 && unavailableProducts.length === 0 ? (
            <p>No hay alertas por ahora. El inventario se ve estable.</p>
          ) : (
            <ul className="activity-list">
              {lowStockProducts.slice(0, 5).map((product) => (
                <li key={product.id}>{product.nombre}: quedan {product.stock} unidades.</li>
              ))}
              {unavailableProducts.slice(0, 5).map((product) => (
                <li key={product.id}>{product.nombre}: sin stock.</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  )
}
