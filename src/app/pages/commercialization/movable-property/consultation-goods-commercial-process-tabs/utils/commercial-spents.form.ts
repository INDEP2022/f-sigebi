import { FormControl, Validators } from '@angular/forms';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

export class CommercialSpentForm {
  good = new FormControl<string>(null, [
    Validators.pattern(STRING_PATTERN),
    Validators.max(9999999999),
  ]);
  beneficiary = new FormControl<string>(null, [
    Validators.pattern(STRING_PATTERN),
    Validators.maxLength(60),
  ]);
  paymentRequest = new FormControl<string>(null, [
    Validators.pattern(STRING_PATTERN),
    Validators.maxLength(10),
  ]);
  capture = new FormControl<string>(null, [
    Validators.pattern(STRING_PATTERN),
    Validators.maxLength(30),
  ]);
  request = new FormControl<string>(null, [
    Validators.pattern(STRING_PATTERN),
    Validators.maxLength(30),
  ]);
  authority = new FormControl<string>(null, [
    Validators.pattern(STRING_PATTERN),
    Validators.maxLength(30),
  ]);
  folatenclie = new FormControl<string>(null, [
    Validators.pattern(STRING_PATTERN),
    Validators.maxLength(12),
  ]);
  concept = new FormControl<string>(null, [Validators.pattern(STRING_PATTERN)]);
  invoice = new FormControl<string>(null, [
    Validators.pattern(STRING_PATTERN),
    Validators.maxLength(10),
  ]);
  importeF = new FormControl<string>(null, [
    Validators.pattern(NUMBERS_PATTERN),
    Validators.maxLength(20),
  ]);
  mandate = new FormControl<string>(null, [Validators.pattern(STRING_PATTERN)]);
}
