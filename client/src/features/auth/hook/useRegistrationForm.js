/**
 * Registration form hook.
 * Manages sign-up form state, validation, and account creation submission.
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validationRules } from '@components/validation-message/ValidationMessage'
import { registerUser } from '@features/auth/services/auth'

/**
 * Provides sign-up state and event handlers.
 * @returns {object} Registration form data and actions.
 */
function useRegistrationForm() {
  const navigate = useNavigate()

  useEffect(() => {
    const isLogged = localStorage.getItem('isLogged') === 'true'
    if (isLogged) {
      navigate('/home', { replace: true })
    }
  }, [navigate])

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [validationStatus, setValidationStatus] = useState({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    confirmPassword: null,
  })

  const isFormValid = Object.values(validationStatus).every(status => status === 'valid')

  /**
   * Validates every registration field.
   * @returns {boolean} True when all fields are valid.
   */
  const validateForm = () => {
    const statuses = {
      firstName: validationRules.firstName(formData.firstName) ? 'valid' : 'invalid',
      lastName: validationRules.lastName(formData.lastName) ? 'valid' : 'invalid',
      email: validationRules.email(formData.email) ? 'valid' : 'invalid',
      password: validationRules.password(formData.password) ? 'valid' : 'invalid',
      confirmPassword: validationRules.confirmPassword(formData.confirmPassword, formData.password) ? 'valid' : 'invalid',
    }
    setValidationStatus(statuses)

    return Object.values(statuses).every(status => status === 'valid')
  }

  /**
   * Validates a single field on blur.
   * @param {React.FocusEvent<HTMLInputElement>} e - Blur event.
   * @returns {void}
   */
  const handleBlur = e => {
    const { name, value } = e.target

    let isValid = false

    if (name === 'confirmPassword') {
      isValid = validationRules.confirmPassword(value, formData.password)
    } else if (validationRules[name]) {
      isValid = validationRules[name](value)
    }

    setValidationStatus(prev => ({
      ...prev,
      [name]: isValid ? 'valid' : 'invalid',
    }))
  }

  /**
   * Submits registration data and redirects on success.
   * @param {React.FormEvent<HTMLFormElement>} e - Form submit event.
   * @returns {Promise<void>}
   */
  const handleRegistration = async e => {
    e.preventDefault()

    const isValid = validateForm()

    if (!isValid) return

    try {
      const { confirmPassword, ...registerData } = formData
      await registerUser(registerData)
      localStorage.setItem('isLogged', 'true')

      navigate('/home')
    } catch (err) {
      throw new Error(err.message || 'An error occurred')
    }
  }

  /**
   * Updates form state and resets dependent validation state.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event.
   * @returns {void}
   */
  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    setValidationStatus(prev => {
      const newStatus = { ...prev, [name]: null }

      if (name === 'password') {
        newStatus.confirmPassword = null
      }

      return newStatus
    })


  }

  return {
    formData,
    validationStatus,
    isFormValid,
    handleBlur,
    handleRegistration,
    handleChange,
  }
}

export { useRegistrationForm }