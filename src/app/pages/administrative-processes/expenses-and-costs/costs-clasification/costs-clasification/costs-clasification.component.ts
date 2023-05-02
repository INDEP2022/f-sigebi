import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
@Component({
  selector: 'app-costs-clasification',
  templateUrl: './costs-clasification.component.html',
  styles: [],
})
export class CostsClasificationComponent extends BasePage implements OnInit {
  constructor() {
    super();
  }

  form: FormGroup;

  ngOnInit(): void {
    // this.prepareForm();
  }

  // prepareForm() {
  //   this.form = this.fb.group({

  //   });
  // }

  save() {}

  confirm(): void {
    setTimeout(() => {
      this.onLoadToast('success', 'procesando', '');
    }, 1000);
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGEROFPRESUMENDIAA.pdf?PN_DELEG=${params.PN_DELEG}&PN_SUBDEL=${params.PN_SUBDEL}&PN_DELEGACION=${params.PN_DELEGACION}&PN_SUBDELEGACION=${params.PN_SUBDELEGACION}&PF_FECINI=${params.PF_FECINI}&PF_FECFIN=${params.PF_FECFIN}&PC_ENTFED=${params.PC_ENTFED}&DEPARTAMENTO=${params.DEPARTAMENTO}`;
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`; //window.URL.createObjectURL(blob);
    setTimeout(() => {
      this.onLoadToast('success', 'Reporte generado', '');
    }, 2000);

    window.open(pdfurl, 'CLASIFICACIÓN_COSTOS.pdf');
    this.loading = false;
  }
}
