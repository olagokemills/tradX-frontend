import { createAction, props } from "@ngrx/store";
import { LoginResponse, RegisterPayload, RegisterResponse } from "../../models/appData.model";

export const loginSuccess = createAction(
  "[Auth] Login Success",
  props<{
    user: LoginResponse;
  }>()
);

export const initApp = createAction("[Auth] Init App");

export const clearUser = createAction("[Auth] Clear User");

export const signupRequest = createAction(
  "[Auth] Signup Request",
  props<{ payload: RegisterPayload }>()
);

export const signupSuccess = createAction(
  "[Auth] Signup Success",
  props<{ response: RegisterResponse }>()
);

export const signupFailure = createAction(
  "[Auth] Signup Failure",
  props<{ error: any }>()
);
