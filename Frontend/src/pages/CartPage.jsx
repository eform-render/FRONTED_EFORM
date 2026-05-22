import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { clearCart, getCart, removeFromCart, updateCartQuantity } from '../services/cartService'

const formatPrice = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

const CartPage = () => {
  const [items, setItems] = useState(() => getCart())

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.precio || 0) * Number(item.quantity || 1), 0)
  }, [items])

  const getProductQuantityInCart = (productId) => {
    return items
      .filter((item) => item.id === productId)
      .reduce((sum, item) => sum + Number(item.quantity || 1), 0)
  }

  const handleRemove = (item) => {
    setItems(removeFromCart(item.id, item.selectedSize))
  }

  const handleQuantity = (item, nextQuantity) => {
    setItems(updateCartQuantity(item.id, nextQuantity, item.selectedSize))
  }

  const handleClear = () => {
    clearCart()
    setItems([])
  }

  return (
    <main className="products-page">
      <section className="page-header">
        <div>
          <span className="home-eyebrow">Carrito</span>
          <h1>Productos seleccionados</h1>
          <p>Revisa los productos que agregaste antes de continuar con tu pedido.</p>
        </div>
        <Link className="btn btn-outline-primary" to="/products">
          Seguir viendo productos
        </Link>
      </section>

      {items.length === 0 ? (
        <div className="empty-state">
          <h2>Tu carrito esta vacio</h2>
          <p>Agrega productos desde el catalogo para verlos aqui.</p>
          <Link className="btn btn-primary" to="/products">
            Ver catalogo
          </Link>
        </div>
      ) : (
        <section className="cart-panel">
          <div className="cart-list">
            {items.map((item) => (
              <article className="cart-item" key={`${item.id}-${item.selectedSize || 'M'}`}>
                <div className="cart-item__info">
                  <span className="cart-item__tag">Producto</span>
                  <h3>{item.nombre}</h3>
                  <p>{item.descripcion || 'Producto sin descripcion registrada.'}</p>
                  <strong className="cart-item__size">Talla {item.selectedSize || 'M'}</strong>
                  <span className="cart-item__available">
                    Disponibles: {Number(item.stock || 0)} | En carrito: {getProductQuantityInCart(item.id)}
                  </span>
                </div>
                <div className="cart-item__price">
                  <span>Precio unitario</span>
                  <strong>{formatPrice(item.precio)}</strong>
                </div>
                <div className="quantity-stepper" aria-label={`Cantidad de ${item.nombre}`}>
                  <button
                    aria-label="Disminuir cantidad"
                    disabled={Number(item.quantity || 1) <= 1}
                    onClick={() => handleQuantity(item, Number(item.quantity || 1) - 1)}
                    type="button"
                  >
                    -
                  </button>
                  <input
                    aria-label="Cantidad"
                    max={Number(item.stock || 0)}
                    min="1"
                    onChange={(event) => handleQuantity(item, event.target.value)}
                    type="number"
                    value={item.quantity}
                  />
                  <button
                    aria-label="Aumentar cantidad"
                    disabled={getProductQuantityInCart(item.id) >= Number(item.stock || 0)}
                    onClick={() => handleQuantity(item, Number(item.quantity || 1) + 1)}
                    type="button"
                  >
                    +
                  </button>
                </div>
                <div className="cart-item__subtotal">
                  <span>Subtotal</span>
                  <strong>{formatPrice(Number(item.precio || 0) * Number(item.quantity || 1))}</strong>
                </div>
                <button className="cart-remove" onClick={() => handleRemove(item)} type="button">
                  Quitar
                </button>
              </article>
            ))}
          </div>

          <div className="cart-summary">
            <div>
              <span>Total estimado</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <div className="cart-summary__actions">
              <Link className="btn btn-primary" to="/products">
                Agregar mas productos
              </Link>
              <button className="btn btn-outline-danger" onClick={handleClear} type="button">
                Vaciar carrito
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

export default CartPage
