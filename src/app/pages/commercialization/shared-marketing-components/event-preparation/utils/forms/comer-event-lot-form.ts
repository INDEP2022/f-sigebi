import { FormControl, Validators } from '@angular/forms';

export class ComerEventLotForm {
  id = new FormControl<number>(null);
  eventId = new FormControl<number>(null);
  publicLot = new FormControl<number>(null, [Validators.required]); // 10
  description = new FormControl<string>(null, [Validators.required]); // 1000
  baseValue = new FormControl<number>(null); // 31
  customerId = new FormControl<number | string>(null); //
  warrantyPrice = new FormControl<number>(null); //13
  transferenceNumber = new FormControl<number | string>(null); //
  finalPrice = new FormControl<number>(null); // 13
  referenceG = new FormControl<string>(null); // 30
  referential = new FormControl<string>(null); // 30
  statusVtaId = new FormControl<string>(null);
  assignedEs = new FormControl<string>(null); // 4
  scrapEs = new FormControl<string>(null); // 1
}
