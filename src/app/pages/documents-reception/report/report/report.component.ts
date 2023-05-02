import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ReportService } from 'src/app/core/services/reports/reports.service';
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
  params = new BehaviorSubject<ListParams>(new ListParams());
  PN_DELEG = new EventEmitter<IDelegation>();
  PN_SUBDEL = new EventEmitter<ISubdelegation>();
  showSearchForm: boolean = true;
  searchForm: ModelForm<any>;
  reportForm: FormGroup;
  datePickerConfig: Partial<BsDatepickerConfig> = {
    minMode: 'month',
    adaptivePosition: true,
    dateInputFormat: 'MMMM YYYY',
  };

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private siabService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.reportForm = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      PF_MES: [null, [Validators.required]],
      PF_ANIO: [null, [Validators.required]],
    });
  }

  save() {}

  confirm(): void {
    let params = {
      PN_DELEG: this.reportForm.controls['delegation'].value,
      PN_SUBDEL: Number(this.reportForm.controls['subdelegation'].value),
      PF_MES: this.reportForm.controls['PF_MES'].value,
      PF_ANIO: this.reportForm.controls['PF_ANIO'].value,
    };

    //this.showSearch = true;
    console.log(params);

    setTimeout(() => {
      this.onLoadToast('success', 'procesando', '');
    }, 1000);
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGEROFPRECEPDOCUM.pdf?PN_DELEG=${params.PN_DELEG}&PN_SUBDEL=${params.PN_SUBDEL}&PF_MES=${params.PF_MES}&PF_ANIO=${params.PF_ANIO}`;
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`; //window.URL.createObjectURL(blob);
    window.open(pdfurl, 'RGEROFPRECEPDOCUM.pdf');
    setTimeout(() => {
      this.onLoadToast('success', 'Reporte generado', '');
    }, 2000);

    this.loading = false;
    this.cleanForm();
  }

  cleanForm(): void {
    this.reportForm.reset();
  }

  Generar() {
    let params = {
      PN_DELEG: this.reportForm.controls['delegation'].value,
      PN_SUBDEL: this.reportForm.controls['subdelegation'].value,
      PF_MES: this.reportForm.controls['PF_MES'].value,
      PF_ANIO: this.reportForm.controls['PF_ANIO'].value,
    };

    this.siabService
      .fetchReport('RGEROFPRECEPDOCUM', params)
      .subscribe(response => {
        if (response !== null) {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true, //ignora el click fuera del modal
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        }
      });
  }
}
