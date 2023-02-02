import { FormControl } from '@angular/forms';

export class OFFICE_COPIES_FORM {
  constructor(private _personType: 'D' | 'C') {}
  jobNumber = new FormControl<string>(null);
  personKey = new FormControl<string>(null);
  personType = new FormControl<'D' | 'C'>(this._personType);
  status = new FormControl<string>('P');
}
