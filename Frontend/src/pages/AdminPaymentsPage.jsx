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

  useEffect(() => {
    getPayments()
      .then(setPayments)
      .catch(() => setError('No fue posible cargar los pagos.'))
      .finally(() => setLoading(false))
  }, [])

  const totalRevenue = useMemo(
    () => payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    [payments]
  )

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

      {!loading && !error && (
        <section className="payments-summary">
          <article>
            <span>Total de pagos</span>
            <strong>{payments.length}</strong>
          </article>
          <article>
            <span>Ingreso acumulado</span>
            <strong>{currencyFormat.format(totalRevenue)}</strong>
          </article>
        </section>
      )}

      {!loading && !error && payments.length === 0 && (
        <div className="empty-state">
          <h2>No hay pagos registrados</h2>
          <p>Las compras se registran cuando los clientes completan el pago en el carrito.</p>
        </div>
      )}

      {!loading && !error && payments.length > 0 && (
        <section className="payments-table">
          <div className="payments-table__header">
            <span>Fecha</span>
            <span>Cliente</span>
            <span>Método</span>
            <span>Monto</span>
            <span>Estado</span>
          </div>
          {payments.map((payment) => (
            <article className="payments-row" key={payment.id}>
              <span>{new Date(payment.createdAt).toLocaleString('es-CO')}</span>
              <span>{payment.customerName || payment.customerEmail}</span>
              <span>{payment.paymentMethod}</span>
              <span>{currencyFormat.format(Number(payment.amount || 0))}</span>
              <span>{payment.status || 'Confirmado'}</span>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default AdminPaymentsPage
