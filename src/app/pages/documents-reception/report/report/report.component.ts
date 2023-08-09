import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { PrintFlyersService } from 'src/app/core/services/document-reception/print-flyers.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
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
  @Input() delegationField: string = 'delegation';
  @Input() subdelegationField: string = 'subdelegation';
  flyersForm: FormGroup;
  params = new BehaviorSubject<ListParams>(new ListParams());
  PN_DELEG = new EventEmitter<IDelegation>();
  PN_SUBDEL = new EventEmitter<ISubdelegation>();
  selectedSubDelegation = new DefaultSelect<ISubdelegation>();
  selectedDelegation = new DefaultSelect<IDelegation>();
  showSearchForm: boolean = true;
  searchForm: ModelForm<any>;
  reportForm: FormGroup;
  datePickerConfig: Partial<BsDatepickerConfig> = {
    minMode: 'month',
    adaptivePosition: true,
    dateInputFormat: 'MMMM YYYY',
  };
  get delegation() {
    return this.reportForm.get(this.delegationField);
  }
  get subdelegation() {
    return this.reportForm.get(this.subdelegationField);
  }
  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private delegationService: DelegationService,
    private siabService: SiabService,
    private modalService: BsModalService,
    private printFlyersService: PrintFlyersService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    const params = new ListParams();
    this.getDelegation(params);
    this.getSubDelegations(params);
  }
  getDelegation(params?: ListParams) {
    console.log(params);
    this.delegationService.getAll(params).subscribe({
      next: data => {
        console.log(data);
        this.selectedDelegation = new DefaultSelect(data.data, data.count);
        console.log(this.selectedDelegation);
      },
      error: err => {
        console.log(err);
        this.selectedDelegation = new DefaultSelect();
      },
    });
  }
  getSubDelegations(params?: ListParams) {
    const paramsF = new FilterParams();
    paramsF.addFilter(
      'delegationNumber',
      this.reportForm.get(this.delegationField).value
    );
    console.log(paramsF);
    this.printFlyersService.getSubdelegations2(paramsF.getParams()).subscribe({
      next: data => {
        this.selectedSubDelegation = new DefaultSelect(data.data, data.count);
        console.log(this.selectedSubDelegation);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }

        this.onLoadToast('error', 'Error', error);
      },
    });
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
      // .fetchReport('RGEROFPRECEPDOCUM', params)
      .fetchReport('blank', params)
      .subscribe(response => {
        // response=null;
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
        } else {
          this.onLoadToast(
            'warning',
            'advertencia',
            'Sin Datos Para Los Rangos De Fechas Suministrados'
          );
        }
      });
  }
}
