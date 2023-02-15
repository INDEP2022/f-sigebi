import { ReportService } from 'src/app/core/services/reports/reports.service';
//BasePage


import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ModelForm } from 'src/app/core/interfaces/model-form';

//BasePage
import { BasePage } from 'src/app/core/shared/base-page';

import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
//Services
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
//Components
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';


export interface IReport {
  data: File;
}


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styles: [],
})
export class ReportComponent extends BasePage implements OnInit {
  reportForm: FormGroup = this.fb.group({});
  select = new DefaultSelect();
  delegations = new DefaultSelect<IDelegation>();
  subdelegations = new DefaultSelect<ISubdelegation>();
  departments = new DefaultSelect<IDepartment>();
  phaseEdo: number;
  maxDateEnd = new Date();
  maxDateStart: Date;
  minDateEnd: Date;

  showSearchForm: boolean = true;
  searchForm: ModelForm<any>;
  datePickerConfig: Partial<BsDatepickerConfig> = {
    minMode: 'month',
    adaptivePosition: true,
    dateInputFormat: 'MMMM YYYY',
  };

  constructor(private fb: FormBuilder,
    private reportService: ReportService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private siabService: SiabService,
    private serviceDeleg: DelegationService,) {
    super();
    this.maxDateStart = new Date(
      this.maxDateEnd.getFullYear(),
      this.maxDateEnd.getMonth(),
      this.maxDateEnd.getDate() - 1
    );
    this.minDateEnd = new Date(this.maxDateEnd.getFullYear() - 1, 0, 1);
  }
  get PN_NODELEGACION() {
    return this.reportForm.get('PN_DELEG');
  }
  get PN_NOSUBDELEGACION() {
    return this.reportForm.get('PN_SUBDEL');
  }


  ngOnInit(): void {
    this.prepareForm();
    // this.confirm();
  }

  prepareForm() {
    this.reportForm = this.fb.group({
      PN_DELEG: [null, Validators.maxLength(200)],
      PN_SUBDEL: [null, Validators.maxLength(30)],
      PF_MES: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(10)],
      ],
      PF_ANIO: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(30),
        ],
      ]
    });
  }




  loadFile() {
    return;
  }

  confirm(): void {

    this.loading = true;

    const downloadLink = document.createElement('a');
    //console.log(linkSource);
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RCONCOGVOLANTESRE.pdf?PARAMFORM=params`; //window.URL.createObjectURL(blob);
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';
    downloadLink.click();

    // console.log(this.reportForm.value);
    let params = { ...this.reportForm.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    }
    //let newWin = window.open(pdfurl, 'test.pdf');
    this.onLoadToast('success', '', 'Reporte generado');
    this.loading = false;
    //console.log(params);
    /*this.siabService
      .getReport(SiabReportEndpoints.RCONCOGVOLANTESRE, params)
      .subscribe({
        next: response => {
          console.log(response);
          // this.readFile(response);
          window.open(pdfurl, 'Reporte de Impresion de Volantes');
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          // this.openPrevPdf(pdfurl);
          window.open(pdfurl, 'Reporte de Impresion de Volantes');
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

  readFile(file: IReport) {
    const reader = new FileReader();
    reader.readAsDataURL(file.data);
    reader.onload = _event => {
      // this.retrieveURL = reader.result;
      this.openPrevPdf(reader.result as string);
    };
  }

  openPrevPdf(pdfurl: string) {
    console.log(pdfurl);
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  getDelegations(params: ListParams) {
    this.serviceDeleg.getAll(params).subscribe(
      data => {
        this.delegations = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
      () => { }
    );
  }

  getSubDelegations(lparams: ListParams) {
    // console.log(lparams);
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('dsarea', lparams.text, SearchFilter.LIKE);
    if (this.PN_NODELEGACION.value) {
      params.addFilter('delegationNumber', this.PN_NODELEGACION.value);
    }
    if (this.phaseEdo) params.addFilter('phaseEdo', this.phaseEdo);
    // console.log(params.getParams());
    this.reportService.getSubdelegations(params.getParams()).subscribe({
      next: data => {
        this.subdelegations = new DefaultSelect(data.data, data.count);
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

  getDepartments(lparams: ListParams) {
    // console.log(lparams);
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('dsarea', lparams.text, SearchFilter.LIKE);
    if (this.PN_NODELEGACION.value) {
      params.addFilter('numDelegation', this.PN_NODELEGACION.value);
    }
    if (this.PN_NOSUBDELEGACION.value) {
      params.addFilter('numSubDelegation', this.PN_NOSUBDELEGACION.value);
    }
    if (this.phaseEdo) params.addFilter('phaseEdo', this.phaseEdo);
    // console.log(params.getParams());
    this.reportService.getReport(params.getParams()).subscribe({
      next: data => {
        console.log(data);

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

  onDelegationsChange(element: any) {
    this.resetFields([this.PN_NOSUBDELEGACION]);

    this.subdelegations = new DefaultSelect();
    this.departments = new DefaultSelect();
    // console.log(this.PN_NODELEGACION.value);
    if (this.PN_NODELEGACION.value)
      this.getSubDelegations({ page: 1, limit: 10, text: '' });
  }

  onSubDelegationsChange(element: any) {
    this.departments = new DefaultSelect();
    if (this.PN_NOSUBDELEGACION.value)
      this.getDepartments({ page: 1, limit: 10, text: '' });
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.reportForm.updateValueAndValidity();
  }

  setMinDateEnd(date: Date) {
    if (date != undefined) this.minDateEnd = date;
  }

  cleanForm(): void {
    this.reportForm.reset();
  }

}


