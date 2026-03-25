import { useEffect, useState } from 'react'
import { getAllNavigation } from '../../../api/requests/navigate'
import { useNavigate } from 'react-router-dom'

export function useNavigation() {
  const navigate = useNavigate()
  const [navItems, setNavItems] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true)
        const data = await getAllNavigation()
        setNavItems(Array.isArray(data) ? data : [])
      } catch (error) {
        setNavItems([])
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchItems()
  }, [])

  const handleEditNavigation = () => {
    navigate('/navigation-edit')
  }

  return {
    navItems,
    error,
    isLoading,
    handleEditNavigation
  }
}
