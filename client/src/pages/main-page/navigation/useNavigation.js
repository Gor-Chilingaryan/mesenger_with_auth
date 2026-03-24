import { useEffect, useState } from 'react'
import { getAllNavigation } from '../../../api/requests/navigate'

export function useNavigation() {
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

  return {
    navItems,
    error,
    isLoading
  }
}
