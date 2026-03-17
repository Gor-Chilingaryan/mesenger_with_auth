import { useEffect, useState } from 'react'
import { getUserInfoRequest } from '../../../api/requests/userInfo'

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [error, setError] = useState(null)
  const [isLoding, setIsLoding] = useState(false)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoding(true)
        const data = await getUserInfoRequest()
        setUserInfo(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoding(false)
      }
    }
    fetchUserInfo()
  }, [])

  return {
    userInfo,
    error,
    isLoding
  }
}