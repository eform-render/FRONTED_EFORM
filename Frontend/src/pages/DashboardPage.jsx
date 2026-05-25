import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../services/authServices'
import { isAdmin } from '../utils/roles'

export default function DashboardPage({ onLogout }) {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const admin = isAdmin(user)
  const [stats] = useState(() => ({
    totalProducts: Math.floor(Math.random() * 100) + 10,
    totalSets: Math.floor(Math.random() * 20) + 5,
    recentActivity: [
      'Producto nuevo agregado',
      'Set actualizado',
      'Inventario revisado',
    ],
  }))

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [navigate, user])

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  if (!user) {
    return <div className="loading">Cargando...</div>
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-header">
        <h1>Bienvenido, {user.username || user.email}</h1>
        <p>{admin ? 'Panel de control de gestion' : 'Explora el catalogo y administra tu carrito'}</p>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Cerrar sesion
        </button>
      </div>

      {admin && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{stats.totalProducts}</h3>
            <p>Total de Productos</p>
            <p className="stat-note">Los productos que agregues aqui se veran en el catalogo del cliente.</p>
            <Link to="/products/new" className="btn btn-primary">
              Agregar producto
            </Link>
          </div>

          <div className="stat-card">
            <h3>{stats.totalSets}</h3>
            <p>Total de Sets</p>
            <Link to="/sets" className="btn btn-outline-primary">
              Ver sets
            </Link>
          </div>
        </div>
      )}

      <div className="dashboard-actions">
        <h2>Acciones rapidas</h2>
        <div className="action-grid">
          {admin ? (
            <>
              <Link to="/products/new" className="action-card">
                <h3>Nuevo Producto</h3>
                <p>Agregar un producto nuevo al catálogo del cliente</p>
              </Link>

              <Link to="/sets" className="action-card">
                <h3>Crear Set</h3>
                <p>Ir a la página de sets para crear y editar combos</p>
              </Link>

              <Link to="/products" className="action-card">
                <h3>Ver Productos</h3>
                <p>Consultar y gestionar productos existentes</p>
              </Link>

              <Link to="/sets" className="action-card">
                <h3>Gestionar Sets</h3>
                <p>Administrar sets existentes</p>
              </Link>
            </>
          ) : (
            <>
              <Link to="/products" className="action-card">
                <h3>Ver catalogo</h3>
                <p>Consultar productos, precios, stock y caracteristicas</p>
              </Link>

              <Link to="/cart" className="action-card">
                <h3>Ver carrito</h3>
                <p>Revisar los productos seleccionados</p>
              </Link>
            </>
          )}
        </div>
      </div>

      {admin && (
        <div className="dashboard-activity">
          <h2>Actividad reciente</h2>
          <ul className="activity-list">
            {stats.recentActivity.map((activity) => (
              <li key={activity}>{activity}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}
