import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { IStateOfRepublic } from '../../../../core/models/catalogs/state-of-republic.model';
import { StateFormComponent } from '../state-form/state-form.component';
import { STATES_COLUMNS } from './states-columns';

@Component({
  selector: 'app-states-list',
  templateUrl: './states-list.component.html',
  styles: [],
})
export class StatesListComponent extends BasePage implements OnInit {
  states: IStateOfRepublic[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private stateService: StateOfRepublicService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = STATES_COLUMNS;
    this.settings.actions.delete = true;
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
            field = `filter.${filter.field}`;
            filter.field == 'id' ||
            filter.field == 'codeCondition' ||
            filter.field == 'descCondition' ||
            filter.field == 'zoneHourlyStd' ||
            filter.field == 'zoneHourlyVer' ||
            filter.field == 'userCreation' ||
            filter.field == 'userModification' ||
            filter.field == 'version'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getStates();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getStates());
  }

  getStates() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.stateService.getAll(params).subscribe({
      next: response => {
        this.states = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(state?: IStateOfRepublic) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      state,
      callback: (next: boolean) => {
        if (next) this.getStates();
      },
    };
    this.modalService.show(StateFormComponent, modalConfig);
  }

  showDeleteAlert(state: IStateOfRepublic) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(state.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string) {
    this.stateService.remove(id).subscribe({
      next: () => {
        this.getStates(), this.alert('success', 'Estados', 'Borrado');
      },
    });
  }
}
