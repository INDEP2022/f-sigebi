import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
//BasePage
import { BasePage } from 'src/app/core/shared/base-page';

export interface IReport {
  data: File;
}

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
  constructor(private fb: FormBuilder, private reportService: ReportService) {
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

  save() { }

  confirm(): void {
    console.log(this.flyersForm.value);
    /*
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
        */
    const start = new Date(this.flyersForm.get('from').value);
    const end = new Date(this.flyersForm.get('to').value);

    const startTemp = `${start.getFullYear()}-0${start.getUTCMonth() + 1
      }-0${start.getDate()}`;
    const endTemp = `${end.getFullYear()}-0${end.getUTCMonth() + 1
      }-0${end.getDate()}`;

    if (end < start) {
      this.onLoadToast(
        'warning',
        'advertencia',
        'Fecha final no puede ser menor a fecha de inicio'
      )
      return;
    }
    // console.log(this.reportForm.value);
    let params = { ...this.flyersForm.value };

    for (const key in params) {
      if (params[key] === null) delete params[key];
    }

    console.log(params);
    // open the window
    this.onLoadToast('success', 'procesando', '');
    //const pdfurl = `http://s29.q4cdn.com/175625835/files/doc_downloads/test.pdf`; //window.URL.createObjectURL(blob);
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGEROFPRESUMENDIA.pdf?P_IDENTIFICADOR=${params}`; //window.URL.createObjectURL(blob);
    this.onLoadToast('success', 'Reporte generado', '');
    window.open(pdfurl, 'RGEROFPRESUMENDIA.pdf');
    this.loading = false;
    this.cleanForm();
  }


  Generar() {
    const start = new Date(this.flyersForm.get('from').value);
    const end = new Date(this.flyersForm.get('to').value);

    const startTemp = `${start.getFullYear()}-0${start.getUTCMonth() + 1
      }-0${start.getDate()}`;
    const endTemp = `${end.getFullYear()}-0${end.getUTCMonth() + 1
      }-0${end.getDate()}`;

    if (endTemp < startTemp) {
      this.onLoadToast(
        'warning',
        'advertencia',
        'Fecha final no puede ser menor a fecha de inicio'
      )
    }

    this.reportService
      .getReportDiario(
        this.flyersForm.value,

      )
      .subscribe({
        next: (resp: any) => {
          if (resp.file.base64 !== '') {
            this.preview(resp.file.base64);
          } else {
            this.onLoadToast(
              'warning',
              'advertencia',
              'Sin datos para los rangos de fechas suministrados'
            );
          }

          return;
        },
      });
  }

  preview(file: IReport) {
    try {
      this.reportService.download(file).subscribe(response => {
        if (response !== null) {
          let blob = new Blob([response], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL);

        }

      })
    } catch (e) {
      console.error(e)
    }
  }



  cleanForm(): void {
    this.flyersForm.reset();
  }
}
