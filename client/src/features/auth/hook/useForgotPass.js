/**
 * Forgot password hook.
 * Handles email validation and navigation to password reset step.
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validationRules } from '@components/validation-message/ValidationMessage'
import { forgotPassword } from '@features/auth/services/auth'


/**
 * Provides forgot-password form state and actions.
 * @returns {object} Form state and handler functions.
 */
function useForgotPass() {
  const [formData, setFormData] = useState({ email: '' })
  const [validationStatus, setValidationStatus] = useState({ email: null })


  const navigate = useNavigate()

  useEffect(() => {
    const isLogged = localStorage.getItem('isLogged') === 'true'
    if (isLogged) {
      navigate('/home', { replace: true })
    }
  }, [navigate])

  const isFormValid = validationStatus.email === 'valid'

  /**
   * Validates email before submitting reset request.
   * @returns {boolean} True when email is valid.
   */
  const validateForm = () => {
    const isValid = validationRules.email(formData.email)
    setValidationStatus({ email: isValid ? 'valid' : 'invalid' })
    return isValid
  }

  /**
   * Updates email field state.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event.
   * @returns {void}
   */
  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setValidationStatus({ ...validationStatus, [name]: null })
  }

  /**
   * Validates email field on blur.
   * @param {React.FocusEvent<HTMLInputElement>} e - Blur event.
   * @returns {void}
   */
  const handleBlur = e => {
    const { name, value } = e.target
    if (validationRules[name]) {
      const isValid = validationRules[name](value)
      setValidationStatus({
        ...validationStatus,
        [name]: isValid ? 'valid' : 'invalid',
      })
    }
  }

  /**
   * Sends forgot-password request and routes to reset page.
   * @param {React.FormEvent<HTMLFormElement>} e - Form submit event.
   * @returns {Promise<void>}
   */
  const handleForgotPas = async e => {
    e.preventDefault()

    const isValid = validateForm()
    if (!isValid) return

    try {

      await forgotPassword(formData.email)

      navigate('/new-password', { state: { email: formData.email } })
    } catch (err) {
      throw new Error(err.message || 'An error occurred')
    }


  }

  return {
    formData,
    validationStatus,
    isFormValid,
    handleBlur,
    handleChange,
    handleForgotPas,

  }
}

export { useForgotPass }
