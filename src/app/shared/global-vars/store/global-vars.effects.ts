import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { EMPTY, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import * as GlobalVarsActions from './global-vars.actions';

@Injectable()
export class GlobalVarsEffects {
  loadGlobalVarss$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalVarsActions.loadGlobalVarss),
      /** An EMPTY observable only emits completion. Replace with your own observable API request */
      concatMap(() => EMPTY as Observable<{ type: string }>)
    );
  });

  constructor(private actions$: Actions) {}
}
