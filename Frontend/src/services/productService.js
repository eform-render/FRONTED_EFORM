import axiosClient from '../api/axiosClient'

const renamedUniformImages = {
  'blanco y azul.jpeg': 'uniforme-salud-azul-blanco-manga-corta.jpeg',
  'gris.jpeg': 'camisa-blanca-administrativa-mujer.jpeg',
  'pantalon_azul.jpeg': 'pantalon-azul-rey-formal.jpeg',
  'WhatsApp Image 2026-05-12 at 6.55.09 PM (1).jpeg': 'pantalon-negro-formal.jpeg',
  'WhatsApp Image 2026-05-12 at 6.55.09 PM.jpeg': 'camisa-azul-claro-rayas-hombre.jpeg',
  'WhatsApp Image 2026-05-12 at 6.55.10 PM (1).jpeg': 'camisa-verde-claro-mujer.jpeg',
  'WhatsApp Image 2026-05-12 at 6.55.10 PM.jpeg': 'jean-azul-oscuro-sena-mujer.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.27 PM (1).jpeg': 'jean-azul-oscuro-sena-hombre.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.28 PM (1).jpeg': 'pantalon-deportivo-azul-liso.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.28 PM (3).jpeg': 'sudadera-azul-sena-franja-blanca.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.29 PM (1).jpeg': 'camisa-azul-claro-manga-corta-hombre.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.29 PM (2).jpeg': 'camisa-azul-claro-manga-corta-mujer.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.29 PM.jpeg': 'jogger-azul-sena-mujer.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.30 PM (1).jpeg': 'camiseta-deportiva-sena-mujer.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.30 PM (2).jpeg': 'chaqueta-blanca-salud-manga-larga.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.30 PM (3).jpeg': 'filipina-blanca-cocina-manga-corta.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.30 PM.jpeg': 'camiseta-deportiva-sena-hombre.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.31 PM (1).jpeg': 'bata-medica-blanca-hombre.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.31 PM (2).jpeg': 'bata-medica-blanca-mujer.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.31 PM.jpeg': 'polo-azul-petroleo-mujer.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.32 PM (1).jpeg': 'camisa-azul-claro-rayas-manga-larga.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.32 PM (2).jpeg': 'blusa-enfermeria-azul-sena.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.33 PM (1).jpeg': 'polo-negro-sena-mujer.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.33 PM (2).jpeg': 'polo-verde-sena-mujer.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.33 PM.jpeg': 'polo-celeste-sena-mujer.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.34 PM (1).jpeg': 'delantal-azul-cocina.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.34 PM (2).jpeg': 'gorro-chef-blanco.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.34 PM.jpeg': 'uniforme-salud-azul-blanco-mujer.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.35 PM (1).jpeg': 'pantalon-gris-formal.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.35 PM (2).jpeg': 'pantalon-deportivo-azul-petroleo.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.35 PM (3).jpeg': 'pantalon-azul-oscuro-formal.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.35 PM.jpeg': 'pantalon-gris-mujer.jpeg',
  'WhatsApp Image 2026-06-06 at 12.21.36 PM.jpeg': 'pantalon-blanco-formal.jpeg',
}

const normalizeUniformImageUrl = (imageUrl) => {
  if (!imageUrl || imageUrl.startsWith('data:image')) return imageUrl

  const fileName = imageUrl.split('/').pop()
  let decodedFileName = fileName || ''
  try {
    decodedFileName = decodeURIComponent(decodedFileName)
  } catch {
    decodedFileName = fileName || ''
  }
  const renamedFileName = renamedUniformImages[decodedFileName]

  return renamedFileName ? `/images/uniformes/${renamedFileName}` : imageUrl
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
