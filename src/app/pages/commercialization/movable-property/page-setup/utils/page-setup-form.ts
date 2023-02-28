import { FormControl, Validators } from '@angular/forms';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

export class PageSetupForm {
  idTable = new FormControl<string>(null, [
    Validators.required,
    Validators.maxLength(30),
    Validators.pattern(STRING_PATTERN),
  ]);
  idColumn = new FormControl<string>(null, [
    Validators.required,
    Validators.maxLength(30),
    Validators.pattern(STRING_PATTERN),
  ]);
  aliastab = new FormControl<string>(null, [
    Validators.required,
    Validators.maxLength(3),
    Validators.pattern(STRING_PATTERN),
  ]);
  ordencol = new FormControl<string>(null, [
    Validators.required,
    Validators.max(99),
    Validators.pattern(NUMBERS_PATTERN),
  ]);
  aliascol = new FormControl<string>(null, [
    Validators.required,
    Validators.maxLength(30),
    Validators.pattern(STRING_PATTERN),
  ]);
  ordentab = new FormControl<string>(null, [
    Validators.required,
    Validators.max(99),
    Validators.pattern(NUMBERS_PATTERN),
  ]);
  visualiza = new FormControl<string>(null);
}
