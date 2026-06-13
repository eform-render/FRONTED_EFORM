import axiosClient from '../api/axiosClient'

const renamedUniformImages = {
  'blanco y azul.jpeg': 'Camisa Salud y Farmacia Hombre.webp',
  'gris.jpeg': 'Camisa Apoyo Administrativo Mujer.webp',
  'pantalon_azul.jpeg': 'Pantalon Salud y Farmacia.webp',
  'WhatsApp Image 2026-05-12 at 6.55.09 PM (1).jpeg': 'Pantalon Enfermeria Hombre.webp',
  'WhatsApp Image 2026-05-12 at 6.55.09 PM.jpeg': 'Camisa Cosmetologia.webp',
  'WhatsApp Image 2026-05-12 at 6.55.10 PM (1).jpeg': 'Camisa Limpieza.webp',
  'WhatsApp Image 2026-05-12 at 6.55.10 PM.jpeg': 'Camisa Enfermeria Mujer.webp',
  'WhatsApp Image 2026-06-06 at 12.21.27 PM (1).jpeg': 'Pantalon Enfermeria Mujer.webp',
  'WhatsApp Image 2026-06-06 at 12.21.28 PM (1).jpeg': 'Pantalon Cocina.webp',
  'WhatsApp Image 2026-06-06 at 12.21.28 PM (3).jpeg': 'Sudadera Actividad Fisica Hombre.webp',
  'WhatsApp Image 2026-06-06 at 12.21.29 PM (1).jpeg': 'Camisa Actividad Fisica Hombre.webp',
  'WhatsApp Image 2026-06-06 at 12.21.29 PM (2).jpeg': 'Camisa Actividad Fisica Mujer.webp',
  'WhatsApp Image 2026-06-06 at 12.21.29 PM.jpeg': 'Sudadera Actividad Fisica Mujer.webp',
  'WhatsApp Image 2026-06-06 at 12.21.30 PM (1).jpeg': 'Camisa Enfermeria Hombre.webp',
  'WhatsApp Image 2026-06-06 at 12.21.30 PM (2).jpeg': 'Camisa Cocina.webp',
  'WhatsApp Image 2026-06-06 at 12.21.30 PM (3).jpeg': 'Camisa Limpieza.webp',
  'WhatsApp Image 2026-06-06 at 12.21.30 PM.jpeg': 'Camisa Cosmetologia.webp',
  'WhatsApp Image 2026-06-06 at 12.21.31 PM (1).jpeg': 'Pantalon Limpieza.webp',
  'WhatsApp Image 2026-06-06 at 12.21.31 PM (2).jpeg': 'Pantalon Cosmetologia.webp',
  'WhatsApp Image 2026-06-06 at 12.21.31 PM.jpeg': 'Camisa Polo Blanca.webp',
  'WhatsApp Image 2026-06-06 at 12.21.32 PM (1).jpeg': 'Camisa Polo Negra.webp',
  'WhatsApp Image 2026-06-06 at 12.21.32 PM (2).jpeg': 'Camisa Polo Verde.webp',
  'WhatsApp Image 2026-06-06 at 12.21.33 PM (1).jpeg': 'Camisa Institucional Hombre.webp',
  'WhatsApp Image 2026-06-06 at 12.21.33 PM (2).jpeg': 'Camisa Gestion Administratica Mujer.webp',
  'WhatsApp Image 2026-06-06 at 12.21.33 PM.jpeg': 'Camisa Apoyo Administrativo Mujer.webp',
  'WhatsApp Image 2026-06-06 at 12.21.34 PM (1).jpeg': 'Delantal Mesa y Bar.webp',
  'WhatsApp Image 2026-06-06 at 12.21.34 PM (2).jpeg': 'Gorro Cocina.webp',
  'WhatsApp Image 2026-06-06 at 12.21.34 PM.jpeg': 'Camisa Salud y Farmacia Mujer.webp',
  'WhatsApp Image 2026-06-06 at 12.21.35 PM (1).jpeg': 'Pantalon Apoyo Administrativo Mujer.webp',
  'WhatsApp Image 2026-06-06 at 12.21.35 PM (2).jpeg': 'Pantalon Institucional.webp',
  'WhatsApp Image 2026-06-06 at 12.21.35 PM (3).jpeg': 'Pantalon Institucional PETROQUIMICO.webp',
  'WhatsApp Image 2026-06-06 at 12.21.35 PM.jpeg': 'Pantalon Salud y Farmacia.webp',
  'WhatsApp Image 2026-06-06 at 12.21.36 PM.jpeg': 'Camisa Institucional NAUTICO Hombre.webp',
  'uniforme-salud-azul-blanco-manga-corta.jpeg': 'Camisa Salud y Farmacia Hombre.webp',
  'uniforme-salud-azul-blanco-mujer.jpeg': 'Camisa Salud y Farmacia Mujer.webp',
  'blusa-enfermeria-azul-sena.jpeg': 'Camisa Enfermeria Mujer.webp',
  'delantal-azul-cocina.jpeg': 'Delantal Mesa y Bar.webp',
  'gorro-chef-blanco.jpeg': 'Gorro Cocina.webp',
}

const normalizeUniformImageUrl = (imageUrl) => {
  if (!imageUrl || imageUrl.startsWith('data:image')) return imageUrl
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl

  const fileName = imageUrl.split('/').pop()
  let decodedFileName = fileName || ''
  try {
    decodedFileName = decodeURIComponent(decodedFileName)
  } catch {
    decodedFileName = fileName || ''
  }

  const renamedFileName = renamedUniformImages[decodedFileName]
  if (renamedFileName) return `/images/uniformes/${encodeURI(renamedFileName)}`

  const isUniformPath = imageUrl.includes('/images/uniformes/') || !imageUrl.includes('/')
  if (isUniformPath) {
    const normalizedWebp = decodedFileName.replace(/\.(png|jpe?g|jfif)$/i, '.webp')
    if (normalizedWebp !== decodedFileName) {
      return `/images/uniformes/${encodeURI(normalizedWebp)}`
    }
  }

  return imageUrl
}

const normalizeProduct = (product) => ({
  ...product,
  imageUrl: normalizeUniformImageUrl(product?.imageUrl),
})

export const getAll = async () => {
  const response = await axiosClient.get('/products')
  return response.data.map(normalizeProduct)
}

export const getById = async (id) => {
  const response = await axiosClient.get(`/products/${id}`)
  return normalizeProduct(response.data)
}

export const create = async (data) => {
  const response = await axiosClient.post(`/products`, data)
  return normalizeProduct(response.data)
}

export const update = async (id, data) => {
  const response = await axiosClient.put(`/products/${id}`, data)
  return normalizeProduct(response.data)
}

export const remove = async (id) => {
  const response = await axiosClient.delete(`/products/${id}`)
  return response.data
}

export const reserve = async (id, qty = 1) => {
  let sessionId = localStorage.getItem('reserveSession')
  if (!sessionId) {
    sessionId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem('reserveSession', sessionId)
  }
  const response = await axiosClient.post(`/products/${id}/reserve`, null, { params: { qty, sessionId } })
  return response.data
}

export const release = async (id, qty = 1) => {
  const sessionId = localStorage.getItem('reserveSession')
  const response = await axiosClient.post(`/products/${id}/release`, null, { params: { qty, sessionId } })
  return response.data
}
