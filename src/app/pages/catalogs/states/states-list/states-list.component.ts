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
  order: any = [];

  constructor(
    private stateService: StateOfRepublicService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = STATES_COLUMNS;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: true,
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

            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'codeCondition':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'descCondition':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'zoneHourlyStd':
                searchFilter = SearchFilter.EQ;
                break;
              case 'zoneHourlyVer':
                searchFilter = SearchFilter.EQ;
                break;
              case 'version':
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
          this.params = this.pageFilter(this.params);
          console.info(this.params);
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
        this.order = response.data;
        //console.log(this.order);
        this.totalItems = response.count || 0;
        //this.order.sort((a, b) => b - a);
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
      }
    });
  }

  delete(id: string) {
    this.stateService.remove(id).subscribe({
      next: () => {
        this.getStates(),
          this.alert('success', 'Estado', 'Borrado Correctamente');
      },
      error: error => {
        this.alert(
          'warning',
          'Estados',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
