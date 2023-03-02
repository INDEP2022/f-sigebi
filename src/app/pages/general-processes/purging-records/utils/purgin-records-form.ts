import { FormControl, Validators } from '@angular/forms';

export class PurginRecordsForm {
  id = new FormControl<string | number>(null, [
    Validators.required,
    Validators.maxLength(11),
  ]);
  preliminaryInquiry = new FormControl<string>(null, [
    Validators.maxLength(11),
  ]);
  circumstantialRecord = new FormControl<string>(null, [
    Validators.maxLength(30),
  ]);
  keyPenalty = new FormControl<string>(null, [Validators.maxLength(30)]);
  criminalCase = new FormControl<string>(null, [Validators.maxLength(30)]);
  protectionKey = new FormControl<string>(null, [Validators.maxLength(30)]);
  identifier = new FormControl<string>(null, [Validators.maxLength(5)]);
}
