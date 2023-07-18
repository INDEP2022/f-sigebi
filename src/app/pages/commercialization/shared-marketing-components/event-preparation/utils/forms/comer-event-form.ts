import { FormControl, Validators } from '@angular/forms';

export class ComerEventForm {
  id = new FormControl({ value: null, disabled: true });
  processKey = new FormControl(null, [
    Validators.required,
    Validators.maxLength(60),
  ]);
  eventTpId = new FormControl(null, [Validators.required]);
  place = new FormControl(null, [
    Validators.required,
    Validators.maxLength(100),
  ]);
  observations = new FormControl(null, [
    Validators.required,
    Validators.maxLength(300),
  ]);
  eventDate = new FormControl(null, []);
  username = new FormControl(null, []);
  delegationNumber = new FormControl(null, []);
  thirdId = new FormControl(null);
  baseCost = new FormControl(null, [Validators.maxLength(15)]);
  eventClosingDate = new FormControl(null);
  failureDate = new FormControl(null);
  requestType = new FormControl(null);
  tpsolavalId = new FormControl(null);
  statusVtaId = new FormControl(null);
  address = new FormControl(null);
  user = new FormControl(null);
  month = new FormControl(null);
  year = new FormControl(null);
}
