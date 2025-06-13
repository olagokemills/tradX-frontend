import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { tap, map, withLatestFrom } from "rxjs/operators";
import * as AuthActions from "./auth.actions";
import { EncryptionService } from "src/app/core/utils/encryption.service";

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private helper: EncryptionService
  ) {}

  // Persist all user data to session storage on login success
  persistLoginData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user }) => {
              console.log("=== LOADING FROM SESSION STORAGE ===");
          this.helper.SaveItem("user", user);
        })
      ),
    { dispatch: false }
  );

    // Load all data from session storage on app initialization
  loadDataFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initApp),
      map(() => {
        console.log("=== LOADING FROM SESSION STORAGE ===");

        const storedUser = this.helper.GetItem("user");

        // Check if we have the essential data
        if (storedUser ) {
          return AuthActions.loginSuccess({
            user: storedUser,
          });
        } else {
            
          return AuthActions.clearUser();
        }
      })
    )
  );

//   // Clear all session storage on logout
//   clearStorage$ = createEffect(
//     () =>
//       this.actions$.pipe(
//         ofType(AuthActions.logout, AuthActions.clearUser),
//         tap(() => {
//           this.helper.removeItem("user");
//           this.helper.removeItem("token");
//           this.helper.removeItem("subsidiaries");
//           this.helper.removeItem("activeSubsidiary");
//           this.helper.removeItem("loggedInUser");
//         })
//       ),
//     { dispatch: false }
//   );
}