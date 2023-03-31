import { FormControl, Validators } from '@angular/forms';

export class DocumentsScanForm {
  expedient = new FormControl<number>(null, [
    Validators.required,
    Validators.max(99999999999),
  ]);
  folio = new FormControl<number>(null, [
    Validators.required,
    Validators.max(999999999999999),
  ]);
  de = new FormControl(null, [Validators.required]);
  a = new FormControl(null, [Validators.required]);
  mantener = new FormControl(null, [Validators.required]);
  mostrat = new FormControl(null, [Validators.required]);
}
