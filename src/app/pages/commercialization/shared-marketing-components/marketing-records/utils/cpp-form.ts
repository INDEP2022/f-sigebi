import { inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

export class CppForm {
  private fb = inject(FormBuilder);
  copies = this.fb.array([this.fb.group(new CppControl())]);
}

export class CppControl {
  id = new FormControl<string>(null, [Validators.required]);
  name = new FormControl<string>(null);
}
