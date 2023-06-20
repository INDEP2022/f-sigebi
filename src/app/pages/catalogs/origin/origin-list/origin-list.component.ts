import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { OriginService } from 'src/app/core/services/catalogs/origin.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IOrigin } from '../../../../core/models/catalogs/origin.model';
import { OriginFormComponent } from '../origin-form/origin-form.component';
import { ORIGIN_COLUMNS } from './origin-columns';

@Component({
  selector: 'app-origin-list',
  templateUrl: './origin-list.component.html',
  styles: [],
})
export class OriginListComponent extends BasePage implements OnInit {
  origins: IOrigin[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private originService: OriginService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = ORIGIN_COLUMNS;
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
            filter.field == 'id' ||
            filter.field == 'idTransferer' ||
            filter.field == 'keyTransferer' ||
            filter.field == 'description' ||
            filter.field == 'type' ||
            filter.field == 'address' ||
            filter.field == 'idCity' ||
            filter.field == 'city' ||
            filter.field == 'keyEntityFederative'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
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
    this.originService.getAllFilter(params).subscribe({
      next: response => {
        if (response.count > 0) {
          this.origins = response.data;
          this.data.load(this.origins);
          this.data.refresh();
          this.totalItems = response.count;
          this.loading = false;
        } else {
          this.data.load([]);
          this.data.refresh();
          this.totalItems = 0;
          this.loading = false;
        }
      },
      error: error => (this.loading = false),
    });
  }

  openForm(origin?: IOrigin) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      origin,
      edit: !!origin,
      callback: (next: boolean) => {
        if (next) this.getExample();
      },
    };
    this.modalService.show(OriginFormComponent, modalConfig);
  }

  showDeleteAlert(origins?: IOrigin) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(origins.id);
      }
    });
  }

  delete(id: number) {
    this.originService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Procedencias', 'Borrado');
        this.getExample();
      },
      error: error => {
        this.alert(
          'warning',
          'Procedencias',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
