import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ModelForm } from 'src/app/core/interfaces/model-form';
//BasePage
import { BasePage } from 'src/app/core/shared/base-page';

interface IReportRanges {
  code: 'daily' | 'monthly' | 'yearly';
  name: string;
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

  ranges: IReportRanges[] = [
    { code: 'daily', name: 'Diario' },
    { code: 'monthly', name: 'Mensual' },
    { code: 'yearly', name: 'Anual' },
  ];

  get range() {
    return this.reportForm.get('range');
  }

  get from() {
    return this.reportForm.get('from');
  }

  get to() {
    return this.reportForm.get('to');
  }
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.reportForm = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      dateRequest: [null, [Validators.required]],
      from: [null],
      to: [null],
      range: ['daily', [Validators.required]],
    });
  }

  save() {}

  rangeChange() {
    this.changeCalendarFormat();
    this.from.setValue(null);
    this.to.setValue(null);
  }

  changeCalendarFormat() {
    if (this.range.value === 'yearly') {
      this.datePickerConfig.minMode = 'year';
      this.datePickerConfig.dateInputFormat = 'YYYY';
    } else {
      this.datePickerConfig.minMode = 'month';
      this.datePickerConfig.dateInputFormat = 'MMMM YYYY';
    }
  }

  confirm(): void {
    this.loading = true;
    console.log(this.reportForm.value);
    let params = {
      PN_DELEG: this.reportForm.controls['delegation'].value,
      PN_SUBDEL: this.reportForm.controls['subdelegation'].value,
      PF_MES: this.reportForm.controls['from'].value,
      PF_ANIO: this.reportForm.controls['to'].value,
    };

    console.log(params);
    // open the window
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGEROFPRECEPDOCUM.pdf? P_USR=LGONZALEZ&P_CUMP=1&P_T_NO_CUMP=2&P_T_CUMP=100`; //window.URL.createObjectURL(blob);
    //let newWin = window.open(pdfurl,"test.pdf");

    //
    this.loading = false;
    this.onLoadToast('error', 'Reporte no disponible', '');
    const guardarArchivoDeTexto = (params: ArrayBuffer) => {
      const a = document.createElement('a');
      const archivo = new Blob([params], { type: 'application/pdf' });
      const url = URL.createObjectURL(archivo);
      a.href = url;

      a.click();
      URL.revokeObjectURL(url);
      window.open(url);
    };

    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGEROFPRECEPDOCUM.pdf? P_USR=LGONZALEZ&P_CUMP=1&P_T_NO_CUMP=2&P_T_CUMP=100`; //window.URL.createObjectURL(blob);
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RCONCOGVOLANTESRE.pdf?PN_VOLANTEFIN=70646&P_IDENTIFICADOR=0`; //window.URL.createObjectURL(blob);

    // console.log(this.flyersForm.value);
    //let params = { ...this.flyersForm.value };
    /*for (const key in params) {
      if (params[key] === null) delete params[key];
    }*/
    //console.log(params);
    /*this.siabService
      .getReport(SiabReportEndpoints.RCONCOGVOLANTESRE, params)
      .subscribe({
        next: response => {
          console.log(response);
          // this.readFile(response);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.openPrevPdf(pdfurl);
        },
      });*/
    // this.loading = false;
    //this.openPrevPdf(pdfurl)
    // open the window
    //let newWin = window.open(pdfurl,"test.pdf");

    // this.siabService.getReport(SiabReportEndpoints.RINDICA, form).subscribe(
    //   (report: IReport) => {
    //     console.log(report);
    //     //TODO: VIEW FILE
    //   },
    //   error => (this.loading = false)
    // );
    /*setTimeout(st => {
      this.loading = false;
    }, 5000);*/
  }

  cleanForm(): void {
    this.reportForm.reset();
  }
}
