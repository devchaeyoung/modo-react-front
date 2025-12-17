import { authStorage } from '@/shared/api'

/**
 * 현재 인증 상태를 조회하는 hook
 *
 * @returns {Object} 인증 상태 객체
 * @returns {boolean} isAuthenticated - 로그인 여부
 * @returns {boolean} isGuest - 게스트 모드 여부
 * @returns {Object|null} user - 사용자 정보
 * @returns {string|null} token - 인증 토큰
 */
export function useAuthStatus() {
  const token = authStorage.token.get()
  const user = authStorage.user.get()
  const isGuest = authStorage.guest.get()

  return {
    isAuthenticated: !!token && !!user,
    isGuest,
    user,
    token,
  }
}
