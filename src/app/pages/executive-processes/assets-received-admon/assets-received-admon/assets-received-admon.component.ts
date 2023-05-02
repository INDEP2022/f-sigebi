import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { maxDate } from 'src/app/common/validations/date.validators';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Models
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
//Services
import { TvalTable1Data } from 'src/app/core/models/catalogs/dinamic-tables.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { PrintFlyersService } from 'src/app/core/services/document-reception/print-flyers.service';
import { DynamicTablesService } from 'src/app/core/services/dynamic-catalogs/dynamic-tables.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';

export interface IReport {
  data: File;
}

@Component({
  selector: 'app-assets-received-admon',
  templateUrl: './assets-received-admon.component.html',
  styles: [],
})
export class AssetsReceivedAdmonComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  select = new DefaultSelect();
  today: Date;
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  delegations = new DefaultSelect<IDelegation>();
  subdelegations = new DefaultSelect<ISubdelegation>();
  status = new DefaultSelect<TvalTable1Data>();
  statusD: TvalTable1Data;

  phaseEdo: number;

  get delegation() {
    return this.form.get('delegation');
  }
  get subdelegation() {
    return this.form.get('subdelegation');
  }

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private serviceDeleg: DelegationService,
    private printFlyersService: PrintFlyersService,
    private dynamicTablesService: DynamicTablesService,
    private siabService: SiabService
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: [null],
      subdelegation: [null],
      // fromDate: ['', [Validators.required]],
      // toDate: ['', [Validators.required]],
      rangeDate: [null, [Validators.required, maxDate(new Date())]],
      status: [null],
      statusDescription: [null],
    });
  }

  getDelegations(params: ListParams) {
    this.serviceDeleg.getAll(params).subscribe(
      data => {
        this.delegations = new DefaultSelect(data.data, data.count);
      },
      err => {
        this.delegations = new DefaultSelect([], 0);
      },
      () => {}
    );
  }

  onDelegationsChange(element: any) {
    this.resetFields([this.delegation]);
    this.subdelegations = new DefaultSelect([], 0);
    this.form.controls['subdelegation'].setValue(null);
    if (this.delegation.value)
      this.getSubDelegations({ page: 1, limit: 10, text: '' });
  }

  getSubDelegations(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams?.text.length > 0)
      params.addFilter('description', lparams.text, SearchFilter.LIKE);
    if (this.delegation.value) {
      params.addFilter('delegationNumber', this.delegation.value);
    }
    if (this.phaseEdo) params.addFilter('phaseEdo', this.phaseEdo);
    // console.log(params.getParams());
    this.printFlyersService.getSubdelegations(params.getParams()).subscribe({
      next: data => {
        this.subdelegations = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.subdelegations = new DefaultSelect([], 0);
      },
    });
  }

  onSubDelegationsChange(element: any) {
    this.resetFields([this.subdelegation]);
  }

  getStatus(params: ListParams) {
    this.dynamicTablesService.getStatusByTable400(params).subscribe(
      data => {
        this.status = new DefaultSelect(data.data, data.count);
      },
      err => {
        this.status = new DefaultSelect([], 0);
      },
      () => {}
    );
  }

  onValuesChange(statusChange: TvalTable1Data) {
    this.statusD = statusChange;
    this.form.controls['statusDescription'].setValue(this.statusD.value);
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }

  cleanForm(): void {
    this.form.reset();
  }

  confirm(): void {
    this.loading = true;

    const { rangeDate, delegation, status, statusDescription, subdelegation } =
      this.form.value;

    const startTemp = `${rangeDate[0].getFullYear()}-${
      rangeDate[0].getUTCMonth() + 1 <= 9 ? 0 : ''
    }${rangeDate[0].getUTCMonth() + 1}-${
      rangeDate[0].getDate() <= 9 ? 0 : ''
    }${rangeDate[0].getDate()}`;

    const endTemp = `${rangeDate[1].getFullYear()}-${
      rangeDate[1].getUTCMonth() + 1 <= 9 ? 0 : ''
    }${rangeDate[1].getUTCMonth() + 1}-${
      rangeDate[1].getDate() <= 9 ? 0 : ''
    }${rangeDate[1].getDate()}`;

    const reportParams = {
      PF_FECINI: startTemp,
      PF_FECFIN: endTemp,
      PARAM_DELEGACION: delegation,
      PARAM_SUBDELEGACION: subdelegation,
      PARAM_ESTATUS: status,
    };
    console.log(reportParams);
    //Todo: Get Real Report
    /*this.getReport('RCONDIRREPORBIERE', reportParams);*/
    this.getReportBlank('blank');
  }

  getReport(report: string, params: any): void {
    this.siabService.fetchReport(report, params).subscribe({
      next: response => {
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
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('error', 'No disponible', 'Reporte no disponible');
      },
    });
  }

  getReportBlank(report: string): void {
    this.siabService.fetchReportBlank(report).subscribe({
      next: response => {
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
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('error', 'No disponible', 'Reporte no disponible');
      },
    });
  }
}
