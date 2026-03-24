import { useEffect, useState } from 'react'
import { getUserInfoRequest, patchUserInfoRequest } from '../../../api/requests/userInfo'

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [disableInput, setDisableInput] = useState(true)

  const handleDesableInput = async () => {
    setDisableInput(!disableInput)

    const data = await getUserInfoRequest()
    setUserInfo(data)
  }


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true)
        const data = await getUserInfoRequest()
        setUserInfo(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserInfo()
  }, [])


  const handleChange = (e) => {
    const { name, value } = e.target
    setUserInfo(prev => ({ ...prev, [name]: value }))
  }


  const handleSaveValues = async () => {
    try {
      setIsLoading(true)
      const data = await patchUserInfoRequest(userInfo)
      setUserInfo(data.json)
      setDisableInput(true)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }


  return {
    userInfo,
    setUserInfo,
    error,
    isLoading,
    disableInput,
    handleDesableInput,
    handleChange,
    handleSaveValues,
    handleLogout
  }
}