import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { checkoutCart, checkoutPayment, clearCart, getCart, removeFromCart, updateCartQuantity } from '../services/cartService'

const formatPrice = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

const CartPage = () => {
  const [items, setItems] = useState(() => getCart())
  const [paymentMethod, setPaymentMethod] = useState('PSE')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerDocument, setCustomerDocument] = useState('')
  const [bank, setBank] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [order, setOrder] = useState(null)
  const [paymentError, setPaymentError] = useState('')
  const [processingPayment, setProcessingPayment] = useState(false)

  useEffect(() => {
    const handleCartUpdate = (event) => {
      setItems(event?.detail?.cart || getCart())
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [])

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

  const handleCheckout = async (event) => {
    event.preventDefault()
    setPaymentError('')

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

    if (paymentMethod === 'PSE' && !bank) {
      setPaymentError('Selecciona el banco para continuar con PSE.')
      return
    }

    if (paymentMethod.includes('Tarjeta')) {
      const cardDigits = cardNumber.replace(/\D/g, '')
      if (!cardName.trim() || cardDigits.length < 13 || !/^\d{2}\/\d{2}$/.test(cardExpiry) || !/^\d{3,4}$/.test(cardCvv)) {
        setPaymentError('Completa correctamente los datos de la tarjeta.')
        return
      }
    }

    try {
      setProcessingPayment(true)
      await checkoutPayment({
        customerName,
        customerEmail,
        paymentMethod: paymentMethod === 'PSE' ? `${paymentMethod} - ${bank}` : paymentMethod,
        amount: total,
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
          <strong>Pago confirmado.</strong> Pedido {order.id} registrado por {formatPrice(order.total)}.
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
                  Quitar
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

            <div className="payment-total">
              <span>💰 Total a pagar</span>
              <strong>{formatPrice(total)}</strong>
              <small>📦 {items.length} producto{items.length !== 1 ? 's' : ''} en el carrito</small>
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

              <section className="payment-form__section">
                <h3>Metodo de pago</h3>
                <div className="payment-methods" role="group" aria-label="Metodos de pago">
                  {['PSE', 'Tarjeta debito', 'Tarjeta credito', 'Pago en sede'].map((method) => (
                    <button
                      className={paymentMethod === method ? 'payment-method is-selected' : 'payment-method'}
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      type="button"
                    >
                      <span className="payment-method__icon">
                        {method === 'PSE' && '🏦'}
                        {method === 'Tarjeta debito' && '💳'}
                        {method === 'Tarjeta credito' && '💰'}
                        {method === 'Pago en sede' && '🏢'}
                      </span>
                      <strong>{method}</strong>
                      <span>{method === 'PSE' ? 'Banco en línea' : method.includes('Tarjeta') ? 'Pago inmediato' : 'Confirmación presencial'}</span>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'PSE' && (
                  <label>
                    Banco
                    <select className="form-control" onChange={(event) => setBank(event.target.value)} value={bank}>
                      <option value="">Selecciona tu banco</option>
                      <option value="Bancolombia">Bancolombia</option>
                      <option value="Davivienda">Davivienda</option>
                      <option value="Banco de Bogota">Banco de Bogota</option>
                      <option value="Nequi">Nequi</option>
                    </select>
                  </label>
                )}

                {paymentMethod.includes('Tarjeta') && (
                  <div className="card-fields">
                    <label>
                      Nombre en la tarjeta
                      <input
                        className="form-control"
                        onChange={(event) => setCardName(event.target.value)}
                        placeholder="Como aparece en la tarjeta"
                        value={cardName}
                      />
                    </label>
                    <label>
                      Numero de tarjeta
                      <input
                        className="form-control"
                        inputMode="numeric"
                        maxLength="19"
                        onChange={(event) => setCardNumber(event.target.value)}
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                      />
                    </label>
                    <div className="payment-form__grid">
                      <label>
                        Vence
                        <input
                          className="form-control"
                          maxLength="5"
                          onChange={(event) => setCardExpiry(event.target.value)}
                          placeholder="MM/AA"
                          value={cardExpiry}
                        />
                      </label>
                      <label>
                        CVV
                        <input
                          className="form-control"
                          inputMode="numeric"
                          maxLength="4"
                          onChange={(event) => setCardCvv(event.target.value)}
                          placeholder="123"
                          type="password"
                          value={cardCvv}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </section>

              {paymentError && <p className="checkout-error">⚠️ {paymentError}</p>}
              <button className="btn btn-success btn-lg btn-pay" disabled={processingPayment || total <= 0} type="submit">
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
