import { FormControl } from '@angular/forms';

export class JOB_FORM {
  jobKey = new FormControl<string>(null);
  shippingDate = new FormControl<Date>(null);
  shippingDate2 = new FormControl<Date>(null);
  priority = new FormControl<string>(null);
  status = new FormControl<string>(null);
  jobsType = new FormControl<string>(null);
  text = new FormControl<string>(null);
  userOrigin = new FormControl<string>(null);
}
