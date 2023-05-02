import { FormControl, Validators } from '@angular/forms';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

export class CommercialSalesForm {
  goodNumber = new FormControl(null, [
    Validators.maxLength(10),
    Validators.pattern(NUMBERS_PATTERN),
  ]);
  descGood = new FormControl(null);
  lot = new FormControl(null, [
    Validators.maxLength(10),
    Validators.pattern(NUMBERS_PATTERN),
  ]);
  expedientNumber = new FormControl(null, [
    Validators.maxLength(10),
    Validators.pattern(NUMBERS_PATTERN),
  ]);
  eventTp = new FormControl(null);
  eventId = new FormControl(null, [
    Validators.maxLength(10),
    Validators.pattern(NUMBERS_PATTERN),
  ]);
  mandate = new FormControl(null);
  price = new FormControl(null, [
    Validators.maxLength(20),
    Validators.pattern(NUMBERS_PATTERN),
  ]);
  oi = new FormControl(null, [
    Validators.maxLength(10),
    Validators.pattern(NUMBERS_PATTERN),
  ]);
  rfc = new FormControl(null, [
    Validators.maxLength(20),
    Validators.pattern(STRING_PATTERN),
  ]);
  dateInit = new FormControl(null);
  dateFinal = new FormControl(null);
  regc = new FormControl(null);
  ref = new FormControl(null, [
    Validators.maxLength(35),
    Validators.pattern(STRING_PATTERN),
  ]);
  invoice = new FormControl(null, [
    Validators.maxLength(10),
    Validators.pattern(NUMBERS_PATTERN),
  ]);
  serieNumber = new FormControl(null, [
    Validators.maxLength(50),
    Validators.pattern(STRING_PATTERN),
  ]);
  limit = new FormControl(null);
}
