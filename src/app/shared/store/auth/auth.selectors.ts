import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.reducers";

export const selectAuthState = createFeatureSelector<AuthState>("auth");

export const selectUser = createSelector(
    selectAuthState,
    (state) =>state.user
)
