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
  selector: 'app-annual-accumulated-assets',
  templateUrl: './annual-accumulated-assets.component.html',
  styles: [],
})
export class AnnualAccumulatedAssetsComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  select = new DefaultSelect();

  bsConfigToYear: Partial<BsDatepickerConfig>;
  bsConfigFromYear: Partial<BsDatepickerConfig>;

  maxDateEnd = new Date();
  maxDateStart: Date;
  minDateEnd: Date;

  delegations = new DefaultSelect<IDelegation>();
  subdelegations = new DefaultSelect<ISubdelegation>();

  mode: BsDatepickerViewMode = 'year'; // change for month:year

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
    this.maxDateStart = new Date(
      this.maxDateEnd.getFullYear(),
      this.maxDateEnd.getMonth(),
      this.maxDateEnd.getDate() - 0
    );
    this.minDateEnd = new Date(this.maxDateEnd.getFullYear() - 1, 0, 1);
  }

  ngOnInit(): void {
    this.prepareForm();
    this.bsConfigToYear = Object.assign(
      {},
      {
        minMode: this.mode,
        dateInputFormat: 'YYYY',
      }
    );
    this.bsConfigFromYear = Object.assign(
      {},
      {
        minMode: this.mode,
        dateInputFormat: 'YYYY',
      }
    );
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      fromYear: [null, [Validators.required]],
      toYear: [null, [Validators.required]],
    });
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
      () => {}
    );
  }

  onDelegationsChange(element: any) {
    this.resetFields([this.delegation]);
    this.subdelegations = new DefaultSelect();
    // console.log(this.PN_NODELEGACION.value);
    if (this.delegation.value)
      this.getSubDelegations({ page: 1, limit: 10, text: '' });
  }

  getSubDelegations(lparams: ListParams) {
    // console.log(lparams);
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
    this.siabService.fetchReportBlank('blank').subscribe({
      next: response => {
        console.log('información del blob', response);
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (response: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
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
}
