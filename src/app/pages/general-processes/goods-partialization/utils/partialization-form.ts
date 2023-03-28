import { FormControl, Validators } from '@angular/forms';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

export class GoodPartializationForm {
  bien = new FormControl<number>({ value: null, disabled: true }, [
    Validators.required,
  ]);
  clasif = new FormControl(null);
  originalQuantity = new FormControl<number>(null);
  originalImport = new FormControl<number>(null);
  isNume = new FormControl<boolean>(null);
  original = new FormControl<number>({ disabled: true, value: null }, [
    Validators.required,
    Validators.pattern(STRING_PATTERN),
  ]);
  en = new FormControl<number>(null, [
    Validators.required,
    Validators.min(1),
    Validators.pattern(NUMBERS_PATTERN),
  ]);
  y = new FormControl<number>(null, [
    Validators.required,
    Validators.min(1),
    Validators.pattern(NUMBERS_PATTERN),
  ]);
}
