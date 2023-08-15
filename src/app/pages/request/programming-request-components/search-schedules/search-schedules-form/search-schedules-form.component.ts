import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { minDate } from 'src/app/common/validations/date.validators';
import { IRegionalDelegation } from 'src/app/core/models/catalogs/regional-delegation.model';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  GOODS_PROGRAMMING_COLUMNS,
  PROGRAMMING_COLUMNS,
  PROGRAMMING_DELEGATION_COLUMNS,
  PROGRAMMING_STATUS_DATE_COLUMNS,
} from './programming-columns';

@Component({
  selector: 'app-search-schedules-form',
  templateUrl: './search-schedules-form.component.html',
  styles: [],
})
export class SearchSchedulesFormComponent extends BasePage implements OnInit {
  performForm: FormGroup = new FormGroup({});
  performGoodForm: FormGroup = new FormGroup({});
  regionalsDelegations = new DefaultSelect<IRegionalDelegation>();
  delegationId: number = 0;
  delegation: string = '';
  programmings: LocalDataSource = new LocalDataSource();
  goods: LocalDataSource = new LocalDataSource();
  paramsProgramming = new BehaviorSubject<ListParams>(new ListParams());
  paramsGoods = new BehaviorSubject<ListParams>(new ListParams());
  totalItemProgramming: number = 0;
  totalItemGoods: number = 0;
  showDelegationSelect: boolean = false;
  loadingGoods: boolean = false;

