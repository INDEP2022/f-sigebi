import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';

import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';

import { IStateRepuve } from 'src/app/core/models/catalogs/state-repuve.model';
import { StateRepuveService } from 'src/app/core/services/catalogs/state-repuve.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { StateRepuvesFormComponent } from '../state-repuves-form/state-repuves-form.component';
import { STATEREPUVES_COLUMS } from './state-repuves-columns';

@Component({
  selector: 'app-state-repuves-list',
  templateUrl: './state-repuves-list.component.html',
  styles: [],
})
export class StateRepuvesListComponent extends BasePage implements OnInit {
  paragraphs: IStateRepuve[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private stateRepuveService: StateRepuveService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = STATEREPUVES_COLUMS;
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
            field = `filter.${filter.field}`;
            filter.field == 'key' ||
            filter.field == 'description' ||
            filter.field == 'procedure'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getDeductives();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDeductives());
  }

  getDeductives() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.stateRepuveService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(stateRepuve?: IStateRepuve) {
    let config: ModalOptions = {
      initialState: {
        stateRepuve,
        callback: (next: boolean) => {
          if (next) this.getDeductives();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(StateRepuvesFormComponent, config);
  }

  showDeleteAlert(stateRepuve: IStateRepuve) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(stateRepuve.key);
      }
    });
  }
  delete(id: number) {
    this.stateRepuveService.remove(id).subscribe({
      next: () => {
        this.getDeductives(),
          this.alert('success', 'Estado repuvese', 'Borrado Correctamente');
      },
    });
  }
}
