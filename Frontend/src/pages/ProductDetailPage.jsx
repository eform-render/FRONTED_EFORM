import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getById } from '../services/productService'
import { addToCart, getCart } from '../services/cartService'
import { getApiErrorMessage } from '../utils/apiError'
import { isAdmin } from '../utils/roles'

const formatPrice = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

const ProductDetailPage = ({ user }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cartError, setCartError] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [addedCount, setAddedCount] = useState(0)
  const admin = isAdmin(user)
  const sizes = product?.tallasDisponibles?.length ? product.tallasDisponibles : ['Unica']

  useEffect(() => {
    getById(id)
      .then((data) => {
        const availableSizes = data?.tallasDisponibles?.length ? data.tallasDisponibles : ['Unica']
        setProduct(data)
        setSelectedSize(availableSizes[0])
      })
      .catch((apiError) => setError(getApiErrorMessage(apiError, 'Producto no encontrado.')))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    const handler = (e) => {
      const cart = (e && e.detail && e.detail.cart) ? e.detail.cart : getCart()
      setProduct((prev) => {
        if (!prev) return prev
        const qtyInCart = cart
          .filter((it) => it.id === prev.id)
          .reduce((sum, it) => sum + Number(it.quantity || 1), 0)
        return { ...prev, stock: Math.max(0, Number(prev.stock || 0) - qtyInCart) }
      })
    }

    const onReserveFailed = (e) => {
      const message = e && e.detail && e.detail.message ? e.detail.message : 'No fue posible reservar el producto.'
      setCartError(message)
    }

    window.addEventListener('cartUpdated', handler)
    window.addEventListener('cartReserveFailed', onReserveFailed)
    return () => {
      window.removeEventListener('cartUpdated', handler)
      window.removeEventListener('cartReserveFailed', onReserveFailed)
    }
  }, [id])

  useEffect(() => {
    if (!product || !selectedSize) return

    const item = getCart().find(
      (cartItem) => cartItem.id === product.id && (cartItem.selectedSize || 'Unica') === selectedSize
    )
    setAddedCount(item?.quantity || 0)
  }, [product, selectedSize])

  if (loading) return <div className="catalog-message">Cargando producto...</div>

  if (error) {
    return (
      <main className="form-page">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>
          Volver a productos
        </button>
      </main>
    )
  }

  return (
    <main className="form-page">
      <section className="product-detail">
        <div className="product-detail__layout">
          <div className="product-detail__image">
            {product.imageUrl ? <img src={product.imageUrl} alt={product.nombre} /> : <span>Sin imagen</span>}
          </div>

          <div>
            <span className="home-eyebrow">Detalle del producto</span>
            <h1>{product.nombre}</h1>
            <p>{product.descripcion || 'Producto sin descripcion registrada.'}</p>
          </div>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {cartError && <div className="alert alert-danger">{cartError}</div>}

        <div className="product-detail__summary">
          <span>Precio</span>
          <strong>{formatPrice(product.precio)}</strong>
          <span>Stock disponible</span>
          <strong>{product.stock}</strong>
        </div>

        {!admin && (
          <div className="size-picker">
            <span>Escoge tu talla</span>
            <div className="size-picker__options" role="group" aria-label="Tallas disponibles">
              {sizes.map((size) => (
                <button
                  className={selectedSize === size ? 'size-picker__option is-selected' : 'size-picker__option'}
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  type="button"
                >
                  {size}
                </button>
              ))}
            </div>
            <p>Talla seleccionada: {selectedSize}</p>
          </div>
        )}

        <div className="product-card__actions">
          <Link className="btn btn-outline-primary" to="/products">
            Volver
          </Link>
          {admin ? (
            <Link className="btn btn-primary" to={`/products/${product.id}/edit`}>
              Editar producto
            </Link>
          ) : (
            <button
              className="btn btn-primary"
              disabled={Number(product.stock || 0) === 0}
              onClick={() => {
                const result = addToCart({ ...product, selectedSize })
                setSuccess(result.added ? result.message : '')
                setCartError(result.added ? '' : result.message)
                if (result.added) {
                  const item = result.cart.find(
                    (cartItem) => cartItem.id === product.id && (cartItem.selectedSize || 'Unica') === selectedSize
                  )
                  setAddedCount(item?.quantity || 0)
                }
              }}
              type="button"
            >
              Agregar al carrito
              {addedCount > 0 && <span className="cart-button-count">{addedCount}</span>}
            </button>
          )}
        </div>
      </section>
    </main>
  )
}

export default ProductDetailPage
