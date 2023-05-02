import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IPenalty } from 'src/app/core/models/catalogs/penalty.model';
import { PenaltyService } from 'src/app/core/services/catalogs/penalty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { PenaltyFormComponent } from '../penalty-form/penalty-form.component';
import { PENALTY_COLUMNS } from './penalty-columns';

@Component({
  selector: 'app-penalty-list',
  templateUrl: './penalty-list.component.html',
  styles: [],
})
export class PenaltyListComponent extends BasePage implements OnInit {
  paragraphs: IPenalty[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private penaltyService: PenaltyService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = PENALTY_COLUMNS;
    this.settings.actions.delete = false;
    this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
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
            /*SPECIFIC CASES*/
            field = `filter.${filter.field}`;
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getExample();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.penaltyService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count || 0;
        this.data.load(this.paragraphs);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(penalty?: IPenalty) {
    let config: ModalOptions = {
      initialState: {
        penalty,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(PenaltyFormComponent, config);
  }

  delete(penalty: IPenalty) {
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
