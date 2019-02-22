import { ActionReducerMap } from '@ngrx/store';


import * as fromUi from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';


export interface AppState {
  ui: fromUi.State;
  auth: fromAuth.AuthState;
}

export const appReducer: ActionReducerMap<AppState> = {
  ui: fromUi.uiReducer,
  auth: fromAuth.authReducer
};

