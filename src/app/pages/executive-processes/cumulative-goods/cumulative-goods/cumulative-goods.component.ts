import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
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
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { PrintFlyersService } from 'src/app/core/services/document-reception/print-flyers.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
export interface IReport {
  data: File;
}

@Component({
  selector: 'app-cumulative-goods',
  templateUrl: './cumulative-goods.component.html',
  styles: [],
})
export class CumulativeGoodsComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  select = new DefaultSelect();

  delegations = new DefaultSelect<IDelegation>();
  subdelegations = new DefaultSelect<ISubdelegation>();

  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  modeMonth: BsDatepickerViewMode = 'month'; // change for month:year
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  bsConfigToMonth: Partial<BsDatepickerConfig>;

  maxDateEnd = new Date();
  maxDateStart: Date;
  minDateEnd: Date;
  today: Date;

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
    private siabService: SiabService
  ) {
    super();

    this.today = new Date();
    /*this.maxDateStart = new Date(
      this.maxDateEnd.getFullYear(),
      this.maxDateEnd.getMonth(),
      this.maxDateEnd.getDate() - 0
    );
    this.minDateEnd = new Date(this.maxDateEnd.getFullYear() - 1, 0, 1);*/
  }

  ngOnInit(): void {
    this.prepareForm();
    this.bsConfigFromMonth = Object.assign(
      {},
      {
        minMode: this.modeMonth,
        dateInputFormat: 'MMMM',
      }
    );
    this.bsConfigToMonth = Object.assign(
      {},
      {
        minMode: this.modeMonth,
        dateInputFormat: 'MMMM',
      }
    );
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: [null],
      subdelegation: [null],
      rangeDate: [null, [Validators.required, maxDate(new Date())]],
      //toMonth: [null, [Validators.required, maxDate(new Date())]],
      //fromMonth: [null, [Validators.required, maxDate(new Date())]],
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
      params.addFilter('dsarea', lparams.text, SearchFilter.LIKE);
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

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }

  setMinDateEnd(date: Date) {
    if (date != undefined) this.minDateEnd = date;
  }

  cleanForm(): void {
    this.form.reset();
  }

  confirm(): void {
    //TODO: VALIDAR SI EL REPORTE SERÁ POR MES O RANGO DE FECHAS
    this.loading = true;

    const { rangeDate, delegation, subdelegation } = this.form.value;

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

    let reportParams: any = {
      pf_fecini: startTemp,
      pf_fecfin: endTemp,
    };

    if (delegation) {
      reportParams = {
        ...reportParams,
        pn_delegacion: delegation,
      };
    }

    if (subdelegation) {
      reportParams = {
        ...reportParams,
        pn_subdelegacion: subdelegation,
      };
    }

    console.log(reportParams);
    //Todo: Get Real Report
    this.getReport('RGERDIRCTRLXMES', reportParams);
    //this.getReportBlank('blank');
  }

  getReport(report: string, params: any): void {
    this.loading = true;
    this.siabService.fetchReport(report, params).subscribe({
      next: response => {
        this.loading = false;
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
