import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ReportService } from 'src/app/core/services/reports/reports.service';
//BasePage
import { BasePage } from 'src/app/core/shared/base-page';

export interface IReport {
  data: File;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styles: [],
})
export class ReportComponent extends BasePage implements OnInit {
  @Output() sendSearchForm = new EventEmitter<any>();
  @Output() resetForm = new EventEmitter<boolean>();
  showSearchForm: boolean = true;
  searchForm: ModelForm<any>;
  reportForm: FormGroup;
  datePickerConfig: Partial<BsDatepickerConfig> = {
    minMode: 'month',
    adaptivePosition: true,
    dateInputFormat: 'MMMM YYYY',
  };

  get from() {
    return this.reportForm.get('from');
  }

  get to() {
    return this.reportForm.get('to');
  }
  constructor(private fb: FormBuilder, private reportService: ReportService) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.reportForm = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      from: [null, [Validators.required]],
      to: [null, [Validators.required]],
    });
  }

  save() {}

  confirm(): void {
    console.log(this.reportForm.value);
    /*
        let params = {
          PN_DELEG: this.reportForm.controls['delegation'].value,
          PN_SUBDEL: this.reportForm.controls['subdelegation'].value,
          PF_MES: this.reportForm.controls['from'].value,
          PF_ANIO: this.reportForm.controls['to'].value,
        };
        */

    //this.showSearch = true;
    const start = new Date(this.reportForm.get('from').value);
    const end = new Date(this.reportForm.get('to').value);

    const startTemp = `${start.getFullYear()}-0${
      start.getUTCMonth() + 1
    }-0${start.getDate()}`;
    const endTemp = `${end.getFullYear()}-0${
      end.getUTCMonth() + 1
    }-0${end.getDate()}`;

    if (end < start) {
      this.onLoadToast(
        'warning',
        'advertencia',
        'Fecha final no puede ser menor a fecha de inicio'
      );
      return;
    }
    // console.log(this.reportForm.value);
    let params = { ...this.reportForm.value };

    for (const key in params) {
      if (params[key] === null) delete params[key];
    }
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGEROFPRECEPDOCUM.pdf?P_IDENTIFICADOR=${params}`; //window.URL.createObjectURL(blob);
    const pdfurl = `https://drive.google.com/file/d/1o3IASuVIYb6CPKbqzgtLcxx3l_V5DubV/view?usp=sharing`; //window.URL.createObjectURL(blob);
    window.open(pdfurl, 'RGEROFPRECEPDOCUM.pdf');
    setTimeout(() => {
      this.onLoadToast('success', '', 'Reporte generado');
    }, 1000);

    this.loading = false;
    this.cleanForm();
  }

  cleanForm(): void {
    this.reportForm.reset();
  }

  pdfSrc!: Uint8Array;
  api = '';

  preview(file: IReport) {
    try {
      this.reportService.download(file).subscribe(response => {
        if (response !== null) {
          let blob = new Blob([response], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL);
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  Generar() {
    const start = new Date(this.reportForm.get('PF_MES').value);
    const end = new Date(this.reportForm.get('PF_ANIO').value);

    const startTemp = `${start.getFullYear()}-0${
      start.getUTCMonth() + 1
    }-0${start.getDate()}`;
    const endTemp = `${end.getFullYear()}-0${
      end.getUTCMonth() + 1
    }-0${end.getDate()}`;

    if (endTemp < startTemp) {
      this.onLoadToast(
        'warning',
        'advertencia',
        'Fecha final no puede ser menor a fecha de inicio'
      );
    }

    this.reportService.getReport(this.reportForm.value).subscribe({
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
}
