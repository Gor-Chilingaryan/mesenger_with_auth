import api from '../instance'

export const getAllNavigation = async () => {
  try {
    const response = await api.get('/home-navigation-all')

    return response.data
  } catch (error) {
    console.log('Failed to get all navigation')
  }
}
