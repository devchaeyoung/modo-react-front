export const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },

  password: (value: string): boolean => {
    return value.length >= 8
  },

  nickname: (value: string): boolean => {
    return value.length >= 2
  },

  required: (value: string): boolean => {
    return value.trim().length > 0
  },

  alphanumeric: (value: string): boolean => {
    const alphanumericRegex = /^[a-zA-Z0-9_.-]+$/
    return alphanumericRegex.test(value)
  },
}
