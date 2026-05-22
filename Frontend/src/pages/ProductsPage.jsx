import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAll, remove } from '../services/productService'
import { addToCart, getCart } from '../services/cartService'
import ProductCard from '../components/products/ProductCard'
import { getApiErrorMessage } from '../utils/apiError'
import { isAdmin } from '../utils/roles'

const ProductPage = ({ user }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filter, setFilter] = useState('')
  const [cartQuantity, setCartQuantity] = useState(() =>
    getCart().reduce((sum, item) => sum + Number(item.quantity || 1), 0)
  )
  const admin = isAdmin(user)

  useEffect(() => {
    getAll()
      .then(setProducts)
      .catch((apiError) => setError(getApiErrorMessage(apiError, 'Error al cargar productos.')))
      .finally(() => setLoading(false))
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.nombre?.toLowerCase().includes(filter.trim().toLowerCase())
    )
  }, [filter, products])

  const totalStock = useMemo(() => {
    return products.reduce((sum, product) => sum + Number(product.stock || 0), 0)
  }, [products])

  const lowStockCount = useMemo(() => {
    return products.filter((product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5).length
  }, [products])

  const handleDelete = async (id) => {
    const shouldDelete = confirm('Quieres eliminar este producto?')
    if (!shouldDelete) return

    try {
      await remove(id)
      setProducts(products.filter((p) => p.id !== id))
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'No fue posible eliminar el producto.'))
    }
  }

  const handleAddToCart = (product) => {
    const result = addToCart(product)
    setCartQuantity(result.cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0))
    setSuccess(result.added ? result.message : '')
    setError(result.added ? '' : result.message)
  }

  return (
    <main className="products-page">
      <section className="page-header">
        <div>
          <span className="home-eyebrow">Catalogo EFORM</span>
          <h1>{admin ? 'Inventario de productos' : 'Productos disponibles'}</h1>
          <p>
            {admin
              ? 'Administra uniformes, fotos, precios y cantidades disponibles para los aprendices.'
              : 'Consulta las caracteristicas de cada producto y agrega al carrito lo que necesitas.'}
          </p>
        </div>
        {admin ? (
          <Link className="btn btn-primary btn-lg" to="/products/new">
            Nuevo producto
          </Link>
        ) : (
          <Link className="btn btn-outline-primary btn-lg" to="/cart">
            Ver carrito
          </Link>
        )}
      </section>

      <section className="toolbar-panel">
        <input
          className="form-control"
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Buscar producto por nombre"
          value={filter}
        />
        <span>{filteredProducts.length} producto(s)</span>
      </section>

      <section className="role-summary" aria-label={admin ? 'Resumen de inventario' : 'Resumen del catalogo'}>
        {admin ? (
          <>
            <article>
              <span>Productos activos</span>
              <strong>{products.length}</strong>
            </article>
            <article>
              <span>Unidades en stock</span>
              <strong>{totalStock}</strong>
            </article>
            <article>
              <span>Stock bajo</span>
              <strong>{lowStockCount}</strong>
            </article>
          </>
        ) : (
          <>
            <article>
              <span>Disponibles</span>
              <strong>{products.filter((product) => Number(product.stock || 0) > 0).length}</strong>
            </article>
            <article>
              <span>En tu carrito</span>
              <strong>{cartQuantity}</strong>
            </article>
            <article>
              <span>Resultados</span>
              <strong>{filteredProducts.length}</strong>
            </article>
          </>
        )}
      </section>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      {loading && <div className="catalog-message">Cargando productos...</div>}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="empty-state">
          <h2>No hay productos para mostrar</h2>
          <p>{admin ? 'Crea el primer uniforme o cambia el filtro de busqueda.' : 'Cambia el filtro de busqueda.'}</p>
          {admin && (
            <Link className="btn btn-primary" to="/products/new">
              Crear producto
            </Link>
          )}
        </div>
      )}

      {!loading && filteredProducts.length > 0 && (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              isAdmin={admin}
              key={product.id}
              onAddToCart={handleAddToCart}
              onDelete={admin ? handleDelete : undefined}
              product={product}
            />
          ))}
        </div>
      )}
    </main>
  )
}

export default ProductPage
