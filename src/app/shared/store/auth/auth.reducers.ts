import { createReducer, on } from "@ngrx/store";
import * as AuthActions from './auth.actions'


export interface AuthState{
    user:any|null;
}

export const initialState:AuthState = {
    user:null
}
export const authReducer = createReducer(
    initialState,
        on(
            AuthActions.loginSuccess,
            (state, { user }) => ({
                ...state,
                user
            })
        )
    )

