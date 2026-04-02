import api from '../instance'

export const getUserInfoRequest = async () => {
  try {
    const response = await api.get('/user-info')

    return response.data
  } catch (error) {
    throw new Error(error.message || 'You dont have access to this page')
  }
}

export const patchUserInfoRequest = async (userBody) => {
  try {
    const response = await api.patch('/user-info/changes', userBody)

    return response.data
  } catch (error) {
    throw new Error(error.message || 'Update user info failed')
  }
}

export const logoutUserRequest = async () => {
  const response = await api.post('/logout')
  return response.data
}