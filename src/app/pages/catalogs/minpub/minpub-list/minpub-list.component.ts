import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';

import {
  ListParams,
  SearchFilter,
} from '../../../../common/repository/interfaces/list-params';
import { IMinpub } from '../../../../core/models/catalogs/minpub.model';
import { MinPubService } from '../../../../core/services/catalogs/minpub.service';
import { MinpubFormComponent } from './../minpub-form/minpub-form.component';
import { MINIPUB_COLUMNS } from './minpub-columns';

@Component({
  selector: 'app-minpub-list',
  templateUrl: './minpub-list.component.html',
  styles: [],
})
export class MinpubListComponent extends BasePage implements OnInit {
  columns: IMinpub[] = [];
  data: LocalDataSource = new LocalDataSource();

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];

  constructor(
    private minpubService: MinPubService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = MINIPUB_COLUMNS;

    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        ...this.settings.actions,
        delete: true,
        add: false,
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
            /*SPECIFIC CASES*/
            filter.field == 'city'
              ? (field = `filter.${filter.field}.nameCity`)
              : (field = `filter.${filter.field}`);
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

    this.minpubService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count || 0;

        this.data.load(this.columns);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(minpub?: IMinpub) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      minpub,
      callback: (next: boolean) => {
        if (next) this.getExample();
      },
    };
    this.modalService.show(MinpubFormComponent, modalConfig);
  }

  //Msj de alerta para borrar minpub
  showDeleteAlert(batch: IMinpub) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea borrar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(batch.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  //método para borrar transferente
  delete(id: number) {
    this.minpubService.remove(id).subscribe({
      next: () => this.getExample(),
    });
  }
}
