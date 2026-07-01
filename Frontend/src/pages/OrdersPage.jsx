import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMyOrders } from '../services/paymentService'
import { getCurrentUser } from '../services/authServices'

const currencyFormat = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

const getStatusBadgeClass = (status) => {
  const normalizedStatus = (status || 'PENDIENTE').toUpperCase()
  if (normalizedStatus.includes('COMPLETADO') || normalizedStatus.includes('CONFIRMADO')) {
    return 'status-badge status-completed'
  } else if (normalizedStatus.includes('PENDIENTE')) {
    return 'status-badge status-pending'
  } else if (normalizedStatus.includes('CANCELADO')) {
    return 'status-badge status-failed'
  } else if (normalizedStatus.includes('ENVIADO')) {
    return 'status-badge status-pending'
  }
  return 'status-badge status-pending'
}

const OrdersPage = () => {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const [orderDetails, setOrderDetails] = useState({})
  const [loadingDetails, setLoadingDetails] = useState({})

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getMyOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error al cargar pedidos:', err)
      setError('No fue posible cargar tus pedidos.')
    } finally {
      setLoading(false)
    }
  }

  const toggleOrderDetails = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null)
      return
    }

    if (orderDetails[orderId]) {
      setExpandedOrderId(orderId)
      return
    }

    setLoadingDetails((prev) => ({ ...prev, [orderId]: true }))
    try {
      const { getOrderDetails } = await import('../services/paymentService')
      const details = await getOrderDetails(orderId)
      setOrderDetails((prev) => ({ ...prev, [orderId]: details }))
      setExpandedOrderId(orderId)
    } catch (err) {
      console.error('Error al cargar detalles:', err)
      alert('No fue posible cargar los detalles del pedido')
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [orderId]: false }))
    }
  }

  if (loading) {
    return <div className="loading">Cargando tus pedidos...</div>
  }

  return (
    <main className="orders-page products-page">
      <section className="page-header">
        <div>
          <span className="home-eyebrow">Mis pedidos</span>
          <h1>Historial de compras</h1>
          <p>Revisa el estado y los detalles de tus pedidos.</p>
        </div>
        <div className="page-header__actions">
          <Link className="btn btn-outline-primary" to="/products">
            Seguir comprando
          </Link>
        </div>
      </section>

      {error && <div className="alert alert-danger">{error}</div>}

      {orders.length === 0 ? (
        <section className="empty-state">
          <h2>No tienes pedidos aún</h2>
          <p>Cuando realices una compra, aparecerá aquí el historial de tus pedidos.</p>
          <Link className="btn btn-primary" to="/products">
            Ir a comprar
          </Link>
        </section>
      ) : (
        <section className="orders-container">
          <div className="table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Número de Pedido</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th>Método de Pago</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">
                      <strong>#{order.id}</strong>
                    </td>
                    <td className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('es-CO')}
                      <br />
                      <small>{new Date(order.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</small>
                    </td>
                    <td className="order-amount">
                      <strong>{currencyFormat.format(Number(order.amount || 0))}</strong>
                    </td>
                    <td className="order-method">
                      <span className="method-badge">{order.paymentMethod}</span>
                    </td>
                    <td className="order-status">
                      <span className={getStatusBadgeClass(order.status)}>
                        {order.status || 'PENDIENTE'}
                      </span>
                    </td>
                    <td className="order-actions">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => toggleOrderDetails(order.id)}
                        disabled={loadingDetails[order.id]}
                      >
                        {expandedOrderId === order.id ? 'Ocultar' : 'Ver detalles'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
      {expandedOrderId && orderDetails[expandedOrderId] && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setExpandedOrderId(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Productos del Pedido #{expandedOrderId}</h2>
              <button
                onClick={() => setExpandedOrderId(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#999',
                }}
              >
                ✕
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '14px' }}>Producto</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>Cantidad</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '14px' }}>Precio</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails[expandedOrderId].items && orderDetails[expandedOrderId].items.length > 0 ? (
                  orderDetails[expandedOrderId].items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px', fontSize: '14px' }}>{item.productName}</td>
                      <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>{item.quantity}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px' }}>
                        {currencyFormat.format(item.productPrice)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                      No hay productos disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setExpandedOrderId(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
          </div>
        </section>
      )}
    </main>
  )
}

export default OrdersPage
