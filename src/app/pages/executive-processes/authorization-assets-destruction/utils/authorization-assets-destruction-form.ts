import { FormControl, Validators } from '@angular/forms';
import { maxDate } from 'src/app/common/validations/date.validators';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

export class AuthorizationAssetsDestructionForm {
  idExpedient = new FormControl(null, [Validators.required]);
  preliminaryInquiry = new FormControl(
    { value: null, disabled: true },
    Validators.pattern(STRING_PATTERN)
  );
  criminalCase = new FormControl(
    { value: null, disabled: true },
    Validators.pattern(STRING_PATTERN)
  );
  circumstantialRecord = new FormControl(
    { value: null, disabled: true },
    Validators.pattern(STRING_PATTERN)
  );
  keyPenalty = new FormControl(
    { value: null, disabled: true },
    Validators.pattern(STRING_PATTERN)
  );
  noAuth = new FormControl(
    { value: null, disabled: true },
    Validators.pattern(STRING_PATTERN)
  );
  authNotice = new FormControl(null, Validators.pattern(STRING_PATTERN));
  fromDate = new FormControl(null, maxDate(new Date()));
  scanFolio = new FormControl(null, Validators.pattern(KEYGENERATION_PATTERN));
  cancelSheet = new FormControl(
    null,
    Validators.pattern(KEYGENERATION_PATTERN)
  );
}
