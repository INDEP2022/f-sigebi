import { FormControl, Validators } from '@angular/forms';

export class HistoricalGoodSituationForm {
  goodNumber = new FormControl(null, [Validators.required]);
  inventoryNumber = new FormControl(null);
  description = new FormControl(null);
  resourceStatus = new FormControl(null);
}
