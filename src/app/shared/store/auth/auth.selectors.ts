import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.reducers";

export const selectAuthState = createFeatureSelector<AuthState>("auth");

export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectSignup = createSelector(
  selectAuthState,
  (state) => state.signup
);

export const selectSignupOrganizationId = createSelector(
  selectSignup,
  (signup) => signup?.response?.data?.organizationId
);
