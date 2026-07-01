import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { checkoutCart, checkoutPayment, clearCart, getCart, removeFromCart, updateCartQuantity } from '../services/cartService'
import { getCurrentUser } from '../services/authServices'

const formatPrice = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

const CartPage = () => {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [items, setItems] = useState(() => getCart())
  const [paymentMethod, setPaymentMethod] = useState('Nequi')
  const [deliveryMethod, setDeliveryMethod] = useState('domicilio')
  const [customerName, setCustomerName] = useState(user?.name || '')
  const [customerEmail, setCustomerEmail] = useState(user?.email || '')
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '')
  const [customerDocument, setCustomerDocument] = useState(user?.document || '')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [order, setOrder] = useState(null)
  const [paymentError, setPaymentError] = useState('')
  const [processingPayment, setProcessingPayment] = useState(false)

  const SHIPPING_COST = 5500

  useEffect(() => {
    const handleCartUpdate = (event) => {
      setItems(event?.detail?.cart || getCart())
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [])

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.precio || 0) * Number(item.quantity || 1), 0)
  }, [items])

  const shippingCost = useMemo(() => {
    return deliveryMethod === 'recoge' ? 0 : SHIPPING_COST
  }, [deliveryMethod])

  const total = subtotal + shippingCost

  const getProductQuantityInCart = (productId) => {
    return items
      .filter((item) => item.id === productId)
      .reduce((sum, item) => sum + Number(item.quantity || 1), 0)
  }

  const handleRemove = (item) => {
    setItems(removeFromCart(item.id, item.selectedSize))
  }

  const handleQuantity = (item, nextQuantity) => {
    if (nextQuantity <= 0) {
      setItems(removeFromCart(item.id, item.selectedSize))
      return
    }

    setItems(updateCartQuantity(item.id, nextQuantity, item.selectedSize))
  }

  const handleClear = () => {
    clearCart()
    setItems([])
  }

  const handleCheckout = async (event) => {
    event.preventDefault()
    setPaymentError('')

    if (!user) {
      navigate('/login', { state: { from: '/cart' } })
      return
    }

    if (!customerName.trim() || !customerEmail.trim()) {
      setPaymentError('Completa tu nombre y correo para confirmar el pago.')
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(customerEmail.trim())) {
      setPaymentError('Ingresa un correo valido para recibir la confirmacion.')
      return
    }

    if (!customerDocument.trim() || !customerPhone.trim()) {
      setPaymentError('Completa tu documento y telefono de contacto.')
      return
    }

    if (deliveryMethod === 'domicilio' && !deliveryAddress.trim()) {
      setPaymentError('Completa tu dirección de entrega.')
      return
    }

    try {
      setProcessingPayment(true)
      await checkoutPayment({
        customerName,
        customerEmail,
        paymentMethod,
        amount: total,
        deliveryMethod,
        deliveryAddress,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      })

      const confirmedOrder = checkoutCart()
      setOrder({ ...confirmedOrder, customerName, customerEmail, paymentMethod })
      setItems([])
    } catch {
      setPaymentError('No se pudo procesar el pago. Revisa tu conexión e intenta nuevamente.')
    } finally {
      setProcessingPayment(false)
    }
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

      {order && (
        <div className="alert alert-success checkout-success">
          <strong>Pago confirmado.</strong> Pedido {order.id} registrado por {formatPrice(total)}.
        </div>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <h2>Tu carrito esta vacio</h2>
          <p>{order ? 'Tu pedido quedo registrado correctamente.' : 'Agrega productos desde productos para verlos aqui.'}</p>
          <Link className="btn btn-primary" to="/products">
            Ver productos
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
                    onClick={() => handleQuantity(item, Number(item.quantity || 1) - 1)}
                    type="button"
                  >
                    -
                  </button>
                  <input
                    aria-label="Cantidad"
                    max={Number(item.stock || 0)}
                    min="1"
                    readOnly
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
                  Eliminar
                </button>
              </article>
            ))}
          </div>

          <aside className="payment-gateway">
            <div className="payment-gateway__header">
              <span>Pasarela de pago</span>
              <h2>Finalizar compra</h2>
              <p>Confirma tus datos y el metodo de pago para registrar el pedido.</p>
            </div>

            <form className="checkout-form payment-form" onSubmit={handleCheckout}>
              <section className="payment-form__section">
                <h3>Datos del comprador</h3>
                <label>
                  Nombre completo
                  <input
                    className="form-control"
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Tu nombre"
                    value={customerName}
                  />
                </label>
                <label>
                  Correo
                  <input
                    className="form-control"
                    onChange={(event) => setCustomerEmail(event.target.value)}
                    placeholder="correo@ejemplo.com"
                    type="email"
                    value={customerEmail}
                  />
                </label>
                <div className="payment-form__grid">
                  <label>
                    Documento
                    <input
                      className="form-control"
                      onChange={(event) => setCustomerDocument(event.target.value)}
                      placeholder="CC o TI"
                      value={customerDocument}
                    />
                  </label>
                  <label>
                    Telefono
                    <input
                      className="form-control"
                      onChange={(event) => setCustomerPhone(event.target.value)}
                      placeholder="300 000 0000"
                      value={customerPhone}
                    />
                  </label>
                </div>
              </section>

              {deliveryMethod === 'domicilio' && (
                <section className="payment-form__section">
                  <h3>Dirección de entrega</h3>
                  <label>
                    Dirección completa
                    <input
                      className="form-control"
                      onChange={(event) => setDeliveryAddress(event.target.value)}
                      placeholder="Calle, número, apartamento, ciudad"
                      value={deliveryAddress}
                    />
                  </label>
                </section>
              )}

              <section className="payment-form__section">
                <h3>Método de entrega</h3>
                <div className="payment-methods" role="group" aria-label="Métodos de entrega">
                  {[
                    { value: 'domicilio', label: 'Envío a domicilio', description: `+${formatPrice(SHIPPING_COST)}` },
                    { value: 'recoge', label: 'Cliente recoge', description: 'Sin costo adicional' }
                  ].map((method) => (
                    <button
                      className={deliveryMethod === method.value ? 'payment-method is-selected' : 'payment-method'}
                      key={method.value}
                      onClick={() => setDeliveryMethod(method.value)}
                      type="button"
                    >
                      <span className="payment-method__icon">
                        {method.value === 'domicilio' && '🚚'}
                        {method.value === 'recoge' && '🏪'}
                      </span>
                      <strong>{method.label}</strong>
                      <span>{method.description}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="payment-form__section">
                <h3>Metodo de pago</h3>
                <div className="payment-methods" role="group" aria-label="Metodos de pago">
                  {[
                    { value: 'Nequi', label: 'Nequi', description: 'Pago inmediato' },
                    { value: 'Transferencia BRE-BE', label: 'Transferencia BRE-BE', description: 'Transferencia electrónica' },
                    { value: 'Pago contra entrega', label: 'Pago contra entrega', description: 'Paga al recibir' }
                  ].map((method) => (
                    <button
                      className={paymentMethod === method.value ? 'payment-method is-selected' : 'payment-method'}
                      key={method.value}
                      onClick={() => setPaymentMethod(method.value)}
                      type="button"
                    >
                      <span className="payment-method__icon">
                        {method.value === 'Nequi' && '📱'}
                        {method.value === 'Transferencia BRE-BE' && '💳'}
                        {method.value === 'Pago contra entrega' && '🏠'}
                      </span>
                      <strong>{method.label}</strong>
                      <span>{method.description}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="payment-form__section">
                <h3>Resumen del pedido</h3>
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal productos</span>
                    <strong>{formatPrice(subtotal)}</strong>
                  </div>
                  {shippingCost > 0 && (
                    <div className="summary-row">
                      <span>Domicilio/Envío</span>
                      <strong>{formatPrice(shippingCost)}</strong>
                    </div>
                  )}
                  <div className="summary-row summary-total">
                    <span>TOTAL A PAGAR</span>
                    <strong>{formatPrice(total)}</strong>
                  </div>
                </div>
              </section>

              {paymentError && <p className="checkout-error">⚠️ {paymentError}</p>}
              <button className="btn btn-success btn-lg btn-pay" disabled={processingPayment || subtotal <= 0} type="submit">
                {processingPayment ? '⏳ Procesando pago...' : `✓ Pagar ${formatPrice(total)}`}
              </button>
            </form>

            <div className="cart-summary__actions">
              <Link className="btn btn-primary" to="/products">
                Agregar mas productos
              </Link>
              <button className="btn btn-outline-danger" onClick={handleClear} type="button">
                Vaciar carrito
              </button>
            </div>
          </aside>
        </section>
      )}
    </main>
  )
}

export default CartPage
