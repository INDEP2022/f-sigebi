import { FormControl } from '@angular/forms';

export class AppraisalConsultationForm {
  idEvent = new FormControl(null);
  idAppraisal = new FormControl<string[]>([]);
  statusAppraisal = new FormControl<string>(null);
  keyAppraisal = new FormControl<string>(null);
  keyOffice = new FormControl<string>(null);
  noGood = new FormControl<string[]>([]);
  opinion = new FormControl<string>(null);
}

export class ApppraisalConsultationSumForm {
  total_vri = new FormControl(null);
  total_vri_iva = new FormControl(null);
  total_vri_redondeado = new FormControl(null);
  total_vc = new FormControl(null);
  tot_vc_iva = new FormControl(null);
  tot_vri_con_desc = new FormControl(null);
  tot_iva_vri_desc = new FormControl(null);
}
