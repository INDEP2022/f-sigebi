import { FormControl, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

export class SHIPPING_DOCUMENTS_FORM {
  officeNum = new FormControl<string>(null);
  officeCve = new FormControl<string>(null);
  date = new FormControl<Date>(null, [Validators.required]);
  priority = new FormControl<string>(null, [Validators.required]);
  messageBody = new FormControl<string>(null, [
    Validators.required,
    Validators.pattern(STRING_PATTERN),
    Validators.maxLength(4000),
  ]);
  delegation = new FormControl<number>({ value: null, disabled: true });
  subdelegation = new FormControl<number>({ value: null, disabled: true });
  department = new FormControl<number>({ value: null, disabled: true });
  sender = new FormControl<string>(null, [Validators.required]);
  receiver = new FormControl<string>(null, [Validators.required]);
  cpp = new FormControl<number>(null);
  messageType = new FormControl<'area' | 'direction'>(null);
}
