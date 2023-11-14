import { FormControl, Validators } from '@angular/forms';

export class ReportConfigForm {
  repConfigId = new FormControl(null);
  reportNb = new FormControl(null, [Validators.required]);
  descriptionNb = new FormControl(null);
  legendNb = new FormControl(null);
  legendTp = new FormControl(null);
  contentTx = new FormControl(null);
  watermarkTx = new FormControl(null);
  leftLogoTx = new FormControl(null);
  rightLogoTx = new FormControl(null);
  footerLogoTx = new FormControl(null);
}
