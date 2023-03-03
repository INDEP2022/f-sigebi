import { FormControl, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

export class EntityClasificationForm {
  id = new FormControl<string>(null, [
    Validators.required,
    Validators.pattern(STRING_PATTERN),
    Validators.maxLength(3),
  ]);
  description = new FormControl<string>(null, [
    Validators.required,
    Validators.pattern(STRING_PATTERN),
    Validators.maxLength(60),
  ]);
}
