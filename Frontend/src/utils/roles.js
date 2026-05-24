export const isAdmin = (user) => {
  const role = user?.role
  if (!role) return false
  return role.toString().toLowerCase().includes('admin')
}

export const isClient = (user) => !isAdmin(user)
