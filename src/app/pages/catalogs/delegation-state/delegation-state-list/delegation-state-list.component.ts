import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDelegationState } from 'src/app/core/models/catalogs/delegation-state.model';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DelegationStateFormComponent } from '../delegation-state-form/delegation-state-form.component';
import { DELEGATION_STATE_COLUMNS } from './delegation-state-columns';

@Component({
  selector: 'app-delegation-state-list',
  templateUrl: './delegation-state-list.component.html',
  styles: [],
})
export class DelegationStateListComponent extends BasePage implements OnInit {
  delegationsState: IDelegationState[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private delegationStateService: DelegationStateService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = DELEGATION_STATE_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;

            filter.field == 'id' ||
            filter.field == 'regionalDelegation' ||
            filter.field == 'keyState' ||
            filter.field == 'status' ||
            filter.field == 'version'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            field = `filter.${filter.field}`;
            if (filter.search !== '') {
              if (filter.field == 'regionalDelegation') {
                filter.field = 'regionalDelegation.id';
              }
              if (filter.field == 'stateCode') {
                filter.field = 'stateCode.codeCondition';
              }

              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getData();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.delegationStateService.getAll(params).subscribe({
      next: response => {
        this.delegationsState = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(delegationSate?: IDelegationState) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      delegationSate,
      callback: (next: boolean) => {
        if (next) this.getData();
      },
    };
    this.modalService.show(DelegationStateFormComponent, modalConfig);
  }

  showDeleteAlert(delegationSate: IDelegationState) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
}
