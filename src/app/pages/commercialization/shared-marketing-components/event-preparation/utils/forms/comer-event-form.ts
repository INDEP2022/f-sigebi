import { FormControl, Validators } from '@angular/forms';

export class ComerEventForm {
  id = new FormControl<number>({ value: null, disabled: true });
  processKey = new FormControl<string>(null, [
    Validators.required,
    Validators.maxLength(60),
  ]);
  eventTpId = new FormControl<number | string>(null, [Validators.required]);
  place = new FormControl<string>(null, [
    Validators.required,
    Validators.maxLength(100),
  ]);
  observations = new FormControl<string>(null, [
    Validators.required,
    Validators.maxLength(300),
  ]);
  vatApplies = new FormControl(null);
  eventDate = new FormControl<Date>(null, []);
  username = new FormControl<string>(null, []);
  delegationNumber = new FormControl<string | number>(null, []);
  thirdId = new FormControl<number | string>(null);
  baseCost = new FormControl<number>(null, [Validators.maxLength(15)]);
  eventClosingDate = new FormControl<Date>(null);
  failureDate = new FormControl<Date>(null);
  requestType = new FormControl<number | string>(null);
  tpsolavalId = new FormControl<number | string>(null);
  statusVtaId = new FormControl<string>(null);
  address = new FormControl<string>(null);
  user = new FormControl<string>(null);
  month = new FormControl<number | string>(null);
  year = new FormControl<number | string>(null);
}
