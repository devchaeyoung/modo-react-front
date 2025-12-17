import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validators, validationMessages, type Language } from '@/shared/lib/validation'

interface ValidationErrors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  nickname?: string
}

export const useAuthValidation = () => {
  const { i18n } = useTranslation()
  const [errors, setErrors] = useState<ValidationErrors>({})

  const lang = (i18n.language || 'ko') as Language
  const messages = validationMessages[lang]

  const validateUsername = (value: string): string | undefined => {
    if (!validators.required(value)) {
      return messages.username.required
    }
    if (!validators.alphanumeric(value)) {
      return messages.username.alphanumeric
    }
    return undefined
  }

  const validateEmail = (value: string): string | undefined => {
    if (!validators.required(value)) {
      return messages.email.required
    }
    if (!validators.email(value)) {
      return messages.email.invalid
    }
    return undefined
  }

  const validatePassword = (value: string): string | undefined => {
    if (!validators.required(value)) {
      return messages.password.required
    }
    if (!validators.password(value)) {
      return messages.password.minLength
    }
    return undefined
  }

  const validateNickname = (value: string): string | undefined => {
    if (!validators.required(value)) {
      return messages.nickname.required
    }
    if (!validators.nickname(value)) {
      return messages.nickname.minLength
    }
    return undefined
  }

  const validateSignupForm = (data: {
    username: string
    email: string
    password: string
    nickname: string
  }): boolean => {
    const newErrors: ValidationErrors = {}

    const usernameError = validateUsername(data.username)
    if (usernameError) newErrors.username = usernameError

    const emailError = validateEmail(data.email)
    if (emailError) newErrors.email = emailError

    const passwordError = validatePassword(data.password)
    if (passwordError) newErrors.password = passwordError

    const nicknameError = validateNickname(data.nickname)
    if (nicknameError) newErrors.nickname = nicknameError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateLoginForm = (data: { username: string; password: string }): boolean => {
    const newErrors: ValidationErrors = {}

    const usernameError = validateUsername(data.username)
    if (usernameError) newErrors.username = usernameError

    const passwordError = validatePassword(data.password)
    if (passwordError) newErrors.password = passwordError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const clearError = (field: keyof ValidationErrors) => {
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const setError = (field: keyof ValidationErrors, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }))
  }

  return {
    errors,
    validators: {
      username: validateUsername,
      email: validateEmail,
      password: validatePassword,
      nickname: validateNickname,
    },
    validateSignupForm,
    validateLoginForm,
    clearError,
    setError,
  }
}
