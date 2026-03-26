import api from '../instance'

export const getAllNavigation = async () => {
  try {
    const response = await api.get('/home-navigation-all')

    return response.data
  } catch (error) {
    const backendError = error.response?.data
    console.error('Failed to get all navigation:', backendError || error.message)
    throw new Error(backendError?.message || 'Failed to get all navigation')
  }
}
export const createNavigationItem = async (item) => {
  try {
    const response = await api.post('/home-navigation-create', item)

    return response.data

  } catch (error) {
    const backendError = error.response?.data
    console.error('Failed to create navigation item:', backendError || error.message)
    throw new Error(backendError?.message || 'Failed to create navigation item')
  }
}
export const updateNavigationItem = async (newOrder) => {
  try {
    const response = await api.patch('/update-order', { newOrder })

    return response.data
  } catch (error) {
    const backendError = error.response?.data
    console.error('Failed to update navigation item:', backendError || error.message)
    throw new Error(backendError?.message || 'Failed to update navigation item')
  }
}

export const deleteNavigationItem = async (id) => {
  try {
    const response = await api.delete(`/home-navigation/${id}`)

    return response.data
  } catch (error) {
    const backendError = error.response?.data
    console.error('Failed to delete navigation item:', backendError || error.message)
    throw new Error(backendError?.message || 'Failed to delete navigation item')
  }
}
