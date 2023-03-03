import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IGlobalVars } from '../models/IGlobalVars.model';
import * as GlobalVarsActions from '../store/global-vars.actions';
import * as GlobalVarsSelectors from '../store/global-vars.selectors';

@Injectable({
  providedIn: 'root',
})
export class GlobalVarsService {
  constructor(private store: Store<IGlobalVars>) {}

  public loadGlobalVars() {
    this.store.dispatch(GlobalVarsActions.loadGlobalVars());
  }

  public updateGlobalVars(globalVars: IGlobalVars) {
    this.store.dispatch(
      GlobalVarsActions.setGlobalVars({
        updateGlobalVars: { ...globalVars },
      })
    );
  }

  public resetGlobalVars() {
    this.store.dispatch(GlobalVarsActions.resetAction());
  }

  public getGlobalVars$(): Observable<IGlobalVars> {
    return this.store.select(GlobalVarsSelectors.getGlobalVars);
  }

  public updateSingleGlobal<ParamKey extends keyof IGlobalVars>(
    globalVar: ParamKey,
    value: IGlobalVars[ParamKey],
    globalVars: IGlobalVars
  ) {
    let newState = { ...globalVars };
    newState = {
      ...newState,
      [globalVar]: value,
    };
    this.store.dispatch(
      GlobalVarsActions.setGlobalVars({
        updateGlobalVars: { ...newState },
      })
    );
  }
}
