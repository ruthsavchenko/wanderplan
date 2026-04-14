import { useMutation } from '@tanstack/react-query'
import { signIn, signUp, signOut } from './authService'
import type { LoginFormData, SignupFormData } from './authTypes'

export function useSignIn() {
  return useMutation({
    mutationFn: (data: LoginFormData) => signIn(data),
  })
}

export function useSignUp() {
  return useMutation({
    mutationFn: (data: SignupFormData) => signUp(data),
  })
}

export function useSignOut() {
  return useMutation({
    mutationFn: signOut,
  })
}
