import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { FilterParams, ListParams, SearchFilter } from 'src/app/common/repository/interfaces/list-params';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { IGood } from 'src/app/core/models/good/good.model';
import { BehaviorSubject } from 'rxjs';

/** SERVICE IMPORTS */
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { PrintFlyersService } from 'src/app/core/services/document-reception/print-flyers.service';
import { dateRangeValidator } from 'src/app/common/validations/date.validators';
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
  constructor(
    private fb?: FormBuilder,
    private printFlyersService?: PrintFlyersService,
    private serviceDeleg?: DelegationService,
    private goodServices?: GoodService
    ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group(
      {
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required ]],
      delBien: [null], // Del Bien Detalle
      alBien: [null], // Al Bien Detalle
    },
    { validator: dateRangeValidator() }
    );
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
    this.good = new DefaultSelect();
    this.goodAl = new DefaultSelect();

    // console.log(this.PN_NODELEGACION.value);
    if (this.delegation.value)
    console.log('change delegacion' , this.delegation.value)
      this.getSubDelegations({ page: 1, limit: 10, text: '' });
      this.getGoodIdDescription({ page: 1, limit: 10, text: '' });
      this.getGoodAlIdDescription({ page: 1, limit: 10, text: '' });
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
    console.log('sub delegaciones ' , params.getParams());
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
    this.resetFields([this.delBien]);
  }
  onGoodAlIdDescription(sssubtype: any) {
    this.resetFields([this.alBien]);
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }
  getEndDateErrorMessage(fin:any,ini:any) {
    const stard = new Date(ini.value).getTime()
    const end = new Date(fin.value).getTime()
    if (fin && ini) {
      return stard <= end ? null : 'La fecha de finalización debe ser mayor que la fecha de inicio.';
    }
    return '';
  }

  onStartDateChange(event:any) {
  }

  onEndDateChange(event: any) {

  }
  btnGenerarReporte() {
    console.log('GenerarReporte' ,
     {
       dele: this.delegation.value ,
       endate: this.endDate.value ,
       start:this.startDate.value,
       subDe:this.subdelegation.value,
       del :this.delBien.value,
       al: this.alBien.value
      });
  }
}
