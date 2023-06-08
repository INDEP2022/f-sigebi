import { Component, OnInit } from '@angular/core';

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
import Swal from 'sweetalert2';
import { DelegationStateFormComponent } from '../delegation-state-form/delegation-state-form.component';
import { DELEGATION_STATE_COLUMNS } from './delegation-state-columns';
import { LocalDataSource } from 'ng2-smart-table';
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
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: false,
        position: 'right',
      },
    };
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'regionalDelegation':
                // searchFilter = '';
                field = `filter.${filter.field}.description`;
                break;
              case 'stateCode':
                searchFilter = SearchFilter.ILIKE;

                break;
              case 'keyState':
                searchFilter = SearchFilter.EQ;
                break;

              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          console.log(this.params);
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
    console.log(params);
    this.delegationStateService.getAll(params).subscribe({
      next: response => {
        console.log(response.data);
        this.delegationsState = response.data;
        console.log(this.delegationsState);
        this.data.load(this.delegationsState);
        this.data.refresh();
        console.log(this.data);
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
      },
    });
  }

  openForm(delegationSate?: IDelegationState) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      delegationSate,
      callback: (next: boolean) => {
        if (next) {
          this.params
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getData());
        }
      },
    };
    this.modalService.show(DelegationStateFormComponent, modalConfig);
  }

  showDeleteAlert(delegationSate: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      console.log(delegationSate.regionalDelegation.id);
      console.log(delegationSate);
      if (question.isConfirmed) {
        this.delete(
          delegationSate.regionalDelegation.id,
          delegationSate.stateCode.codeCondition
        );
        Swal.fire('Borrado', 'Delegacione Estado', 'success');
      }
    });
  }
  delete(regionalDelegation: number, id: string) {
    this.delegationStateService.newRemove(regionalDelegation, id).subscribe({
      next: () => {
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getData());
        this.alert('success', 'Delegacione Estado', 'Borrado');
      },
    });
  }
}
