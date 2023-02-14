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
      entidad: [null],
      from: [null, [Validators.required]],
      to: [null, [Validators.required]],
      includeArea: [false],
      area: [null],
      delegdestino: [null],
      subddestino: [null],
    });
  }

  save() {}

  confirm(): void {
    console.log(this.flyersForm.value);
    let params = {
      PN_DELEG: this.flyersForm.controls['delegation'].value,
      PN_SUBDEL: this.flyersForm.controls['subdelegation'].value,
      PF_FECINI: this.flyersForm.controls['from'].value,
      PF_FECFIN: this.flyersForm.controls['to'].value,
      PC_ENTFED: this.flyersForm.controls['entidad'].value,
      PARAMFORM: this.flyersForm.controls['includeArea'].value,
      PN_DELEGACION: this.flyersForm.controls['delegdestino'].value,
      PN_SUBDELEGACION: this.flyersForm.controls['subddestino'].value,
      PN_DEPARTAMENTO: this.flyersForm.controls['area'].value,
    };
    console.log(params);
    // open the window
    this.onLoadToast('success', 'procesando', '');
    //const pdfurl = `http://s29.q4cdn.com/175625835/files/doc_downloads/test.pdf`; //window.URL.createObjectURL(blob);
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RCONCOGVOLANTESRE.pdf?PN_VOLANTEFIN=70646&P_IDENTIFICADOR=0`; //window.URL.createObjectURL(blob);
    this.onLoadToast('success', 'vista generada exitosamente', '');
    window.open(pdfurl, 'RGEROFPESTADIXMES.pdf');
  }

  cleanForm(): void {
    this.flyersForm.reset();
  }
}
