/**
 * User profile hook.
 * Manages profile fetch/update flow, edit mode state, avatar modal, and logout.
 */
import { useEffect, useState } from 'react'
import { getUserInfoRequest, patchUserInfoRequest, logoutUserRequest } from '../../../api/requests/userInfo'
import { useNavigate } from 'react-router-dom'

/**
 * Provides state and actions for the `UserInfo` screen.
 * @returns {object} Profile state and handlers.
 */
export const useUserInfo = () => {
  const navigate = useNavigate()

  const [userInfo, setUserInfo] = useState(null)

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [disableInput, setDisableInput] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)

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

  /**
   * Toggles edit mode and resets values when leaving edit mode.
   * @returns {Promise<void>}
   */
  const handleDesableInput = async () => {
    setDisableInput(!disableInput)
    if (!disableInput) {
      const data = await getUserInfoRequest()
      setUserInfo(data)
    }
  }

  /**
   * Updates profile form field value in local state.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event.
   * @returns {void}
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setUserInfo(prev => ({ ...prev, [name]: value }))
  }

  /**
   * Updates selected avatar in local state.
   * @param {string} avatarUrl - Selected avatar URL.
   * @returns {void}
   */
  const handleAvatarChange = (avatarUrl) => {
    setUserInfo(prev => ({ ...prev, avatar: avatarUrl }))
  }

  /**
   * Persists edited user profile values.
   * @returns {Promise<void>}
   */
  const handleSaveValues = async () => {
    try {
      setIsLoading(true)
      const data = await patchUserInfoRequest(userInfo)
      setUserInfo(data)
      setDisableInput(true)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Logs user out on server and clears local auth flag.
   * @returns {Promise<void>}
   */
  const handleLogout = async () => {
    try {
      await logoutUserRequest()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('isLogged')
      navigate('/')
    }
  }




  return {
    userInfo,
    setUserInfo,
    isModalOpen,
    setIsModalOpen,
    handleAvatarChange,
    error,
    isLoading,
    disableInput,
    handleDesableInput,
    handleChange,
    handleSaveValues,
    handleLogout,
  }
}