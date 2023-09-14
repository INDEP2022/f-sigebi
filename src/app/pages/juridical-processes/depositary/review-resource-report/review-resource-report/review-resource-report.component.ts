import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
/** BASE IMPORT */
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { BehaviorSubject } from 'rxjs';
import { IGood } from 'src/app/core/models/good/good.model';

/** SERVICE IMPORTS */
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { dateRangeValidator } from 'src/app/common/validations/date.validators';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { PrintFlyersService } from 'src/app/core/services/document-reception/print-flyers.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-review-resource-report',
  templateUrl: './review-resource-report.component.html',
  styleUrls: ['./review-resource-report.component.scss'],
})
export class ReviewResourceReportComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  public form: FormGroup;

  delegations = new DefaultSelect<IDelegation>();
  subdelegations = new DefaultSelect<ISubdelegation>();
  params = new BehaviorSubject<ListParams>(new ListParams());
  goods = new DefaultSelect<IGood>();
  good = new DefaultSelect<IGood>();
  goodAl = new DefaultSelect<IGood>();

  phaseEdo: number;
  patchValue: boolean = false;
  dateMinEnd: Date = null;
  maxDate: Date = null;

  get startDate(): AbstractControl {
    return this.form.get('startDate');
  }
  get endDate(): AbstractControl {
    return this.form.get('endDate');
  }
  get delegation() {
    return this.form.get('delegation');
  }
  get subdelegation() {
    return this.form.get('subdelegation');
  }
  get delBien() {
    return this.form.get('delBien');
  }
  get alBien() {
    return this.form.get('alBien');
  }
  @Output() submit = new EventEmitter();
  constructor(
    private fb?: FormBuilder,
    private printFlyersService?: PrintFlyersService,
    private serviceDeleg?: DelegationService,
    private goodServices?: GoodService,
    private siabService?: SiabService,
    private datePipe?: DatePipe,
    private sanitizer?: DomSanitizer,
    private modalService?: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.maxDate = new Date();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group(
      {
        delegation: [null, [Validators.required]],
        subdelegation: [null, [Validators.required]],
        startDate: [null, [Validators.required]],
        endDate: [null, [Validators.required]],
        delBien: [null, [Validators.required]], // Del Bien Detalle
        alBien: [null, [Validators.required]], // Al Bien Detalle
      },
      { validator: dateRangeValidator() }
    );
    this.disableInit();
  }
  private disableInit() {
    this.form.get('subdelegation').disable();
    this.form.get('alBien').disable();
    this.form.get('endDate').disable();
  }
  getDelegations(params: ListParams) {
    this.serviceDeleg.getAll(params).subscribe(
      data => {
        this.delegations = new DefaultSelect(data.data, data.count);
      },
      err => {
        this.delegations = new DefaultSelect();
        this.loading = false;
      },
      () => {}
    );
  }

  onDelegationsChange(element: any) {
    if (element != undefined) {
      this.resetFields([this.delegation]);
      this.subdelegations = new DefaultSelect();
      this.good = new DefaultSelect();
      this.goodAl = new DefaultSelect();

      if (this.delegation.value) {
        this.form.get('subdelegation').enable();
        this.getSubDelegations({ page: 1, limit: 10, text: '' });
        this.getGoodIdDescription({ page: 1, limit: 10, text: '' });
        this.getGoodAlIdDescription({ page: 1, limit: 10, text: '' });
      }
    } else {
      this.form.get('subdelegation').disable();
      this.form.get('subdelegation').setValue(null);
    }
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
    this.printFlyersService.getSubdelegations(params.getParams()).subscribe({
      next: data => {
        this.subdelegations = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.subdelegations = new DefaultSelect();
      },
    });
  }

  onSubDelegationsChange(element: any) {
    this.resetFields([this.subdelegation]);
  }
  getGoodIdDescription(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (this.delegation.value) {
      params.addFilter('delegationNumber', this.delegation.value);
    }

    this.goodServices.getAll(params.getParams()).subscribe({
      next: data => {
        this.good = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.good = new DefaultSelect();
      },
    });
  }
  getGoodAlIdDescription(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;

    if (this.delegation.value) {
      params.addFilter('delegationNumber', this.delegation.value);
    }

    this.goodServices.getAll(params.getParams()).subscribe(data => {
      this.goodAl = new DefaultSelect(data.data, data.count);
    });
  }
  onGoodIdDescription(sssubtype: any) {
    if (sssubtype != undefined) {
      this.resetFields([this.delBien]);
      this.form.get('alBien').enable();
    } else {
      this.form.get('alBien').disable();
      this.form.get('alBien').setValue(null);
    }
  }

  onGoodAlIdDescription(sssubtype: any) {
    this.resetFields([this.alBien]);
  }

  onStartDateChange(sssubtype: any) {
    if (sssubtype != null) {
      this.form.get('endDate').setValue(null);
      this.form.get('endDate').enable();
      this.dateMinEnd = this.form.get('startDate').value;
      this.resetFields([this.alBien]);
    }
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }
  getEndDateErrorMessage(fin: any, ini: any) {
    const stard = new Date(ini.value).getTime();
    const end = new Date(fin.value).getTime();
    if (fin && ini) {
      return stard <= end
        ? null
        : 'La fecha de finalización debe ser mayor que la fecha de inicio.';
    }
    return '';
  }

  btnGenerarReporte() {
    this.submit.emit(this.form);
    let fechaInicio = this.datePipe.transform(
      this.form.controls['startDate'].value,
      'dd/MM/yyyy'
    );

    let fechaFin = this.datePipe.transform(
      this.form.controls['endDate'].value,
      'dd/MM/yyyy'
    );
    let params = {
      PN_BIENINI: this.form.controls['delBien'].value,
      PN_BIENFIN: this.form.controls['alBien'].value,
      PF_FECINI: fechaInicio,
      PF_FECFIN: fechaFin,
      PN_DELEG: this.form.controls['delegation'].value,
      PN_SUBDEL: this.form.controls['subdelegation'].value,
    };

    this.siabService
      //.fetchReport('RGERJURRECDEREV', params)
      .fetchReportBlank('blank')
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
        } else {
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

  cleanForm() {
    this.form.reset();
  }
}
