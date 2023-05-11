import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { SiabReportEndpoints } from 'src/app/common/constants/endpoints/siab-reports-endpoints';
import { IGood } from 'src/app/core/models/good/good.model';

/** SERVICE IMPORTS */
import { DatePipe } from '@angular/common';
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
    private goodServices?: GoodService,
    private siabService?: SiabService,
    private datePipe?: DatePipe
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
        endDate: [null, [Validators.required]],
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

    if (this.delegation.value)
      console.log('change delegacion', this.delegation.value);
    this.getSubDelegations({ page: 1, limit: 10, text: '' });
    this.getGoodIdDescription({ page: 1, limit: 10, text: '' });
    this.getGoodAlIdDescription({ page: 1, limit: 10, text: '' });
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
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2FSIGEBI%2FReportes%2FSIAB&reportUnit=%2FSIGEBI%2FReportes%2FSIAB%2FRGERJURRECDEREV&standAlone=true`; //window.URL.createObjectURL(blob);

    // Crea enlace de etiqueta anchor con js
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';

    let params = { ...this.form.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
      if (key === 'endDate' || key === 'startDate') {
        params[key] = this.datePipe.transform(params[key], 'dd-MM-yyyy');
      }
    }
    console.log('params', params);

    setTimeout(() => {
      this.siabService
        .getReport(SiabReportEndpoints.FGERJURRECDEREV, params)
        .subscribe({
          next: response => {
            console.log('response', response);
            window.open(pdfurl, 'DOCUMENT');
          },
          error: () => {
            console.log('error');

            window.open(pdfurl, 'DOCUMENT');
          },
        });
    }, 4000);
  }
}
