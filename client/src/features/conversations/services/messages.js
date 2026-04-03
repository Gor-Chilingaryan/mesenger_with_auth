import api from '@api/instance'

export const getConversations = async () => {
  const response = await api.get('/messenger/conversations')
  return response.data
}

export const getMessages = async (partnerId) => {
  const response = await api.get(`/messenger/messages/${partnerId}`)
  return response.data
}

export const sendMessage = async (partnerId, content) => {
  const response = await api.post(`/messenger/messages/${partnerId}`, { content })
  return response.data
}

export const markAsRead = async (partnerId) => {
  const response = await api.patch(`/messenger/messages/${partnerId}/read`)
  return response.data
}

export const searchUsers = async (query) => {
  const response = await api.get('/messenger/users/search', { params: { q: query } })
  return response.data
}
