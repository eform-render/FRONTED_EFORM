import { useEffect, useMemo, useState } from 'react'
import React from 'react'
import { Link } from 'react-router-dom'
import { getPayments, updatePaymentStatus } from '../services/paymentService'

const currencyFormat = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [sortField, setSortField] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState('desc')
  const [updatingStatus, setUpdatingStatus] = useState(null)
  const [expandedPayment, setExpandedPayment] = useState(null)
  const [pendingStatusChange, setPendingStatusChange] = useState(null)
  const [observation, setObservation] = useState('')
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

  const handleStatusChange = (paymentId, newStatus) => {
    if (newStatus === 'CANCELADO' || newStatus === 'ENVIADO') {
      setExpandedPayment(paymentId)
      setPendingStatusChange({ paymentId, newStatus })
      setObservation('')
    } else {
      confirmStatusChange(paymentId, newStatus, '')
    }
  }

  const confirmStatusChange = async (paymentId, newStatus, obs) => {
    try {
      setUpdatingStatus(paymentId)
      setError('')
      await updatePaymentStatus(paymentId, newStatus, obs)
      setSuccess('Estado actualizado correctamente')

      // Actualizar la lista sin recargar
      setPayments(payments.map(p =>
        p.id === paymentId ? { ...p, status: newStatus, observation: obs } : p
      ))

      setExpandedPayment(null)
      setPendingStatusChange(null)
      setObservation('')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('No fue posible actualizar el estado del pedido.')
      console.error(err)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const cancelExpanded = () => {
    setExpandedPayment(null)
    setPendingStatusChange(null)
    setObservation('')
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
      {success && <div className="alert alert-success">{success}</div>}

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
                  <React.Fragment key={payment.id}>
                    <tr className={`payment-row`}>
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
                        <select
                          value={payment.status || 'PENDIENTE'}
                          onChange={(e) => handleStatusChange(payment.id, e.target.value)}
                          disabled={updatingStatus === payment.id}
                          className="status-select"
                        >
                          <option value="PENDIENTE">Pendiente</option>
                          <option value="CONFIRMADO">Confirmado</option>
                          <option value="ENVIADO">Enviado</option>
                          <option value="COMPLETADO">Completado</option>
                          <option value="CANCELADO">Cancelado</option>
                        </select>
                      </td>
                    </tr>

                    {expandedPayment === payment.id && pendingStatusChange && (
                      <tr className="expanded-row">
                        <td colSpan="6" style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                              Agregar observación para {pendingStatusChange.newStatus}:
                            </label>
                            <textarea
                              value={observation}
                              onChange={(e) => setObservation(e.target.value)}
                              placeholder="Escriba una observación (opcional)..."
                              rows="3"
                              style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                fontFamily: 'inherit',
                                fontSize: '14px',
                                resize: 'vertical',
                              }}
                            />
                          </div>
                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={cancelExpanded}
                              type="button"
                              disabled={updatingStatus === payment.id}
                            >
                              Cancelar
                            </button>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() =>
                                confirmStatusChange(payment.id, pendingStatusChange.newStatus, observation)
                              }
                              disabled={updatingStatus === payment.id}
                              type="button"
                            >
                              {updatingStatus === payment.id ? 'Guardando...' : 'Guardar y Notificar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
