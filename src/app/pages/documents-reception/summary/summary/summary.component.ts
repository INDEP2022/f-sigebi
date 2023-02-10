import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
//BasePage
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styles: [],
})
export class SummaryComponent extends BasePage implements OnInit {
  flyersForm: FormGroup;
  select = new DefaultSelect();
  datePickerConfig: Partial<BsDatepickerConfig> = {
    minMode: 'month',
    adaptivePosition: true,
    dateInputFormat: 'MMMM YYYY',
  };

  get includeArea() {
    return this.flyersForm.get('includeArea');
  }
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.flyersForm = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      entidad: [null, [Validators.required]],
      from: [null, [Validators.required]],
      to: [null, [Validators.required]],
      includeArea: [false, [Validators.required]],
      area: [null, [Validators.required]],
    });
  }

  save() {}

  confirm(): void {
    this.loading = true;
    console.log(this.flyersForm.value);
    let params = {
      PN_DELEG: this.flyersForm.controls['delegation'].value,
      PN_SUBDEL: this.flyersForm.controls['subdelegation'].value,
      PF_FECINI: this.flyersForm.controls['from'].value,
      PF_FECFIN: this.flyersForm.controls['to'].value,
      PC_ENTFED: this.flyersForm.controls['entidad'].value,
    };

    console.log(params);
    // open the window
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGEROFPRECEPDOCUM.pdf? P_USR=LGONZALEZ&P_CUMP=1&P_T_NO_CUMP=2&P_T_CUMP=100`; //window.URL.createObjectURL(blob);
    //let newWin = window.open(pdfurl,"test.pdf");

    this.onLoadToast('error', 'Reporte no disponible', '');
    this.loading = false;
  }
  cleanForm(): void {
    this.flyersForm.reset();
  }
}
