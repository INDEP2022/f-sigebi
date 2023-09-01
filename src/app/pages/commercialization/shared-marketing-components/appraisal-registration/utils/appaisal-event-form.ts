import { FormControl, Validators } from '@angular/forms';

export class AppraisalEventForm {
  id = new FormControl<string | number>(null, Validators.required);
}
