export const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  if (!token) return false

  try {
    // Check if token is expired (basic check)
    const payload = JSON.parse(atob(token.split('.')[1]))
    const now = Date.now() / 1000
    return payload.exp > now
  } catch (error) {
    return false
  }
}

export const getToken = () => {
  return localStorage.getItem('token')
}

export const getUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
