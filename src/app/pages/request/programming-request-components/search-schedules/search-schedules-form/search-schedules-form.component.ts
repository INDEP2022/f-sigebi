import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRegionalDelegation } from 'src/app/core/models/catalogs/regional-delegation.model';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { PROGRAMMING_COLUMNS } from './programming-columns';

@Component({
  selector: 'app-search-schedules-form',
  templateUrl: './search-schedules-form.component.html',
  styles: [],
})
export class SearchSchedulesFormComponent extends BasePage implements OnInit {
  performForm: FormGroup = new FormGroup({});
  regionalsDelegations = new DefaultSelect<IRegionalDelegation>();
  delegationId: number = 0;
  delegation: string = '';
  programmings: LocalDataSource = new LocalDataSource();
  paramsProgramming = new BehaviorSubject<ListParams>(new ListParams());
  totalItemProgramming: number = 0;

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
  }

  prepareForm() {
    this.performForm = this.fb.group({
      regionalDelegationNumber: [null],
      programmingStatus: [null],
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
    this.paramsProgramming
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.infoProgramming());
  }

  infoProgramming() {
    console.log('this.delegationId', this.delegationId);
    this.paramsProgramming.getValue()['filter.regionalDelegationNumber'] =
      this.delegationId;
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

            /* const showWarehouse: any = await this.getWarehouse(
              programming.storeId
            ); */
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
            console.log('data', data);
            this.programmings.load(data);
            this.totalItemProgramming = response.count;
          });
        },
        error: error => {},
      });
  }

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

  regionalDelegationSelect(item: IRegionalDelegation) {
    //this.regionalDelegationUser = item;
    this.delegationId = item.id;
  }
}
