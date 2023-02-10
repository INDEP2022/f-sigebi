import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { EventEmitter, Output } from '@angular/core';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
//BasePage
import { BasePage } from 'src/app/core/shared/base-page';
import { AnalysisResultModule } from 'src/app/pages/request/economic-compensation/analysis-result/analysis-result.module';

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
      dateRequest: [null, [Validators.required]],
      from: [null],
      to: [null],
      range: ['daily', [Validators.required]],
    });
  }

  save() { }

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

    console.log(this.reportForm.value);
    let params = {
      PN_DELEG: this.reportForm.controls['delegation'].value,
      PN_SUBDEL: this.reportForm.controls['subdelegation'].value,
      PF_MES: this.reportForm.controls['from'].value,
      PF_ANIO: this.reportForm.controls['to'].value,
    };

    console.log(params);



    // open the window

    this.onLoadToast('success', 'vista generada exitosamente', '');
    this.preview(params);

    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGEROFPRECEPDOCUM.pdf? P_USR=LGONZALEZ&P_CUMP=1&P_T_NO_CUMP=2&P_T_CUMP=100`; //window.URL.createObjectURL(blob);
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RCONCOGVOLANTESRE.pdf?PN_VOLANTEFIN=70646&P_IDENTIFICADOR=0`; //window.URL.createObjectURL(blob);


  }

  cleanForm(): void {
    this.reportForm.reset();
  }

  preview(data: any) {

    this.reportService.download(data).subscribe(response => {
      if (response !== null) {
        const fileReader = new FileReader();
        let blob = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, "RGEROFPRECEPDOCUM.pdf");



      }
    });
  }

}
