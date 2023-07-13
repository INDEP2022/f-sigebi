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
  selector: 'app-change-period',
  templateUrl: './change-period.component.html',
  styles: [],
})
export class ChangePeriodComponent extends BasePage {
  form = new FormGroup({
    year: new FormControl(null, Validators.required),
    period: new FormControl(null, Validators.required),
    delegation: new FormControl(null),
    process: new FormControl(null, Validators.required),
    yearDestiny: new FormControl(null, Validators.required),
    periodDestiny: new FormControl(null, Validators.required),
    delegationDestiny: new FormControl(null, Validators.required),
    processDestiny: new FormControl(null, Validators.required),
  });
<<<<<<< HEAD
=======
  delegationDefault: any = null;
  processDefault: any = null;
  public delegations = new DefaultSelect();
  processes = [
    { value: 1, label: 'Supervisión' },
    { value: 2, label: 'Validación' },
  ];
  public procesess = new DefaultSelect(this.processes, 2);
  public procesess1 = new DefaultSelect(this.processes, 2);
>>>>>>> 53f8457b23297af4c094d5e9ce9d3f84d08a27fb

  // public delegations = new DefaultSelect();
  public procesess = new DefaultSelect();
  isLoading = false;
  @Output() eventChangePeriod = new EventEmitter();

  constructor(private survillanceService: SurvillanceService) {
    super();
  }

  // ngOnInit(): void {
  //   this.prepareForm();
  // }

  // prepareForm() {
  //   this.form = this.fb.group({
  //     year: [null, Validators.required],
  //     period: [null, Validators.required],
  //     delegation: [null, Validators.required],
  //     process: [null, Validators.required],
  //     yearDestiny: [null, Validators.required],
  //     periodDestiny: [null, Validators.required],
  //     delegationDestiny: [null, Validators.required],
  //     processDestiny: [null, Validators.required],
  //   });
  // }

  getFormChangePeriod() {
    return this.form;
  }

  changePeriod() {
<<<<<<< HEAD
    // console.log(this.form.value);
=======
    console.log(this.form.value);
    this.form.value.delegation = this.delegationDefault.delegationNumber;
    this.form.value.delegationDestiny = this.delegationDefault.delegationNumber;
    this.form.value.processDestiny = this.processDefault.value;
    console.log(this.form.value);
>>>>>>> 53f8457b23297af4c094d5e9ce9d3f84d08a27fb
    this.eventChangePeriod.emit(this.form.value);
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
    if (event) {
      this.form.get('delegationDestiny').setValue(event.numberAndDescrip);
    } else {
      this.form.get('delegationDestiny').setValue('');
    }
    this.delegationDefault = event;
  }

  changeProcess(event: any) {
    if (event) {
      this.form.get('processDestiny').setValue(event.label);
    } else {
      this.form.get('processDestiny').setValue('');
    }
    this.processDefault = event;
  }

  public getDelegations(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.banks = new DefaultSelect(data.data, data.count);
    // });
  }

  public getProcesess(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.banks = new DefaultSelect(data.data, data.count);
    // });
  }

  cleanForm() {
    this.delegationDefault = null;
    this.processDefault = null;
    this.form.reset();
  }
}
