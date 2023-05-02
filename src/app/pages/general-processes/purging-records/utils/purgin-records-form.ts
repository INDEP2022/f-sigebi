import { FormControl, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

export class PurginRecordsForm {
  id = new FormControl<string | number>(null, [
    Validators.required,
    Validators.maxLength(11),
    Validators.pattern(STRING_PATTERN),
  ]);
  preliminaryInquiry = new FormControl<string>(null, [
    Validators.maxLength(200),
    Validators.pattern(STRING_PATTERN),
  ]);
  circumstantialRecord = new FormControl<string>(null, [
    Validators.maxLength(30),
    Validators.pattern(STRING_PATTERN),
  ]);
  keyPenalty = new FormControl<string>(null, [
    Validators.maxLength(30),
    Validators.pattern(STRING_PATTERN),
  ]);
  criminalCase = new FormControl<string>(null, [
    Validators.maxLength(40),
    Validators.pattern(STRING_PATTERN),
  ]);
  protectionKey = new FormControl<string>(null, [
    Validators.maxLength(30),
    Validators.pattern(STRING_PATTERN),
  ]);
  identifier = new FormControl<string>(null, [
    Validators.maxLength(5),
    Validators.pattern(STRING_PATTERN),
  ]);
}
