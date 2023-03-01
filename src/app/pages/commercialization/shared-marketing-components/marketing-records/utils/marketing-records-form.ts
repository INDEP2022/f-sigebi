import { FormControl, Validators } from '@angular/forms';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

export class MarketingRecordsForm {
  recordType = new FormControl<string>('physicalDelivery', [
    Validators.required,
  ]);
  goodId = new FormControl<string>(null, [Validators.required]);
  portfolio = new FormControl(null, [
    Validators.required,
    Validators.pattern(STRING_PATTERN),
  ]);
  recordCommerType = new FormControl(null, [Validators.required]);
  recordKey = new FormControl(null, Validators.pattern(KEYGENERATION_PATTERN));
  sender = new FormControl(null, [Validators.required]);
  recipient = new FormControl(null, [Validators.required]);
  salesProcess = new FormControl(null, [Validators.required]);
  city = new FormControl(null, [Validators.required]);
  paragraph1 = new FormControl(null, [
    Validators.required,
    Validators.pattern(STRING_PATTERN),
  ]);
  paragraph2 = new FormControl(null, [
    Validators.required,
    Validators.pattern(STRING_PATTERN),
  ]);
  paragraph3 = new FormControl(null, [
    Validators.required,
    Validators.pattern(STRING_PATTERN),
  ]);
}
