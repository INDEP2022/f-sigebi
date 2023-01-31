import { Validators } from '@angular/forms';

export class GOODS_FORM_VIGILANCE_FORM {
  goodNum = [null, [Validators.required]];
  goodDescription = [null, [Validators.required]];
  goodStatus = [null, [Validators.required]];
  action = [null, [Validators.required]];
  apply = [null, [Validators.required]];
  capture = [null, [Validators.required]];
  requestUser = [null, [Validators.required]];
  captureUser = [null, [Validators.required]];
  authorizeUser = [null, [Validators.required]];
  justification = [null, [Validators.required]];
}
