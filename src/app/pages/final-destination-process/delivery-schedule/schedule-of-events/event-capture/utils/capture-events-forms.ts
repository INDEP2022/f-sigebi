import { FormControl, Validators } from '@angular/forms';
import { minDate } from 'src/app/common/validations/date.validators';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

export class CaptureEventRegisterForm {
  typeEvent = new FormControl(null, [Validators.required]);
  captureDate = new FormControl(null, [
    Validators.required,
    minDate(new Date()),
  ]);
  elaborate = new FormControl(null);
  responsible = new FormControl(null, []);
  prog = new FormControl({ value: null, disabled: true }, [
    Validators.required,
  ]);
  transference = new FormControl(null);
  type = new FormControl('RT', [Validators.required]);
  area = new FormControl(null);
  user = new FormControl({ value: null, disabled: true });
  folio = new FormControl({ value: null, disabled: true });
  year = new FormControl({ value: null, disabled: true });
  month = new FormControl({ value: null, disabled: true });
  keysProceedings = new FormControl({ value: null, disabled: true }, [
    Validators.maxLength(60),
    Validators.required,
  ]);
  numFile = new FormControl(null);
}

export class CaptureEventSiabForm {
  initialDate = new FormControl(null, []);
  finalDate = new FormControl(null, []);
  flyer = new FormControl(null);
  lot = new FormControl(null);
  cdonacCve = new FormControl(null);
  adonacCve = new FormControl(null);
  almPaso = new FormControl(null);
  autoComer = new FormControl(null);
  warehouse = new FormControl(null);
  donatNumber = new FormControl(null);
  event = new FormControl(null);
  expedient = new FormControl(null, []);
  dictumCve = new FormControl(null, [Validators.pattern(STRING_PATTERN)]);
  delegation = new FormControl<IDelegation[]>([]);
  transfer = new FormControl<any[]>([]);
  programed = new FormControl(null);
  transmitter = new FormControl<any[]>([]);
  authority = new FormControl<any[]>([]);
  autoInitialDate = new FormControl(null);
  autoFinalDate = new FormControl(null);
}
