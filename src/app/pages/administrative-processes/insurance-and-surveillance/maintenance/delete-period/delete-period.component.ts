import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-delete-period',
  templateUrl: './delete-period.component.html',
  styles: [],
})
export class DeletePeriodComponent extends BasePage {
  delegationField: string = '';
  get delegation() {
    return this.form.get('delegation');
  }
  form = new FormGroup({
    year: new FormControl(null, Validators.required),
    period: new FormControl(null, Validators.required),
    delegation: new FormControl(null, Validators.required),
    process: new FormControl(null, Validators.required),
  });

  public delegations = new DefaultSelect();
  // public procesess = new DefaultSelect();
  processes = [
    { id: 1, name: 'Supervisión' },
    { id: 2, name: 'Validación' },
  ];

  isLoading = false;
  delegationDefault: any = null;
  @Output() eventDelete = new EventEmitter();

  constructor(private survillanceService: SurvillanceService) {
    super();
  }

  onClickDeletePeriod() {
    if (!this.delegationDefault) {
      this.form.markAsTouched();
      this.alert('warning', 'Debe seleccionar una delegación', '');
    }
    this.form.value.delegation = this.delegationDefault.delegationNumber;
    this.eventDelete.emit(this.form.value);
  }

  getFormDeletePeriod() {
    return this.form;
  }
<<<<<<< HEAD
=======

  onClickDeletePeriod2() {
    console.log('SIII');
  }

  // DELEGACIONES //
  async getDelegation(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    params.addFilter('description', lparams.text, SearchFilter.ILIKE);

    return new Promise((resolve, reject) => {
      this.survillanceService
        .getViewVigDelegations(params.getParams())
        .subscribe({
          next: async (response: any) => {
            console.log('resss', response);
            let result = response.data.map(async (item: any) => {
              item['numberAndDescrip'] =
                item.delegationNumber + ' - ' + item.description;
            });

            Promise.all(result).then(async (resp: any) => {
              this.delegations = new DefaultSelect(
                response.data,
                response.count
              );
              this.loading = false;
            });
          },
          error: error => {
            this.delegations = new DefaultSelect();
            this.loading = false;
            resolve(null);
          },
        });
    });
  }

  changeDelegations(event: any) {
    this.delegationDefault = event;
  }

  cleanForm() {
    this.delegationDefault = null;
    this.form.reset();
  }
>>>>>>> 53f8457b23297af4c094d5e9ce9d3f84d08a27fb
}
