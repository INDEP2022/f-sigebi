import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom, Subject, take } from 'rxjs';
import { IEventPreparationState } from './store/event-preparation-state.interface';
import * as Actions from './store/event-preparation.actions';
import * as Selectors from './store/event-preparation.selector';
@Injectable({ providedIn: 'root' })
export class EventPreparationService {
  $refreshLots = new Subject<void>();
  $fillStadistics = new Subject<void>();
  constructor(private store: Store<IEventPreparationState>) {}

  updateState(eventPreparation: IEventPreparationState) {
    this.store.dispatch(
      Actions.SetEventPreparation({
        eventPreparation,
      })
    );
  }

  resetState() {
    this.store.dispatch(Actions.ResetEventPreparation());
  }

  async getState() {
    return await firstValueFrom(
      this.store.select(Selectors.getEventPreparation).pipe(take(1))
    );
  }

  public updateSingleState<ParamKey extends keyof IEventPreparationState>(
    name: ParamKey,
    value: IEventPreparationState[ParamKey],
    state: IEventPreparationState
  ) {
    let newState = { ...state };
    newState = {
      ...newState,
      [name]: value,
    };
    this.store.dispatch(
      Actions.SetEventPreparation({
        eventPreparation: { ...newState },
      })
    );
  }
}
