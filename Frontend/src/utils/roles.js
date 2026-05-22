export const isAdmin = (user) => user?.role?.toLowerCase() === 'admin'

export const isClient = (user) => !isAdmin(user)
