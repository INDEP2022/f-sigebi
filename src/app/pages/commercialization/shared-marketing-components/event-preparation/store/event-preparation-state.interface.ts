import { FormGroup } from '@angular/forms';
import { ComerEventForm } from '../utils/forms/comer-event-form';

export interface IEventPreparationState {
  eventForm: FormGroup<ComerEventForm>;
  lastLot: number;
  lastPublicLot: number;
  executionType?: 'normal' | 'base';
}
