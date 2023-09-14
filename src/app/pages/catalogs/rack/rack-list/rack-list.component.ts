import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { RackService } from 'src/app/core/services/catalogs/rack.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IRack } from '../../../../core/models/catalogs/rack.model';
import { RackFormComponent } from '../rack-form/rack-form.component';
import { RACK_COLUMNS } from './rack-columns';

@Component({
  selector: 'app-rack-list',
  templateUrl: './rack-list.component.html',
  styles: [],
})
export class RackListComponent extends BasePage implements OnInit {
  racks: IRack[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();
  constructor(
    private rackService: RackService,
    private BsModalService: BsModalService
  ) {
    super();
    this.settings.columns = RACK_COLUMNS;
    this.settings.actions.delete = false;
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
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'warehouseDetails':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.description`;
                break;
              case 'batchDetails':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.description`;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'status':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            /*filter.field == 'id' ||
              filter.field == 'warehuseDetails' ||
              filter.field == 'batchDetails' ||
            filter.field == 'description' ||
            filter.field == 'status'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);*/
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
    this.rackService.getAllFilter(params).subscribe({
      next: response => {
        this.racks = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(rack?: IRack) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      rack,
      callback: (next: boolean) => {
        if (next) this.getExample();
      },
      class: 'modal-lg modal-dialog-centered',
    };
    this.BsModalService.show(RackFormComponent, modalConfig);
  }

  delete(rack?: IRack) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.remove(rack.id);
      }
    });
  }

  remove(id: number) {
    this.rackService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Estante', 'Borrado Correctamente');
        this.getExample();
      },
      error: error => {
        this.alert(
          'warning',
          'Estantes',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