  settingsGoods = {
    ...this.settings,
    actions: false,
    columns: {
      ...GOODS_PROGRAMMING_COLUMNS,
    },
  };
  constructor(
    private programmingService: ProgrammingRequestService,
    private regionalDelegationService: RegionalDelegationService,
    private fb: FormBuilder,
    private StateService: StateOfRepublicService,
    private transferentService: TransferenteService,
    private typeRelevantService: TypeRelevantService,
    private warehouseService: WarehouseService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        ...PROGRAMMING_COLUMNS,
        /*name: {
          title: 'Selección bienes',
          sort: false,
          position: 'left',
          type: 'custom',
          valuePrepareFunction: (user: any, row: any) =>
            this.isGoodSelected(row),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onGoodChange(instance),
        }, */
      },
    };
  }

  ngOnInit(): void {
    this.getRegionalDelegationSelect(new ListParams());
    this.prepareForm();
    this.prepareGoodForm();
  }

  prepareGoodForm() {
    this.performGoodForm = this.fb.group({
      goodId: [null],
      aptoCilcular: [null],
    });
  }

  prepareForm() {
    this.performForm = this.fb.group({
      regionalDelegationNumber: [null],
      status: [null],
      startDate: [null],
      endDate: [null],
    });
  }

  getRegionalDelegationSelect(params?: ListParams) {
    //Delegation regional user login //
    this.programmingService.getUserInfo().subscribe((data: any) => {
      this.regionalDelegationService
        .getById(data.department)
        .subscribe((delegation: IRegionalDelegation) => {
          this.delegationId = delegation.id;
          this.delegation = delegation.description;
          this.performForm
            .get('regionalDelegationNumber')
            .setValue(delegation.description);
          //this.regionalDelegationUser = delegation;
        });
    });

    if (params.text) {
      this.regionalDelegationService.search(params).subscribe(data => {
        this.regionalsDelegations = new DefaultSelect(data.data, data.count);
      });
    } else {
      this.regionalDelegationService.getAll(params).subscribe(data => {
        this.regionalsDelegations = new DefaultSelect(data.data, data.count);
      });
    }
  }

  searchProgramming() {
    if (
      this.performForm.get('endDate').value &&
      this.performForm.get('startDate').value &&
      !this.delegationId &&
      !this.performForm.get('status').value
    ) {
      this.paramsProgramming = new BehaviorSubject<ListParams>(
        new ListParams()
      );
      const startDate = moment(this.performForm.get('startDate').value).format(
        'YYYY-MM-DD'
      );
      const endDate = moment(this.performForm.get('endDate').value).format(
        'YYYY-MM-DD'
      );
      if (endDate && startDate) {
        this.paramsProgramming
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.infoProgrammingDate(startDate, endDate));
      }
    } else if (
      this.performForm.get('endDate').value &&
      this.performForm.get('startDate').value &&
      this.delegationId &&
      !this.performForm.get('status').value
    ) {
      this.paramsProgramming = new BehaviorSubject<ListParams>(
        new ListParams()
      );
      const startDate = moment(this.performForm.get('startDate').value).format(
        'YYYY-MM-DD'
      );
      const endDate = moment(this.performForm.get('endDate').value).format(
        'YYYY-MM-DD'
      );
      if (endDate && startDate && this.delegationId) {
        this.paramsProgramming
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() =>
            this.infoProgrammingDateDelegation(
              startDate,
              endDate,
              this.delegationId
            )
          );
      }
    } else if (
      this.performForm.get('endDate').value &&
      this.performForm.get('startDate').value &&
      this.delegationId &&
      this.performForm.get('status').value
    ) {
      this.paramsProgramming = new BehaviorSubject<ListParams>(
        new ListParams()
      );
      const startDate = moment(this.performForm.get('startDate').value).format(
        'YYYY-MM-DD'
      );
      const endDate = moment(this.performForm.get('endDate').value).format(
        'YYYY-MM-DD'
      );

      const status = this.performForm.get('status').value;
      if (endDate && startDate && this.delegationId && status) {
        this.paramsProgramming
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() =>
            this.infoProgrammingDateStatus(startDate, endDate, status)
          );
      }
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Es requerido seleccionar el rango de fechas'
      );
    }
  }

  infoProgrammingDate(startDate: string, endDate: string) {
    this.loading = true;
    const formData = {
      startDate: startDate,
      endDate: endDate,
    };

    this.programmingService
      .getProgrammingByDate(this.paramsProgramming.getValue(), formData)
      .subscribe({
        next: response => {
          this.settings = {
            ...this.settings,
            actions: false,
            columns: {
              ...PROGRAMMING_COLUMNS,
            },
          };
          this.programmings.load(response.data);
          this.totalItemProgramming = response.count;
          this.loading = false;
        },
        error: error => {
          this.loading = false;
        },
      });
  }

  infoProgrammingDateDelegation(
    startDate: string,
    endDate: string,
    delegation: number
  ) {
    this.loading = true;
    const formData = {
      startDate: startDate,
      endDate: endDate,
      regionalBranchNumber: delegation,
    };

    this.programmingService
      .getProgrammingByDelegation(this.paramsProgramming.getValue(), formData)
      .subscribe({
        next: response => {
          this.settings = {
            ...this.settings,
            actions: false,
            columns: {
              ...PROGRAMMING_DELEGATION_COLUMNS,
            },
          };

          this.programmings.load(response.data);
          this.totalItemProgramming = response.count;
          this.loading = false;
        },
        error: error => {
          this.loading = false;
        },
      });
  }

  infoProgrammingDateStatus(
    startDate: string,
    endDate: string,
    status: string
  ) {
    const formData = {
      startDate: startDate,
      endDate: endDate,
      status: status,
    };

    this.programmingService
      .getProgrammingByDateStatus(this.paramsProgramming.getValue(), formData)
      .subscribe({
        next: response => {
          this.settings = {
            ...this.settings,
            actions: false,
            columns: {
              ...PROGRAMMING_STATUS_DATE_COLUMNS,
            },
          };

          this.programmings.load(response.data);
          this.totalItemProgramming = response.count;
          this.loading = false;
        },
        error: error => {
          this.loading = false;
        },
      });
  }

  /*infoProgramming() {
    this.loading = true;
    this.paramsProgramming.getValue()['sortBy'] = 'id:ASC';
  
    this.programmingService
      .getProgramming(this.paramsProgramming.getValue())
      .subscribe({
        next: response => {
          const infoProgramming = response.data.map(async programming => {
            const showDelegation: any = await this.showDelegation(
              programming.regionalDelegationNumber
            );

            const showState: any = await this.showState(programming.stateKey);

            const showTransferent: any = await this.showTransferent(
              programming.tranferId
            );

            const typeRelevant: any = await this.showTypeRelevant(
              programming.typeRelevantId
            );

             const showWarehouse: any = await this.getWarehouse(
              programming.storeId
            ); 
            programming.regionalDelegationName = showDelegation;
            programming.stateKeyName = showState;
            programming.transferentName = showTransferent;
            programming.relevantTypeName = typeRelevant;
            //programming.warehouseName = showWarehouse;

            programming.startDate = moment(programming.startDate).format(
              'DD/MM/YYYY HH:mm:ss'
            );
            programming.endDate = moment(programming.endDate).format(
              'DD/MM/YYYY HH:mm:ss'
            );
            return programming;
          });

          Promise.all(infoProgramming).then(data => {
            this.programmings.load(data);
            this.totalItemProgramming = response.count;
            this.loading = false;
          });
        },
        error: error => {
          this.programmings = new LocalDataSource();
          this.totalItemProgramming = 0;
          this.loading = false;
        },
      });
  } */

  showDelegation(delegationId?: number) {
    return new Promise((resolve, reject) => {
      this.regionalDelegationService.getById(delegationId).subscribe({
        next: response => {
          resolve(response.description);
        },
        error: error => {},
      });
    });
  }

  showState(stateKey: number) {
    return new Promise((resolve, reject) => {
      this.StateService.getById(stateKey).subscribe({
        next: response => {
          resolve(response.descCondition);
        },
        error: error => {},
      });
    });
  }

  showTransferent(transferentId: number) {
    return new Promise((resolve, reject) => {
      this.transferentService.getById(transferentId).subscribe({
        next: response => {
          resolve(response.nameTransferent);
        },
        error: error => {},
      });
    });
  }

  showTypeRelevant(typeRelevantId: number) {
    return new Promise((resolve, reject) => {
      this.typeRelevantService.getById(typeRelevantId).subscribe({
        next: response => {
          resolve(response.description);
        },
        error: error => {},
      });
    });
  }

  getWarehouse(storeId: number) {
    return new Promise((resolve, reject) => {
      this.warehouseService.getById(storeId).subscribe({
        next: response => {
          resolve(response.description);
        },
        error: error => {},
      });
    });
  }

  regionalDelegationSelect(item?: IRegionalDelegation) {
    //this.regionalDelegationUser = item;
    this.delegationId = item?.id;
  }

  cleanForm() {
    this.performForm.reset();
    this.performForm.get('startDate').clearValidators();
    this.performForm.get('endDate').clearValidators();
    this.performForm.updateValueAndValidity();
    this.delegationId = null;
    this.performForm.markAllAsTouched();
    this.paramsProgramming = new BehaviorSubject<ListParams>(new ListParams());
  }

  searchGood() {
    const startDate = this.performForm.get('startDate').value;
    const endDate = this.performForm.get('endDate').value;
    const goodId = this.performGoodForm.get('goodId').value;
    const aptoCilcular = this.performGoodForm.get('aptoCilcular').value;
    if (startDate && endDate && !goodId && !aptoCilcular) {
      this.paramsGoods = new BehaviorSubject<ListParams>(new ListParams());
      this.paramsGoods
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.infoGoodProgramming(startDate, endDate));
    } else if (startDate && endDate && aptoCilcular && !goodId) {
      this.paramsGoods = new BehaviorSubject<ListParams>(new ListParams());
      this.paramsGoods
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() =>
          this.infoGoodProgrammingApt(startDate, endDate, aptoCilcular)
        );
    } else if (startDate && endDate && goodId) {
      this.paramsGoods = new BehaviorSubject<ListParams>(new ListParams());
      this.paramsGoods
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() =>
          this.infoGoodIdProgramming(startDate, endDate, goodId)
        );
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere la fecha de inicio y de fin'
      );
    }
  }

  infoGoodProgramming(startDate: string, endDate: string) {
    this.loadingGoods = true;
    const formData = {
      startDate: startDate,
      endDate: endDate,
    };

    this.programmingService
      .getGoodsProgrammingByDate(this.paramsGoods.getValue(), formData)
      .subscribe({
        next: response => {
          this.goods.load(response.data);
          this.totalItemGoods = response.count;
          this.loadingGoods = false;
        },
        error: error => {
          this.loadingGoods = false;
        },
      });
  }

  infoGoodIdProgramming(startDate: string, endDate: string, goodId: string) {
    this.loadingGoods = true;
    const formData = {
      startDate: startDate,
      endDate: endDate,
      goodId: goodId,
    };

    this.programmingService
      .getGoodsIdProgrammingByDate(this.paramsGoods.getValue(), formData)
      .subscribe({
        next: response => {
          this.goods.load(response.data);
          this.totalItemGoods = response.count;
          this.loadingGoods = false;
        },
        error: error => {
          this.loadingGoods = false;
        },
      });
  }

  infoGoodProgrammingApt(startDate: string, endDate: string, apto: string) {
    this.loadingGoods = true;
    const formData = {
      startDate: startDate,
      endDate: endDate,
      transfereeId: 571,
    };

    this.programmingService
      .getGoodApt(this.paramsGoods.getValue(), formData)
      .subscribe({
        next: response => {
          this.goods.load(response.data);
          this.totalItemGoods = response.count;
          this.loadingGoods = false;
        },
        error: error => {
          this.goods = new LocalDataSource();
          this.totalItemGoods = 0;
          this.loadingGoods = false;
        },
      });
  }

  cleanFormGood() {
    this.performGoodForm.reset();
    this.delegationId = null;
    this.paramsGoods = new BehaviorSubject<ListParams>(new ListParams());
  }

  checkValidateDate() {
    const startDate = moment(this.performForm.get('startDate').value).format(
      'YYYY-MM-DD'
    );
    const endDate = moment(this.performForm.get('endDate').value).format(
      'YYYY-MM-DD'
    );

    if (startDate >= endDate) {
      this.performForm
        .get('startDate')
        .addValidators([minDate(new Date(endDate))]);
      this.performForm
        .get('startDate')
        .setErrors({ minDate: { min: new Date(endDate) } });
      this.performForm.markAllAsTouched();
    }
  }

  checkValidateEndDate() {
    const startDate = moment(this.performForm.get('startDate').value).format(
      'YYYY-MM-DD'
    );
    const endDate = moment(this.performForm.get('endDate').value).format(
      'YYYY-MM-DD'
    );

    if (endDate <= startDate) {
      this.performForm
        .get('endDate')
        .addValidators([minDate(new Date(startDate))]);
      this.performForm
        .get('endDate')
        .setErrors({ minDate: { min: new Date(startDate) } });
      this.performForm.markAllAsTouched();
    }
  }
}
