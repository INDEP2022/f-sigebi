import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ITPenalty } from 'src/app/core/models/ms-parametercomer/penalty-type.model';
import { TPenaltyService } from '../../../../../core/services/ms-parametercomer/tpenalty.service';
import { PenaltyTypesFormComponent } from '../penalty-types-form/penalty-types-form.component';
import { PENALTY_TYPE_COLUMNS } from './penalty-types-columns';

@Component({
  selector: 'app-penalty-types-list',
  templateUrl: './penalty-types-list.component.html',
  styles: [],
})
export class PenaltyTypesListComponent extends BasePage implements OnInit {
  columns: ITPenalty[] = [];
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  columnFilters: any = [];

  constructor(
    private modalService: BsModalService,
    private tpenaltyService: TPenaltyService
  ) {
    super();
    this.settings.columns = PENALTY_TYPE_COLUMNS;
    this.settings.actions.delete = true;
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
            field = `filter.${filter.field}`;
            /*  SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              console.log(filter.search);
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

  getData(): void {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.tpenaltyService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.data.load(this.columns);
        this.totalItems = response.count || 0;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  openModal(context?: Partial<PenaltyTypesFormComponent>): void {
    const modalRef = this.modalService.show(PenaltyTypesFormComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

  openForm(penaltyType?: any): void {
    this.openModal({ penaltyType });
  }

  delete(penaltyType: ITPenalty): void {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.removePenalty(penaltyType.id);
      }
    });
  }

  removePenalty(id: number): void {
    this.tpenaltyService.remove(id).subscribe({
      next: data => {
        this.onLoadToast(
          'success',
          'Tipo Penalización',
          `Registro Eliminado Correctamente`
        );
        this.loading = false;
        this.getData();
      },
      error: error => {
        this.onLoadToast(
          'error',
          'Tipo Penalización',
          `Error al conectar con el servidor`
        );
        this.loading = false;
        console.log(error);
      },
    });
  }
}
