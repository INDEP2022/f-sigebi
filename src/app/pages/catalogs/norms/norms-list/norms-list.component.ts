import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGeneric } from 'src/app/core/models/catalogs/generic.model';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { BasePage } from 'src/app/core/shared/base-page';

import { NormsFormComponent } from '../norms-form/norms-form.component';
import { INorm } from './../../../../core/models/catalogs/norm.model';
import { NormService } from './../../../../core/services/catalogs/norm.service';
import { NORMS_COLUMNS } from './norms-columns';

@Component({
  selector: 'app-norms-list',
  templateUrl: './norms-list.component.html',
  styles: [],
})
export class NormsListComponent extends BasePage implements OnInit {
  columns: INorm[] = [];
  columns1: INorm[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  generic: IGeneric[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new ListParams();
  constructor(
    private normService: NormService,
    private modalService: BsModalService,
    private genericService: GenericService
  ) {
    super();
    this.settings.columns = NORMS_COLUMNS;
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
            filter.field == 'id'
              ? ((searchFilter = SearchFilter.EQ),
                (field = `filter.${filter.field}`))
              : ((searchFilter = SearchFilter.ILIKE),
                (field = `filter.${filter.field}`));
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
    this.normService.getAll(params).subscribe({
      next: response => {
        //TODO:Solicitar que se regrese un array vacio cuando no hay elementos
        if (typeof response.data !== 'undefined' && response.data.length > 0) {
          this.columns = response.data;
          this.totalItems = response.count || 0;
          this.getList();
        } else {
          this.loading = false;
        }
      },
      error: error => (this.loading = false),
    });
  }
  getList() {
    for (let i = 0; i < this.columns.length; i++) {
      this.params1['filter.name'] = 'Destino';
      this.params1['filter.keyId'] = this.columns[i].destination;
      this.genericService.getByFilter(this.params1).subscribe({
        next: response => {
          this.columns[i].name = response.data[0].description;
          if (i == this.columns.length - 1) {
            this.columns1 = this.columns;
            this.data.load(this.columns1);
            this.data.refresh();
            this.loading = false;
          }
        },
        error: error => (this.loading = false),
      });
    }
  }
  openModal(context?: Partial<NormsFormComponent>) {
    const modalRef = this.modalService.show(NormsFormComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) {
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getExample());
      }
    });
  }

  openForm(norm?: INorm) {
    this.openModal({ norm });
  }

  delete(batch: INorm) {
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
