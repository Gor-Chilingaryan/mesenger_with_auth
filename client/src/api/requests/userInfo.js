import api from '../instance'

export const getUserInfoRequest = async () => {
  try {
    const response = await api.get('/user-info', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    return response.data
  } catch (error) {
    const backendError = error.response?.data
    throw new Error(backendError?.message || 'You dont have access to this page')
  }

}