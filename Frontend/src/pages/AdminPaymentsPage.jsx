import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPayments } from '../services/paymentService'

const currencyFormat = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortField, setSortField] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState('desc')
  // deletion is disabled from frontend by design

  useEffect(() => {
    getPayments()
      .then(setPayments)
      .catch(() => setError('No fue posible cargar los pagos.'))
      .finally(() => setLoading(false))
  }, [])

  // deletion handled directly in database; frontend does not provide delete controls

  const totalRevenue = useMemo(
    () => payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    [payments]
  )

  const sortedPayments = useMemo(() => {
    const sorted = [...payments].sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (sortField === 'amount') {
        aVal = Number(aVal || 0)
        bVal = Number(bVal || 0)
      } else if (sortField === 'createdAt') {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [payments, sortField, sortDirection])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const getStatusBadgeClass = (status) => {
    const normalizedStatus = (status || 'Confirmado').toLowerCase()
    if (normalizedStatus.includes('completado') || normalizedStatus.includes('confirmado')) {
      return 'status-badge status-completed'
    } else if (normalizedStatus.includes('pendiente')) {
      return 'status-badge status-pending'
    } else if (normalizedStatus.includes('fallido') || normalizedStatus.includes('cancelado')) {
      return 'status-badge status-failed'
    }
    return 'status-badge status-completed'
  }

  return (
    <main className="admin-payments-page">
      <section className="page-header">
        <div>
          <span className="home-eyebrow">Pagos recibidos</span>
          <h1>Historial de pagos</h1>
          <p>Revisa los pedidos confirmados y el resumen de transacciones registradas en el sistema.</p>
        </div>
        <Link className="btn btn-outline-primary" to="/dashboard">
          Volver al panel
        </Link>
      </section>

      {loading && <div className="catalog-message">Cargando pagos...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Resumen superior eliminado: ya se muestra en el panel de estadísticas */}

      {!loading && !error && payments.length === 0 && (
        <div className="empty-state">
          <h2>No hay pagos registrados</h2>
          <p>Las compras se registran cuando los clientes completan el pago en el carrito.</p>
        </div>
      )}

      {!loading && !error && payments.length > 0 && (
        <section className="payments-container">
          <div className="payments-stats">
            <div className="stat-box">
              <h3>Total de transacciones</h3>
              <p className="stat-number">{payments.length}</p>
            </div>
            <div className="stat-box">
              <h3>Ingresos totales</h3>
              <p className="stat-number highlight">{currencyFormat.format(totalRevenue)}</p>
            </div>
            <div className="stat-box">
              <h3>Promedio por transacción</h3>
              <p className="stat-number">{currencyFormat.format(totalRevenue / payments.length)}</p>
            </div>
          </div>

          <div className="table-wrapper">
            <div className="table-actions">{/* Eliminación deshabilitada en el frontend */}</div>
            <table className="payments-table">
              <thead>
                <tr>
                  {/* checkbox column removed - deletion disabled in UI */}
                  <th onClick={() => handleSort('createdAt')} className="sortable">
                    Fecha {sortField === 'createdAt' && <span className={`sort-icon ${sortDirection}`}>⇅</span>}
                  </th>
                  <th onClick={() => handleSort('customerName')} className="sortable">
                    Cliente {sortField === 'customerName' && <span className={`sort-icon ${sortDirection}`}>⇅</span>}
                  </th>
                  <th>Email</th>
                  <th onClick={() => handleSort('paymentMethod')} className="sortable">
                    Método {sortField === 'paymentMethod' && <span className={`sort-icon ${sortDirection}`}>⇅</span>}
                  </th>
                  <th onClick={() => handleSort('amount')} className="sortable text-right">
                    Monto {sortField === 'amount' && <span className={`sort-icon ${sortDirection}`}>⇅</span>}
                  </th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {sortedPayments.map((payment) => (
                  <tr key={payment.id} className={`payment-row`}>
                    <td className="date-cell">
                      <div className="date-badge">{new Date(payment.createdAt).toLocaleDateString('es-CO')}</div>
                      <small>{new Date(payment.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</small>
                    </td>
                    <td className="customer-cell">
                      <strong>{payment.customerName || 'Cliente sin nombre'}</strong>
                    </td>
                    <td className="email-cell">
                      <small>{payment.customerEmail}</small>
                    </td>
                    <td className="method-cell">
                      <span className="method-badge">{payment.paymentMethod}</span>
                    </td>
                    <td className="amount-cell">
                      <strong>{currencyFormat.format(Number(payment.amount || 0))}</strong>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(payment.status)}>
                        {payment.status || 'Confirmado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  )
}

export default AdminPaymentsPage
