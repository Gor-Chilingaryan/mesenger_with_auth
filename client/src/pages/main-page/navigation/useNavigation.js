import { useEffect, useState } from 'react'
import { getAllNavigation } from '../../../api/requests/navigate'

export function useNavigation() {
  const [navItems, setNavItems] = useState([])
  const [error, setError] = useState(null)
  const [isLoding, setIsLoding] = useState(false)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoding(true)
        const data = await getAllNavigation()
        setNavItems(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoding(false)
      }
    }
    fetchItems()
  }, [])

  return {
    navItems,
    error
  }
}
