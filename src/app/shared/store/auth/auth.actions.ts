import { createAction, props } from "@ngrx/store";
import { LoginResponse } from "../../models/appData.model";
export const loginSuccess = createAction(
  "[Auth] Login Success",
  props<{
    user: LoginResponse;
  }>()
);

export const initApp = createAction("[Auth] Init App");

export const clearUser = createAction("[Auth] Clear User");