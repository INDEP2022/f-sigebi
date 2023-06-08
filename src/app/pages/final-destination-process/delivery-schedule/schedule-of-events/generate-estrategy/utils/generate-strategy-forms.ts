import { FormControl, Validators } from '@angular/forms';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

export class GenerateStrategyServiceForm {
  type = new FormControl(null, []);
  process = new FormControl(null, []);
  strategyCve = new FormControl(null);
  processDescrip = new FormControl(null, [Validators.pattern(STRING_PATTERN)]);
  captureDate = new FormControl<Date>(null, []);
  regionalCoord = new FormControl(null, [Validators.pattern(STRING_PATTERN)]);
  coordinationDescrip = new FormControl(null, [
    Validators.pattern(STRING_PATTERN),
  ]);
  serviceKey = new FormControl(null, [
    Validators.pattern(KEYGENERATION_PATTERN),
  ]);
  cancellAuthDate = new FormControl(null, []);
  uniqueKey = new FormControl(null, [
    Validators.pattern(KEYGENERATION_PATTERN),
  ]);
  transferenceId = new FormControl(null, []);
  transferenceDescrip = new FormControl(null, [
    Validators.pattern(STRING_PATTERN),
  ]);
  transmitterId = new FormControl(null, []);
  transmitterDescrip = new FormControl(null, [
    Validators.pattern(STRING_PATTERN),
  ]);
  authorityId = new FormControl(null, []);
  authorityDescrip = new FormControl(null, [
    Validators.pattern(STRING_PATTERN),
  ]);
  keyStore = new FormControl(null, [Validators.pattern(KEYGENERATION_PATTERN)]);
  storeDescrip = new FormControl(null, [Validators.pattern(STRING_PATTERN)]);
  ubication = new FormControl(null, [Validators.pattern(STRING_PATTERN)]);
  location = new FormControl(null, [Validators.pattern(STRING_PATTERN)]);
  municipality = new FormControl(null, [Validators.pattern(STRING_PATTERN)]);
  state = new FormControl(null, [Validators.pattern(STRING_PATTERN)]);
  providerFolio = new FormControl(null, [Validators.pattern(STRING_PATTERN)]);
  eventStartDate = new FormControl(null, []);
  eventEndDate = new FormControl(null, []);
  eventTime = new FormControl(new Date(), []);
  statusChange = new FormControl(null, []);
}

export class GenerateStrategyGoodsForm {
  eventStartDate = new FormControl(null, []);
  eventEndDate = new FormControl(null, []);
  eventTime = new FormControl(new Date(), []);
  statusChange = new FormControl(null, []);
}
