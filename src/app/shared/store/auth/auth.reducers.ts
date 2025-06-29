import { createReducer, on } from "@ngrx/store";
import * as AuthActions from './auth.actions'


export interface AuthState {
  user: any | null;
  signup: {
    response: any | null;
    loading: boolean;
    error: any | null;
  }
}

export const initialState: AuthState = {
  user: null,
  signup: {
    response: null,
    loading: false,
    error: null
  }
}
export const authReducer = createReducer(
  initialState,
  on(
    AuthActions.loginSuccess,
    (state, { user }) => ({
      ...state,
      user
    })
  ),
  on(
    AuthActions.signupRequest,
    (state) => ({
      ...state,
      signup: { ...state.signup, loading: true, error: null }
    })
  ),
  on(
    AuthActions.signupSuccess,
    (state, { response }) => ({
      ...state,
      signup: { response, loading: false, error: null }
    })
  ),
  on(
    AuthActions.signupFailure,
    (state, { error }) => ({
      ...state,
      signup: { ...state.signup, loading: false, error }
    })
  )
)

